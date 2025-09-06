import { type KernelSeed, KernelSeedTypeEnum } from "..";
import type { SaverStoreItem } from "@/core/libs/saver";
import type { SaverStoreItemRaw } from "@/core/libs/saver/SaverTypes";
import { FlowDTO, type FlowDTOObject } from "@/libs/flow";
import { MeriseDTO, type MeriseDTOObject } from "@/libs/merise";

// Builds save store item from a seed to provide the Kernel initialization
export const useKernelSeedBuilder = (seed: KernelSeed): SaverStoreItem => {
  if (seed.type !== KernelSeedTypeEnum.SAVE_LOCAL) {
    return { ...DEFAULT_SAVE(seed), id: seed.id };
  }

  const raw = localStorage.getItem(seed.id);

  if (!raw) throw new Error("Impossible de trouver la sauvegarde");

  const stored = safeParse<SaverStoreItemRaw>(raw);

  if (!stored) throw new Error("Impossible de consulter la sauvegarde");

  const flowDTOraw = safeParse<FlowDTOObject>(stored.data.flow);
  const meriseDTOraw = safeParse<MeriseDTOObject>(stored.data.merise);

  if (!flowDTOraw || !meriseDTOraw) throw new Error("Impossible d'exploiter la sauvegarde");

  const flowDTO = FlowDTO.fromRaw(flowDTOraw);
  const meriseDTO = MeriseDTO.fromRaw(meriseDTOraw);

  return {
    id: seed.id,
    name: seed.name,
    data: { flow: flowDTO, merise: meriseDTO },
    created: seed.created,
    updated: seed.updated,
  };
};

const DEFAULT_SAVE = (seed: KernelSeed): SaverStoreItem => ({
  id: seed.id,
  name: seed.name,
  data: { flow: new FlowDTO(), merise: new MeriseDTO() },
  created: seed.created,
  updated: seed.updated,
});

function safeParse<T>(raw: unknown): T | null {
  if (typeof raw !== "string") return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
