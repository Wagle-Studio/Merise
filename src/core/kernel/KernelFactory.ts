import type { KernelDependencies, KernelManagerInterface, KernelOperations } from "./KernelTypes";

// Factory responsible for creating Kernel operations and dependencies mappings from Kernel managers
export default class KernelFactory {
  static createOperations(kernel: KernelManagerInterface): KernelOperations {
    return {
      initDemo: kernel.initDemo,
      handleCloseDomain: kernel.handleCloseDomain,
      handleSaveCreate: kernel.handleSaveCreate,
      handleSaveOpen: kernel.handleSaveOpen,
      handleSaveUpdate: kernel.handleSaveUpdate,
      handleSaveCurrent: kernel.handleSaveCurrent,
      handleSettingsUpdate: kernel.handleSettingsUpdate,
      handleDialogSaveEdit: kernel.handleDialogSaveEdit,
      handleDialogSaveEditCurrent: kernel.handleDialogSaveEditCurrent,
      handleDialogSaveRemove: kernel.handleDialogSaveRemove,
      handleDialogSaveRemoveCurrent: kernel.handleDialogSaveRemoveCurrent,
      handleDialogSettingsEdit: kernel.handleDialogSettingsEdit,
      handleError: kernel.handleError,
      doesSaveHasUnsavedChanges: kernel.doesSaveHasUnsavedChanges,
    };
  }
  static createDependencies(kernel: KernelManagerInterface): KernelDependencies {
    const saveManager = kernel.getManager("save");
    const toastManager = kernel.getManager("toast");
    const dialogManager = kernel.getManager("dialog");
    const settingsManager = kernel.getManager("settings");

    return {
      addToastSuccess: toastManager.addToastSuccess,
      addToastSave: toastManager.addToastSave,
      addDialogConfirm: dialogManager.addDialogConfirm,
      addDialogEntity: dialogManager.addDialogEntity,
      addDialogAssociation: dialogManager.addDialogAssociation,
      addDialogRelation: dialogManager.addDialogRelation,
      addDialogField: dialogManager.addDialogField,
      addDialogSave: dialogManager.addDialogSave,
      addDialogSettings: dialogManager.addDialogSettings,
      removeDialog: dialogManager.removeDialog,
      getLocalSaves: saveManager.getLocalSaves,
      getCurrentSave: saveManager.getCurrentSave,
      getCurrentToasts: toastManager.getCurrentToasts,
      getCurrentDialogs: dialogManager.getCurrentDialogs,
      getCurrentSettings: settingsManager.getCurrentSettings,
    };
  }
}
