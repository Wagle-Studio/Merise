import { type ToastManagerInterface, ToastTypeEnum } from "@/core/libs/toast";
import type ErrorDTO from "./ErrorDTO";
import type { ErrorManagerInterface } from "./ErrorTypes";

export default class ErrorManager implements ErrorManagerInterface {
  constructor(private toastManager: ToastManagerInterface) {}

  handleError = (error: ErrorDTO): void => {
    switch (error.type) {
      case "INFO":
        this.toastManager.addToast({ type: ToastTypeEnum.INFO, message: error.message });
        break;
      case "WARNING":
        this.toastManager.addToast({ type: ToastTypeEnum.WARNING, message: error.message });
        break;
      case "ERROR":
        this.toastManager.addToast({ type: ToastTypeEnum.ERROR, message: error.message });
        break;
      default:
        this.toastManager.addToast({ type: ToastTypeEnum.INFO, message: "Erreur inattendue" });
        break;
    }
  };
}
