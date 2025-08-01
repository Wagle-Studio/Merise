import type { Connection } from "@xyflow/react";

// Contract for the core manager implementation
export interface CoreManagerInterface {
  createFlowEdgeAndMeriseRelation: (connection: Connection) => void;
  createFlowNodeAndMeriseEntity: () => void;
  createFlowNodeAndMeriseAssociation: () => void;
  handleFlowEdgeRemove: (edgeId: string, onComplete?: () => void) => void;
  handleFlowNodeRemove: (nodeId: string, onComplete?: () => void) => void;
}
