import type { Connection } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import type { DialogManagerInterface } from "@/core/libs/dialog";
import { CoreError, type ErrorManagerInterface, ErrorTypeEnum } from "@/core/libs/error";
import type { SaverManagerInterface, SaverStoreItem } from "@/core/libs/saver";
import type { Settings, SettingsManagerInterface } from "@/core/libs/settings";
import { type ToastManagerInterface, ToastTypeEnum } from "@/core/libs/toast";
import type { FlowManagerInterface, FlowResultFail, TypedEdge, TypedNode } from "@/libs/flow";
import { FlowErrorTypeEnum, FlowMeriseItemTypeEnum } from "@/libs/flow";
import type { Association, Entity, MeriseAssociationInterface, MeriseEntityInterface, MeriseFieldInterface, MeriseManagerInterface, MeriseRelationInterface, MeriseResult, MeriseResultFail, Relation } from "@/libs/merise";
import { Field, FieldTypeNumberOptionEnum, MeriseErrorTypeEnum, MeriseFieldTypeTypeEnum, MeriseFormTypeEnum, MeriseItemTypeEnum } from "@/libs/merise";
import type { CoreManagerInterface } from "./CoreTypes";

export default class CoreManager implements CoreManagerInterface {
  constructor(
    private flowManager: FlowManagerInterface,
    private meriseManager: MeriseManagerInterface,
    private toastManager: ToastManagerInterface,
    private dialogManager: DialogManagerInterface,
    private errorManager: ErrorManagerInterface,
    private saverManager: SaverManagerInterface,
    private settingsManager: SettingsManagerInterface
  ) {}

  handleCreateFlowEdgeAndMeriseRelation = (connection: Connection): void => {
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
      message: "Relation créée",
    });
  };

  handleCreateFlowNodeAndMeriseEntity = (): void => {
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
      message: "Entité créée",
    });
  };

  handleCreateFlowNodeAndMeriseAssociation = (): void => {
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
      message: "Association créée",
    });
  };

  handleMeriseEntitySelect = (entity: MeriseEntityInterface): void => {
    const dialogId = this.dialogManager.addEntityDialog({
      title: "",
      component: () => entity.renderFormComponent(),
      callbacks: {
        closeDialog: () => {
          this.dialogManager.removeDialogById(dialogId);
        },
        deleteEntity: () => {
          this.handleFlowNodeRemove(entity.getFlowId(), () => this.dialogManager.removeDialogById(dialogId));
        },
        addField: () => {
          const field = new Field(uuidv4(), entity.getId(), entity.getType());
          const addFieldDialogId = this.dialogManager.addFieldDialog({
            title: "Ajouter un champ",
            component: () => field.renderFormComponent(MeriseFormTypeEnum.CREATE),
            callbacks: {
              closeDialog: () => {
                this.dialogManager.removeDialogById(addFieldDialogId);
              },
            },
          });
        },
        addFieldPrimaryKey: () => {
          this.handleMeriseFieldCreatePrimaryKey(entity);
        },
      },
    });
  };

  handleMeriseAssociationSelect = (association: MeriseAssociationInterface): void => {
    const dialogId = this.dialogManager.addAssociationDialog({
      title: "",
      component: () => association.renderFormComponent(),
      callbacks: {
        closeDialog: () => {
          this.dialogManager.removeDialogById(dialogId);
        },
        deleteAssociation: () => {
          this.handleFlowNodeRemove(association.getFlowId(), () => this.dialogManager.removeDialogById(dialogId));
        },
        addField: () => {
          const field = new Field(uuidv4(), association.getId(), association.getType());
          const addFieldDialogId = this.dialogManager.addFieldDialog({
            title: "Ajouter un champ",
            component: () => field.renderFormComponent(MeriseFormTypeEnum.CREATE),
            callbacks: {
              closeDialog: () => {
                this.dialogManager.removeDialogById(addFieldDialogId);
              },
            },
          });
        },
        addFieldPrimaryKey: () => {
          this.handleMeriseFieldCreatePrimaryKey(association);
        },
      },
    });
  };

  handleMeriseRelationSelect = (relation: MeriseRelationInterface): void => {
    const dialogId = this.dialogManager.addRelationDialog({
      title: "",
      component: () => relation.renderFormComponent(),
      callbacks: {
        closeDialog: () => {
          this.dialogManager.removeDialogById(dialogId);
        },
        deleteRelation: () => {
          this.handleFlowEdgeRemove(relation.getFlowId(), () => this.dialogManager.removeDialogById(dialogId));
        },
      },
    });
  };

  handleMeriseFieldSelect = (field: MeriseFieldInterface): void => {
    const dialogId = this.dialogManager.addFieldDialog({
      title: "Éditer un champ",
      component: () => field.renderFormComponent(MeriseFormTypeEnum.UPDATE),
      callbacks: {
        closeDialog: () => {
          this.dialogManager.removeDialogById(dialogId);
        },
      },
    });
  };

  handleMeriseEntityUpdate = (entity: MeriseEntityInterface): void => {
    this.handleItemUpdate(entity as Entity, this.meriseManager.updateEntity, "Entité mise à jour", "Échec de la mise à jour de l’entité");
  };

  handleMeriseAssociationUpdate = (association: MeriseAssociationInterface): void => {
    this.handleItemUpdate(association as Association, this.meriseManager.updateAssociation, "Association mise à jour", "Échec de la mise à jour de l’association");
  };

  handleMeriseRelationUpdate = (relation: MeriseRelationInterface): void => {
    this.handleItemUpdate(relation as Relation, this.meriseManager.updateRelation, "Relation mise à jour", "Échec de la mise à jour de la relation");
  };

  handleMeriseFieldCreate = (field: MeriseFieldInterface): void => {
    switch (field.getMeriseItemType()) {
      case MeriseItemTypeEnum.ENTITY:
        const entityFindResult = this.meriseManager.findEntityById(field.getMeriseItemId());

        if (!entityFindResult.success) {
          this.errorManager.handleError(this.mapResultError(entityFindResult));
          return;
        }

        entityFindResult.data?.addField(field);
        this.handleItemUpdate(entityFindResult.data as Entity, this.meriseManager.updateEntity, "Champ créé", "Échec de la création du champ");

        break;
      case MeriseItemTypeEnum.ASSOCIATION:
        const associationFindResult = this.meriseManager.findAssociationById(field.getMeriseItemId());

        if (!associationFindResult.success) {
          this.errorManager.handleError(this.mapResultError(associationFindResult));
          return;
        }

        associationFindResult.data?.addField(field);
        this.handleItemUpdate(associationFindResult.data as Association, this.meriseManager.updateAssociation, "Champ créé", "Échec de la création du champ");

        break;
    }
  };

  handleMeriseFieldCreatePrimaryKey = (meriseItem: MeriseEntityInterface | MeriseAssociationInterface): void => {
    const fieldPrimaryKey = new Field(uuidv4(), meriseItem.getId(), meriseItem.getType(), this.primaryKeyFieldName(meriseItem.getName()), MeriseFieldTypeTypeEnum.NUMBER, FieldTypeNumberOptionEnum.COMPTER, true, false, true);
    this.handleMeriseFieldCreate(fieldPrimaryKey);
  };

  handleMeriseFieldUpdate = (field: MeriseFieldInterface): void => {
    switch (field.getMeriseItemType()) {
      case MeriseItemTypeEnum.ENTITY:
        const entityFindResult = this.meriseManager.findEntityById(field.getMeriseItemId());

        if (!entityFindResult.success) {
          this.errorManager.handleError(this.mapResultError(entityFindResult));
          return;
        }

        entityFindResult.data?.updateField(field);
        this.handleItemUpdate(entityFindResult.data as Entity, this.meriseManager.updateEntity, "Champ mis à jour", "Échec de la mise à jour du champ");

        break;
      case MeriseItemTypeEnum.ASSOCIATION:
        const associationFindResult = this.meriseManager.findAssociationById(field.getMeriseItemId());

        if (!associationFindResult.success) {
          this.errorManager.handleError(this.mapResultError(associationFindResult));
          return;
        }

        associationFindResult.data?.updateField(field);
        this.handleItemUpdate(associationFindResult.data as Association, this.meriseManager.updateAssociation, "Champ mis à jour", "Échec de la mise à jour du champ");

        break;
    }
  };

  handleMeriseFieldDelete = (field: MeriseFieldInterface): void => {
    switch (field.getMeriseItemType()) {
      case MeriseItemTypeEnum.ENTITY:
        const entityFindResult = this.meriseManager.findEntityById(field.getMeriseItemId());

        if (!entityFindResult.success) {
          this.errorManager.handleError(this.mapResultError(entityFindResult));
          return;
        }

        entityFindResult.data?.deleteField(field);
        this.handleItemUpdate(entityFindResult.data as Entity, this.meriseManager.updateEntity, "Champ supprimé", "Échec de la suppresion du champ");

        break;
      case MeriseItemTypeEnum.ASSOCIATION:
        const associationFindResult = this.meriseManager.findAssociationById(field.getMeriseItemId());

        if (!associationFindResult.success) {
          this.errorManager.handleError(this.mapResultError(associationFindResult));
          return;
        }

        associationFindResult.data?.deleteField(field);
        this.handleItemUpdate(associationFindResult.data as Association, this.meriseManager.updateAssociation, "Champ supprimé", "Échec de la suppresion du champ");

        break;
    }
  };

  handlSave = (): void => {
    this.saverManager.save();

    this.toastManager.addToast({
      type: ToastTypeEnum.SAVE,
      message: "Diagramme sauvegardé",
    });
  };

  handleSaveOpen = (): void => {
    const dialogId = this.dialogManager.addSettingsDialog({
      title: "Sauvegarde",
      component: () => this.saverManager.getCurrentSave().renderFormComponent(),
      callbacks: {
        closeDialog: () => {
          this.dialogManager.removeDialogById(dialogId);
        },
      },
    });
  };

  handleSaveUpdate = (save: SaverStoreItem): void => {
    this.saverManager.updateCurrentSave(save);
    this.saverManager.save();

    this.toastManager.addToast({
      type: ToastTypeEnum.SAVE,
      message: "Diagramme sauvegardé",
    });
  };

  handleSettingsOpen = (): void => {
    const dialogId = this.dialogManager.addSettingsDialog({
      title: "Paramètres",
      component: () => this.settingsManager.getCurrentSettings().renderFormComponent(),
      callbacks: {
        closeDialog: () => {
          this.dialogManager.removeDialogById(dialogId);
        },
      },
    });
  };

  handleSettingsUpdate = (settings: Settings): void => {
    this.settingsManager.updateSettings(settings);
    this.saverManager.save();

    this.toastManager.addToast({
      type: ToastTypeEnum.SAVE,
      message: "Paramètres sauvegardé",
    });
  };

  private handleItemUpdate<TInput, TOutput>(item: TInput, updateFn: (item: TInput) => MeriseResult<TOutput>, successMessage: string, errorMessage: string): void {
    const updateResult = updateFn(item);

    if (!updateResult.success) {
      this.toastManager.addToast({
        type: ToastTypeEnum.ERROR,
        message: errorMessage,
      });
      return;
    }

    this.flowManager.triggerReRender();

    this.toastManager.addToast({
      type: ToastTypeEnum.SUCCESS,
      message: successMessage,
    });
  }

  // TODO: handle recover
  private handleFlowEdgeRemove = (edgeId: string, onComplete?: () => void): void => {
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
        this.flowManager.addEdge({ source: edge.source, target: edge.target, sourceHandle: edge.sourceHandle ?? null, targetHandle: edge.targetHandle ?? null }, edge.data.type);
        this.errorManager.handleError(this.mapResultError(relationRemoveResult));
        return;
      }

      this.toastManager.addToast({
        type: ToastTypeEnum.SUCCESS,
        message: "Relation supprimée",
      });
    };

    if (edgeFindResult.success && edgeFindResult.data) {
      const edge = edgeFindResult.data;

      const dialogId = this.dialogManager.addConfirmDialog({
        title: "Supprimer la relation",
        message: "Êtes-vous sûr de vouloir supprimer cette relation ?",
        callbacks: {
          closeDialog: () => this.dialogManager.removeDialogById(dialogId),
          onConfirm: () => {
            onConfirm(edge);
            this.dialogManager.removeDialogById(dialogId);
            if (onComplete) onComplete();
          },
        },
      });
    }
  };

  // TODO: handle recover
  private handleFlowNodeRemove = (nodeId: string, onComplete?: () => void): void => {
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

      if (!nodeRemoveResult.data || !nodeRemoveResult.data.data.type) {
        this.toastManager.addToast({
          type: ToastTypeEnum.ERROR,
          message: "Type d’élément introuvable",
        });
        return;
      }

      switch (nodeRemoveResult.data.data.type) {
        case FlowMeriseItemTypeEnum.ENTITY:
          const entityRemoveResult = this.meriseManager.removeEntityByFlowId(node.id);

          if (!entityRemoveResult.success) {
            this.flowManager.addNode(node.data.type);
            this.errorManager.handleError(this.mapResultError(entityRemoveResult));
            return;
          }

          break;
        case FlowMeriseItemTypeEnum.ASSOCIATION:
          const associationRemoveResult = this.meriseManager.removeAssociationByFlowId(node.id);

          if (!associationRemoveResult.success) {
            this.flowManager.addNode(node.data.type);
            this.errorManager.handleError(this.mapResultError(associationRemoveResult));
            return;
          }

          break;
        default:
          this.flowManager.addNode(node.data.type);
          this.toastManager.addToast({ type: ToastTypeEnum.ERROR, message: "Type d’élément non pris en charge" });

          return;
      }

      this.toastManager.addToast({ type: ToastTypeEnum.SUCCESS, message: `${itemTypeName} supprimée avec succès` });
    };

    if (nodeFindResult.success && nodeFindResult.data) {
      const node = nodeFindResult.data;
      const itemTypeName = node.data.type;

      const dialogId = this.dialogManager.addConfirmDialog({
        title: `Supprimer l'${itemTypeName.toLowerCase()}`,
        message: `Confirmer la suppression de cette relation ${itemTypeName.toLowerCase()} ?`,
        callbacks: {
          closeDialog: () => this.dialogManager.removeDialogById(dialogId),
          onConfirm: () => {
            onConfirm(node, itemTypeName);
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

  private primaryKeyFieldName = (entityName: string): string => {
    let slug = entityName
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/['’]/g, "")
      .replace(/([a-z\d])([A-Z])/g, "$1_$2")
      .replace(/[^A-Za-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .toLowerCase();

    if (!slug) slug = "entity";

    slug = slug.replace(/_id$/, "");

    return `${slug}_id`;
  };
}
