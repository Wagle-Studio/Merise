import type { ErrorType } from "./ErrorTypes";

export default class ErrorDTO extends Error {
  readonly type: ErrorType;
  readonly message: string;

  constructor(type: ErrorType, message: string) {
    super();
    this.type = type;
    this.message = message;
  }
}
