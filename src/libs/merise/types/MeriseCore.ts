import type { AssociationFormType } from "../models/association/AssociationFormSchema";
import type { EntityFormType } from "../models/entity/EntityFormSchema";
import type { FieldFormType } from "../models/field/FieldFormSchema";
import type { RelationFormType } from "../models/relation/RelationFormSchema";

// List of all available merise item types
export enum MeriseItemType {
  ENTITY = "Entité",
  ASSOCIATION = "Association",
  RELATION = "Relation",
  FIELD = "Champ",
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
  renderComponent: () => React.ReactElement;
  renderFormComponent: () => React.ReactElement;
  getId: () => string;
  getType: () => MeriseItemType;
  getName: () => string;
}

// Interface for a Merise entity
export interface MeriseEntityInterface extends MeriseItemInterface {
  hydrate: (formData: EntityFormType) => void;
  getFlowId: () => string;
  getEmoji: () => string;
  getFields: () => MeriseFieldInterface[];
  addField: (field: MeriseFieldInterface) => void;
}

// Interface for a Merise association
export interface MeriseAssociationInterface extends MeriseItemInterface {
  hydrate: (formData: AssociationFormType) => void;
  getFlowId: () => string;
  getEmoji: () => string;
  getFields: () => MeriseFieldInterface[];
  addField: (field: MeriseFieldInterface) => void;
}

// Interface for a Merise relation
export interface MeriseRelationInterface extends MeriseItemInterface {
  hydrate: (formData: RelationFormType) => void;
  getFlowId: () => string;
  getSource: () => string;
  getTarget: () => string;
  getCardinality: () => MeriseRelationCardinalityType;
}

// Interface for a Merise field
export interface MeriseFieldInterface extends MeriseItemInterface {
  hydrate: (formData: FieldFormType) => void;
  getMeriseItemId: () => string;
  getMeriseItemType: () => MeriseItemType;
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
  onFieldCreate: (field: MeriseFieldInterface) => void;
}
