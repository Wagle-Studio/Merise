import { type ReactNode, memo, useMemo } from "react";
import { useKernelContext } from "@/core";
import { ErrorBoundary, ErrorFallBackPresetTypeEnum } from "@/core/libs/error";
import { type MeriseContext, MeriseContextProvider } from "@/libs/merise";
import { FallbackLoading } from "@/ui/libs/error";
import { ProviderFactoryMerise } from "../factories";

// Provider for the Merise module, providing Merise context and dependencies within an error boundary
export const ProviderMerise = memo(function ProviderMerise({ children }: { children: ReactNode }) {
  const { managers } = useKernelContext();

  if (!managers) {
    return <FallbackLoading title="Initialisation de Merise" message="Chargement des services" />;
  }

  const contextValue = useMemo<MeriseContext>(
    () => ({
      operations: ProviderFactoryMerise.createOperations(managers),
    }),
    [managers]
  );

  return (
    <ErrorBoundary fallback={ErrorFallBackPresetTypeEnum.LIB_MERISE}>
      <MeriseContextProvider {...contextValue}>{children}</MeriseContextProvider>
    </ErrorBoundary>
  );
});
