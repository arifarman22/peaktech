import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div className={`bg-white border border-[var(--color-border)] p-6 ${hover ? 'transition-shadow duration-200 hover:shadow-sm' : ''} ${className}`}>
      {children}
    </div>
  );
}
