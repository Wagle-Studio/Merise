import { type ReactNode, memo } from "react";
import { KernelContextProvider } from "@/core";
import { ErrorBoundary, ErrorFallBackPresetTypeEnum } from "@/core/libs/error";

// Provider for the kernel context, providing kernel context and dependencies within an error boundary
export const ProviderKernel = memo(function ProviderContext({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary fallback={ErrorFallBackPresetTypeEnum.CORE}>
      <KernelContextProvider>{children}</KernelContextProvider>
    </ErrorBoundary>
  );
});
