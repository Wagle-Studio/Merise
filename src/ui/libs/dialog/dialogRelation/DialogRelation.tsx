import type { Dialog, DialogRelation as DialogRelationType } from "@/core/libs/dialog";
import { Button, CloseIcon, TrashIcon } from "@/ui";
import "./dialogRelation.scss";

interface DialogRelationProps {
  dialog: Dialog<DialogRelationType>;
}

export const DialogRelation = ({ dialog }: DialogRelationProps) => {
  return (
    <div className="dialog-overlay">
      <div className="dialog-relation">
        <div className="dialog-relation__card">
          {dialog.props.title && dialog.props.title.length > 0 && (
            <div className="dialog-relation__card-header">
              <h3>{dialog.props.title}</h3>
            </div>
          )}
          {dialog.props.component()}
        </div>
        <div className="dialog-relation__actions">
          <Button className="dialog-relation__actions-item" onClick={dialog.closeDialog}>
            <CloseIcon /> Fermer
          </Button>
          <Button className="dialog-relation__actions-item" onClick={dialog.props.callbacks.deleteRelation}>
            <TrashIcon /> Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
};
