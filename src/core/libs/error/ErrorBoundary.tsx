import { Component } from "react";
import { FallbackError } from "@/ui";
import type { ErrorBoundaryProps, ErrorBoundaryState, ErrorFallBackPresetType } from "./ErrorTypes";

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  private getFallbackPreset = (preset: ErrorFallBackPresetType, error: any) => {
    switch (preset) {
      case "CORE":
        return <FallbackError title="Core" message="Une erreur technique est survenue" error={error} />;
      case "ORCHESTRATOR_FLOW":
        return <FallbackError title="Orchestrator Flow" message="Une erreur technique est survenue" error={error} />;
      case "ORCHESTRATOR_MERISE":
        return <FallbackError title="Orchestrator Merise" message="Une erreur technique est survenue" error={error} />;
      case "LIB_FLOW":
        return <FallbackError title="Bibliothèque Flow" message="Une erreur technique est survenue" error={error} />;
      case "LIB_MERISE":
        return <FallbackError title="Bibliothèque Merise" message="Une erreur technique est survenue" error={error} />;
      default:
        return <FallbackError title="Erreur inconnue" message="Une erreur technique est survenue" error={error} />;
    }
  };

  render() {
    if (this.state.hasError) {
      return this.getFallbackPreset(this.props.fallback, this.state.error);
    }

    return this.props.children;
  }
}
