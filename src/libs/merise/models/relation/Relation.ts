import { createElement } from "react";
import { RelationComponent, RelationFormComponent } from "@/ui";
import { MeriseItemTypeEnum, type MeriseRelationCardinalityType, type MeriseRelationInterface } from "../../types";
import AbstractMeriseItem from "./../AbstractMeriseItem";
import { type RelationFormType } from "./RelationFormSchema";

export default class Relation extends AbstractMeriseItem implements MeriseRelationInterface {
  private flowId: string;
  private source: string;
  private target: string;
  private cardinality: MeriseRelationCardinalityType;

  constructor(flowId: string, source: string, target: string, cardinality: MeriseRelationCardinalityType) {
    super(MeriseItemTypeEnum.RELATION);
    this.flowId = flowId;
    this.source = source;
    this.target = target;
    this.cardinality = cardinality;
  }

  hydrate = (formData: RelationFormType): void => {
    this.setCardinality(formData.cardinality);
  };

  getFlowId = (): string => {
    return this.flowId;
  };

  getSource = (): string => {
    return this.source;
  };

  getTarget = (): string => {
    return this.target;
  };

  getCardinality = (): MeriseRelationCardinalityType => {
    return this.cardinality;
  };

  renderComponent = (): React.ReactElement => {
    return createElement(RelationComponent, { relation: this });
  };

  renderFormComponent = (): React.ReactElement => {
    return createElement(RelationFormComponent, {
      relation: this,
    });
  };

  private setCardinality = (cardinality: MeriseRelationCardinalityType): void => {
    this.cardinality = cardinality;
  };
}
