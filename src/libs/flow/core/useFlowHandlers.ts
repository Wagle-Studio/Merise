import { useCallback } from "react";
import type { Connection, NodeChange } from "@xyflow/react";
import type { TypedNode } from "../types";

interface UseFlowHandlersProps {
  onNodesChangeFn: (change: NodeChange<TypedNode>) => void;
  onConnectFn: (connection: Connection) => void;
}

// Custom hook mapping React Flow events to the corresponding FlowOperations handlers
export function useFlowHandlers(props: UseFlowHandlersProps) {
  const { onConnectFn, onNodesChangeFn } = props;

  const onNodesChange = useCallback(
    (changes: NodeChange<TypedNode>[]) => {
      for (const change of changes) {
        switch (change.type) {
          case "dimensions":
          case "position":
            onNodesChangeFn(change);
            break;
        }
      }
    },
    [onNodesChangeFn]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      onConnectFn(connection);
    },
    [onConnectFn]
  );

  return { onNodesChange, onConnect };
}
