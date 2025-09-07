import type { FlowDTOInterface } from "@/libs/flow";
import type { MeriseDTOInterface } from "@/libs/merise";
import type { SettingsDTOInterface } from "../settings";
import type { SaverDTOInterface, SaverStoreItem } from "./SaverTypes";

export default class SaverDTO implements SaverDTOInterface {
  private save: SaverStoreItem;

  constructor(save: SaverStoreItem) {
    this.save = save;
  }

  getId = (): string => {
    return this.save.id;
  };

  getName = (): string => {
    return this.save.name;
  };

  getSettings = (): SettingsDTOInterface => {
    return this.save.settings;
  };

  getFlow = (): FlowDTOInterface => {
    return this.save.flow;
  };

  getMerise = (): MeriseDTOInterface => {
    return this.save.merise;
  };

  getCreated = (): Date => {
    return this.save.created;
  };

  getUpdated = (): Date => {
    return this.save.updated;
  };

  cloneWithUpdatedSave = (save: SaverStoreItem): SaverDTOInterface => {
    return new SaverDTO(save);
  };
}
