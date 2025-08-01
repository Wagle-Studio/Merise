import type { Connection, NodeChange } from "@xyflow/react";
import type { KernelManagers } from "@/core";
import type { FlowDependencies, FlowMeriseItemInterface, FlowOperations, FlowResult, TypedNode } from "@/libs/flow";

// Factory responsible for creating Flow operations and dependency mappings from Kernel managers
export default class ProviderFactoryFlow {
  static createOperations(managers: KernelManagers): FlowOperations {
    return {
      onEdgeCreate: (connection: Connection): void => {
        managers.core.createFlowEdgeAndMeriseRelation(connection);
      },
      onNodeMove: (change: NodeChange<TypedNode>): void => {
        managers.flow.handleMove(change);
      },
    };
  }

  static createDependencies(managers: KernelManagers): FlowDependencies {
    return {
      findMeriseEntityByFlowId: (flowId: string): FlowResult<FlowMeriseItemInterface | null> => {
        return managers.merise.findEntityByFlowId(flowId) as FlowResult<FlowMeriseItemInterface | null>;
      },
      findMeriseAssociationByFlowId: (flowId: string): FlowResult<FlowMeriseItemInterface | null> => {
        return managers.merise.findAssociationByFlowId(flowId) as FlowResult<FlowMeriseItemInterface | null>;
      },
      findMeriseRelationByFlowId: (flowId: string): FlowResult<FlowMeriseItemInterface | null> => {
        return managers.merise.findRelationByFlowId(flowId) as FlowResult<FlowMeriseItemInterface | null>;
      },
    };
  }
}
