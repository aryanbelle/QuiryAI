'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

export function Loader({ size = 'md', className, text }: LoaderProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
        {text && (
          <p className="text-sm text-muted-foreground">{text}</p>
        )}
      </div>
    </div>
  );
}

// Full page loader
export function PageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader size="lg" text={text} />
    </div>
  );
}

// Section loader
export function SectionLoader({ text, className }: { text?: string; className?: string }) {
  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      <Loader size="md" text={text} />
    </div>
  );
}

// Inline loader
export function InlineLoader({ size = 'sm', text }: { size?: 'sm' | 'md'; text?: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}