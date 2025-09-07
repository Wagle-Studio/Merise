import type { SettingsDTO, SettingsDTOInterface } from "@/core/libs/settings";
import type { FlowDTOInterface, FlowDTOObject } from "@/libs/flow";
import type { MeriseDTOInterface, MeriseDTOObject } from "@/libs/merise";
import type { SaveFormType } from "./SaveFormSchema";

// Interface for a raw save that will be parsed to build a clean save
export interface SaveStoreItemRaw {
  id: string;
  name: string;
  settings: SettingsDTO;
  flow: FlowDTOObject;
  merise: MeriseDTOObject;
  created: Date;
  updated: Date;
}

// Interface for a save that will provide data to the application
export interface SaveStoreItem {
  id: string;
  name: string;
  settings: SettingsDTOInterface;
  flow: FlowDTOInterface;
  merise: MeriseDTOInterface;
  created: Date;
  updated: Date;
}

// Contract for the Save DTO implementation
export interface SaveDTOInterface {
  hydrate: (formData: SaveFormType) => void;
  getSave: () => SaveStoreItem;
  getId: () => string;
  getName: () => string;
  getSettings: () => SettingsDTOInterface;
  getFlow: () => FlowDTOInterface;
  getMerise: () => MeriseDTOInterface;
  getCreated: () => Date;
  getUpdated: () => Date;
  cloneWithUpdatedSave: (save: SaveStoreItem) => SaveDTOInterface;
  renderFormComponent: () => React.ReactElement;
}

// Dispatcher type for updating the save state
export type SaveDispatcher = React.Dispatch<React.SetStateAction<SaveDTOInterface>>;

// Contract for the save manager implementation
export interface SaveManagerInterface {
  getCurrentSave: () => SaveDTOInterface;
  updateCurrentSave: (save: SaveStoreItem) => void;
  save: () => void;
}
