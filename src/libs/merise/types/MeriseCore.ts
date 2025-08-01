// List of all available merise item types
export enum MeriseItemType {
  ENTITY = "Entité",
  ASSOCIATION = "Association",
  RELATION = "Relation",
}

// List of all available merise relation cardinality item types
export enum MeriseRelationCardinalityType {
  ZERO_ONE = "0,1",
  ONE_ONE = "1,1",
  ZERO_N = "0,N",
  ONE_N = "1,N",
}

// Base interface implemented by all Merise items
export interface MeriseItemInterface {
  readonly id: string;
  readonly flowId: string;
  readonly type: MeriseItemType;
  handleSelection: () => void;
  renderFormComponent: () => React.ReactElement;
  getName: () => string;
}

// Interface for a Merise entity
export interface MeriseEntityInterface extends MeriseItemInterface {
  getEmoji: () => string;
}

// Interface for a Merise association
export interface MeriseAssociationInterface extends MeriseItemInterface {
  getEmoji: () => string;
}

// Interface for a Merise relation
export interface MeriseRelationInterface extends MeriseItemInterface {
  readonly source: string;
  readonly target: string;
  getCardinality: () => MeriseRelationCardinalityType | undefined;
}

// Mirror of the Core item types used in Merise
export enum MeriseErrorType {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

// Represents a successful Merise operation
export type MeriseResultSuccess<T> = {
  success: true;
  data: T;
};

// Represents a failed Merise operation
export type MeriseResultFail = {
  success: false;
  message: string;
  severity: MeriseErrorType;
};

// Union type representing the result of a Merise operation
export type MeriseResult<T> = MeriseResultSuccess<T> | MeriseResultFail;

// Merise dependencies contract provided by the provider factory
export interface MeriseDependencies {
  onEntitySelect: (entity: MeriseEntityInterface) => void;
  onAssociationSelect: (association: MeriseAssociationInterface) => void;
  onRelationSelect: (relation: MeriseRelationInterface) => void;
  onEntityUpdate: (entity: MeriseEntityInterface) => void;
  onAssociationUpdate: (association: MeriseAssociationInterface) => void;
  onRelationUpdate: (relation: MeriseRelationInterface) => void;
}
