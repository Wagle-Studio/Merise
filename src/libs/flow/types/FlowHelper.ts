import type { FlowConnectionTypeEnum } from ".";
import type { Connection } from "@xyflow/react";
import type { FlowResult, TypedEdge, TypedNode } from "./FlowCore";

// Props required to remove a Flow item
export interface FlowRemoveItemProps<T> {
  collection: T[];
  id: string;
  itemName: string;
  removeFn: (items: T[]) => void;
}

// Props required to find a Flow item by it's id
export interface FlowFindItemByIdProps<T> {
  collection: T[];
  id: string;
  itemName: string;
}

// Props required to validate Flow connection between two items
export interface FlowValidateConnectionProps {
  edges: TypedEdge[];
  nodes: TypedNode[];
  connection: Connection;
}

// Props required to create Flow connection between two entities
export interface FlowConnectEntityToEntityProps {
  nodes: TypedNode[];
  connection: Connection;
}

// Flow result for connection between two entities
export type FlowConnectEntityToEntityResult = {
  type: FlowConnectionTypeEnum.ENTITY_ENTITY;
  edges: TypedEdge[];
  node: TypedNode;
};

// Flow result for connection between an entity and an association
export type FlowConnectEntityToAssociationResult = { type: FlowConnectionTypeEnum.ENTITY_ASSOCIATION; edge: TypedEdge };

// Union type representing the result of a Flow connection operation
export type FlowConnectResult = FlowConnectEntityToEntityResult | FlowConnectEntityToAssociationResult;

// Props required to create Flow connection between an entity and an association
export interface FlowConnectEntityToAssociationProps {
  connection: Connection;
}

// Props required to create Flow connection between two entities
export interface FlowCalculateNewNodePositionProps {
  nodes: TypedNode[];
}

// Contract for the Flow helper implementation
export interface FlowHelperInterface {
  removeItem: <T extends TypedEdge | TypedNode>(props: FlowRemoveItemProps<T>) => FlowResult<T, null>;
  findItemById: <T extends TypedEdge | TypedNode>(props: FlowFindItemByIdProps<T>) => FlowResult<T, null>;
  validateConnection: (props: FlowValidateConnectionProps) => FlowResult<FlowConnectionTypeEnum, null>;
  connectEntityToEntity: (props: FlowConnectEntityToEntityProps) => FlowResult<FlowConnectEntityToEntityResult, null>;
  connectEntityToAssociation: (
    props: FlowConnectEntityToAssociationProps
  ) => FlowResult<FlowConnectEntityToAssociationResult, null>;
  calculateNewNodePosition: (props: FlowCalculateNewNodePositionProps) => { x: number; y: number };
}
