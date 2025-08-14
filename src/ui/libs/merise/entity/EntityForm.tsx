import type { ZodError } from "zod";
import type { MeriseEntityInterface, MeriseResult } from "@/libs/merise";
import type { EntityFormType } from "@/libs/merise/models/entity/EntityFormSchema";
import { Button, FieldSelect, FieldText, Fieldset, Form } from "@/ui/system";

interface EntityFormComponentProps {
  entity: MeriseEntityInterface;
  onSubmit: (formData: EntityFormType) => MeriseResult<EntityFormType, ZodError>;
}

export const EntityFormComponent = ({ entity, onSubmit }: EntityFormComponentProps) => {
  const handleSubmit = () => {
    const nameInput = document.getElementById("entity-name") as HTMLInputElement;
    const emojiSelect = document.getElementById("entity-emoji") as HTMLSelectElement;

    const name = nameInput?.value;
    const emoji = emojiSelect?.value;

    const saveResult = onSubmit({ name, emoji });

    if (!saveResult.success && saveResult.error) {
      console.log(saveResult.error.issues);
    }
  };

  const emojiOptions = [
    {
      value: "📚",
      label: "📚",
    },
    {
      value: "👤",
      label: "👤",
    },
    {
      value: "📖",
      label: "📖",
    },
  ];

  const formActions = <Button onClick={handleSubmit}>Sauvegarder</Button>;

  return (
    <Form actions={formActions}>
      <Fieldset variant="horizontal">
        <FieldSelect label="Emoji" htmlFor="entity-emoji" defaultValue={entity.getEmoji()} options={emojiOptions} />
        <FieldText label="Nom" htmlFor="entity-name" defaultValue={entity.getName()} placeholder={entity.getName()} />
      </Fieldset>
    </Form>
  );
};
