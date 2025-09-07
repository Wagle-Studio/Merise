import type { DialogSave as DialogSaveType } from "@/core/libs/dialog";
import { Button } from "@/ui/system";
import "./dialogSave.scss";

interface DialogSaveProps {
  dialog: DialogSaveType;
}

export const DialogSave = ({ dialog }: DialogSaveProps) => {
  const handleCancel = () => dialog.callbacks.closeDialog();

  return (
    <div className="dialog-overlay">
      <div className="dialog-save">
        <div className="dialog-save__card">
          {dialog.title.length > 0 && (
            <div className="dialog-save__card-header">
              <h3>{dialog.title}</h3>
            </div>
          )}
          {dialog.component()}
        </div>
        <div className="dialog-save">
          <Button className="dialog-save__actions-item" onClick={handleCancel}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};
