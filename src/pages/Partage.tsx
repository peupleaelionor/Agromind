import { useState } from 'react'
import {
  HandHeart,
  Plus,
  MapPin,
  Phone,
  Clock,
  Package,
  Users,
  TrendingUp,
  Search,
  Send,
  CheckCircle,
  Star,
  Home,
  Leaf,
  Globe2
} from 'lucide-react'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Badge from '../components/UI/Badge'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/UI/Dialog'

interface Foyer {
  id: string
  nom: string
  adresse: string
  region: string
  telephone: string
  dateInscription: string
  actif: boolean
  surplusDisponible: SurplusItem[]
  note: number
  partagesEffectues: number
}

interface SurplusItem {
  id: string
  produit: string
  quantite: number
  unite: string
  dateDisponible: string
  icone: string
  foyerId: string
  foyerNom: string
  region: string
  statut: 'disponible' | 'reserve' | 'collecte'
}

const mockFoyers: Foyer[] = [
  {
    id: '1', nom: 'Famille Kabongo', adresse: 'Avenue Kasa-Vubu, Kinshasa', region: 'Kinshasa',
    telephone: '+243 81 234 5678', dateInscription: '2026-01-15', actif: true, note: 4.8,
    partagesEffectues: 23,
    surplusDisponible: [
      { id: 's1', produit: 'Manioc', quantite: 15, unite: 'kg', dateDisponible: '2026-04-02', icone: '🥔', foyerId: '1', foyerNom: 'Famille Kabongo', region: 'Kinshasa', statut: 'disponible' },
      { id: 's2', produit: 'Tomates', quantite: 8, unite: 'kg', dateDisponible: '2026-04-02', icone: '🍅', foyerId: '1', foyerNom: 'Famille Kabongo', region: 'Kinshasa', statut: 'disponible' },
    ]
  },
  {
    id: '2', nom: 'Famille Mutombo', adresse: 'Boulevard du 30 Juin, Lubumbashi', region: 'Lubumbashi',
    telephone: '+243 99 876 5432', dateInscription: '2026-02-01', actif: true, note: 4.5,
    partagesEffectues: 15,
    surplusDisponible: [
      { id: 's3', produit: 'Maïs', quantite: 25, unite: 'kg', dateDisponible: '2026-04-01', icone: '🌽', foyerId: '2', foyerNom: 'Famille Mutombo', region: 'Lubumbashi', statut: 'disponible' },
      { id: 's4', produit: 'Haricots', quantite: 10, unite: 'kg', dateDisponible: '2026-04-02', icone: '🫘', foyerId: '2', foyerNom: 'Famille Mutombo', region: 'Lubumbashi', statut: 'reserve' },
    ]
  },
  {
    id: '3', nom: 'Famille Tshisekedi', adresse: 'Rue Lumumba, Goma', region: 'Goma',
    telephone: '+243 85 123 4567', dateInscription: '2026-03-01', actif: true, note: 4.9,
    partagesEffectues: 31,
    surplusDisponible: [
      { id: 's5', produit: 'Bananes plantain', quantite: 20, unite: 'régimes', dateDisponible: '2026-04-02', icone: '🍌', foyerId: '3', foyerNom: 'Famille Tshisekedi', region: 'Goma', statut: 'disponible' },
      { id: 's6', produit: 'Avocats', quantite: 30, unite: 'pièces', dateDisponible: '2026-04-01', icone: '🥑', foyerId: '3', foyerNom: 'Famille Tshisekedi', region: 'Goma', statut: 'disponible' },
    ]
  },
  {
    id: '4', nom: 'Famille Lukaku', adresse: 'Avenue de la Paix, Bukavu', region: 'Bukavu',
    telephone: '+243 82 345 6789', dateInscription: '2026-02-20', actif: true, note: 4.3,
    partagesEffectues: 12,
    surplusDisponible: [
      { id: 's7', produit: 'Œufs', quantite: 60, unite: 'pièces', dateDisponible: '2026-04-02', icone: '🥚', foyerId: '4', foyerNom: 'Famille Lukaku', region: 'Bukavu', statut: 'disponible' },
    ]
  },
  {
    id: '5', nom: 'Famille Olomide', adresse: 'Quartier Matonge, Kinshasa', region: 'Kinshasa',
    telephone: '+243 81 567 8901', dateInscription: '2026-01-28', actif: true, note: 4.6,
    partagesEffectues: 18,
    surplusDisponible: [
      { id: 's8', produit: 'Légumes verts', quantite: 12, unite: 'kg', dateDisponible: '2026-04-02', icone: '🥬', foyerId: '5', foyerNom: 'Famille Olomide', region: 'Kinshasa', statut: 'disponible' },
      { id: 's9', produit: 'Piment', quantite: 5, unite: 'kg', dateDisponible: '2026-04-02', icone: '🌶️', foyerId: '5', foyerNom: 'Famille Olomide', region: 'Kinshasa', statut: 'disponible' },
    ]
  }
]

const statsGlobales = {
  foyersInscrits: 1247,
  surplusPartages: 8540,
  tonnesSauvees: 42.3,
  regionsActives: 8,
  paysAfrique: 3,
}

export default function Partage() {
  const [foyers, setFoyers] = useLocalStorage<Foyer[]>('agro_foyers_partage', mockFoyers)
  const [activeTab, setActiveTab] = useState<'surplus' | 'foyers' | 'inscription'>('surplus')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRegion, setFilterRegion] = useState('tous')
  const [showInscription, setShowInscription] = useState(false)
  const [newFoyer, setNewFoyer] = useState({ nom: '', adresse: '', region: 'kinshasa', telephone: '' })

  const allSurplus = foyers.flatMap(f => f.surplusDisponible)
  const filteredSurplus = allSurplus.filter(s => {
    const matchSearch = s.produit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.foyerNom.toLowerCase().includes(searchQuery.toLowerCase())
    const matchRegion = filterRegion === 'tous' || s.region.toLowerCase() === filterRegion.toLowerCase()
    return matchSearch && matchRegion && s.statut === 'disponible'
  })

  const regions = ['tous', 'Kinshasa', 'Lubumbashi', 'Goma', 'Bukavu', 'Kisangani', 'Matadi', 'Kananga', 'Mbuji-Mayi']

  const handleReserver = (surplusId: string) => {
    setFoyers(prev => prev.map(f => ({
      ...f,
      surplusDisponible: f.surplusDisponible.map(s =>
        s.id === surplusId ? { ...s, statut: 'reserve' as const } : s
      )
    })))
  }

  const handleInscription = () => {
    if (!newFoyer.nom.trim() || !newFoyer.adresse.trim() || !newFoyer.telephone.trim()) return
    const regionName = regions.find(r => r.toLowerCase() === newFoyer.region) || 'Kinshasa'
    const nouveau: Foyer = {
      id: Date.now().toString(),
      nom: newFoyer.nom,
      adresse: newFoyer.adresse,
      region: regionName,
      telephone: newFoyer.telephone,
      dateInscription: new Date().toISOString(),
      actif: true,
      note: 5.0,
      partagesEffectues: 0,
      surplusDisponible: []
    }
    setFoyers(prev => [...prev, nouveau])
    setNewFoyer({ nom: '', adresse: '', region: 'kinshasa', telephone: '' })
    setShowInscription(false)
    setActiveTab('foyers')
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Hero Section */}
      <Card className="bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 text-white border-0 p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <HandHeart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">Partage de Récoltes</h1>
            <p className="text-green-100 text-sm leading-relaxed">
              Système solidaire de partage de surplus agricoles entre voisins.
              Moins de pertes, meilleure circulation des aliments — pour la RDC 🇨🇩, l'Afrique et le monde entier.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <Home className="w-5 h-5 mx-auto mb-1 text-green-200" />
            <p className="text-xl font-bold">{statsGlobales.foyersInscrits.toLocaleString()}</p>
            <p className="text-[10px] text-green-200">Foyers inscrits</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <Package className="w-5 h-5 mx-auto mb-1 text-green-200" />
            <p className="text-xl font-bold">{statsGlobales.surplusPartages.toLocaleString()}</p>
            <p className="text-[10px] text-green-200">Surplus partagés</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <Leaf className="w-5 h-5 mx-auto mb-1 text-green-200" />
            <p className="text-xl font-bold">{statsGlobales.tonnesSauvees}</p>
            <p className="text-[10px] text-green-200">Tonnes sauvées</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <Globe2 className="w-5 h-5 mx-auto mb-1 text-green-200" />
            <p className="text-xl font-bold">{statsGlobales.regionsActives}</p>
            <p className="text-[10px] text-green-200">Régions actives</p>
          </div>
        </div>
      </Card>

      {/* Vision Card */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 p-4">
        <div className="flex gap-3">
          <div className="text-3xl">🌍</div>
          <div>
            <h3 className="font-semibold text-stone-800 mb-1">Notre Vision</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Chaque foyer qui le souhaite peut s'inscrire pour partager ses surplus de récoltes avec ses voisins.
              Ensemble, réduisons les pertes alimentaires et assurons une meilleure circulation des aliments
              nécessaires au monde — en commençant par la RDC, puis toute l'Afrique, puis le monde entier.
            </p>
          </div>
        </div>
      </Card>

      {/* CTA Button */}
      <Button onClick={() => setShowInscription(true)} className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-lg py-4">
        <Plus className="w-5 h-5 mr-2" />
        Inscrire mon foyer au partage
      </Button>

      {/* Tabs */}
      <div className="flex gap-2 bg-stone-100 p-1 rounded-xl">
        {[
          { key: 'surplus' as const, label: 'Surplus disponibles' },
          { key: 'foyers' as const, label: 'Foyers inscrits' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'surplus' && (
        <>
          {/* Search & Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit ou un foyer..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:border-green-500 outline-none"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {regions.map(r => (
                <button
                  key={r}
                  onClick={() => setFilterRegion(r)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    filterRegion === r
                      ? 'bg-green-600 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {r === 'tous' ? '🌐 Tous' : `📍 ${r}`}
                </button>
              ))}
            </div>
          </div>

          {/* Surplus List */}
          <div className="space-y-3">
            {filteredSurplus.length === 0 ? (
              <Card className="p-8 text-center">
                <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500">Aucun surplus disponible pour le moment</p>
                <p className="text-xs text-stone-400 mt-1">Revenez bientôt ou inscrivez votre foyer !</p>
              </Card>
            ) : (
              filteredSurplus.map(surplus => (
                <Card key={surplus.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                        {surplus.icone}
                      </div>
                      <div>
                        <h3 className="font-semibold text-stone-800">{surplus.produit}</h3>
                        <p className="text-sm text-stone-500">
                          {surplus.quantite} {surplus.unite}
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">Disponible</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-stone-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Home className="w-3 h-3" /> {surplus.foyerNom}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {surplus.region}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(surplus.dateDisponible).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleReserver(surplus.id)}
                      variant="primary"
                      size="sm"
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Réserver
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'foyers' && (
        <div className="space-y-3">
          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-green-800">Réseau de partage</h3>
            </div>
            <p className="text-sm text-green-700 mb-2">
              {foyers.length} foyers inscrits dans le système de partage de récoltes.
              Chaque foyer contribue à réduire les pertes alimentaires.
            </p>
            <div className="flex items-center gap-2 text-xs text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+23% de foyers ce mois-ci</span>
            </div>
          </Card>

          {foyers.map(foyer => (
            <Card key={foyer.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-stone-800">{foyer.nom}</h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                    <MapPin className="w-3 h-3" /> {foyer.adresse}
                  </div>
                </div>
                <a
                  href={`tel:${foyer.telephone}`}
                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < Math.floor(foyer.note) ? 'text-amber-400 fill-current' : 'text-stone-300'}`}
                    />
                  ))}
                  <span className="text-xs text-stone-500 ml-1">{foyer.note}</span>
                </div>
                <span className="text-xs text-stone-500">
                  <HandHeart className="w-3 h-3 inline mr-1" />
                  {foyer.partagesEffectues} partages
                </span>
                <Badge variant={foyer.actif ? 'success' : 'default'} className="text-[10px]">
                  {foyer.actif ? 'Actif' : 'Inactif'}
                </Badge>
              </div>

              {foyer.surplusDisponible.length > 0 && (
                <div className="mt-3 pt-3 border-t border-stone-100">
                  <p className="text-xs font-medium text-stone-600 mb-2">Surplus disponibles :</p>
                  <div className="flex flex-wrap gap-2">
                    {foyer.surplusDisponible.map(s => (
                      <span
                        key={s.id}
                        className={`text-xs px-2 py-1 rounded-full ${
                          s.statut === 'disponible'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {s.icone} {s.produit} ({s.quantite} {s.unite})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Impact Section */}
      <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <h3 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-blue-600" />
          Impact & Expansion
        </h3>
        <div className="space-y-3 text-sm text-stone-600">
          <div className="flex items-start gap-3">
            <span className="text-xl">🇨🇩</span>
            <div>
              <p className="font-semibold text-stone-800">Phase 1 — RDC (Projet National)</p>
              <p>Déploiement dans les 26 provinces. Objectif : 100 000 foyers inscrits d'ici 2027.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">🌍</span>
            <div>
              <p className="font-semibold text-stone-800">Phase 2 — Afrique</p>
              <p>Extension aux pays voisins : Congo-Brazzaville, Angola, Zambie, Rwanda, Burundi, Ouganda.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">🌐</span>
            <div>
              <p className="font-semibold text-stone-800">Phase 3 — Monde</p>
              <p>Modèle open-source réplicable partout. Agriculture entre voisins, pour tous.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Inscription Dialog */}
      <Dialog open={showInscription} onOpenChange={setShowInscription}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              <span className="flex items-center gap-2">
                <HandHeart className="w-5 h-5 text-green-600" />
                Inscrire mon foyer
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-stone-500">
              Inscrivez votre foyer pour partager vos surplus de récoltes avec vos voisins et contribuer
              à réduire les pertes alimentaires en RDC.
            </p>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Nom du foyer *</label>
              <input
                type="text"
                value={newFoyer.nom}
                onChange={e => setNewFoyer({ ...newFoyer, nom: e.target.value })}
                placeholder="Ex: Famille Kabongo"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Adresse *</label>
              <input
                type="text"
                value={newFoyer.adresse}
                onChange={e => setNewFoyer({ ...newFoyer, adresse: e.target.value })}
                placeholder="Ex: Avenue Kasa-Vubu, Kinshasa"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Région</label>
              <select
                value={newFoyer.region}
                onChange={e => setNewFoyer({ ...newFoyer, region: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {regions.filter(r => r !== 'tous').map(r => (
                  <option key={r} value={r.toLowerCase()}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Téléphone *</label>
              <input
                type="tel"
                value={newFoyer.telephone}
                onChange={e => setNewFoyer({ ...newFoyer, telephone: e.target.value })}
                placeholder="+243 81 234 5678"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowInscription(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleInscription} className="flex-1">
              <Send className="w-4 h-4 mr-2" />
              S'inscrire
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
