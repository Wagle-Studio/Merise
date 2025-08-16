import { Fragment } from "react";
import { useKernelContext } from "@/core";
import { type DialogAssociation, type DialogConfirm, type DialogEntity, type DialogField, type DialogRelation, type DialogSettings, DialogTypeEnum } from "@/core/libs/dialog";
import { DialogAssociation as DialogAssociationComponent } from "../dialogAssociation/DialogAssociation";
import { DialogConfirm as DialogConfirmComponent } from "../dialogConfirm/DialogConfirm";
import { DialogEntity as DialogEntityComponent } from "../dialogEntity/DialogEntity";
import { DialogField as DialogFieldComponent } from "../dialogField/DialogField";
import { DialogRelation as DialogRelationComponent } from "../dialogRelation/DialogRelation";
import { DialogSettings as DialogSettingsComponent } from "../dialogSettings/DialogSettings";
import "./dialogContainer.scss";

export const DialogContainer = () => {
  const { dialogs } = useKernelContext();

  if (dialogs.length === 0) {
    return null;
  }

  return (
    <div className="dialog-container">
      {dialogs.map((dialog) => (
        <Fragment key={`dialog-${dialog.id}`}>
          {dialog.type === DialogTypeEnum.CONFIRM && <DialogConfirmComponent dialog={dialog as DialogConfirm} />}
          {dialog.type === DialogTypeEnum.ENTITY && <DialogEntityComponent dialog={dialog as DialogEntity} />}
          {dialog.type === DialogTypeEnum.ASSOCIATION && <DialogAssociationComponent dialog={dialog as DialogAssociation} />}
          {dialog.type === DialogTypeEnum.RELATION && <DialogRelationComponent dialog={dialog as DialogRelation} />}
          {dialog.type === DialogTypeEnum.FIELD && <DialogFieldComponent dialog={dialog as DialogField} />}
          {dialog.type === DialogTypeEnum.SETTINGS && <DialogSettingsComponent dialog={dialog as DialogSettings} />}
        </Fragment>
      ))}
    </div>
  );
};
