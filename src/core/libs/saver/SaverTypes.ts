import type { FlowDTOInterface } from "@/libs/flow";
import type { FlowDTOObject } from "@/libs/flow/types";
import type { MeriseDTOInterface } from "@/libs/merise";
import type { MeriseDTOObject } from "@/libs/merise/types";

// Interface for a raw save that will be parsed to build a clean save
export interface SaverStoreItemRaw {
  id: string;
  data: {
    flow: FlowDTOObject;
    merise: MeriseDTOObject;
  };
}

// Interface for a save that will provide data to the application
export interface SaverStoreItem {
  id: string;
  data: {
    flow: FlowDTOInterface;
    merise: MeriseDTOInterface;
  };
}

// Contract for the saver manager implementation
export interface SaverManagerInterface {
  onSave: () => void;
}
