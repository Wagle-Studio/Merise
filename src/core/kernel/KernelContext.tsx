import { createContext, useContext, useLayoutEffect, useMemo } from "react";
import { ErrorBoundary, ErrorFallBackPresetTypeEnum } from "@/core/libs/error";
import { DialogContainer, ToastContainer, Welcome } from "@/ui";
import { DomainContextProvider } from "../domain";
import KernelFactory from "./KernelFactory";
import type { KernelContext, KernelContextProps } from "./KernelTypes";
import { useKernelInit } from "./useKernelInit";

const KernelContext = createContext<KernelContext | null>(null);

export const KernelContextProvider = ({ children }: KernelContextProps) => {
  const { kernel } = useKernelInit();

  const settingsManager = kernel.getManager("settings");
  const currentTheme = settingsManager.getCurrentSettings().getSettings().theme;

  useLayoutEffect(() => {
    settingsManager.applyTheme(currentTheme);
    const off = settingsManager.bindSystemListener(currentTheme);
    return () => off();
  }, [kernel, currentTheme]);

  const getCurrentSaveResult = kernel.getManager("save").getCurrentSave();

  const ops = useMemo(() => KernelFactory.createOperations(kernel), [kernel]);
  const deps = useMemo(() => KernelFactory.createDependencies(kernel), [kernel]);
  const contextValue = useMemo(() => ({ operations: ops, dependencies: deps }), [ops, deps]);

  return (
    <KernelContext.Provider value={contextValue}>
      <ErrorBoundary fallback={ErrorFallBackPresetTypeEnum.DOMAIN}>
        <DomainContextProvider>
          {getCurrentSaveResult.success ? children : <Welcome />}
          <ToastContainer />
          <DialogContainer />
        </DomainContextProvider>
      </ErrorBoundary>
    </KernelContext.Provider>
  );
};

export const useKernelContext = (): KernelContext => {
  const context = useContext(KernelContext);
  if (!context) {
    throw new Error("🔄 KernelContext doit être utilisé dans KernelContextProvider");
  }
  return context;
};
