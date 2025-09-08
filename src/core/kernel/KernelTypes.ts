import type { ReactNode } from "react";
import type { CoreManagerInterface, CoreResult } from "@/core/CoreTypes";
import type { Dialog, DialogManagerInterface } from "@/core/libs/dialog";
import type { ErrorManagerInterface } from "@/core/libs/error";
import type { Save, SaveDTOInterface, SaveManagerInterface, SaveRawDTOObject } from "@/core/libs/save";
import type { Settings, SettingsDTOInterface, SettingsManager } from "@/core/libs/settings";
import type { Toast, ToastManagerInterface } from "@/core/libs/toast";
import type { FlowDTOInterface, FlowManagerInterface } from "@/libs/flow";
import type { MeriseDTOInterface, MeriseManagerInterface } from "@/libs/merise";

// Managers available in the Kernel context
export interface KernelManagers {
  settings: SettingsManager;
  dialog: DialogManagerInterface;
  toast: ToastManagerInterface;
  error: ErrorManagerInterface;
  save: SaveManagerInterface;
  flow: FlowManagerInterface;
  merise: MeriseManagerInterface;
  core: CoreManagerInterface;
}

// Props required to initialize the Kernel context
export interface KernelContextProps {
  children: ReactNode;
}

// Result returned by the Kernel initialization hook
export interface UseKernelInitializationResult {
  save: SaveDTOInterface | null;
  settingsDTO: SettingsDTOInterface;
  dialogs: Dialog[];
  toasts: Toast[];
  flowDTO: FlowDTOInterface;
  meriseDTO: MeriseDTOInterface;
  managers: KernelManagers;
}

// Values exposed by the Kernel context
export interface KernelContext {
  save: SaveDTOInterface | null;
  settingsDTO: SettingsDTOInterface;
  dialogs: Dialog[];
  toasts: Toast[];
  flowDTO: FlowDTOInterface;
  meriseDTO: MeriseDTOInterface;
  managers: KernelManagers;
  operations: KernelOperations;
  dependencies: KernelDependencies;
}

// Kernel operations contract provided by the provider factory
export interface KernelOperations {
  onEntityCreate: () => void;
  onAssociationCreate: () => void;
  onSaveCreate: () => void;
  onSave: () => void;
  onSaveOpen: (saveId: string) => void;
  onSaveSelect: () => void;
  onSaveUpdate: (save: Save) => void;
  onSaveRemove: (saveId: string) => void;
  onSettingsOpen: () => void;
  onSettingsUpdate: (settings: Settings) => void;
}

// Kernel dependencies contract provided by the provider factory
export interface KernelDependencies {
  findLocalSaves: () => CoreResult<SaveRawDTOObject[], null>;
}
