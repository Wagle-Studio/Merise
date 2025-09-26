import { FlowSeverityTypeEnum } from "@/libs/flow";
import { MeriseSeverityTypeEnum } from "@/libs/merise";
import ErrorDTO from "./ErrorDTO";
import type { ErrorFailResultType, ErrorManagerInterface } from "./ErrorTypes";
import { SeverityType as ErrorSeverityTypeEnum } from "./ErrorTypes";

export default class ErrorManager implements ErrorManagerInterface {
  private static instance: ErrorManager;

  private constructor() {}

  static getInstance = () => {
    if (!this.instance) {
      this.instance = new ErrorManager();
    }

    return this.instance;
  };

  mapResultError = (resultFail: ErrorFailResultType): ErrorDTO => {
    switch (resultFail.severity) {
      case FlowSeverityTypeEnum.INFO:
      case MeriseSeverityTypeEnum.INFO:
        return new ErrorDTO(ErrorSeverityTypeEnum.INFO, resultFail.message);
      case FlowSeverityTypeEnum.WARNING:
      case MeriseSeverityTypeEnum.WARNING:
        return new ErrorDTO(ErrorSeverityTypeEnum.WARNING, resultFail.message);
      case FlowSeverityTypeEnum.ERROR:
      case MeriseSeverityTypeEnum.ERROR:
        return new ErrorDTO(ErrorSeverityTypeEnum.ERROR, resultFail.message);
      default:
        return new ErrorDTO(ErrorSeverityTypeEnum.ERROR, "Anomalie dans le système d'erreur");
    }
  };
}
