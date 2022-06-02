import React from "react";
import { Dropdown } from "primereact/dropdown";

interface Props {
  title?: string;
  value?: any;
  options: any;
  containerClassNames?: any;
  onChangeHandler?: (input: any) => void;
  disabled?: boolean;
}

const Index: React.FC<Props> = ({
  title,
  value,
  options,
  containerClassNames = "",
  onChangeHandler,
  disabled = false,
}) => {
  return (
    <div className={`flex flex-col items-start ${containerClassNames}`}>
      <div className={`font-medium text-sm flex-shrink-0 mb-1`}>{title}</div>
      <div className="relative w-full">
        <Dropdown
          disabled={disabled}
          value={value}
          options={options}
          onChange={onChangeHandler}
          placeholder="Select.."
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default Index;
