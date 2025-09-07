import type { ReactNode } from "react";
import type { CoreManagerInterface } from "@/core/CoreTypes";
import type { Dialog, DialogManagerInterface } from "@/core/libs/dialog";
import type { ErrorManagerInterface } from "@/core/libs/error";
import type { SaverDTOInterface, SaverManagerInterface, SaverStoreItem } from "@/core/libs/saver";
import type { Settings, SettingsDTOInterface, SettingsManager } from "@/core/libs/settings";
import type { Toast, ToastManagerInterface } from "@/core/libs/toast";
import type { FlowDTOInterface, FlowManagerInterface } from "@/libs/flow";
import type { MeriseDTOInterface, MeriseManagerInterface } from "@/libs/merise";

// List of all available seed types
export enum KernelSeedType {
  NEW = "NEW",
  SAVE_LOCAL = "SAVE_LOCAL",
}

// Interface for a seed from which a save will be initialized
export interface KernelSeed {
  id: string;
  name: string;
  type: KernelSeedType;
  created: Date;
  updated: Date;
}

// Managers available in the Kernel context
export interface KernelManagers {
  settings: SettingsManager;
  dialog: DialogManagerInterface;
  toast: ToastManagerInterface;
  error: ErrorManagerInterface;
  saver: SaverManagerInterface;
  flow: FlowManagerInterface;
  merise: MeriseManagerInterface;
  core: CoreManagerInterface;
}

// Props required to initialize the Kernel context
export interface KernelContextProps {
  children: ReactNode;
  seed: KernelSeed;
}

// Result returned by the Kernel initialization hook
export interface UseKernelInitializationResult {
  save: SaverDTOInterface;
  settings: SettingsDTOInterface;
  dialogs: Dialog[];
  toasts: Toast[];
  flowDTO: FlowDTOInterface;
  meriseDTO: MeriseDTOInterface;
  managers: KernelManagers;
}

// Values exposed by the Kernel context
export interface KernelContext {
  save: SaverDTOInterface;
  settings: SettingsDTOInterface;
  dialogs: Dialog[];
  toasts: Toast[];
  flowDTO: FlowDTOInterface;
  meriseDTO: MeriseDTOInterface;
  managers: KernelManagers;
  operations: KernelOperations;
}

// Kernel operations contract provided by the provider factory
export interface KernelOperations {
  onEntityCreate: () => void;
  onAssociationCreate: () => void;
  onSave: () => void;
  onSaveOpen: () => void;
  onSaveUpdate: (save: SaverStoreItem) => void;
  onSettingsOpen: () => void;
  onSettingsUpdate: (settings: Settings) => void;
}
