import { EntityComponent, EntityFormComponent } from "@/ui";
import { type MeriseDependencies, type MeriseEntityInterface, MeriseItemTypeEnum } from "../types";
import AbstractMeriseItem from "./AbstractMeriseItem";

export default class Entity extends AbstractMeriseItem implements MeriseEntityInterface {
  emoji: string;

  constructor(flowId: string, dependencies: MeriseDependencies) {
    super(flowId, MeriseItemTypeEnum.ENTITY, dependencies);
    this.emoji = "🆕";
  }

  handleSelection = (): void => {
    this.dependencies?.onEntitySelect(this);
  };

  handleSave = (formData: { name: string; emoji: string }): void => {
    this.setName(formData.name);
    this.setEmoji(formData.emoji);
    this.dependencies?.onEntityUpdate(this);
  };

  getEmoji = (): string => {
    return this.emoji;
  };

  setEmoji = (emoji: string): void => {
    this.emoji = emoji;
  };

  renderComponent = (): React.ReactElement => {
    return EntityComponent(this);
  };

  renderFormComponent = (): React.ReactElement => {
    return EntityFormComponent(this, this.handleSave);
  };
}
