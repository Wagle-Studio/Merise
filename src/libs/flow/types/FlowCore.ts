import type { Connection, NodeChange } from "@xyflow/react";
import type { TypedNode } from "./FlowDTOTypes";

// List of all available flow item types
export enum FlowItemType {
  NODE = "NODE",
  EDGE = "EDGE",
}

// Mirror of the Core item types used in Flow
export enum FlowErrorType {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

// Mirror of the Merise library item types used in Flow
export enum FlowMeriseItemType {
  ENTITY = "Entité",
  ASSOCIATION = "Association",
  RELATION = "Relation",
}

// Mirror of the Merise library item interface exposed to Flow
export interface FlowMeriseItemInterface {
  readonly id: string;
  readonly flowId: string;
  readonly type: FlowMeriseItemType;
  renderComponent: () => React.ReactElement;
  renderFormComponent: () => React.ReactElement;
}

// Represents a successful Flow operation
export type FlowResultSuccess<T> = {
  success: true;
  data: T;
};

// Represents a failed Flow operation
export type FlowResultFail = {
  success: false;
  message: string;
  severity: FlowErrorType;
};

// Union type representing the result of a Flow operation
export type FlowResult<T> = FlowResultSuccess<T> | FlowResultFail;

// Flow operations contract provided by the provider factory
export interface FlowOperations {
  onEdgeCreate: (connection: Connection) => void;
  onNodeMove: (change: NodeChange<TypedNode>) => void;
}

// Flow dependencies contract provided by the provider factory
export interface FlowDependencies {
  findMeriseEntityByFlowId: (flowId: string) => FlowResult<FlowMeriseItemInterface | null>;
  findMeriseAssociationByFlowId: (flowId: string) => FlowResult<FlowMeriseItemInterface | null>;
  findMeriseRelationByFlowId: (flowId: string) => FlowResult<FlowMeriseItemInterface | null>;
}
