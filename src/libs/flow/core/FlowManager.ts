import { type Connection, type NodeChange, applyNodeChanges } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import type { FlowDTODispatcher, FlowDTOInterface, FlowManagerInterface, FlowMeriseItemType, FlowResult, TypedEdge, TypedNode } from "../types";
import { FlowItemTypeEnum, FlowMeriseItemTypeEnum, FlowSeverityTypeEnum } from "../types";

const POSITIONING = {
  DEFAULT_X: 100,
  VERTICAL_SPACING: 120,
} as const;

export default class FlowManager implements FlowManagerInterface {
  constructor(
    private getFlow: () => FlowDTOInterface,
    private setFlow: FlowDTODispatcher
  ) {}

  handleMove = (change: NodeChange<TypedNode>): void => {
    this.setFlow((prev) => {
      return prev.cloneWithUpdatedNodes(applyNodeChanges<TypedNode>([change], prev.getNodes()));
    });
  };

  triggerReRender = (): void => {
    this.setFlow((prev) => prev.cloneWithUpdatedEdgesAndNodes(prev.getEdges(), prev.getNodes()));
  };

  addEdge = (params: Connection, itemType: FlowMeriseItemType): FlowResult<TypedEdge, null> => {
    const validationResult = this.validateConnection(params);

    if (!validationResult.success) {
      return validationResult;
    }

    const edgeId = uuidv4();

    const edge: TypedEdge = {
      id: edgeId,
      source: params.source!,
      target: params.target!,
      sourceHandle: params.sourceHandle || undefined,
      targetHandle: params.targetHandle || undefined,
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

  addNode = (itemType: FlowMeriseItemType): FlowResult<TypedNode, null> => {
    const nodeId = uuidv4();

    const node: TypedNode = {
      id: nodeId,
      position: this.calculateNewNodePosition(),
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

  removeEdgeByEdgeId = (edgeId: string): FlowResult<TypedEdge, null> => {
    if (!edgeId?.trim()) {
      return {
        success: false,
        message: "Impossible d'identifier la relation à supprimer",
        severity: FlowSeverityTypeEnum.ERROR,
      };
    }

    const flow = this.getFlow();
    const index = flow.getEdges().findIndex((edge) => edge.id === edgeId);

    if (index === -1) {
      return {
        success: false,
        message: "Impossible d'identifier la relation à supprimer",
        severity: FlowSeverityTypeEnum.ERROR,
      };
    }

    const removedEdge = flow.getEdges()[index];
    const updatedEdges = flow.getEdges().filter((_, i) => i !== index);

    this.setFlow((prev) => prev.cloneWithUpdatedEdges(updatedEdges));

    return {
      success: true,
      data: removedEdge,
    };
  };

  removeNodeByNodeId = (nodeId: string): FlowResult<TypedNode, null> => {
    if (!nodeId?.trim()) {
      return {
        success: false,
        message: "Impossible d'identifier l'élément à supprimer",
        severity: FlowSeverityTypeEnum.ERROR,
      };
    }

    const flow = this.getFlow();
    const index = flow.getNodes().findIndex((node) => node.id === nodeId);

    if (index === -1) {
      return {
        success: false,
        message: "Impossible d'identifier l'élément à supprimer",
        severity: FlowSeverityTypeEnum.ERROR,
      };
    }

    const removedNode = flow.getNodes()[index];
    const updatedNodes = flow.getNodes().filter((_, i) => i !== index);
    const updatedEdges = flow.getEdges().filter((edge) => edge.target !== removedNode.id && edge.source !== removedNode.id);

    this.setFlow((prev) => prev.cloneWithUpdatedEdgesAndNodes(updatedEdges, updatedNodes));

    return {
      success: true,
      data: removedNode,
    };
  };

  findEdgeByEdgeId = (edgeId: string): FlowResult<TypedEdge, null> => {
    if (!edgeId?.trim()) {
      return {
        success: false,
        message: "Impossible d'identifier la relation recherchée",
        severity: FlowSeverityTypeEnum.ERROR,
      };
    }

    const edge = this.getFlow()
      .getEdges()
      .find((edge) => edge.id === edgeId);

    if (!edge) {
      return {
        success: false,
        message: "Impossible d'identifier la relation recherchée",
        severity: FlowSeverityTypeEnum.ERROR,
      };
    }

    return {
      success: true,
      data: edge,
    };
  };

  findNodeByNodeId = (nodeId: string): FlowResult<TypedNode, null> => {
    if (!nodeId?.trim()) {
      return {
        success: false,
        message: "Impossible d'identifier l'entité recherchée",
        severity: FlowSeverityTypeEnum.ERROR,
      };
    }

    const node = this.getFlow()
      .getNodes()
      .find((node) => node.id === nodeId);

    if (!node) {
      return {
        success: false,
        message: "Impossible d'identifier l'entité recherchée",
        severity: FlowSeverityTypeEnum.ERROR,
      };
    }

    return {
      success: true,
      data: node,
    };
  };

  private validateConnection(params: Connection): FlowResult<null, null> {
    if (!params.source || !params.target) {
      return {
        success: false,
        message: "Source et target sont requis pour créer une relation",
        severity: FlowSeverityTypeEnum.ERROR,
      };
    }

    if (params.source === params.target) {
      return {
        success: false,
        message: "Impossible de créer une relation vers soi-même",
        severity: FlowSeverityTypeEnum.INFO,
      };
    }

    const existingEdge = this.getFlow()
      .getEdges()
      .find((edge) => {
        return (edge.source === params.source && edge.target === params.target) || (edge.source === params.target && edge.target === params.source);
      });

    if (existingEdge) {
      return {
        success: false,
        message: "Une relation existe déjà entre ces éléments",
        severity: FlowSeverityTypeEnum.WARNING,
      };
    }

    const sourceNode = this.getFlow()
      .getNodes()
      .find((node) => node.id === params.source);

    const targetNode = this.getFlow()
      .getNodes()
      .find((node) => node.id === params.target);

    if (sourceNode && targetNode) {
      const isSourceEntity = sourceNode.data.type === FlowMeriseItemTypeEnum.ENTITY;
      const isTargetEntity = targetNode.data.type === FlowMeriseItemTypeEnum.ENTITY;

      if (isSourceEntity && isTargetEntity) {
        return {
          success: false,
          message: "Impossible de créer une relation directe entre deux entités. Utilisez une association.",
          severity: FlowSeverityTypeEnum.WARNING,
        };
      }

      const isSourceAssociation = sourceNode.data.type === FlowMeriseItemTypeEnum.ASSOCIATION;
      const isTargetAssociation = targetNode.data.type === FlowMeriseItemTypeEnum.ASSOCIATION;

      if (isSourceAssociation && isTargetAssociation) {
        return {
          success: false,
          message: "Impossible de créer une relation directe entre deux associations.",
          severity: FlowSeverityTypeEnum.WARNING,
        };
      }
    }

    return { success: true, data: null };
  }

  private calculateNewNodePosition(): { x: number; y: number } {
    const existingPositions = this.getFlow()
      .getNodes()
      .map((n) => n.position.y);
    const maxY = existingPositions.length > 0 ? Math.max(...existingPositions) : 0;

    return {
      x: POSITIONING.DEFAULT_X,
      y: maxY + POSITIONING.VERTICAL_SPACING,
    };
  }
}
