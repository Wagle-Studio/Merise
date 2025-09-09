import type { Settings, SettingsDTOInterface } from "@/core/libs/settings";
import type { FlowDTOInterface } from "@/libs/flow";
import type { Association, Entity, MeriseAssociation, MeriseDTOInterface, MeriseEntity, MeriseRelation, Relation } from "@/libs/merise";
import type { NormalizeFlowDTOObject, NormalizeManagerInterface, NormalizeMeriseDTOObject, NormalizeSettingsDTOObject } from "./NormalizeTypes";

export default class NormalizeManager implements NormalizeManagerInterface {
  normalizeSettings = (settingsDTO: SettingsDTOInterface): NormalizeSettingsDTOObject => {
    const settings: Settings = settingsDTO.getSettings();

    return {
      theme: settings.theme,
      background: settings.background,
    };
  };

  normalizeFlow = (flowDTO: FlowDTOInterface): NormalizeFlowDTOObject => {
    const nodes = [...flowDTO.getNodes()];
    const edges = [...flowDTO.getEdges()];

    nodes.sort((nodeA, nodeB) => String(nodeA.id).localeCompare(String(nodeB.id)));
    edges.sort((nodeA, nodeB) => String(nodeA.id).localeCompare(String(nodeB.id)));

    return { nodes, edges };
  };

  normalizeMerise = (meriseDTO: MeriseDTOInterface): NormalizeMeriseDTOObject => {
    const entities: MeriseEntity[] = meriseDTO.getEntities().map((entity: Entity) => entity.normalize());
    const associations: MeriseAssociation[] = meriseDTO.getAssociations().map((association: Association) => association.normalize());
    const relations: MeriseRelation[] = meriseDTO.getRelations().map((relation: Relation) => relation.normalize());

    entities.sort((entityA, entityB) => entityA.id.localeCompare(entityB.id));
    associations.sort((associationA, associationB) => associationA.id.localeCompare(associationB.id));
    relations.sort((relationA, relationB) => relationA.id.localeCompare(relationB.id));

    return { entities, associations, relations };
  };
}
