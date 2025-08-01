import type { ReactNode } from "react";
import type { CoreManagerInterface } from "@/core/CoreTypes";
import type { Dialog, DialogManagerInterface } from "@/core/libs/dialog";
import type { ErrorManagerInterface } from "@/core/libs/error";
import type { Toast, ToastManagerInterface } from "@/core/libs/toast";
import type { FlowDTOInterface, FlowManagerInterface } from "@/libs/flow";
import type { MeriseDTOInterface, MeriseManagerInterface } from "@/libs/merise";

// Managers available in the Kernel context
export interface KernelManagers {
  dialog: DialogManagerInterface;
  toast: ToastManagerInterface;
  error: ErrorManagerInterface;
  flow: FlowManagerInterface;
  merise: MeriseManagerInterface;
  core: CoreManagerInterface;
}

// Props required to initialize the Kernel context
export interface KernelContextProps {
  children: ReactNode;
}

// Values exposed by the Kernel context
export interface KernelContext {
  dialogs: Dialog[];
  toasts: Toast[];
  flowDTO: FlowDTOInterface;
  meriseDTO: MeriseDTOInterface;
  managers: KernelManagers | null;
}

// Result returned by the Kernel initialization hook
export interface UseKernelInitializationResult {
  dialogs: Dialog[];
  toasts: Toast[];
  flowDTO: FlowDTOInterface;
  meriseDTO: MeriseDTOInterface;
  managers: KernelManagers | null;
}
