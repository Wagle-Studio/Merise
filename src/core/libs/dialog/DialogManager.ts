import { v4 as uuidv4 } from "uuid";
import {
  type AnyDialog,
  type Dialog,
  type DialogAssociation,
  type DialogConfirm,
  type DialogEntity,
  type DialogField,
  type DialogManagerInterface,
  type DialogPropsType,
  type DialogRelation,
  type DialogSave,
  type DialogSettings,
  DialogType,
  DialogType as DialogTypeEnum,
  type DialogsDispatcher,
} from "./DialogTypes";

export default class DialogManager implements DialogManagerInterface {
  private static instance: DialogManager;

  private constructor(
    private getDialogs: () => AnyDialog[],
    private setDialogs: DialogsDispatcher
  ) {}

  static getInstance = (getDialogs: () => AnyDialog[], setDialogs: DialogsDispatcher): DialogManager => {
    if (!this.instance) {
      this.instance = new DialogManager(getDialogs, setDialogs);
    }

    return this.instance;
  };

  getCurrentDialogs = (): AnyDialog[] => {
    return this.getDialogs();
  };

  addDialogConfirm = (props: DialogConfirm): string | null => {
    return this.addDialog<DialogConfirm>(props, DialogTypeEnum.CONFIRM);
  };

  addDialogEntity = (props: DialogEntity): string | null => {
    return this.addDialog<DialogEntity>(props, DialogTypeEnum.ENTITY);
  };

  addDialogAssociation = (props: DialogAssociation): string | null => {
    return this.addDialog<DialogAssociation>(props, DialogTypeEnum.ASSOCIATION);
  };

  addDialogRelation = (props: DialogRelation): string | null => {
    return this.addDialog<DialogRelation>(props, DialogTypeEnum.RELATION);
  };

  addDialogField = (props: DialogField): string | null => {
    return this.addDialog<DialogField>(props, DialogTypeEnum.FIELD);
  };

  addDialogSave = (props: DialogSave): string | null => {
    return this.addDialog<DialogSave>(props, DialogTypeEnum.SAVE);
  };

  addDialogSettings = (props: DialogSettings): string | null => {
    return this.addDialog<DialogSettings>(props, DialogTypeEnum.SETTINGS);
  };

  clearDialogs = (): void => {
    this.setDialogs([]);
  };

  removeDialog = (id: string): void => {
    this.setDialogs((prev) => prev.filter((dialog) => dialog.id !== id));
  };

  private addDialog = <T extends DialogPropsType>(props: T, type: DialogType): string | null => {
    const dialogAlreadyOpen = this.hasDialogOpened(type);

    if (dialogAlreadyOpen) return null;

    const id = uuidv4();

    const dialog: Dialog<T> = {
      type: type,
      timestamp: Date.now(),
      id: id,
      props,
      closeDialog: () => this.removeDialog(id),
    };

    this.setDialogs([...this.getDialogs(), dialog as AnyDialog]);

    return id;
  };

  private hasDialogOpened = (type: DialogTypeEnum): boolean => {
    return this.getDialogs().some((dialog) => dialog.type === type);
  };
}
