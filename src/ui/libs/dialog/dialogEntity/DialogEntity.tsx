import type { DialogEntity as DialogEntityType } from "@/core/libs/dialog";
import { Button } from "@/ui/system";
import "./dialogEntity.scss";

interface DialogEntityProps {
  dialog: DialogEntityType;
}

export const DialogEntity = ({ dialog }: DialogEntityProps) => {
  const handleCancel = () => dialog.callbacks.cancel();
  const handleDelete = () => dialog.callbacks.delete();

  return (
    <div className="dialog-overlay">
      <div className="dialog-entity">
        <div className="dialog-entity__card">
          {dialog.title.length > 0 && (
            <div className="dialog-entity__card-header">
              <h3>{dialog.title}</h3>
            </div>
          )}
          {dialog.component}
        </div>
        <div className="dialog-entity__actions">
          <Button className="dialog-entity__actions-item" onClick={handleCancel}>
            Fermer
          </Button>
          <Button className="dialog-entity__actions-item" onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
};
