import { KernelContextProvider, ProviderFlow, ProviderMerise } from "@/core/kernel";
import { DialogContainer, ToastContainer, Toolbar } from "@/ui";
import "./app.scss";
import { ErrorBoundary, FallBackPresetTypeEnum } from "./core/libs/error";
import { FlowComponent } from "./libs/flow/components";

function App() {
  return (
    <div className="app">
      <ErrorBoundary fallback={FallBackPresetTypeEnum.CORE}>
        <KernelContextProvider>
          <ErrorBoundary fallback={FallBackPresetTypeEnum.ORCHESTROR_FLOW}>
            <ProviderFlow>
              <ErrorBoundary fallback={FallBackPresetTypeEnum.ORCHESTROR_MERISE}>
                <ProviderMerise>
                  <Toolbar />
                  <FlowComponent />
                </ProviderMerise>
              </ErrorBoundary>
            </ProviderFlow>
          </ErrorBoundary>
          <>
            <ToastContainer />
            <DialogContainer />
          </>
        </KernelContextProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
