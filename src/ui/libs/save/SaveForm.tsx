import type { FormEvent } from "react";
import { format } from "date-fns";
import { useKernelContext } from "@/core";
import { type SaveDTOInterface, SaveFormTypeSchema } from "@/core/libs/save";
import { Button, FieldText, Fieldset, Form, SaveIcon, useFormErrors } from "@/ui/system";

interface SaveFormComponentProps {
  save: SaveDTOInterface;
}

export const SaveFormComponent = ({ save }: SaveFormComponentProps) => {
  const { operations } = useKernelContext();

  const { fieldErrors, setZodErrors, clearErrors, hasErrors } = useFormErrors();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();

    const formData = new FormData(e.currentTarget);

    const formValues = {
      name: formData.get("save-name"),
    };

    const validationResult = SaveFormTypeSchema.safeParse(formValues);

    if (!validationResult.success) {
      setZodErrors(validationResult.error);
      return;
    }

    save.hydrate(validationResult.data);
    operations.onSaveUpdate(save.getSave());
  };

  const formActions = (
    <Button type="submit" width="full">
      <SaveIcon /> Sauvegarder
    </Button>
  );

  return (
    <Form className="save-form" onSubmit={handleSubmit} actions={formActions} error={hasErrors}>
      <Fieldset>
        <FieldText label="Nom du diagramme" htmlFor="save-name" defaultValue={save.getName()} error={fieldErrors.name} />
      </Fieldset>
      <Fieldset>
        <p>
          <span className="field-text__label">Création : </span>
          {format(save.getCreated(), "dd/MM/yyyy k:mm")}
        </p>
        <p>
          <span className="field-text__label">Modification : </span>
          {format(save.getUpdated(), "dd/MM/yyyy k:mm")}
        </p>
      </Fieldset>
    </Form>
  );
};
