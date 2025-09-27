// List of all available dialog types
export enum DialogType {
  CONFIRM = "CONFIRM",
  ENTITY = "ENTITY",
  ASSOCIATION = "ASSOCIATION",
  RELATION = "RELATION",
  FIELD = "FIELD",
  SAVE = "SAVE",
  SETTINGS = "SETTINGS",
}

// Base interface for a dialog instance carrying typed props
export interface Dialog<T extends DialogPropsType> {
  timestamp: number;
  id: string;
  type: DialogType;
  props: T;
  closeDialog: () => void;
}

// Interface for a confirm dialog instance
export interface DialogConfirm {
  title: string;
  message: string;
  callbacks: {
    onConfirm: () => void;
  };
}

// Interface for an entity dialog instance
export interface DialogEntity {
  title?: string;
  component: () => React.ReactElement;
  callbacks: {
    deleteEntity: () => void;
    addField: () => void;
    addFieldPrimaryKey: () => void;
  };
}

// Interface for an association dialog instance
export interface DialogAssociation {
  title?: string;
  component: () => React.ReactElement;
  callbacks: {
    deleteAssociation: () => void;
    addField: () => void;
    addFieldPrimaryKey: () => void;
  };
}

// Interface for a relation dialog instance
export interface DialogRelation {
  title?: string;
  component: () => React.ReactElement;
  callbacks: {
    deleteRelation: () => void;
  };
}

// Interface for an add field dialog instance
export interface DialogField {
  title?: string;
  component: () => React.ReactElement;
}

// Interface for a save dialog instance
export interface DialogSave {
  title: string;
  component: () => React.ReactElement;
}

// Interface for a settings dialog instance
export interface DialogSettings {
  title: string;
  component: () => React.ReactElement;
}

// Union type representing every possible dialog instance type
export type DialogPropsType =
  | DialogConfirm
  | DialogEntity
  | DialogAssociation
  | DialogRelation
  | DialogField
  | DialogSave
  | DialogSettings;

// Mapping from discriminant to its props type
export type DialogMap = {
  [DialogType.CONFIRM]: DialogConfirm;
  [DialogType.ENTITY]: DialogEntity;
  [DialogType.ASSOCIATION]: DialogAssociation;
  [DialogType.RELATION]: DialogRelation;
  [DialogType.FIELD]: DialogField;
  [DialogType.SAVE]: DialogSave;
  [DialogType.SETTINGS]: DialogSettings;
};

type DialogOf<K extends DialogType> = {
  timestamp: number;
  id: string;
  type: K;
  props: DialogMap[K];
  closeDialog: () => void;
};

// Convenience union of fully typed dialog instances
export type AnyDialog = { [K in DialogType]: DialogOf<K> }[DialogType];

// Dispatcher type for updating the dialogs state
export type DialogsDispatcher = React.Dispatch<React.SetStateAction<AnyDialog[]>>;

// Contract for the dialog manager implementation
export interface DialogManagerInterface {
  getCurrentDialogs: () => AnyDialog[];
  addDialogConfirm: (props: DialogConfirm) => string | null;
  addDialogEntity: (props: DialogEntity) => string | null;
  addDialogAssociation: (props: DialogAssociation) => string | null;
  addDialogRelation: (props: DialogRelation) => string | null;
  addDialogField: (props: DialogField) => string | null;
  addDialogSave: (props: DialogSave) => string | null;
  addDialogSettings: (props: DialogSettings) => string | null;
  clearDialogs: () => void;
  removeDialog: (id: string) => void;
}
