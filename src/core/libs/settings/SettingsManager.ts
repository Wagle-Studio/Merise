import type {
  Settings,
  SettingsDTOInterface,
  SettingsDispatcher,
  SettingsManagerInterface,
  SettingsThemeType,
} from "./SettingsTypes";
import { SettingsThemeType as SettingsThemeTypeEnum } from "./SettingsTypes";

export default class SettingsManager implements SettingsManagerInterface {
  private static instance: SettingsManager;
  private unbindSystem?: () => void;

  private constructor(
    private getSettings: () => SettingsDTOInterface,
    private setSettings: SettingsDispatcher
  ) {}

  static getInstance = (getSettings: () => SettingsDTOInterface, setSettings: SettingsDispatcher) => {
    if (!this.instance) {
      this.instance = new SettingsManager(getSettings, setSettings);
    }

    return this.instance;
  };

  getCurrentSettings = (): SettingsDTOInterface => {
    return this.getSettings();
  };

  updateSettings = (settings: Settings) => {
    this.setSettings((prev) => prev.cloneWithUpdatedSettings(settings));
    this.applyTheme(settings.theme);

    if (this.unbindSystem) {
      this.unbindSystem();
      this.unbindSystem = undefined;
    }

    if (settings.theme === SettingsThemeTypeEnum.SYSTEM) {
      this.unbindSystem = this.bindSystemListener(settings.theme);
    }
  };

  applyTheme = (theme: SettingsThemeType): void => {
    const eff = this.resolve(theme);
    const root = document.documentElement;
    root.dataset.theme = eff;
    root.style.colorScheme = eff;
  };

  bindSystemListener = (theme: SettingsThemeType): (() => void) => {
    if (theme !== SettingsThemeTypeEnum.SYSTEM) return () => {};

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => this.applyTheme(SettingsThemeTypeEnum.SYSTEM);
    mq.addEventListener("change", handler);

    return () => mq.removeEventListener("change", handler);
  };

  private resolve = (theme: SettingsThemeType): SettingsThemeType => {
    if (theme === SettingsThemeTypeEnum.SYSTEM) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? SettingsThemeTypeEnum.DARK
        : SettingsThemeTypeEnum.LIGHT;
    }

    return theme === SettingsThemeTypeEnum.DARK ? SettingsThemeTypeEnum.DARK : SettingsThemeTypeEnum.LIGHT;
  };
}
