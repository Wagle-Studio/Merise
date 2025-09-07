import { createElement } from "react";
import { AssociationComponent, AssociationFormComponent } from "@/ui";
import { type MeriseAssociation, type MeriseAssociationInterface, type MeriseFieldInterface, MeriseItemTypeEnum } from "../../types";
import Field from "../field/Field";
import AbstractMeriseItem from "./../AbstractMeriseItem";
import { type AssociationFormType } from "./AssociationFormSchema";

export default class Association extends AbstractMeriseItem implements MeriseAssociationInterface {
  private flowId: string;
  private name: string;
  private emoji: string;
  private fields: MeriseFieldInterface[];

  constructor(id: string, flowId: string, name: string, fields: MeriseFieldInterface[] = [], emoji: string = "🆕") {
    super(MeriseItemTypeEnum.ASSOCIATION, id);
    this.flowId = flowId;
    this.name = name;
    this.fields = fields;
    this.emoji = emoji;
  }

  static fromRaw = (raw: MeriseAssociation): Association => {
    const fields = raw.fields.map((f) => Field.fromRaw(f));

    return new Association(raw.id, raw.flowId, raw.name, fields, raw.emoji);
  };

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

  updateField = (field: MeriseFieldInterface): void => {
    const index = this.fields.findIndex((f) => f.getId() === field.getId());
    const updatedFieds = this.fields;
    updatedFieds[index] = field;
    this.fields = [...updatedFieds];
  };

  deleteField = (field: MeriseFieldInterface): void => {
    const index = this.fields.findIndex((f) => f.getId() === field.getId());
    this.fields = [...this.fields.filter((_, i) => i !== index)];
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
