import { format } from "date-fns";
import { type SaveRawDTOObject } from "@/core/libs/save";
import { Button, EditIcon, TrashIcon } from "../../atoms";
import "./localSaveTable.scss";

interface LocalSaveTableProps {
  saves: SaveRawDTOObject[];
  handleSaveOpen: (save: SaveRawDTOObject) => void;
  handleSaveSelect: (save: SaveRawDTOObject) => void;
  handleSaveRemove: (save: SaveRawDTOObject) => void;
}

export const LocalSaveTable = ({ saves, handleSaveOpen, handleSaveSelect, handleSaveRemove }: LocalSaveTableProps) => {
  return (
    <div className="local_saves">
      <h2>Sauvegardes locales</h2>
      <table className="local_saves__table">
        <colgroup>
          <col className="local_saves__table__col--name" />
          <col className="local_saves__table__col--updated" />
          <col className="local_saves__table__col--actions" />
        </colgroup>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Modification</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="local_saves__table__rows">
          {saves.length > 0 &&
            saves.map((save) => (
              <tr key={`local_saves__table__rows-${save.id}`} className="local_saves__table__rows__item">
                <td className="local_saves__table__rows__item--name">{save.name}</td>
                <td className="local_saves__table__rows__item--updated">{format(save.updated, "dd/MM/yyyy k:w")}</td>
                <td className="local_saves__table__rows__item--actions">
                  <div className="local_saves__table__rows__item__actions">
                    <Button onClick={() => handleSaveSelect(save)} disabled={save.id === "save_demo"}>
                      <EditIcon />
                    </Button>
                    <Button onClick={() => handleSaveRemove(save)} disabled={save.id === "save_demo"}>
                      <TrashIcon />
                    </Button>
                    <Button onClick={() => handleSaveOpen(save)}>Ouvrir</Button>
                  </div>
                </td>
              </tr>
            ))}
          {saves.length === 0 && (
            <tr className="local_saves__table__rows__item">
              <td className="local_saves__table__rows__item--empty">Aucune sauvegarde</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
