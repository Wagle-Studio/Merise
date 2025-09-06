import type { Association, Entity, Relation } from "../models";
import type { MeriseDTOInterface } from "../types";

export default class MeriseDTO implements MeriseDTOInterface {
  private entities: Entity[] = [];
  private associations: Association[] = [];
  private relations: Relation[] = [];

  constructor(entities: Entity[] = [], associations: Association[] = [], relations: Relation[] = []) {
    this.entities = entities;
    this.associations = associations;
    this.relations = relations;
  }

  getEntities = (): Entity[] => {
    return this.entities;
  };

  getAssociations = (): Association[] => {
    return this.associations;
  };

  getRelations = (): Relation[] => {
    return this.relations;
  };

  getStringifiedEntities = (): string => {
    return JSON.stringify(this.entities);
  };

  getStringifiedAssociations = (): string => {
    return JSON.stringify(this.associations);
  };

  getStringifiedRelations = (): string => {
    return JSON.stringify(this.relations);
  };

  cloneWithAddedEntity = (entity: Entity): MeriseDTOInterface => {
    return new MeriseDTO([...this.entities, entity], this.associations, this.relations);
  };

  cloneWithAddedAssociation = (association: Association): MeriseDTOInterface => {
    return new MeriseDTO(this.entities, [...this.associations, association], this.relations);
  };

  cloneWithAddedRelation = (relation: Relation): MeriseDTOInterface => {
    return new MeriseDTO(this.entities, this.associations, [...this.relations, relation]);
  };

  cloneWithUpdatedEntities = (entities: Entity[]): MeriseDTOInterface => {
    return new MeriseDTO(entities, this.associations, this.relations);
  };

  cloneWithUpdatedAssociations = (associations: Association[]): MeriseDTOInterface => {
    return new MeriseDTO(this.entities, associations, this.relations);
  };

  cloneWithUpdatedRelations = (relations: Relation[]): MeriseDTOInterface => {
    return new MeriseDTO(this.entities, this.associations, relations);
  };

  cloneWithUpdatedEntitiesAndRelations = (entities: Entity[], relations: Relation[]): MeriseDTOInterface => {
    return new MeriseDTO(entities, this.associations, relations);
  };

  cloneWithUpdatedAssociationsAndRelations = (associations: Association[], relations: Relation[]): MeriseDTOInterface => {
    return new MeriseDTO(this.entities, associations, relations);
  };

  cloneWithUpdatedEntitiesAndRelationsAndAssociations = (entities: Entity[], associations: Association[], relations: Relation[]): MeriseDTOInterface => {
    return new MeriseDTO(entities, associations, relations);
  };
}
