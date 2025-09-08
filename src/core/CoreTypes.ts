import type { Connection } from "@xyflow/react";
import type { Save, SaveRawDTOObject } from "@/core/libs/save";
import type { Settings } from "@/core/libs/settings";
import type { MeriseAssociationInterface, MeriseEntityInterface, MeriseFieldInterface, MeriseRelationInterface } from "@/libs/merise";

// List of all available Core error types
export enum ErrorType {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

// Represents a successful Core operation
export type CoreResultSuccess<T> = {
  success: true;
  data: T;
};

// Represents a failed Core operation
export type CoreResultFail<E> = {
  success: false;
  message: string;
  severity: ErrorType;
  error?: E;
};

// Union type representing the result of a Core operation
export type CoreResult<T, E> = CoreResultSuccess<T> | CoreResultFail<E>;

// Contract for the core manager implementation
export interface CoreManagerInterface {
  handleCreateFlowEdgeAndMeriseRelation: (connection: Connection) => void;
  handleCreateFlowNodeAndMeriseEntity: () => void;
  handleCreateFlowNodeAndMeriseAssociation: () => void;
  handleMeriseEntitySelect: (entity: MeriseEntityInterface) => void;
  handleMeriseAssociationSelect: (assocation: MeriseAssociationInterface) => void;
  handleMeriseRelationSelect: (relation: MeriseRelationInterface) => void;
  handleMeriseFieldSelect: (field: MeriseFieldInterface) => void;
  handleMeriseFieldCreate: (field: MeriseFieldInterface) => void;
  handleMeriseFieldCreatePrimaryKey: (entity: MeriseEntityInterface) => void;
  handleMeriseFieldUpdate: (field: MeriseFieldInterface) => void;
  handleMeriseFieldDelete: (field: MeriseFieldInterface) => void;
  handleSaveCreate: () => void;
  handleSaveOpen: (saveId: string) => void;
  handlSave: () => void;
  handleSaveSelect: (saveId: string) => void;
  handleSaveSelectCurrent: () => void;
  handleSaveUpdate: (save: Save) => void;
  handleSaveUpdateCurrent: (save: Save) => void;
  handleSaveRemove: (save: SaveRawDTOObject) => void;
  handleSettingsOpen: () => void;
  handleSettingsUpdate: (settings: Settings) => void;
  handleMeriseEntityUpdate: (association: MeriseEntityInterface) => void;
  handleMeriseAssociationUpdate: (entity: MeriseAssociationInterface) => void;
  handleMeriseRelationUpdate: (relation: MeriseRelationInterface) => void;
}
