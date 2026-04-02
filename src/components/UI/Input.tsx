interface InputProps {
  label?: string
  type?: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
  min?: number
  max?: number
  step?: string | number
}

export default function Input({ label, type = 'text', value, onChange, placeholder, className = '', ...props }: InputProps) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 bg-white text-stone-800 placeholder-stone-400 transition-all focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none"
        {...props}
      />
    </div>
  )
}
