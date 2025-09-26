import type { ChangeEvent } from "react";
import { FieldTypeTextOption } from "@/libs/merise";
import { FieldNumber, FieldRadio } from "@/ui/system";
import type { TextOptionValue } from "./../FieldTypeRegistry";

interface FieldTypeTextFormProps {
  value: TextOptionValue;
  onChange: (next: TextOptionValue) => void;
}

export const FieldTypeTextFormComponent = ({ value, onChange }: FieldTypeTextFormProps) => {
  const typeOptions = [
    { value: FieldTypeTextOption.VARIABLE, label: "Variable" },
    { value: FieldTypeTextOption.FIXED, label: "Fixe" },
    { value: FieldTypeTextOption.LONG, label: "Volumineux" },
  ];

  const handleVariant = (e: ChangeEvent<HTMLInputElement>) => {
    const variant = e.target.value as FieldTypeTextOption;
    onChange({
      variant,
      maxLength: variant === FieldTypeTextOption.LONG ? undefined : (value.maxLength ?? 50),
    });
  };

  const handleLength = (e: ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    onChange({
      variant: value.variant,
      maxLength: Number.isFinite(parsed) ? parsed : undefined,
    });
  };

  const needsLength = value.variant === FieldTypeTextOption.VARIABLE || value.variant === FieldTypeTextOption.FIXED;

  return (
    <>
      <FieldRadio
        key={`text-variant-${value.variant}`}
        label="Type de champ texte"
        htmlFor="field-type-text-option"
        defaultValue={value.variant}
        options={typeOptions}
        onChange={handleVariant}
      />
      <FieldNumber
        label="Longueur max"
        htmlFor="field-type-text-length"
        defaultValue={(value.maxLength ?? 50).toString()}
        onChange={handleLength}
        disabled={!needsLength}
      />
    </>
  );
};
