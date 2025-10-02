import type { Dialog, DialogSave as DialogSaveType } from "@/core/libs/dialog";
import { Button, CloseIcon } from "@/ui";
import "./dialogSave.scss";

interface DialogSaveProps {
  dialog: Dialog<DialogSaveType>;
}

export const DialogSave = ({ dialog }: DialogSaveProps) => {
  return (
    <div className="dialog-overlay">
      <div className="dialog-save">
        <div className="dialog-save__card">
          {dialog.props.title.length > 0 && (
            <div className="dialog-save__card-header">
              <h3>{dialog.props.title}</h3>
            </div>
          )}
          {dialog.props.component()}
        </div>
        <div className="dialog-save__actions">
          <Button className="dialog-save__actions-item" onClick={dialog.closeDialog}>
            <CloseIcon /> Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};
