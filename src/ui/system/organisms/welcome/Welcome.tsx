import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { type KernelSeed, KernelSeedTypeEnum } from "@/core";
import { Button } from "../../atoms";
import "./welcome.scss";

interface WelcomeProps {
  seedDispatcher: React.Dispatch<React.SetStateAction<KernelSeed | null>>;
}

export const Welcome = ({ seedDispatcher }: WelcomeProps) => {
  const [localStorageKeys, setLocalStorageKeys] = useState<string[]>([]);

  useEffect(() => {
    const saves = [];

    for (let i = 0; i < localStorage.length; i++) {
      const currentKey = localStorage.key(i);

      if (currentKey) {
        saves.push(currentKey);
      }
    }

    setLocalStorageKeys(saves);
  }, []);

  const handleSelectNewSeed = () => {
    seedDispatcher({
      id: uuidv4(),
      type: KernelSeedTypeEnum.NEW,
    });
  };

  const handleSelectLocalSeed = (seedId: string) => {
    seedDispatcher({
      id: seedId,
      type: KernelSeedTypeEnum.SAVE_LOCAL,
    });
  };

  return (
    <div className="welcome">
      <div className="welcome__header">
        <Button onClick={handleSelectNewSeed}>Nouveau diagramme</Button>
      </div>
      <div className="welcome__saves">
        <h2>Sauvegardes locales</h2>
        <table className="welcome__saves__table">
          <colgroup>
            <col className="welcome__saves__table__col--key" />
            <col className="welcome__saves__table__col--actions" />
          </colgroup>
          <thead>
            <tr>
              <th>Clé</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="welcome__saves__table__rows">
            {localStorageKeys.length > 0 &&
              localStorageKeys.map((localKey) => (
                <tr key={`welcome__saves__table__rows-${localKey}`} className="welcome__saves__table__rows__item">
                  <td className="welcome__saves__table__rows__item--key">{localKey}</td>
                  <td className="welcome__saves__table__rows__item--actions">
                    <Button onClick={() => handleSelectLocalSeed(localKey)}>Ouvrir</Button>
                  </td>
                </tr>
              ))}
            {localStorageKeys.length === 0 && (
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
