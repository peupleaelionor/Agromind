interface ProgressBarProps {
  value: number
  max?: number
  color?: 'green' | 'orange' | 'red' | 'blue'
  showValue?: boolean
}

export default function ProgressBar({ value, max = 100, color = 'green', showValue = true }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const colors = { green: 'bg-green-500', orange: 'bg-amber-500', red: 'bg-red-500', blue: 'bg-blue-500' }
  return (
    <div className="w-full">
      <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${colors[color]}`} style={{ width: `${percentage}%` }} />
      </div>
      {showValue && <div className="flex justify-between text-xs text-stone-500 mt-1"><span>{value}</span><span>{max}</span></div>}
    </div>
  )
}
