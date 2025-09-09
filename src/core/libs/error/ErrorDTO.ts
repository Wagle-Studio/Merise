import type { SeverityType } from "./ErrorTypes";

export default class ErrorDTO extends Error {
  readonly type: SeverityType;

  constructor(type: SeverityType, message: string) {
    super(message);
    this.type = type;
  }
}
