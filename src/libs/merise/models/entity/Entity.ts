import { createElement } from "react";
import { EntityComponent, EntityFormComponent } from "@/ui";
import { type MeriseEntityInterface, MeriseItemTypeEnum } from "../../types";
import AbstractMeriseItem from "../AbstractMeriseItem";
import { type EntityFormType } from "./EntityFormSchema";

export default class Entity extends AbstractMeriseItem implements MeriseEntityInterface {
  private emoji: string;

  constructor(flowId: string) {
    super(flowId, MeriseItemTypeEnum.ENTITY);
    this.emoji = "🆕";
  }

  hydrate = (formData: EntityFormType): void => {
    this.setName(formData.name);
    this.setEmoji(formData.emoji);
  };

  getEmoji = (): string => {
    return this.emoji;
  };

  renderComponent = (): React.ReactElement => {
    return createElement(EntityComponent, { entity: this });
  };

  renderFormComponent = (): React.ReactElement => {
    return createElement(EntityFormComponent, { entity: this });
  };

  private setEmoji = (emoji: string): void => {
    this.emoji = emoji;
  };
}
