import { type ReactNode, useLayoutEffect, useMemo } from "react";
import { useKernelContext } from "@/core";
import { ErrorBoundary, ErrorFallBackPresetTypeEnum } from "@/core/libs/error";
import { FlowContextProvider } from "@/libs/flow";
import { FallbackLoading } from "@/ui/libs/error";
import { ProviderFactoryFlow } from "../factories";

// Provider for the Flow module, providing Flow context and dependencies within an error boundary
export const ProviderFlow = ({ children }: { children: ReactNode }) => {
  const { flowDTO, managers, settingsDTO } = useKernelContext();

  if (!managers) {
    return <FallbackLoading title="Initialisation de Flow" message="Chargement des services" />;
  }

  useLayoutEffect(() => {
    const cur = settingsDTO.getSettings();
    managers.settings.applyTheme(cur.theme);
    const off = managers.settings.bindSystemListener(cur.theme);
    return () => off();
  }, [settingsDTO, managers]);

  const contextValue = useMemo(
    () => ({
      settings: settingsDTO,
      flow: flowDTO,
      operations: ProviderFactoryFlow.createOperations(managers),
      dependencies: ProviderFactoryFlow.createDependencies(managers),
    }),
    [flowDTO, managers, settingsDTO]
  );

  return (
    <ErrorBoundary fallback={ErrorFallBackPresetTypeEnum.LIB_FLOW}>
      <FlowContextProvider {...contextValue}>{children}</FlowContextProvider>
    </ErrorBoundary>
  );
};
