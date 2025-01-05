import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  className?: string;
}

export const Alert = ({ children, className }: AlertProps) => (
  <div className={`alert ${className}`}>
    {children}
  </div>
);

interface AlertTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const AlertTitle = ({ children, className }: AlertTitleProps) => (
  <h4 className={`alert-title ${className}`}>
    {children}
  </h4>
);

export const AlertDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="alert-description">
    {children}
  </p>
);