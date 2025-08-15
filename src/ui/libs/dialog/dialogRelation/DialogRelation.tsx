import type { DialogRelation as DialogRelationType } from "@/core/libs/dialog";
import { Button } from "@/ui/system";
import "./dialogRelation.scss";

interface DialogRelationProps {
  dialog: DialogRelationType;
}

export const DialogRelation = ({ dialog }: DialogRelationProps) => {
  const handleCancel = () => dialog.callbacks.closeDialog();
  const handleDelete = () => dialog.callbacks.deleteRelation();

  return (
    <div className="dialog-overlay">
      <div className="dialog-relation">
        <div className="dialog-relation__card">
          {dialog.title.length > 0 && (
            <div className="dialog-entity__card-header">
              <h3>{dialog.title}</h3>
            </div>
          )}
          {dialog.component()}
        </div>
        <div className="dialog-relation__actions">
          <Button className="dialog-relation__actions-item" onClick={handleCancel}>
            Fermer
          </Button>
          <Button className="dialog-relation__actions-item" onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
};
