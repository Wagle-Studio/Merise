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
      data: {
        flow: JSON.stringify(this.getFlow()),
        merise: JSON.stringify(this.getMerise()),
      },
    };

    localStorage.setItem(save.id, JSON.stringify(save));
  };
}
