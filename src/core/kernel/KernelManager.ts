import type { ErrorFailResultType } from "@/core/libs/error";
import { type SaveDTOInterface } from "@/core/libs/save";
import { type Settings, SettingsDefault } from "@/core/libs/settings";
import type { FlowDTOInterface } from "@/libs/flow";
import type { MeriseDTOInterface } from "@/libs/merise";
import type { KernelManagerInterface, KernelManagerMap, KernelManagers, KernelResult } from "./KernelTypes";

export default class KernelManager implements KernelManagerInterface {
  private static instance: KernelManager;

  private constructor(private managers: KernelManagers) {}

  static getInstance = (managers: KernelManagers): KernelManager => {
    if (!this.instance) {
      this.instance = new KernelManager(managers);
    }

    return this.instance;
  };

  getManager<K extends keyof KernelManagerMap>(name: K): KernelManagerMap[K] {
    return this.managers[name];
  }

  initDemo = (): void => {
    this.managers.save.initDemo();
  };

  handleCloseDomain = (): void => {
    this.managers.dialog.clearDialogs();
    this.managers.navigator.clearSaveUrlParams();
    this.managers.settings.updateSettings(SettingsDefault);
    this.managers.save.clearSave();

    return;
  };

  handleSaveCreate = (): void => {
    const createSaveResult = this.managers.save.createSave();

    if (!createSaveResult.success) {
      this.handleError(createSaveResult);
      return;
    }

    const openSaveResult = this.managers.save.openSave(createSaveResult.data);

    if (!openSaveResult.success) {
      this.handleError(openSaveResult);
      return;
    }

    this.managers.save.updateCurrentSave(openSaveResult.data);
    this.managers.navigator.setSaveUrlParams(openSaveResult.data.getId());
    this.managers.toast.addToastSuccess("Diagramme sauvegardé");
  };

  handleSaveOpen = (id: string): void => {
    const openSaveResult = this.managers.save.openSave(id);

    if (!openSaveResult.success) {
      this.handleError(openSaveResult);
      return;
    }

    this.managers.save.updateCurrentSave(openSaveResult.data);
    this.managers.navigator.setSaveUrlParams(openSaveResult.data.getId());
  };

  handleSaveUpdate = (save: SaveDTOInterface): void => {
    this.managers.save.updateSave(save);
    this.managers.toast.addToastSuccess("Diagramme sauvegardé");
  };

  handleSaveCurrent = (flow: FlowDTOInterface, merise: MeriseDTOInterface): boolean => {
    const saveCurrentResult = this.managers.save.saveCurrent(this.managers.settings.getCurrentSettings(), flow, merise);

    if (!saveCurrentResult.success) {
      this.handleError(saveCurrentResult);
    }

    return saveCurrentResult.success;
  };

  handleSettingsUpdate = (settings: Settings): void => {
    this.managers.settings.updateSettings(settings);
  };

  handleDialogSaveEdit = (id: string): void => {
    const openSaveResult = this.managers.save.openSave(id);

    if (!openSaveResult.success) {
      this.handleError(openSaveResult);
      return;
    }

    this.managers.dialog.addDialogSave({
      title: "Sauvegarde",
      component: () => openSaveResult.data.renderFormComponent(false),
    });
  };

  handleDialogSaveEditCurrent = (): void => {
    const getCurrentSaveResult = this.managers.save.getCurrentSave();

    if (!getCurrentSaveResult.success) {
      this.handleError(getCurrentSaveResult);
      return;
    }

    this.managers.dialog.addDialogSave({
      title: "Sauvegarde",
      component: () => getCurrentSaveResult.data.renderFormComponent(),
    });
  };

  handleDialogSaveRemove = (id: string): void => {
    this.managers.dialog.addDialogConfirm({
      title: `Supprimer le diagramme`,
      message: `Êtes-vous sûr de vouloir supprimer ce diagramme ?`,
      callbacks: {
        onConfirm: () => onRemoveConfirm(),
      },
    });

    const onRemoveConfirm = () => {
      this.managers.save.removeSave(id);
      this.managers.dialog.clearDialogs();
      this.managers.toast.addToastSuccess("Diagramme supprimé");
    };
  };

  handleDialogSaveRemoveCurrent = (): void => {
    const getCurrentSaveResult = this.managers.save.getCurrentSave();

    if (!getCurrentSaveResult.success) {
      this.handleError(getCurrentSaveResult);
      return;
    }

    this.managers.dialog.addDialogConfirm({
      title: `Supprimer le diagramme`,
      message: `Êtes-vous sûr de vouloir supprimer ce diagramme ?`,
      callbacks: {
        onConfirm: () => onRemoveConfirm(),
      },
    });

    const onRemoveConfirm = () => {
      this.managers.save.removeSave(getCurrentSaveResult.data.getId());
      this.handleCloseDomain();
      this.managers.toast.addToastSuccess("Diagramme supprimé");
    };
  };

  handleDialogSettingsEdit = (): void => {
    this.managers.dialog.addDialogSettings({
      title: "Paramètres",
      component: () => this.managers.settings.getCurrentSettings().renderFormComponent(),
    });
  };

  handleError = (resultFail: ErrorFailResultType): void => {
    this.managers.toast.mapToastError(this.managers.error.mapResultError(resultFail));
  };

  doesSaveHasUnsavedChanges = (flow: FlowDTOInterface, merise: MeriseDTOInterface): KernelResult<boolean, null> => {
    const currentSettings = this.managers.settings.getCurrentSettings();
    return this.managers.save.hasUnsavedChanges(currentSettings, flow, merise, this.managers.normalize);
  };
}
