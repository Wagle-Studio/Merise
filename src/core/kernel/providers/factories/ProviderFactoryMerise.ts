import type { KernelManagers } from "@/core";
import type { MeriseAssociationInterface, MeriseEntityInterface, MeriseOperations, MeriseRelationInterface } from "@/libs/merise";

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
      onEntityUpdate: (entity: MeriseEntityInterface): void => {
        managers.core.handleMeriseEntityUpdate(entity);
      },
      onAssociationUpdate: (association: MeriseAssociationInterface): void => {
        managers.core.handleMeriseAssociationUpdate(association);
      },
      onRelationUpdate: (relation: MeriseRelationInterface): void => {
        managers.core.handleMeriseRelationUpdate(relation);
      },
    };
  }
}
