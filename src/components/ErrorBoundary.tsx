import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-brand-warmWhite text-brand-dark">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200 text-center">
            <h2 className="text-2xl font-semibold text-gray-950 mb-3">Something went wrong</h2>
            <p className="text-sm text-gray-600 mb-6 font-light">
              An unexpected display issue occurred. Please refresh to reload the application.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-full bg-brand-purple hover:bg-brand-purpleDark text-white text-xs uppercase tracking-wider font-semibold shadow-md transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
