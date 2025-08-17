import type { ChangeEvent } from "react";
import { FieldTypeDateOptionEnum } from "@/libs/merise";
import { FieldRadio } from "@/ui/system";
import type { DateOptionValue } from "./../FieldTypeRegistry";

interface FieldTypeDateFormProps {
  value: DateOptionValue;
  onChange: (next: DateOptionValue) => void;
}

export const FieldTypeDateFormComponent = ({ value, onChange }: FieldTypeDateFormProps) => {
  const typeOptions = [
    { value: FieldTypeDateOptionEnum.DATE, label: "Date" },
    { value: FieldTypeDateOptionEnum.TIME, label: "Heure" },
    { value: FieldTypeDateOptionEnum.DATETIME, label: "Date et heure" },
  ];

  const handleVariant = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ variant: e.target.value as FieldTypeDateOptionEnum });
  };

  return <FieldRadio key={`date-variant-${value.variant}`} label="Type de champ date" htmlFor="field-type-date-option" defaultValue={value.variant} options={typeOptions} onChange={handleVariant} />;
};
