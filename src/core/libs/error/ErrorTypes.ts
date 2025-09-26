import type { ReactNode } from "react";
import type { CoreResultFail } from "@/core";
import type { FlowResultFail } from "@/libs/flow";
import type { MeriseResultFail } from "@/libs/merise";
import type ErrorDTO from "./ErrorDTO";

// List of all available error types
export enum SeverityType {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

// List of all available fallback preset types for error boundaries
export enum ErrorFallBackPresetType {
  CORE = "CORE",
  ORCHESTRATOR_FLOW = "ORCHESTRATOR_FLOW",
  ORCHESTRATOR_MERISE = "ORCHESTRATOR_MERISE",
  LIB_FLOW = "LIB_FLOW",
  LIB_MERISE = "LIB_MERISE",
}

// Props definition for the ErrorBoundary component
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ErrorFallBackPresetType;
}

// State definition for the ErrorBoundary component
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Union type representing every possible fail result operation
export type ErrorFailResultType = FlowResultFail<unknown> | MeriseResultFail<unknown> | CoreResultFail<unknown>;

// Contract for the error manager implementation
export interface ErrorManagerInterface {
  mapResultError: (resultFail: ErrorFailResultType) => ErrorDTO;
}
