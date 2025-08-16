import type { FormEvent } from "react";
import { FieldFormTypeSchema, type MeriseFieldInterface, MeriseFieldTypeTypeEnum, useMeriseContext } from "@/libs/merise";
import { Button, FieldCheckbox, FieldSelect, FieldText, Fieldset, Form, useFormErrors } from "@/ui/system";

interface FieldFormComponentProps {
  field: MeriseFieldInterface;
}

export const FieldFormComponent = ({ field }: FieldFormComponentProps) => {
  const { operations } = useMeriseContext();

  const { fieldErrors, setZodErrors, clearErrors, hasErrors } = useFormErrors();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();

    const formData = new FormData(e.currentTarget);

    const formValues = {
      name: formData.get("field-name") as string,
      type: formData.get("field-type") as MeriseFieldTypeTypeEnum,
      primary: formData.get("field-primary") === "on",
      nullable: formData.get("field-nullable") === "on",
      unique: formData.get("field-unique") === "on",
    };

    const validationResult = FieldFormTypeSchema.safeParse(formValues);

    if (!validationResult.success) {
      setZodErrors(validationResult.error);
      return;
    }

    field.hydrate(validationResult.data);
    operations.onFieldCreate(field);
    e.currentTarget.reset();
  };

  const typeOptions = [
    {
      value: MeriseFieldTypeTypeEnum.TEXT,
      label: "Texte",
    },
    {
      value: MeriseFieldTypeTypeEnum.NUMBER,
      label: "Nombre",
    },
    {
      value: MeriseFieldTypeTypeEnum.DATE,
      label: "Date",
    },
    {
      value: MeriseFieldTypeTypeEnum.BOOLEAN,
      label: "Boolean",
    },
  ];

  const formActions = <Button type="submit">Sauvegarder</Button>;

  return (
    <Form onSubmit={handleSubmit} actions={formActions} error={hasErrors}>
      <Fieldset legend="Identité">
        <FieldText label="Nom" htmlFor="field-name" defaultValue={field.getName() ?? ""} placeholder={field.getName() ?? "Nom du champ"} error={fieldErrors.name} />
      </Fieldset>
      <Fieldset legend="Champ">
        <FieldSelect label="Type" htmlFor="field-type" defaultValue={field.getTypeField() ?? ""} options={typeOptions} error={fieldErrors.type} />
      </Fieldset>
      <Fieldset legend="Propriétés">
        <FieldCheckbox label="Clé primaire" htmlFor="field-primary" defaultChecked={field.isPrimary()} error={fieldErrors.primary} />
        <FieldCheckbox label="Nullable" htmlFor="field-nullable" defaultChecked={field.isNullable()} error={fieldErrors.nullable} />
        <FieldCheckbox label="Unique" htmlFor="field-unique" defaultChecked={field.isUnique()} error={fieldErrors.unique} />
      </Fieldset>
    </Form>
  );
};
