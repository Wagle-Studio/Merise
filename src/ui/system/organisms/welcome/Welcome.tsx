import { useKernelContext } from "@/core/kernel";
import { Button, GithubIcon, LocalSaveTable, Tag } from "@/ui";
import "./welcome.scss";

export const Welcome = () => {
  const { operations, dependencies } = useKernelContext();
  const getLocalSavesResult = dependencies.getLocalSaves();

  operations.initDemo();

  return (
    <div className="welcome">
      <div className="welcome__header">
        <div className="welcome__header__top">
          <h1>Merise</h1>
          <div className="welcome__header__actions">
            <Button onClick={operations.handleSaveCreate}>Nouveau diagramme</Button>
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
            handleSaveOpen={(save) => operations.handleSaveOpen(save.id)}
            handleSaveSelect={(save) => operations.handleDialogSaveEdit(save.id)}
            handleSaveRemove={(save) => operations.handleDialogSaveRemove(save.id)}
          />
        )}
      </div>
    </div>
  );
};
