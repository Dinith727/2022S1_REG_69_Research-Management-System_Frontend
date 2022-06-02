import React from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

interface Props {
  title?: string;
  type?: any;
  value?: any;
  textArea?: boolean;
  disabled?: boolean;
  containerClassNames?: any;
  onChangeHandler?: (input: any) => void;
}

const Index: React.FC<Props> = ({
  title,
  type = "text",
  value,
  textArea = false,
  containerClassNames = "",
  disabled = false,
  onChangeHandler,
}) => {
  return (
    <div className={`flex flex-col items-start ${containerClassNames}`}>
      <div className={`font-medium text-sm flex-shrink-0 mb-1`}>{title}</div>
      <div className="relative w-full">
        {!textArea ? (
          <InputText
            type={type}
            value={value}
            disabled={disabled}
            onChange={onChangeHandler}
            className="w-full h-full"
          />
        ) : (
          <InputTextarea
            rows={2}
            cols={30}
            value={value}
            disabled={disabled}
            onChange={onChangeHandler}
            autoResize
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  );
};

export default Index;
