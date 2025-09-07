import type { Association, Entity, Relation } from "../models";
import type { MeriseAssociation, MeriseEntity, MeriseRelation } from "./MeriseCore";

// Contract for the Merise DTO implementation
export interface MeriseDTOInterface {
  getEntities: () => Entity[];
  getAssociations: () => Association[];
  getRelations: () => Relation[];
  cloneWithAddedEntity: (entity: Entity) => MeriseDTOInterface;
  cloneWithAddedAssociation: (association: Association) => MeriseDTOInterface;
  cloneWithAddedRelation: (relation: Relation) => MeriseDTOInterface;
  cloneWithUpdatedEntities: (entities: Entity[]) => MeriseDTOInterface;
  cloneWithUpdatedAssociations: (associations: Association[]) => MeriseDTOInterface;
  cloneWithUpdatedRelations: (relations: Relation[]) => MeriseDTOInterface;
  cloneWithUpdatedEntitiesAndRelations: (entities: Entity[], relations: Relation[]) => MeriseDTOInterface;
  cloneWithUpdatedAssociationsAndRelations: (associations: Association[], relations: Relation[]) => MeriseDTOInterface;
  cloneWithUpdatedEntitiesAndRelationsAndAssociations: (entities: Entity[], associations: Association[], relations: Relation[]) => MeriseDTOInterface;
}

// Interface for a Merise DTO object
export interface MeriseDTOObject {
  entities: MeriseEntity[];
  associations: MeriseAssociation[];
  relations: MeriseRelation[];
}
