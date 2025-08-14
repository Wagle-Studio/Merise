import type { ReactNode } from "react";
import type ErrorDTO from "./ErrorDTO";

// List of all available error types
export enum ErrorType {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

// Contract for the error manager implementation
export interface ErrorManagerInterface {
  handleError: (error: ErrorDTO) => void;
}

// List of all available fallback preset types for error boundaries
export enum FallBackPresetType {
  CORE = "CORE",
  ORCHESTRATOR_FLOW = "ORCHESTRATOR_FLOW",
  ORCHESTRATOR_MERISE = "ORCHESTRATOR_MERISE",
  LIB_FLOW = "LIB_FLOW",
  LIB_MERISE = "LIB_MERISE",
}

// Props definition for the ErrorBoundary component
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: FallBackPresetType;
}

// State definition for the ErrorBoundary component
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}
