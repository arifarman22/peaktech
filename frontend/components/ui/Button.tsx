import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export default function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = 'px-6 py-2.5 rounded-md font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white hover:from-[#4338CA] hover:to-[#6D28D9] shadow-sm hover:shadow-md',
    secondary: 'bg-white text-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-gray-50',
    ghost: 'text-[var(--color-primary)] hover:bg-gray-100'
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
