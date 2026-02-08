import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-sage-50 via-forest-50 to-moss-50 dark:from-forest-950 dark:via-sage-950 dark:to-forest-950 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-8 bg-white dark:bg-forest-800 border-red-200 dark:border-red-800">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-forest-900 dark:text-forest-50 mb-2">
                  Something went wrong
                </h2>
                <p className="text-sage-700 dark:text-sage-300 mb-4">
                  We encountered an unexpected error. This has been logged and we'll look into it.
                </p>
                
                {this.state.error && (
                  <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm font-mono text-red-800 dark:text-red-200 mb-2">
                      {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <details className="text-xs text-red-700 dark:text-red-300">
                        <summary className="cursor-pointer hover:underline">
                          Show error details
                        </summary>
                        <pre className="mt-2 overflow-auto max-h-64 p-2 bg-red-100 dark:bg-red-900/40 rounded">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={this.handleReset}
                    className="bg-gradient-to-r from-forest-500 to-sage-600 hover:from-forest-600 hover:to-sage-700 text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reload Page
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="border-sage-300 dark:border-sage-600"
                  >
                    Go Back
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}