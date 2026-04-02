import { Link } from 'react-router-dom'
import { 
  Stethoscope,
  Wallet,
  CheckSquare,
  Lightbulb,
  Users,
  Calculator,
  ChevronRight,
  Building2,
  Newspaper,
  CloudSun,
  BookOpen,
  Phone,
  HandHeart
} from 'lucide-react'
import Card from '../components/UI/Card'

const menuSections = [
  {
    title: 'Partage & Solidarité',
    items: [
      { to: '/partage', icon: HandHeart, label: 'Partage de Récoltes', desc: 'Partagez vos surplus entre voisins', color: 'bg-emerald-100 text-emerald-600' },
    ]
  },
  {
    title: 'Gestion',
    items: [
      { to: '/veterinaire', icon: Stethoscope, label: 'Vétérinaire', desc: 'Santé animale & vaccins', color: 'bg-rose-100 text-rose-600' },
      { to: '/finances', icon: Wallet, label: 'Finances', desc: 'Revenus & dépenses', color: 'bg-emerald-100 text-emerald-600' },
      { to: '/taches', icon: CheckSquare, label: 'Tâches', desc: 'Rappels & planning', color: 'bg-blue-100 text-blue-600' },
    ]
  },
  {
    title: 'Ressources',
    items: [
      { to: '/conseils', icon: Lightbulb, label: 'Conseils', desc: 'Astuces agricoles', color: 'bg-amber-100 text-amber-600' },
      { to: '/calculatrice', icon: Calculator, label: 'Outils', desc: 'Calculateurs & conversions', color: 'bg-purple-100 text-purple-600' },
      { to: '/meteo', icon: CloudSun, label: 'Météo', desc: 'Prévisions 7 jours', color: 'bg-sky-100 text-sky-600' },
    ]
  },
  {
    title: 'Communauté',
    items: [
      { to: '/communaute', icon: Users, label: 'Communauté', desc: 'Échangez avec d\'autres', color: 'bg-indigo-100 text-indigo-600' },
      { to: '/actualites', icon: Newspaper, label: 'Actualités', desc: 'News agricoles RDC', color: 'bg-orange-100 text-orange-600' },
    ]
  },
  {
    title: 'Informations',
    items: [
      { to: '/programmes', icon: Building2, label: 'Programmes', desc: 'Aides gouvernementales', color: 'bg-teal-100 text-teal-600' },
      { to: '/formation', icon: BookOpen, label: 'Formation', desc: 'Cours & guides', color: 'bg-cyan-100 text-cyan-600' },
      { to: '/contacts', icon: Phone, label: 'Contacts', desc: 'Services agricoles', color: 'bg-lime-100 text-lime-600' },
    ]
  }
]

export default function Menu() {
  return (
    <div className="space-y-6 pb-24">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-stone-800">Toutes les fonctionnalités</h1>
        <p className="text-stone-500">Accédez à tous les outils AgroMind RDC 🇨🇩</p>
      </div>

      {menuSections.map((section) => (
        <div key={section.title}>
          <h2 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-3 px-1">
            {section.title}
          </h2>
          <div className="space-y-2">
            {section.items.map((item) => (
              <Link key={item.to} to={item.to}>
                <Card className="flex items-center gap-4 p-4 hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-stone-800">{item.label}</h3>
                    <p className="text-sm text-stone-500">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400 flex-shrink-0" />
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
