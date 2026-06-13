interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'error' | 'warning'
}

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-[#2d3748] text-gray-300',
    success: 'bg-emerald-900 text-emerald-300',
    error: 'bg-red-900 text-red-300',
    warning: 'bg-amber-900 text-amber-300',
  }

  return (
    <span className={`text-xs px-2 py-1 rounded font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}
