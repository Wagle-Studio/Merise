import type { TypedEdge, TypedNode } from "./FlowCore";

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
