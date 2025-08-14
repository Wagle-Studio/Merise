import type { ZodError, ZodSafeParseError } from "zod";
import { EntityComponent, EntityFormComponent } from "@/ui";
import { type MeriseDependencies, type MeriseEntityInterface, MeriseErrorTypeEnum, MeriseItemTypeEnum, type MeriseResult } from "../../types";
import AbstractMeriseItem from "../AbstractMeriseItem";
import { type EntityFormType, EntityFormTypeSchema } from "./EntityFormSchema";

export default class Entity extends AbstractMeriseItem implements MeriseEntityInterface {
  emoji: string;
  formError?: ZodSafeParseError<EntityFormType>;

  constructor(flowId: string, dependencies: MeriseDependencies) {
    super(flowId, MeriseItemTypeEnum.ENTITY, dependencies);
    this.emoji = "🆕";
  }

  handleSelection = (): void => {
    this.dependencies?.onEntitySelect(this);
  };

  handleFormSubmit = (formData: EntityFormType): MeriseResult<EntityFormType, ZodError> => {
    const validationResult = EntityFormTypeSchema.safeParse(formData);

    if (!validationResult.success) {
      this.setFormError(validationResult);

      return {
        success: false,
        message: "Formulaire invalide",
        severity: MeriseErrorTypeEnum.ERROR,
        error: validationResult.error,
      };
    }

    this.setName(formData.name);
    this.setEmoji(formData.emoji);

    this.dependencies?.onEntityUpdate(this);

    return {
      success: true,
      data: formData,
    };
  };

  getEmoji = (): string => {
    return this.emoji;
  };

  setEmoji = (emoji: string): void => {
    this.emoji = emoji;
  };

  getFormError = (): ZodSafeParseError<EntityFormType> | undefined => {
    return this.formError;
  };

  setFormError = (error: ZodSafeParseError<EntityFormType>): void => {
    this.formError = error;
  };

  renderComponent = (): React.ReactElement => {
    return EntityComponent(this);
  };

  renderFormComponent = (): React.ReactElement => {
    return EntityFormComponent({
      entity: this,
      onSubmit: this.handleFormSubmit,
    });
  };
}
