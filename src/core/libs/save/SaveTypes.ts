import type { CoreResult } from "@/core";
import type { NormalizeManagerInterface } from "@/core/libs/normalize";
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
  setSettingsDTO: (settings: SettingsDTOInterface) => void;
  setFlowDTO: (flow: FlowDTOInterface) => void;
  setMeriseDTO: (merise: MeriseDTOInterface) => void;
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
  initDemo: () => void;
  clearSave: () => void;
  createSave: () => CoreResult<string, null>;
  openSave: (saveId: string) => CoreResult<Save, null>;
  updateSave: (saveDTO: SaveDTOInterface) => void;
  removeSave: (saveId: string) => void;
  saveCurrent: (
    settings: SettingsDTOInterface,
    flow: FlowDTOInterface,
    merise: MeriseDTOInterface
  ) => CoreResult<null, null>;
  getCurrentSave: () => CoreResult<SaveDTOInterface, null>;
  updateCurrentSave: (saveDTO: SaveDTOInterface) => void;
  hasUnsavedChanges: (
    settings: SettingsDTOInterface,
    flow: FlowDTOInterface,
    merise: MeriseDTOInterface,
    normalizer: NormalizeManagerInterface
  ) => CoreResult<boolean, null>;
  findLocalSaves: () => CoreResult<SaveRawDTOObject[], null>;
}
