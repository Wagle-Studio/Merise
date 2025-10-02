import type { Dialog, DialogField as DialogFieldType } from "@/core/libs/dialog";
import { Button, CloseIcon } from "@/ui";
import "./dialogField.scss";

interface DialogFieldProps {
  dialog: Dialog<DialogFieldType>;
}

export const DialogField = ({ dialog }: DialogFieldProps) => {
  return (
    <div className="dialog-overlay">
      <div className="dialog-field">
        <div className="dialog-field__card">
          {dialog.props.title && dialog.props.title.length > 0 && (
            <div className="dialog-field__card-header">
              <h3>{dialog.props.title}</h3>
            </div>
          )}
          {dialog.props.component()}
        </div>
        <div className="dialog-field__actions">
          <Button className="dialog-field__actions-item" onClick={dialog.closeDialog}>
            <CloseIcon /> Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};
