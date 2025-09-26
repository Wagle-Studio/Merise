import type { Connection } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import type { DialogManagerInterface } from "@/core/libs/dialog";
import { type ErrorManagerInterface } from "@/core/libs/error";
import type { NavigatorManagerInterface } from "@/core/libs/navigator";
import { SaveDTO, type SaveDTOInterface, type SaveManagerInterface } from "@/core/libs/save";
import type { Settings, SettingsManagerInterface } from "@/core/libs/settings";
import { SettingsDefault } from "@/core/libs/settings/";
import { type ToastManagerInterface } from "@/core/libs/toast";
import type { FlowManagerInterface, TypedEdge, TypedNode } from "@/libs/flow";
import { FlowConnectionTypeEnum, FlowMeriseItemTypeEnum } from "@/libs/flow";
import type {
  Association,
  Entity,
  MeriseAssociationInterface,
  MeriseEntityInterface,
  MeriseFieldInterface,
  MeriseManagerInterface,
  MeriseRelationInterface,
  MeriseResult,
} from "@/libs/merise";
import {
  Field,
  FieldTypeNumberOptionEnum,
  MeriseFieldTypeTypeEnum,
  MeriseFormTypeEnum,
  MeriseItemTypeEnum,
  Relation,
} from "@/libs/merise";
import type { CoreManagerInterface } from "./CoreTypes";

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
      this.toastManager.mapToastError(this.errorManager.mapResultError(createConnectionResult));
      return;
    }

    if (createConnectionResult.data.type === FlowConnectionTypeEnum.ENTITY_ENTITY) {
      const associationFlowNode = createConnectionResult.data.node;
      const associationFlowId = associationFlowNode.data.id;

      const associationCreateResult = this.meriseManager.addAssociation(associationFlowId);

      if (!associationCreateResult.success) {
        this.toastManager.mapToastError(this.errorManager.mapResultError(associationCreateResult));
        return;
      }

      const createNodeResult = this.flowManager.addNode(createConnectionResult.data.node);

      if (!createNodeResult.success) {
        this.meriseManager.removeAssociation(associationFlowId);
        this.toastManager.mapToastError(this.errorManager.mapResultError(createNodeResult));
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
            this.toastManager.mapToastError(this.errorManager.mapResultError(createSubConnectionResult));

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
          this.toastManager.mapToastError(this.errorManager.mapResultError(relationResult));

          return;
        }

        // const edgeResult = this.flowManager.addEdge(edge);
      }

      this.toastManager.addToastSuccess("Relation créée");

      return;
    }

    if (createConnectionResult.data.type === FlowConnectionTypeEnum.ENTITY_ASSOCIATION) {
      const edge = createConnectionResult.data.edge;

      // const edgeCreateResult = this.flowManager.createEdge(createConnectionResult.data.edge.)
      const relationCreateResult = this.meriseManager.addRelation(edge.data.id, edge.source, edge.target);

      if (!relationCreateResult.success) {
        this.toastManager.mapToastError(this.errorManager.mapResultError(relationCreateResult));
        this.flowManager.removeEdge(edge.data.id);
        return;
      }

      this.toastManager.addToastSuccess("Relation créée");
    }
  };

  handleCreateFlowNodeAndMeriseEntity = (): void => {
    const nodeCreateResult = this.flowManager.createNode(FlowMeriseItemTypeEnum.ENTITY);

    if (!nodeCreateResult.success) {
      this.toastManager.mapToastError(this.errorManager.mapResultError(nodeCreateResult));
      return;
    }

    const entityCreateResult = this.meriseManager.addEntity(nodeCreateResult.data.id);

    if (!entityCreateResult.success) {
      this.toastManager.mapToastError(this.errorManager.mapResultError(entityCreateResult));
      this.flowManager.removeNode(nodeCreateResult.data.id);
      return;
    }

    this.toastManager.addToastSuccess("Entité créée");
  };

  handleCreateFlowNodeAndMeriseAssociation = (): void => {
    const nodeCreateResult = this.flowManager.createNode(FlowMeriseItemTypeEnum.ASSOCIATION);

    if (!nodeCreateResult.success) {
      this.toastManager.mapToastError(this.errorManager.mapResultError(nodeCreateResult));
      return;
    }

    const associationCreateResult = this.meriseManager.addAssociation(nodeCreateResult.data.id);

    if (!associationCreateResult.success) {
      this.toastManager.mapToastError(this.errorManager.mapResultError(associationCreateResult));
      this.flowManager.removeNode(nodeCreateResult.data.id);
      return;
    }

    this.toastManager.addToastSuccess("Association créée");
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

  handleMeriseEntityUpdate = (entity: Entity): void => {
    const successMessage = "Entité mise à jour";

    this.handleItemUpdate(entity, this.meriseManager.updateEntity, successMessage);
  };

  handleMeriseAssociationUpdate = (association: Association): void => {
    const successMessage = "Association mise à jour";

    this.handleItemUpdate(association, this.meriseManager.updateAssociation, successMessage);
  };

  handleMeriseRelationUpdate = (relation: Relation): void => {
    const successMessage = "Relation mise à jour";

    this.handleItemUpdate(relation, this.meriseManager.updateRelation, successMessage);
  };

  handleMeriseFieldCreate = (field: MeriseFieldInterface): void => {
    switch (field.getMeriseItemType()) {
      case MeriseItemTypeEnum.ENTITY:
        const entityFindResult = this.meriseManager.findEntityById(field.getMeriseItemId());

        if (!entityFindResult.success) {
          this.toastManager.mapToastError(this.errorManager.mapResultError(entityFindResult));
          return;
        }

        entityFindResult.data?.addField(field);
        this.handleItemUpdate(entityFindResult.data, this.meriseManager.updateEntity, "Champ créé");

        break;
      case MeriseItemTypeEnum.ASSOCIATION:
        const associationFindResult = this.meriseManager.findAssociationById(field.getMeriseItemId());

        if (!associationFindResult.success) {
          this.toastManager.mapToastError(this.errorManager.mapResultError(associationFindResult));
          return;
        }

        associationFindResult.data?.addField(field);
        this.handleItemUpdate(associationFindResult.data, this.meriseManager.updateAssociation, "Champ créé");

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
          this.toastManager.mapToastError(this.errorManager.mapResultError(entityFindResult));
          return;
        }

        entityFindResult.data?.updateFields(field);
        this.handleItemUpdate(entityFindResult.data, this.meriseManager.updateEntity, "Champ mis à jour");

        break;
      case MeriseItemTypeEnum.ASSOCIATION:
        const associationFindResult = this.meriseManager.findAssociationById(field.getMeriseItemId());

        if (!associationFindResult.success) {
          this.toastManager.mapToastError(this.errorManager.mapResultError(associationFindResult));
          return;
        }

        associationFindResult.data?.updateFields(field);
        this.handleItemUpdate(associationFindResult.data, this.meriseManager.updateAssociation, "Champ mis à jour");

        break;
    }
  };

  handleMeriseFieldDelete = (field: MeriseFieldInterface): void => {
    switch (field.getMeriseItemType()) {
      case MeriseItemTypeEnum.ENTITY:
        const entityFindResult = this.meriseManager.findEntityById(field.getMeriseItemId());

        if (!entityFindResult.success) {
          this.toastManager.mapToastError(this.errorManager.mapResultError(entityFindResult));
          return;
        }

        entityFindResult.data?.deleteField(field);
        this.handleItemUpdate(entityFindResult.data, this.meriseManager.updateEntity, "Champ supprimé");

        break;
      case MeriseItemTypeEnum.ASSOCIATION:
        const associationFindResult = this.meriseManager.findAssociationById(field.getMeriseItemId());

        if (!associationFindResult.success) {
          this.toastManager.mapToastError(this.errorManager.mapResultError(associationFindResult));
          return;
        }

        associationFindResult.data?.deleteField(field);
        this.handleItemUpdate(associationFindResult.data, this.meriseManager.updateAssociation, "Champ supprimé");

        break;
    }
  };

  handleSaveCreate = (): void => {
    const newSaveId = this.saveManager.createSave();
    const openSaveResult = this.saveManager.openSave(newSaveId);

    if (!openSaveResult.success) {
      this.toastManager.mapToastError(this.errorManager.mapResultError(openSaveResult));
      return;
    }

    const save = new SaveDTO(openSaveResult.data);

    this.saveManager.updateCurrentSave(save);
    this.navigatorManager.setSaveUrlParams(openSaveResult.data.id);

    this.toastManager.addToastSave("Diagramme créé");
  };

  handleSaveOpen = (saveId: string): void => {
    const openSaveResult = this.saveManager.openSave(saveId);

    if (!openSaveResult.success) {
      this.toastManager.mapToastError(this.errorManager.mapResultError(openSaveResult));
      return;
    }

    const save = new SaveDTO(openSaveResult.data);

    this.saveManager.updateCurrentSave(save);
    this.navigatorManager.setSaveUrlParams(openSaveResult.data.id);
  };

  handleSave = (): void => {
    this.saveManager.saveCurrent();
    this.toastManager.addToastSave("Diagramme sauvegardé");
  };

  handleSaveSelect = (saveId: string): void => {
    const openSaveResult = this.saveManager.openSave(saveId);

    if (!openSaveResult.success) {
      this.toastManager.mapToastError(this.errorManager.mapResultError(openSaveResult));
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
    this.toastManager.addToastSave("Diagramme sauvegardé");
  };

  handleSaveUpdateCurrent = (saveDTO: SaveDTOInterface): void => {
    this.saveManager.updateCurrentSave(saveDTO);
    this.toastManager.addToastSave("Diagramme sauvegardé");
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
          this.toastManager.addToastSuccess("Diagramme supprimé");
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
          this.toastManager.addToastSuccess("Diagramme supprimé");
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

    this.toastManager.addToastSave("Diagramme sauvegardés");
  };

  // REVIEWED
  private handleItemUpdate<TInput, TOutput>(
    item: TInput,
    updateFn: (item: TInput) => MeriseResult<TOutput, null>,
    successMessage: string
  ): void {
    const updateResult = updateFn(item);

    if (!updateResult.success) {
      this.toastManager.mapToastError(this.errorManager.mapResultError(updateResult));
      return;
    }

    this.flowManager.triggerReRender();
    this.toastManager.addToastSuccess(successMessage);
  }

  // TODO: handle recover
  private handleFlowEdgeRemove = (edgeId: string, onComplete?: () => void): void => {
    const edgeFindResult = this.flowManager.findEdgeById(edgeId);

    if (!edgeFindResult.success) {
      this.toastManager.mapToastError(this.errorManager.mapResultError(edgeFindResult));
      return;
    }

    const onConfirm = (edge: TypedEdge) => {
      const edgeRemoveResult = this.flowManager.removeEdge(edge.id);

      if (!edgeRemoveResult.success) {
        this.toastManager.mapToastError(this.errorManager.mapResultError(edgeRemoveResult));
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
        this.toastManager.mapToastError(this.errorManager.mapResultError(relationRemoveResult));
        return;
      }

      this.toastManager.addToastSuccess("Relation supprimée");
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
      this.toastManager.mapToastError(this.errorManager.mapResultError(nodeFindResult));
      return;
    }

    const onConfirm = (node: TypedNode, itemTypeName: string) => {
      const nodeRemoveResult = this.flowManager.removeNode(node.id);

      if (!nodeRemoveResult.success) {
        this.toastManager.mapToastError(this.errorManager.mapResultError(nodeRemoveResult));
        return;
      }

      switch (nodeRemoveResult.data.data.type) {
        case FlowMeriseItemTypeEnum.ENTITY:
          const entityRemoveResult = this.meriseManager.removeEntity(node.id);

          if (!entityRemoveResult.success) {
            this.flowManager.createNode(node.data.type);
            this.toastManager.mapToastError(this.errorManager.mapResultError(entityRemoveResult));
            return;
          }

          break;
        case FlowMeriseItemTypeEnum.ASSOCIATION:
          const associationRemoveResult = this.meriseManager.removeAssociation(node.id);

          if (!associationRemoveResult.success) {
            this.flowManager.createNode(node.data.type);
            this.toastManager.mapToastError(this.errorManager.mapResultError(associationRemoveResult));
            return;
          }

          break;
        default:
          this.flowManager.createNode(node.data.type);
          this.toastManager.addToastError("Type d’élément non pris en charge");

          return;
      }

      this.toastManager.addToastSuccess(`${itemTypeName} supprimée avec succès`);
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
