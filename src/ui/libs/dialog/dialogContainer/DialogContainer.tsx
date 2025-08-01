import { Fragment } from "react";
import { useKernelContext } from "@/core";
import { type DialogConfirm as DialogConfirmType, type DialogEntity as DialogEntityType, DialogTypeEnum } from "@/core/libs/dialog";
import { DialogAssociation } from "../dialogAssociation/DialogAssociation";
import { DialogConfirm } from "../dialogConfirm/DialogConfirm";
import { DialogEntity } from "../dialogEntity/DialogEntity";
import { DialogRelation } from "../dialogRelation/DialogRelation";
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
          {dialog.type === DialogTypeEnum.CONFIRM && <DialogConfirm dialog={dialog as DialogConfirmType} />}
          {dialog.type === DialogTypeEnum.ENTITY && <DialogEntity dialog={dialog as DialogEntityType} />}
          {dialog.type === DialogTypeEnum.ASSOCIATION && <DialogAssociation dialog={dialog as DialogEntityType} />}
          {dialog.type === DialogTypeEnum.RELATION && <DialogRelation dialog={dialog as DialogEntityType} />}
        </Fragment>
      ))}
    </div>
  );
};
