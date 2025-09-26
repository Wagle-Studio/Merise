import type { ReactNode } from "react";
import type { Association, Entity, Relation } from "../models";
import type {
  MeriseAssociationInterface,
  MeriseEntityInterface,
  MeriseFieldInterface,
  MeriseRelationInterface,
} from "./MeriseModels";

// Props required to initialize the Merise context
export type MeriseContextProps = {
  children: ReactNode;
  operations: MeriseOperations;
};

// Values exposed by the Merise context
export type MeriseContext = {
  operations: MeriseOperations;
};

// Merise operations contract provided by the provider factory
export interface MeriseOperations {
  onEntitySelect: (entity: MeriseEntityInterface) => void;
  onAssociationSelect: (association: MeriseAssociationInterface) => void;
  onRelationSelect: (relation: MeriseRelationInterface) => void;
  onFieldSelect: (field: MeriseFieldInterface) => void;
  onEntityUpdate: (entity: Entity) => void;
  onAssociationUpdate: (association: Association) => void;
  onRelationUpdate: (relation: Relation) => void;
  onFieldCreate: (field: MeriseFieldInterface) => void;
  onFieldUpdate: (field: MeriseFieldInterface) => void;
  onFieldDelete: (field: MeriseFieldInterface) => void;
}
