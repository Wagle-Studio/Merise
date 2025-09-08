import type { CoreResult } from "@/core";
import type { SettingsDTOInterface, SettingsDTOObject } from "@/core/libs/settings";
import type { FlowDTOInterface, FlowDTOObject } from "@/libs/flow";
import type { MeriseDTOInterface, MeriseDTOObject } from "@/libs/merise";
import type { SaveFormType } from "./SaveFormSchema";

// Interface for a save that will provide data to the application
export interface Save {
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
  getSave: () => Save;
  getId: () => string;
  getName: () => string;
  getSettingsDTO: () => SettingsDTOInterface;
  getFlowDTO: () => FlowDTOInterface;
  getMeriseDTO: () => MeriseDTOInterface;
  getCreated: () => Date;
  getUpdated: () => Date;
  renderFormComponent: () => React.ReactElement;
}

// Interface for a raw Save DTO object
export interface SaveRawDTOObject {
  id: string;
  name: string;
  settings: string;
  flow: string;
  merise: string;
  created: Date;
  updated: Date;
}

// Interface for a clean Save DTO object
export interface SaveDTOObject {
  id: string;
  name: string;
  settings: SettingsDTOObject;
  flow: FlowDTOObject;
  merise: MeriseDTOObject;
  created: Date;
  updated: Date;
}

// Dispatcher type for updating the save state
export type SaveDispatcher = React.Dispatch<React.SetStateAction<SaveDTOInterface | null>>;

// Contract for the save manager implementation
export interface SaveManagerInterface {
  saveDemoInit: () => void;
  createSave: () => string;
  openSaveById: (saveId: string) => CoreResult<Save, null>;
  removeSave: (saveId: string) => void;
  saveCurrent: () => void;
  getCurrentSave: () => SaveDTOInterface | null;
  updateCurrentSave: (save: Save) => void;
  findLocalSaves: () => CoreResult<SaveRawDTOObject[], null>;
}
