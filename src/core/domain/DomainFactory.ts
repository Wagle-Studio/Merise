import type { KernelDependencies } from "@/core/kernel";
import type { DomainDependencies, DomainManagerInterface, DomainOperations } from "./DomainTypes";

// Factory responsible for creating Domain operations and dependencies mappings from Domain managers
export default class DomainFactory {
  static createOperations(domain: DomainManagerInterface): DomainOperations {
    return {
      handleNodeMove: domain.getManager("flow").handleMove,
      handleNavigateToHome: domain.handleNavigateToHome,
      handleSaveCurrent: domain.handleSaveCurrent,
      handleEntityCreate: domain.handleEntityCreate,
      handleAssociationCreate: domain.handleAssociationCreate,
      handleRelationCreate: domain.handleRelationCreate,
      handleFieldCreate: domain.handleFieldCreate,
      handleEntityUpdate: domain.handleEntityUpdate,
      handleAssociationUpdate: domain.handleAssociationUpdate,
      handleRelationUpdate: domain.handleRelationUpdate,
      handleFieldUpdate: domain.handleFieldUpdate,
      handleSettingsUpdate: domain.handleSettingsUpdate,
      handleFieldRemove: domain.handleFieldRemove,
      handleDialogEntityEdit: domain.handleDialogEntityEdit,
      handleDialogAssociationEdit: domain.handleDialogAssociationEdit,
      handleDialogRelationEdit: domain.handleDialogRelationEdit,
      handleDialogFieldEdit: domain.handleDialogFieldEdit,
    };
  }
  static createDependencies(domain: DomainManagerInterface, dependencies: KernelDependencies): DomainDependencies {
    const meriseManager = domain.getManager("merise");

    return {
      getCurrentFlow: domain.getManager("flow").getCurrentFlow,
      getCurrentSettings: dependencies.getCurrentSettings,
      findEntityByFlowId: (flowId: string) => meriseManager.findEntityByFlowId(flowId),
      findAssociationByFlowId: (flowId: string) => meriseManager.findAssociationByFlowId(flowId),
      findRelationByFlowId: (flowId: string) => meriseManager.findRelationByFlowId(flowId),
    };
  }
}
