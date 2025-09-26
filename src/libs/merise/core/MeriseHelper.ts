import { v4 as uuidv4 } from "uuid";
import { Association, Entity, Relation } from "../models";
import type {
  MeriseAddItemProps,
  MeriseFindItemByFlowIdProps,
  MeriseFindItemByIdProps,
  MeriseRemoveItemProps,
  MeriseResult,
  MeriseUpdateItemProps,
} from "../types";
import { MeriseItemTypeEnum, MeriseRelationCardinalityTypeEnum, MeriseSeverityTypeEnum } from "../types";

const addItem = <T extends Entity | Association | Relation>(props: MeriseAddItemProps<T>): MeriseResult<T, null> => {
  const { collection, relations, flowId, itemType, itemName, addFn, source, target } = props;

  if (!flowId?.trim()) {
    return {
      success: false,
      message: `Création de ${itemName} impossible`,
      severity: MeriseSeverityTypeEnum.ERROR,
    };
  }

  const exists = collection.some((item) => item.getFlowId() === flowId);

  if (exists) {
    return {
      success: false,
      message: `Une ${itemName} avec cette référence existe déjà`,
      severity: MeriseSeverityTypeEnum.WARNING,
    };
  }

  if (itemType === MeriseItemTypeEnum.RELATION) {
    if (!source?.trim() || !target?.trim()) {
      return {
        success: false,
        message: `Création de ${itemName} impossible`,
        severity: MeriseSeverityTypeEnum.ERROR,
      };
    }

    const validation = validateRelationCreation(source, target, relations);

    if (!validation.success) return validation as any;

    const relation = new Relation(uuidv4(), flowId, source, target, MeriseRelationCardinalityTypeEnum.ZERO_N) as T;
    addFn(relation);

    return { success: true, data: relation };
  }

  if (itemType === MeriseItemTypeEnum.ENTITY) {
    const entity = new Entity(uuidv4(), flowId, "Entité") as T;
    addFn(entity);

    return { success: true, data: entity };
  }

  if (itemType === MeriseItemTypeEnum.ASSOCIATION) {
    const association = new Association(uuidv4(), flowId, "Association") as T;
    addFn(association);

    return { success: true, data: association };
  }

  return {
    success: false,
    message: `Une erreur est survenue lors de la création de ${itemName}`,
    severity: MeriseSeverityTypeEnum.WARNING,
  };
};

const updateItem = <T extends Entity | Association | Relation>(
  props: MeriseUpdateItemProps<T>
): MeriseResult<T, null> => {
  const { collection, updatedItem, itemName, updateFn } = props;

  if (!updatedItem.getId()?.trim()) {
    return {
      success: false,
      message: `Mise à jour de ${itemName} impossible`,
      severity: MeriseSeverityTypeEnum.ERROR,
    };
  }

  const index = collection.findIndex((item) => item.getId() === updatedItem.getId());

  if (index === -1) {
    return {
      success: false,
      message: `${itemName} introuvable`,
      severity: MeriseSeverityTypeEnum.ERROR,
    };
  }

  const updatedCollection = [...collection];
  updatedCollection[index] = updatedItem;

  updateFn(updatedCollection);

  return {
    success: true,
    data: updatedItem,
  };
};

const removeItem = <T extends Entity | Association | Relation>(
  props: MeriseRemoveItemProps<T>
): MeriseResult<T, null> => {
  const { collection, relations, flowId, itemName, removeFn } = props;

  if (!flowId?.trim()) {
    return {
      success: false,
      message: `Suppression de ${itemName} impossible`,
      severity: MeriseSeverityTypeEnum.ERROR,
    };
  }

  const index = collection.findIndex((item) => item.getFlowId() === flowId);

  if (index === -1) {
    return {
      success: false,
      message: `${itemName} introuvable`,
      severity: MeriseSeverityTypeEnum.ERROR,
    };
  }

  const item = collection[index];
  const updatedCollection = collection.filter((_, i) => i !== index);
  const updatedRelations = relations.filter(
    (relation) => relation.getSource() !== item.getFlowId() && relation.getTarget() !== item.getFlowId()
  );

  removeFn(updatedCollection, updatedRelations);

  return {
    success: true,
    data: item,
  };
};

const findItemById = <T extends Entity | Association | Relation>(
  props: MeriseFindItemByIdProps<T>
): MeriseResult<T, null> => {
  const { collection, id, itemName } = props;

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
      message: `${itemName} introuvable`,
      severity: MeriseSeverityTypeEnum.ERROR,
    };
  }

  return { success: true, data: item };
};

const findItemByFlowId = <T extends Entity | Association | Relation>(
  props: MeriseFindItemByFlowIdProps<T>
): MeriseResult<T, null> => {
  const { collection, flowId, itemName } = props;

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
      message: `${itemName} introuvable`,
      severity: MeriseSeverityTypeEnum.ERROR,
    };
  }

  return { success: true, data: item };
};

const validateRelationCreation = (source: string, target: string, relations: Relation[]): MeriseResult<null, null> => {
  if (source === target) {
    return {
      success: false,
      message: "La source et la cible ne peuvent pas être identiques",
      severity: MeriseSeverityTypeEnum.INFO,
    };
  }

  const existingRelation = relations.find(
    (relation) =>
      (relation.getSource() === source && relation.getTarget() === target) ||
      (relation.getSource() === target && relation.getTarget() === source)
  );

  if (existingRelation) {
    return {
      success: false,
      message: "Une relation entre ces éléments existe déjà",
      severity: MeriseSeverityTypeEnum.WARNING,
    };
  }

  return { success: true, data: null };
};

const meriseHelper = {
  addItem,
  updateItem,
  removeItem,
  findItemById,
  findItemByFlowId,
};

export default meriseHelper;
