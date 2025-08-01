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

// Interface defining the Flow DTO structure
export interface FlowDTOInterface {
  readonly edges: TypedEdge[];
  readonly nodes: TypedNode[];
  cloneWithAddedEdge: (edge: TypedEdge) => FlowDTOInterface;
  cloneWithAddedNode: (node: TypedNode) => FlowDTOInterface;
  cloneWithUpdatedEdges: (edges: TypedEdge[]) => FlowDTOInterface;
  cloneWithUpdatedNodes: (nodes: TypedNode[]) => FlowDTOInterface;
  cloneWithUpdatedEdgesAndNodes: (edges: TypedEdge[], nodes: TypedNode[]) => FlowDTOInterface;
}
