import type { FormEvent } from "react";
import { useKernelContext } from "@/core";
import { type SaverDTOInterface, SaverFormTypeSchema } from "@/core/libs/saver";
import { Button, FieldText, Fieldset, Form, useFormErrors } from "@/ui/system";

interface SaverFormComponentProps {
  saver: SaverDTOInterface;
}

export const SaverFormComponent = ({ saver }: SaverFormComponentProps) => {
  const { operations } = useKernelContext();

  const { fieldErrors, setZodErrors, clearErrors, hasErrors } = useFormErrors();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();

    const formData = new FormData(e.currentTarget);

    const formValues = {
      name: formData.get("save-name"),
    };

    const validationResult = SaverFormTypeSchema.safeParse(formValues);

    if (!validationResult.success) {
      setZodErrors(validationResult.error);
      return;
    }

    saver.hydrate(validationResult.data);
    operations.onSaveUpdate(saver.getSave());
  };

  const formActions = (
    <Button type="submit" width="full">
      Sauvegarder
    </Button>
  );

  return (
    <Form className="save-form" onSubmit={handleSubmit} actions={formActions} error={hasErrors}>
      <Fieldset>
        <FieldText label="Nom du diagramme" htmlFor="save-name" defaultValue={saver.getName()} error={fieldErrors.name} />
      </Fieldset>
    </Form>
  );
};
