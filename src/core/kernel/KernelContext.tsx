import { createContext, useContext, useEffect, useMemo } from "react";
import { useDTOValidation } from "@/core/libs/debug";
import { Welcome } from "@/ui/system/organisms";
import type { KernelContext, KernelContextProps } from "./KernelTypes";
import { ProviderFactoryKernel } from "./providers/factories";
import { useKernelInitialization } from "./useKernelInitialization";

const KernelContext = createContext<KernelContext | null>(null);

// Provides the Kernel context to the application
export const KernelContextProvider = ({ children }: KernelContextProps) => {
  const kernel = useKernelInitialization();

  useDTOValidation(kernel.flowDTO, kernel.meriseDTO, process.env.NODE_ENV === "development");

  useEffect(() => {
    kernel.managers.save.saveDemoInit();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const saveId = params.get("save");

    if (saveId) {
      const openSaveResult = kernel.managers.save.openSave(saveId);

      if (!openSaveResult.success) return;

      kernel.managers.save.updateCurrentSave(openSaveResult.data);
    }
  }, [kernel.managers.save]);

  const contextValue = useMemo<KernelContext>(
    () => ({
      ...kernel,
      operations: ProviderFactoryKernel.createOperations(kernel.managers),
      dependencies: ProviderFactoryKernel.createDependencies(kernel.managers),
    }),
    [kernel, kernel.managers.save]
  );

  return <KernelContext.Provider value={contextValue}>{kernel.save ? children : <Welcome />}</KernelContext.Provider>;
};

export const useKernelContext = (): KernelContext => {
  const context = useContext(KernelContext);
  if (!context) {
    throw new Error("🔄 KernelContext doit être utilisé dans KernelContextProvider");
  }
  return context;
};
