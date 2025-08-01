import type { ReactNode } from "react";
import type { Connection, NodeChange } from "@xyflow/react";
import type { FlowDependencies, FlowOperations } from "./FlowCore";
import type { FlowDTOInterface, TypedNode } from "./FlowDTOTypes";

// Props required to initialize the Flow context
export interface FlowContextProps {
  children: ReactNode;
  flow: FlowDTOInterface;
  operations: FlowOperations;
  dependencies: FlowDependencies;
}

// Values exposed by the Flow context
export interface FlowContext {
  flow: FlowDTOInterface;
  operations: FlowOperations;
  dependencies: FlowDependencies;
  onNodesChange: (changes: NodeChange<TypedNode>[]) => void;
  onConnect: (params: Connection) => void;
}
