import React from "react";
import { FileUpload } from "primereact/fileupload";

interface Props {
  title?: string;
  containerClassNames?: any;
  uploadHandler?: (input: any) => void;
}

const Index: React.FC<Props> = ({
  title,
  containerClassNames = "",
  uploadHandler,
}) => {
  return (
    <div className={`flex flex-col items-start ${containerClassNames}`}>
      <div className={`font-medium text-sm flex-shrink-0 mb-1`}>{title}</div>
      <div className="relative w-full">
        <FileUpload
          name="Discussion Attachment"
          customUpload
          uploadHandler={uploadHandler}
        />
      </div>
    </div>
  );
};

export default Index;
