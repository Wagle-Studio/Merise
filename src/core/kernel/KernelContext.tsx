import { ProviderFlow, ProviderMerise } from "..";
import { type ReactElement, createContext, useContext, useMemo } from "react";
import { useDTOValidation } from "@/core/libs/debug";
import { ErrorBoundary, ErrorFallBackPresetTypeEnum } from "@/core/libs/error";
import { DialogContainer, ToastContainer, Welcome } from "@/ui";
import type { KernelContext, KernelContextProps } from "./KernelTypes";
import { ProviderFactoryKernel } from "./factories";
import { useKernelInitialization } from "./useKernelInitialization";

const KernelContext = createContext<KernelContext | null>(null);

export const KernelContextProvider = ({ children }: KernelContextProps) => {
  const { save, settingsDTO, dialogs, toasts, flowDTO, meriseDTO, managers } = useKernelInitialization();

  useDTOValidation(flowDTO, meriseDTO, process.env.NODE_ENV === "development");

  managers.save.initDemo();

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
    }),
    [save, settingsDTO, dialogs, toasts, flowDTO, meriseDTO, managers]
  );

  const displayHome = (): ReactElement => {
    const findLocalSavesResult = managers.save.findLocalSaves();

    // TODO : handle error
    if (!findLocalSavesResult.success) {
      return <div>ERROR</div>;
    }

    return <Welcome localSavesResult={findLocalSavesResult.data} />;
  };

  return (
    <KernelContext.Provider value={contextValue}>
      <ErrorBoundary fallback={ErrorFallBackPresetTypeEnum.ORCHESTRATOR_FLOW}>
        <ProviderFlow>
          <ErrorBoundary fallback={ErrorFallBackPresetTypeEnum.ORCHESTRATOR_MERISE}>
            <ProviderMerise>
              {save ? children : displayHome()}
              <ToastContainer />
              <DialogContainer />
            </ProviderMerise>
          </ErrorBoundary>
        </ProviderFlow>
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
