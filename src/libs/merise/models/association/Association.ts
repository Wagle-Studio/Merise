import type { ZodError } from "zod";
import { AssociationComponent, AssociationFormComponent } from "@/ui";
import { type MeriseAssociationInterface, type MeriseDependencies, MeriseErrorTypeEnum, MeriseItemTypeEnum, type MeriseResult } from "../../types";
import AbstractMeriseItem from "./../AbstractMeriseItem";
import { type AssociationFormType, AssociationFormTypeSchema } from "./AssociationFormSchema";

export default class Association extends AbstractMeriseItem implements MeriseAssociationInterface {
  emoji: string;

  constructor(flowId: string, dependencies: MeriseDependencies) {
    super(flowId, MeriseItemTypeEnum.ASSOCIATION, dependencies);
    this.emoji = "🆕";
  }

  handleSelection = (): void => {
    this.dependencies?.onAssociationSelect(this);
  };

  handleSave = (formData: AssociationFormType): MeriseResult<AssociationFormType, ZodError> => {
    const validationResult = AssociationFormTypeSchema.safeParse(formData);

    if (!validationResult.success) {
      return {
        success: false,
        message: "Impossible de mettre à jour l'association",
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
    return AssociationComponent(this);
  };

  renderFormComponent = (): React.ReactElement => {
    return AssociationFormComponent(this, this.handleSave);
  };
}
