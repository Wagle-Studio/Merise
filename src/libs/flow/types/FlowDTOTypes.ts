import type { Edge, Node } from "@xyflow/react";
import type { FlowMeriseItemType } from "./FlowCore";

// Shape of the data stored in a flow edge
export type EdgeData = {
  id: string;
  type: FlowMeriseItemType;
};

// Shape of the data stored in a flow node
export type NodeData = {
  id: string;
  type: FlowMeriseItemType;
};

// Typed representation of a flow edge including its data payload
export type TypedEdge = Edge<EdgeData> & {
  data: EdgeData;
};

// Typed representation of a flow node including its data payload
export type TypedNode = Node<NodeData> & {
  data: NodeData;
};

// Contract for the Flow DTO implementation
export interface FlowDTOInterface {
  getNodes: () => TypedNode[];
  getEdges: () => TypedEdge[];
  cloneWithAddedEdge: (edge: TypedEdge) => FlowDTOInterface;
  cloneWithAddedNode: (node: TypedNode) => FlowDTOInterface;
  cloneWithUpdatedEdges: (edges: TypedEdge[]) => FlowDTOInterface;
  cloneWithUpdatedNodes: (nodes: TypedNode[]) => FlowDTOInterface;
  cloneWithUpdatedEdgesAndNodes: (edges: TypedEdge[], nodes: TypedNode[]) => FlowDTOInterface;
}

// Interface for a Flow DTO object
export interface FlowDTOObject {
  edges: TypedEdge[];
  nodes: TypedNode[];
}
