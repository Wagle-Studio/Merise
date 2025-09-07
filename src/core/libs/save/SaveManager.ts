import { v4 as uuidv4 } from "uuid";
import { CoreErrorTypeEnum, type CoreResult } from "@/core";
import { SettingsDTO, type SettingsDTOInterface } from "@/core/libs/settings";
import { FlowDTO, type FlowDTOInterface } from "@/libs/flow";
import { MeriseDTO, type MeriseDTOInterface } from "@/libs/merise";
import SaveDTO from "./SaveDTO";
import { SaveDefault } from "./SaveDefault";
import type { Save, SaveDTOInterface, SaveDTOObject, SaveDispatcher, SaveManagerInterface, SaveRawDTOObject } from "./SaveTypes";

export default class SaveManager implements SaveManagerInterface {
  constructor(
    private getSave: () => SaveDTOInterface | undefined,
    private setSave: SaveDispatcher,
    private getSettings: () => SettingsDTOInterface,
    private getFlow: () => FlowDTOInterface,
    private getMerise: () => MeriseDTOInterface
  ) {}

  saveDemoInit = (): void => {
    if (!localStorage.getItem("save_demo")) {
      const save: Save = {
        id: SaveDefault.id,
        name: SaveDefault.name,
        settings: JSON.parse(SaveDefault.settings),
        flow: JSON.parse(SaveDefault.flow),
        merise: JSON.parse(SaveDefault.merise),
        created: new Date(SaveDefault.created),
        updated: new Date(SaveDefault.updated),
      };

      localStorage.setItem(save.id, JSON.stringify(save));
    }
  };

  createSave = (): string => {
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

    return saveId;
  };

  openSave = (saveId: string): CoreResult<Save, null> => {
    const url = new URL(window.location.href);
    url.searchParams.set("save", saveId);
    window.history.pushState({}, "", url.toString());

    return SaveManager.buildSaveFromSaveId(saveId);
  };

  removeSave = (saveId: string): void => {
    localStorage.removeItem(saveId);
    window.location.reload();
  };

  saveCurrent = (): void => {
    const currentSave = this.getSave();

    if (currentSave) {
      const save: Save = {
        id: currentSave.getId(),
        name: currentSave.getName(),
        settings: this.getSettings(),
        flow: this.getFlow(),
        merise: this.getMerise(),
        created: currentSave.getCreated(),
        updated: new Date(),
      };

      localStorage.setItem(save.id, JSON.stringify(save));
    }
  };

  getCurrentSave = (): SaveDTOInterface | undefined => {
    return this.getSave();
  };

  updateCurrentSave = (save: Save): void => {
    this.setSave(SaveDTO.cloneWithUpdatedSave(save));

    localStorage.setItem(save.id, JSON.stringify(save));
  };

  findLocalSaves = (): CoreResult<SaveRawDTOObject[], null> => {
    const saves: SaveRawDTOObject[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const currentKey = localStorage.key(i);

      if (!currentKey) {
        return {
          success: false,
          message: "Impossible d'accéder aux sauvegardes locales",
          severity: CoreErrorTypeEnum.ERROR,
        };
      }

      const currentSave = localStorage.getItem(currentKey);

      if (!currentSave) {
        return {
          success: false,
          message: "Impossible d'accéder aux sauvegardes locales",
          severity: CoreErrorTypeEnum.ERROR,
        };
      }

      saves.push(JSON.parse(currentSave));
    }

    return {
      success: true,
      data: saves,
    };
  };

  private static buildSaveFromSaveId = (saveId: string): CoreResult<Save, null> => {
    const raw = localStorage.getItem(saveId);

    if (!raw) {
      return {
        success: false,
        message: "La sauvegarde n'existe pas",
        severity: CoreErrorTypeEnum.ERROR,
      };
    }

    const parsed = this.safeParse<SaveDTOObject>(raw);

    if (!parsed) {
      return {
        success: false,
        message: "Impossible de consulter la sauvegarde",
        severity: CoreErrorTypeEnum.ERROR,
      };
    }

    const rawSave: Save = {
      id: parsed.id,
      name: parsed.name,
      settings: SettingsDTO.fromRaw(parsed.settings),
      flow: FlowDTO.fromRaw(parsed.flow),
      merise: MeriseDTO.fromRaw(parsed.merise),
      created: parsed.created,
      updated: parsed.updated,
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
