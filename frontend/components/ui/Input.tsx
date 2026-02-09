import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export default function Input({ error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        className={`w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all ${error ? 'border-[var(--color-destructive)] focus:ring-[var(--color-destructive)]' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-[var(--color-destructive)]">{error}</p>}
    </div>
  );
}
