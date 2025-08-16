import type React from "react";
import type { SettingsFormType } from "./SettingsFormSchema";

// Interface defining settings type
export interface Settings {
  background: SettingsBackgroundType;
}

// List of all available settings enums
export enum SettingsBackgroundType {
  BLANK = "Blanc",
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
}
