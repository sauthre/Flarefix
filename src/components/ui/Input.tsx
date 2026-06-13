import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-400">{label}</label>}
      <input
        className={`bg-[#111827] border border-[#2d3748] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-colors ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
