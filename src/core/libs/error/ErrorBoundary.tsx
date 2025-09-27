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
      case "KERNEL":
        return <FallbackError title="Kernel" message="Une erreur technique est survenue" error={error} />;
      case "DOMAIN":
        return <FallbackError title="Domain" message="Une erreur technique est survenue" error={error} />;
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
