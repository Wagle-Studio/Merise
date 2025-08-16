import type { FormEvent } from "react";
import { useKernelContext } from "@/core";
import { SettingsBackgroundTypeEnum, type SettingsDTOInterface, SettingsFormTypeSchema } from "@/core/libs/settings";
import { Button, FieldSelect, Form, useFormErrors } from "@/ui/system";

interface SettingsFormComponentProps {
  settings: SettingsDTOInterface;
}

export const SettingsFormComponent = ({ settings }: SettingsFormComponentProps) => {
  const { operations } = useKernelContext();

  const { fieldErrors, setZodErrors, clearErrors, hasErrors } = useFormErrors();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();

    const formData = new FormData(e.currentTarget);

    const formValues = {
      background: formData.get("settings-background") as SettingsBackgroundTypeEnum,
    };

    const validationResult = SettingsFormTypeSchema.safeParse(formValues);

    if (!validationResult.success) {
      setZodErrors(validationResult.error);
      return;
    }

    settings.hydrate(validationResult.data);
    operations.onSettingsUpdate(settings.getSettings());
  };

  const backgroundOptions = [
    {
      value: SettingsBackgroundTypeEnum.BLANK,
      label: "Blanc",
    },
    {
      value: SettingsBackgroundTypeEnum.GRID,
      label: "Grille",
    },
    {
      value: SettingsBackgroundTypeEnum.DOTT,
      label: "Points",
    },
  ];

  const formActions = (
    <Button type="submit" width="full">
      Sauvegarder
    </Button>
  );

  return (
    <Form className="settings-form" onSubmit={handleSubmit} actions={formActions} error={hasErrors}>
      <FieldSelect className="settings-form__select" label="Arrière-plan" htmlFor="settings-background" defaultValue={settings.getSettings().background} options={backgroundOptions} error={fieldErrors.background} />
    </Form>
  );
};
