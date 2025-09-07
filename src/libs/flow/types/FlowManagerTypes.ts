import type { Connection, NodeChange } from "@xyflow/react";
import type { FlowMeriseItemType, FlowResult } from "./FlowCore";
import type { FlowDTOInterface, TypedEdge, TypedNode } from "./FlowDTOTypes";

// Dispatcher type for updating the Flow DTO state
export type FlowDTODispatcher = React.Dispatch<React.SetStateAction<FlowDTOInterface>>;

// Contract for the flow manager implementation
export interface FlowManagerInterface {
  handleMove: (change: NodeChange<TypedNode>) => void;
  triggerReRender: () => void;
  addEdge: (params: Connection, itemType: FlowMeriseItemType) => FlowResult<TypedEdge, null>;
  addNode: (itemType: FlowMeriseItemType) => FlowResult<TypedNode, null>;
  removeEdgeByEdgeId: (edgeId: string) => FlowResult<TypedEdge, null>;
  removeNodeByNodeId: (nodeId: string) => FlowResult<TypedNode, null>;
  findEdgeByEdgeId: (edgeId: string) => FlowResult<TypedEdge, null>;
  findNodeByNodeId: (nodeId: string) => FlowResult<TypedNode, null>;
}
