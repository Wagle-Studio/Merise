import type { ReactNode } from "react";
import type { Connection } from "@xyflow/react";
import type { Settings, SettingsManagerInterface } from "@/core/libs/settings";
import type { FlowManagerInterface } from "@/libs/flow";
import type { Association, Entity, Field, MeriseManagerInterface, Relation } from "@/libs/merise";

// Managers available in the Domain context
export interface DomainManagers {
  flow: FlowManagerInterface;
  merise: MeriseManagerInterface;
}

// Managers map
export type DomainManagerMap = {
  flow: FlowManagerInterface;
  merise: MeriseManagerInterface;
};

// Result returned by the Domain initialization hook
export interface UseDomainInitResult {
  domain: DomainManagerInterface;
}

// Props required to initialize the Domain context
export interface DomainContextProps {
  children: ReactNode;
}

// Values exposed by the Domain context
export interface DomainContext {
  operations: DomainOperations;
  dependencies: DomainDependencies;
}

// Contract for the Domain manager implementation
export interface DomainManagerInterface {
  getManager<K extends keyof DomainManagerMap>(name: K): DomainManagerMap[K];
  handleNavigateToHome: () => void;
  handleSaveCurrent: () => void;
  handleEntityCreate: () => void;
  handleAssociationCreate: () => void;
  handleRelationCreate: (connection: Connection) => void;
  handleFieldCreate: (field: Field) => void;
  handleEntityUpdate: (entity: Entity) => void;
  handleAssociationUpdate: (association: Association) => void;
  handleRelationUpdate: (relation: Relation) => void;
  handleFieldUpdate: (field: Field) => void;
  handleSettingsUpdate: (settings: Settings) => void;
  handleFieldRemove: (field: Field) => void;
  handleDialogEntityEdit: (entity: Entity) => void;
  handleDialogAssociationEdit: (association: Association) => void;
  handleDialogRelationEdit: (relation: Relation) => void;
  handleDialogFieldEdit: (field: Field) => void;
}

// Domain operations contract provided by the provider factory
export interface DomainOperations {
  handleNodeMove: FlowManagerInterface["handleMove"];
  handleNavigateToHome: DomainManagerInterface["handleNavigateToHome"];
  handleSaveCurrent: DomainManagerInterface["handleSaveCurrent"];
  handleEntityCreate: DomainManagerInterface["handleEntityCreate"];
  handleAssociationCreate: DomainManagerInterface["handleAssociationCreate"];
  handleRelationCreate: DomainManagerInterface["handleRelationCreate"];
  handleFieldCreate: DomainManagerInterface["handleFieldCreate"];
  handleEntityUpdate: DomainManagerInterface["handleEntityUpdate"];
  handleAssociationUpdate: DomainManagerInterface["handleAssociationUpdate"];
  handleRelationUpdate: DomainManagerInterface["handleRelationUpdate"];
  handleFieldUpdate: DomainManagerInterface["handleFieldUpdate"];
  handleSettingsUpdate: DomainManagerInterface["handleSettingsUpdate"];
  handleFieldRemove: DomainManagerInterface["handleFieldRemove"];
  handleDialogEntityEdit: DomainManagerInterface["handleDialogEntityEdit"];
  handleDialogAssociationEdit: DomainManagerInterface["handleDialogAssociationEdit"];
  handleDialogRelationEdit: DomainManagerInterface["handleDialogRelationEdit"];
  handleDialogFieldEdit: DomainManagerInterface["handleDialogFieldEdit"];
}

// Domain dependencies contract provided by the provider factory
export interface DomainDependencies {
  getCurrentFlow: FlowManagerInterface["getCurrentFlow"];
  getCurrentSettings: SettingsManagerInterface["getCurrentSettings"];
  findEntityByFlowId: MeriseManagerInterface["findEntityByFlowId"];
  findAssociationByFlowId: MeriseManagerInterface["findAssociationByFlowId"];
  findRelationByFlowId: MeriseManagerInterface["findRelationByFlowId"];
}
