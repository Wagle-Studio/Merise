import type { Edge, Node } from "@xyflow/react";

// List of all available Flow error types
export enum SeverityType {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
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

// Mirror of the Merise library item types used in Flow
export enum FlowMeriseItemType {
  ENTITY = "Entité",
  ASSOCIATION = "Association",
  RELATION = "Relation",
}

// Shape of the data stored in a Flow edge
export type EdgeData = {
  id: string;
  type: FlowMeriseItemType;
};

// Shape of the data stored in a Flow node
export type NodeData = {
  id: string;
  type: FlowMeriseItemType;
};

// Typed representation of a Flow edge including its data payload
export type TypedEdge = Edge<EdgeData> & {
  data: EdgeData;
};

// Typed representation of a Flow node including its data payload
export type TypedNode = Node<NodeData> & {
  data: NodeData;
};

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
