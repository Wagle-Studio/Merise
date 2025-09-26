import { type Connection, type NodeChange, applyNodeChanges } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import {
  FlowConnectionTypeEnum,
  type FlowCreateConnectionResult,
  type FlowDTODispatcher,
  type FlowDTOInterface,
  FlowItemTypeEnum,
  type FlowManagerInterface,
  type FlowMeriseItemType,
  FlowMeriseItemTypeEnum,
  type FlowResult,
  FlowSeverityTypeEnum,
  type TypedEdge,
  type TypedNode,
} from "../types";

const POSITIONING = {
  DEFAULT_X: 100,
  VERTICAL_SPACING: 120,
} as const;

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

  createConnection = (params: Connection): FlowResult<FlowCreateConnectionResult, null> => {
    const validationResult = this.validateConnection(params);

    if (!validationResult.success) return validationResult;

    if (validationResult.data === FlowConnectionTypeEnum.ENTITY_ENTITY) {
      const nodeNewAssociationId = uuidv4();
      const edgeSourceToNewAssociationId = uuidv4();
      const edgeNewAssociationToTargetId = uuidv4();

      const nodeNewAssociation: TypedNode = {
        id: nodeNewAssociationId,
        position: this.calculateNewNodePosition(),
        data: { id: nodeNewAssociationId, type: FlowMeriseItemTypeEnum.ASSOCIATION },
        type: FlowItemTypeEnum.NODE,
      };

      const edgeSourceToNewAssociation: TypedEdge = {
        id: edgeSourceToNewAssociationId,
        source: params.source!,
        target: nodeNewAssociationId,
        sourceHandle: undefined,
        targetHandle: undefined,
        data: { id: edgeSourceToNewAssociationId, type: FlowMeriseItemTypeEnum.RELATION },
        type: FlowItemTypeEnum.EDGE,
      };

      const edgeNewAssociationToTarget: TypedEdge = {
        id: edgeNewAssociationToTargetId,
        source: nodeNewAssociationId,
        target: params.target!,
        sourceHandle: undefined,
        targetHandle: undefined,
        data: { id: edgeNewAssociationToTargetId, type: FlowMeriseItemTypeEnum.RELATION },
        type: FlowItemTypeEnum.EDGE,
      };

      return {
        success: true,
        data: {
          type: validationResult.data,
          edges: [edgeSourceToNewAssociation, edgeNewAssociationToTarget],
          node: nodeNewAssociation,
        },
      };
    }

    if (validationResult.data === FlowConnectionTypeEnum.ENTITY_ASSOCIATION) {
      const edgeId = uuidv4();

      const edge: TypedEdge = {
        id: edgeId,
        source: params.source!,
        target: params.target!,
        sourceHandle: params.sourceHandle || undefined,
        targetHandle: params.targetHandle || undefined,
        data: { id: edgeId, type: FlowMeriseItemTypeEnum.RELATION },
        type: FlowItemTypeEnum.EDGE,
      };

      this.setFlow((prev) => prev.cloneWithAddedEdge(edge));

      return {
        success: true,
        data: { type: FlowConnectionTypeEnum.ENTITY_ASSOCIATION, edge },
      };
    }

    return {
      success: false,
      message: "Erreur lors de la création de la relation",
      severity: FlowSeverityTypeEnum.ERROR,
    };
  };

  createNode = (itemType: FlowMeriseItemType, id?: string): FlowResult<TypedNode, null> => {
    const nodeId = uuidv4();

    const node: TypedNode = {
      id: id ?? nodeId,
      position: this.calculateNewNodePosition(),
      data: {
        id: id ?? nodeId,
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

  private validateConnection(params: Connection): FlowResult<FlowConnectionTypeEnum.ENTITY_ASSOCIATION | FlowConnectionTypeEnum.ENTITY_ENTITY, null> {
    // Validate required endpoints
    if (!params.source || !params.target) {
      return {
        success: false,
        message: "Source et cible sont requis pour créer une relation",
        severity: FlowSeverityTypeEnum.ERROR,
      };
    }

    // Disallow self connection
    if (params.source === params.target) {
      return {
        success: false,
        message: "Impossible de créer une relation vers soi-même",
        severity: FlowSeverityTypeEnum.INFO,
      };
    }

    // Prevent a direct duplicate edge between the two nodes
    const existingEdge = this.getFlow()
      .getEdges()
      .find((edge) => {
        return (edge.source === params.source && edge.target === params.target) || (edge.source === params.target && edge.target === params.source);
      });

    if (existingEdge) {
      return {
        success: false,
        message: "Un lien existe déjà entre l'entité et l'association",
        severity: FlowSeverityTypeEnum.WARNING,
      };
    }

    // Build fast lookup structures
    const nodes = this.getFlow().getNodes();
    const edges = this.getFlow().getEdges();
    const nodesById = new Map(nodes.map((n) => [n.id, n]));

    const sourceNode = nodesById.get(params.source);
    const targetNode = nodesById.get(params.target);

    if (sourceNode && targetNode) {
      const isSourceEntity = sourceNode.data.type === FlowMeriseItemTypeEnum.ENTITY;
      const isTargetEntity = targetNode.data.type === FlowMeriseItemTypeEnum.ENTITY;
      const isSourceAssociation = sourceNode.data.type === FlowMeriseItemTypeEnum.ASSOCIATION;
      const isTargetAssociation = targetNode.data.type === FlowMeriseItemTypeEnum.ASSOCIATION;

      // Entity to Entity is allowed
      if (isSourceEntity && isTargetEntity) {
        return {
          success: true,
          data: FlowConnectionTypeEnum.ENTITY_ENTITY,
        };
      }

      // Association to Association is forbidden
      if (isSourceAssociation && isTargetAssociation) {
        return {
          success: false,
          message: "Impossible de créer une relation directe entre deux associations.",
          severity: FlowSeverityTypeEnum.WARNING,
        };
      }

      // Entity to Association must ensure the association has at most two entity links
      if ((isSourceAssociation && isTargetEntity) || (isSourceEntity && isTargetAssociation)) {
        const associationId = isSourceAssociation ? params.source : params.target;
        const newEntityId = isSourceEntity ? params.source : params.target;

        // Collect entity neighbors already connected to this association
        const connectedEntityIds = new Set<string>();

        for (const e of edges) {
          if (e.source === associationId || e.target === associationId) {
            const otherId = e.source === associationId ? e.target : e.source;
            const otherNode = nodesById.get(otherId);

            if (otherNode?.data.type === FlowMeriseItemTypeEnum.ENTITY) {
              connectedEntityIds.add(otherId);
            }
          }
        }

        // If there are already two distinct entities and the new one is different then block
        if (connectedEntityIds.size >= 2 && !connectedEntityIds.has(newEntityId)) {
          return {
            success: false,
            message: "Cette association est déjà reliée à deux entités",
            severity: FlowSeverityTypeEnum.WARNING,
          };
        }

        // Otherwise allow the entity to association connection
        return { success: true, data: FlowConnectionTypeEnum.ENTITY_ASSOCIATION };
      }
    }

    // Default case treats it as entity to association
    return { success: true, data: FlowConnectionTypeEnum.ENTITY_ASSOCIATION };
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
