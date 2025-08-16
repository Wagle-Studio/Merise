import type { Settings, SettingsDTOInterface, SettingsDispatcher, SettingsManagerInterface } from "./SettingsTypes";

export default class SettingsManager implements SettingsManagerInterface {
  constructor(
    private getSettings: () => SettingsDTOInterface,
    private setSettings: SettingsDispatcher
  ) {}

  getCurrentSettings = (): SettingsDTOInterface => {
    return this.getSettings();
  };

  updateSettings = (settings: Settings) => {
    this.setSettings((prev) => prev.cloneWithUpdatedSettings(settings));
  };
}
