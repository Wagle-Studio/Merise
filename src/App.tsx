import { KernelContextProvider } from "@/core/kernel";
import { ErrorBoundary, ErrorFallBackPresetTypeEnum } from "@/core/libs/error";
import { Flow } from "@/libs/flow";
import { Toolbar } from "@/ui";
import "./app.scss";

function App() {
  return (
    <div className="workspace">
      <ErrorBoundary fallback={ErrorFallBackPresetTypeEnum.KERNEL}>
        <KernelContextProvider>
          <Toolbar />
          <Flow />
        </KernelContextProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
