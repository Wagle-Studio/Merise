import type { ZodError } from "zod";
import { MeriseRelationCardinalityTypeEnum, type MeriseRelationInterface, type MeriseResult } from "@/libs/merise";
import type { RelationFormType } from "@/libs/merise/models/relation/RelationFormSchema";
import { Button, FieldSelect, Form } from "@/ui/system";

interface RelationFormComponentProps {
  relation: MeriseRelationInterface;
  onSubmit: (formData: RelationFormType) => MeriseResult<RelationFormType, ZodError>;
}

export const RelationFormComponent = ({ onSubmit, relation }: RelationFormComponentProps) => {
  const handleSubmit = () => {
    const cardinalitySelect = document.getElementById("relation-cardinality") as HTMLSelectElement;
    const cardinality = cardinalitySelect?.value as MeriseRelationCardinalityTypeEnum;

    const saveResult = onSubmit({ cardinality });

    if (!saveResult.success && saveResult.error) {
      console.log(saveResult.error.issues);
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

  const formActions = <Button onClick={handleSubmit}>Sauvegarder</Button>;

  return (
    <Form actions={formActions}>
      <FieldSelect label="Cardinalité" htmlFor="relation-cardinality" defaultValue={relation.getCardinality() || MeriseRelationCardinalityTypeEnum.ZERO_N} options={cardinalityOptions} />
    </Form>
  );
};
