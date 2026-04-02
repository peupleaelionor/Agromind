import { useState, useMemo } from 'react'
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  Clock,
  CheckCircle2,
  Trash2,
  Edit3,
  Bell,
  Repeat
} from 'lucide-react'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Badge from '../components/UI/Badge'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/UI/Dialog'

interface Tache {
  id: string
  titre: string
  description: string
  categorie: 'poulailler' | 'cultures' | 'veterinaire' | 'maintenance' | 'admin' | 'autre'
  priorite: 'basse' | 'moyenne' | 'haute' | 'urgente'
  dateEcheance: string
  heureEcheance?: string
  recurrent: boolean
  frequence?: 'quotidien' | 'hebdo' | 'mensuel' | 'annuel'
  complete: boolean
  rappel: boolean
}

const categories = [
  { id: 'poulailler', nom: 'Poulailler', icon: '🥚', color: 'bg-amber-100 text-amber-600' },
  { id: 'cultures', nom: 'Cultures', icon: '🌾', color: 'bg-green-100 text-green-600' },
  { id: 'veterinaire', nom: 'Vétérinaire', icon: '💉', color: 'bg-rose-100 text-rose-600' },
  { id: 'maintenance', nom: 'Maintenance', icon: '🛠️', color: 'bg-blue-100 text-blue-600' },
  { id: 'admin', nom: 'Administration', icon: '📋', color: 'bg-purple-100 text-purple-600' },
  { id: 'autre', nom: 'Autre', icon: '📝', color: 'bg-stone-100 text-stone-600' },
]

const priorites = {
  basse: { label: 'Basse', color: 'secondary' as const },
  moyenne: { label: 'Moyenne', color: 'info' as const },
  haute: { label: 'Haute', color: 'warning' as const },
  urgente: { label: 'Urgente', color: 'danger' as const },
}

const frequences = [
  { id: 'quotidien', nom: 'Quotidien' },
  { id: 'hebdo', nom: 'Hebdomadaire' },
  { id: 'mensuel', nom: 'Mensuel' },
  { id: 'annuel', nom: 'Annuel' },
]

export default function Taches() {
  const [taches, setTaches] = useLocalStorage<Tache[]>('agro_taches', [
    {
      id: '1',
      titre: 'Nourrir les poules',
      description: 'Distribuer l\'aliment et vérifier l\'eau',
      categorie: 'poulailler',
      priorite: 'haute',
      dateEcheance: new Date().toISOString().split('T')[0],
      heureEcheance: '08:00',
      recurrent: true,
      frequence: 'quotidien',
      complete: false,
      rappel: true
    },
    {
      id: '2',
      titre: 'Ramasser les œufs',
      description: 'Collecte matin et soir',
      categorie: 'poulailler',
      priorite: 'moyenne',
      dateEcheance: new Date().toISOString().split('T')[0],
      heureEcheance: '18:00',
      recurrent: true,
      frequence: 'quotidien',
      complete: false,
      rappel: true
    },
    {
      id: '3',
      titre: 'Vaccination rappel',
      description: 'Rappel vaccination Newcastle',
      categorie: 'veterinaire',
      priorite: 'urgente',
      dateEcheance: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      recurrent: false,
      complete: false,
      rappel: true
    },
    {
      id: '4',
      titre: 'Arroser le champ de maïs',
      description: 'Irrigation si pas de pluie',
      categorie: 'cultures',
      priorite: 'moyenne',
      dateEcheance: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      recurrent: true,
      frequence: 'hebdo',
      complete: false,
      rappel: false
    }
  ])

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingTache, setEditingTache] = useState<Tache | null>(null)
  const [filterCategorie, setFilterCategorie] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'a_faire' | 'completees'>('a_faire')

  const [formData, setFormData] = useState<Partial<Tache>>({
    categorie: 'poulailler',
    priorite: 'moyenne',
    recurrent: false,
    rappel: true,
    complete: false,
    dateEcheance: new Date().toISOString().split('T')[0]
  })

  const filteredTaches = useMemo(() => {
    let filtered = taches
    if (filterCategorie !== 'all') filtered = filtered.filter(t => t.categorie === filterCategorie)
    if (activeTab === 'a_faire') filtered = filtered.filter(t => !t.complete)
    if (activeTab === 'completees') filtered = filtered.filter(t => t.complete)
    return filtered.sort((a, b) => {
      // Sort by priority first
      const prioriteOrder = { urgente: 0, haute: 1, moyenne: 2, basse: 3 }
      if (prioriteOrder[a.priorite] !== prioriteOrder[b.priorite]) {
        return prioriteOrder[a.priorite] - prioriteOrder[b.priorite]
      }
      // Then by date
      return new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime()
    })
  }, [taches, filterCategorie, activeTab])

  const stats = useMemo(() => {
    const total = taches.length
    const completees = taches.filter(t => t.complete).length
    const urgentes = taches.filter(t => t.priorite === 'urgente' && !t.complete).length
    const aujourdHui = taches.filter(t => t.dateEcheance === new Date().toISOString().split('T')[0] && !t.complete).length
    return { total, completees, urgentes, aujourdHui }
  }, [taches])

  const handleSave = () => {
    if (!formData.titre) return

    if (editingTache) {
      setTaches(prev => prev.map(t => t.id === editingTache.id ? { ...t, ...formData } as Tache : t))
    } else {
      const newTache: Tache = {
        id: Date.now().toString(),
        titre: formData.titre!,
        description: formData.description || '',
        categorie: formData.categorie as Tache['categorie'],
        priorite: formData.priorite as Tache['priorite'],
        dateEcheance: formData.dateEcheance || new Date().toISOString().split('T')[0],
        heureEcheance: formData.heureEcheance,
        recurrent: formData.recurrent || false,
        frequence: formData.frequence as Tache['frequence'],
        complete: false,
        rappel: formData.rappel || false
      }
      setTaches(prev => [...prev, newTache])
    }

    setShowAddDialog(false)
    setEditingTache(null)
    setFormData({ categorie: 'poulailler', priorite: 'moyenne', recurrent: false, rappel: true, complete: false, dateEcheance: new Date().toISOString().split('T')[0] })
  }

  const toggleComplete = (id: string) => {
    setTaches(prev => prev.map(t => t.id === id ? { ...t, complete: !t.complete } : t))
  }

  const handleDelete = (id: string) => {
    setTaches(prev => prev.filter(t => t.id !== id))
  }

  const handleEdit = (tache: Tache) => {
    setEditingTache(tache)
    setFormData(tache)
    setShowAddDialog(true)
  }

  const getDaysLeft = (dateEcheance: string) => {
    const days = Math.ceil((new Date(dateEcheance).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Aujourd\'hui'
    if (days === 1) return 'Demain'
    if (days < 0) return `En retard (${Math.abs(days)}j)`
    return `J-${days}`
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
            <CheckSquare className="w-7 h-7 text-blue-600" />
            Tâches
          </h1>
          <p className="text-stone-500">Gérez vos tâches et rappels</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Ajouter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-[10px] text-stone-500">Total</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-green-600">{stats.completees}</p>
          <p className="text-[10px] text-stone-500">Faites</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-rose-600">{stats.urgentes}</p>
          <p className="text-[10px] text-stone-500">Urgentes</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-amber-600">{stats.aujourdHui}</p>
          <p className="text-[10px] text-stone-500">Aujourd'hui</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-stone-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('a_faire')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'a_faire'
              ? 'bg-white text-green-600 shadow-sm'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          À faire
        </button>
        <button
          onClick={() => setActiveTab('completees')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'completees'
              ? 'bg-white text-green-600 shadow-sm'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          Complétées
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterCategorie('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            filterCategorie === 'all'
              ? 'bg-green-600 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Toutes
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCategorie(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filterCategorie === cat.id
                ? 'bg-green-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {cat.icon} {cat.nom}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTaches.length === 0 ? (
          <Card className="p-8 text-center">
            <CheckSquare className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-stone-600 mb-2">
              {activeTab === 'a_faire' ? 'Aucune tâche à faire' : 'Aucune tâche complétée'}
            </h3>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Ajouter une tâche
            </Button>
          </Card>
        ) : (
          filteredTaches.map((tache) => {
            const categorie = categories.find(c => c.id === tache.categorie)
            const daysLeft = getDaysLeft(tache.dateEcheance)
            const isOverdue = daysLeft.includes('retard')
            
            return (
              <Card key={tache.id} className={`p-4 ${tache.complete ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleComplete(tache.id)}
                    className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      tache.complete
                        ? 'bg-green-500 border-green-500'
                        : 'border-stone-300 hover:border-green-500'
                    }`}
                  >
                    {tache.complete && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={`font-semibold text-stone-800 ${tache.complete ? 'line-through text-stone-400' : ''}`}>
                          {tache.titre}
                        </h3>
                        {tache.description && (
                          <p className={`text-sm ${tache.complete ? 'text-stone-400' : 'text-stone-500'}`}>
                            {tache.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleEdit(tache)}
                          className="p-1.5 hover:bg-stone-100 rounded-lg"
                        >
                          <Edit3 className="w-4 h-4 text-stone-400" />
                        </button>
                        <button 
                          onClick={() => handleDelete(tache.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${categorie?.color}`}>
                        {categorie?.icon} {categorie?.nom}
                      </span>
                      <Badge variant={priorites[tache.priorite].color} className="text-[10px]">
                        {priorites[tache.priorite].label}
                      </Badge>
                      {tache.recurrent && (
                        <span className="inline-flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                          <Repeat className="w-3 h-3" />
                          {frequences.find(f => f.id === tache.frequence)?.nom}
                        </span>
                      )}
                      {tache.rappel && (
                        <Bell className="w-3 h-3 text-amber-500" />
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : 'text-stone-500'}`}>
                        <Calendar className="w-3 h-3" />
                        {daysLeft}
                      </span>
                      {tache.heureEcheance && (
                        <span className="flex items-center gap-1 text-stone-500">
                          <Clock className="w-3 h-3" />
                          {tache.heureEcheance}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTache ? 'Modifier la tâche' : 'Nouvelle tâche'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Titre</label>
              <input
                type="text"
                value={formData.titre || ''}
                onChange={e => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Ex: Nourrir les poules"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Détails de la tâche..."
                rows={2}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Catégorie</label>
                <select
                  value={formData.categorie}
                  onChange={e => setFormData({ ...formData, categorie: e.target.value as Tache['categorie'] })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Priorité</label>
                <select
                  value={formData.priorite}
                  onChange={e => setFormData({ ...formData, priorite: e.target.value as Tache['priorite'] })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="basse">Basse</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="haute">Haute</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Date d'échéance</label>
                <input
                  type="date"
                  value={formData.dateEcheance}
                  onChange={e => setFormData({ ...formData, dateEcheance: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Heure (optionnel)</label>
                <input
                  type="time"
                  value={formData.heureEcheance || ''}
                  onChange={e => setFormData({ ...formData, heureEcheance: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.recurrent}
                  onChange={e => setFormData({ ...formData, recurrent: e.target.checked })}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-stone-700">Tâche récurrente</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rappel}
                  onChange={e => setFormData({ ...formData, rappel: e.target.checked })}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-stone-700">Rappel</span>
              </label>
            </div>

            {formData.recurrent && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Fréquence</label>
                <select
                  value={formData.frequence}
                  onChange={e => setFormData({ ...formData, frequence: e.target.value as Tache['frequence'] })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  {frequences.map(f => (
                    <option key={f.id} value={f.id}>{f.nom}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowAddDialog(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {editingTache ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
