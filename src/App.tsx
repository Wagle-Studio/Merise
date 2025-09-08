import { ProviderKernel } from "@/core/kernel";
import { ErrorBoundary, FallBackPresetTypeEnum } from "@/core/libs/error";
import { FlowComponent } from "@/libs/flow";
import { Toolbar } from "@/ui";
import "./app.scss";

function App() {
  return (
    <div className="workspace">
      <ErrorBoundary fallback={FallBackPresetTypeEnum.CORE}>
        <ProviderKernel>
          <Toolbar />
          <FlowComponent />
        </ProviderKernel>
      </ErrorBoundary>
    </div>
  );
}

export default App;
