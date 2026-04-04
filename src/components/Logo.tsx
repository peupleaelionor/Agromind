interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  variant?: 'light' | 'dark' | 'color'
}

export default function Logo({ size = 'md', showText = true, variant = 'color' }: LogoProps) {
  const sizes = {
    sm: { container: 32, icon: 16 },
    md: { container: 40, icon: 20 },
    lg: { container: 56, icon: 28 },
    xl: { container: 80, icon: 40 }
  }

  const { container, icon } = sizes[size]

  const bgColors = {
    light: 'bg-white',
    dark: 'bg-stone-800',
    color: 'bg-gradient-to-br from-green-500 via-green-600 to-emerald-700'
  }

  const textColors = {
    light: 'text-stone-800',
    dark: 'text-white',
    color: 'text-stone-800'
  }

  return (
    <div className="flex items-center gap-2">
      <div 
        className={`${bgColors[variant]} rounded-xl flex items-center justify-center shadow-lg`}
        style={{ width: container, height: container }}
      >
        <svg 
          width={icon} 
          height={icon} 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* RDC Map silhouette */}
          <path 
            d="M24 4L28 8L32 6L36 10L34 14L38 18L36 22L40 26L38 30L36 34L32 38L28 42L24 44L20 42L16 38L12 34L10 30L8 26L12 22L10 18L14 14L12 10L16 6L20 8L24 4Z" 
            fill={variant === 'color' ? '#ffffff' : '#22c55e'}
            fillOpacity="0.9"
          />
          {/* Plant/Leaf symbol */}
          <path 
            d="M24 12C24 12 20 16 20 22C20 28 24 36 24 36C24 36 28 28 28 22C28 16 24 12 24 12Z" 
            fill={variant === 'color' ? '#ffffff' : '#16a34a'}
          />
          <circle cx="24" cy="10" r="3" fill={variant === 'color' ? '#fbbf24' : '#f59e0b'} />
          {/* Roots */}
          <path 
            d="M24 36V42M24 42L20 46M24 42L28 46" 
            stroke={variant === 'color' ? '#ffffff' : '#16a34a'}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold leading-tight ${size === 'sm' ? 'text-base' : size === 'md' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-3xl'} ${textColors[variant]}`}>
            AgroMind
          </span>
          <span className={`text-[10px] font-semibold tracking-wider ${variant === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
            PROJET NATIONAL RDC 🇨🇩
          </span>
        </div>
      )}
    </div>
  )
}
