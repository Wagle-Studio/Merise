import { createElement } from "react";
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

  renderComponent = (): React.ReactElement => {
    return createElement(EntityComponent, { entity: this });
  };

  renderFormComponent = (): React.ReactElement => {
    return createElement(EntityFormComponent, {
      entity: this,
      onSubmit: this.handleFormSubmit,
    });
  };
}
