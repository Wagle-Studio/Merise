import type { Association, Entity, Relation } from "../models";
import type { MeriseDTOInterface } from "../types";

export default class MeriseDTO implements MeriseDTOInterface {
  constructor(
    readonly entities: Entity[] = [],
    readonly associations: Association[] = [],
    readonly relations: Relation[] = []
  ) {}

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
}
