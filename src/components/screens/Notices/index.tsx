import React, { useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import moment from "moment";
import useUserData from "../../../services/auth/useUserData";

import {
  BASE_URL,
  sendHttpRequest,
  PINATA_URL,
} from "../../../services/network";

import Layout from "../../templates/layout";
import { Button } from "primereact/button";
import TextField from "../../templates/textField";
import { Dialog } from "primereact/dialog";
import FileUpload from "../../templates/fileUpload";

const Index: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [notices, setNotices] = useState<any>();
  const { userData, setUserData } = useUserData();
  const [message, setMessage] = useState<string>("");
  const [documentHash, setDocumentHash] = useState<any>();
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [showMessageError, setShowMessageError] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setMessage("");
    setShowMessageError(false);
  }, [showEditModal]);

  useEffect(() => {
    setShowMessageError(false);
  }, [message]);

  const loadData = () => {
    setLoading(true);
    sendHttpRequest("GET", BASE_URL + "/notices")
      .then((res: any) => {
        setNotices(res.data);
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
        console.log(err);
      });
  };

  const generatorNoticeElement = notices?.map((col: any) => {
    return (
      <Card key={col?._id}>
        <div className="text-right">
          <span className="text-xs">
            Published by:
            <b className="text-xs">{" " + col?.userRole}</b>
          </span>
        </div>

        <div className="text-xs font-bold">
          {moment(col?.createdDate).format("DD/MM/YYYY hh:mm a")}
        </div>
        <div className="text-md pt-2">{col?.message}</div>
        {col?.attachment && (
          <div className=" text-right pt-5">
            <a
              className="text-blue-700 underline text-xs"
              target="_blank"
              href={`${PINATA_URL}${col?.attachment}`}
            >
              Download your attachment here
            </a>
          </div>
        )}
      </Card>
    );
  });

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

  const handleSubmit = () => {
    if (!message) {
      setShowMessageError(true);
      return;
    }
    setLoading(true);
    sendHttpRequest(
      "POST",
      BASE_URL + "/createNotice",
      null,
      JSON.stringify({
        userRole: userData?.role,
        message: message,
        attachment: documentHash,
      })
    )
      .then((res: any) => {
        setLoading(false);
        setShowEditModal(false);
        setMessage("");
        loadData();
      })
      .catch((err: any) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between mb-8">
          <div className="text-2xl font-semibold">Notices</div>
          {userData?.role !== "STUDENT" && (
            <Button
              label="Create notice"
              onClick={() => setShowEditModal(true)}
              className="p-button-warning "
            />
          )}
        </div>
        {notices?.length > 0 ? (
          <div className="grid gap-y-5">{generatorNoticeElement}</div>
        ) : (
          <div> No Notices Found</div>
        )}

        <Dialog
          header="Create Notice"
          visible={showEditModal}
          style={{ width: "65%" }}
          onHide={() => setShowEditModal(false)}
        >
          <div className="p-8 rounded-md ">
            <div>
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
            <div className="flex justify-end mt-5">
              <Button
                label="Update"
                onClick={() => handleSubmit()}
                loading={loading || fileLoading}
              />
            </div>
          </div>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Index;
