import type { KernelManagers } from "@/core";
import type { Settings } from "@/core/libs/settings";
import type { KernelOperations } from "../../KernelTypes";

// Factory responsible for creating Kernel operations and dependency mappings from Kernel managers
export default class ProviderFactoryKernel {
  static createOperations(managers: KernelManagers): KernelOperations {
    return {
      onEntityCreate: (): void => {
        managers.core.handleCreateFlowNodeAndMeriseEntity();
      },
      onAssociationCreate: (): void => {
        managers.core.handleCreateFlowNodeAndMeriseAssociation();
      },
      onSave: (): void => {
        managers.core.handleOnSave();
      },
      onSettingsOpen: (): void => {
        managers.core.handleSettingsOpen();
      },
      onSettingsUpdate: (settings: Settings): void => {
        managers.core.handleSettingsUpdate(settings as Settings);
      },
    };
  }
}
