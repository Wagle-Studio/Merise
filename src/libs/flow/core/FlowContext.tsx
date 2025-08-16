import { createContext, useContext, useMemo } from "react";
import type { FlowContext, FlowContextProps } from "../types";
import { useFlowHandlers } from "./useFlowHandlers";

const FlowContext = createContext<FlowContext | null>(null);

// Provides the Flow context to the flow feature
export const FlowContextProvider = ({ children, flow, operations, dependencies, settings }: FlowContextProps) => {
  const { onNodesChange, onConnect } = useFlowHandlers(operations); // Hooks for React Flow events

  const contextValue = useMemo(
    () => ({
      settings,
      flow,
      operations,
      dependencies,
      onNodesChange,
      onConnect,
    }),
    [flow, dependencies, onNodesChange, onConnect, settings]
  );

  return <FlowContext.Provider value={contextValue}>{children}</FlowContext.Provider>;
};

export const useFlowContext = (): FlowContext => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("🔄 FlowContext doit être utilisé dans FlowContextProvider");
  }
  return context;
};
