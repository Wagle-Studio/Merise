import type { SettingsDTOInterface } from "@/core/libs/settings";
import type { FlowDTOInterface } from "@/libs/flow";
import type { MeriseDTOInterface } from "@/libs/merise";
import type { SaveDTOInterface, SaveDispatcher, SaveManagerInterface, SaveStoreItem } from "./SaveTypes";

export default class SaveManager implements SaveManagerInterface {
  constructor(
    private getSave: () => SaveDTOInterface,
    private setSave: SaveDispatcher,
    private getSettings: () => SettingsDTOInterface,
    private getFlow: () => FlowDTOInterface,
    private getMerise: () => MeriseDTOInterface
  ) {}

  getCurrentSave = (): SaveDTOInterface => {
    return this.getSave();
  };

  updateCurrentSave = (save: SaveStoreItem) => {
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
