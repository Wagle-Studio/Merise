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
  private helper: FlowHelper = FlowHelper.getInstance();

  constructor(
    private getFlow: () => FlowDTOInterface,
    private setFlow: FlowDTODispatcher
  ) {}

  getCurrentFlow = (): FlowDTOInterface => {
    return this.getFlow();
  };

  handleMove = (change: NodeChange<TypedNode>): void => {
    this.setFlow((prev) => {
      return prev.cloneWithUpdatedNodes(applyNodeChanges<TypedNode>([change], prev.getNodes()));
    });
  };

  createNode = (itemType: FlowMeriseItemType): FlowResult<TypedNode, null> => {
    const nodeId = uuidv4();

    const node: TypedNode = {
      id: nodeId,
      position: this.helper.calculateNewNodePosition(),
      data: {
        id: nodeId,
        type: itemType,
      },
      type: FlowItemTypeEnum.NODE,
    };

    this.setFlow((prev) => {
      return prev.cloneWithAddedNode(node);
    });

    return {
      success: true,
      data: node,
    };
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

  addNode = (node: TypedNode): void => {
    this.setFlow((prev) => {
      return prev.cloneWithAddedNode(node);
    });
  };

  addEdge = (edge: TypedEdge): void => {
    this.setFlow((prev) => {
      return prev.cloneWithAddedEdge(edge);
    });
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
