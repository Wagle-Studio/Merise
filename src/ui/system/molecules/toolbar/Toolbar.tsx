import { useDomainContext } from "@/core/domain/DomainContext";
import { useKernelContext } from "@/core/kernel/KernelContext";
import { AddIcon, Button, EditIcon, HomeIcon, SaveIcon, SettingsIcon } from "../../atoms";
import "./toolbar.scss";

export const Toolbar = () => {
  const kernel = useKernelContext();
  const domain = useDomainContext();

  const getCurrentSaveResult = kernel.dependencies.getCurrentSave();
  const isSaveDemo = getCurrentSaveResult.success && getCurrentSaveResult.data.getId() == "save_demo";

  const navigateToHome = domain.operations.handleNavigateToHome;
  const save = domain.operations.handleSaveCurrent;
  const createEntity = domain.operations.handleEntityCreate;
  const createAssociation = domain.operations.handleAssociationCreate;
  const dialogSaveEdit = kernel.operations.handleDialogSaveEditCurrent;
  const dialogSettingsEdit = kernel.operations.handleDialogSettingsEdit;

  return (
    <div className="toolbar">
      {getCurrentSaveResult.success && (
        <div className="toolbar__wrapper">
          <div className="toolbar__left">
            <Button onClick={createEntity}>
              <AddIcon /> Entité
            </Button>
            <Button onClick={createAssociation}>
              <AddIcon /> Association
            </Button>
          </div>
          <div className="toolbar__center">
            <p>{getCurrentSaveResult.data.getName()}</p>
          </div>
          <div className="toolbar__right">
            <Button onClick={navigateToHome}>
              <HomeIcon />
            </Button>
            <Button onClick={save} disabled={isSaveDemo}>
              <SaveIcon />
            </Button>
            <Button onClick={dialogSaveEdit} disabled={isSaveDemo}>
              <EditIcon />
            </Button>
            <Button onClick={dialogSettingsEdit}>
              <SettingsIcon />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
