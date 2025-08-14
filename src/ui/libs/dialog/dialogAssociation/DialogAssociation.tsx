import type { DialogAssociation as DialogAssociationType } from "@/core/libs/dialog";
import { Button } from "@/ui/system";
import "./dialogAssociation.scss";

interface DialogAssociationProps {
  dialog: DialogAssociationType;
}

export const DialogAssociation = ({ dialog }: DialogAssociationProps) => {
  const handleCancel = () => dialog.callbacks.cancel();
  const handleDelete = () => dialog.callbacks.delete();

  return (
    <div className="dialog-overlay">
      <div className="dialog-association">
        <div className="dialog-association__card">
          {dialog.title.length > 0 && (
            <div className="dialog-entity__card-header">
              <h3>{dialog.title}</h3>
            </div>
          )}
          {dialog.component}
        </div>
        <div className="dialog-association__actions">
          <Button className="dialog-association__actions-item" onClick={handleCancel}>
            Fermer
          </Button>
          <Button className="dialog-association__actions-item" onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
};
