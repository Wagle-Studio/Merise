import { useEffect, useState } from "react";
import { useKernelContext } from "@/core";
import { type SaveRawDTOObject } from "@/core/libs/save";
import { LocalSaveTable } from "@/ui";
import { Button } from "../../atoms";
import "./welcome.scss";

export const Welcome = () => {
  const [localSaves, setLocalSaves] = useState<SaveRawDTOObject[]>([]);

  const { operations, dependencies } = useKernelContext();

  useEffect(() => {
    const findLocalSavesResult = dependencies.findLocalSaves();

    // TODO : handle error
    if (!findLocalSavesResult.success) return;

    setLocalSaves(findLocalSavesResult.data);
  }, []);

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
    operations.onSaveRemove(save);
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
        <LocalSaveTable saves={localSaves} handleSaveOpen={handleSaveOpen} handleSaveSelect={handleSaveSelect} handleSaveRemove={handleSaveRemove} />
      </div>
    </div>
  );
};
