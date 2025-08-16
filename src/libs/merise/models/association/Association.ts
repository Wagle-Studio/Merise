import { createElement } from "react";
import { AssociationComponent, AssociationFormComponent } from "@/ui";
import { type MeriseAssociationInterface, type MeriseFieldInterface, MeriseItemTypeEnum } from "../../types";
import AbstractMeriseItem from "./../AbstractMeriseItem";
import { type AssociationFormType } from "./AssociationFormSchema";

export default class Association extends AbstractMeriseItem implements MeriseAssociationInterface {
  private flowId: string;
  private name: string;
  private emoji: string;
  private fields: MeriseFieldInterface[] = [];

  constructor(flowId: string, name: string) {
    super(MeriseItemTypeEnum.ASSOCIATION);
    this.flowId = flowId;
    this.name = name;
    this.emoji = "🆕";
  }

  hydrate = (formData: AssociationFormType): void => {
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

  renderComponent = (): React.ReactElement => {
    return createElement(AssociationComponent, { association: this });
  };

  renderFormComponent = (): React.ReactElement => {
    return createElement(AssociationFormComponent, {
      association: this,
    });
  };

  private setName = (name: string): void => {
    this.name = name;
  };

  private setEmoji = (emoji: string): void => {
    this.emoji = emoji;
  };
}
