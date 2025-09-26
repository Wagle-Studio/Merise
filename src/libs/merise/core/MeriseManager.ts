import { Association, Entity, Relation } from "../models";
import type { MeriseDTODispatcher, MeriseDTOInterface, MeriseManagerInterface, MeriseResult } from "../types";
import { MeriseItemTypeEnum } from "../types";
import meriseHelper from "./MeriseHelper";

export default class MeriseManager implements MeriseManagerInterface {
  constructor(
    private getMerise: () => MeriseDTOInterface,
    private setMerise: MeriseDTODispatcher
  ) {}

  addEntity = (flowId: string): MeriseResult<Entity, null> => {
    const addItemResult = meriseHelper.addItem<Entity>({
      collection: this.getMerise().getEntities(),
      relations: this.getMerise().getRelations(),
      flowId: flowId,
      itemType: MeriseItemTypeEnum.ENTITY,
      itemName: "l'entité",
      addFn: (item: Entity) => {
        this.setMerise((prev) => prev.cloneWithAddedEntity(item));
      },
    });

    if (!addItemResult.success || !addItemResult.data) {
      return addItemResult;
    }

    return {
      success: true,
      data: addItemResult.data,
    };
  };

  addAssociation = (flowId: string): MeriseResult<Association, null> => {
    const addItemResult = meriseHelper.addItem<Association>({
      collection: this.getMerise().getAssociations(),
      relations: this.getMerise().getRelations(),
      flowId: flowId,
      itemType: MeriseItemTypeEnum.ASSOCIATION,
      itemName: "l'association",
      addFn: (item: Association) => {
        this.setMerise((prev) => prev.cloneWithAddedAssociation(item));
      },
    });

    if (!addItemResult.success || !addItemResult.data) {
      return addItemResult;
    }

    return {
      success: true,
      data: addItemResult.data,
    };
  };

  addRelation = (flowId: string, source: string, target: string): MeriseResult<Relation, null> => {
    const addItemResult = meriseHelper.addItem<Relation>({
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

    if (!addItemResult.success || !addItemResult.data) {
      return addItemResult;
    }

    return {
      success: true,
      data: addItemResult.data,
    };
  };

  updateEntity = (entity: Entity): MeriseResult<Entity, null> => {
    const updateItemResult = meriseHelper.updateItem<Entity>({
      collection: this.getMerise().getEntities(),
      updatedItem: entity,
      itemName: "l'entité",
      updateFn: (items: Entity[]) => {
        this.setMerise((prev) => prev.cloneWithUpdatedEntities(items));
      },
    });

    if (!updateItemResult.success || !updateItemResult.data) {
      return updateItemResult;
    }

    return {
      success: true,
      data: updateItemResult.data,
    };
  };

  updateAssociation = (association: Association): MeriseResult<Association, null> => {
    const updateItemResult = meriseHelper.updateItem<Association>({
      collection: this.getMerise().getAssociations(),
      updatedItem: association,
      itemName: "l'association",
      updateFn: (items: Association[]) => {
        this.setMerise((prev) => prev.cloneWithUpdatedAssociations(items));
      },
    });

    if (!updateItemResult.success || !updateItemResult.data) {
      return updateItemResult;
    }

    return {
      success: true,
      data: updateItemResult.data,
    };
  };

  updateRelation = (relation: Relation): MeriseResult<Relation, null> => {
    const updateItemResult = meriseHelper.updateItem<Relation>({
      collection: this.getMerise().getRelations(),
      updatedItem: relation,
      itemName: "la relation",
      updateFn: (items: Relation[]) => {
        this.setMerise((prev) => prev.cloneWithUpdatedRelations(items));
      },
    });

    if (!updateItemResult.success || !updateItemResult.data) {
      return updateItemResult;
    }

    return {
      success: true,
      data: updateItemResult.data,
    };
  };

  removeEntity = (flowId: string): MeriseResult<Entity, null> => {
    const meriseUpdateFunction = (updatedEntities: Entity[], updatedRelations: Relation[]) => {
      this.setMerise((prev) => prev.cloneWithUpdatedEntitiesAndRelations(updatedEntities, updatedRelations));
    };

    const removeItemResult = meriseHelper.removeItem<Entity>({
      collection: this.getMerise().getEntities(),
      relations: this.getMerise().getRelations(),
      flowId: flowId,
      itemName: "l'entité",
      updateFn: meriseUpdateFunction,
    });

    if (!removeItemResult.success || !removeItemResult.data) {
      return removeItemResult;
    }

    return {
      success: true,
      data: removeItemResult.data,
    };
  };

  removeAssociation = (flowId: string): MeriseResult<Association, null> => {
    const meriseUpdateFunction = (updatedAssociations: Association[], updatedRelations: Relation[]) => {
      this.setMerise((prev) => prev.cloneWithUpdatedAssociationsAndRelations(updatedAssociations, updatedRelations));
    };

    const removeItemResult = meriseHelper.removeItem<Association>({
      collection: this.getMerise().getAssociations(),
      relations: this.getMerise().getRelations(),
      flowId: flowId,
      itemName: "l'association",
      updateFn: meriseUpdateFunction,
    });

    if (!removeItemResult.success || !removeItemResult.data) {
      return removeItemResult;
    }

    return {
      success: true,
      data: removeItemResult.data,
    };
  };

  removeRelation = (flowId: string): MeriseResult<Relation, null> => {
    const meriseUpdateFunction = (updatedRelations: Relation[]) => {
      this.setMerise((prev) => prev.cloneWithUpdatedRelations(updatedRelations));
    };

    const removeItemResult = meriseHelper.removeItem<Relation>({
      collection: this.getMerise().getRelations(),
      relations: this.getMerise().getRelations(),
      flowId: flowId,
      itemName: "la relation",
      updateFn: meriseUpdateFunction,
    });

    if (!removeItemResult.success || !removeItemResult.data) {
      return removeItemResult;
    }

    return {
      success: true,
      data: removeItemResult.data,
    };
  };

  findEntityById = (id: string): MeriseResult<Entity, null> => {
    const findResult = meriseHelper.findItemById<Entity>({
      collection: this.getMerise().getEntities(),
      id: id,
      itemName: "l'entité",
    });

    if (!findResult.success) {
      return findResult;
    }

    return {
      success: true,
      data: findResult.data,
    };
  };

  findAssociationById = (id: string): MeriseResult<Association, null> => {
    const findResult = meriseHelper.findItemById<Association>({
      collection: this.getMerise().getAssociations(),
      id: id,
      itemName: "l'association",
    });

    if (!findResult.success) {
      return findResult;
    }

    return {
      success: true,
      data: findResult.data,
    };
  };

  findEntityByFlowId = (flowId: string): MeriseResult<Entity, null> => {
    const findResult = meriseHelper.findItemByFlowId<Entity>({
      collection: this.getMerise().getEntities(),
      flowId: flowId,
      itemName: "l'entité",
    });

    if (!findResult.success) {
      return findResult;
    }

    return {
      success: true,
      data: findResult.data,
    };
  };

  findAssociationByFlowId = (flowId: string): MeriseResult<Association, null> => {
    const findResult = meriseHelper.findItemByFlowId<Association>({
      collection: this.getMerise().getAssociations(),
      flowId: flowId,
      itemName: "l'association",
    });

    if (!findResult.success) {
      return findResult;
    }

    return {
      success: true,
      data: findResult.data,
    };
  };

  findRelationByFlowId = (flowId: string): MeriseResult<Relation, null> => {
    const findResult = meriseHelper.findItemByFlowId<Relation>({
      collection: this.getMerise().getRelations(),
      flowId: flowId,
      itemName: "la relation",
    });

    if (!findResult.success) {
      return findResult;
    }

    return {
      success: true,
      data: findResult.data,
    };
  };
}
