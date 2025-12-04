import React from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

export interface ErrorDisplayProps {
  error: string | Error | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  title?: string;
  showIcon?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  className = '',
  title = 'An error occurred',
  showIcon = true,
}) => {
  if (!error) return null;

  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <div
      className={`rounded-lg border border-red-200 bg-red-50 p-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-red-900 mb-1">
            {title}
          </h3>
          <p className="text-sm text-red-800">
            {errorMessage}
          </p>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-900 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </button>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;











