import type { Connection } from "@xyflow/react";
import type { DialogManagerInterface } from "@/core/libs/dialog";
import { CoreError, type ErrorManagerInterface, ErrorTypeEnum } from "@/core/libs/error";
import { type ToastManagerInterface, ToastTypeEnum } from "@/core/libs/toast";
import type { FlowManagerInterface, FlowResultFail, TypedEdge, TypedNode } from "@/libs/flow";
import { FlowErrorTypeEnum, FlowMeriseItemTypeEnum } from "@/libs/flow";
import type { MeriseManagerInterface, MeriseResultFail } from "@/libs/merise";
import { MeriseErrorTypeEnum } from "@/libs/merise";
import type { CoreManagerInterface } from "./CoreTypes";

// REVIEW OK + TODO

export default class CoreManager implements CoreManagerInterface {
  constructor(
    private flowManager: FlowManagerInterface,
    private meriseManager: MeriseManagerInterface,
    private toastManager: ToastManagerInterface,
    private dialogManager: DialogManagerInterface,
    private errorManager: ErrorManagerInterface
  ) {}

  createFlowEdgeAndMeriseRelation = (connection: Connection): void => {
    const edgeCreateResult = this.flowManager.addEdge(connection, FlowMeriseItemTypeEnum.RELATION);

    if (!edgeCreateResult.success) {
      this.errorManager.handleError(this.mapResultError(edgeCreateResult));
      return;
    }

    const relationCreateResult = this.meriseManager.addRelation(edgeCreateResult.data.id, connection.source, connection.target);

    if (!relationCreateResult.success) {
      this.errorManager.handleError(this.mapResultError(relationCreateResult));
      this.flowManager.removeEdgeByEdgeId(edgeCreateResult.data.id);
      return;
    }

    this.toastManager.addToast({
      type: ToastTypeEnum.SUCCESS,
      message: "Relation créée avec succès",
    });
  };

  createFlowNodeAndMeriseEntity = (): void => {
    const nodeCreateResult = this.flowManager.addNode(FlowMeriseItemTypeEnum.ENTITY);

    if (!nodeCreateResult.success) {
      this.errorManager.handleError(this.mapResultError(nodeCreateResult));
      return;
    }

    const entityCreateResult = this.meriseManager.addEntity(nodeCreateResult.data.id);

    if (!entityCreateResult.success) {
      this.errorManager.handleError(this.mapResultError(entityCreateResult));
      this.flowManager.removeNodeByNodeId(nodeCreateResult.data.id);
      return;
    }

    this.toastManager.addToast({
      type: ToastTypeEnum.SUCCESS,
      message: "Entité créée avec succès",
    });
  };

  createFlowNodeAndMeriseAssociation = (): void => {
    const nodeCreateResult = this.flowManager.addNode(FlowMeriseItemTypeEnum.ASSOCIATION);

    if (!nodeCreateResult.success) {
      this.errorManager.handleError(this.mapResultError(nodeCreateResult));
      return;
    }

    const associationCreateResult = this.meriseManager.addAssociation(nodeCreateResult.data.id);

    if (!associationCreateResult.success) {
      this.errorManager.handleError(this.mapResultError(associationCreateResult));
      this.flowManager.removeNodeByNodeId(nodeCreateResult.data.id);
      return;
    }

    this.toastManager.addToast({
      type: ToastTypeEnum.SUCCESS,
      message: "Association créée avec succès",
    });
  };

  handleFlowEdgeRemove = (edgeId: string, onComplete?: () => void): void => {
    const edgeFindResult = this.flowManager.findEdgeByEdgeId(edgeId);

    if (!edgeFindResult.success) {
      this.errorManager.handleError(this.mapResultError(edgeFindResult));
      return;
    }

    const onConfirm = (edge: TypedEdge) => {
      const edgeRemoveResult = this.flowManager.removeEdgeByEdgeId(edge.id);

      if (!edgeRemoveResult.success) {
        this.errorManager.handleError(this.mapResultError(edgeRemoveResult));
        return;
      }

      const relationRemoveResult = this.meriseManager.removeRelationByFlowId(edge.id);

      if (!relationRemoveResult.success) {
        // TODO: handle recover
        this.errorManager.handleError(this.mapResultError(relationRemoveResult));
        return;
      }

      this.toastManager.addToast({
        type: ToastTypeEnum.SUCCESS,
        message: "Relation supprimée avec succès",
      });
    };

    if (edgeFindResult.success && edgeFindResult.data) {
      const data = edgeFindResult.data;

      const dialogId = this.dialogManager.addConfirmDialog({
        title: "Supprimer la relation",
        message: "Êtes-vous sûr de vouloir supprimer cette relation ?",
        callbacks: {
          cancel: () => this.dialogManager.removeDialogById(dialogId),
          confirm: () => {
            onConfirm(data);
            this.dialogManager.removeDialogById(dialogId);
            if (onComplete) onComplete();
          },
        },
      });
    }
  };

  handleFlowNodeRemove = (nodeId: string, onComplete?: () => void): void => {
    const nodeFindResult = this.flowManager.findNodeByNodeId(nodeId);

    if (!nodeFindResult.success) {
      this.errorManager.handleError(this.mapResultError(nodeFindResult));
      return;
    }

    const onConfirm = (node: TypedNode, itemTypeName: string) => {
      const nodeRemoveResult = this.flowManager.removeNodeByNodeId(node.id);

      if (!nodeRemoveResult.success) {
        this.errorManager.handleError(this.mapResultError(nodeRemoveResult));
        return;
      }

      if (!nodeRemoveResult.data) {
        this.toastManager.addToast({
          type: ToastTypeEnum.ERROR,
          message: "Impossible de déterminer le type d'élément",
        });
        return;
      }

      switch (nodeRemoveResult.data.data.type) {
        case FlowMeriseItemTypeEnum.ENTITY:
          const entityRemoveResult = this.meriseManager.removeEntityByFlowId(node.id);
          if (!entityRemoveResult.success) {
            // TODO: handle recover
            this.errorManager.handleError(this.mapResultError(entityRemoveResult));
            return;
          }
          break;
        case FlowMeriseItemTypeEnum.ASSOCIATION:
          const associationRemoveResult = this.meriseManager.removeAssociationByFlowId(node.id);
          if (!associationRemoveResult.success) {
            // TODO: handle recover
            this.errorManager.handleError(this.mapResultError(associationRemoveResult));
            return;
          }
          break;
        default:
          this.toastManager.addToast({ type: ToastTypeEnum.ERROR, message: "Type d'élément non reconnu" });
          return;
      }

      this.toastManager.addToast({ type: ToastTypeEnum.SUCCESS, message: `${itemTypeName} supprimée avec succès` });
    };

    if (nodeFindResult.success && nodeFindResult.data) {
      const data = nodeFindResult.data;
      const itemTypeName = data.data.type;

      const dialogId = this.dialogManager.addConfirmDialog({
        title: `Supprimer l'${itemTypeName.toLowerCase()}`,
        message: `Êtes-vous sûr de vouloir supprimer cette ${itemTypeName.toLowerCase()} ?`,
        callbacks: {
          cancel: () => this.dialogManager.removeDialogById(dialogId),
          confirm: () => {
            onConfirm(data, itemTypeName);
            this.dialogManager.removeDialogById(dialogId);
            if (onComplete) onComplete();
          },
        },
      });
    }
  };

  private mapResultError = (flowResultFail: FlowResultFail | MeriseResultFail<any>): CoreError => {
    switch (flowResultFail.severity) {
      case FlowErrorTypeEnum.INFO:
      case MeriseErrorTypeEnum.INFO:
        return new CoreError(ErrorTypeEnum.INFO, flowResultFail.message);
      case FlowErrorTypeEnum.WARNING:
      case MeriseErrorTypeEnum.WARNING:
        return new CoreError(ErrorTypeEnum.WARNING, flowResultFail.message);
      case FlowErrorTypeEnum.ERROR:
      case MeriseErrorTypeEnum.ERROR:
        return new CoreError(ErrorTypeEnum.ERROR, flowResultFail.message);
      default:
        return new CoreError(ErrorTypeEnum.ERROR, "Anomalie dans le système d'erreur");
    }
  };
}
