import type { Association, Entity, Relation } from "../models";
import { MeriseItemType as MeriseItemTypeEnum, type MeriseResult } from "./MeriseCore";

// Props required to add a Merise item
export interface MeriseAddItemProps<T> {
  collection: T[];
  relations: Relation[];
  flowId: string;
  itemType: MeriseItemTypeEnum;
  itemName: string;
  addFn: (item: T) => void;
  source?: string;
  target?: string;
}

// Props required to update a Merise item
export interface MeriseUpdateItemProps<T> {
  collection: T[];
  updatedItem: T;
  itemName: string;
  updateFn: (items: T[]) => void;
}

// Props required to remove a Merise item
export interface MeriseRemoveItemProps<T> {
  collection: T[];
  relations: Relation[];
  flowId: string;
  itemName: string;
  removeFn: (items: T[], relation: Relation[]) => void;
}

// Props required to find a Merise item by it's id
export interface MeriseFindItemByIdProps<T> {
  collection: T[];
  id: string;
  itemName: string;
}

// Props required to find a Merise item by it's flowId
export interface MeriseFindItemByFlowIdProps<T> {
  collection: T[];
  flowId: string;
  itemName: string;
}

// Contract for the Merise helper implementation
export interface MeriseHelperInterface {
  addItem: <T extends Entity | Association | Relation>(props: MeriseAddItemProps<T>) => MeriseResult<T, null>;
  updateItem: <T extends Entity | Association | Relation>(props: MeriseUpdateItemProps<T>) => MeriseResult<T, null>;
  removeItem: <T extends Entity | Association | Relation>(props: MeriseRemoveItemProps<T>) => MeriseResult<T, null>;
  findItemById: <T extends Entity | Association | Relation>(props: MeriseFindItemByIdProps<T>) => MeriseResult<T, null>;
  findItemByFlowId: <T extends Entity | Association | Relation>(
    props: MeriseFindItemByFlowIdProps<T>
  ) => MeriseResult<T, null>;
  validateRelationCreation: (source: string, target: string, relations: Relation[]) => MeriseResult<null, null>;
}
