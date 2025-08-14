import { createContext, useContext, useMemo } from "react";
import type { MeriseContext, MeriseContextProps } from "../types";

const MeriseContext = createContext<MeriseContext | null>(null);

// Provides the Merise context to the merise feature
export const MeriseContextProvider = ({ children, operations }: MeriseContextProps) => {
  const contextValue = useMemo(
    () => ({
      operations,
    }),
    [operations]
  );

  return <MeriseContext.Provider value={contextValue}>{children}</MeriseContext.Provider>;
};

export const useMeriseContext = (): MeriseContext => {
  const context = useContext(MeriseContext);
  if (!context) {
    throw new Error("🔄 MeriseContext doit être utilisé dans MeriseContextProvider");
  }
  return context;
};
