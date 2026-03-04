import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export default function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = 'px-6 py-2.5 font-normal text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-black text-white hover:bg-[#333333] border border-black',
    secondary: 'bg-white text-black border border-black hover:bg-black hover:text-white',
    ghost: 'text-black hover:bg-gray-50 border border-transparent'
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
