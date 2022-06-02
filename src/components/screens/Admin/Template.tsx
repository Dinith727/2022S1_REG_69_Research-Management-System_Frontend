import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";

import {
  BASE_URL,
  PINATA_URL,
  sendHttpRequest,
} from "../../../services/network";

import Layout from "../../templates/layout";
import FileUpload from "../../templates/fileUpload";

const Index: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fileLoading, setFileLoading] = useState<boolean>(false);

  const [document, setDocument] = useState<any>(undefined);
  const [selectedDocument, setSelectedDocument] = useState<any>();
  const [documentHash, setDocumentHash] = useState();

  useEffect(() => {
    fetchTemplate();
  }, []);

  const fetchTemplate = () => {
    sendHttpRequest("GET", BASE_URL + "/templates").then((res: any) => {
      setDocument(res?.data[0]);
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    sendHttpRequest(
      "POST",
      BASE_URL + "/createTemplate",
      null,
      JSON.stringify({
        fileName: selectedDocument?.name,
        fileHash: documentHash,
      })
    )
      .then((res: any) => {
        setTimeout(() => {
          fetchTemplate();
          setLoading(false);
        }, 3000);
      })
      .catch((err: any) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleDeleteFile = () => {
    setLoading(true);
    sendHttpRequest(
      "POST",
      BASE_URL + "/deleteTemplate",
      null,
      JSON.stringify({
        id: document?.id,
      })
    ).then((res: any) => {
      setTimeout(() => {
        fetchTemplate();
        setLoading(false);
      }, 3000);
    });
  };

  const uploadHandler = (event: any) => {
    setFileLoading(true);
    setSelectedDocument(event.files[0]);

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
        <div className="text-2xl font-semibold mb-5">Manage Template</div>
        {document !== undefined && (
          <div className="flex items-center gap-x-10">
            <div className="text-lg">{document?.fileName}</div>
            <div className="flex items-center gap-x-5">
              <Button
                label="Download"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(`${PINATA_URL}${document?.fileHash}`);
                }}
                className="p-button-warning"
              />
              <Button
                label="Delete"
                loading={loading}
                onClick={() => handleDeleteFile()}
                className="p-button-danger"
              />
            </div>
          </div>
        )}
        {document === undefined && (
          <div>
            <div className="flex flex-col mb-8">
              <FileUpload
                title="Attachment"
                containerClassNames="mt-5"
                uploadHandler={uploadHandler}
              />
            </div>
            <div className="flex justify-end">
              <Button
                label="Upload Template"
                onClick={() => handleSubmit()}
                loading={loading || fileLoading}
                className="p-button-info"
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
