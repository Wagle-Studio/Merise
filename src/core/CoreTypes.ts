import type { Connection } from "@xyflow/react";
import type { MeriseAssociationInterface, MeriseEntityInterface, MeriseRelationInterface } from "@/libs/merise";

// Contract for the core manager implementation
export interface CoreManagerInterface {
  handleCreateFlowEdgeAndMeriseRelation: (connection: Connection) => void;
  handleCreateFlowNodeAndMeriseEntity: () => void;
  handleCreateFlowNodeAndMeriseAssociation: () => void;
  handleMeriseEntitySelect: (entity: MeriseEntityInterface) => void;
  handleMeriseAssociationSelect: (assocation: MeriseAssociationInterface) => void;
  handleMeriseRelationSelect: (relation: MeriseRelationInterface) => void;
  handleMeriseEntityUpdate: (association: MeriseEntityInterface) => void;
  handleMeriseAssociationUpdate: (entity: MeriseAssociationInterface) => void;
  handleMeriseRelationUpdate: (relation: MeriseRelationInterface) => void;
}
