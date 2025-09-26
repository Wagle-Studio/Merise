import type { Connection, NodeChange } from "@xyflow/react";
import type { FlowMeriseItemType, FlowResult, TypedEdge, TypedNode } from "./FlowCore";
import type { FlowDTOInterface } from "./FlowDTO";
import type { FlowConnectResult } from "./FlowHelper";

// Dispatcher type for updating the Flow DTO state
export type FlowDTODispatcher = React.Dispatch<React.SetStateAction<FlowDTOInterface>>;

// Contract for the Flow manager implementation
export interface FlowManagerInterface {
  triggerReRender: () => void;
  handleMove: (change: NodeChange<TypedNode>) => void;
  createConnection: (params: Connection) => FlowResult<FlowConnectResult, null>;
  createNode: (itemType: FlowMeriseItemType) => FlowResult<TypedNode, null>;
  addNode: (node: TypedNode) => FlowResult<TypedNode, null>;
  addEdge: (edge: TypedEdge) => FlowResult<TypedEdge, null>;
  removeNode: (id: string) => FlowResult<TypedNode, null>;
  removeEdge: (id: string) => FlowResult<TypedEdge, null>;
  findNodeById: (id: string) => FlowResult<TypedNode, null>;
  findEdgeById: (id: string) => FlowResult<TypedEdge, null>;
}
