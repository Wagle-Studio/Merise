import type React from "react";
import type { SettingsFormType } from "./SettingsFormSchema";

// Interface defining settings type
export interface Settings {
  theme: SettingsThemeType;
  background: SettingsBackgroundType;
}

// List of all available settings theme enums
export enum SettingsThemeType {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

// List of all available settings background enums
export enum SettingsBackgroundType {
  SOLID = "Uni",
  GRID = "Grille",
  DOTT = "Points",
}

// Interface defining the Settings DTO structure
export interface SettingsDTOInterface {
  hydrate: (formData: SettingsFormType) => void;
  getSettings: () => Settings;
  cloneWithUpdatedSettings: (settings: Settings) => SettingsDTOInterface;
  renderFormComponent: () => React.ReactElement;
}

// Dispatcher type for updating the settings state
export type SettingsDispatcher = React.Dispatch<React.SetStateAction<SettingsDTOInterface>>;

// Contract for the setting manager implementation
export interface SettingsManagerInterface {
  getCurrentSettings: () => SettingsDTOInterface;
  updateSettings: (settings: Settings) => void;
  applyTheme: (theme: SettingsThemeType) => void;
  bindSystemListener: (theme: SettingsThemeType) => () => void;
}
