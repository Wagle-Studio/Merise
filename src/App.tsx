import { ProviderFlow, ProviderKernel, ProviderMerise } from "@/core/kernel";
import { ErrorBoundary, FallBackPresetTypeEnum } from "@/core/libs/error";
import { FlowComponent } from "@/libs/flow";
import { DialogContainer, ToastContainer, Toolbar } from "@/ui";
import "./app.scss";

function App() {
  return (
    <>
      <ErrorBoundary fallback={FallBackPresetTypeEnum.CORE}>
        <ProviderKernel>
          <div className="workspace">
            <ErrorBoundary fallback={FallBackPresetTypeEnum.ORCHESTRATOR_FLOW}>
              <ProviderFlow>
                <ErrorBoundary fallback={FallBackPresetTypeEnum.ORCHESTRATOR_MERISE}>
                  <ProviderMerise>
                    <Toolbar />
                    <FlowComponent />
                    <ToastContainer />
                    <DialogContainer />
                  </ProviderMerise>
                </ErrorBoundary>
              </ProviderFlow>
            </ErrorBoundary>
          </div>
        </ProviderKernel>
      </ErrorBoundary>
    </>
  );
}

export default App;
