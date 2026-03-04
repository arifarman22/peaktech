import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div className={`bg-white border border-[var(--color-border)] rounded-lg p-4 ${hover ? 'transition-shadow duration-200 hover:shadow-lg' : ''} ${className}`}>
      {children}
    </div>
  );
}
