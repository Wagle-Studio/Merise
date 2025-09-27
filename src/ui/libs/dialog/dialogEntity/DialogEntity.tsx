import type { Dialog, DialogEntity as DialogEntityType } from "@/core/libs/dialog";
import { AddIcon, Button, CloseIcon, KeyIcon, TrashIcon } from "@/ui/system";
import "./dialogEntity.scss";

interface DialogEntityProps {
  dialog: Dialog<DialogEntityType>;
}

export const DialogEntity = ({ dialog }: DialogEntityProps) => {
  const handleCloseDialog = () => dialog.closeDialog();
  const handleDeleteEntity = () => dialog.props.callbacks.deleteEntity();
  const handleAddField = () => dialog.props.callbacks.addField();
  const handleAddFieldPrimaryKey = () => dialog.props.callbacks.addFieldPrimaryKey();

  return (
    <div className="dialog-overlay">
      <div className="dialog-entity">
        <div className="dialog-entity__card">
          {dialog.props.title && dialog.props.title.length > 0 && (
            <div className="dialog-entity__card-header">
              <h3>{dialog.props.title}</h3>
            </div>
          )}
          {dialog.props.component()}
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
