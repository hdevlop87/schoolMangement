import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/Spinner';

interface UseLoadingErrorOptions {
  loadingText?: string;
  noDataText?: string;
  onRetry?: () => void;
  spinnerVariant?: "default" | "circle" | "pinwheel" | "circle-filled" | "ellipsis" | "ring" | "bars" | "infinite";
  spinnerSize?: number;
  fullScreen?: boolean;
}

interface UseLoadingErrorReturn {
  renderLoadingState: () => React.ReactNode;
  renderErrorState: (error: string | Error) => React.ReactNode;
  renderNoDataState: () => React.ReactNode;
  getStateComponent: (isLoading: boolean, error?: string | Error | null, noData?: boolean) => React.ReactNode | null;
}

export const useLoadingError = (options: UseLoadingErrorOptions = {}): UseLoadingErrorReturn => {
  const {
    loadingText = "Loading...",
    noDataText = "No data available",
    onRetry,
    spinnerVariant = "circle",
    spinnerSize = 32,
    fullScreen = false
  } = options;

  const wrapperClasses = fullScreen
    ? "min-h-screen flex items-center justify-center bg-background w-full"
    : "flex items-center justify-center py-8 w-full";

  const renderLoadingState = () => (
    <div className={wrapperClasses}>
      <div className="flex flex-col items-center justify-center space-y-3">
        <Spinner variant={spinnerVariant} size={spinnerSize} className="text-primary" />
        <p className="text-muted-foreground text-sm">{loadingText}</p>
      </div>
    </div>
  );

  const renderErrorState = (error: string | Error) => {
    const errorMessage = typeof error === 'string' ? error : error.message;

    return (
      <div className={wrapperClasses}>
        <div className="flex flex-col items-center justify-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-destructive" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h3>
            <p className="text-muted-foreground text-sm mb-4">{errorMessage}</p>
          </div>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try again</span>
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderNoDataState = () => (
    <div className={wrapperClasses}>
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <span className="text-2xl">📭</span>
        </div>
        <p className="text-muted-foreground text-sm">{noDataText}</p>
      </div>
    </div>
  );

  const getStateComponent = (
    isLoading: boolean,
    error?: string | Error | null,
    noData?: boolean
  ): React.ReactNode | null => {
    if (isLoading) return renderLoadingState();
    if (error) return renderErrorState(error);
    if (noData) return renderNoDataState();
    return null;
  };

  return {
    renderLoadingState,
    renderErrorState,
    renderNoDataState,
    getStateComponent
  };
};