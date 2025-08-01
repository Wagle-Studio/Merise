import { type Connection, type NodeChange, applyNodeChanges } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import type { FlowDTODispatcher, FlowDTOInterface, FlowManagerInterface, FlowMeriseItemType, FlowResult, TypedEdge, TypedNode } from "../types";
import { FlowErrorTypeEnum, FlowItemTypeEnum } from "../types";

export default class FlowManager implements FlowManagerInterface {
  constructor(
    private getFlow: () => FlowDTOInterface,
    private setFlow: FlowDTODispatcher
  ) {}

  handleMove = (change: NodeChange<TypedNode>): void => {
    this.setFlow((prev) => {
      return prev.cloneWithUpdatedNodes(applyNodeChanges<TypedNode>([change], prev.nodes));
    });
  };

  triggerReRender = (): void => {
    this.setFlow((prev) => prev.cloneWithUpdatedEdgesAndNodes(prev.edges, prev.nodes));
  };

  addEdge = (params: Connection, itemType: FlowMeriseItemType): FlowResult<TypedEdge> => {
    if (!params.source || !params.target) {
      return {
        success: false,
        message: "Source et target sont requis pour créer une relation",
        severity: FlowErrorTypeEnum.ERROR,
      };
    }

    if (params.source === params.target) {
      return {
        success: false,
        message: "Impossible de créer une relation vers soi-même",
        severity: FlowErrorTypeEnum.INFO,
      };
    }

    const existingEdge = this.getFlow().edges.find((edge) => {
      return (edge.source === params.source && edge.target === params.target) || (edge.source === params.target && edge.target === params.source);
    });

    if (existingEdge) {
      return {
        success: false,
        message: "Une relation existe déjà entre ces éléments",
        severity: FlowErrorTypeEnum.WARNING,
      };
    }

    const edgeId = uuidv4();

    const edge: TypedEdge = {
      id: edgeId,
      source: params.source,
      target: params.target,
      data: {
        id: edgeId,
        type: itemType,
      },
      type: FlowItemTypeEnum.EDGE,
    };

    this.setFlow((prev) => {
      return prev.cloneWithAddedEdge(edge);
    });

    return {
      success: true,
      data: edge,
    };
  };

  addNode = (itemType: FlowMeriseItemType): FlowResult<TypedNode> => {
    const nodeId = uuidv4();

    let node: TypedNode = {
      id: nodeId,
      position: { x: 0, y: 0 },
      data: {
        id: nodeId,
        type: itemType,
      },
      type: FlowItemTypeEnum.NODE,
    };

    this.setFlow((prev) => {
      const existingPositions = prev.nodes.map((n) => n.position.y);
      const maxY = existingPositions.length > 0 ? Math.max(...existingPositions) : 0;
      node.position = { x: 100, y: maxY + 120 };

      return prev.cloneWithAddedNode(node);
    });

    return {
      success: true,
      data: node,
    };
  };

  removeEdgeByEdgeId = (edgeId: string): FlowResult<TypedEdge | null> => {
    if (!edgeId?.trim()) {
      return {
        success: false,
        message: "Impossible d'identifier la relation à supprimer",
        severity: FlowErrorTypeEnum.ERROR,
      };
    }

    const flow = this.getFlow();
    const index = flow.edges.findIndex((edge) => edge.id === edgeId);

    if (index === -1) {
      return {
        success: false,
        message: "Impossible d'identifier la relation à supprimer",
        severity: FlowErrorTypeEnum.ERROR,
      };
    }

    const removedEdge = flow.edges[index];
    const updatedEdges = flow.edges.filter((_, i) => i !== index);

    this.setFlow((prev) => prev.cloneWithUpdatedEdges(updatedEdges));

    return {
      success: true,
      data: removedEdge,
    };
  };

  removeNodeByNodeId = (nodeId: string): FlowResult<TypedNode | null> => {
    if (!nodeId?.trim()) {
      return {
        success: false,
        message: "Impossible d'identifier l'élément à supprimer",
        severity: FlowErrorTypeEnum.ERROR,
      };
    }

    const flow = this.getFlow();
    const index = flow.nodes.findIndex((node) => node.id === nodeId);

    if (index === -1) {
      return {
        success: false,
        message: "Impossible d'identifier l'élément à supprimer",
        severity: FlowErrorTypeEnum.ERROR,
      };
    }

    const removedNode = flow.nodes[index];
    const updatedNodes = flow.nodes.filter((_, i) => i !== index);
    const updatedEdges = flow.edges.filter((edge) => edge.target !== removedNode.id && edge.source !== removedNode.id);

    this.setFlow((prev) => prev.cloneWithUpdatedEdgesAndNodes(updatedEdges, updatedNodes));

    return {
      success: true,
      data: removedNode,
    };
  };

  findEdgeByEdgeId = (edgeId: string): FlowResult<TypedEdge | null> => {
    if (!edgeId?.trim()) {
      return {
        success: false,
        message: "Impossible d'identifier la relation recherchée",
        severity: FlowErrorTypeEnum.ERROR,
      };
    }

    const edge = this.getFlow().edges.find((edge) => edge.id === edgeId);

    if (!edge) {
      return {
        success: false,
        message: "Impossible d'identifier la relation recherchée",
        severity: FlowErrorTypeEnum.ERROR,
      };
    }

    return {
      success: true,
      data: edge,
    };
  };

  findNodeByNodeId = (nodeId: string): FlowResult<TypedNode | null> => {
    if (!nodeId?.trim()) {
      return {
        success: false,
        message: "Impossible d'identifier l'entité recherchée",
        severity: FlowErrorTypeEnum.ERROR,
      };
    }

    const node = this.getFlow().nodes.find((node) => node.id === nodeId);

    if (!node) {
      return {
        success: false,
        message: "Impossible d'identifier l'entité recherchée",
        severity: FlowErrorTypeEnum.ERROR,
      };
    }

    return {
      success: true,
      data: node,
    };
  };
}
