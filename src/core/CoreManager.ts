import type { Connection } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import type { DialogManagerInterface } from "@/core/libs/dialog";
import { CoreError, type ErrorManagerInterface, ErrorSeverityTypeEnum } from "@/core/libs/error";
import type { NavigatorManagerInterface } from "@/core/libs/navigator";
import { SaveDTO, type SaveDTOInterface, type SaveManagerInterface } from "@/core/libs/save";
import type { Settings, SettingsManagerInterface } from "@/core/libs/settings";
import { SettingsDefault } from "@/core/libs/settings/";
import { type ToastManagerInterface, ToastTypeEnum } from "@/core/libs/toast";
import type { FlowManagerInterface, FlowResultFail, TypedEdge, TypedNode } from "@/libs/flow";
import { FlowConnectionTypeEnum, FlowMeriseItemTypeEnum, FlowSeverityTypeEnum } from "@/libs/flow";
import type {
  Association,
  Entity,
  MeriseAssociationInterface,
  MeriseEntityInterface,
  MeriseFieldInterface,
  MeriseManagerInterface,
  MeriseRelationInterface,
  MeriseResult,
  MeriseResultFail,
} from "@/libs/merise";
import {
  Field,
  FieldTypeNumberOptionEnum,
  MeriseFieldTypeTypeEnum,
  MeriseFormTypeEnum,
  MeriseItemTypeEnum,
  MeriseSeverityTypeEnum,
  Relation,
} from "@/libs/merise";
import type { CoreManagerInterface } from "./CoreTypes";

// TODO : invesitage if `handleError` is well used and if it's need to be everywhere
export default class CoreManager implements CoreManagerInterface {
  constructor(
    private flowManager: FlowManagerInterface,
    private meriseManager: MeriseManagerInterface,
    private toastManager: ToastManagerInterface,
    private dialogManager: DialogManagerInterface,
    private errorManager: ErrorManagerInterface,
    private saveManager: SaveManagerInterface,
    private settingsManager: SettingsManagerInterface,
    private navigatorManager: NavigatorManagerInterface
  ) {}

  handleNavigateToHome = (): void => {
    const isSaveDemo = this.saveManager.getCurrentSave()?.getId() === "save_demo";
    const hasUnsavedChanges = this.saveManager.hasUnsavedChanges();

    if (!isSaveDemo && hasUnsavedChanges) {
      const dialogId = this.dialogManager.addConfirmDialog({
        title: "Modifications non sauvegardées",
        message: "Êtes-vous sûr de vouloir quitter sans sauvegarder les modifications en cours ?",
        callbacks: {
          closeDialog: () => {
            this.dialogManager.removeDialogById(dialogId);
          },
          onConfirm: () => {
            this.dialogManager.clearDialogs();
            this.navigatorManager.clearSaveUrlParams();
            this.settingsManager.updateSettings(SettingsDefault);
            this.saveManager.clearSave();
          },
        },
      });

      return;
    }

    this.dialogManager.clearDialogs();
    this.navigatorManager.clearSaveUrlParams();
    this.settingsManager.updateSettings(SettingsDefault);
    this.saveManager.clearSave();
  };

  handleCreateFlowEdgeAndMeriseRelation = (connection: Connection): void => {
    const createConnectionResult = this.flowManager.createConnection(connection);

    if (!createConnectionResult.success) {
      this.errorManager.handleError(this.mapResultError(createConnectionResult));
      return;
    }

    if (createConnectionResult.data.type === FlowConnectionTypeEnum.ENTITY_ENTITY) {
      const associationFlowNode = createConnectionResult.data.node;
      const associationFlowId = associationFlowNode.data.id;

      const associationCreateResult = this.meriseManager.addAssociation(associationFlowId);

      if (!associationCreateResult.success) {
        this.errorManager.handleError(this.mapResultError(associationCreateResult));
        return;
      }

      const createNodeResult = this.flowManager.addNode(createConnectionResult.data.node);

      if (!createNodeResult.success) {
        this.meriseManager.removeAssociation(associationFlowId);
        this.errorManager.handleError(this.mapResultError(createNodeResult));
        return;
      }

      const createdEdgesIds: string[] = [];

      for (const edge of createConnectionResult.data.edges) {
        const createSubConnectionResult = this.flowManager.createConnection({
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle ?? null,
          targetHandle: edge.targetHandle ?? null,
        });

        if (
          !createSubConnectionResult.success ||
          createSubConnectionResult.data.type !== FlowConnectionTypeEnum.ENTITY_ASSOCIATION
        ) {
          for (const id of createdEdgesIds) this.flowManager.removeEdge(id);

          this.flowManager.removeNode(createNodeResult.data.id);
          this.meriseManager.removeAssociation(associationFlowId);

          if (!createSubConnectionResult.success)
            this.errorManager.handleError(this.mapResultError(createSubConnectionResult));

          return;
        }

        const createdEdge = createSubConnectionResult.data.edge;
        createdEdgesIds.push(createdEdge.data.id);

        const relationResult = this.meriseManager.addRelation(
          createdEdge.data.id,
          createdEdge.source,
          createdEdge.target
        );

        if (!relationResult.success) {
          for (const id of createdEdgesIds) this.flowManager.removeEdge(id);

          this.flowManager.removeNode(associationFlowId);
          this.meriseManager.removeAssociation(associationFlowId);
          this.errorManager.handleError(this.mapResultError(relationResult));

          return;
        }

        // const edgeResult = this.flowManager.addEdge(edge);
      }

      this.toastManager.addToast({ type: ToastTypeEnum.SUCCESS, message: "Relation créée" });

      return;
    }

    if (createConnectionResult.data.type === FlowConnectionTypeEnum.ENTITY_ASSOCIATION) {
      const edge = createConnectionResult.data.edge;

      // const edgeCreateResult = this.flowManager.createEdge(createConnectionResult.data.edge.)
      const relationCreateResult = this.meriseManager.addRelation(edge.data.id, edge.source, edge.target);

      if (!relationCreateResult.success) {
        this.errorManager.handleError(this.mapResultError(relationCreateResult));
        this.flowManager.removeEdge(edge.data.id);
        return;
      }

      this.toastManager.addToast({ type: ToastTypeEnum.SUCCESS, message: "Relation créée" });
    }
  };

  handleCreateFlowNodeAndMeriseEntity = (): void => {
    const nodeCreateResult = this.flowManager.createNode(FlowMeriseItemTypeEnum.ENTITY);

    if (!nodeCreateResult.success) {
      this.errorManager.handleError(this.mapResultError(nodeCreateResult));
      return;
    }

    const entityCreateResult = this.meriseManager.addEntity(nodeCreateResult.data.id);

    if (!entityCreateResult.success) {
      this.errorManager.handleError(this.mapResultError(entityCreateResult));
      this.flowManager.removeNode(nodeCreateResult.data.id);
      return;
    }

    this.toastManager.addToast({
      type: ToastTypeEnum.SUCCESS,
      message: "Entité créée",
    });
  };

  handleCreateFlowNodeAndMeriseAssociation = (): void => {
    const nodeCreateResult = this.flowManager.createNode(FlowMeriseItemTypeEnum.ASSOCIATION);

    if (!nodeCreateResult.success) {
      this.errorManager.handleError(this.mapResultError(nodeCreateResult));
      return;
    }

    const associationCreateResult = this.meriseManager.addAssociation(nodeCreateResult.data.id);

    if (!associationCreateResult.success) {
      this.errorManager.handleError(this.mapResultError(associationCreateResult));
      this.flowManager.removeNode(nodeCreateResult.data.id);
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

  // REVIEWED
  handleMeriseEntityUpdate = (entity: Entity): void => {
    const successMessage = "Entité mise à jour";
    const errorMessage = "Échec de la mise à jour de l’entité";

    this.handleItemUpdate(entity, this.meriseManager.updateEntity, successMessage, errorMessage);
  };

  // REVIEWED
  handleMeriseAssociationUpdate = (association: Association): void => {
    const successMessage = "Association mise à jour";
    const errorMessage = "Échec de la mise à jour de l’association";

    this.handleItemUpdate(association, this.meriseManager.updateAssociation, successMessage, errorMessage);
  };

  // REVIEWED
  handleMeriseRelationUpdate = (relation: Relation): void => {
    const successMessage = "Relation mise à jour";
    const errorMessage = "Échec de la mise à jour de la relation";

    this.handleItemUpdate(relation, this.meriseManager.updateRelation, successMessage, errorMessage);
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
        this.handleItemUpdate(
          entityFindResult.data as Entity,
          this.meriseManager.updateEntity,
          "Champ créé",
          "Échec de la création du champ"
        );

        break;
      case MeriseItemTypeEnum.ASSOCIATION:
        const associationFindResult = this.meriseManager.findAssociationById(field.getMeriseItemId());

        if (!associationFindResult.success) {
          this.errorManager.handleError(this.mapResultError(associationFindResult));
          return;
        }

        associationFindResult.data?.addField(field);
        this.handleItemUpdate(
          associationFindResult.data as Association,
          this.meriseManager.updateAssociation,
          "Champ créé",
          "Échec de la création du champ"
        );

        break;
    }
  };

  handleMeriseFieldCreatePrimaryKey = (meriseItem: MeriseEntityInterface | MeriseAssociationInterface): void => {
    const fieldPrimaryKey = new Field(
      uuidv4(),
      meriseItem.getId(),
      meriseItem.getType(),
      this.primaryKeyFieldName(meriseItem.getName()),
      MeriseFieldTypeTypeEnum.NUMBER,
      FieldTypeNumberOptionEnum.COMPTER,
      true,
      false,
      true
    );
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

        entityFindResult.data?.updateFields(field);
        this.handleItemUpdate(
          entityFindResult.data as Entity,
          this.meriseManager.updateEntity,
          "Champ mis à jour",
          "Échec de la mise à jour du champ"
        );

        break;
      case MeriseItemTypeEnum.ASSOCIATION:
        const associationFindResult = this.meriseManager.findAssociationById(field.getMeriseItemId());

        if (!associationFindResult.success) {
          this.errorManager.handleError(this.mapResultError(associationFindResult));
          return;
        }

        associationFindResult.data?.updateFields(field);
        this.handleItemUpdate(
          associationFindResult.data as Association,
          this.meriseManager.updateAssociation,
          "Champ mis à jour",
          "Échec de la mise à jour du champ"
        );

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
        this.handleItemUpdate(
          entityFindResult.data as Entity,
          this.meriseManager.updateEntity,
          "Champ supprimé",
          "Échec de la suppression du champ"
        );

        break;
      case MeriseItemTypeEnum.ASSOCIATION:
        const associationFindResult = this.meriseManager.findAssociationById(field.getMeriseItemId());

        if (!associationFindResult.success) {
          this.errorManager.handleError(this.mapResultError(associationFindResult));
          return;
        }

        associationFindResult.data?.deleteField(field);
        this.handleItemUpdate(
          associationFindResult.data as Association,
          this.meriseManager.updateAssociation,
          "Champ supprimé",
          "Échec de la suppression du champ"
        );

        break;
    }
  };

  handleSaveCreate = (): void => {
    const newSaveId = this.saveManager.createSave();
    const openSaveResult = this.saveManager.openSave(newSaveId);

    if (!openSaveResult.success) {
      this.toastManager.addToast({
        type: ToastTypeEnum.ERROR,
        message: "Erreur lors de la création du diagramme",
      });
      return;
    }

    const save = new SaveDTO(openSaveResult.data);

    this.saveManager.updateCurrentSave(save);
    this.navigatorManager.setSaveUrlParams(openSaveResult.data.id);

    this.toastManager.addToast({
      type: ToastTypeEnum.SAVE,
      message: "Diagramme créé",
    });
  };

  handleSaveOpen = (saveId: string): void => {
    const openSaveResult = this.saveManager.openSave(saveId);

    if (!openSaveResult.success) {
      this.toastManager.addToast({
        type: ToastTypeEnum.ERROR,
        message: "Erreur lors de l'ouverture du diagramme",
      });
      return;
    }

    const save = new SaveDTO(openSaveResult.data);

    this.saveManager.updateCurrentSave(save);
    this.navigatorManager.setSaveUrlParams(openSaveResult.data.id);
  };

  handleSave = (): void => {
    this.saveManager.saveCurrent();

    this.toastManager.addToast({
      type: ToastTypeEnum.SAVE,
      message: "Diagramme sauvegardé",
    });
  };

  handleSaveSelect = (saveId: string): void => {
    const openSaveResult = this.saveManager.openSave(saveId);

    if (!openSaveResult.success) {
      this.toastManager.addToast({
        type: ToastTypeEnum.ERROR,
        message: "Erreur lors de la manipulation du diagramme",
      });
      return;
    }

    const saveDTO = new SaveDTO(openSaveResult.data);

    const dialogId = this.dialogManager.addSaveDialog({
      title: saveDTO.getName(),
      component: () => saveDTO.renderFormComponent(false),
      callbacks: {
        closeDialog: () => {
          this.dialogManager.removeDialogById(dialogId);
        },
      },
    });
  };

  handleSaveSelectCurrent = (): void => {
    const saveDialogAlreadOpen = this.dialogManager.hasSaveDialogOpened();

    if (saveDialogAlreadOpen) return;

    const dialogId = this.dialogManager.addSaveDialog({
      title: "Sauvegarde",
      component: () => this.saveManager.getCurrentSave()?.renderFormComponent(),
      callbacks: {
        closeDialog: () => {
          this.dialogManager.removeDialogById(dialogId);
        },
      },
    });
  };

  handleSaveUpdate = (saveDTO: SaveDTOInterface): void => {
    this.saveManager.updateSave(saveDTO);

    this.toastManager.addToast({
      type: ToastTypeEnum.SAVE,
      message: "Diagramme sauvegardé",
    });
  };

  handleSaveUpdateCurrent = (saveDTO: SaveDTOInterface): void => {
    this.saveManager.updateCurrentSave(saveDTO);

    this.toastManager.addToast({
      type: ToastTypeEnum.SAVE,
      message: "Diagramme sauvegardé",
    });
  };

  handleSaveRemove = (saveId: string, saveName: string): void => {
    const dialogId = this.dialogManager.addConfirmDialog({
      title: saveName,
      message: "Êtes-vous sûr de vouloir supprimer ce diagramme ?",
      callbacks: {
        closeDialog: () => {
          this.dialogManager.removeDialogById(dialogId);
        },
        onConfirm: () => {
          this.saveManager.removeSave(saveId);
          this.dialogManager.clearDialogs();
          this.toastManager.addToast({
            type: ToastTypeEnum.SUCCESS,
            message: "Diagramme supprimé",
          });
        },
      },
    });
  };

  handleSaveRemoveCurrent = (): void => {
    const currentSave = this.saveManager.getCurrentSave();

    // TODO : handle error
    if (!currentSave) return;

    const dialogId = this.dialogManager.addConfirmDialog({
      title: "Suppression",
      message: "Êtes-vous sûr de vouloir supprimer ce diagramme ?",
      callbacks: {
        closeDialog: () => {
          this.dialogManager.removeDialogById(dialogId);
        },
        onConfirm: () => {
          this.dialogManager.clearDialogs();
          this.saveManager.removeSave(currentSave.getId());
          this.toastManager.addToast({
            type: ToastTypeEnum.SUCCESS,
            message: "Diagramme supprimé",
          });
          this.handleNavigateToHome();
        },
      },
    });
  };

  handleSettingsOpen = (): void => {
    const settingsDialogAlreadOpen = this.dialogManager.hasSettingsDialogOpened();

    if (settingsDialogAlreadOpen) return;

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
    this.saveManager.saveCurrent();

    this.toastManager.addToast({
      type: ToastTypeEnum.SAVE,
      message: "Paramètres sauvegardés",
    });
  };

  // REVIEWED
  private handleItemUpdate<TInput, TOutput>(
    item: TInput,
    updateFn: (item: TInput) => MeriseResult<TOutput, null>,
    successMessage: string,
    errorMessage: string
  ): void {
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
    const edgeFindResult = this.flowManager.findEdgeById(edgeId);

    if (!edgeFindResult.success) {
      this.errorManager.handleError(this.mapResultError(edgeFindResult));
      return;
    }

    const onConfirm = (edge: TypedEdge) => {
      const edgeRemoveResult = this.flowManager.removeEdge(edge.id);

      if (!edgeRemoveResult.success) {
        this.errorManager.handleError(this.mapResultError(edgeRemoveResult));
        return;
      }

      const relationRemoveResult = this.meriseManager.removeRelation(edge.id);

      if (!relationRemoveResult.success) {
        this.flowManager.createConnection({
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle ?? null,
          targetHandle: edge.targetHandle ?? null,
        });
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
    const nodeFindResult = this.flowManager.findNodeById(nodeId);

    if (!nodeFindResult.success) {
      this.errorManager.handleError(this.mapResultError(nodeFindResult));
      return;
    }

    const onConfirm = (node: TypedNode, itemTypeName: string) => {
      const nodeRemoveResult = this.flowManager.removeNode(node.id);

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
          const entityRemoveResult = this.meriseManager.removeEntity(node.id);

          if (!entityRemoveResult.success) {
            this.flowManager.createNode(node.data.type);
            this.errorManager.handleError(this.mapResultError(entityRemoveResult));
            return;
          }

          break;
        case FlowMeriseItemTypeEnum.ASSOCIATION:
          const associationRemoveResult = this.meriseManager.removeAssociation(node.id);

          if (!associationRemoveResult.success) {
            this.flowManager.createNode(node.data.type);
            this.errorManager.handleError(this.mapResultError(associationRemoveResult));
            return;
          }

          break;
        default:
          this.flowManager.createNode(node.data.type);
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

  private mapResultError = (resultFail: FlowResultFail<unknown> | MeriseResultFail<any>): CoreError => {
    switch (resultFail.severity) {
      case FlowSeverityTypeEnum.INFO:
      case MeriseSeverityTypeEnum.INFO:
        return new CoreError(ErrorSeverityTypeEnum.INFO, resultFail.message);
      case FlowSeverityTypeEnum.WARNING:
      case MeriseSeverityTypeEnum.WARNING:
        return new CoreError(ErrorSeverityTypeEnum.WARNING, resultFail.message);
      case FlowSeverityTypeEnum.ERROR:
      case MeriseSeverityTypeEnum.ERROR:
        return new CoreError(ErrorSeverityTypeEnum.ERROR, resultFail.message);
      default:
        return new CoreError(ErrorSeverityTypeEnum.ERROR, "Anomalie dans le système d'erreur");
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
