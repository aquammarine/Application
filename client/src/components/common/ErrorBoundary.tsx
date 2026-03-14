import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorPage } from '../../features/Error/ErrorPage';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorPage 
          error={this.state.error} 
          resetErrorBoundary={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}
