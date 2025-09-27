import { v4 as uuidv4 } from "uuid";
import type {
  AddAssociationDialogProps,
  AddConfirmDialogProps,
  AddEntityDialogProps,
  AddFieldDialogProps,
  AddRelationDialogProps,
  AddSaveDialogProps,
  AddSettingsDialogProps,
  Dialog,
  DialogManagerInterface,
  DialogsDispatcher,
} from "./DialogTypes";
import { DialogType as DialogTypeEnum } from "./DialogTypes";

export default class DialogManager implements DialogManagerInterface {
  private static instance: DialogManager;

  private constructor(
    private getDialogs: () => Dialog[],
    private setDialogs: DialogsDispatcher
  ) {}

  static getInstance = (getDialogs: () => Dialog[], setDialogs: DialogsDispatcher): DialogManager => {
    if (!this.instance) {
      this.instance = new DialogManager(getDialogs, setDialogs);
    }

    return this.instance;
  };

  addConfirmDialog = (props: AddConfirmDialogProps): string => {
    const dialog = {
      timestamp: Date.now(),
      id: uuidv4(),
      type: DialogTypeEnum.CONFIRM,
      title: props.title,
      message: props.message,
      callbacks: props.callbacks,
    };
    this.setDialogs([...this.getDialogs(), dialog]);
    return dialog.id;
  };

  addEntityDialog = (props: AddEntityDialogProps): string => {
    const dialog = {
      timestamp: Date.now(),
      id: uuidv4(),
      type: DialogTypeEnum.ENTITY,
      title: props.title,
      component: props.component,
      callbacks: props.callbacks,
    };
    this.setDialogs([...this.getDialogs(), dialog]);
    return dialog.id;
  };

  addAssociationDialog = (props: AddAssociationDialogProps): string => {
    const dialog = {
      timestamp: Date.now(),
      id: uuidv4(),
      type: DialogTypeEnum.ASSOCIATION,
      title: props.title,
      component: props.component,
      callbacks: props.callbacks,
    };
    this.setDialogs([...this.getDialogs(), dialog]);
    return dialog.id;
  };

  addRelationDialog = (props: AddRelationDialogProps): string => {
    const dialog = {
      timestamp: Date.now(),
      id: uuidv4(),
      type: DialogTypeEnum.RELATION,
      title: props.title,
      component: props.component,
      callbacks: props.callbacks,
    };
    this.setDialogs([...this.getDialogs(), dialog]);
    return dialog.id;
  };

  addFieldDialog = (props: AddFieldDialogProps): string => {
    const dialog = {
      timestamp: Date.now(),
      id: uuidv4(),
      type: DialogTypeEnum.FIELD,
      title: props.title,
      component: props.component,
      callbacks: props.callbacks,
    };
    this.setDialogs([...this.getDialogs(), dialog]);
    return dialog.id;
  };

  addSaveDialog = (props: AddSaveDialogProps): string => {
    const dialog = {
      timestamp: Date.now(),
      id: uuidv4(),
      type: DialogTypeEnum.SAVE,
      title: props.title,
      component: props.component,
      callbacks: props.callbacks,
    };
    this.setDialogs([...this.getDialogs(), dialog]);
    return dialog.id;
  };

  addSettingsDialog = (props: AddSettingsDialogProps): string => {
    const dialog = {
      timestamp: Date.now(),
      id: uuidv4(),
      type: DialogTypeEnum.SETTINGS,
      title: props.title,
      component: props.component,
      callbacks: props.callbacks,
    };
    this.setDialogs([...this.getDialogs(), dialog]);
    return dialog.id;
  };

  clearDialogs = (): void => {
    this.setDialogs([]);
  };

  removeDialogById = (id: string): void => {
    this.setDialogs((prev) => prev.filter((dialog) => dialog.id !== id));
  };

  hasSaveDialogOpened = (): boolean => {
    return this.getDialogs().some((dialog) => dialog.type === DialogTypeEnum.SAVE);
  };

  hasSettingsDialogOpened = (): boolean => {
    return this.getDialogs().some((dialog) => dialog.type === DialogTypeEnum.SETTINGS);
  };
}
