import type { FormEvent } from "react";
import type { ZodError } from "zod";
import type { MeriseAssociationInterface, MeriseResult } from "@/libs/merise";
import type { AssociationFormType } from "@/libs/merise/models/association/AssociationFormSchema";
import { Button, FieldSelect, FieldText, Fieldset, Form } from "@/ui/system";
import { useFormErrors } from "@/ui/system/form/useFormErrors";

interface AssociationFormComponentProps {
  association: MeriseAssociationInterface;
  onSubmit: (formData: AssociationFormType) => MeriseResult<AssociationFormType, ZodError>;
}

export const AssociationFormComponent = ({ association, onSubmit }: AssociationFormComponentProps) => {
  const { fieldErrors, setZodErrors, clearErrors, hasErrors } = useFormErrors();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("association-name") as string;
    const emoji = formData.get("association-emoji") as string;

    const saveResult = onSubmit({ name, emoji });

    if (!saveResult.success && saveResult.error) {
      setZodErrors(saveResult.error);
    }
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
    </Form>
  );
};
