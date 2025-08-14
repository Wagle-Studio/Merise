import type { ZodError } from "zod";
import { RelationComponent, RelationFormComponent } from "@/ui";
import { type MeriseDependencies, MeriseErrorTypeEnum, MeriseItemTypeEnum, type MeriseRelationCardinalityType, type MeriseRelationInterface, type MeriseResult } from "../../types";
import AbstractMeriseItem from "./../AbstractMeriseItem";
import { type RelationFormType, RelationFormTypeSchema } from "./RelationFormSchema";

export default class Relation extends AbstractMeriseItem implements MeriseRelationInterface {
  cardinality?: MeriseRelationCardinalityType | undefined;

  constructor(
    flowId: string,
    readonly source: string,
    readonly target: string,
    dependencies: MeriseDependencies
  ) {
    super(flowId, MeriseItemTypeEnum.RELATION, dependencies);
    this.source = source;
    this.target = target;
  }

  handleSelection = (): void => {
    this.dependencies?.onRelationSelect(this);
  };

  handleSave = (formData: RelationFormType): MeriseResult<RelationFormType, ZodError> => {
    const validationResult = RelationFormTypeSchema.safeParse(formData);

    if (!validationResult.success) {
      return {
        success: false,
        message: "Impossible de mettre à jour la relation",
        severity: MeriseErrorTypeEnum.ERROR,
        error: validationResult.error,
      };
    }

    this.setCardinality(formData.cardinality);
    this.dependencies?.onRelationUpdate(this);

    this.dependencies?.onRelationUpdate(this);

    return {
      success: true,
      data: formData,
    };
  };

  getCardinality = () => {
    return this.cardinality;
  };

  setCardinality = (cardinality: MeriseRelationCardinalityType): void => {
    this.cardinality = cardinality;
  };

  renderComponent = (): React.ReactElement => {
    return RelationComponent(this);
  };

  renderFormComponent = (): React.ReactElement => {
    return RelationFormComponent(this, this.handleSave);
  };
}
