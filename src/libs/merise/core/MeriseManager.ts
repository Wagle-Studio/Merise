import { Association, Entity, Relation } from "../models";
import type { MeriseAssociationInterface, MeriseDTODispatcher, MeriseDTOInterface, MeriseEntityInterface, MeriseManagerInterface, MeriseRelationInterface, MeriseResult } from "../types";
import { MeriseErrorTypeEnum, MeriseRelationCardinalityTypeEnum } from "../types";

export default class MeriseManager implements MeriseManagerInterface {
  constructor(
    private getMerise: () => MeriseDTOInterface,
    private setMerise: MeriseDTODispatcher
  ) {}

  // CORE MANAGER
  addEntity = (flowId: string): MeriseResult<MeriseEntityInterface> => {
    if (!flowId?.trim()) {
      return {
        success: false,
        message: "Création de l’entité impossible",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const existingEntity = this.getMerise().entities.find((entity) => entity.getFlowId() === flowId);

    if (existingEntity) {
      return {
        success: false,
        message: "Une entité avec cette référence existe déjà",
        severity: MeriseErrorTypeEnum.WARNING,
      };
    }

    const entity = new Entity(flowId);
    this.setMerise((prev) => prev.cloneWithAddedEntity(entity));

    return {
      success: true,
      data: entity,
    };
  };

  // CORE MANAGER
  addAssociation = (flowId: string): MeriseResult<MeriseAssociationInterface> => {
    if (!flowId?.trim()) {
      return {
        success: false,
        message: "Création de l’association impossible",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const existingAssociation = this.getMerise().associations.find((association) => association.getFlowId() === flowId);

    if (existingAssociation) {
      return {
        success: false,
        message: "Une association avec cette référence existe déjà",
        severity: MeriseErrorTypeEnum.WARNING,
      };
    }

    const association = new Association(flowId);
    this.setMerise((prev) => prev.cloneWithAddedAssociation(association));

    return {
      success: true,
      data: association,
    };
  };

  // CORE MANAGER
  addRelation = (flowId: string, source: string, target: string): MeriseResult<MeriseRelationInterface> => {
    if (!flowId?.trim() || !source?.trim() || !target?.trim()) {
      return {
        success: false,
        message: "Création de la relation impossible",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const validationResult = this.validateRelationCreation(source, target);

    if (!validationResult.success) {
      return validationResult as MeriseResult<MeriseRelationInterface>;
    }

    const relation = new Relation(flowId, source, target, MeriseRelationCardinalityTypeEnum.ZERO_N);

    this.setMerise((prev) => prev.cloneWithAddedRelation(relation));

    return {
      success: true,
      data: relation,
    };
  };

  // CORE MANAGER
  updateEntity = (updatedEntity: Entity): MeriseResult<MeriseEntityInterface> => {
    if (!updatedEntity?.getId()?.trim()) {
      return {
        success: false,
        message: "Mise à jour de l’entité impossible",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const merise = this.getMerise();
    const index = merise.entities.findIndex((entity) => entity.getId() === updatedEntity.getId());

    if (index === -1) {
      return {
        success: false,
        message: "Entité introuvable",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }
    const updatedEntities = [...merise.entities];
    updatedEntities[index] = updatedEntity;

    this.setMerise((prev) => prev.cloneWithUpdatedEntities(updatedEntities));

    return {
      success: true,
      data: updatedEntity,
    };
  };

  // CORE MANAGER
  updateAssociation = (updatedAssociation: Association): MeriseResult<MeriseAssociationInterface> => {
    if (!updatedAssociation?.getId()?.trim()) {
      return {
        success: false,
        message: "Mise à jour de l’association impossible",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const merise = this.getMerise();
    const index = merise.associations.findIndex((association) => association.getId() === updatedAssociation.getId());

    if (index === -1) {
      return {
        success: false,
        message: "Association introuvable",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }
    const updatedAssociations = [...merise.associations];
    updatedAssociations[index] = updatedAssociation;

    this.setMerise((prev) => prev.cloneWithUpdatedAssociations(updatedAssociations));

    return {
      success: true,
      data: updatedAssociation,
    };
  };

  // CORE MANAGER
  updateRelation = (updatedRelation: Relation): MeriseResult<MeriseRelationInterface> => {
    if (!updatedRelation?.getId()?.trim()) {
      return {
        success: false,
        message: "Mise à jour de la relation impossible",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const merise = this.getMerise();
    const index = merise.relations.findIndex((relation) => relation.getId() === updatedRelation.getId());

    if (index === -1) {
      return {
        success: false,
        message: "Relation introuvable",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }
    const updatedRelations = [...merise.relations];
    updatedRelations[index] = updatedRelation;

    this.setMerise((prev) => prev.cloneWithUpdatedRelations(updatedRelations));

    return {
      success: true,
      data: updatedRelation,
    };
  };

  // CORE MANAGER
  removeEntityByFlowId = (flowId: string): MeriseResult<MeriseEntityInterface | null> => {
    return this.removeItemByFlowId(this.getMerise().entities, flowId, "l'entité", (updatedEntities, updatedRelations) => {
      this.setMerise((prev) => prev.cloneWithUpdatedEntitiesAndRelations(updatedEntities, updatedRelations));
    });
  };

  // CORE MANAGER
  removeAssociationByFlowId = (flowId: string): MeriseResult<MeriseAssociationInterface | null> => {
    return this.removeItemByFlowId(this.getMerise().associations, flowId, "l'association", (updatedAssociations, updatedRelations) => {
      this.setMerise((prev) => prev.cloneWithUpdatedAssociationsAndRelations(updatedAssociations, updatedRelations));
    });
  };

  // CORE MANAGER
  removeRelationByFlowId = (flowId: string): MeriseResult<MeriseRelationInterface | null> => {
    if (!flowId?.trim()) {
      return {
        success: false,
        message: "Suppression de la relation impossible",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const merise = this.getMerise();
    const index = merise.relations.findIndex((relation) => relation.getFlowId() === flowId);

    if (index === -1) {
      return {
        success: false,
        message: "Relation introuvable",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const removedRelation = merise.relations[index];
    const updatedRelations = merise.relations.filter((_, i) => i !== index);

    this.setMerise((prev) => prev.cloneWithUpdatedRelations(updatedRelations));

    return {
      success: true,
      data: removedRelation,
    };
  };

  // CORE MANAGER
  findEntityById = (id: string): MeriseResult<MeriseEntityInterface | null> => {
    return this.findItemId(this.getMerise().entities, id, "l'entité") as MeriseResult<MeriseEntityInterface | null>;
  };

  // CORE MANAGER
  findAssociationById = (id: string): MeriseResult<MeriseAssociationInterface | null> => {
    return this.findItemId(this.getMerise().associations, id, "l'association") as MeriseResult<MeriseAssociationInterface | null>;
  };

  // FLOW FACTORY
  findEntityByFlowId = (flowId: string): MeriseResult<MeriseEntityInterface | null> => {
    return this.findItemByFlowId(this.getMerise().entities, flowId, "l'entité") as MeriseResult<MeriseEntityInterface | null>;
  };

  // FLOW FACTORY
  findAssociationByFlowId = (flowId: string): MeriseResult<MeriseAssociationInterface | null> => {
    return this.findItemByFlowId(this.getMerise().associations, flowId, "l'association") as MeriseResult<MeriseAssociationInterface | null>;
  };

  // FLOW FACTORY
  findRelationByFlowId = (flowId: string): MeriseResult<MeriseRelationInterface | null> => {
    return this.findItemByFlowId(this.getMerise().relations, flowId, "la relation") as MeriseResult<MeriseRelationInterface | null>;
  };

  private validateRelationCreation(source: string, target: string): MeriseResult<void> {
    if (source === target) {
      return {
        success: false,
        message: "La source et la cible ne peuvent pas être identiques",
        severity: MeriseErrorTypeEnum.INFO,
      };
    }

    const existingRelation = this.getMerise().relations.find((relation) => (relation.getSource() === source && relation.getTarget() === target) || (relation.getSource() === target && relation.getTarget() === source));

    if (existingRelation) {
      return {
        success: false,
        message: "Une relation entre ces éléments existe déjà",
        severity: MeriseErrorTypeEnum.WARNING,
      };
    }

    return { success: true, data: undefined };
  }

  private removeItemByFlowId<T extends { getFlowId(): string }>(collection: T[], flowId: string, itemType: string, updateFn: (items: T[], relations: Relation[]) => void): MeriseResult<T | null> {
    if (!flowId?.trim()) {
      return {
        success: false,
        message: `Suppression de ${itemType} impossible`,
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const index = collection.findIndex((item) => item.getFlowId() === flowId);

    if (index === -1) {
      return {
        success: false,
        message: `${itemType} introuvable`,
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const item = collection[index];
    const updatedItems = collection.filter((_, i) => i !== index);
    const updatedRelations = this.getMerise().relations.filter((relation) => relation.getSource() !== item.getFlowId() && relation.getTarget() !== item.getFlowId());

    updateFn(updatedItems, updatedRelations);

    return {
      success: true,
      data: item,
    };
  }

  private findItemId<T extends { getId(): string }>(collection: T[], id: string, itemType: string): MeriseResult<T | null> {
    if (!id?.trim()) {
      return {
        success: false,
        message: `Id requis pour la recherche`,
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const item = collection.find((item) => item.getId() === id);
    if (!item) {
      return {
        success: false,
        message: `${itemType} introuvable`,
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    return { success: true, data: item };
  }

  private findItemByFlowId<T extends { getFlowId(): string }>(collection: T[], flowId: string, itemType: string): MeriseResult<T | null> {
    if (!flowId?.trim()) {
      return {
        success: false,
        message: `FlowId requis pour la recherche`,
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const item = collection.find((item) => item.getFlowId() === flowId);
    if (!item) {
      return {
        success: false,
        message: `${itemType} introuvable`,
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    return { success: true, data: item };
  }
}
