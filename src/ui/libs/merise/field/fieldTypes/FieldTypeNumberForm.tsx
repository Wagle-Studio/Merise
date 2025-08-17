import type { ChangeEvent } from "react";
import { FieldTypeNumberOptionEnum } from "@/libs/merise";
import { FieldRadio } from "@/ui/system";
import type { NumberOptionValue } from "./../FieldTypeRegistry";

interface FieldTypeNumberFormProps {
  value: NumberOptionValue;
  onChange: (next: NumberOptionValue) => void;
}

export const FieldTypeNumberFormComponent = ({ value, onChange }: FieldTypeNumberFormProps) => {
  const typeOptions = [
    { value: FieldTypeNumberOptionEnum.INTEGER, label: "Entier" },
    { value: FieldTypeNumberOptionEnum.FLOAT, label: "Décimal" },
    { value: FieldTypeNumberOptionEnum.COMPTER, label: "Compteur" },
  ];

  const handleVariant = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ variant: e.target.value as FieldTypeNumberOptionEnum });
  };

  return <FieldRadio key={`number-variant-${value.variant}`} label="Type de champ numérique" htmlFor="field-type-number-option" defaultValue={value.variant} options={typeOptions} onChange={handleVariant} />;
};
