import { useCallback } from "react";
import type { Connection, NodeChange } from "@xyflow/react";
import type { FlowOperations, TypedNode } from "../types";

// Custom hook mapping React Flow events to the corresponding FlowOperations handlers
export function useFlowHandlers(operations: FlowOperations) {
  const onNodesChange = useCallback(
    (changes: NodeChange<TypedNode>[]) => {
      for (const change of changes) {
        switch (change.type) {
          case "dimensions":
          case "position":
            operations.onNodeMove(change);
            break;
        }
      }
    },
    [operations]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      operations.onEdgeCreate(connection);
    },
    [operations]
  );

  return { onNodesChange, onConnect };
}
