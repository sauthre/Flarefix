'use client'

import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  loading?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = 'px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-amber-500 hover:bg-amber-600 text-black',
    secondary: 'bg-[#1a2235] hover:bg-[#2d3748] text-white border border-[#2d3748]',
    outline: 'border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
