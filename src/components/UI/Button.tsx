import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  to?: string
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  icon?: LucideIcon
}

export default function Button({ 
  children, onClick, to, variant = 'primary', size = 'md', className = '', disabled = false, icon: Icon
}: ButtonProps) {
  const variants = {
    primary: 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/25',
    secondary: 'bg-stone-100 text-stone-700 hover:bg-stone-200',
    accent: 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/25',
    outline: 'border-2 border-green-600 text-green-600 hover:bg-green-50',
    ghost: 'text-stone-600 hover:bg-stone-100',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  }
  const sizes = { sm: 'px-4 py-2 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-8 py-4 text-base' }
  const baseClass = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`

  if (to) return <Link to={to} className={baseClass}>{Icon && <Icon className="w-4 h-4" />}{children}</Link>
  return <button onClick={onClick} disabled={disabled} className={baseClass}>{Icon && <Icon className="w-4 h-4" />}{children}</button>
}
