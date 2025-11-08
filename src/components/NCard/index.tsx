'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import LoadingError from '@/components/LoadingError';

interface NCardProps {
  title?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  loading?: boolean;
  error?: any;
  noData?: boolean;
  loadingText?: string;
  noDataText?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export const NCard: React.FC<NCardProps> = ({
  title,
  icon: Icon,
  children,
  className = '',
  headerAction,
  loading = false,
  error,
  noData = false,
  loadingText = 'Loading...',
  noDataText = 'No data available',
  onRetry,
}) => {
  // Show LoadingError if there's loading, error, or no data state
  const hasLoadingState = loading || error || noData;

  return (
    <Card className={cn('flex p-4 gap-3 border-white', className)}>
      {title && (
        <CardHeader className='flex w-full justify-start space-y-0 p-0' >
          <CardTitle className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5" />}
            {title}
          </CardTitle>
          {headerAction && (
            <div className="flex items-center ">
              {headerAction}
            </div>
          )}
        </CardHeader>
      )}

      <CardContent className={'flex flex-col h-full m-0 p-0'}>
        {hasLoadingState ? (
          <LoadingError
            isLoading={loading}
            error={error}
            noData={noData}
            loadingText={loadingText}
            noDataText={noDataText}
            onRetry={onRetry}
            fullScreen={false}
          />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

export default NCard;