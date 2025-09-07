import { useCallback } from "react";
import { useKernelContext } from "@/core";
import { AddIcon, Button, EditIcon, HomeIcon, SaveIcon, SettingsIcon } from "../../atoms";
import "./toolbar.scss";

export const Toolbar = () => {
  const { save, operations } = useKernelContext();

  const handleCreateEntity = useCallback(() => {
    operations.onEntityCreate();
  }, []);

  const handleCreateAssociation = useCallback(() => {
    operations.onAssociationCreate();
  }, []);

  const handleOpenSave = useCallback(() => {
    operations.onSaveOpen();
  }, []);

  const handleSave = useCallback(() => {
    operations.onSave();
  }, []);

  const handleOpenSettings = useCallback(() => {
    operations.onSettingsOpen();
  }, []);

  return (
    <div className="toolbar">
      <div className="toolbar__wrapper">
        <div className="toolbar__left">
          <Button onClick={handleCreateEntity}>
            <AddIcon /> Entité
          </Button>
          <Button onClick={handleCreateAssociation}>
            <AddIcon /> Association
          </Button>
        </div>
        <div className="toolbar__center">
          <Button variant="ghost" className="toolbar__center__diagram_name" onClick={handleOpenSave} disabled={save.getId() == "save_demo"}>
            {save.getName()} <EditIcon />
          </Button>
        </div>
        <div className="toolbar__right">
          <Button onClick={handleSave}>
            <HomeIcon />
          </Button>
          <Button onClick={handleSave} disabled={save.getId() == "save_demo"}>
            <SaveIcon />
          </Button>
          <Button onClick={handleOpenSettings}>
            <SettingsIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};
