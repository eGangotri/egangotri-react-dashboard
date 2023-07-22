import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallbackComponent: React.ElementType;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error Details:-", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const FallBackComponent = this.props.fallbackComponent;

      return <FallBackComponent />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
