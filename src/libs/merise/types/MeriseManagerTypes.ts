import type { Association, Entity, Relation } from "../models";
import type { MeriseAssociationInterface, MeriseEntityInterface, MeriseRelationInterface, MeriseResult } from "./MeriseCore";
import type { MeriseDTOInterface } from "./MeriseDTOTypes";

// Dispatcher type for updating the Merise DTO state
export type MeriseDTODispatcher = React.Dispatch<React.SetStateAction<MeriseDTOInterface>>;

// Contract for the merise manager implementation
export interface MeriseManagerInterface {
  addEntity: (flowId: string) => MeriseResult<MeriseEntityInterface, null>;
  addAssociation: (flowId: string) => MeriseResult<MeriseAssociationInterface, null>;
  addRelation: (flowId: string, source: string, target: string) => MeriseResult<MeriseRelationInterface, null>;
  updateEntity: (updatedEntity: Entity) => MeriseResult<MeriseEntityInterface, null>;
  updateAssociation: (updatedAssociation: Association) => MeriseResult<MeriseAssociationInterface, null>;
  updateRelation: (updatedRelation: Relation) => MeriseResult<MeriseRelationInterface, null>;
  removeEntityByFlowId: (flowId: string) => MeriseResult<MeriseEntityInterface, null>;
  removeAssociationByFlowId: (flowId: string) => MeriseResult<MeriseAssociationInterface, null>;
  removeRelationByFlowId: (flowId: string) => MeriseResult<MeriseRelationInterface, null>;
  findEntityById: (flowId: string) => MeriseResult<MeriseEntityInterface, null>;
  findAssociationById: (flowId: string) => MeriseResult<MeriseAssociationInterface, null>;
  findEntityByFlowId: (flowId: string) => MeriseResult<MeriseEntityInterface, null>;
  findAssociationByFlowId: (flowId: string) => MeriseResult<MeriseAssociationInterface, null>;
  findRelationByFlowId: (flowId: string) => MeriseResult<MeriseRelationInterface, null>;
}
