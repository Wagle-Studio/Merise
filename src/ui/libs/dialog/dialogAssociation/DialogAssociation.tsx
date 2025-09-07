import type { DialogAssociation as DialogAssociationType } from "@/core/libs/dialog";
import { AddIcon, Button, CloseIcon, KeyIcon, TrashIcon } from "@/ui/system";
import "./dialogAssociation.scss";

interface DialogAssociationProps {
  dialog: DialogAssociationType;
}

export const DialogAssociation = ({ dialog }: DialogAssociationProps) => {
  const handleCloseDialog = () => dialog.callbacks.closeDialog();
  const handleDeleteAssociation = () => dialog.callbacks.deleteAssociation();
  const handleAddField = () => dialog.callbacks.addField();
  const handleAddFieldPrimaryKey = () => dialog.callbacks.addFieldPrimaryKey();

  return (
    <div className="dialog-overlay">
      <div className="dialog-association">
        <div className="dialog-association__card">
          {dialog.title.length > 0 && (
            <div className="dialog-association__card-header">
              <h3>{dialog.title}</h3>
            </div>
          )}
          {dialog.component()}
        </div>
        <div className="dialog-association__actions">
          <Button className="dialog-entity__actions-item" onClick={handleCloseDialog}>
            <CloseIcon /> Fermer
          </Button>
          <Button className="dialog-entity__actions-item" onClick={handleAddField}>
            <AddIcon /> Un champ
          </Button>
          <Button className="dialog-entity__actions-item" onClick={handleAddFieldPrimaryKey}>
            <KeyIcon /> Clé primaire
          </Button>
          <Button className="dialog-entity__actions-item" onClick={handleDeleteAssociation}>
            <TrashIcon /> Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
};
