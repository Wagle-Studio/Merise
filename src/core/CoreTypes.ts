import type { Connection } from "@xyflow/react";
import type { MeriseAssociationInterface, MeriseEntityInterface, MeriseFieldInterface, MeriseRelationInterface } from "@/libs/merise";
import type { Settings } from "./libs/settings";

// Contract for the core manager implementation
export interface CoreManagerInterface {
  handleCreateFlowEdgeAndMeriseRelation: (connection: Connection) => void;
  handleCreateFlowNodeAndMeriseEntity: () => void;
  handleCreateFlowNodeAndMeriseAssociation: () => void;
  handleMeriseEntitySelect: (entity: MeriseEntityInterface) => void;
  handleMeriseAssociationSelect: (assocation: MeriseAssociationInterface) => void;
  handleMeriseRelationSelect: (relation: MeriseRelationInterface) => void;
  handleSettingsOpen: () => void;
  handleSettingsUpdate: (settings: Settings) => void;
  handleMeriseEntityUpdate: (association: MeriseEntityInterface) => void;
  handleMeriseAssociationUpdate: (entity: MeriseAssociationInterface) => void;
  handleMeriseRelationUpdate: (relation: MeriseRelationInterface) => void;
  handleMeriseFieldCreate: (field: MeriseFieldInterface) => void;
}
