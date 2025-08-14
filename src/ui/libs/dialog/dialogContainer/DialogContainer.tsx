import { Fragment } from "react";
import { useKernelContext } from "@/core";
import { type DialogAssociation, type DialogConfirm, type DialogEntity, type DialogRelation, DialogTypeEnum } from "@/core/libs/dialog";
import { DialogAssociation as DialogAssociationComponent } from "../dialogAssociation/DialogAssociation";
import { DialogConfirm as DialogConfirmComponent } from "../dialogConfirm/DialogConfirm";
import { DialogEntity as DialogEntityComponent } from "../dialogEntity/DialogEntity";
import { DialogRelation as DialogRelationComponent } from "../dialogRelation/DialogRelation";
import "./dialogContainer.scss";

export const DialogContainer = () => {
  const { dialogs } = useKernelContext();

  if (dialogs.length === 0) {
    return null;
  }

  return (
    <div className="dialog-container">
      {dialogs.map((dialog) => (
        <Fragment key={dialog.id}>
          {dialog.type === DialogTypeEnum.CONFIRM && <DialogConfirmComponent dialog={dialog as DialogConfirm} />}
          {dialog.type === DialogTypeEnum.ENTITY && <DialogEntityComponent dialog={dialog as DialogEntity} />}
          {dialog.type === DialogTypeEnum.ASSOCIATION && <DialogAssociationComponent dialog={dialog as DialogAssociation} />}
          {dialog.type === DialogTypeEnum.RELATION && <DialogRelationComponent dialog={dialog as DialogRelation} />}
        </Fragment>
      ))}
    </div>
  );
};
