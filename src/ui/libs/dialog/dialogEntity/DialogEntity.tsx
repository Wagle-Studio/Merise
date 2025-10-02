import type { Dialog, DialogEntity as DialogEntityType } from "@/core/libs/dialog";
import { AddIcon, Button, CloseIcon, KeyIcon, TrashIcon } from "@/ui";
import "./dialogEntity.scss";

interface DialogEntityProps {
  dialog: Dialog<DialogEntityType>;
}

export const DialogEntity = ({ dialog }: DialogEntityProps) => {
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
          <Button className="dialog-entity__actions-item" onClick={dialog.closeDialog}>
            <CloseIcon /> Fermer
          </Button>
          <Button className="dialog-entity__actions-item" onClick={dialog.props.callbacks.addField}>
            <AddIcon /> Un champ
          </Button>
          <Button className="dialog-entity__actions-item" onClick={dialog.props.callbacks.addFieldPrimaryKey}>
            <KeyIcon /> Clé primaire
          </Button>
          <Button className="dialog-entity__actions-item" onClick={dialog.props.callbacks.deleteEntity}>
            <TrashIcon /> Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
};
