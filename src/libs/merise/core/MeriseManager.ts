import { Association, Entity, Relation } from "../models";
import type { MeriseDTODispatcher, MeriseDTOInterface, MeriseManagerInterface, MeriseResult } from "../types";
import { MeriseItemTypeEnum } from "../types";
import MeriseHelper from "./MeriseHelper";

export default class MeriseManager implements MeriseManagerInterface {
  private helper: MeriseHelper;

  constructor(
    private getMerise: () => MeriseDTOInterface,
    private setMerise: MeriseDTODispatcher
  ) {
    this.helper = MeriseHelper.getInstance();
  }

  addEntity = (flowId: string): MeriseResult<Entity, null> => {
    return this.helper.addItem<Entity>({
      collection: this.getMerise().getEntities(),
      relations: this.getMerise().getRelations(),
      flowId: flowId,
      itemType: MeriseItemTypeEnum.ENTITY,
      itemName: "l'entité",
      addFn: (item: Entity) => {
        this.setMerise((prev) => prev.cloneWithAddedEntity(item));
      },
    });
  };

  addAssociation = (flowId: string): MeriseResult<Association, null> => {
    return this.helper.addItem<Association>({
      collection: this.getMerise().getAssociations(),
      relations: this.getMerise().getRelations(),
      flowId: flowId,
      itemType: MeriseItemTypeEnum.ASSOCIATION,
      itemName: "l'association",
      addFn: (item: Association) => {
        this.setMerise((prev) => prev.cloneWithAddedAssociation(item));
      },
    });
  };

  addRelation = (flowId: string, source: string, target: string): MeriseResult<Relation, null> => {
    return this.helper.addItem<Relation>({
      collection: this.getMerise().getRelations(),
      relations: this.getMerise().getRelations(),
      flowId: flowId,
      itemType: MeriseItemTypeEnum.RELATION,
      itemName: "la relation",
      addFn: (item: Relation) => {
        this.setMerise((prev) => prev.cloneWithAddedRelation(item));
      },
      source: source,
      target: target,
    });
  };

  updateEntity = (entity: Entity): MeriseResult<Entity, null> => {
    return this.helper.updateItem<Entity>({
      collection: this.getMerise().getEntities(),
      updatedItem: entity,
      itemName: "l'entité",
      updateFn: (items: Entity[]) => {
        this.setMerise((prev) => prev.cloneWithUpdatedEntities(items));
      },
    });
  };

  updateAssociation = (association: Association): MeriseResult<Association, null> => {
    return this.helper.updateItem<Association>({
      collection: this.getMerise().getAssociations(),
      updatedItem: association,
      itemName: "l'association",
      updateFn: (items: Association[]) => {
        this.setMerise((prev) => prev.cloneWithUpdatedAssociations(items));
      },
    });
  };

  updateRelation = (relation: Relation): MeriseResult<Relation, null> => {
    return this.helper.updateItem<Relation>({
      collection: this.getMerise().getRelations(),
      updatedItem: relation,
      itemName: "la relation",
      updateFn: (items: Relation[]) => {
        this.setMerise((prev) => prev.cloneWithUpdatedRelations(items));
      },
    });
  };

  removeEntity = (flowId: string): MeriseResult<Entity, null> => {
    return this.helper.removeItem<Entity>({
      collection: this.getMerise().getEntities(),
      relations: this.getMerise().getRelations(),
      flowId: flowId,
      itemName: "l'entité",
      removeFn: (updatedEntities: Entity[], updatedRelations: Relation[]) => {
        this.setMerise((prev) => prev.cloneWithUpdatedEntitiesAndRelations(updatedEntities, updatedRelations));
      },
    });
  };

  removeAssociation = (flowId: string): MeriseResult<Association, null> => {
    return this.helper.removeItem<Association>({
      collection: this.getMerise().getAssociations(),
      relations: this.getMerise().getRelations(),
      flowId: flowId,
      itemName: "l'association",
      removeFn: (updatedAssociations: Association[], updatedRelations: Relation[]) => {
        this.setMerise((prev) => prev.cloneWithUpdatedAssociationsAndRelations(updatedAssociations, updatedRelations));
      },
    });
  };

  removeRelation = (flowId: string): MeriseResult<Relation, null> => {
    return this.helper.removeItem<Relation>({
      collection: this.getMerise().getRelations(),
      relations: this.getMerise().getRelations(),
      flowId: flowId,
      itemName: "la relation",
      removeFn: (updatedRelations: Relation[]) => {
        this.setMerise((prev) => prev.cloneWithUpdatedRelations(updatedRelations));
      },
    });
  };

  findEntityById = (id: string): MeriseResult<Entity, null> => {
    return this.helper.findItemById<Entity>({
      collection: this.getMerise().getEntities(),
      id: id,
      itemName: "l'entité",
    });
  };

  findAssociationById = (id: string): MeriseResult<Association, null> => {
    return this.helper.findItemById<Association>({
      collection: this.getMerise().getAssociations(),
      id: id,
      itemName: "l'association",
    });
  };

  findEntityByFlowId = (flowId: string): MeriseResult<Entity, null> => {
    return this.helper.findItemByFlowId<Entity>({
      collection: this.getMerise().getEntities(),
      flowId: flowId,
      itemName: "l'entité",
    });
  };

  findAssociationByFlowId = (flowId: string): MeriseResult<Association, null> => {
    return this.helper.findItemByFlowId<Association>({
      collection: this.getMerise().getAssociations(),
      flowId: flowId,
      itemName: "l'association",
    });
  };

  findRelationByFlowId = (flowId: string): MeriseResult<Relation, null> => {
    return this.helper.findItemByFlowId<Relation>({
      collection: this.getMerise().getRelations(),
      flowId: flowId,
      itemName: "la relation",
    });
  };
}
