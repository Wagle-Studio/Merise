import { useDomainContext } from "@/core/domain";
import { useKernelContext } from "@/core/kernel";
import { AddIcon, Button, EditIcon, HomeIcon, SaveIcon, SettingsIcon } from "@/ui";
import "./toolbar.scss";

export const Toolbar = () => {
  const kernel = useKernelContext();
  const domain = useDomainContext();

  const getCurrentSaveResult = kernel.dependencies.getCurrentSave();
  const isSaveDemo = getCurrentSaveResult.success && getCurrentSaveResult.data.getId() == "save_demo";

  return (
    <div className="toolbar">
      {getCurrentSaveResult.success && (
        <div className="toolbar__wrapper">
          <div className="toolbar__left">
            <Button onClick={domain.operations.handleEntityCreate}>
              <AddIcon /> Entité
            </Button>
            <Button onClick={domain.operations.handleAssociationCreate}>
              <AddIcon /> Association
            </Button>
          </div>
          <div className="toolbar__center">
            <p>{getCurrentSaveResult.data.getName()}</p>
          </div>
          <div className="toolbar__right">
            <Button onClick={domain.operations.handleNavigateToHome}>
              <HomeIcon />
            </Button>
            <Button onClick={domain.operations.handleSaveCurrent} disabled={isSaveDemo}>
              <SaveIcon />
            </Button>
            <Button onClick={kernel.operations.handleDialogSaveEditCurrent} disabled={isSaveDemo}>
              <EditIcon />
            </Button>
            <Button onClick={kernel.operations.handleDialogSettingsEdit}>
              <SettingsIcon />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
