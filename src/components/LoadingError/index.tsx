'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/Spinner';
import { Label } from '../ui/label';
import NIcon  from '@/components/NIcon';

interface LoadingErrorProps {
  isLoading?: boolean;
  error?: string | Error | null;
  noData?: boolean;
  loadingText?: string;
  noDataText?: string;
  onRetry?: () => void;
  spinnerVariant?: "default" | "circle" | "pinwheel" | "circle-filled" | "ellipsis" | "ring" | "bars" | "infinite";
  spinnerSize?: number;
  fullScreen?: boolean;
  children?: React.ReactNode;
}

const LoadingError: React.FC<LoadingErrorProps> = ({
  isLoading = false,
  error,
  noData = false,
  loadingText = "Loading...",
  noDataText = "No data available",
  onRetry,
  spinnerVariant = "circle",
  spinnerSize = 72,
  fullScreen = false,
  children
}) => {
  const wrapperClasses = fullScreen
    ? "h-full min-h-screen flex  justify-center bg-background w-full"
    : "h-full flex items-center justify-center  w-full";

  // Loading state
  if (isLoading) {
    return (
      <div className={wrapperClasses}>
        <div className="flex flex-col justify-center items-center gap-4">
          <Spinner variant={spinnerVariant} size={spinnerSize} className="text-primary" />
          <Label className="text-muted-foreground text-md">{loadingText}</Label>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
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
  }

  if (noData) {
    return (
      <div className={wrapperClasses}>
        <div className="flex flex-col items-center justify-center space-y-4">
          <NIcon icon="noDataImage"  size={100}/>
          <p className="text-muted-foreground text-lg">{noDataText}</p>
          {children}
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingError;