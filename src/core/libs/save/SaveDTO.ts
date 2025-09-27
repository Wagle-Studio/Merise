import { createElement } from "react";
import { SettingsDTO, type SettingsDTOInterface } from "@/core/libs/settings";
import { FlowDTO, type FlowDTOInterface } from "@/libs/flow";
import { MeriseDTO, type MeriseDTOInterface } from "@/libs/merise";
import { SaveFormComponent } from "@/ui/libs/save";
import type { SaveFormType } from "./SaveFormSchema";
import type { Save, SaveDTOInterface, SaveDTOObject } from "./SaveTypes";

export default class SaveDTO implements SaveDTOInterface {
  private save: Save;

  constructor(save: Save) {
    this.save = save;
  }

  static fromRaw = (raw: SaveDTOObject): SaveDTOInterface => {
    return new SaveDTO({
      id: raw.id,
      name: raw.name,
      settings: SettingsDTO.fromRaw(raw.settings),
      flow: FlowDTO.fromRaw(raw.flow),
      merise: MeriseDTO.fromRaw(raw.merise),
      created: raw.created,
      updated: raw.updated,
    });
  };

  static cloneWithUpdatedSave = (save: Save): SaveDTOInterface => {
    return new SaveDTO(save);
  };

  hydrate = (formData: SaveFormType): void => {
    this.save.name = formData.name;
    this.save.updated = new Date();
  };

  getSave = (): Save => {
    return this.save;
  };

  getId = (): string => {
    return this.save.id;
  };

  getName = (): string => {
    return this.save.name;
  };

  getSettingsDTO = (): SettingsDTOInterface => {
    return this.save.settings;
  };

  getFlowDTO = (): FlowDTOInterface => {
    return this.save.flow;
  };

  getMeriseDTO = (): MeriseDTOInterface => {
    return this.save.merise;
  };

  setSettingsDTO = (settingsDTO: SettingsDTOInterface): void => {
    this.save.settings = settingsDTO;
  };

  setFlowDTO = (flowDTO: FlowDTOInterface): void => {
    this.save.flow = flowDTO;
  };

  setMeriseDTO = (meriseDTO: MeriseDTOInterface): void => {
    this.save.merise = meriseDTO;
  };

  getCreated = (): Date => {
    return this.save.created;
  };

  getUpdated = (): Date => {
    return this.save.updated;
  };

  renderFormComponent = (isCurrentSave: boolean = true): React.ReactElement => {
    return createElement(SaveFormComponent, { save: this, isCurrentSave });
  };
}
