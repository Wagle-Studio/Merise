import { useKernelContext } from "@/core";
import { type SaveRawDTOObject } from "@/core/libs/save";
import { LocalSaveTable } from "@/ui";
import { Button } from "../../atoms";
import "./welcome.scss";

interface WelcomeProps {
  localSavesResult: SaveRawDTOObject[];
}

export const Welcome = ({ localSavesResult }: WelcomeProps) => {
  const { operations } = useKernelContext();

  const handleSelectNewSave = () => {
    operations.onSaveCreate();
  };

  const handleSaveOpen = (save: SaveRawDTOObject) => {
    operations.onSaveOpen(save.id);
  };

  const handleSaveSelect = (save: SaveRawDTOObject) => {
    operations.onSaveSelect(save.id);
  };

  const handleSaveRemove = (save: SaveRawDTOObject) => {
    operations.onSaveRemove(save.id, save.name);
  };

  return (
    <div className="welcome">
      <div className="welcome__header">
        <h1>Merise</h1>
        <div className="welcome__header__actions">
          <Button onClick={handleSelectNewSave}>Nouveau diagramme</Button>
        </div>
      </div>
      <div className="welcome__saves">
        <LocalSaveTable saves={localSavesResult} handleSaveOpen={handleSaveOpen} handleSaveSelect={handleSaveSelect} handleSaveRemove={handleSaveRemove} />
      </div>
    </div>
  );
};
