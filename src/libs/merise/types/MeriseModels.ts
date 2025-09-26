import type { AssociationFormType } from "../models/association/AssociationFormSchema";
import type { EntityFormType } from "../models/entity/EntityFormSchema";
import type { FieldFormType } from "../models/field/FieldFormSchema";
import type { RelationFormType } from "../models/relation/RelationFormSchema";
import type {
  MeriseFieldTypeType,
  MeriseFormType,
  MeriseItemType,
  MeriseRelationCardinalityType,
  MeriseResult,
} from "./MeriseCore";

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
  updateFields: (field: MeriseFieldInterface) => void;
  deleteField: (field: MeriseFieldInterface) => MeriseResult<null, null>;
  normalize: () => MeriseEntity;
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
  updateFields: (field: MeriseFieldInterface) => void;
  deleteField: (field: MeriseFieldInterface) => MeriseResult<null, null>;
  normalize: () => MeriseAssociation;
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
  normalize: () => MeriseRelation;
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
  normalize: () => MeriseField;
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

// Represents field type option
export type MeriseFieldTypeOption =
  | FieldTypeTextOptionObject
  | FieldTypeNumberOption
  | FieldTypeDateOption
  | FieldTypeOtherOption;

// Represents text field option object
export type FieldTypeTextOptionObject = {
  variant: FieldTypeTextOption;
  maxLength?: number;
};

// List of all available field text options
export enum FieldTypeTextOption {
  VARIABLE = "VARIABLE",
  FIXED = "FIXED",
  LONG = "LONG",
}

// List of all available field date options
export enum FieldTypeDateOption {
  DATE = "DATE",
  TIME = "TIME",
  DATETIME = "DATETIME",
}

// List of all available field number options
export enum FieldTypeNumberOption {
  INTEGER = "INTEGER",
  FLOAT = "FLOAT",
  COMPTER = "COMPTER",
}

// List of all available field other options
export enum FieldTypeOtherOption {
  BOOLEAN = "BOOLEAN",
}
