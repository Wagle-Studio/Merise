import { type Connection, type NodeChange, applyNodeChanges } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import type {
  FlowConnectResult,
  FlowDTODispatcher,
  FlowDTOInterface,
  FlowManagerInterface,
  FlowMeriseItemType,
  FlowResult,
  TypedEdge,
  TypedNode,
} from "../types";
import { FlowConnectionTypeEnum, FlowItemTypeEnum, FlowSeverityTypeEnum } from "../types";
import flowHelper from "./FlowHelper";

export default class FlowManager implements FlowManagerInterface {
  constructor(
    private getFlow: () => FlowDTOInterface,
    private setFlow: FlowDTODispatcher
  ) {}

  triggerReRender = (): void => {
    this.setFlow((prev) => prev.cloneWithUpdatedEdgesAndNodes(prev.getEdges(), prev.getNodes()));
  };

  handleMove = (change: NodeChange<TypedNode>): void => {
    this.setFlow((prev) => {
      return prev.cloneWithUpdatedNodes(applyNodeChanges<TypedNode>([change], prev.getNodes()));
    });
  };

  createConnection = (params: Connection): FlowResult<FlowConnectResult, null> => {
    const validationResult = flowHelper.validateConnection({
      edges: this.getFlow().getEdges(),
      nodes: this.getFlow().getNodes(),
      connection: params,
    });

    if (!validationResult.success) return validationResult;

    if (validationResult.data === FlowConnectionTypeEnum.ENTITY_ENTITY) {
      const connectionResult = flowHelper.connectEntityToEntity({
        connection: params,
        nodes: this.getFlow().getNodes(),
      });

      if (connectionResult.success) {
        return {
          success: true,
          data: connectionResult.data,
        };
      }
    }

    if (validationResult.data === FlowConnectionTypeEnum.ENTITY_ASSOCIATION) {
      const connectionResult = flowHelper.connectEntityToAssociation({
        connection: params,
      });

      if (connectionResult.success) {
        return {
          success: true,
          data: connectionResult.data,
        };
      }
    }

    return {
      success: false,
      message: "Erreur lors de la création de la relation",
      severity: FlowSeverityTypeEnum.ERROR,
    };
  };

  createNode = (itemType: FlowMeriseItemType): FlowResult<TypedNode, null> => {
    const nodeId = uuidv4();

    const node: TypedNode = {
      id: nodeId,
      position: flowHelper.calculateNewNodePosition({ nodes: this.getFlow().getNodes() }),
      data: {
        id: nodeId,
        type: itemType,
      },
      type: FlowItemTypeEnum.NODE,
    };

    this.addNode(node);

    return {
      success: true,
      data: node,
    };
  };

  addNode = (node: TypedNode): FlowResult<TypedNode, null> => {
    this.setFlow((prev) => {
      return prev.cloneWithAddedNode(node);
    });

    return {
      success: true,
      data: node,
    };
  };

  addEdge = (edge: TypedEdge): FlowResult<TypedEdge, null> => {
    this.setFlow((prev) => {
      return prev.cloneWithAddedEdge(edge);
    });

    return {
      success: true,
      data: edge,
    };
  };

  removeNode = (id: string): FlowResult<TypedNode, null> => {
    const removeFn = (updatedNodes: TypedNode[]) => {
      this.setFlow((prev) => prev.cloneWithUpdatedNodes(updatedNodes));
    };

    const removeItemResult = flowHelper.removeItem<TypedNode>({
      collection: this.getFlow().getNodes(),
      id: id,
      itemName: "l'élément",
      removeFn: removeFn,
    });

    if (!removeItemResult.success || !removeItemResult.data) {
      return removeItemResult;
    }

    return {
      success: true,
      data: removeItemResult.data,
    };
  };

  removeEdge = (id: string): FlowResult<TypedEdge, null> => {
    const removeFn = (updatedEdges: TypedEdge[]) => {
      this.setFlow((prev) => prev.cloneWithUpdatedEdges(updatedEdges));
    };

    const removeItemResult = flowHelper.removeItem<TypedEdge>({
      collection: this.getFlow().getEdges(),
      id: id,
      itemName: "la relation",
      removeFn: removeFn,
    });

    if (!removeItemResult.success || !removeItemResult.data) {
      return removeItemResult;
    }

    return {
      success: true,
      data: removeItemResult.data,
    };
  };

  findNodeById = (id: string): FlowResult<TypedNode, null> => {
    const findItemResult = flowHelper.findItemById<TypedNode>({
      collection: this.getFlow().getNodes(),
      id: id,
      itemName: "l'élément",
    });

    if (!findItemResult.success || !findItemResult.data) {
      return findItemResult;
    }

    return {
      success: true,
      data: findItemResult.data,
    };
  };

  findEdgeById = (id: string): FlowResult<TypedEdge, null> => {
    const findItemResult = flowHelper.findItemById<TypedEdge>({
      collection: this.getFlow().getEdges(),
      id: id,
      itemName: "la relation",
    });

    if (!findItemResult.success || !findItemResult.data) {
      return findItemResult;
    }

    return {
      success: true,
      data: findItemResult.data,
    };
  };
}
