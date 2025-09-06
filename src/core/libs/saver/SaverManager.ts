import type { FlowDTOInterface } from "@/libs/flow";
import type { MeriseDTOInterface } from "@/libs/merise";
import type { SaverManagerInterface, SaverStoreItem } from "./SaverTypes";

export default class SaverManager implements SaverManagerInterface {
  constructor(
    private save: SaverStoreItem,
    private getFlow: () => FlowDTOInterface,
    private getMerise: () => MeriseDTOInterface
  ) {}

  onSave = () => {
    const save = {
      id: this.save.id,
      name: this.save.name,
      data: {
        flow: JSON.stringify(this.getFlow()),
        merise: JSON.stringify(this.getMerise()),
      },
      created: this.save.created,
      updated: new Date(),
    };

    localStorage.setItem(save.id, JSON.stringify(save));
  };
}
