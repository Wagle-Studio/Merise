import type { Connection } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import type { KernelDependencies, KernelOperations } from "@/core/kernel";
import { SaveDemo } from "@/core/libs/save";
import type { Settings } from "@/core/libs/settings";
import type {
  FlowConnectEntityToAssociationResult,
  FlowConnectEntityToEntityResult,
  FlowResult,
  TypedEdge,
  TypedNode,
} from "@/libs/flow";
import { FlowConnectionTypeEnum, FlowMeriseItemTypeEnum } from "@/libs/flow";
import type { MeriseItemInterface, MeriseResult } from "@/libs/merise";
import {
  Association,
  Entity,
  Field,
  FieldTypeNumberOptionEnum,
  MeriseFieldTypeTypeEnum,
  MeriseFormTypeEnum,
  MeriseItemTypeEnum,
  Relation,
} from "@/libs/merise";
import { type DomainManagerInterface, type DomainManagerMap, type DomainManagers } from "./DomainTypes";

export default class DomainManager implements DomainManagerInterface {
  constructor(
    private managers: DomainManagers,
    private operations: KernelOperations,
    private dependencies: KernelDependencies
  ) {}

  getManager<K extends keyof DomainManagerMap>(name: K): DomainManagerMap[K] {
    return this.managers[name];
  }

  handleNavigateToHome = (): void => {
    const getCurrentSaveResult = this.dependencies.getCurrentSave();

    if (!getCurrentSaveResult.success) {
      this.operations.handleError(getCurrentSaveResult);
      return;
    }

    const isSaveDemo = getCurrentSaveResult.data.getId() === SaveDemo.id;

    if (isSaveDemo) {
      this.operations.handleCloseDomain();
      return;
    }

    const hasUnsavedChangesResult = this.operations.doesSaveHasUnsavedChanges(
      this.managers.flow.getCurrentFlow(),
      this.managers.merise.getCurrentMerise()
    );

    if (!hasUnsavedChangesResult.success) {
      this.operations.handleError(hasUnsavedChangesResult);
      return;
    }

    if (!isSaveDemo && hasUnsavedChangesResult.data) {
      this.dependencies.addDialogConfirm({
        title: "Modifications non sauvegardées",
        message: "Êtes-vous sûr de vouloir quitter sans sauvegarder les modifications en cours ?",
        callbacks: {
          onConfirm: () => this.operations.handleCloseDomain(),
        },
      });

      return;
    }

    this.operations.handleCloseDomain();
  };

  handleSaveCurrent = (): void => {
    const saveCurrentResult = this.operations.handleSaveCurrent(
      this.managers.flow.getCurrentFlow(),
      this.managers.merise.getCurrentMerise()
    );

    if (!saveCurrentResult) {
      this.dependencies.addToastSave("Une erreur est survenue");
      return;
    }

    this.dependencies.addToastSave("Diagramme sauvegardé");
  };

  handleEntityCreate = (): void => {
    const nodeCreateResult = this.managers.flow.createNode(FlowMeriseItemTypeEnum.ENTITY);

    if (!nodeCreateResult.success) {
      this.operations.handleError(nodeCreateResult);
      return;
    }

    const entityCreateResult = this.managers.merise.addEntity(nodeCreateResult.data.id);

    if (!entityCreateResult.success) {
      this.operations.handleError(entityCreateResult);

      // TODO : handle fail result
      this.managers.flow.removeNode(nodeCreateResult.data.id);
      return;
    }

    this.dependencies.addToastSuccess("Entité créée");
  };

  handleAssociationCreate = (): void => {
    const nodeCreateResult = this.managers.flow.createNode(FlowMeriseItemTypeEnum.ASSOCIATION);

    if (!nodeCreateResult.success) {
      this.operations.handleError(nodeCreateResult);
      return;
    }

    const associationCreateResult = this.managers.merise.addAssociation(nodeCreateResult.data.id);

    if (!associationCreateResult.success) {
      this.operations.handleError(associationCreateResult);

      // TODO : handle fail result
      this.managers.flow.removeNode(nodeCreateResult.data.id);
      return;
    }

    this.dependencies.addToastSuccess("Association créée");
  };

  handleRelationCreate = (connection: Connection): void => {
    const createConnectionResult = this.managers.flow.createConnection(connection);

    if (!createConnectionResult.success) {
      this.operations.handleError(createConnectionResult);
      return;
    }

    if (createConnectionResult.data.type === FlowConnectionTypeEnum.ENTITY_ASSOCIATION) {
      this.handleConnectEntityToAssociation(createConnectionResult.data);
    } else if (createConnectionResult.data.type === FlowConnectionTypeEnum.ENTITY_ENTITY) {
      this.handleConnectEntityToEntity(createConnectionResult.data);
    }
  };

  handleFieldCreate = (field: Field): void => {
    this.handleMeriseFieldAction(field, "create");
  };

  handleEntityUpdate = (entity: Entity): void => {
    this.handleMeriseItemUpdate<Entity>(entity, this.managers.merise.updateEntity, "Entité");
  };

  handleAssociationUpdate = (association: Association): void => {
    this.handleMeriseItemUpdate<Association>(association, this.managers.merise.updateAssociation, "Association");
  };

  handleRelationUpdate = (relation: Relation): void => {
    this.handleMeriseItemUpdate<Relation>(relation, this.managers.merise.updateRelation, "Relation");
  };

  handleFieldUpdate = (field: Field): void => {
    this.handleMeriseFieldAction(field, "update");
  };

  handleSettingsUpdate = (settings: Settings): void => {
    this.operations.handleSettingsUpdate(settings);

    const saveCurrentResult = this.operations.handleSaveCurrent(
      this.managers.flow.getCurrentFlow(),
      this.managers.merise.getCurrentMerise()
    );

    if (!saveCurrentResult) {
      this.dependencies.addToastSave("Une erreur est survenue");
      return;
    }

    this.dependencies.addToastSave("Paramètres mis à jour");
  };

  handleFieldRemove = (field: Field): void => {
    this.handleMeriseFieldAction(field, "remove");
  };

  handleDialogEntityEdit = (entity: Entity): void => {
    const dialogId = this.dependencies.addDialogEntity({
      component: () => entity.renderFormComponent(),
      callbacks: {
        deleteEntity: () => this.handleDialogEntityRemove(entity, onRemoveComplete),
        addField: () => this.handleDialogFieldCreate(entity),
        addFieldPrimaryKey: () => this.handleCreateFieldPrimaryKey(entity),
      },
    });

    const onRemoveComplete = () => {
      if (dialogId) this.dependencies.removeDialog(dialogId);
      this.dependencies.addToastSuccess("Entité supprimée");
    };
  };

  handleDialogAssociationEdit = (association: Association): void => {
    const dialogId = this.dependencies.addDialogAssociation({
      component: () => association.renderFormComponent(),
      callbacks: {
        deleteAssociation: () => this.handleDialogAssociationRemove(association, onRemoveComplete),
        addField: () => this.handleDialogFieldCreate(association),
        addFieldPrimaryKey: () => this.handleCreateFieldPrimaryKey(association),
      },
    });

    const onRemoveComplete = () => {
      if (dialogId) this.dependencies.removeDialog(dialogId);
      this.dependencies.addToastSuccess("Association supprimée");
    };
  };

  handleDialogRelationEdit = (relation: Relation): void => {
    const dialogId = this.dependencies.addDialogRelation({
      component: () => relation.renderFormComponent(),
      callbacks: {
        deleteRelation: () => this.handleDialogRelationRemove(relation, onRemoveComplete),
      },
    });

    const onRemoveComplete = () => {
      if (dialogId) this.dependencies.removeDialog(dialogId);
      this.dependencies.addToastSuccess("Relation supprimée");
    };
  };

  handleDialogFieldEdit = (field: Field): void => {
    this.dependencies.addDialogField({
      component: () => field.renderFormComponent(MeriseFormTypeEnum.UPDATE),
    });
  };

  private handleCreateFieldPrimaryKey = (item: Entity | Association): void => {
    const fieldPrimaryKey = new Field(
      uuidv4(),
      item.getId(),
      item.getType(),
      this.primaryKeyFieldName(item.getName()),
      MeriseFieldTypeTypeEnum.NUMBER,
      FieldTypeNumberOptionEnum.COMPTER,
      true,
      false,
      true
    );

    this.handleFieldCreate(fieldPrimaryKey);
  };

  private handleDialogFieldCreate = (item: MeriseItemInterface): void => {
    const field = new Field(uuidv4(), item.getId(), item.getType());

    this.dependencies.addDialogField({
      title: "Ajouter un champ",
      component: () => field.renderFormComponent(MeriseFormTypeEnum.CREATE),
    });
  };

  private handleDialogEntityRemove = (entity: Entity, onCompleteFn?: () => void): void => {
    const dialogId = this.dependencies.addDialogConfirm({
      title: "Supprimer l'entité",
      message: "Confirmer la suppression de cette entité ?",
      callbacks: {
        onConfirm: () => {
          this.handleMeriseItemRemove<Entity>(entity, this.managers.flow.removeNode, this.managers.merise.removeEntity);
          if (dialogId) this.dependencies.removeDialog(dialogId);
          if (onCompleteFn) onCompleteFn();
        },
      },
    });
  };

  private handleDialogAssociationRemove = (association: Association, onCompleteFn?: () => void): void => {
    const dialogId = this.dependencies.addDialogConfirm({
      title: `Supprimer l'association`,
      message: `Confirmer la suppression de cette assocation ?`,
      callbacks: {
        onConfirm: () => {
          this.handleMeriseItemRemove<Association>(
            association,
            this.managers.flow.removeNode,
            this.managers.merise.removeAssociation
          );
          if (dialogId) this.dependencies.removeDialog(dialogId);
          if (onCompleteFn) onCompleteFn();
        },
      },
    });
  };

  private handleDialogRelationRemove = (relation: Relation, onCompleteFn?: () => void): void => {
    const dialogId = this.dependencies.addDialogConfirm({
      title: `Supprimer la relation`,
      message: `Confirmer la suppression de cette relation ?`,
      callbacks: {
        onConfirm: () => {
          this.handleMeriseItemRemove<Relation>(
            relation,
            this.managers.flow.removeEdge,
            this.managers.merise.removeRelation
          );
          if (dialogId) this.dependencies.removeDialog(dialogId);
          if (onCompleteFn) onCompleteFn();
        },
      },
    });
  };

  private handleMeriseItemUpdate = <T>(
    item: T,
    updateFn: (item: T) => MeriseResult<T, null>,
    itemName: string
  ): void => {
    const updateResult = updateFn(item);

    if (!updateResult.success) {
      this.operations.handleError(updateResult);
      return;
    }

    this.dependencies.addToastSuccess(`${itemName} mise à jour`);
  };

  private handleMeriseItemRemove = <T>(
    item: Entity | Association | Relation,
    flowRemoveFn: (id: string) => FlowResult<TypedNode | TypedEdge, null>,
    meriseRemoveFn: (id: string) => MeriseResult<T, null>
  ) => {
    const flowRemoveResult = flowRemoveFn(item.getFlowId());

    if (!flowRemoveResult.success) {
      this.operations.handleError(flowRemoveResult);
      return;
    }

    const meriseRemoveResult = meriseRemoveFn(item.getFlowId());

    if (!meriseRemoveResult.success) {
      this.operations.handleError(meriseRemoveResult);
      return;
    }
  };

  private handleMeriseFieldAction = (field: Field, action: "create" | "update" | "remove") => {
    if (field.getMeriseItemType() === MeriseItemTypeEnum.ENTITY) {
      const entityFindResult = this.managers.merise.findEntityById(field.getMeriseItemId());

      if (!entityFindResult.success) {
        this.operations.handleError(entityFindResult);
        return;
      }

      switch (action) {
        case "create":
          entityFindResult.data?.addField(field);
          break;
        case "update":
          entityFindResult.data?.updateFields(field);
          break;
        case "remove":
          entityFindResult.data?.deleteField(field);
          break;
      }

      this.handleMeriseItemUpdate(entityFindResult.data, this.managers.merise.updateEntity, "Entité");
    }

    if (field.getMeriseItemType() === MeriseItemTypeEnum.ASSOCIATION) {
      const associationFindResult = this.managers.merise.findAssociationById(field.getMeriseItemId());

      if (!associationFindResult.success) {
        this.operations.handleError(associationFindResult);
        return;
      }

      switch (action) {
        case "create":
          associationFindResult.data?.addField(field);
          break;
        case "update":
          associationFindResult.data?.updateFields(field);
          break;
        case "remove":
          associationFindResult.data?.deleteField(field);
          break;
      }

      this.handleMeriseItemUpdate(associationFindResult.data, this.managers.merise.updateAssociation, "Association");
    }
  };

  private handleConnectEntityToAssociation = (connection: FlowConnectEntityToAssociationResult) => {
    const relationCreateResult = this.managers.merise.addRelation(
      connection.edge.id,
      connection.edge.source,
      connection.edge.target
    );

    if (!relationCreateResult.success) {
      this.operations.handleError(relationCreateResult);
      return;
    }

    this.managers.flow.addEdge(connection.edge);
    this.dependencies.addToastSuccess("Relation créée");
  };

  private handleConnectEntityToEntity = (connection: FlowConnectEntityToEntityResult) => {
    const associationId = connection.node.data.id;

    const createAssociationResult = this.managers.merise.addAssociation(associationId);

    if (!createAssociationResult.success) {
      this.operations.handleError(createAssociationResult);
      return;
    }

    this.managers.flow.addNode(connection.node);

    const createdEdgeIds: string[] = [];

    for (const edge of connection.edges) {
      const subConnectionResult = this.managers.flow.createConnection({
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle ?? null,
        targetHandle: edge.targetHandle ?? null,
      });

      if (!subConnectionResult.success || subConnectionResult.data.type !== FlowConnectionTypeEnum.ENTITY_ASSOCIATION) {
        for (const id of createdEdgeIds) this.managers.flow.removeEdge(id);
        this.managers.flow.removeNode(connection.node.id);
        this.managers.merise.removeAssociation(associationId);
        // this.operations.handleError(subConnectionResult); // TODO : handle error
        return;
      }

      const createdEdge = subConnectionResult.data.edge;
      const createdEdgeId = createdEdge.data.id;

      createdEdgeIds.push(createdEdgeId);

      const createRelationResult = this.managers.merise.addRelation(
        createdEdgeId,
        createdEdge.source,
        createdEdge.target
      );

      if (!createRelationResult.success) {
        for (const id of createdEdgeIds) this.managers.flow.removeEdge(id);
        this.managers.flow.removeNode(connection.node.id);
        this.managers.merise.removeAssociation(associationId);
        this.operations.handleError(createRelationResult);
        return;
      }

      this.managers.flow.addEdge(createdEdge);
    }

    this.dependencies.addToastSuccess("Relation créée");
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
