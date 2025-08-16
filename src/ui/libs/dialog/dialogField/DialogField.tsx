import type { DialogField as DialogFieldType } from "@/core/libs/dialog";
import { Button } from "@/ui/system";
import "./dialogField.scss";

interface DialogFieldProps {
  dialog: DialogFieldType;
}

export const DialogField = ({ dialog }: DialogFieldProps) => {
  const handleCloseDialog = () => dialog.callbacks.closeDialog();

  return (
    <div className="dialog-overlay">
      <div className="dialog-field">
        <div className="dialog-field__card">
          {dialog.title.length > 0 && (
            <div className="dialog-field__card-header">
              <h3>{dialog.title}</h3>
            </div>
          )}
          {dialog.component()}
        </div>
        <div className="dialog-field__actions">
          <Button className="dialog-field__actions-item" onClick={handleCloseDialog} width="full">
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};
