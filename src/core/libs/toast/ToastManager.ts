import type { RefObject } from "react";
import { v4 as uuidv4 } from "uuid";
import type { AddToastProps, Toast, ToastManagerInterface, ToastsDispatcher } from "./ToastTypes";

const MAX_TOASTS = 3;
const TOAST_DURATION = 4000;

export default class ToastManager implements ToastManagerInterface {
  constructor(
    private getToasts: () => Toast[],
    private setToasts: ToastsDispatcher,
    private timersRef: RefObject<Record<string, NodeJS.Timeout>>
  ) {}

  addToast = (props: AddToastProps): void => {
    const toast = this.createToast(props);

    this.setToasts([...this.getToasts(), toast].slice(0, MAX_TOASTS));

    this.timersRef.current[toast.id] = setTimeout(() => {
      this.setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      delete this.timersRef.current[toast.id];
    }, TOAST_DURATION);
  };

  removeToastById = (id: string): void => {
    this.setToasts((prev) => prev.filter((toast) => toast.id !== id));

    if (this.timersRef.current[id]) {
      clearTimeout(this.timersRef.current[id]);
      delete this.timersRef.current[id];
    }
  };

  private createToast = (props: AddToastProps): Toast => {
    return {
      timestamp: Date.now(),
      id: uuidv4(),
      type: props.type,
      message: props.message,
    };
  };
}
