"use client";

import React from 'react';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const Spinner = ({ className = '', ...props }: SpinnerProps) => {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 ${className}`}
      {...props}
    />
  );
}; 