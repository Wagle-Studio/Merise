import type { ReactNode } from "react";

// List of all available dialog types
export enum DialogType {
  CONFIRM = "confirm",
  ENTITY = "entity",
  ASSOCIATION = "association",
  RELATION = "relation",
}

// Base interface shared by all dialog types
export interface Dialog {
  timestamp: number;
  id: string;
  type: DialogType;
  title: string;
}

// Interface for a confirm dialog instance
export interface DialogConfirm extends Dialog {
  message: string;
  callbacks: DialogConfirmCallbacks;
}

interface DialogConfirmCallbacks {
  cancel: Function;
  confirm: Function;
}

// Interface for an entity dialog instance
export interface DialogEntity extends Dialog {
  component: ReactNode;
  callbacks: DialogEntityCallbacks;
}

interface DialogEntityCallbacks {
  cancel: Function;
  delete: Function;
}

// Dispatcher type for updating the dialogs state
export type DialogsDispatcher = React.Dispatch<React.SetStateAction<Dialog[]>>;

// Props required by the addConfirmDialog method in the manager
export interface AddConfirmDialogProps {
  title: DialogConfirm["title"];
  message: DialogConfirm["message"];
  callbacks: DialogConfirmCallbacks;
}

// Props required by the addEntityDialog method in the manager
export interface AddEntityDialogProps {
  title: DialogEntity["title"];
  component: DialogEntity["component"];
  callbacks: DialogEntityCallbacks;
}

// Props required by the addAssociationDialog method in the manager
export interface AddAssociationDialogProps {
  title: DialogEntity["title"];
  component: DialogEntity["component"];
  callbacks: DialogEntityCallbacks;
}

// Props required by the addRelationDialog method in the manager
export interface AddRelationDialogProps {
  title: DialogEntity["title"];
  component: DialogEntity["component"];
  callbacks: DialogEntityCallbacks;
}

// Contract for the dialog manager implementation
export interface DialogManagerInterface {
  addConfirmDialog: (props: AddConfirmDialogProps) => string;
  addEntityDialog: (props: AddEntityDialogProps) => string;
  addAssociationDialog: (props: AddAssociationDialogProps) => string;
  addRelationDialog: (props: AddRelationDialogProps) => string;
  removeDialogById: (id: string) => void;
}
