import type { Dialog, DialogSettings as DialogSettingsType } from "@/core/libs/dialog";
import { Button, CloseIcon } from "@/ui/system";
import "./dialogSettings.scss";

interface DialogSettingsProps {
  dialog: Dialog<DialogSettingsType>;
}

export const DialogSettings = ({ dialog }: DialogSettingsProps) => {
  const handleCancel = () => dialog.closeDialog();

  return (
    <div className="dialog-overlay">
      <div className="dialog-settings">
        <div className="dialog-settings__card">
          {dialog.props.title.length > 0 && (
            <div className="dialog-settings__card-header">
              <h3>{dialog.props.title}</h3>
            </div>
          )}
          {dialog.props.component()}
        </div>
        <div className="dialog-settings__actions">
          <Button className="dialog-settings__actions-item" onClick={handleCancel}>
            <CloseIcon /> Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};
