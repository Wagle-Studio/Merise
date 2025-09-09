import type { SettingsBackgroundType, SettingsDTOInterface, SettingsThemeType } from "@/core/libs/settings";
import type { FlowDTOInterface, TypedEdge, TypedNode } from "@/libs/flow";
import type { MeriseAssociation, MeriseDTOInterface, MeriseEntity, MeriseRelation } from "@/libs/merise";

// Interface for a normalize Settings DTO object
export interface NormalizeSettingsDTOObject {
  theme: SettingsThemeType;
  background: SettingsBackgroundType;
}

// Interface for a normalize Flow DTO object
export interface NormalizeFlowDTOObject {
  edges: TypedEdge[];
  nodes: TypedNode[];
}

// Interface for a normalize Merise DTO object
export interface NormalizeMeriseDTOObject {
  entities: MeriseEntity[];
  associations: MeriseAssociation[];
  relations: MeriseRelation[];
}

// Contract for the normalize manager implementation
export interface NormalizeManagerInterface {
  normalizeSettings: (settingsDTO: SettingsDTOInterface) => NormalizeSettingsDTOObject;
  normalizeFlow: (flowDTO: FlowDTOInterface) => NormalizeFlowDTOObject;
  normalizeMerise: (meriseDTO: MeriseDTOInterface) => NormalizeMeriseDTOObject;
}
