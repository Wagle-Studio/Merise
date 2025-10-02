import type { ChangeEvent } from "react";
import { FieldTypeOtherOptionEnum } from "@/libs/merise";
import { FieldRadio } from "@/ui/system";
import type { OtherOptionValue } from "./../FieldTypeRegistry";

interface FieldTypeOtherFormProps {
  value: OtherOptionValue;
  onChange: (next: OtherOptionValue) => void;
}

export const FieldTypeOtherFormComponent = ({ value, onChange }: FieldTypeOtherFormProps) => {
  const typeOptions = [{ value: FieldTypeOtherOptionEnum.BOOLEAN, label: "Boolean" }];

  const handleVariant = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ variant: e.target.value as FieldTypeOtherOptionEnum });
  };

  return (
    <FieldRadio
      key={`other-variant-${value.variant}`}
      label="Type de champ autre"
      htmlFor="field-type-other-option"
      defaultValue={value.variant}
      options={typeOptions}
      onChange={handleVariant}
    />
  );
};
