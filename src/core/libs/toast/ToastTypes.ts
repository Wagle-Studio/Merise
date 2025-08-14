// List of all available toast types
export enum ToastType {
  SUCCESS = "SUCCESS",
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

// Base interface shared by all toast types
export interface Toast {
  readonly timestamp: number;
  readonly id: string;
  readonly type: ToastType;
  readonly message: string;
}

// Dispatcher type for updating the toasts state
export type ToastsDispatcher = React.Dispatch<React.SetStateAction<Toast[]>>;

// Props required by the addToast method in the manager
export interface AddToastProps {
  type: ToastType;
  message: string;
}

// Contract for the toast manager implementation
export interface ToastManagerInterface {
  addToast: (props: AddToastProps) => void;
  removeToastById: (id: string) => void;
}
