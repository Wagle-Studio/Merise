import type { KernelManagers } from "@/core";
import type { MeriseAssociationInterface, MeriseEntityInterface, MeriseFieldInterface, MeriseOperations, MeriseRelationInterface } from "@/libs/merise";

// Factory responsible for creating Merise operations and dependency mappings from Kernel managers
export default class ProviderFactoryMerise {
  static createOperations(managers: KernelManagers): MeriseOperations {
    return {
      onEntitySelect: (entity: MeriseEntityInterface): void => {
        managers.core.handleMeriseEntitySelect(entity);
      },
      onAssociationSelect: (association: MeriseAssociationInterface): void => {
        managers.core.handleMeriseAssociationSelect(association);
      },
      onRelationSelect: (relation: MeriseRelationInterface): void => {
        managers.core.handleMeriseRelationSelect(relation);
      },
      onFieldSelect: (field: MeriseFieldInterface): void => {
        managers.core.handleMeriseFieldSelect(field);
      },
      onEntityUpdate: (entity: MeriseEntityInterface): void => {
        managers.core.handleMeriseEntityUpdate(entity);
      },
      onAssociationUpdate: (association: MeriseAssociationInterface): void => {
        managers.core.handleMeriseAssociationUpdate(association);
      },
      onRelationUpdate: (relation: MeriseRelationInterface): void => {
        managers.core.handleMeriseRelationUpdate(relation);
      },
      onFieldCreate: (field: MeriseFieldInterface): void => {
        managers.core.handleMeriseFieldCreate(field);
      },
      onFieldUpdate: (field: MeriseFieldInterface): void => {
        managers.core.handleMeriseFieldUpdate(field);
      },
      onFieldDelete: (field: MeriseFieldInterface): void => {
        managers.core.handleMeriseFieldDelete(field);
      },
    };
  }
}
