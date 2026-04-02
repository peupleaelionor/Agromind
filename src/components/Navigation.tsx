import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Egg, 
  TrendingUp, 
  Lightbulb, 
  Calculator,
  Sprout,
  Stethoscope,
  Wallet,
  CheckSquare,
  Users
} from 'lucide-react'

const mainNavItems = [
  { to: '/', icon: Home, label: 'Accueil' },
  { to: '/poulailler', icon: Egg, label: 'Poulailler' },
  { to: '/cultures', icon: Sprout, label: 'Cultures' },
  { to: '/marche', icon: TrendingUp, label: 'Marché' },
]

const moreNavItems = [
  { to: '/veterinaire', icon: Stethoscope, label: 'Véto' },
  { to: '/finances', icon: Wallet, label: 'Finances' },
  { to: '/taches', icon: CheckSquare, label: 'Tâches' },
  { to: '/conseils', icon: Lightbulb, label: 'Conseils' },
  { to: '/communaute', icon: Users, label: 'Communauté' },
  { to: '/calculatrice', icon: Calculator, label: 'Outils' },
]

export default function Navigation() {
  const location = useLocation()
  const isMorePage = moreNavItems.some(item => item.to === location.pathname)

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-40">
      {/* Main Navigation */}
      <div className="max-w-5xl mx-auto px-2 py-2">
        <div className="flex justify-around items-center">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/25' 
                    : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
          
          {/* More Menu */}
          <Link
            to="/menu"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              isMorePage || location.pathname === '/menu'
                ? 'bg-green-600 text-white shadow-lg shadow-green-600/25' 
                : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700'
            }`}
          >
            <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
              <div className={`w-2 h-2 rounded-sm ${isMorePage || location.pathname === '/menu' ? 'bg-white' : 'bg-current'}`}></div>
              <div className={`w-2 h-2 rounded-sm ${isMorePage || location.pathname === '/menu' ? 'bg-white' : 'bg-current'}`}></div>
              <div className={`w-2 h-2 rounded-sm ${isMorePage || location.pathname === '/menu' ? 'bg-white' : 'bg-current'}`}></div>
              <div className={`w-2 h-2 rounded-sm ${isMorePage || location.pathname === '/menu' ? 'bg-white' : 'bg-current'}`}></div>
            </div>
            <span className="text-[10px] font-medium">Plus</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
