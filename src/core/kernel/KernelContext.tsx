import { createContext, useContext, useEffect, useMemo } from "react";
import { useDTOValidation } from "@/core/libs/debug";
import { Welcome } from "@/ui/system/organisms";
import type { KernelContext, KernelContextProps } from "./KernelTypes";
import { ProviderFactoryKernel } from "./providers/factories";
import { useKernelInitialization } from "./useKernelInitialization";

const KernelContext = createContext<KernelContext | null>(null);

export const KernelContextProvider = ({ children }: KernelContextProps) => {
  const { save, settingsDTO, dialogs, toasts, flowDTO, meriseDTO, managers } = useKernelInitialization();

  useDTOValidation(flowDTO, meriseDTO, process.env.NODE_ENV === "development");

  useEffect(() => {
    managers.save.saveDemoInit();
  }, [managers]);

  const contextValue = useMemo<KernelContext>(
    () => ({
      save,
      settingsDTO,
      dialogs,
      toasts,
      flowDTO,
      meriseDTO,
      managers,
      operations: ProviderFactoryKernel.createOperations(managers),
      dependencies: ProviderFactoryKernel.createDependencies(managers),
    }),
    [save, settingsDTO, dialogs, toasts, flowDTO, meriseDTO, managers]
  );

  return <KernelContext.Provider value={contextValue}>{save ? children : <Welcome />}</KernelContext.Provider>;
};

export const useKernelContext = (): KernelContext => {
  const context = useContext(KernelContext);
  if (!context) {
    throw new Error("🔄 KernelContext doit être utilisé dans KernelContextProvider");
  }
  return context;
};
