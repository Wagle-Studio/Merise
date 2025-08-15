import type { Association, Entity, Relation } from "../models";
import type { MeriseAssociationInterface, MeriseEntityInterface, MeriseRelationInterface, MeriseResult } from "./MeriseCore";
import type { MeriseDTOInterface } from "./MeriseDTOTypes";

// Dispatcher type for updating the Merise DTO state
export type MeriseDTODispatcher = React.Dispatch<React.SetStateAction<MeriseDTOInterface>>;

// Contract for the merise manager implementation
export interface MeriseManagerInterface {
  addEntity: (flowId: string) => MeriseResult<MeriseEntityInterface>;
  addAssociation: (flowId: string) => MeriseResult<MeriseAssociationInterface>;
  addRelation: (flowId: string, source: string, target: string) => MeriseResult<MeriseRelationInterface>;
  updateEntity: (updatedEntity: Entity) => MeriseResult<MeriseEntityInterface>;
  updateAssociation: (updatedAssociation: Association) => MeriseResult<MeriseAssociationInterface>;
  updateRelation: (updatedRelation: Relation) => MeriseResult<MeriseRelationInterface>;
  removeEntityByFlowId: (flowId: string) => MeriseResult<MeriseEntityInterface | null>;
  removeAssociationByFlowId: (flowId: string) => MeriseResult<MeriseAssociationInterface | null>;
  removeRelationByFlowId: (flowId: string) => MeriseResult<MeriseRelationInterface | null>;
  findEntityById: (flowId: string) => MeriseResult<MeriseEntityInterface | null>;
  findAssociationById: (flowId: string) => MeriseResult<MeriseAssociationInterface | null>;
  findEntityByFlowId: (flowId: string) => MeriseResult<MeriseEntityInterface | null>;
  findAssociationByFlowId: (flowId: string) => MeriseResult<MeriseAssociationInterface | null>;
  findRelationByFlowId: (flowId: string) => MeriseResult<MeriseRelationInterface | null>;
}
