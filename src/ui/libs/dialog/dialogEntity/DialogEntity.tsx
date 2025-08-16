import type { DialogEntity as DialogEntityType } from "@/core/libs/dialog";
import { Button } from "@/ui/system";
import "./dialogEntity.scss";

interface DialogEntityProps {
  dialog: DialogEntityType;
}

export const DialogEntity = ({ dialog }: DialogEntityProps) => {
  const handleCloseDialog = () => dialog.callbacks.closeDialog();
  const handleDeleteEntity = () => dialog.callbacks.deleteEntity();
  const handleAddField = () => dialog.callbacks.addField();
  const handleAddFieldPrimaryKey = () => dialog.callbacks.addFieldPrimaryKey();

  return (
    <div className="dialog-overlay">
      <div className="dialog-entity">
        <div className="dialog-entity__card">
          {dialog.title.length > 0 && (
            <div className="dialog-entity__card-header">
              <h3>{dialog.title}</h3>
            </div>
          )}
          {dialog.component()}
        </div>
        <div className="dialog-entity__actions">
          <Button className="dialog-entity__actions-item" onClick={handleCloseDialog}>
            Fermer
          </Button>
          <Button className="dialog-entity__actions-item" onClick={handleAddField}>
            Ajouter un champ
          </Button>
          <Button className="dialog-entity__actions-item" onClick={handleAddFieldPrimaryKey}>
            Ajouter une clé primaire
          </Button>
          <Button className="dialog-entity__actions-item" onClick={handleDeleteEntity}>
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
};
