import { createElement } from "react";
import type { SettingsDTOInterface } from "@/core/libs/settings";
import type { FlowDTOInterface } from "@/libs/flow";
import type { MeriseDTOInterface } from "@/libs/merise";
import { SaveFormComponent } from "@/ui/libs/save";
import type { SaveFormType } from "./SaveFormSchema";
import type { SaveDTOInterface, SaveStoreItem } from "./SaveTypes";

export default class SaveDTO implements SaveDTOInterface {
  private save: SaveStoreItem;

  constructor(save: SaveStoreItem) {
    this.save = save;
  }

  hydrate = (formData: SaveFormType): void => {
    this.save.name = formData.name;
  };

  getSave = (): SaveStoreItem => {
    return this.save;
  };

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

  cloneWithUpdatedSave = (save: SaveStoreItem): SaveDTOInterface => {
    return new SaveDTO(save);
  };

  renderFormComponent = (): React.ReactElement => {
    return createElement(SaveFormComponent, { save: this });
  };
}
