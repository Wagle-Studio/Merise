import { type FormEvent } from "react";
import { useDomainContext } from "@/core/domain";
import { Entity, EntityFormTypeSchema } from "@/libs/merise";
import { Button, FieldSelect, FieldTableComponent, FieldText, Fieldset, Form, SaveIcon, useFormErrors } from "@/ui";

interface EntityFormComponentProps {
  entity: Entity;
}

export const EntityFormComponent = ({ entity }: EntityFormComponentProps) => {
  const { operations } = useDomainContext();
  const { fieldErrors, setZodErrors, clearErrors, hasErrors } = useFormErrors();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();

    const formData = new FormData(e.currentTarget);

    const formValues = {
      name: formData.get("entity-name") as string,
      emoji: formData.get("entity-emoji") as string,
    };

    const validationResult = EntityFormTypeSchema.safeParse(formValues);

    if (!validationResult.success) {
      setZodErrors(validationResult.error);
      return;
    }

    entity.hydrate(validationResult.data);
    operations.handleEntityUpdate(entity);
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

  const formActions = (
    <Button type="submit">
      <SaveIcon /> Sauvegarder
    </Button>
  );

  return (
    <Form onSubmit={handleSubmit} actions={formActions} error={hasErrors}>
      <Fieldset variant="horizontal" legend="Identité">
        <FieldSelect
          label="Emoji"
          labelDisplay={false}
          htmlFor="entity-emoji"
          defaultValue={entity.getEmoji()}
          options={emojiOptions}
          error={fieldErrors.emoji}
        />
        <FieldText
          label="Nom"
          labelDisplay={false}
          htmlFor="entity-name"
          defaultValue={entity.getName()}
          placeholder={entity.getName()}
          error={fieldErrors.name}
        />
      </Fieldset>
      <Fieldset legend="Champs">
        <FieldTableComponent fields={entity.getFields()} />
      </Fieldset>
    </Form>
  );
};
