import type { ReactNode } from "react";

// List of all available dialog types
export enum DialogType {
  CONFIRM = "confirm",
  ENTITY = "entity",
  ASSOCIATION = "association",
  RELATION = "relation",
  FIELD = "field",
  SAVE = "save",
  SETTINGS = "settings",
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
  closeDialog: () => void;
  onConfirm: () => void;
}

// Interface for an entity dialog instance
export interface DialogEntity extends Dialog {
  component: () => ReactNode;
  callbacks: DialogEntityCallbacks;
}

interface DialogEntityCallbacks {
  closeDialog: () => void;
  deleteEntity: () => void;
  addField: () => void;
  addFieldPrimaryKey: () => void;
}

// Interface for an association dialog instance
export interface DialogAssociation extends Dialog {
  component: () => ReactNode;
  callbacks: DialogAssociationCallbacks;
}

interface DialogAssociationCallbacks {
  closeDialog: () => void;
  deleteAssociation: () => void;
  addField: () => void;
  addFieldPrimaryKey: () => void;
}

// Interface for an relation dialog instance
export interface DialogRelation extends Dialog {
  component: () => ReactNode;
  callbacks: DialogRelationCallbacks;
}

interface DialogRelationCallbacks {
  closeDialog: () => void;
  deleteRelation: () => void;
}

// Interface for a add field dialog instance
export interface DialogField extends Dialog {
  component: () => ReactNode;
  callbacks: DialogFieldCallbacks;
}

interface DialogFieldCallbacks {
  closeDialog: () => void;
}

// Interface for a save dialog instance
export interface DialogSave extends Dialog {
  component: () => ReactNode;
  callbacks: DialogSaveCallbacks;
}

interface DialogSaveCallbacks {
  closeDialog: () => void;
}

// Interface for a settings dialog instance
export interface DialogSettings extends Dialog {
  component: () => ReactNode;
  callbacks: DialogSettingsCallbacks;
}

interface DialogSettingsCallbacks {
  closeDialog: () => void;
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
  title: DialogAssociation["title"];
  component: DialogAssociation["component"];
  callbacks: DialogAssociationCallbacks;
}

// Props required by the addRelationDialog method in the manager
export interface AddRelationDialogProps {
  title: DialogRelation["title"];
  component: DialogRelation["component"];
  callbacks: DialogRelationCallbacks;
}

// Props required by the addFieldDialog method in the manager
export interface AddFieldDialogProps {
  title: DialogField["title"];
  component: DialogField["component"];
  callbacks: DialogFieldCallbacks;
}

// Props required by the addSaveDialog method in the manager
export interface AddSaveDialogProps {
  title: DialogSettings["title"];
  component: DialogSettings["component"];
  callbacks: DialogSettingsCallbacks;
}

// Props required by the addSettingsDialog method in the manager
export interface AddSettingsDialogProps {
  title: DialogSettings["title"];
  component: DialogSettings["component"];
  callbacks: DialogSettingsCallbacks;
}

// Contract for the dialog manager implementation
export interface DialogManagerInterface {
  addConfirmDialog: (props: AddConfirmDialogProps) => string;
  addEntityDialog: (props: AddEntityDialogProps) => string;
  addAssociationDialog: (props: AddAssociationDialogProps) => string;
  addRelationDialog: (props: AddRelationDialogProps) => string;
  addFieldDialog: (props: AddFieldDialogProps) => string;
  addSaveDialog: (props: AddSaveDialogProps) => string;
  addSettingsDialog: (props: AddSettingsDialogProps) => string;
  clearDialogs: () => void;
  removeDialogById: (id: string) => void;
  hasSaveDialogOpened: () => boolean;
  hasSettingsDialogOpened: () => boolean;
}
