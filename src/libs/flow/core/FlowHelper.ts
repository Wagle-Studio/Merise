import { v4 as uuidv4 } from "uuid";
import type {
  FlowCalculateNewNodePositionProps,
  FlowConnectEntityToAssociationProps,
  FlowConnectEntityToAssociationResult,
  FlowConnectEntityToEntityProps,
  FlowConnectEntityToEntityResult,
  FlowFindItemByIdProps,
  FlowHelperInterface,
  FlowRemoveItemProps,
  FlowResult,
  FlowValidateConnectionProps,
  TypedEdge,
  TypedNode,
} from "../types";
import { FlowConnectionTypeEnum, FlowItemTypeEnum, FlowMeriseItemTypeEnum, FlowSeverityTypeEnum } from "../types";

export default class FlowHelper implements FlowHelperInterface {
  private static instance: FlowHelper;
  private POS_DEFAULT_X = 100;
  private POS_VERTICAL_SPACING = 120;

  private constructor() {}

  static getInstance = () => {
    if (!this.instance) {
      this.instance = new FlowHelper();
    }

    return this.instance;
  };

  removeItem = <T extends TypedEdge | TypedNode>(props: FlowRemoveItemProps<T>): FlowResult<T, null> => {
    const { collection, id, itemName, removeFn } = props;

    if (!id.trim()) {
      return {
        success: false,
        message: `Impossible d'identifier ${itemName} à supprimer`,
        severity: FlowSeverityTypeEnum.ERROR,
      };
    }

    const index = collection.findIndex((edge) => edge.id === id);

    if (index === -1) {
      return {
        success: false,
        message: `Impossible d'identifier ${itemName} à supprimer`,
        severity: FlowSeverityTypeEnum.ERROR,
      };
    }

    const item = collection[index];
    const updatedCollection = collection.filter((_, i) => i !== index);

    removeFn(updatedCollection);

    return {
      success: true,
      data: item,
    };
  };

  findItemById = <T extends TypedEdge | TypedNode>(props: FlowFindItemByIdProps<T>): FlowResult<T, null> => {
    const { collection, id, itemName } = props;

    if (!id.trim()) {
      return {
        success: false,
        message: `Impossible d'identifier ${itemName} recherchée`,
        severity: FlowSeverityTypeEnum.ERROR,
      };
    }

    const item = collection.find((item) => item.id === id);

    if (!item) {
      return {
        success: false,
        message: `${itemName} introuvable`,
        severity: FlowSeverityTypeEnum.ERROR,
      };
    }

    return {
      success: true,
      data: item,
    };
  };

  validateConnection = (props: FlowValidateConnectionProps): FlowResult<FlowConnectionTypeEnum, null> => {
    const { edges, nodes, connection } = props;

    // Validate required endpoints
    if (!connection.source || !connection.target) {
      return {
        success: false,
        message: "Source et cible sont requis pour créer une relation",
        severity: FlowSeverityTypeEnum.ERROR,
      };
    }

    // Disallow self connection
    if (connection.source === connection.target) {
      return {
        success: false,
        message: "Impossible de créer une relation vers soi-même",
        severity: FlowSeverityTypeEnum.INFO,
      };
    }

    // Prevent a direct duplicate edge between the two nodes
    const existingEdge = edges.find((edge) => {
      return (
        (edge.source === connection.source && edge.target === connection.target) ||
        (edge.source === connection.target && edge.target === connection.source)
      );
    });

    if (existingEdge) {
      return {
        success: false,
        message: "Un lien existe déjà entre l'entité et l'association",
        severity: FlowSeverityTypeEnum.WARNING,
      };
    }

    // Build fast lookup structures
    const nodesById = new Map(nodes.map((n) => [n.id, n]));

    const sourceNode = nodesById.get(connection.source);
    const targetNode = nodesById.get(connection.target);

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
        const associationId = isSourceAssociation ? connection.source : connection.target;
        const newEntityId = isSourceEntity ? connection.source : connection.target;

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
  };

  connectEntityToEntity = (
    props: FlowConnectEntityToEntityProps
  ): FlowResult<FlowConnectEntityToEntityResult, null> => {
    const { connection, nodes } = props;

    const nodeNewAssociationId = uuidv4();
    const edgeSourceToNewAssociationId = uuidv4();
    const edgeNewAssociationToTargetId = uuidv4();

    const nodeNewAssociation: TypedNode = {
      id: nodeNewAssociationId,
      position: this.calculateNewNodePosition({ nodes: nodes }),
      data: { id: nodeNewAssociationId, type: FlowMeriseItemTypeEnum.ASSOCIATION },
      type: FlowItemTypeEnum.NODE,
    };

    const edgeSourceToNewAssociation: TypedEdge = {
      id: edgeSourceToNewAssociationId,
      source: connection.source!,
      target: nodeNewAssociationId,
      sourceHandle: undefined,
      targetHandle: undefined,
      data: { id: edgeSourceToNewAssociationId, type: FlowMeriseItemTypeEnum.RELATION },
      type: FlowItemTypeEnum.EDGE,
    };

    const edgeNewAssociationToTarget: TypedEdge = {
      id: edgeNewAssociationToTargetId,
      source: nodeNewAssociationId,
      target: connection.target!,
      sourceHandle: undefined,
      targetHandle: undefined,
      data: { id: edgeNewAssociationToTargetId, type: FlowMeriseItemTypeEnum.RELATION },
      type: FlowItemTypeEnum.EDGE,
    };

    return {
      success: true,
      data: {
        type: FlowConnectionTypeEnum.ENTITY_ENTITY,
        edges: [edgeSourceToNewAssociation, edgeNewAssociationToTarget],
        node: nodeNewAssociation,
      },
    };
  };

  connectEntityToAssociation = (
    props: FlowConnectEntityToAssociationProps
  ): FlowResult<FlowConnectEntityToAssociationResult, null> => {
    const { connection } = props;

    const edgeId = uuidv4();

    const edge: TypedEdge = {
      id: edgeId,
      source: connection.source!,
      target: connection.target!,
      sourceHandle: connection.sourceHandle || undefined,
      targetHandle: connection.targetHandle || undefined,
      data: { id: edgeId, type: FlowMeriseItemTypeEnum.RELATION },
      type: FlowItemTypeEnum.EDGE,
    };

    return {
      success: true,
      data: { type: FlowConnectionTypeEnum.ENTITY_ASSOCIATION, edge },
    };
  };

  calculateNewNodePosition = (props: FlowCalculateNewNodePositionProps): { x: number; y: number } => {
    const { nodes } = props;
    const existingPositions = nodes.map((n) => n.position.y);
    const maxY = existingPositions.length > 0 ? Math.max(...existingPositions) : 0;

    return {
      x: this.POS_DEFAULT_X,
      y: maxY + this.POS_VERTICAL_SPACING,
    };
  };
}
