import type { AssociationFormType } from "../models/association/AssociationFormSchema";
import type { EntityFormType } from "../models/entity/EntityFormSchema";
import type { RelationFormType } from "../models/relation/RelationFormSchema";

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
  renderFormComponent: () => React.ReactElement;
  getId: () => string;
  getFlowId: () => string;
  getType: () => string;
  getName: () => string;
}

// Interface for a Merise entity
export interface MeriseEntityInterface extends MeriseItemInterface {
  getEmoji: () => string;
  hydrate: (formData: EntityFormType) => void;
}

// Interface for a Merise association
export interface MeriseAssociationInterface extends MeriseItemInterface {
  getEmoji: () => string;
  hydrate: (formData: AssociationFormType) => void;
}

// Interface for a Merise relation
export interface MeriseRelationInterface extends MeriseItemInterface {
  hydrate: (formData: RelationFormType) => void;
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
export type MeriseResultFail<E> = {
  success: false;
  message: string;
  severity: MeriseErrorType;
  error?: E;
};

// Union type representing the result of a Merise operation
export type MeriseResult<T, E = undefined> = MeriseResultSuccess<T> | MeriseResultFail<E>;

// Merise operations contract provided by the provider factory
export interface MeriseOperations {
  onEntitySelect: (entity: MeriseEntityInterface) => void;
  onAssociationSelect: (association: MeriseAssociationInterface) => void;
  onRelationSelect: (relation: MeriseRelationInterface) => void;
  onEntityUpdate: (entity: MeriseEntityInterface) => void;
  onAssociationUpdate: (association: MeriseAssociationInterface) => void;
  onRelationUpdate: (relation: MeriseRelationInterface) => void;
}
