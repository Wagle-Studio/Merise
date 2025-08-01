import { type ReactNode, memo, useMemo } from "react";
import { useKernelContext } from "@/core";
import { ErrorBoundary, FallBackPresetTypeEnum } from "@/core/libs/error";
import { MeriseContextProvider } from "@/libs/merise";
import { FallbackLoading } from "@/ui/libs/error";
import { ProviderFactoryMerise } from "./factories";

// Provider for the Merise module, providing Merise context and dependencies within an error boundary
export const ProviderMerise = memo(function ProviderMerise({ children }: { children: ReactNode }) {
  const { managers } = useKernelContext();

  if (!managers) {
    return <FallbackLoading title="Initialisation de Merise" message="Chargement des services..." />;
  }

  const contextValue = useMemo(
    () => ({
      dependencies: ProviderFactoryMerise.createDependencies(managers),
    }),
    [managers]
  );

  return (
    <ErrorBoundary fallback={FallBackPresetTypeEnum.LIB_MERISE}>
      <MeriseContextProvider {...contextValue}>{children}</MeriseContextProvider>
    </ErrorBoundary>
  );
});
