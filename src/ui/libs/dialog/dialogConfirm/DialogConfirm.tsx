import type { DialogConfirm as DialogConfirmType } from "@/core/libs/dialog";
import { Button } from "@/ui/system";
import "./dialogConfirm.scss";

interface DialogConfirmProps {
  dialog: DialogConfirmType;
}

export const DialogConfirm = ({ dialog }: DialogConfirmProps) => {
  const handleConfirm = () => dialog.callbacks.confirm();
  const handleCancel = () => dialog.callbacks.cancel();

  return (
    <div className="dialog-overlay">
      <div className="dialog-confirm">
        <div className="dialog-confirm__header">
          <h3>{dialog.title}</h3>
          <p>{dialog.message}</p>
        </div>
        <div className="dialog-confirm__actions">
          <Button onClick={handleConfirm}>Confirmer</Button>
          <Button onClick={handleCancel}>Annuler</Button>
        </div>
      </div>
    </div>
  );
};
