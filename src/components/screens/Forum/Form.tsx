import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import moment from "moment";

import {
  BASE_URL,
  sendHttpRequest,
  PINATA_URL,
} from "../../../services/network";

import Layout from "../../templates/layout";
import TextField from "../../templates/textField";
import FileUpload from "../../templates/fileUpload";
import useUserData from "../../../services/auth/useUserData";

const Index: React.FC = () => {
  const history: any = useHistory();
  const param: any = useParams();

  const { userData, setUserData } = useUserData();

  const [loading, setLoading] = useState<boolean>(false);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [documentHash, setDocumentHash] = useState<any>();
  const [message, setMessage] = useState<string>("");
  const [thread, setThread] = useState([]);
  const [showMessageError, setShowMessageError] = useState<boolean>(false);

  const scrollToBottom = () => {
    const threadElement: any = document.querySelector(".thread");
    threadElement.scrollTo(0, 10000);
  };

  useEffect(() => {
    getUpdatedThread();
  }, []);

  useEffect(() => {
    dynamicThreadTemplate();
    scrollToBottom();
  }, [thread]);

  useEffect(() => {
    setShowMessageError(false);
  }, [message]);

  const getUpdatedThread = async () => {
    try {
      let groupId = "";
      if (userData?.role === "STUDENT") {
        groupId = userData?.studentGroup?.id;
      } else {
        groupId = param?.id;
      }
      const res = await sendHttpRequest(
        "POST",
        BASE_URL + "/chatsByGroupId",
        null,
        JSON.stringify({
          groupId: groupId,
        })
      );
      if (res) {
        setThread(res.data.discussion);
        setLoading(false);
        const threadElement = document.querySelector(".thread");
        removeAllChildNodes(threadElement);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const removeAllChildNodes = (parent: any) => {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  };

  const handleSubmit = () => {
    if (!message) {
      setShowMessageError(true);
      return;
    }
    setLoading(true);
    sendHttpRequest(
      "POST",
      BASE_URL + "/createChat",
      null,
      JSON.stringify({
        userId: userData?.id,
        message: message,
        attachment: documentHash,
        groupId:
          userData?.role === "STUDENT" ? userData?.studentGroup?.id : param?.id,
      })
    )
      .then((res: any) => {
        setThread([]);
        getUpdatedThread();
        setLoading(false);
        window.location.reload();
      })
      .catch((err: any) => {
        setLoading(false);
        console.log(err);
      });
  };

  const uploadHandler = (event: any) => {
    setFileLoading(true);

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const pinataAPIKey = "4e61c50a79bb761c8687";
    const pinataSecretAPIKey =
      "25c37022e79769d5c07da039c6b01d50c944de0e7daf035b972bace4bde4b55f";

    const formData: any = new FormData();
    formData.append("file", event.files[0]);

    const headers = {
      "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      pinata_api_key: pinataAPIKey,
      pinata_secret_api_key: pinataSecretAPIKey,
    };

    sendHttpRequest("POST", url, null, formData, null, headers)
      .then((res: any) => {
        setDocumentHash(res.data.IpfsHash);
        setFileLoading(false);
      })
      .catch((err: any) => {
        setFileLoading(false);
        console.log(err);
      });
  };

  const dynamicThreadTemplate = () => {
    const threadElement = document.querySelector(".thread");

    if (thread?.length > 0) {
      thread.forEach((messageObj: any) => {
        const messageDivElement = document.createElement("div");
        const senderNameElement = document.createElement("b");
        const messageElement = document.createElement("p");
        const datetimeElement = document.createElement("p");
        const linkElement = document.createElement("a");

        if (messageObj?.attachment) {
          linkElement.setAttribute("target", "_blank");
          linkElement.setAttribute(
            "href",
            `${PINATA_URL}${messageObj?.attachment}`
          );
          linkElement.innerHTML = "attachment";
          linkElement.classList.add("text-blue-700", "underline");
        }

        datetimeElement.classList.add("text-xs");
        messageDivElement.classList.add(
          "bg-green-400",
          "rounded-md",
          "p-2",
          "text-right",
          "self-end"
        );

        if (messageObj?.userId !== userData?.id) {
          // creation of outgoing messages
          messageDivElement.classList.replace("bg-green-400", "bg-orange-300");
          messageDivElement.classList.replace("self-end", "self-start");
        }

        senderNameElement.innerHTML = messageObj?.userId;
        messageElement.innerHTML = messageObj?.message;
        datetimeElement.innerHTML = moment(messageObj?.createdDate).format(
          "DD/MM/YYYY hh:mm a"
        );

        messageDivElement.appendChild(senderNameElement);
        messageDivElement.appendChild(messageElement);
        messageObj?.attachment && messageDivElement.appendChild(linkElement);
        messageDivElement.appendChild(datetimeElement);
        threadElement?.appendChild(messageDivElement);
      });
    }
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="text-2xl font-semibold mb-5">New Discussion</div>

        <div className="thread h-96 bg-gray-200 flex flex-col gap-3 p-5 overflow-y-scroll"></div>

        <div className="flex flex-col mb-8">
          <TextField
            title="Message"
            type="text"
            value={message}
            textArea={true}
            containerClassNames="mt-5"
            onChangeHandler={(e) => setMessage(e.target.value)}
          />
          {showMessageError && (
            <p className="text-red-700">Please enter your message here</p>
          )}
          <FileUpload
            title="Attachment"
            containerClassNames="mt-5"
            uploadHandler={uploadHandler}
          />
        </div>
        <div className="flex justify-between">
          <Button
            label="Back"
            onClick={() => history.goBack()}
            className="p-button-secondary"
          />
          <Button
            label="Submit"
            onClick={() => handleSubmit()}
            loading={loading || fileLoading}
            className="p-button-info"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
