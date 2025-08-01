import { useKernelContext } from "@/core";
import { Toast } from "../toast/Toast";
import "./toastContainer.scss";

export const ToastContainer = () => {
  const { toasts } = useKernelContext();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
