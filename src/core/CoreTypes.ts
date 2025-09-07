import type { Connection } from "@xyflow/react";
import type { SaverStoreItem } from "@/core/libs/saver";
import type { Settings } from "@/core/libs/settings";
import type { MeriseAssociationInterface, MeriseEntityInterface, MeriseFieldInterface, MeriseRelationInterface } from "@/libs/merise";

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
  handlSave: () => void;
  handleSaveOpen: () => void;
  handleSaveUpdate: (save: SaverStoreItem) => void;
  handleSettingsOpen: () => void;
  handleSettingsUpdate: (settings: Settings) => void;
  handleMeriseEntityUpdate: (association: MeriseEntityInterface) => void;
  handleMeriseAssociationUpdate: (entity: MeriseAssociationInterface) => void;
  handleMeriseRelationUpdate: (relation: MeriseRelationInterface) => void;
}
