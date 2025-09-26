import { ProviderKernel } from "@/core/kernel";
import { ErrorBoundary, ErrorFallBackPresetTypeEnum } from "@/core/libs/error";
import { FlowComponent } from "@/libs/flow";
import { Toolbar } from "@/ui";
import "./app.scss";

function App() {
  return (
    <div className="workspace">
      <ErrorBoundary fallback={ErrorFallBackPresetTypeEnum.CORE}>
        <ProviderKernel>
          <Toolbar />
          <FlowComponent />
        </ProviderKernel>
      </ErrorBoundary>
    </div>
  );
}

export default App;
