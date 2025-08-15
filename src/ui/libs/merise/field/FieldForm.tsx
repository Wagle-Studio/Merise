import type { FormEvent } from "react";
import { FieldFormTypeSchema, type MeriseFieldInterface, useMeriseContext } from "@/libs/merise";
import { Button, FieldText, Form, useFormErrors } from "@/ui/system";

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
    };

    const validationResult = FieldFormTypeSchema.safeParse(formValues);

    if (!validationResult.success) {
      setZodErrors(validationResult.error);
      return;
    }

    field.hydrate(validationResult.data);
    operations.onFieldCreate(field);
  };

  const formActions = <Button type="submit">Sauvegarder</Button>;

  return (
    <Form onSubmit={handleSubmit} actions={formActions} error={hasErrors}>
      <FieldText label="Nom" htmlFor="field-name" defaultValue={field.getName()} placeholder={field.getName()} error={fieldErrors.name} />
    </Form>
  );
};
