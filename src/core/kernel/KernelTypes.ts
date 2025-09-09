import type { ReactNode } from "react";
import type { CoreManagerInterface } from "@/core/CoreTypes";
import type { Dialog, DialogManagerInterface } from "@/core/libs/dialog";
import type { ErrorManagerInterface } from "@/core/libs/error";
import type { NavigatorManagerInterface } from "@/core/libs/navigator";
import type { NormalizeManagerInterface } from "@/core/libs/normalize";
import type { SaveDTOInterface, SaveManagerInterface } from "@/core/libs/save";
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
  navigator: NavigatorManagerInterface;
  normalize: NormalizeManagerInterface;
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
}

// Kernel operations contract provided by the provider factory
export interface KernelOperations {
  onEntityCreate: () => void; // TODO : move into Merise operations ?
  onAssociationCreate: () => void; // TODO : move into Merise operations ?
  navigateToHome: () => void;
  onSaveCreate: () => void;
  onSave: () => void;
  onSaveOpen: (saveId: string) => void;
  onSaveSelect: (saveId: string) => void;
  onSaveSelectCurrent: () => void;
  onSaveUpdate: (saveDTO: SaveDTOInterface) => void;
  onSaveUpdateCurrent: (saveDTO: SaveDTOInterface) => void;
  onSaveRemove: (saveId: string, saveName: string) => void;
  onSaveRemoveCurrent: () => void;
  onSettingsOpen: () => void;
  onSettingsUpdate: (settings: Settings) => void;
}
