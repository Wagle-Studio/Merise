import type { AssociationFormType } from "../models/association/AssociationFormSchema";
import type { EntityFormType } from "../models/entity/EntityFormSchema";
import type { FieldFormType } from "../models/field/FieldFormSchema";
import type { RelationFormType } from "../models/relation/RelationFormSchema";

// List of all available Merise error types
export enum ErrorType {
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
  severity: ErrorType;
  error?: E;
};

// Union type representing the result of a Merise operation
export type MeriseResult<T, E = undefined> = MeriseResultSuccess<T> | MeriseResultFail<E>;

// List of all available merise form types
export enum MeriseFormType {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
}

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

// List of all available merise field type item types
export enum MeriseFieldTypeType {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  DATE = "DATE",
  OTHER = "OTHER",
}

// TODO : WIP

export type FieldTypeTextOptionObject = {
  variant: FieldTypeTextOption;
  maxLength?: number;
};

export type MeriseFieldTypeOption = FieldTypeTextOptionObject | FieldTypeNumberOption | FieldTypeDateOption | FieldTypeOtherOption;

export enum FieldTypeTextOption {
  VARIABLE = "VARIABLE",
  FIXED = "FIXED",
  LONG = "LONG",
}

export enum FieldTypeDateOption {
  DATE = "DATE",
  TIME = "TIME",
  DATETIME = "DATETIME",
}

export enum FieldTypeNumberOption {
  INTEGER = "INTEGER",
  FLOAT = "FLOAT",
  COMPTER = "COMPTER",
}

export enum FieldTypeOtherOption {
  BOOLEAN = "BOOLEAN",
}

// TODO : WIP

// Base contract implemented by all Merise items
export interface MeriseItemInterface {
  getId: () => string;
  getType: () => MeriseItemType;
}

// Base interface implemented by all Merise objects
export interface MeriseItem {
  id: string;
  type: string;
}

// Contract for the Merise entity implementation
export interface MeriseEntityInterface extends MeriseItemInterface {
  renderComponent: () => React.ReactElement;
  renderFormComponent: () => React.ReactElement;
  hydrate: (formData: EntityFormType) => void;
  getFlowId: () => string;
  getName: () => string;
  getEmoji: () => string;
  getFields: () => MeriseFieldInterface[];
  addField: (field: MeriseFieldInterface) => void;
  updateField: (field: MeriseFieldInterface) => void;
  deleteField: (field: MeriseFieldInterface) => void;
}

// Interface for a Merise entity object
export interface MeriseEntity extends MeriseItem {
  flowId: string;
  name: string;
  emoji: string;
  fields: MeriseField[];
}

// Contract for the Merise association implementation
export interface MeriseAssociationInterface extends MeriseItemInterface {
  renderComponent: () => React.ReactElement;
  renderFormComponent: () => React.ReactElement;
  hydrate: (formData: AssociationFormType) => void;
  getFlowId: () => string;
  getName: () => string;
  getEmoji: () => string;
  getFields: () => MeriseFieldInterface[];
  addField: (field: MeriseFieldInterface) => void;
  updateField: (field: MeriseFieldInterface) => void;
  deleteField: (field: MeriseFieldInterface) => void;
}

// Interface for a Merise association object
export interface MeriseAssociation extends MeriseItem {
  flowId: string;
  name: string;
  emoji: string;
  fields: MeriseField[];
}

// Contract for the Merise relation implementation
export interface MeriseRelationInterface extends MeriseItemInterface {
  renderComponent: () => React.ReactElement;
  renderFormComponent: () => React.ReactElement;
  hydrate: (formData: RelationFormType) => void;
  getFlowId: () => string;
  getSource: () => string;
  getTarget: () => string;
  getCardinality: () => MeriseRelationCardinalityType;
}

// Interface for a Merise relation object
export interface MeriseRelation extends MeriseItem {
  flowId: string;
  source: string;
  target: string;
  cardinality: string;
}

// Contract for the Merise field implementation
export interface MeriseFieldInterface extends MeriseItemInterface {
  renderFormComponent: (formType: MeriseFormType) => React.ReactElement;
  hydrate: (formData: FieldFormType) => void;
  getMeriseItemId: () => string;
  getMeriseItemType: () => MeriseItemType;
  getTypeField: () => MeriseFieldTypeType | null;
  getTypeFieldOption: () => MeriseFieldTypeOption | null;
  getName: () => string | null;
  isPrimary: () => boolean;
  isNullable: () => boolean;
  isUnique: () => boolean;
}

// Interface for a Merise field object
export interface MeriseField extends MeriseItem {
  meriseItemId: string;
  meriseItemType: MeriseItemType;
  name: string | null;
  typeField: MeriseFieldTypeType | null;
  typeFieldOption: MeriseFieldTypeOption | null;
  primaryKey: boolean;
  nullable: boolean;
  unique: boolean;
}

// Merise operations contract provided by the provider factory
export interface MeriseOperations {
  onEntitySelect: (entity: MeriseEntityInterface) => void;
  onAssociationSelect: (association: MeriseAssociationInterface) => void;
  onRelationSelect: (relation: MeriseRelationInterface) => void;
  onFieldSelect: (field: MeriseFieldInterface) => void;
  onEntityUpdate: (entity: MeriseEntityInterface) => void;
  onAssociationUpdate: (association: MeriseAssociationInterface) => void;
  onRelationUpdate: (relation: MeriseRelationInterface) => void;
  onFieldCreate: (field: MeriseFieldInterface) => void;
  onFieldUpdate: (field: MeriseFieldInterface) => void;
  onFieldDelete: (field: MeriseFieldInterface) => void;
}
