import { type FormEvent } from "react";
import { Association, AssociationFormTypeSchema, useMeriseContext } from "@/libs/merise";
import { Button, FieldSelect, FieldText, Fieldset, Form, SaveIcon, useFormErrors } from "@/ui/system";
import { FieldTableComponent } from "../field/FieldTable";

interface AssociationFormComponentProps {
  association: Association;
}

export const AssociationFormComponent = ({ association }: AssociationFormComponentProps) => {
  const { operations } = useMeriseContext();

  const { fieldErrors, setZodErrors, clearErrors, hasErrors } = useFormErrors();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();

    const formData = new FormData(e.currentTarget);

    const formValues = {
      name: formData.get("association-name") as string,
      emoji: formData.get("association-emoji") as string,
    };

    const validationResult = AssociationFormTypeSchema.safeParse(formValues);

    if (!validationResult.success) {
      setZodErrors(validationResult.error);
      return;
    }

    association.hydrate(validationResult.data);
    operations.onAssociationUpdate(association);
  };

  const emojiOptions = [
    {
      value: "🆕",
      label: "🆕",
    },
    {
      value: "📋",
      label: "📋",
    },
    {
      value: "📝",
      label: "📝",
    },
    {
      value: "🔍",
      label: "🔍",
    },
  ];

  const formActions = (
    <Button type="submit">
      <SaveIcon /> Sauvegarder
    </Button>
  );

  return (
    <Form onSubmit={handleSubmit} actions={formActions} error={hasErrors}>
      <Fieldset variant="horizontal" legend="Identité">
        <FieldSelect label="Emoji" labelDisplay={false} htmlFor="association-emoji" defaultValue={association.getEmoji()} options={emojiOptions} error={fieldErrors.emoji} />
        <FieldText label="Nom" labelDisplay={false} htmlFor="association-name" defaultValue={association.getName()} placeholder={association.getName()} error={fieldErrors.name} />
      </Fieldset>
      <Fieldset legend="Champs">
        <FieldTableComponent fields={association.getFields()} onSelect={operations.onFieldSelect} />
      </Fieldset>
    </Form>
  );
};
