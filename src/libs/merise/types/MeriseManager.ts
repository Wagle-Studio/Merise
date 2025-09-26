import type { Association, Entity, Relation } from "../models";
import type { MeriseResult } from "./MeriseCore";
import type { MeriseDTOInterface } from "./MeriseDTO";

// Dispatcher type for updating the Merise DTO state
export type MeriseDTODispatcher = React.Dispatch<React.SetStateAction<MeriseDTOInterface>>;

// Contract for the Merise manager implementation
export interface MeriseManagerInterface {
  addEntity: (flowId: string) => MeriseResult<Entity, null>;
  addAssociation: (flowId: string) => MeriseResult<Association, null>;
  addRelation: (flowId: string, source: string, target: string) => MeriseResult<Relation, null>;
  updateEntity: (entity: Entity) => MeriseResult<Entity, null>;
  updateAssociation: (association: Association) => MeriseResult<Association, null>;
  updateRelation: (relation: Relation) => MeriseResult<Relation, null>;
  removeEntity: (flowId: string) => MeriseResult<Entity, null>;
  removeAssociation: (flowId: string) => MeriseResult<Association, null>;
  removeRelation: (flowId: string) => MeriseResult<Relation, null>;
  findEntityById: (id: string) => MeriseResult<Entity, null>;
  findAssociationById: (id: string) => MeriseResult<Association, null>;
  findEntityByFlowId: (flowId: string) => MeriseResult<Entity, null>;
  findAssociationByFlowId: (flowId: string) => MeriseResult<Association, null>;
  findRelationByFlowId: (flowId: string) => MeriseResult<Relation, null>;
}
