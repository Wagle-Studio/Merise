import { useCallback } from "react";
import { useKernelContext } from "@/core";
import { Button } from "../../atoms";
import "./toolbar.scss";

export const Toolbar = () => {
  const { save, operations } = useKernelContext();

  const handleCreateEntity = useCallback(() => {
    operations.onEntityCreate();
  }, []);

  const handleSave = useCallback(() => {
    operations.onSave();
  }, []);

  const handleCreateAssociation = useCallback(() => {
    operations.onAssociationCreate();
  }, []);

  const handleOpenSettings = useCallback(() => {
    operations.onSettingsOpen();
  }, []);

  return (
    <div className="toolbar">
      <div className="toolbar__wrapper">
        <div className="toolbar__left">
          <Button onClick={handleCreateEntity}>Nouvelle entité</Button>
          <Button onClick={handleCreateAssociation}>Nouvelle association</Button>
        </div>
        <div className="toolbar__center">
          <p className="toolbar__center__diagram_name" onClick={handleOpenSettings}>
            {save.getName()}
          </p>
        </div>
        <div className="toolbar__right">
          <Button onClick={handleSave}>Sauvegarder</Button>
          <Button onClick={handleOpenSettings}>Paramètres</Button>
        </div>
      </div>
    </div>
  );
};
