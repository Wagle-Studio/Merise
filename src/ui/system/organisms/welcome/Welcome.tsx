import { useEffect, useState } from "react";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { type KernelSeed, KernelSeedTypeEnum } from "@/core";
import type { SaverStoreItemRaw } from "@/core/libs/saver/SaverTypes";
import { Button } from "../../atoms";
import "./welcome.scss";

interface WelcomeProps {
  seedDispatcher: React.Dispatch<React.SetStateAction<KernelSeed | null>>;
}

export const Welcome = ({ seedDispatcher }: WelcomeProps) => {
  const [localSaves, setLocalSaves] = useState<SaverStoreItemRaw[]>([]);

  useEffect(() => {
    const saves: SaverStoreItemRaw[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const currentKey = localStorage.key(i);

      if (!currentKey) throw new Error("Impossible d'accéder aux sauvegardes locales");

      const currentSave = localStorage.getItem(currentKey);

      if (!currentSave) throw new Error("Impossible d'accéder aux sauvegardes locales");

      saves.push(JSON.parse(currentSave));
    }

    setLocalSaves(saves);
  }, []);

  const handleSelectNewSave = () => {
    seedDispatcher({
      id: uuidv4(),
      name: "Nouveau diagramme",
      type: KernelSeedTypeEnum.NEW,
      created: new Date(),
      updated: new Date(),
    });
  };

  const handleSelectLocalSave = (localSave: SaverStoreItemRaw) => {
    seedDispatcher({
      id: localSave.id,
      name: localSave.name,
      type: KernelSeedTypeEnum.SAVE_LOCAL,
      created: localSave.created,
      updated: localSave.created,
    });
  };

  return (
    <div className="welcome">
      <div className="welcome__header">
        <Button onClick={handleSelectNewSave}>Nouveau diagramme</Button>
      </div>
      <div className="welcome__saves">
        <h2>Sauvegardes locales</h2>
        <table className="welcome__saves__table">
          <colgroup>
            <col className="welcome__saves__table__col--name" />
            <col className="welcome__saves__table__col--updated" />
            <col className="welcome__saves__table__col--actions" />
          </colgroup>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Modification</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="welcome__saves__table__rows">
            {localSaves.length > 0 &&
              localSaves.map((save) => (
                <tr key={`welcome__saves__table__rows-${save.id}`} className="welcome__saves__table__rows__item">
                  <td className="welcome__saves__table__rows__item--name">{save.name}</td>
                  <td className="welcome__saves__table__rows__item--updated">{format(save.updated, "dd/MM/yyyy")}</td>
                  <td className="welcome__saves__table__rows__item--actions">
                    <Button onClick={() => handleSelectLocalSave(save)}>Ouvrir</Button>
                  </td>
                </tr>
              ))}
            {localSaves.length === 0 && (
              <tr className="welcome__saves__table__rows__item">
                <td className="welcome__saves__table__rows__item--empty">Aucune sauvegarde</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
