import { Component } from "react";
import type { ErrorBoundaryProps, ErrorBoundaryState, FallBackPresetType } from "@/core/libs/error";
import { FallbackError } from "@/ui";

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  private getFallbackPreset = (preset: FallBackPresetType, error: any) => {
    switch (preset) {
      case "CORE":
        return <FallbackError title="Core System" message="Une erreur technique s'est produite" error={error} />;
      case "ORCHESTROR_FLOW":
        return <FallbackError title="Orchestrator Flow" message="Une erreur technique s'est produite" error={error} />;
      case "ORCHESTROR_MERISE":
        return <FallbackError title="Orchestrator Merise" message="Une erreur technique s'est produite" error={error} />;
      case "LIB_FLOW":
        return <FallbackError title="Lib Flow" message="Une erreur technique s'est produite" error={error} />;
      case "LIB_MERISE":
        return <FallbackError title="Lib Merise" message="Une erreur technique s'est produite" error={error} />;
      default:
        return <FallbackError title="Erreur inconnue" message="Une erreur technique s'est produite" error={error} />;
    }
  };

  render() {
    if (this.state.hasError) {
      return this.getFallbackPreset(this.props.fallback, this.state.error);
    }

    return this.props.children;
  }
}
