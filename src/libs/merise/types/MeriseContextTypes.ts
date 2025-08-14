import type { ReactNode } from "react";
import type { MeriseOperations } from "./MeriseCore";

// Props required to initialize the Merise context
export type MeriseContextProps = {
  children: ReactNode;
  operations: MeriseOperations;
};

// Values exposed by the Merise context
export type MeriseContext = {
  operations: MeriseOperations;
};
