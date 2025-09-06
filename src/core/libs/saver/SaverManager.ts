import type { FlowDTOInterface } from "@/libs/flow";
import type { MeriseDTOInterface } from "@/libs/merise";
import type { SaverManagerInterface } from "./SaverTypes";

export default class SaverManager implements SaverManagerInterface {
  constructor(
    private getFlow: () => FlowDTOInterface,
    private getMerise: () => MeriseDTOInterface
  ) {}

  onSave = () => {
    // const saveId = uuidv4();
    const saveId = "123";

    const save = {
      id: saveId,
      data: {
        flow: {
          nodes: this.getFlow().getStringifiedNodes(),
          edges: this.getFlow().getStringifiedEdges(),
        },
        merise: {
          entities: this.getMerise().getStringifiedEntities(),
          associations: this.getMerise().getStringifiedAssociations(),
          relations: this.getMerise().getStringifiedRelations(),
        },
      },
    };

    localStorage.setItem(saveId, JSON.stringify(save));
  };
}
