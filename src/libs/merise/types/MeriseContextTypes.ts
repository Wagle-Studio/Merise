import type { ReactNode } from "react";
import type { MeriseDependencies } from "./MeriseCore";

// Props required to initialize the Merise context
export type MeriseContextProps = {
  children: ReactNode;
  dependencies: MeriseDependencies;
};

// Values exposed by the Merise context
export type MeriseContext = {};
