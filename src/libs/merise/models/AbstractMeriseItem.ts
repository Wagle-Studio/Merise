import { v4 as uuidv4 } from "uuid";
import type { MeriseItemType } from "../types";

export default abstract class AbstractMeriseItem {
  private id: string;
  private type: MeriseItemType;

  constructor(type: MeriseItemType, id?: string) {
    this.id = id ?? uuidv4();
    this.type = type;
  }

  getId = (): string => {
    return this.id;
  };

  getType = (): MeriseItemType => {
    return this.type;
  };
}
