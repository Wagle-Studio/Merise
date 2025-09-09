import type { Connection } from "@xyflow/react";
import type { Save, SaveRawDTOObject } from "@/core/libs/save";
import type { Settings } from "@/core/libs/settings";
import type { MeriseAssociationInterface, MeriseEntityInterface, MeriseFieldInterface, MeriseRelationInterface } from "@/libs/merise";

// List of all available Core error types
export enum SeverityType {
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
  severity: SeverityType;
  error?: E;
};

// Union type representing the result of a Core operation
export type CoreResult<T, E> = CoreResultSuccess<T> | CoreResultFail<E>;

// Contract for the core manager implementation
export interface CoreManagerInterface {
  handleNavigateToHome: () => void;
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
  handleSave: () => void;
  handleSaveSelect: (saveId: string) => void;
  handleSaveSelectCurrent: () => void;
  handleSaveUpdate: (save: Save) => void;
  handleSaveUpdateCurrent: (save: Save) => void;
  handleSaveRemove: (save: SaveRawDTOObject) => void;
  handleSettingsOpen: () => void;
  handleSettingsUpdate: (settings: Settings) => void;
  handleMeriseEntityUpdate: (entity: MeriseAssociationInterface) => void;
  handleMeriseAssociationUpdate: (association: MeriseEntityInterface) => void;
  handleMeriseRelationUpdate: (relation: MeriseRelationInterface) => void;
}
