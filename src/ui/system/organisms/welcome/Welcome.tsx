import { useKernelContext } from "@/core/kernel/KernelContext";
import { type SaveRawDTOObject } from "@/core/libs/save";
import { Button, GithubIcon, LocalSaveTable, Tag } from "@/ui";
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
        <div className="welcome__header__top">
          <h1>Merise</h1>
          <div className="welcome__header__actions">
            <Button onClick={handleSaveCreate}>Nouveau diagramme</Button>
          </div>
        </div>
        <div className="welcome__header__bottom">
          <Tag>V 1.0</Tag>
          <a href="https://github.com/Wagle-Studio/Merise" target="_blank" title="GitHub">
            <GithubIcon size="medium" />
          </a>
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
