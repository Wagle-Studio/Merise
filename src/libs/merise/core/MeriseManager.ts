import { Association, Entity, Relation } from "../models";
import type { MeriseAssociationInterface, MeriseDTODispatcher, MeriseDTOInterface, MeriseDependencies, MeriseEntityInterface, MeriseManagerInterface, MeriseRelationInterface, MeriseResult } from "../types";
import { MeriseErrorTypeEnum } from "../types";

export default class MeriseManager implements MeriseManagerInterface {
  constructor(
    private getMerise: () => MeriseDTOInterface,
    private setMerise: MeriseDTODispatcher,
    private dependencies: MeriseDependencies
  ) {}

  setDependencies = (dependencies: any): void => {
    this.dependencies = dependencies;
  };

  addEntity = (flowId: string): MeriseResult<MeriseEntityInterface> => {
    if (!flowId?.trim()) {
      return {
        success: false,
        message: "Impossible de créer l'entité",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const existingEntity = this.getMerise().entities.find((entity) => entity.flowId === flowId);

    if (existingEntity) {
      return {
        success: false,
        message: "Une entité avec une référence identique existe déjà",
        severity: MeriseErrorTypeEnum.WARNING,
      };
    }

    const entity = new Entity(flowId, this.dependencies);
    this.setMerise((prev) => prev.cloneWithAddedEntity(entity));

    return {
      success: true,
      data: entity,
    };
  };

  addAssociation = (flowId: string): MeriseResult<MeriseAssociationInterface> => {
    if (!flowId?.trim()) {
      return {
        success: false,
        message: "Impossible de créer l'association",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const existingAssociation = this.getMerise().associations.find((association) => association.flowId === flowId);

    if (existingAssociation) {
      return {
        success: false,
        message: "Une association avec une référence identique existe déjà",
        severity: MeriseErrorTypeEnum.WARNING,
      };
    }

    const association = new Association(flowId, this.dependencies);
    this.setMerise((prev) => prev.cloneWithAddedAssociation(association));

    return {
      success: true,
      data: association,
    };
  };

  addRelation = (flowId: string, source: string, target: string): MeriseResult<MeriseRelationInterface> => {
    if (!flowId?.trim() || !source?.trim() || !target?.trim()) {
      return {
        success: false,
        message: "Impossible de créer la relation",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    if (source === target) {
      return {
        success: false,
        message: "Impossible de créer une relation vers soi-même",
        severity: MeriseErrorTypeEnum.INFO,
      };
    }

    const existingRelation = this.getMerise().relations.find((relation) => {
      return (relation.source === source && relation.target === target) || (relation.source === target && relation.target === source);
    });

    if (existingRelation) {
      return {
        success: false,
        message: "Une relation existe déjà entre ces éléments",
        severity: MeriseErrorTypeEnum.WARNING,
      };
    }

    const relation = new Relation(flowId, source, target, this.dependencies);

    this.setMerise((prev) => prev.cloneWithAddedRelation(relation));

    return {
      success: true,
      data: relation,
    };
  };

  updateEntity = (updatedEntity: Entity): MeriseResult<MeriseEntityInterface> => {
    if (!updatedEntity?.id?.trim()) {
      return {
        success: false,
        message: "Impossible de mettre à jour l'entité",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const merise = this.getMerise();
    const index = merise.entities.findIndex((entity) => entity.id === updatedEntity.id);

    if (index === -1) {
      return {
        success: false,
        message: "Entité non trouvée pour la mise à jour",
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

  updateAssociation = (updatedAssociation: Association): MeriseResult<MeriseAssociationInterface> => {
    if (!updatedAssociation?.id?.trim()) {
      return {
        success: false,
        message: "Impossible de mettre à jour l'association",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const merise = this.getMerise();
    const index = merise.associations.findIndex((association) => association.id === updatedAssociation.id);

    if (index === -1) {
      return {
        success: false,
        message: "Association non trouvée pour la mise à jour",
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

  updateRelation = (updatedRelation: Relation): MeriseResult<MeriseRelationInterface> => {
    if (!updatedRelation?.id?.trim()) {
      return {
        success: false,
        message: "Impossible de mettre à jour la relation",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const merise = this.getMerise();
    const index = merise.relations.findIndex((relation) => relation.id === updatedRelation.id);

    if (index === -1) {
      return {
        success: false,
        message: "Relation non trouvée pour la mise à jour",
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

  removeEntityByFlowId = (flowId: string): MeriseResult<MeriseEntityInterface | null> => {
    if (!flowId?.trim()) {
      return {
        success: false,
        message: "Impossible d'identifier l'entité à supprimer",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const merise = this.getMerise();
    const index = merise.entities.findIndex((entity) => entity.flowId === flowId);

    if (index === -1) {
      return {
        success: false,
        message: "Impossible d'identifier l'entité à supprimer",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const entity = merise.entities[index];
    const updatedEntities = merise.entities.filter((_, i) => i !== index);
    const updatedRelations = this.getMerise().relations.filter((relation) => relation.source !== entity.flowId && relation.target !== entity.flowId);

    this.setMerise((prev) => prev.cloneWithUpdatedEntitiesAndRelations(updatedEntities, updatedRelations));

    return {
      success: true,
      data: entity,
    };
  };

  removeAssociationByFlowId = (flowId: string): MeriseResult<MeriseAssociationInterface | null> => {
    if (!flowId?.trim()) {
      return {
        success: false,
        message: "Impossible d'identifier l'association à supprimer",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const merise = this.getMerise();
    const index = merise.associations.findIndex((association) => association.flowId === flowId);

    if (index === -1) {
      return {
        success: false,
        message: "Impossible d'identifier l'entité à supprimer",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const association = merise.associations[index];
    const updatedAssociations = merise.associations.filter((_, i) => i !== index);
    const updatedRelations = this.getMerise().relations.filter((relation) => relation.source !== association.flowId && relation.target !== association.flowId);

    this.setMerise((prev) => prev.cloneWithUpdatedAssociationsAndRelations(updatedAssociations, updatedRelations));

    return {
      success: true,
      data: association,
    };
  };

  removeRelationByFlowId = (flowId: string): MeriseResult<MeriseRelationInterface | null> => {
    if (!flowId?.trim()) {
      return {
        success: false,
        message: "Impossible d'identifier la relation à supprimer",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const merise = this.getMerise();
    const index = merise.relations.findIndex((relation) => relation.flowId === flowId);

    if (index === -1) {
      return {
        success: false,
        message: "Impossible d'identifier l'entité à supprimer",
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

  findEntityByFlowId = (flowId: string): MeriseResult<MeriseEntityInterface | null> => {
    if (!flowId?.trim()) {
      return {
        success: false,
        message: "FlowId requis pour rechercher l'entité",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const entity = this.getMerise().entities.find((entity) => entity.flowId === flowId);

    if (!entity) {
      return {
        success: false,
        message: "Impossible d'identifier l'entité recherchée",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    return {
      success: true,
      data: entity,
    };
  };

  findAssociationByFlowId = (flowId: string): MeriseResult<MeriseAssociationInterface | null> => {
    if (!flowId?.trim()) {
      return {
        success: false,
        message: "FlowId requis pour rechercher l'association",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const association = this.getMerise().associations.find((association) => association.flowId === flowId);

    if (!association) {
      return {
        success: false,
        message: "Impossible d'identifier l'association recherchée",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    return {
      success: true,
      data: association,
    };
  };

  findRelationByFlowId = (flowId: string): MeriseResult<MeriseRelationInterface | null> => {
    if (!flowId?.trim()) {
      return {
        success: false,
        message: "FlowId requis pour rechercher la relation",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    const relation = this.getMerise().relations.find((relation) => relation.flowId === flowId);

    if (!relation) {
      return {
        success: false,
        message: "Impossible d'identifier la relation recherchée",
        severity: MeriseErrorTypeEnum.ERROR,
      };
    }

    return {
      success: true,
      data: relation,
    };
  };
}
