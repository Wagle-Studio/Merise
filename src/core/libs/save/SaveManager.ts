import { v4 as uuidv4 } from "uuid";
import { type CoreResult, CoreSeverityTypeEnum } from "@/core";
import { SettingsDTO, type SettingsDTOInterface } from "@/core/libs/settings";
import { FlowDTO, type FlowDTOInterface } from "@/libs/flow";
import { MeriseDTO, type MeriseDTOInterface } from "@/libs/merise";
import type { NormalizeManagerInterface } from "../normalize";
import SaveDTO from "./SaveDTO";
import { SaveDemo } from "./SaveDemo";
import type {
  Save,
  SaveDTOInterface,
  SaveDTOObject,
  SaveDispatcher,
  SaveManagerInterface,
  SaveRawDTOObject,
} from "./SaveTypes";

export default class SaveManager implements SaveManagerInterface {
  private static instance: SaveManager;

  private constructor(
    private getSave: () => SaveDTOInterface | null,
    private setSave: SaveDispatcher
  ) {}

  static getInstance = (getSave: () => SaveDTOInterface | null, setSave: SaveDispatcher): SaveManager => {
    if (!this.instance) {
      this.instance = new SaveManager(getSave, setSave);
    }

    return this.instance;
  };

  static initSaveFromUrlParams = (): SaveDTOInterface | null => {
    const params = new URLSearchParams(window.location.search);
    const saveId = params.get("save");

    if (!saveId) return null;

    const buildSaveResult = SaveManager.buildSaveFromId(saveId);

    if (!buildSaveResult.success) return null;

    return new SaveDTO(buildSaveResult.data);
  };

  initDemo = (): void => {
    if (!localStorage.getItem(SaveDemo.id)) {
      const save: Save = {
        id: SaveDemo.id,
        name: SaveDemo.name,
        settings: JSON.parse(SaveDemo.settings),
        flow: JSON.parse(SaveDemo.flow),
        merise: JSON.parse(SaveDemo.merise),
        created: new Date(SaveDemo.created),
        updated: new Date(SaveDemo.updated),
      };

      localStorage.setItem(save.id, JSON.stringify(save));
    }
  };

  clearSave = (): void => {
    this.setSave(null);
  };

  createSave = (): CoreResult<string, null> => {
    const saveId = uuidv4();

    const save: Save = {
      id: saveId,
      name: "Nouveau diagramme",
      settings: new SettingsDTO(),
      flow: new FlowDTO(),
      merise: new MeriseDTO(),
      created: new Date(),
      updated: new Date(),
    };

    localStorage.setItem(saveId, JSON.stringify(save));

    return {
      success: true,
      data: save.id,
    };
  };

  openSave = (saveId: string): CoreResult<Save, null> => {
    return SaveManager.buildSaveFromId(saveId);
  };

  updateSave = (saveDTO: SaveDTOInterface): void => {
    localStorage.setItem(saveDTO.getId(), JSON.stringify(saveDTO.getSave()));
  };

  removeSave = (saveId: string): void => {
    localStorage.removeItem(saveId);
  };

  saveCurrent = (
    settings: SettingsDTOInterface,
    flow: FlowDTOInterface,
    merise: MeriseDTOInterface
  ): CoreResult<null, null> => {
    const currentSave = this.getSave();

    if (!currentSave) {
      return {
        success: false,
        message: "Aucune sauvegarde à mettre à jour",
        severity: CoreSeverityTypeEnum.ERROR,
      };
    }

    const save: Save = {
      id: currentSave.getId(),
      name: currentSave.getName(),
      settings: settings,
      flow: flow,
      merise: merise,
      created: currentSave.getCreated(),
      updated: new Date(),
    };

    this.setSave(SaveDTO.cloneWithUpdatedSave(save));
    localStorage.setItem(save.id, JSON.stringify(save));

    return {
      success: true,
      data: null,
    };
  };

  getCurrentSave = (): CoreResult<SaveDTOInterface, null> => {
    const save = this.getSave();

    if (!save) {
      return {
        success: false,
        message: "Sauvegarde introuvable",
        severity: CoreSeverityTypeEnum.ERROR,
      };
    }

    return {
      success: true,
      data: save,
    };
  };

  updateCurrentSave = (saveDTO: SaveDTOInterface): void => {
    this.setSave(saveDTO);
    localStorage.setItem(saveDTO.getId(), JSON.stringify(saveDTO.getSave()));
  };

  hasUnsavedChanges = (
    settings: SettingsDTOInterface,
    flow: FlowDTOInterface,
    merise: MeriseDTOInterface,
    normalizer: NormalizeManagerInterface
  ): CoreResult<boolean, null> => {
    const currentSave = this.getSave();

    if (!currentSave) {
      return {
        success: false,
        message: "Sauvegarde introuvable",
        severity: CoreSeverityTypeEnum.ERROR,
      };
    }

    const buildFreshBaseSaveResult = SaveManager.buildSaveFromId(currentSave.getId());

    if (!buildFreshBaseSaveResult.success) return buildFreshBaseSaveResult;

    const freshSave = buildFreshBaseSaveResult.data;

    const normalizedCurrentSettings = normalizer.normalizeSettings(settings);
    const normalizedCurrentFlow = normalizer.normalizeFlow(flow);
    const normalizedCurrentMerise = normalizer.normalizeMerise(merise);

    const normalizedFreshSettings = normalizer.normalizeSettings(freshSave.settings);
    const normalizedFreshFlow = normalizer.normalizeFlow(freshSave.flow);
    const normalizedFreshMerise = normalizer.normalizeMerise(freshSave.merise);

    const sameSettings = JSON.stringify(normalizedCurrentSettings) === JSON.stringify(normalizedFreshSettings);
    const sameFlow = JSON.stringify(normalizedCurrentFlow) === JSON.stringify(normalizedFreshFlow);
    const sameMerise = JSON.stringify(normalizedCurrentMerise) === JSON.stringify(normalizedFreshMerise);

    const differences = {
      settings: !sameSettings,
      flow: !sameFlow,
      merise: !sameMerise,
    };

    return {
      success: true,
      data: Object.values(differences).some(Boolean),
    };
  };

  findLocalSaves = (): CoreResult<SaveRawDTOObject[], null> => {
    const saves: SaveRawDTOObject[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const currentKey = localStorage.key(i);

      if (!currentKey) {
        return {
          success: false,
          message: "Impossible d'accéder aux sauvegardes locales",
          severity: CoreSeverityTypeEnum.ERROR,
        };
      }

      const currentSave = localStorage.getItem(currentKey);

      if (!currentSave) {
        return {
          success: false,
          message: "Impossible d'accéder aux sauvegardes locales",
          severity: CoreSeverityTypeEnum.ERROR,
        };
      }

      saves.push(JSON.parse(currentSave));
    }

    const sortedSaves = saves.sort((saveA, saveB) => {
      return saveA.name.localeCompare(saveB.name);
    });

    return {
      success: true,
      data: sortedSaves,
    };
  };

  private static buildSaveFromId = (saveId: string): CoreResult<Save, null> => {
    const raw = localStorage.getItem(saveId);

    if (!raw) {
      return {
        success: false,
        message: "La sauvegarde n'existe pas",
        severity: CoreSeverityTypeEnum.ERROR,
      };
    }

    const parsed = this.safeParse<SaveDTOObject>(raw);

    if (!parsed) {
      return {
        success: false,
        message: "Impossible de consulter la sauvegarde",
        severity: CoreSeverityTypeEnum.ERROR,
      };
    }

    const rawSave: Save = {
      id: parsed.id,
      name: parsed.name,
      settings: SettingsDTO.fromRaw(parsed.settings),
      flow: FlowDTO.fromRaw(parsed.flow),
      merise: MeriseDTO.fromRaw(parsed.merise),
      created: new Date(parsed.created),
      updated: new Date(parsed.updated),
    };

    return {
      success: true,
      data: rawSave,
    };
  };

  private static safeParse<T>(raw: unknown): T | null {
    if (typeof raw !== "string") return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }
}
