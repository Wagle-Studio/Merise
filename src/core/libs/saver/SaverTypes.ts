import type { SettingsDTO, SettingsDTOInterface } from "@/core/libs/settings";
import type { FlowDTOInterface, FlowDTOObject } from "@/libs/flow";
import type { MeriseDTOInterface, MeriseDTOObject } from "@/libs/merise";

// Interface for a raw save that will be parsed to build a clean save
export interface SaverStoreItemRaw {
  id: string;
  name: string;
  settings: SettingsDTO;
  flow: FlowDTOObject;
  merise: MeriseDTOObject;
  created: Date;
  updated: Date;
}

// Interface for a save that will provide data to the application
export interface SaverStoreItem {
  id: string;
  name: string;
  settings: SettingsDTOInterface;
  flow: FlowDTOInterface;
  merise: MeriseDTOInterface;
  created: Date;
  updated: Date;
}

// Contract for the Saver DTO implementation
export interface SaverDTOInterface {
  getId: () => string;
  getName: () => string;
  getSettings: () => SettingsDTOInterface;
  getFlow: () => FlowDTOInterface;
  getMerise: () => MeriseDTOInterface;
  getCreated: () => Date;
  getUpdated: () => Date;
  cloneWithUpdatedSave: (save: SaverStoreItem) => SaverDTOInterface;
}

// Contract for the saver manager implementation
export interface SaverManagerInterface {
  save: () => void;
}
