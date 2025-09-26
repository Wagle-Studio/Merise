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
import FlowHelper from "./FlowHelper";

export default class FlowManager implements FlowManagerInterface {
  private helper: FlowHelper;

  constructor(
    private getFlow: () => FlowDTOInterface,
    private setFlow: FlowDTODispatcher
  ) {
    this.helper = FlowHelper.getInstance();
  }

  triggerReRender = (): void => {
    this.setFlow((prev) => prev.cloneWithUpdatedEdgesAndNodes(prev.getEdges(), prev.getNodes()));
  };

  handleMove = (change: NodeChange<TypedNode>): void => {
    this.setFlow((prev) => {
      return prev.cloneWithUpdatedNodes(applyNodeChanges<TypedNode>([change], prev.getNodes()));
    });
  };

  createConnection = (params: Connection): FlowResult<FlowConnectResult, null> => {
    const validationResult = this.helper.validateConnection({
      edges: this.getFlow().getEdges(),
      nodes: this.getFlow().getNodes(),
      connection: params,
    });

    if (!validationResult.success) return validationResult;

    if (validationResult.data === FlowConnectionTypeEnum.ENTITY_ENTITY) {
      return this.helper.connectEntityToEntity({
        connection: params,
        nodes: this.getFlow().getNodes(),
      });
    }

    if (validationResult.data === FlowConnectionTypeEnum.ENTITY_ASSOCIATION) {
      return this.helper.connectEntityToAssociation({
        connection: params,
      });
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
      position: this.helper.calculateNewNodePosition({ nodes: this.getFlow().getNodes() }),
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
    return this.helper.removeItem<TypedNode>({
      collection: this.getFlow().getNodes(),
      id: id,
      itemName: "l'élément",
      removeFn: (updatedNodes: TypedNode[]) => {
        this.setFlow((prev) => prev.cloneWithUpdatedNodes(updatedNodes));
      },
    });
  };

  removeEdge = (id: string): FlowResult<TypedEdge, null> => {
    return this.helper.removeItem<TypedEdge>({
      collection: this.getFlow().getEdges(),
      id: id,
      itemName: "la relation",
      removeFn: (updatedEdges: TypedEdge[]) => {
        this.setFlow((prev) => prev.cloneWithUpdatedEdges(updatedEdges));
      },
    });
  };

  findNodeById = (id: string): FlowResult<TypedNode, null> => {
    return this.helper.findItemById<TypedNode>({
      collection: this.getFlow().getNodes(),
      id: id,
      itemName: "l'élément",
    });
  };

  findEdgeById = (id: string): FlowResult<TypedEdge, null> => {
    return this.helper.findItemById<TypedEdge>({
      collection: this.getFlow().getEdges(),
      id: id,
      itemName: "la relation",
    });
  };
}
