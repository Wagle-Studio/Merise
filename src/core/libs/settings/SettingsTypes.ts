import type React from "react";
import type { SettingsFormType } from "./SettingsFormSchema";

// Interface defining settings object
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

// Contract for the Settings DTO implementation
export interface SettingsDTOInterface {
  hydrate: (formData: SettingsFormType) => void;
  getSettings: () => Settings;
  cloneWithUpdatedSettings: (settings: Settings) => SettingsDTOInterface;
  renderFormComponent: () => React.ReactElement;
}

// Interface for a Settings DTO object
export interface SettingsDTOObject {
  settings: {
    theme: SettingsThemeType;
    background: SettingsBackgroundType;
  };
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
