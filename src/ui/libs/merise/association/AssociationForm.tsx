import { type FormEvent, Fragment } from "react";
import { AssociationFormTypeSchema, type MeriseAssociationInterface, useMeriseContext } from "@/libs/merise";
import { Button, FieldSelect, FieldText, Fieldset, Form, useFormErrors } from "@/ui/system";

interface AssociationFormComponentProps {
  association: MeriseAssociationInterface;
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

  const formActions = <Button type="submit">Sauvegarder</Button>;

  return (
    <Form onSubmit={handleSubmit} actions={formActions} error={hasErrors}>
      <Fieldset variant="horizontal">
        <FieldSelect label="Emoji" htmlFor="association-emoji" defaultValue={association.getEmoji()} options={emojiOptions} error={fieldErrors.emoji} />
        <FieldText label="Nom" htmlFor="association-name" defaultValue={association.getName()} placeholder={association.getName()} error={fieldErrors.name} />
      </Fieldset>
      <Fieldset legend="Champs">
        {association.getFields().map((field) => (
          <Fragment key={`association-field-${field.getId()}`}>{field.renderComponent()}</Fragment>
        ))}
      </Fieldset>
    </Form>
  );
};
