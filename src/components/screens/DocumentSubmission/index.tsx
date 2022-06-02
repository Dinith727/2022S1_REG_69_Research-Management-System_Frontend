import React, { useEffect, useState } from "react";

import { Button } from "primereact/button";

import {
  BASE_URL,
  PINATA_URL,
  sendHttpRequest,
} from "../../../services/network";
import useUserData from "../../../services/auth/useUserData";

import Layout from "../../templates/layout";
import FileUpload from "../../templates/fileUpload";

const Index: React.FC = () => {
  const { userData, setUserData } = useUserData();

  const [loading, setLoading] = useState<boolean>(false);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [template, setTemplate] = useState<any>();
  const [documentHash, setDocumentHash] = useState();

  useEffect(() => {
    fetchTemplate();
  }, []);

  const fetchTemplate = () => {
    sendHttpRequest("GET", BASE_URL + "/templates").then((res: any) => {
      setTemplate(res?.data[0]);
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    sendHttpRequest(
      "POST",
      BASE_URL + "/createSubmission",
      null,
      JSON.stringify({
        fileHash: documentHash,
        studentGroupId: userData.studentGroup.id,
      })
    )
      .then((res: any) => {
        setTimeout(async () => {
          const loginRes = await sendHttpRequest(
            "POST",
            BASE_URL + "/login",
            null,
            JSON.stringify({
              email: userData.email,
              password: userData.password,
            })
          );

          setUserData(loginRes.data);
          setLoading(false);
        }, 3000);
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

  return (
    <Layout>
      <div className="w-full">
        <div className="text-2xl font-semibold mb-5">Document Submission</div>
        {!userData?.studentGroup.submission && template !== undefined && (
          <div className="flex items-center justify-end gap-x-10">
            <div className="text-lg">{template?.fileName}</div>
            <Button
              label="Download"
              onClick={(e) => {
                e.preventDefault();
                window.open(`${PINATA_URL}${template?.fileHash}`);
              }}
              className="p-button-warning"
            />
          </div>
        )}
        <div className="mt-8 mb-5">
          <div className="flex my-3">
            <span className="w-52">
              <b>Submission Status:</b>
            </span>
            <span>
              {userData?.studentGroup.submission ? "Submitted" : "No Attempt"}
            </span>
          </div>
          <div className="flex my-3">
            <span className="w-52">
              <b>Due date:</b>
            </span>
            <span>31/05/2022</span>
          </div>
          {userData?.studentGroup?.submission && (
            <div className="flex my-3">
              <span className="w-52">
                <b>Sudmitted file:</b>
              </span>
              <a
                target="_blank"
                className="text-blue-700 underline"
                href={`${PINATA_URL}${userData?.studentGroup?.submission?.fileHash}`}
              >
                View submission
              </a>
            </div>
          )}
        </div>
        {!userData?.studentGroup.submission && (
          <div className="flex flex-col mb-8">
            <FileUpload
              title="Attachment"
              containerClassNames="mt-5"
              uploadHandler={uploadHandler}
            />
          </div>
        )}

        {!userData?.studentGroup.submission && (
          <div className="flex justify-end">
            <Button
              label="Add Submission"
              onClick={() => handleSubmit()}
              loading={loading || fileLoading}
              className="p-button-info"
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
