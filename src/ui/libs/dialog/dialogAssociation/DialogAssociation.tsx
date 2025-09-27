import type { Dialog, DialogAssociation as DialogAssociationType } from "@/core/libs/dialog";
import { AddIcon, Button, CloseIcon, KeyIcon, TrashIcon } from "@/ui/system";
import "./dialogAssociation.scss";

interface DialogAssociationProps {
  dialog: Dialog<DialogAssociationType>;
}

export const DialogAssociation = ({ dialog }: DialogAssociationProps) => {
  const handleCloseDialog = () => dialog.closeDialog();
  const handleDeleteAssociation = () => dialog.props.callbacks.deleteAssociation();
  const handleAddField = () => dialog.props.callbacks.addField();
  const handleAddFieldPrimaryKey = () => dialog.props.callbacks.addFieldPrimaryKey();

  return (
    <div className="dialog-overlay">
      <div className="dialog-association">
        <div className="dialog-association__card">
          {dialog.props.title && dialog.props.title.length > 0 && (
            <div className="dialog-association__card-header">
              <h3>{dialog.props.title}</h3>
            </div>
          )}
          {dialog.props.component()}
        </div>
        <div className="dialog-association__actions">
          <Button className="dialog-association__actions-item" onClick={handleCloseDialog}>
            <CloseIcon /> Fermer
          </Button>
          <Button className="dialog-association__actions-item" onClick={handleAddField}>
            <AddIcon /> Un champ
          </Button>
          <Button className="dialog-association__actions-item" onClick={handleAddFieldPrimaryKey}>
            <KeyIcon /> Clé primaire
          </Button>
          <Button className="dialog-association__actions-item" onClick={handleDeleteAssociation}>
            <TrashIcon /> Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
};
