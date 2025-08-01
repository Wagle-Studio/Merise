import { RelationComponent, RelationFormComponent } from "@/ui";
import { type MeriseDependencies, MeriseItemTypeEnum, type MeriseRelationCardinalityType, MeriseRelationCardinalityTypeEnum, type MeriseRelationInterface } from "../types";
import AbstractMeriseItem from "./AbstractMeriseItem";

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

  handleSave = (formData: { cardinality: MeriseRelationCardinalityTypeEnum }): void => {
    this.setCardinality(formData.cardinality);
    this.dependencies?.onRelationUpdate(this);
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
