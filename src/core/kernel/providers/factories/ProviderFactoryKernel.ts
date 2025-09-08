import type { CoreResult, KernelDependencies, KernelManagers } from "@/core";
import type { Save, SaveRawDTOObject } from "@/core/libs/save";
import type { Settings } from "@/core/libs/settings";
import type { KernelOperations } from "../../KernelTypes";

// Factory responsible for creating Kernel operations and dependencies mappings from Kernel managers
export default class ProviderFactoryKernel {
  static createOperations(managers: KernelManagers): KernelOperations {
    return {
      onEntityCreate: (): void => {
        managers.core.handleCreateFlowNodeAndMeriseEntity();
      },
      onAssociationCreate: (): void => {
        managers.core.handleCreateFlowNodeAndMeriseAssociation();
      },
      onSaveCreate: (): void => {
        managers.core.handleSaveCreate();
      },
      onSave: (): void => {
        managers.core.handlSave();
      },
      onSaveOpen: (saveId: string): void => {
        managers.core.handleSaveOpen(saveId);
      },
      onSaveSelect: (saveId: string): void => {
        managers.core.handleSaveSelect(saveId);
      },
      onSaveSelectCurrent: (): void => {
        managers.core.handleSaveSelectCurrent();
      },
      onSaveUpdate: (save: Save): void => {
        managers.core.handleSaveUpdate(save);
      },
      onSaveUpdateCurrent: (save: Save): void => {
        managers.core.handleSaveUpdateCurrent(save);
      },
      onSaveRemove: (save: SaveRawDTOObject): void => {
        managers.core.handleSaveRemove(save);
      },
      onSettingsOpen: (): void => {
        managers.core.handleSettingsOpen();
      },
      onSettingsUpdate: (settings: Settings): void => {
        managers.core.handleSettingsUpdate(settings as Settings);
      },
    };
  }

  static createDependencies(managers: KernelManagers): KernelDependencies {
    return {
      findLocalSaves: (): CoreResult<SaveRawDTOObject[], null> => {
        return managers.save.findLocalSaves();
      },
    };
  }
}
