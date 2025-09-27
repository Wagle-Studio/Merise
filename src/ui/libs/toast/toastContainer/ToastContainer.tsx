import { useKernelContext } from "@/core/kernel/KernelContext";
import { Toast } from "../toast/Toast";
import "./toastContainer.scss";

export const ToastContainer = () => {
  const { dependencies } = useKernelContext();

  const toasts = dependencies.getCurrentToasts();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={`toast-${toast.id}`} toast={toast} />
      ))}
    </div>
  );
};
