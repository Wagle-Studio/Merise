import type { DialogConfirm as DialogConfirmType } from "@/core/libs/dialog";
import { Button, CheckIcon, CloseIcon } from "@/ui/system";
import "./dialogConfirm.scss";

interface DialogConfirmProps {
  dialog: DialogConfirmType;
}

export const DialogConfirm = ({ dialog }: DialogConfirmProps) => {
  const handleConfirm = () => dialog.callbacks.onConfirm();
  const handleCancel = () => dialog.callbacks.closeDialog();

  return (
    <div className="dialog-overlay">
      <div className="dialog-confirm">
        <div className="dialog-confirm__header">
          <h3>{dialog.title}</h3>
          <p>{dialog.message}</p>
        </div>
        <div className="dialog-confirm__actions">
          <Button onClick={handleConfirm}>
            <CheckIcon /> Confirmer
          </Button>
          <Button onClick={handleCancel}>
            <CloseIcon /> Annuler
          </Button>
        </div>
      </div>
    </div>
  );
};
