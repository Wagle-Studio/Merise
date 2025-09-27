import type { Connection, NodeChange } from "@xyflow/react";
import type { FlowMeriseItemType, FlowResult, TypedEdge, TypedNode } from "./FlowCore";
import type { FlowDTOInterface } from "./FlowDTO";
import type { FlowConnectResult } from "./FlowHelper";

// Dispatcher type for updating the Flow DTO state
export type FlowDTODispatcher = React.Dispatch<React.SetStateAction<FlowDTOInterface>>;

// Contract for the Flow manager implementation
export interface FlowManagerInterface {
  getCurrentFlow: () => FlowDTOInterface;
  handleMove: (change: NodeChange<TypedNode>) => void;
  createNode: (itemType: FlowMeriseItemType) => FlowResult<TypedNode, null>;
  createConnection: (params: Connection) => FlowResult<FlowConnectResult, null>;
  addNode: (node: TypedNode) => void;
  addEdge: (edge: TypedEdge) => void;
  removeNode: (id: string) => FlowResult<TypedNode, null>;
  removeEdge: (id: string) => FlowResult<TypedEdge, null>;
  findNodeById: (id: string) => FlowResult<TypedNode, null>;
  findEdgeById: (id: string) => FlowResult<TypedEdge, null>;
}
