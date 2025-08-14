import { v4 as uuidv4 } from "uuid";
import type { MeriseItemType } from "../types";

export default abstract class AbstractMeriseItem {
  private id: string;
  private flowId: string;
  private type: MeriseItemType;
  private name: string;

  constructor(flowId: string, type: MeriseItemType) {
    this.id = uuidv4();
    this.flowId = flowId;
    this.type = type;
    this.name = type;
  }

  abstract renderComponent(): React.ReactElement;
  abstract renderFormComponent(): React.ReactElement;

  getId = (): string => {
    return this.id;
  };

  getFlowId = (): string => {
    return this.flowId;
  };

  getType = (): MeriseItemType => {
    return this.type;
  };

  getName = (): string => {
    return this.name;
  };

  protected setName = (name: string): void => {
    this.name = name;
  };
}
