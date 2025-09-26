import type { ReactNode } from "react";
import type { Connection, NodeChange } from "@xyflow/react";
import type { SettingsDTOInterface } from "@/core/libs/settings";
import type {
  FlowMeriseAssociationInterface,
  FlowMeriseEntityInterface,
  FlowMeriseRelationInterface,
  FlowResult,
  TypedNode,
} from "./FlowCore";
import type { FlowDTOInterface } from "./FlowDTO";

// Props required to initialize the Flow context
export interface FlowContextProps {
  children: ReactNode;
  settings: SettingsDTOInterface;
  flow: FlowDTOInterface;
  operations: FlowOperations;
  dependencies: FlowDependencies;
}

// Values exposed by the Flow context
export interface FlowContext {
  settings: SettingsDTOInterface;
  flow: FlowDTOInterface;
  operations: FlowOperations;
  dependencies: FlowDependencies;
  onNodesChange: (changes: NodeChange<TypedNode>[]) => void;
  onConnect: (params: Connection) => void;
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
