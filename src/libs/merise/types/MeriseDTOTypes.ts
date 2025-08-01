import type { Association, Entity, Relation } from "../models";

// Interface defining the Merise DTO structure
export interface MeriseDTOInterface {
  readonly entities: Entity[];
  readonly associations: Association[];
  readonly relations: Relation[];
  cloneWithAddedEntity: (entity: Entity) => MeriseDTOInterface;
  cloneWithAddedAssociation: (association: Association) => MeriseDTOInterface;
  cloneWithAddedRelation: (relation: Relation) => MeriseDTOInterface;
  cloneWithUpdatedEntities: (entities: Entity[]) => MeriseDTOInterface;
  cloneWithUpdatedAssociations: (associations: Association[]) => MeriseDTOInterface;
  cloneWithUpdatedRelations: (relations: Relation[]) => MeriseDTOInterface;
  cloneWithUpdatedEntitiesAndRelations: (entities: Entity[], relations: Relation[]) => MeriseDTOInterface;
  cloneWithUpdatedAssociationsAndRelations: (associations: Association[], relations: Relation[]) => MeriseDTOInterface;
}
