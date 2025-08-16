import { createElement } from "react";
import { EntityComponent, EntityFormComponent } from "@/ui";
import { type MeriseEntityInterface, type MeriseFieldInterface, MeriseItemTypeEnum } from "../../types";
import AbstractMeriseItem from "../AbstractMeriseItem";
import { type EntityFormType } from "./EntityFormSchema";

export default class Entity extends AbstractMeriseItem implements MeriseEntityInterface {
  private flowId: string;
  private name: string;
  private emoji: string;
  private fields: MeriseFieldInterface[] = [];

  constructor(flowId: string, name: string) {
    super(MeriseItemTypeEnum.ENTITY);
    this.flowId = flowId;
    this.name = name;
    this.emoji = "🆕";
  }

  hydrate = (formData: EntityFormType): void => {
    this.setName(formData.name);
    this.setEmoji(formData.emoji);
  };

  getFlowId = (): string => {
    return this.flowId;
  };

  getName = (): string => {
    return this.name;
  };

  getEmoji = (): string => {
    return this.emoji;
  };

  getFields = (): MeriseFieldInterface[] => {
    return this.fields;
  };

  addField = (field: MeriseFieldInterface): void => {
    this.fields = [...this.fields, field];
  };

  deleteField = (field: MeriseFieldInterface): void => {
    const index = this.fields.findIndex((f) => f.getId() === field.getId());
    this.fields = [...this.fields.filter((_, i) => i !== index)];
  };

  renderComponent = (): React.ReactElement => {
    return createElement(EntityComponent, { entity: this });
  };

  renderFormComponent = (): React.ReactElement => {
    return createElement(EntityFormComponent, { entity: this });
  };

  private setName = (name: string): void => {
    this.name = name;
  };

  private setEmoji = (emoji: string): void => {
    this.emoji = emoji;
  };
}
