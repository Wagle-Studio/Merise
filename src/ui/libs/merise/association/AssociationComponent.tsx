import clsx from "clsx";
import { useDomainContext } from "@/core/domain";
import type { Association } from "@/libs/merise";
import { KeyIcon } from "@/ui";
import "./association.scss";

interface AssociationComponentProps {
  association: Association;
}

export const AssociationComponent = ({ association }: AssociationComponentProps) => {
  const { operations } = useDomainContext();

  return (
    <div className="association" onClick={() => operations.handleDialogAssociationEdit(association)}>
      <div className="association__header">
        <p className="association__header__title">
          {association.getEmoji()} {association.getName()}
        </p>
      </div>
      {association.getFields().length > 0 && (
        <div className="association__body">
          <table className="association__body__field-table">
            <colgroup>
              <col className="association__body__field-table__col--key" />
              <col className="association__body__field-table__col--name" />
            </colgroup>
            <tbody className="association__body__field-table__rows">
              {association.getFields().map((field) => (
                <tr
                  key={`association-field-table__row-${field.getId()}`}
                  className="association__body__field-table__rows__item"
                >
                  <td
                    className={`association__body__field-table__rows__item--key--${field.isPrimary() ? "primary" : "foreign"}`}
                  >
                    {field.isPrimary() && <KeyIcon />}
                  </td>
                  <td
                    className={clsx("association__body__field-table__rows__item--name", {
                      "association__body__field-table__rows__item--name--unique": field.isUnique(),
                    })}
                  >
                    {field.getName()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
