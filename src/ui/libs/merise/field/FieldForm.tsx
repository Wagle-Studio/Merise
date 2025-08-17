import { type ChangeEvent, type FormEvent, useMemo, useState } from "react";
import { FieldFormTypeSchema, type MeriseFieldInterface, type MeriseFieldTypeOption, MeriseFieldTypeTypeEnum, type MeriseFormType, MeriseFormTypeEnum, useMeriseContext } from "@/libs/merise";
import { Button, FieldCheckbox, FieldSelect, FieldText, Fieldset, Form, useFormErrors } from "@/ui/system";
import { type FieldConfig, type FieldOptionUnion, type TextOptionValue, buildConfigFromField, buildDefaultConfig, fieldTypeRegistry } from "./FieldTypeRegistry";

interface FieldFormComponentProps {
  field: MeriseFieldInterface;
  formType: MeriseFormType;
}

export const FieldFormComponent = ({ field, formType }: FieldFormComponentProps) => {
  const initial = useMemo(() => buildConfigFromField(field), [field]);
  const [config, setConfig] = useState<FieldConfig>(initial);

  const { operations } = useMeriseContext();
  const { fieldErrors, setZodErrors, clearErrors, hasErrors } = useFormErrors();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();

    const formData = new FormData(e.currentTarget);

    let optionPayload: MeriseFieldTypeOption | null = null;

    switch (config.type) {
      case MeriseFieldTypeTypeEnum.TEXT: {
        const o = config.options as TextOptionValue;
        optionPayload = { variant: o.variant, maxLength: o.maxLength } as unknown as MeriseFieldTypeOption;
        break;
      }
      case MeriseFieldTypeTypeEnum.NUMBER:
      case MeriseFieldTypeTypeEnum.DATE:
      case MeriseFieldTypeTypeEnum.OTHER: {
        const o = config.options as Extract<FieldOptionUnion, { variant: string }>;
        optionPayload = o.variant as unknown as MeriseFieldTypeOption;
        break;
      }
      default:
        optionPayload = null;
    }

    const formValues = {
      name: formData.get("field-name") as string,
      type: config.type,
      option: optionPayload,
      primary: formData.get("field-primary") === "on",
      nullable: formData.get("field-nullable") === "on",
      unique: formData.get("field-unique") === "on",
    };

    const validationResult = FieldFormTypeSchema.safeParse(formValues);

    if (!validationResult.success) {
      setZodErrors(validationResult.error);
      return;
    }

    field.hydrate(validationResult.data);

    if (formType === MeriseFormTypeEnum.CREATE) operations.onFieldCreate(field);
    if (formType === MeriseFormTypeEnum.UPDATE) operations.onFieldUpdate(field);

    e.currentTarget.reset();

    setConfig(buildConfigFromField(field));
  };

  const handleSelectTypeChanges = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextType = e.target.value as MeriseFieldTypeTypeEnum;
    setConfig(buildDefaultConfig(nextType));
  };

  const typeOptions = [
    { value: MeriseFieldTypeTypeEnum.TEXT, label: "Texte" },
    { value: MeriseFieldTypeTypeEnum.NUMBER, label: "Nombre" },
    { value: MeriseFieldTypeTypeEnum.DATE, label: "Date" },
    { value: MeriseFieldTypeTypeEnum.OTHER, label: "Autres" },
  ];

  const entry = fieldTypeRegistry[config.type];
  const OptionForm = entry.OptionForm;

  const formActions = (
    <Button type="submit" width="full">
      Sauvegarder
    </Button>
  );

  return (
    <Form onSubmit={handleSubmit} actions={formActions} error={hasErrors}>
      <Fieldset legend="Identité">
        <FieldText label="Nom" htmlFor="field-name" defaultValue={field.getName() ?? ""} placeholder={field.getName() ?? "Nom du champ"} error={fieldErrors.name} />
      </Fieldset>
      <Fieldset legend="Champ">
        <FieldSelect label="Type" labelDisplay={false} htmlFor="field-type" defaultValue={config.type} options={typeOptions} error={fieldErrors.type} onChange={handleSelectTypeChanges} />
        <OptionForm key={`option-form-${config.type}`} value={config.options as any} onChange={(next) => setConfig((prev) => ({ ...prev, options: next }))} />
      </Fieldset>
      <Fieldset legend="Propriétés" variant="horizontal">
        <FieldCheckbox label="Clé primaire" htmlFor="field-primary" defaultChecked={field.isPrimary()} error={fieldErrors.primary} />
        <FieldCheckbox label="Nullable" htmlFor="field-nullable" defaultChecked={field.isNullable()} error={fieldErrors.nullable} />
        <FieldCheckbox label="Unique" htmlFor="field-unique" defaultChecked={field.isUnique()} error={fieldErrors.unique} />
      </Fieldset>
    </Form>
  );
};
