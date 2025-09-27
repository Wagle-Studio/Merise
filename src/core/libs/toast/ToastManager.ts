import type { RefObject } from "react";
import { v4 as uuidv4 } from "uuid";
import { CoreError, ErrorSeverityTypeEnum } from "@/core/libs/error";
import type { AddToastProps, Toast, ToastManagerInterface, ToastsDispatcher } from "./ToastTypes";
import { ToastType } from "./ToastTypes";

export default class ToastManager implements ToastManagerInterface {
  private static instance: ToastManager;
  private MAX_TOASTS = 3;
  private TOAST_DURATION = 4000;

  private constructor(
    private getToasts: () => Toast[],
    private setToasts: ToastsDispatcher,
    private timersRef: RefObject<Record<string, NodeJS.Timeout>>
  ) {}

  static getInstance = (
    getToasts: () => Toast[],
    setToasts: ToastsDispatcher,
    timersRef: RefObject<Record<string, NodeJS.Timeout>>
  ): ToastManager => {
    if (!this.instance) {
      this.instance = new ToastManager(getToasts, setToasts, timersRef);
    }

    return this.instance;
  };

  addToastSuccess = (message: string): void => {
    this.addToast({
      type: ToastType.SUCCESS,
      message,
    });
  };

  addToastInfo = (message: string): void => {
    this.addToast({
      type: ToastType.INFO,
      message,
    });
  };

  addToastWarning = (message: string): void => {
    this.addToast({
      type: ToastType.WARNING,
      message,
    });
  };

  addToastError = (message: string): void => {
    this.addToast({
      type: ToastType.ERROR,
      message,
    });
  };

  addToastSave = (message: string): void => {
    this.addToast({
      type: ToastType.SAVE,
      message,
    });
  };

  removeToastById = (id: string): void => {
    this.setToasts((prev) => prev.filter((toast) => toast.id !== id));

    if (this.timersRef.current[id]) {
      clearTimeout(this.timersRef.current[id]);
      delete this.timersRef.current[id];
    }
  };

  mapToastError = (error: CoreError): void => {
    switch (error.type) {
      case ErrorSeverityTypeEnum.INFO:
        this.addToastInfo(error.message);
        break;
      case ErrorSeverityTypeEnum.WARNING:
        this.addToastWarning(error.message);
        break;
      case ErrorSeverityTypeEnum.ERROR:
        this.addToastError(error.message);
        break;
      default:
        this.addToastError("Anomalie dans la gestion de l'erreur");
        break;
    }
  };

  private addToast = (props: AddToastProps): void => {
    const toast = {
      timestamp: Date.now(),
      id: uuidv4(),
      type: props.type,
      message: props.message,
    };

    this.setToasts([toast, ...this.getToasts()].slice(0, this.MAX_TOASTS));

    this.timersRef.current[toast.id] = setTimeout(() => {
      this.setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      delete this.timersRef.current[toast.id];
    }, this.TOAST_DURATION);
  };
}
