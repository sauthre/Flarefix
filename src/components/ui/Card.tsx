interface CardProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-[#1a2235] border border-[#2d3748] rounded-lg p-6 ${className}`}>
      {children}
    </div>
  )
}
