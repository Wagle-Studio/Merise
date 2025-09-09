import type { Connection, NodeChange } from "@xyflow/react";
import type { TypedNode } from "./FlowDTOTypes";

// List of all available Flow error types
export enum SeverityType {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

// List of all available flow item types
export enum FlowItemType {
  NODE = "NODE",
  EDGE = "EDGE",
}

// List of all available flow connection types
export enum FlowConnectionType {
  ENTITY_ENTITY = "ENTITY_ENTITY",
  ENTITY_ASSOCIATION = "ENTITY_ASSOCIATION",
}

// Represents a successful Flow operation
export type FlowResultSuccess<T> = {
  success: true;
  data: T;
};

// Represents a failed Flow operation
export type FlowResultFail<E> = {
  success: false;
  message: string;
  severity: SeverityType;
  error?: E;
};

// Union type representing the result of a Flow operation
export type FlowResult<T, E> = FlowResultSuccess<T> | FlowResultFail<E>;

// Mirror of the Merise library item types used in Flow
export enum FlowMeriseItemType {
  ENTITY = "Entité",
  ASSOCIATION = "Association",
  RELATION = "Relation",
}

// Mirror of the Merise library entity interface exposed to Flow
export interface FlowMeriseEntityInterface {
  renderComponent: () => React.ReactElement;
  renderFormComponent: () => React.ReactElement;
  getId: () => string;
  getFlowId: () => string;
  getType: () => any;
  getName: () => string;
}

// Mirror of the Merise library association interface exposed to Flow
export interface FlowMeriseAssociationInterface {
  renderComponent: () => React.ReactElement;
  renderFormComponent: () => React.ReactElement;
  getId: () => string;
  getFlowId: () => string;
  getType: () => any;
  getName: () => string;
}

// Mirror of the Merise library relation interface exposed to Flow
export interface FlowMeriseRelationInterface {
  renderComponent: () => React.ReactElement;
  renderFormComponent: () => React.ReactElement;
  hydrate: (formData: any) => void;
  getFlowId: () => string;
  getSource: () => string;
  getTarget: () => string;
  getCardinality: () => any;
  normalize: () => any;
}

// Flow operations contract provided by the provider factory
export interface FlowOperations {
  onEdgeCreate: (connection: Connection) => void;
  onNodeMove: (change: NodeChange<TypedNode>) => void;
}

// Flow dependencies contract provided by the provider factory
export interface FlowDependencies {
  findMeriseEntityByFlowId: (flowId: string) => FlowResult<FlowMeriseEntityInterface, null>;
  findMeriseAssociationByFlowId: (flowId: string) => FlowResult<FlowMeriseAssociationInterface, null>;
  findMeriseRelationByFlowId: (flowId: string) => FlowResult<FlowMeriseRelationInterface, null>;
}
