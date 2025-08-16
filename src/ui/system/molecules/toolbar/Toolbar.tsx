import { useCallback } from "react";
import { useKernelContext } from "@/core";
import { Button } from "../../atoms";
import "./toolbar.scss";

export const Toolbar = () => {
  const { operations } = useKernelContext();

  const handleCreateEntity = useCallback(() => {
    operations.onEntityCreate();
  }, []);

  const handleCreateAssociation = useCallback(() => {
    operations.onAssociationCreate();
  }, []);

  const handleOpenSettings = useCallback(() => {
    operations.onSettingsOpen();
  }, []);

  return (
    <div className="toolbar">
      <div className="toolbar__left">
        <Button onClick={handleCreateEntity}>Nouvelle entité</Button>
        <Button onClick={handleCreateAssociation}>Nouvelle association</Button>
      </div>
      <div className="toolbar__right">
        <Button onClick={handleOpenSettings}>Paramètres</Button>
      </div>
    </div>
  );
};
