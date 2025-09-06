import type { MeriseItemType } from "../types";

export default abstract class AbstractMeriseItem {
  private id: string;
  private type: MeriseItemType;

  constructor(type: MeriseItemType, id: string) {
    this.id = id;
    this.type = type;
  }

  getId = (): string => {
    return this.id;
  };

  getType = (): MeriseItemType => {
    return this.type;
  };
}
