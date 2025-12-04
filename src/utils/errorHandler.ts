import { AxiosError } from 'axios';

export interface ErrorDetails {
  message: string;
  statusCode?: number;
  fieldErrors?: Record<string, string[]>;
  originalError?: unknown;
}

/**
 * Extract user-friendly error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (isAxiosError(error)) {
    return extractAxiosErrorMessage(error);
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Extract detailed error information
 */
export const getErrorDetails = (error: unknown): ErrorDetails => {
  const details: ErrorDetails = {
    message: getErrorMessage(error),
    originalError: error,
  };

  if (isAxiosError(error)) {
    details.statusCode = error.response?.status;
    
    const responseData = error.response?.data;
    if (responseData && typeof responseData === 'object') {
      // Extract field-specific errors
      const fieldErrors: Record<string, string[]> = {};
      
      for (const [key, value] of Object.entries(responseData)) {
        if (key !== 'error' && key !== 'message' && key !== 'detail') {
          if (Array.isArray(value)) {
            fieldErrors[key] = value;
          } else if (typeof value === 'string') {
            fieldErrors[key] = [value];
          }
        }
      }

      if (Object.keys(fieldErrors).length > 0) {
        details.fieldErrors = fieldErrors;
      }
    }
  }

  return details;
};

/**
 * Check if error is an Axios error
 */
export const isAxiosError = (error: unknown): error is AxiosError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
};

/**
 * Extract error message from Axios error
 */
const extractAxiosErrorMessage = (error: AxiosError): string => {
  const responseData = error.response?.data;

  // Handle different error response formats
  if (responseData && typeof responseData === 'object') {
    // Check for common error message fields
    if ('error' in responseData && typeof responseData.error === 'string') {
      return responseData.error;
    }
    
    if ('message' in responseData && typeof responseData.message === 'string') {
      return responseData.message;
    }
    
    if ('detail' in responseData && typeof responseData.detail === 'string') {
      return responseData.detail;
    }

    // Handle field-specific errors
    const fieldErrors: string[] = [];
    for (const [key, value] of Object.entries(responseData)) {
      if (key !== 'error' && key !== 'message' && key !== 'detail') {
        if (Array.isArray(value)) {
          fieldErrors.push(`${key}: ${value.join(', ')}`);
        } else if (typeof value === 'string') {
          fieldErrors.push(`${key}: ${value}`);
        }
      }
    }

    if (fieldErrors.length > 0) {
      return fieldErrors.join('; ');
    }
  }

  // Fallback to HTTP status messages
  if (error.response?.status) {
    const statusMessages: Record<number, string> = {
      400: 'Invalid request. Please check your input.',
      401: 'You are not authorized. Please log in.',
      403: 'You do not have permission to perform this action.',
      404: 'The requested resource was not found.',
      409: 'A conflict occurred. Please try again.',
      422: 'Validation error. Please check your input.',
      429: 'Too many requests. Please try again later.',
      500: 'Server error. Please try again later.',
      502: 'Service temporarily unavailable. Please try again later.',
      503: 'Service unavailable. Please try again later.',
    };

    return statusMessages[error.response.status] || `Request failed with status ${error.response.status}`;
  }

  // Network errors
  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Please check your connection and try again.';
  }

  if (error.code === 'ERR_NETWORK' || !error.response) {
    return 'Network error. Please check your connection and try again.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (isAxiosError(error)) {
    return !error.response || error.code === 'ERR_NETWORK';
  }
  return false;
};

/**
 * Check if error is a timeout error
 */
export const isTimeoutError = (error: unknown): boolean => {
  if (isAxiosError(error)) {
    return error.code === 'ECONNABORTED';
  }
  return false;
};

/**
 * Check if error is a 4xx client error
 */
export const isClientError = (error: unknown): boolean => {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    return status !== undefined && status >= 400 && status < 500;
  }
  return false;
};

/**
 * Check if error is a 5xx server error
 */
export const isServerError = (error: unknown): boolean => {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    return status !== undefined && status >= 500 && status < 600;
  }
  return false;
};

/**
 * Format field errors for display
 */
export const formatFieldErrors = (fieldErrors: Record<string, string[]>): string => {
  return Object.entries(fieldErrors)
    .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
    .join('; ');
};











