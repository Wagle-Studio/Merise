import type { ReactNode } from "react";
import type { DialogManagerInterface } from "@/core/libs/dialog";
import type { ErrorFailResultType, ErrorManagerInterface } from "@/core/libs/error";
import type { NavigatorManagerInterface } from "@/core/libs/navigator";
import type { NormalizeManagerInterface } from "@/core/libs/normalize";
import type { SaveDTOInterface, SaveManagerInterface } from "@/core/libs/save";
import type { Settings, SettingsManagerInterface } from "@/core/libs/settings";
import type { ToastManagerInterface } from "@/core/libs/toast";
import type { FlowDTOInterface } from "@/libs/flow";
import type { MeriseDTOInterface } from "@/libs/merise";

// List of all available Kernel error types
export enum SeverityType {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

// Represents a successful Kernel operation
export type KernelResultSuccess<T> = {
  success: true;
  data: T;
};

// Represents a failed Kernel operation
export type KernelResultFail<E> = {
  success: false;
  message: string;
  severity: SeverityType;
  error?: E;
};

// Union type representing the result of a Kernel operation
export type KernelResult<T, E> = KernelResultSuccess<T> | KernelResultFail<E>;

// Managers available in the Kernel context
export interface KernelManagers {
  dialog: DialogManagerInterface;
  error: ErrorManagerInterface;
  navigator: NavigatorManagerInterface;
  normalize: NormalizeManagerInterface;
  save: SaveManagerInterface;
  settings: SettingsManagerInterface;
  toast: ToastManagerInterface;
}

// Managers map
export type KernelManagerMap = {
  dialog: DialogManagerInterface;
  error: ErrorManagerInterface;
  navigator: NavigatorManagerInterface;
  normalize: NormalizeManagerInterface;
  save: SaveManagerInterface;
  settings: SettingsManagerInterface;
  toast: ToastManagerInterface;
};

// Result returned by the Kernel initialization hook
export interface UseKernelInitResult {
  kernel: KernelManagerInterface;
}

// Props required to initialize the Kernel context
export interface KernelContextProps {
  children: ReactNode;
}

// Values exposed by the Kernel context
export interface KernelContext {
  operations: KernelOperations;
  dependencies: KernelDependencies;
}

// Contract for the Kernel manager implementation
export interface KernelManagerInterface {
  getManager<K extends keyof KernelManagerMap>(name: K): KernelManagerMap[K];
  initDemo: () => void;
  handleCloseDomain: () => void;
  handleSaveCreate: () => void;
  handleSaveOpen: (id: string) => void;
  handleSaveUpdate: (save: SaveDTOInterface) => void;
  handleSaveCurrent: (flow: FlowDTOInterface, merise: MeriseDTOInterface) => boolean;
  handleSettingsUpdate: (settings: Settings) => void;
  handleDialogSaveEdit: (id: string) => void;
  handleDialogSaveEditCurrent: () => void;
  handleDialogSaveRemove: (id: string) => void;
  handleDialogSaveRemoveCurrent: () => void;
  handleDialogSettingsEdit: () => void;
  handleError: (resultFail: ErrorFailResultType) => void;
  doesSaveHasUnsavedChanges: (flow: FlowDTOInterface, merise: MeriseDTOInterface) => KernelResult<boolean, null>;
}

// Kernel operations contract provided by the provider factory
export interface KernelOperations {
  initDemo: KernelManagerInterface["initDemo"];
  handleCloseDomain: KernelManagerInterface["handleCloseDomain"];
  handleSaveCreate: KernelManagerInterface["handleSaveCreate"];
  handleSaveOpen: KernelManagerInterface["handleSaveOpen"];
  handleSaveUpdate: KernelManagerInterface["handleSaveUpdate"];
  handleSaveCurrent: KernelManagerInterface["handleSaveCurrent"];
  handleSettingsUpdate: KernelManagerInterface["handleSettingsUpdate"];
  handleDialogSaveEdit: KernelManagerInterface["handleDialogSaveEdit"];
  handleDialogSaveEditCurrent: KernelManagerInterface["handleDialogSaveEditCurrent"];
  handleDialogSaveRemove: KernelManagerInterface["handleDialogSaveRemove"];
  handleDialogSaveRemoveCurrent: KernelManagerInterface["handleDialogSaveRemoveCurrent"];
  handleDialogSettingsEdit: KernelManagerInterface["handleDialogSettingsEdit"];
  handleError: KernelManagerInterface["handleError"];
  doesSaveHasUnsavedChanges: KernelManagerInterface["doesSaveHasUnsavedChanges"];
}

// Kernel dependencies contract provided by the provider factory
export interface KernelDependencies {
  addToastSuccess: ToastManagerInterface["addToastSuccess"];
  addToastSave: ToastManagerInterface["addToastSave"];
  addDialogConfirm: DialogManagerInterface["addDialogConfirm"];
  addDialogEntity: DialogManagerInterface["addDialogEntity"];
  addDialogAssociation: DialogManagerInterface["addDialogAssociation"];
  addDialogRelation: DialogManagerInterface["addDialogRelation"];
  addDialogField: DialogManagerInterface["addDialogField"];
  addDialogSave: DialogManagerInterface["addDialogSave"];
  addDialogSettings: DialogManagerInterface["addDialogSettings"];
  removeDialog: DialogManagerInterface["removeDialog"];
  getLocalSaves: SaveManagerInterface["getLocalSaves"];
  getCurrentSave: SaveManagerInterface["getCurrentSave"];
  getCurrentToasts: ToastManagerInterface["getCurrentToasts"];
  getCurrentDialogs: DialogManagerInterface["getCurrentDialogs"];
  getCurrentSettings: SettingsManagerInterface["getCurrentSettings"];
}
