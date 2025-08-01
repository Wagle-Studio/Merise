import type { KernelManagers } from "@/core";
import { ToastTypeEnum } from "@/core/libs/toast";
import type { MeriseAssociationInterface, MeriseDependencies, MeriseEntityInterface, MeriseRelationInterface } from "@/libs/merise";
import { Association, Entity, Relation } from "@/libs/merise";

// Factory responsible for creating Merise operations and dependency mappings from Kernel managers
export default class ProviderFactoryMerise {
  static createDependencies(managers: KernelManagers): MeriseDependencies {
    return {
      onEntitySelect: (entity: MeriseEntityInterface): void => {
        const dialogId = managers.dialog.addEntityDialog({
          title: "",
          component: entity.renderFormComponent(),
          callbacks: {
            cancel: () => {
              managers.dialog.removeDialogById(dialogId);
            },
            delete: () => {
              managers.core.handleFlowNodeRemove(entity.flowId, () => managers.dialog.removeDialogById(dialogId));
            },
          },
        });
      },
      onAssociationSelect: (association: MeriseAssociationInterface): void => {
        const dialogId = managers.dialog.addAssociationDialog({
          title: "",
          component: association.renderFormComponent(),
          callbacks: {
            cancel: () => {
              managers.dialog.removeDialogById(dialogId);
            },
            delete: () => {
              managers.core.handleFlowNodeRemove(association.flowId, () => managers.dialog.removeDialogById(dialogId));
            },
          },
        });
      },
      onRelationSelect: (relation: MeriseRelationInterface): void => {
        const dialogId = managers.dialog.addRelationDialog({
          title: "",
          component: relation.renderFormComponent(),
          callbacks: {
            cancel: () => {
              managers.dialog.removeDialogById(dialogId);
            },
            delete: () => {
              managers.core.handleFlowEdgeRemove(relation.flowId, () => managers.dialog.removeDialogById(dialogId));
            },
          },
        });
      },
      onEntityUpdate: (entity: MeriseEntityInterface): void => {
        const entityUpdateResult = managers.merise.updateEntity(entity as Entity);
        if (entityUpdateResult.success) {
          managers.flow.triggerReRender();
          managers.toast.addToast({
            type: ToastTypeEnum.SUCCESS,
            message: "Entité mise à jour avec succes",
          });
        } else {
          managers.toast.addToast({
            type: ToastTypeEnum.ERROR,
            message: "L'entité n'a pas pus être mise à jour",
          });
        }
      },
      onAssociationUpdate: (association: MeriseAssociationInterface): void => {
        const associationUpdateResult = managers.merise.updateAssociation(association as Association);
        if (associationUpdateResult.success) {
          managers.flow.triggerReRender();
          managers.toast.addToast({
            type: ToastTypeEnum.SUCCESS,
            message: "Association mise à jour avec succes",
          });
        } else {
          managers.toast.addToast({
            type: ToastTypeEnum.ERROR,
            message: "L'association n'a pas pus être mise à jour",
          });
        }
      },
      onRelationUpdate: (relation: MeriseRelationInterface): void => {
        const relationUpdateResult = managers.merise.updateRelation(relation as Relation);
        if (relationUpdateResult.success) {
          managers.flow.triggerReRender();
          managers.toast.addToast({
            type: ToastTypeEnum.SUCCESS,
            message: "Relation mise à jour avec succes",
          });
        } else {
          managers.toast.addToast({
            type: ToastTypeEnum.ERROR,
            message: "La relation n'a pas pus être mise à jour",
          });
        }
      },
    };
  }
}
