import { type ReactNode, memo } from "react";
import { KernelContextProvider } from "@/core";
import { ErrorBoundary, FallBackPresetTypeEnum } from "@/core/libs/error";

// Provider for the kernel context, providing kernel context and dependencies within an error boundary
export const ProviderKernel = memo(function ProviderContext({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary fallback={FallBackPresetTypeEnum.CORE}>
      <KernelContextProvider>{children}</KernelContextProvider>
    </ErrorBoundary>
  );
});
