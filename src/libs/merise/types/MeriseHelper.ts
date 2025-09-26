import type { Relation } from "../models";
import { MeriseItemType as MeriseItemTypeEnum } from "./MeriseCore";

// Props required to add an Merise item
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

// Props required to update an Merise item
export interface MeriseUpdateItemProps<T> {
  collection: T[];
  updatedItem: T;
  itemName: string;
  updateFn: (items: T[]) => void;
}

// Props required to remove an Merise item
export interface MeriseRemoveItemProps<T> {
  collection: T[];
  relations: Relation[];
  flowId: string;
  itemName: string;
  updateFn: (items: T[], relation: Relation[]) => void;
}

// Props required to find an Merise item by it's id
export interface MeriseFindItemByIdProps<T> {
  collection: T[];
  id: string;
  itemName: string;
}

// Props required to find an Merise item by it's flowId
export interface MeriseFindItemByFlowIdProps<T> {
  collection: T[];
  flowId: string;
  itemName: string;
}
