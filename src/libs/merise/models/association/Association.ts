import { createElement } from "react";
import { AssociationComponent, AssociationFormComponent } from "@/ui";
import { type MeriseAssociation, type MeriseAssociationInterface, type MeriseFieldInterface, MeriseItemTypeEnum, type MeriseResult, MeriseSeverityTypeEnum } from "../../types";
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

  updateFields = (field: MeriseFieldInterface): void => {
    this.fields = this.fields.map((f) => (f.getId() === field.getId() ? field : f));
  };

  deleteField = (field: MeriseFieldInterface): MeriseResult<null, null> => {
    const index = this.fields.findIndex((f) => f.getId() === field.getId());

    if (index === -1) {
      return {
        success: false,
        message: `Champ introuvable`,
        severity: MeriseSeverityTypeEnum.ERROR,
      };
    }

    this.fields = [...this.fields.filter((_, i) => i !== index)];

    return {
      success: true,
      data: null,
    };
  };

  renderComponent = (): React.ReactElement => {
    return createElement(AssociationComponent, { association: this });
  };

  renderFormComponent = (): React.ReactElement => {
    return createElement(AssociationFormComponent, {
      association: this,
    });
  };

  normalize = (): MeriseAssociation => {
    return {
      id: this.getId(),
      type: this.getType(),
      flowId: this.getFlowId(),
      name: this.getName(),
      emoji: this.getEmoji(),
      fields: this.getFields().map((field) => field.normalize()),
    };
  };

  private setName = (name: string): void => {
    this.name = name;
  };

  private setEmoji = (emoji: string): void => {
    this.emoji = emoji;
  };
}
