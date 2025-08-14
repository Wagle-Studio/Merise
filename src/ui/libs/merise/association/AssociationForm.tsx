import type { ZodError } from "zod";
import type { MeriseAssociationInterface, MeriseResult } from "@/libs/merise";
import type { AssociationFormType } from "@/libs/merise/models/association/AssociationFormSchema";
import { Button, FieldSelect, FieldText, Fieldset, Form } from "@/ui/system";

interface AssociationFormComponentProps {
  association: MeriseAssociationInterface;
  onSubmit: (formData: AssociationFormType) => MeriseResult<AssociationFormType, ZodError>;
}

export const AssociationFormComponent = ({ association, onSubmit }: AssociationFormComponentProps) => {
  const handleSubmit = () => {
    const nameInput = document.getElementById("association-name") as HTMLInputElement;
    const emojiSelect = document.getElementById("association-emoji") as HTMLSelectElement;

    const name = nameInput?.value;
    const emoji = emojiSelect?.value;

    const saveResult = onSubmit({ name, emoji });

    if (!saveResult.success && saveResult.error) {
      console.log(saveResult.error.issues);
    }
  };

  const emojiOptions = [
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

  const formActions = <Button onClick={handleSubmit}>Sauvegarder</Button>;

  return (
    <Form actions={formActions}>
      <Fieldset variant="horizontal">
        <FieldSelect label="Emoji" htmlFor="association-emoji" defaultValue={association.getEmoji()} options={emojiOptions} />
        <FieldText label="Nom" htmlFor="association-name" defaultValue={association.getName()} placeholder={association.getName()} />
      </Fieldset>
    </Form>
  );
};
