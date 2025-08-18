import type { Settings } from "./SettingsTypes";
import { SettingsBackgroundType as SettingsBackgroundTypeEnum, SettingsThemeType as SettingsThemeTypeEnum } from "./SettingsTypes";

export const SettingsDefault: Settings = {
  theme: SettingsThemeTypeEnum.LIGHT,
  background: SettingsBackgroundTypeEnum.DOTT,
};
