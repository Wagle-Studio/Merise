import type { FormEvent } from "react";
import { useDomainContext } from "@/core/domain/DomainContext";
import { MeriseRelationCardinalityTypeEnum, Relation, RelationFormTypeSchema } from "@/libs/merise";
import { Button, FieldSelect, Form, SaveIcon, useFormErrors } from "@/ui/system";

interface RelationFormComponentProps {
  relation: Relation;
}

export const RelationFormComponent = ({ relation }: RelationFormComponentProps) => {
  const { operations } = useDomainContext();
  const { fieldErrors, setZodErrors, clearErrors, hasErrors } = useFormErrors();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();

    const formData = new FormData(e.currentTarget);

    const formValues = {
      cardinality: formData.get("relation-cardinality") as MeriseRelationCardinalityTypeEnum,
    };

    const validationResult = RelationFormTypeSchema.safeParse(formValues);

    if (!validationResult.success) {
      setZodErrors(validationResult.error);
      return;
    }

    relation.hydrate(validationResult.data);
    operations.handleRelationUpdate(relation);
  };

  const cardinalityOptions = [
    {
      value: MeriseRelationCardinalityTypeEnum.ZERO_ONE,
      label: "0,1 - Optionnel, unique",
    },
    {
      value: MeriseRelationCardinalityTypeEnum.ONE_ONE,
      label: "1,1 - Obligatoire, unique",
    },
    {
      value: MeriseRelationCardinalityTypeEnum.ZERO_N,
      label: "0,N - Optionnel, multiple",
    },
    {
      value: MeriseRelationCardinalityTypeEnum.ONE_N,
      label: "1,N - Obligatoire, multiple",
    },
  ];

  const formActions = (
    <Button type="submit">
      <SaveIcon /> Sauvegarder
    </Button>
  );

  return (
    <Form onSubmit={handleSubmit} actions={formActions} error={hasErrors}>
      <FieldSelect
        label="Cardinalité"
        htmlFor="relation-cardinality"
        defaultValue={relation.getCardinality()}
        options={cardinalityOptions}
        error={fieldErrors.cardinality}
      />
    </Form>
  );
};
