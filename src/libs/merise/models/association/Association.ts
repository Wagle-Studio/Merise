import { createElement } from "react";
import { AssociationComponent, AssociationFormComponent } from "@/ui";
import { type MeriseAssociationInterface, MeriseItemTypeEnum } from "../../types";
import AbstractMeriseItem from "./../AbstractMeriseItem";
import { type AssociationFormType } from "./AssociationFormSchema";

export default class Association extends AbstractMeriseItem implements MeriseAssociationInterface {
  private emoji: string;

  constructor(flowId: string) {
    super(flowId, MeriseItemTypeEnum.ASSOCIATION);
    this.emoji = "🆕";
  }

  hydrate = (formData: AssociationFormType): void => {
    this.setName(formData.name);
    this.setEmoji(formData.emoji);
  };

  getEmoji = (): string => {
    return this.emoji;
  };

  renderComponent = (): React.ReactElement => {
    return createElement(AssociationComponent, { association: this });
  };

  renderFormComponent = (): React.ReactElement => {
    return createElement(AssociationFormComponent, {
      association: this,
    });
  };

  private setEmoji = (emoji: string): void => {
    this.emoji = emoji;
  };
}
