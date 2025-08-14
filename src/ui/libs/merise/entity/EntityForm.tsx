import type { FormEvent } from "react";
import type { ZodError } from "zod";
import type { MeriseEntityInterface, MeriseResult } from "@/libs/merise";
import type { EntityFormType } from "@/libs/merise/models/entity/EntityFormSchema";
import { Button, FieldSelect, FieldText, Fieldset, Form } from "@/ui/system";
import { useFormErrors } from "@/ui/system/form/useFormErrors";

interface EntityFormComponentProps {
  entity: MeriseEntityInterface;
  onSubmit: (formData: EntityFormType) => MeriseResult<EntityFormType, ZodError>;
}

export const EntityFormComponent = ({ entity, onSubmit }: EntityFormComponentProps) => {
  const { fieldErrors, setZodErrors, clearErrors, hasErrors } = useFormErrors();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("entity-name") as string;
    const emoji = formData.get("entity-emoji") as string;

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

  const formActions = <Button type="submit">Sauvegarder</Button>;

  return (
    <Form onSubmit={handleSubmit} actions={formActions} error={hasErrors}>
      <Fieldset variant="horizontal">
        <FieldSelect label="Emoji" htmlFor="entity-emoji" defaultValue={entity.getEmoji()} options={emojiOptions} error={fieldErrors.emoji} />
        <FieldText label="Nom" htmlFor="entity-name" defaultValue={entity.getName()} placeholder={entity.getName()} error={fieldErrors.name} />
      </Fieldset>
    </Form>
  );
};
