import { 
  Newspaper, 
  Calendar, 
  Clock,
  Share2,
  Bookmark,
  TrendingUp,
  AlertCircle,
  Info
} from 'lucide-react'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Badge from '../components/UI/Badge'

interface Actualite {
  id: string
  titre: string
  resume: string
  contenu: string
  categorie: 'marche' | 'politique' | 'technique' | 'evenement' | 'urgence'
  date: string
  source: string
  lu: boolean
  important: boolean
}

const actualites: Actualite[] = [
  {
    id: '1',
    titre: 'Hausse des prix du maïs à Kinshasa',
    resume: 'Les prix du maïs ont augmenté de 15% ce mois-ci suite à une pénurie temporaire.',
    contenu: 'Les marchés de Kinshasa enregistrent une hausse significative des prix du maïs...',
    categorie: 'marche',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: 'AgroMind RDC',
    lu: false,
    important: true
  },
  {
    id: '2',
    titre: 'Nouveau programme de subventions agricoles',
    resume: 'Le gouvernement annonce un nouveau programme d\'aide aux agriculteurs.',
    contenu: 'Le Ministère de l\'Agriculture a lancé un programme de subventions...',
    categorie: 'politique',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    source: 'Ministère Agriculture',
    lu: false,
    important: true
  },
  {
    id: '3',
    titre: 'Journée portes ouvertes à l\'INERA',
    resume: 'Venez découvrir les nouvelles variétés de semences améliorées.',
    contenu: 'L\'INERA organise une journée portes ouvertes le 15 mars...',
    categorie: 'evenement',
    date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    source: 'INERA RDC',
    lu: true,
    important: false
  },
  {
    id: '4',
    titre: 'Alerte: Maladie de Newcastle détectée dans le Kasaï',
    resume: 'Les éleveurs sont invités à renforcer la vaccination de leurs volailles.',
    contenu: 'Des cas de maladie de Newcastle ont été signalés dans plusieurs villages...',
    categorie: 'urgence',
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    source: 'Service Vétérinaire',
    lu: false,
    important: true
  },
  {
    id: '5',
    titre: 'Technique: Irrigation au goutte-à-goutte',
    resume: 'Comment économiser l\'eau tout en maximisant vos rendements.',
    contenu: 'L\'irrigation au goutte-à-goutte est une technique qui permet...',
    categorie: 'technique',
    date: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    source: 'AgroMind RDC',
    lu: true,
    important: false
  }
]

const categories = {
  marche: { label: 'Marché', icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
  politique: { label: 'Politique', icon: Info, color: 'bg-purple-100 text-purple-600' },
  technique: { label: 'Technique', icon: Info, color: 'bg-green-100 text-green-600' },
  evenement: { label: 'Événement', icon: Calendar, color: 'bg-amber-100 text-amber-600' },
  urgence: { label: 'Urgence', icon: AlertCircle, color: 'bg-red-100 text-red-600' },
}

export default function Actualites() {
  const formatDate = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) return 'À l\'instant'
    if (hours < 24) return `Il y a ${hours}h`
    if (days < 7) return `Il y a ${days}j`
    return d.toLocaleDateString('fr-FR')
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
          <Newspaper className="w-7 h-7 text-orange-600" />
          Actualités
        </h1>
        <p className="text-stone-500">Restez informé sur l'actualité agricole</p>
      </div>

      {/* Breaking News */}
      {actualites.filter(a => a.important && !a.lu).length > 0 && (
        <Card className="p-4 bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Alertes importantes</h3>
          </div>
          <div className="space-y-2">
            {actualites.filter(a => a.important && !a.lu).map((news) => (
              <div key={news.id} className="flex items-start gap-2 text-sm">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></span>
                <span className="text-red-700">{news.titre}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* News List */}
      <div className="space-y-4">
        {actualites.map((news) => {
          const catInfo = categories[news.categorie]
          
          return (
            <Card key={news.id} className={`p-4 ${news.important ? 'border-l-4 border-l-red-500' : ''}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${catInfo.color}`}>
                  <catInfo.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="default" className="text-[10px]">
                          {catInfo.label}
                        </Badge>
                        {!news.lu && (
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        )}
                      </div>
                      <h3 className={`font-semibold ${news.lu ? 'text-stone-600' : 'text-stone-800'}`}>
                        {news.titre}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-sm text-stone-500 mt-1">{news.resume}</p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 text-xs text-stone-400">
                      <span>{news.source}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(news.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4 text-stone-400" />
                      </button>
                      <button className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors">
                        <Bookmark className="w-4 h-4 text-stone-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Load More */}
      <Button variant="secondary" className="w-full">
        Voir plus d'actualités
      </Button>
    </div>
  )
}
