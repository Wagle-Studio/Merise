import { type ReactNode, useMemo } from "react";
import { useKernelContext } from "@/core";
import { ErrorBoundary, FallBackPresetTypeEnum } from "@/core/libs/error";
import { FlowContextProvider } from "@/libs/flow";
import { FallbackLoading } from "@/ui/libs/error";
import { ProviderFactoryFlow } from "./factories";

// Provider for the Flow module, providing Flow context and dependencies within an error boundary
export const ProviderFlow = ({ children }: { children: ReactNode }) => {
  const { flowDTO, managers } = useKernelContext();

  if (!managers) {
    return <FallbackLoading title="Initialisation de Flow" message="Chargement des services..." />;
  }

  const contextValue = useMemo(
    () => ({
      flow: flowDTO,
      operations: ProviderFactoryFlow.createOperations(managers),
      dependencies: ProviderFactoryFlow.createDependencies(managers),
    }),
    [flowDTO, managers]
  );

  return (
    <ErrorBoundary fallback={FallBackPresetTypeEnum.LIB_FLOW}>
      <FlowContextProvider {...contextValue}>{children}</FlowContextProvider>
    </ErrorBoundary>
  );
};
