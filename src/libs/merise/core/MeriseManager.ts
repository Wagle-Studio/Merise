import { v4 as uuidv4 } from "uuid";
import { Association, Entity, Relation } from "../models";
import type { MeriseAssociationInterface, MeriseDTODispatcher, MeriseDTOInterface, MeriseEntityInterface, MeriseManagerInterface, MeriseRelationInterface, MeriseResult } from "../types";
import { MeriseRelationCardinalityTypeEnum, MeriseSeverityTypeEnum } from "../types";

export default class MeriseManager implements MeriseManagerInterface {
  constructor(
    private getMerise: () => MeriseDTOInterface,
    private setMerise: MeriseDTODispatcher
  ) {}

  addEntity = (flowId: string): MeriseResult<MeriseEntityInterface, null> => {
    if (!flowId?.trim()) {
      return {
        success: false,
        message: "Création de l’entité impossible",
        severity: MeriseSeverityTypeEnum.ERROR,
      };
    }

    const existingEntity = this.getMerise()
      .getEntities()
      .find((entity) => entity.getFlowId() === flowId);

    if (existingEntity) {
      return {
        success: false,
        message: "Une entité avec cette référence existe déjà",
        severity: MeriseSeverityTypeEnum.WARNING,
      };
    }

    const entity = new Entity(uuidv4(), flowId, "Entité");
    this.setMerise((prev) => prev.cloneWithAddedEntity(entity));

    return {
      success: true,
      data: entity,
    };
  };

  addAssociation = (flowId: string): MeriseResult<MeriseAssociationInterface, null> => {
    if (!flowId?.trim()) {
      return {
        success: false,
        message: "Création de l’association impossible",
        severity: MeriseSeverityTypeEnum.ERROR,
      };
    }

    const existingAssociation = this.getMerise()
      .getAssociations()
      .find((association) => association.getFlowId() === flowId);

    if (existingAssociation) {
      return {
        success: false,
        message: "Une association avec cette référence existe déjà",
        severity: MeriseSeverityTypeEnum.WARNING,
      };
    }

    const association = new Association(uuidv4(), flowId, "Association");
    this.setMerise((prev) => prev.cloneWithAddedAssociation(association));

    return {
      success: true,
      data: association,
    };
  };

  addRelation = (flowId: string, source: string, target: string): MeriseResult<MeriseRelationInterface, null> => {
    if (!flowId?.trim() || !source?.trim() || !target?.trim()) {
      return {
        success: false,
        message: "Création de la relation impossible",
        severity: MeriseSeverityTypeEnum.ERROR,
      };
    }

    const validationResult = this.validateRelationCreation(source, target);

    if (!validationResult.success) {
      return validationResult;
    }

    const relation = new Relation(uuidv4(), flowId, source, target, MeriseRelationCardinalityTypeEnum.ZERO_N);

    this.setMerise((prev) => prev.cloneWithAddedRelation(relation));

    return {
      success: true,
      data: relation,
    };
  };

  updateEntity = (updatedEntity: Entity): MeriseResult<MeriseEntityInterface, null> => {
    if (!updatedEntity?.getId()?.trim()) {
      return {
        success: false,
        message: "Mise à jour de l’entité impossible",
        severity: MeriseSeverityTypeEnum.ERROR,
      };
    }

    const merise = this.getMerise();
    const index = merise.getEntities().findIndex((entity) => entity.getId() === updatedEntity.getId());

    if (index === -1) {
      return {
        success: false,
        message: "Entité introuvable",
        severity: MeriseSeverityTypeEnum.ERROR,
      };
    }
    const updatedEntities = [...merise.getEntities()];
    updatedEntities[index] = updatedEntity;

    this.setMerise((prev) => prev.cloneWithUpdatedEntities(updatedEntities));

    return {
      success: true,
      data: updatedEntity,
    };
  };

  updateAssociation = (updatedAssociation: Association): MeriseResult<MeriseAssociationInterface, null> => {
    if (!updatedAssociation?.getId()?.trim()) {
      return {
        success: false,
        message: "Mise à jour de l’association impossible",
        severity: MeriseSeverityTypeEnum.ERROR,
      };
    }

    const merise = this.getMerise();
    const index = merise.getAssociations().findIndex((association) => association.getId() === updatedAssociation.getId());

    if (index === -1) {
      return {
        success: false,
        message: "Association introuvable",
        severity: MeriseSeverityTypeEnum.ERROR,
      };
    }
    const updatedAssociations = [...merise.getAssociations()];
    updatedAssociations[index] = updatedAssociation;

    this.setMerise((prev) => prev.cloneWithUpdatedAssociations(updatedAssociations));

    return {
      success: true,
      data: updatedAssociation,
    };
  };

  updateRelation = (updatedRelation: Relation): MeriseResult<MeriseRelationInterface, null> => {
    if (!updatedRelation?.getId()?.trim()) {
      return {
        success: false,
        message: "Mise à jour de la relation impossible",
        severity: MeriseSeverityTypeEnum.ERROR,
      };
    }

    const merise = this.getMerise();
    const index = merise.getRelations().findIndex((relation) => relation.getId() === updatedRelation.getId());

    if (index === -1) {
      return {
        success: false,
        message: "Relation introuvable",
        severity: MeriseSeverityTypeEnum.ERROR,
      };
    }
    const updatedRelations = [...merise.getRelations()];
    updatedRelations[index] = updatedRelation;

    this.setMerise((prev) => prev.cloneWithUpdatedRelations(updatedRelations));

    return {
      success: true,
      data: updatedRelation,
    };
  };

  removeEntityByFlowId = (flowId: string): MeriseResult<MeriseEntityInterface, null> => {
    const meriseUpdateFunction = (updatedEntities: Entity[], updatedRelations: Relation[]) => {
      this.setMerise((prev) => prev.cloneWithUpdatedEntitiesAndRelations(updatedEntities, updatedRelations));
    };

    const removeItemResult = this.removeItemByFlowId<Entity>(this.getMerise().getEntities(), flowId, "l'entité", meriseUpdateFunction);

    if (!removeItemResult.success || !removeItemResult.data) {
      return removeItemResult;
    }

    return {
      success: true,
      data: removeItemResult.data,
    };
  };

  removeAssociationByFlowId = (flowId: string): MeriseResult<MeriseAssociationInterface, null> => {
    const meriseUpdateFunction = (updatedAssociations: Association[], updatedRelations: Relation[]) => {
      this.setMerise((prev) => prev.cloneWithUpdatedAssociationsAndRelations(updatedAssociations, updatedRelations));
    };

    const removeItemResult = this.removeItemByFlowId<Association>(this.getMerise().getAssociations(), flowId, "l'association", meriseUpdateFunction);

    if (!removeItemResult.success || !removeItemResult.data) {
      return removeItemResult;
    }

    return {
      success: true,
      data: removeItemResult.data,
    };
  };

  removeRelationByFlowId = (flowId: string): MeriseResult<MeriseRelationInterface, null> => {
    const meriseUpdateFunction = (updatedRelations: Relation[]) => {
      this.setMerise((prev) => prev.cloneWithUpdatedRelations(updatedRelations));
    };

    const removeItemResult = this.removeItemByFlowId<Relation>(this.getMerise().getRelations(), flowId, "la relation", meriseUpdateFunction);

    if (!removeItemResult.success || !removeItemResult.data) {
      return removeItemResult;
    }

    return {
      success: true,
      data: removeItemResult.data,
    };
  };

  findEntityById = (id: string): MeriseResult<MeriseEntityInterface, null> => {
    const findResult = this.findItemId(this.getMerise().getEntities(), id, "l'entité");

    if (!findResult.success) {
      return findResult;
    }

    return {
      success: true,
      data: findResult.data,
    };
  };

  findAssociationById = (id: string): MeriseResult<MeriseAssociationInterface, null> => {
    const findResult = this.findItemId(this.getMerise().getAssociations(), id, "l'association");

    if (!findResult.success) {
      return findResult;
    }

    return {
      success: true,
      data: findResult.data,
    };
  };

  findEntityByFlowId = (flowId: string): MeriseResult<MeriseEntityInterface, null> => {
    const findResult = this.findItemByFlowId(this.getMerise().getEntities(), flowId, "l'entité");

    if (!findResult.success) {
      return findResult;
    }

    return {
      success: true,
      data: findResult.data,
    };
  };

  findAssociationByFlowId = (flowId: string): MeriseResult<MeriseAssociationInterface, null> => {
    const findResult = this.findItemByFlowId(this.getMerise().getAssociations(), flowId, "l'association");

    if (!findResult.success) {
      return findResult;
    }

    return {
      success: true,
      data: findResult.data,
    };
  };

  findRelationByFlowId = (flowId: string): MeriseResult<MeriseRelationInterface, null> => {
    const findResult = this.findItemByFlowId(this.getMerise().getRelations(), flowId, "la relation");

    if (!findResult.success) {
      return findResult;
    }

    return {
      success: true,
      data: findResult.data,
    };
  };

  private validateRelationCreation(source: string, target: string): MeriseResult<null, null> {
    if (source === target) {
      return {
        success: false,
        message: "La source et la cible ne peuvent pas être identiques",
        severity: MeriseSeverityTypeEnum.INFO,
      };
    }

    const existingRelation = this.getMerise()
      .getRelations()
      .find((relation) => (relation.getSource() === source && relation.getTarget() === target) || (relation.getSource() === target && relation.getTarget() === source));

    if (existingRelation) {
      return {
        success: false,
        message: "Une relation entre ces éléments existe déjà",
        severity: MeriseSeverityTypeEnum.WARNING,
      };
    }

    return { success: true, data: null };
  }

  private removeItemByFlowId<T extends { getFlowId(): string }>(collection: T[], flowId: string, itemType: string, updateFn: (items: T[], relations: Relation[]) => void): MeriseResult<T, null> {
    if (!flowId?.trim()) {
      return {
        success: false,
        message: `Suppression de ${itemType} impossible`,
        severity: MeriseSeverityTypeEnum.ERROR,
      };
    }

    const index = collection.findIndex((item) => item.getFlowId() === flowId);

    if (index === -1) {
      return {
        success: false,
        message: `${itemType} introuvable`,
        severity: MeriseSeverityTypeEnum.ERROR,
      };
    }

    const item = collection[index];
    const updatedItems = collection.filter((_, i) => i !== index);
    const updatedRelations = this.getMerise()
      .getRelations()
      .filter((relation) => relation.getSource() !== item.getFlowId() && relation.getTarget() !== item.getFlowId());

    updateFn(updatedItems, updatedRelations);

    return {
      success: true,
      data: item,
    };
  }

  private findItemId<T extends { getId(): string }>(collection: T[], id: string, itemType: string): MeriseResult<T, null> {
    if (!id?.trim()) {
      return {
        success: false,
        message: `Id requis pour la recherche`,
        severity: MeriseSeverityTypeEnum.ERROR,
      };
    }

    const item = collection.find((item) => item.getId() === id);

    if (!item) {
      return {
        success: false,
        message: `${itemType} introuvable`,
        severity: MeriseSeverityTypeEnum.ERROR,
      };
    }

    return { success: true, data: item };
  }

  private findItemByFlowId<T extends { getFlowId(): string }>(collection: T[], flowId: string, itemType: string): MeriseResult<T, null> {
    if (!flowId?.trim()) {
      return {
        success: false,
        message: `FlowId requis pour la recherche`,
        severity: MeriseSeverityTypeEnum.ERROR,
      };
    }

    const item = collection.find((item) => item.getFlowId() === flowId);

    if (!item) {
      return {
        success: false,
        message: `${itemType} introuvable`,
        severity: MeriseSeverityTypeEnum.ERROR,
      };
    }

    return { success: true, data: item };
  }
}
