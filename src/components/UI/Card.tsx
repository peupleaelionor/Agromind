import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({ children, className = '', hover = false, onClick }: CardProps) {
  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg border border-stone-200/50 p-5 transition-all duration-300 ${
        hover ? 'hover:shadow-xl hover:-translate-y-0.5 hover:border-green-300 cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
