import { type ReactNode, memo, useState } from "react";
import { KernelContextProvider, type KernelSeed } from "@/core";
import { ErrorBoundary, FallBackPresetTypeEnum } from "@/core/libs/error";
import { Welcome } from "@/ui/system/organisms";

// Provider for the kernel context, providing kernel context and dependencies within an error boundary
export const ProviderKernel = memo(function ProviderContext({ children }: { children: ReactNode }) {
  const [seed, setSeed] = useState<KernelSeed | null>(null);

  if (!seed) {
    return <Welcome seedDispatcher={setSeed} />;
  }

  return (
    <ErrorBoundary fallback={FallBackPresetTypeEnum.LIB_MERISE}>
      <KernelContextProvider seed={seed}>{children}</KernelContextProvider>
    </ErrorBoundary>
  );
});
