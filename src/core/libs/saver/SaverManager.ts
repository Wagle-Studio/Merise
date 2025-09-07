import type { SettingsDTOInterface } from "@/core/libs/settings";
import type { FlowDTOInterface } from "@/libs/flow";
import type { MeriseDTOInterface } from "@/libs/merise";
import type { SaverDTOInterface, SaverDispatcher, SaverManagerInterface, SaverStoreItem } from "./SaverTypes";

export default class SaverManager implements SaverManagerInterface {
  constructor(
    private getSave: () => SaverDTOInterface,
    private setSave: SaverDispatcher,
    private getSettings: () => SettingsDTOInterface,
    private getFlow: () => FlowDTOInterface,
    private getMerise: () => MeriseDTOInterface
  ) {}

  getCurrentSave = (): SaverDTOInterface => {
    return this.getSave();
  };

  updateCurrentSave = (save: SaverStoreItem) => {
    this.setSave((prev) => prev.cloneWithUpdatedSave(save));
  };

  save = () => {
    const save = {
      id: this.getSave().getId(),
      name: this.getSave().getName(),
      settings: JSON.stringify(this.getSettings()),
      flow: JSON.stringify(this.getFlow()),
      merise: JSON.stringify(this.getMerise()),
      created: this.getSave().getCreated(),
      updated: new Date(),
    };

    localStorage.setItem(save.id, JSON.stringify(save));
  };
}
