import { useKernelContext } from "@/core/kernel/KernelContext";
import { type SaveRawDTOObject } from "@/core/libs/save";
import { LocalSaveTable } from "@/ui";
import { Button } from "../../atoms";
import "./welcome.scss";

export const Welcome = () => {
  const { operations, dependencies } = useKernelContext();

  operations.initDemo();

  const getLocalSavesResult = dependencies.getLocalSaves();

  const handleSaveCreate = () => operations.handleSaveCreate();
  const handleSaveOpen = (save: SaveRawDTOObject) => operations.handleSaveOpen(save.id);
  const handleSaveSelect = (save: SaveRawDTOObject) => operations.handleDialogSaveEdit(save.id);
  const handleSaveRemove = (save: SaveRawDTOObject) => operations.handleDialogSaveRemove(save.id);

  return (
    <div className="welcome">
      <div className="welcome__header">
        <h1>Merise</h1>
        <div className="welcome__header__actions">
          <Button onClick={handleSaveCreate}>Nouveau diagramme</Button>
        </div>
      </div>
      <div className="welcome__saves">
        {getLocalSavesResult.success && (
          <LocalSaveTable
            saves={getLocalSavesResult.data}
            handleSaveOpen={handleSaveOpen}
            handleSaveSelect={handleSaveSelect}
            handleSaveRemove={handleSaveRemove}
          />
        )}
      </div>
    </div>
  );
};
