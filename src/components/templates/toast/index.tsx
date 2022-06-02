import React, {
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import { Toast } from "primereact/toast";

interface Props {
  ref: any;
}

export interface IToast {
  (
    severity: "success" | "info" | "warn" | "error",
    title: string,
    message: string,
    life?: number
  ): void;
}

const Index: React.FC<Props> = forwardRef((props, ref) => {
  const toast: any = useRef(null);
  useImperativeHandle(ref, () => ({
    showToast({ severity, title, message, life = 3000 }: any) {
      toast.current.show({
        severity: severity,
        summary: title,
        detail: message,
        life: life,
      });
    },
  }));

  return <Toast ref={toast} />;
});

export default Index;
