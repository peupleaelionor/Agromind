import type { LucideIcon } from 'lucide-react'
import Card from './Card'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  color?: 'green' | 'orange' | 'blue' | 'red' | 'purple'
  onClick?: () => void
}

export default function StatCard({ title, value, subtitle, icon: Icon, trend, trendUp, color = 'green', onClick }: StatCardProps) {
  const colors = {
    green: 'bg-green-50 text-green-600',
    orange: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  }
  return (
    <Card hover={!!onClick} onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${colors[color]}`}><Icon className="w-5 h-5" /></div>
        {trend && <span className={`text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>{trendUp ? '↗' : '↘'} {trend}</span>}
      </div>
      <p className="text-2xl font-bold text-stone-800 mb-0.5">{value}</p>
      <p className="text-xs text-stone-500 font-medium">{title}</p>
      {subtitle && <p className="text-[10px] text-stone-400 mt-0.5">{subtitle}</p>}
    </Card>
  )
}
