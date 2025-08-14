import { createElement } from "react";
import { RelationComponent, RelationFormComponent } from "@/ui";
import { MeriseItemTypeEnum, type MeriseRelationCardinalityType, type MeriseRelationInterface } from "../../types";
import AbstractMeriseItem from "./../AbstractMeriseItem";
import { type RelationFormType } from "./RelationFormSchema";

export default class Relation extends AbstractMeriseItem implements MeriseRelationInterface {
  private cardinality?: MeriseRelationCardinalityType | undefined;

  constructor(
    flowId: string,
    readonly source: string,
    readonly target: string
  ) {
    super(flowId, MeriseItemTypeEnum.RELATION);
    this.source = source;
    this.target = target;
  }

  hydrate = (formData: RelationFormType): void => {
    this.setCardinality(formData.cardinality);
  };

  getCardinality = () => {
    return this.cardinality;
  };

  setCardinality = (cardinality: MeriseRelationCardinalityType): void => {
    this.cardinality = cardinality;
  };

  renderComponent = (): React.ReactElement => {
    return createElement(RelationComponent, { relation: this });
  };

  renderFormComponent = (): React.ReactElement => {
    return createElement(RelationFormComponent, {
      relation: this,
    });
  };
}
