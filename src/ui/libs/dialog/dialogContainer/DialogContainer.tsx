import { Fragment } from "react/jsx-runtime";
import { useKernelContext } from "@/core/kernel/KernelContext";
import { DialogTypeEnum } from "@/core/libs/dialog";
import { DialogAssociation } from "../dialogAssociation/DialogAssociation";
import { DialogConfirm } from "../dialogConfirm/DialogConfirm";
import { DialogEntity } from "../dialogEntity/DialogEntity";
import { DialogField } from "../dialogField/DialogField";
import { DialogRelation } from "../dialogRelation/DialogRelation";
import { DialogSave } from "../dialogSave/DialogSave";
import { DialogSettings } from "../dialogSettings/DialogSettings";
import "./dialogContainer.scss";

export const DialogContainer = () => {
  const { dependencies } = useKernelContext();

  const dialogs = dependencies.getCurrentDialogs();

  if (dialogs.length === 0) {
    return null;
  }

  return (
    <>
      {dialogs.map((dialog) => (
        <Fragment key={`dialog-${dialog.id}`}>
          {dialog.type === DialogTypeEnum.CONFIRM && <DialogConfirm dialog={dialog} />}
          {dialog.type === DialogTypeEnum.ENTITY && <DialogEntity dialog={dialog} />}
          {dialog.type === DialogTypeEnum.ASSOCIATION && <DialogAssociation dialog={dialog} />}
          {dialog.type === DialogTypeEnum.RELATION && <DialogRelation dialog={dialog} />}
          {dialog.type === DialogTypeEnum.FIELD && <DialogField dialog={dialog} />}
          {dialog.type === DialogTypeEnum.SAVE && <DialogSave dialog={dialog} />}
          {dialog.type === DialogTypeEnum.SETTINGS && <DialogSettings dialog={dialog} />}
        </Fragment>
      ))}
    </>
  );
};
