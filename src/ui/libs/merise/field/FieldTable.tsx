import { type MeriseFieldInterface, useMeriseContext } from "@/libs/merise";
import { Button, CheckedIcon, EditIcon, KeyIcon, TrashIcon, UnCheckedIcon } from "@/ui/system";
import "./field.scss";

interface FieldTableComponentProps {
  fields: MeriseFieldInterface[];
  onSelect: (field: MeriseFieldInterface) => void;
}

export const FieldTableComponent = ({ fields, onSelect }: FieldTableComponentProps) => {
  const { operations } = useMeriseContext();

  const handleFieldSelect = (field: MeriseFieldInterface): void => {
    onSelect(field);
  };

  const handleFieldDelete = (field: MeriseFieldInterface): void => {
    operations.onFieldDelete(field);
  };

  return (
    <table className="field-table">
      <colgroup>
        <col className="field-table__col--key" />
        <col className="field-table__col--name" />
        <col className="field-table__col--type" />
        <col className="field-table__col--nullable" />
        <col className="field-table__col--unique" />
        <col className="field-table__col--actions" />
      </colgroup>
      <thead>
        <tr>
          <th>Clé</th>
          <th>Nom</th>
          <th>Type</th>
          <th>Nullable</th>
          <th>Unique</th>
          <th></th>
        </tr>
      </thead>
      {fields.length > 0 && (
        <tbody className="field-table__rows">
          {fields.length > 0 &&
            fields.map((field) => (
              <tr key={`field-table__row-${field.getId()}`} className="field-table__rows__item">
                <td className={`field-table__rows__item--key--${field.isPrimary() ? "primary" : "foreign"}`}>{field.isPrimary() && <KeyIcon />}</td>
                <td className="field-table__rows__item--name">{field.getName()}</td>
                <td>{field.getTypeField()}</td>
                <td>
                  {field.isNullable() && <CheckedIcon />}
                  {!field.isNullable() && <UnCheckedIcon />}
                </td>
                <td>
                  {field.isUnique() && <CheckedIcon />}
                  {!field.isUnique() && <UnCheckedIcon />}
                </td>
                <td className="field-table__rows__item--actions">
                  <Button variant="invisible" onClick={() => handleFieldSelect(field)}>
                    <EditIcon />
                  </Button>
                  <Button variant="invisible" onClick={() => handleFieldDelete(field)}>
                    <TrashIcon />
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      )}
    </table>
  );
};
