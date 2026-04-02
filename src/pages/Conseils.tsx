import { useState } from 'react'
import { conseilsAgricoles } from '../data/mockData'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Badge from '../components/UI/Badge'
import { Lightbulb, Search, ChevronDown, ChevronUp, Share2, Bookmark } from 'lucide-react'

const CATEGORIES = [
  { id: 'tous', nom: 'Tous', icone: '📋' },
  { id: 'Volaille', nom: 'Volaille', icone: '🐔' },
  { id: 'Culture', nom: 'Culture', icone: '🌾' },
  { id: 'Santé', nom: 'Santé', icone: '💉' },
  { id: 'Conservation', nom: 'Conservation', icone: '📦' },
  { id: 'Engrais', nom: 'Engrais', icone: '🍂' },
]

const DIFFICULTES: Record<string, { label: string; couleur: 'success' | 'warning' | 'danger' }> = {
  facile: { label: 'Facile', couleur: 'success' },
  moyen: { label: 'Moyen', couleur: 'warning' },
  difficile: { label: 'Avancé', couleur: 'danger' },
}

export default function Conseils() {
  const [categorieFilter, setCategorieFilter] = useState('tous')
  const [difficulteFilter, setDifficulteFilter] = useState('tous')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [favoris, setFavoris] = useState<number[]>([])

  const conseilsFiltres = conseilsAgricoles.filter(c => {
    const matchCat = categorieFilter === 'tous' || c.categorie === categorieFilter
    const matchDiff = difficulteFilter === 'tous' || c.difficulte === difficulteFilter
    const matchSearch = c.titre.toLowerCase().includes(searchQuery.toLowerCase()) || c.contenu.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchDiff && matchSearch
  })

  const toggleFavori = (id: number) => setFavoris(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  const conseilDuJour = conseilsAgricoles[0]

  return (
    <div className="space-y-5 pb-28">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">💡 Conseils agricoles</h1>
        <Lightbulb className="w-6 h-6 text-amber-500" />
      </div>

      <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-0">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">{conseilDuJour.icone}</div>
          <div>
            <Badge className="bg-white/20 text-white mb-2">Conseil du jour</Badge>
            <h3 className="font-bold text-lg">{conseilDuJour.titre}</h3>
          </div>
        </div>
        <p className="text-green-100 leading-relaxed">{conseilDuJour.contenu}</p>
        <div className="flex gap-2 mt-4">
          <Button variant="secondary" size="sm" className="bg-white/20 text-white border-0 hover:bg-white/30"><Share2 className="w-4 h-4" />Partager</Button>
          <Button variant="secondary" size="sm" className="bg-white/20 text-white border-0 hover:bg-white/30"><Bookmark className="w-4 h-4" />Sauvegarder</Button>
        </div>
      </Card>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher un conseil..." className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:border-green-500 outline-none" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button key={cat.id} onClick={() => setCategorieFilter(cat.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${categorieFilter===cat.id?'bg-green-600 text-white':'bg-white border border-stone-200 text-stone-600'}`}>
            <span>{cat.icone}</span>{cat.nom}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-stone-500">Difficulté :</span>
        {['tous','facile','moyen','difficile'].map((diff) => (
          <button key={diff} onClick={() => setDifficulteFilter(diff)} className={`px-3 py-1 rounded-full text-xs font-medium ${difficulteFilter===diff?'bg-stone-800 text-white':'bg-stone-100 text-stone-600'}`}>
            {diff==='tous'?'Tous':DIFFICULTES[diff]?.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {conseilsFiltres.map((conseil) => {
          const isExpanded = expandedId === conseil.id
          const isFavori = favoris.includes(conseil.id)
          const difficulte = DIFFICULTES[conseil.difficulte]
          return (
            <Card key={conseil.id} className="animate-slide-up">
              <div className="flex items-start gap-3 cursor-pointer" onClick={() => setExpandedId(isExpanded?null:conseil.id)}>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">{conseil.icone}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={difficulte.couleur}>{difficulte.label}</Badge>
                    <span className="text-xs text-stone-400">{conseil.categorie}</span>
                  </div>
                  <h4 className="font-semibold text-stone-800">{conseil.titre}</h4>
                  {isExpanded && (
                    <div className="mt-3 animate-fade-in">
                      <p className="text-sm text-stone-600 leading-relaxed">{conseil.contenu}</p>
                      <div className="flex gap-2 mt-3">
                        <Button variant="ghost" size="sm" onClick={() => toggleFavori(conseil.id)}>
                          <Bookmark className={`w-4 h-4 ${isFavori?'fill-green-600 text-green-600':''}`} />{isFavori?'Sauvegardé':'Sauvegarder'}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => window.dispatchEvent(new CustomEvent('robbie-message',{detail:{text:'✅ Conseil partagé !',type:'success'}}))}>
                          <Share2 className="w-4 h-4" />Partager
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <button className="text-stone-400">{isExpanded?<ChevronUp className="w-5 h-5" />:<ChevronDown className="w-5 h-5" />}</button>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-amber-200 rounded-xl flex items-center justify-center text-2xl">🎓</div>
          <div>
            <h3 className="font-semibold text-stone-800">Formations gratuites</h3>
            <p className="text-sm text-stone-500">Apprenez de nouvelles techniques</p>
          </div>
        </div>
        {['Aviculture moderne','Culture du maïs intensif','Gestion financière'].map((f,i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg mb-2">
            <span className="text-sm text-stone-700">{f}</span>
            <Button variant="primary" size="sm">Voir</Button>
          </div>
        ))}
      </Card>
    </div>
  )
}
