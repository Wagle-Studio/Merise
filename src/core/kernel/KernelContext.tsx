import { createContext, useContext, useMemo } from "react";
import { useDTOValidation } from "@/core/libs/debug";
import type { KernelContext, KernelContextProps } from "./KernelTypes";
import { useKernelInitialization } from "./useKernelInitialization";

const KernelContext = createContext<KernelContext | null>(null);

// Provides the Kernel context to the application
export const KernelContextProvider = ({ children }: KernelContextProps) => {
  const kernel = useKernelInitialization();

  useDTOValidation(kernel.flowDTO, kernel.meriseDTO, process.env.NODE_ENV === "development");

  const contextValue = useMemo<KernelContext>(() => {
    return kernel;
  }, [kernel]);

  return <KernelContext.Provider value={contextValue}>{children}</KernelContext.Provider>;
};

export const useKernelContext = (): KernelContext => {
  const context = useContext(KernelContext);
  if (!context) {
    throw new Error("🔄 KernelContext doit être utilisé dans KernelContextProvider");
  }
  return context;
};
