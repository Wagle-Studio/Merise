import type { Dialog, DialogAssociation as DialogAssociationType } from "@/core/libs/dialog";
import { AddIcon, Button, CloseIcon, KeyIcon, TrashIcon } from "@/ui";
import "./dialogAssociation.scss";

interface DialogAssociationProps {
  dialog: Dialog<DialogAssociationType>;
}

export const DialogAssociation = ({ dialog }: DialogAssociationProps) => {
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
          <Button className="dialog-association__actions-item" onClick={dialog.closeDialog}>
            <CloseIcon /> Fermer
          </Button>
          <Button className="dialog-association__actions-item" onClick={dialog.props.callbacks.addField}>
            <AddIcon /> Un champ
          </Button>
          <Button className="dialog-association__actions-item" onClick={dialog.props.callbacks.addFieldPrimaryKey}>
            <KeyIcon /> Clé primaire
          </Button>
          <Button className="dialog-association__actions-item" onClick={dialog.props.callbacks.deleteAssociation}>
            <TrashIcon /> Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
};
