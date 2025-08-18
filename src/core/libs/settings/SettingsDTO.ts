import { createElement } from "react";
import { SettingsFormComponent } from "@/ui/libs/settings";
import { SettingsDefault } from "./SettingsDefault";
import type { SettingsFormType } from "./SettingsFormSchema";
import type { Settings, SettingsDTOInterface } from "./SettingsTypes";

export default class SettingsDTO implements SettingsDTOInterface {
  private settings: Settings;

  constructor(settings: Settings = SettingsDefault) {
    this.settings = settings;
  }

  hydrate = (formData: SettingsFormType): void => {
    this.settings.theme = formData.theme;
    this.settings.background = formData.background;
  };

  getSettings = (): Settings => {
    return this.settings;
  };

  cloneWithUpdatedSettings = (settings: Settings): SettingsDTOInterface => {
    return new SettingsDTO(settings);
  };

  renderFormComponent = (): React.ReactElement => {
    return createElement(SettingsFormComponent, { settings: this });
  };
}
