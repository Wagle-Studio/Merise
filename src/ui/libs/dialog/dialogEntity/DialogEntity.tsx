import type { DialogEntity as DialogEntityType } from "@/core/libs/dialog";
import { AddIcon, Button, CloseIcon, KeyIcon, TrashIcon } from "@/ui/system";
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
            <CloseIcon /> Fermer
          </Button>
          <Button className="dialog-entity__actions-item" onClick={handleAddField}>
            <AddIcon /> Un champ
          </Button>
          <Button className="dialog-entity__actions-item" onClick={handleAddFieldPrimaryKey}>
            <KeyIcon /> Clé primaire
          </Button>
          <Button className="dialog-entity__actions-item" onClick={handleDeleteEntity}>
            <TrashIcon /> Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
};
