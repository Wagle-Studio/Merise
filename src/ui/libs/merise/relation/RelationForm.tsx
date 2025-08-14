import type { FormEvent } from "react";
import type { ZodError } from "zod";
import { MeriseRelationCardinalityTypeEnum, type MeriseRelationInterface, type MeriseResult } from "@/libs/merise";
import type { RelationFormType } from "@/libs/merise/models/relation/RelationFormSchema";
import { Button, FieldSelect, Form } from "@/ui/system";
import { useFormErrors } from "@/ui/system/form/useFormErrors";

interface RelationFormComponentProps {
  relation: MeriseRelationInterface;
  onSubmit: (formData: RelationFormType) => MeriseResult<RelationFormType, ZodError>;
}

export const RelationFormComponent = ({ onSubmit, relation }: RelationFormComponentProps) => {
  const { fieldErrors, setZodErrors, clearErrors, hasErrors } = useFormErrors();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();

    const formData = new FormData(e.currentTarget);
    const cardinality = formData.get("relation-cardinality") as MeriseRelationCardinalityTypeEnum;

    const saveResult = onSubmit({ cardinality });

    if (!saveResult.success && saveResult.error) {
      setZodErrors(saveResult.error);
    }
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

  const formActions = <Button type="submit">Sauvegarder</Button>;

  return (
    <Form onSubmit={handleSubmit} actions={formActions} error={hasErrors}>
      <FieldSelect label="Cardinalité" htmlFor="relation-cardinality" defaultValue={relation.getCardinality() || MeriseRelationCardinalityTypeEnum.ZERO_N} options={cardinalityOptions} error={fieldErrors.cardinality} />
    </Form>
  );
};
