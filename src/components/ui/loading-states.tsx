'use client';

import { useState } from 'react';
import { PageLoader, SectionLoader, InlineLoader } from './loader';

// Hook for simple loading states
export function useSimpleLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return {
    isLoading,
    startLoading,
    stopLoading,
    setLoading: setIsLoading
  };
}

// Component for conditional rendering with loading
export function LoadingState({ 
  isLoading, 
  children, 
  loader = <SectionLoader />,
  fallback 
}: {
  isLoading: boolean;
  children: React.ReactNode;
  loader?: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  if (isLoading) {
    return <>{loader}</>;
  }

  if (fallback && !children) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Button with loading state
export function LoadingButton({
  isLoading,
  children,
  loadingText = 'Loading...',
  ...props
}: {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? (
        <InlineLoader size="sm" text={loadingText} />
      ) : (
        children
      )}
    </button>
  );
}