import { AssociationComponent, AssociationFormComponent } from "@/ui";
import { type MeriseAssociationInterface, type MeriseDependencies, MeriseItemTypeEnum } from "../types";
import AbstractMeriseItem from "./AbstractMeriseItem";

export default class Association extends AbstractMeriseItem implements MeriseAssociationInterface {
  emoji: string;

  constructor(flowId: string, dependencies: MeriseDependencies) {
    super(flowId, MeriseItemTypeEnum.ASSOCIATION, dependencies);
    this.emoji = "🆕";
  }

  handleSelection = (): void => {
    this.dependencies?.onAssociationSelect(this);
  };

  handleSave = (formData: { name: string; emoji: string }): void => {
    this.setName(formData.name);
    this.setEmoji(formData.emoji);
    this.dependencies?.onAssociationUpdate(this);
  };

  getEmoji = (): string => {
    return this.emoji;
  };

  setEmoji = (emoji: string): void => {
    this.emoji = emoji;
  };

  renderComponent = (): React.ReactElement => {
    return AssociationComponent(this);
  };

  renderFormComponent = (): React.ReactElement => {
    return AssociationFormComponent(this, this.handleSave);
  };
}
