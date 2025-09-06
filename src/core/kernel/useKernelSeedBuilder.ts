import { type KernelSeed, KernelSeedTypeEnum } from "..";
import type { SaverStoreItem } from "@/core/libs/saver";
import type { SaverStoreItemRaw } from "@/core/libs/saver/SaverTypes";
import { FlowDTO, type FlowDTOObject } from "@/libs/flow";
import { MeriseDTO, type MeriseDTOObject } from "@/libs/merise";

const DEFAULT_SAVE = (): SaverStoreItem => ({
  id: "",
  data: { flow: new FlowDTO(), merise: new MeriseDTO() },
});

function safeParse<T>(raw: unknown): T | null {
  if (typeof raw !== "string") return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// Builds save store item from a seed to provide the Kernel initialization
export const useKernelSeedBuilder = (seed: KernelSeed): SaverStoreItem => {
  if (seed.type !== KernelSeedTypeEnum.SAVE_LOCAL) {
    return { ...DEFAULT_SAVE(), id: seed.id };
  }

  const raw = localStorage.getItem(seed.id);

  if (!raw) return { ...DEFAULT_SAVE(), id: seed.id };

  const stored = safeParse<SaverStoreItemRaw>(raw);

  if (!stored) return { ...DEFAULT_SAVE(), id: seed.id };

  const flowDTOraw = safeParse<FlowDTOObject>(stored.data.flow);
  const meriseDTOraw = safeParse<MeriseDTOObject>(stored.data.merise);

  if (!flowDTOraw || !meriseDTOraw) return { ...DEFAULT_SAVE(), id: seed.id };

  const flowDTO = FlowDTO.fromRaw(flowDTOraw);
  const meriseDTO = MeriseDTO.fromRaw(meriseDTOraw);

  return {
    id: seed.id,
    data: { flow: flowDTO, merise: meriseDTO },
  };
};
