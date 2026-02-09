import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div className={`bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-6 ${hover ? 'transition-shadow duration-300 hover:shadow-lg' : ''} ${className}`}>
      {children}
    </div>
  );
}
