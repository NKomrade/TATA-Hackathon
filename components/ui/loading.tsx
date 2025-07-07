'use client';

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn(
      "relative",
      sizeClasses[size],
      className
    )}>
      <div className="absolute inset-0 rounded-full border-2 border-slate-200"></div>
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin"></div>
    </div>
  );
};

interface LoadingDotsProps {
  className?: string;
}

const LoadingDots = ({ className }: LoadingDotsProps) => {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.1s]"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
    </div>
  );
};

export { LoadingSpinner, LoadingDots };