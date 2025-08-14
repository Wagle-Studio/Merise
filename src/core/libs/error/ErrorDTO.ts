import type { ErrorType } from "./ErrorTypes";

export default class ErrorDTO extends Error {
  readonly type: ErrorType;

  constructor(type: ErrorType, message: string) {
    super(message);
    this.type = type;
  }
}
