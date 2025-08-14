import { v4 as uuidv4 } from "uuid";
import type {
  AddAssociationDialogProps,
  AddConfirmDialogProps,
  AddEntityDialogProps,
  AddRelationDialogProps,
  Dialog,
  DialogAssociation,
  DialogConfirm,
  DialogEntity,
  DialogManagerInterface,
  DialogRelation,
  DialogsDispatcher,
} from "./DialogTypes";
import { DialogType as DialogTypeEnum } from "./DialogTypes";

export default class DialogManager implements DialogManagerInterface {
  constructor(
    private getDialogs: () => Dialog[],
    private setDialogs: DialogsDispatcher
  ) {}

  addConfirmDialog = (props: AddConfirmDialogProps): string => {
    const dialog = this.createConfirmDialog(props);
    this.setDialogs([...this.getDialogs(), dialog]);
    return dialog.id;
  };

  addEntityDialog = (props: AddEntityDialogProps): string => {
    const dialog = this.createEntityDialog(props);
    this.setDialogs([...this.getDialogs(), dialog]);
    return dialog.id;
  };

  addAssociationDialog = (props: AddAssociationDialogProps): string => {
    const dialog = this.createAssociationDialog(props);
    this.setDialogs([...this.getDialogs(), dialog]);
    return dialog.id;
  };

  addRelationDialog = (props: AddRelationDialogProps): string => {
    const dialog = this.createRelationDialog(props);
    this.setDialogs([...this.getDialogs(), dialog]);
    return dialog.id;
  };

  removeDialogById = (id: string): void => {
    this.setDialogs((prev) => prev.filter((dialog) => dialog.id !== id));
  };

  private createConfirmDialog = (props: AddConfirmDialogProps): DialogConfirm => {
    return {
      timestamp: Date.now(),
      id: uuidv4(),
      type: DialogTypeEnum.CONFIRM,
      title: props.title,
      message: props.message,
      callbacks: props.callbacks,
    };
  };

  private createEntityDialog = (props: AddEntityDialogProps): DialogEntity => {
    return {
      timestamp: Date.now(),
      id: uuidv4(),
      type: DialogTypeEnum.ENTITY,
      title: props.title,
      component: props.component,
      callbacks: props.callbacks,
    };
  };

  private createAssociationDialog = (props: AddAssociationDialogProps): DialogAssociation => {
    return {
      timestamp: Date.now(),
      id: uuidv4(),
      type: DialogTypeEnum.ASSOCIATION,
      title: props.title,
      component: props.component,
      callbacks: props.callbacks,
    };
  };

  private createRelationDialog = (props: AddRelationDialogProps): DialogRelation => {
    return {
      timestamp: Date.now(),
      id: uuidv4(),
      type: DialogTypeEnum.RELATION,
      title: props.title,
      component: props.component,
      callbacks: props.callbacks,
    };
  };
}
