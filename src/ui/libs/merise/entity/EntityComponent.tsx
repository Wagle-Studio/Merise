import clsx from "clsx";
import type { MeriseEntityInterface } from "@/libs/merise";
import { useMeriseContext } from "@/libs/merise";
import { KeyIcon } from "@/ui/system";
import "./entity.scss";

interface EntityComponentProps {
  entity: MeriseEntityInterface;
}

export const EntityComponent = ({ entity }: EntityComponentProps) => {
  const { operations } = useMeriseContext();

  return (
    <div className="entity" onClick={() => operations.onEntitySelect(entity)}>
      <div className="entity__header">
        <p className="entity__header__title">
          {entity.getEmoji()} {entity.getName()}
        </p>
      </div>
      {entity.getFields().length > 0 && (
        <div className="entity__body">
          <table className="entity__body__field-table">
            <colgroup>
              <col className="entity__body__field-table__col--key" />
              <col className="entity__body__field-table__col--name" />
            </colgroup>
            <tbody className="entity__body__field-table__rows">
              {entity.getFields().length > 0 &&
                entity.getFields().map((field) => (
                  <tr key={`entity-field-table__row-${field.getId()}`} className="entity__body__field-table__rows__item">
                    <td className={`entity__body__field-table__rows__item--key--${field.isPrimary() ? "primary" : "foreign"}`}>{field.isPrimary() && <KeyIcon />}</td>
                    <td className={clsx("entity__body__field-table__rows__item--name", { "entity__body__field-table__rows__item--name--unique": field.isUnique() })}>{field.getName()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
