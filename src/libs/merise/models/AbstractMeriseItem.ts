import { v4 as uuidv4 } from "uuid";
import type { MeriseDependencies, MeriseItemType } from "../types";

export default abstract class AbstractMeriseItem {
  readonly id: string;
  readonly flowId: string;
  readonly type: MeriseItemType;
  protected dependencies?: MeriseDependencies;
  name: string;

  constructor(flowId: string, type: MeriseItemType, dependencies: MeriseDependencies) {
    this.id = uuidv4();
    this.name = type;
    this.flowId = flowId;
    this.type = type;
    this.dependencies = dependencies;
  }

  abstract handleSelection(): void;
  abstract renderComponent(): React.ReactElement;
  abstract renderFormComponent(): React.ReactElement;

  getName = (): string => {
    return this.name;
  };

  setName = (name: string): void => {
    this.name = name;
  };
}
