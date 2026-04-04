import { useState, useEffect } from 'react'
import { mockPrix, categoriesProduits, historiquePrix } from '../data/mockData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Badge from '../components/UI/Badge'
import { TrendingUp, TrendingDown, Search, Bell, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Marche() {
  const [region] = useLocalStorage('agro_region', 'kinshasa')
  const [categorieFilter, setCategorieFilter] = useState('tous')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduit, setSelectedProduit] = useState<typeof mockPrix.kinshasa[0] | null>(null)
  const [showAlertModal, setShowAlertModal] = useState(false)

  const produits = mockPrix[region] || mockPrix.kinshasa
  const produitsFiltres = produits.filter(p => {
    const matchCat = categorieFilter === 'tous' || p.categorie === categorieFilter
    const matchSearch = p.produit.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  const prixMoyen = produits.reduce((a, p) => a + p.prix, 0) / produits.length
  const enHausse = produits.filter(p => p.variation.includes('+')).length
  const enBaisse = produits.filter(p => p.variation.includes('-')).length

  useEffect(() => {
    const varOeufs = produits.find(p => p.produit === 'Œufs')?.variation || '0%'
    if (varOeufs.includes('+')) {
      window.dispatchEvent(new CustomEvent('robbie-message', { detail: { text: `📈 Les œufs sont en hausse de ${varOeufs} ! Bon moment pour vendre.`, type: 'success' } }))
    }
  }, [region, produits])

  const getConseil = (p: typeof mockPrix.kinshasa[0]) => {
    if (p.variation.includes('+')) return { text: 'Bon moment pour vendre', icon: TrendingUp, color: 'text-green-600' }
    if (p.variation.includes('-')) return { text: 'Peut-être attendre', icon: TrendingDown, color: 'text-amber-600' }
    return { text: 'Prix stable', icon: TrendingUp, color: 'text-blue-600' }
  }

  return (
    <div className="space-y-5 pb-28">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">💰 Marché agricole</h1>
        <Button onClick={() => setShowAlertModal(true)} variant="outline" size="sm" icon={Bell}>Alertes</Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-green-50 border-green-200 p-4">
          <p className="text-xs text-stone-500 mb-1">En hausse</p>
          <p className="text-2xl font-bold text-green-600">{enHausse}</p>
          <TrendingUp className="w-4 h-4 text-green-600 mt-1" />
        </Card>
        <Card className="bg-red-50 border-red-200 p-4">
          <p className="text-xs text-stone-500 mb-1">En baisse</p>
          <p className="text-2xl font-bold text-red-600">{enBaisse}</p>
          <TrendingDown className="w-4 h-4 text-red-600 mt-1" />
        </Card>
        <Card className="bg-blue-50 border-blue-200 p-4">
          <p className="text-xs text-stone-500 mb-1">Prix moyen</p>
          <p className="text-xl font-bold text-blue-600">{Math.round(prixMoyen)}</p>
          <p className="text-[10px] text-stone-400">FC</p>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher un produit..." className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:border-green-500 outline-none" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categoriesProduits.map((cat) => (
          <button key={cat.id} onClick={() => setCategorieFilter(cat.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${categorieFilter===cat.id?'bg-green-600 text-white':'bg-white border border-stone-200 text-stone-600'}`}>
            <span>{cat.icone}</span>{cat.nom}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {produitsFiltres.map((produit, i) => {
          const conseil = getConseil(produit)
          const ConseilIcon = conseil.icon
          const isUp = produit.variation.includes('+')
          const isDown = produit.variation.includes('-')
          return (
            <Card key={i} hover onClick={() => setSelectedProduit(produit)} className="animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-2xl">
                    {categoriesProduits.find(c => c.id === produit.categorie)?.icone || '📦'}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800">{produit.produit}</p>
                    <p className="text-xs text-stone-500">{produit.unite}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-stone-800">{produit.prix.toLocaleString()} FC</p>
                  <Badge variant={isUp?'success':isDown?'danger':'default'}>{isUp&&<ArrowUpRight className="w-3 h-3"/>}{isDown&&<ArrowDownRight className="w-3 h-3"/>}{produit.variation}</Badge>
                </div>
              </div>
              <div className={`mt-3 flex items-center gap-2 text-xs ${conseil.color}`}>
                <ConseilIcon className="w-4 h-4" />
                <span className="font-medium">{conseil.text}</span>
              </div>
            </Card>
          )
        })}
      </div>

      {selectedProduit && (
        <Card className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-800">Évolution : {selectedProduit.produit}</h3>
            <button onClick={() => setSelectedProduit(null)} className="text-stone-400">✕</button>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historiquePrix.oeufs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="jour" tick={{fontSize:12}} />
                <YAxis tick={{fontSize:12}} />
                <Tooltip contentStyle={{borderRadius:12,border:'none',boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                <Line type="monotone" dataKey="prix" stroke="#16a34a" strokeWidth={3} dot={{fill:'#16a34a',r:4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {showAlertModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-stone-800">🛎️ Mes alertes prix</h3><button onClick={() => setShowAlertModal(false)}>✕</button></div>
            <p className="text-sm text-stone-500 mb-3">Recevez une notification quand les prix changent.</p>
            {[{l:'Œufs - Hausse +10%',a:true},{l:'Œufs - Baisse -5%',a:false},{l:'Maïs - Toute variation',a:true},{l:'Poulet - Hausse +5%',a:false}].map((alerte,i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg mb-2">
                <span className="text-sm text-stone-700">{alerte.l}</span>
                <button className={`w-12 h-6 rounded-full relative ${alerte.a?'bg-green-500':'bg-stone-300'}`}><span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${alerte.a?'left-7':'left-1'}`}/></button>
              </div>
            ))}
            <Button onClick={() => {setShowAlertModal(false);window.dispatchEvent(new CustomEvent('robbie-message',{detail:{text:'✅ Alertes mises à jour !',type:'success'}}))}} variant="primary" className="w-full mt-4">Enregistrer</Button>
          </Card>
        </div>
      )}
    </div>
  )
}
