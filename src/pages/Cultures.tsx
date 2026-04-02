import { useState } from 'react'
import { 
  Sprout, 
  Plus, 
  Calendar, 
  Droplets, 
  TrendingUp,
  MoreVertical,
  Trash2,
  Edit3
} from 'lucide-react'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Badge from '../components/UI/Badge'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/UI/Dialog'

interface Culture {
  id: string
  nom: string
  type: 'cereal' | 'legume' | 'racine' | 'fruit' | 'autre'
  surface: number
  unite: 'ha' | 'm2' | 'ac'
  datePlantation: string
  dateRecoltePrevue: string
  statut: 'planifie' | 'en_cours' | 'croissance' | 'recolte' | 'termine'
  rendementPrevu: number
  notes: string
  arrosage: 'quotidien' | 'hebdo' | 'pluie' | 'irrigation'
  dernierArrosage: string
}

const typesCulture = [
  { id: 'cereal', nom: 'Céréale', icon: '🌾' },
  { id: 'legume', nom: 'Légume', icon: '🥬' },
  { id: 'racine', nom: 'Culture racine', icon: '🥔' },
  { id: 'fruit', nom: 'Fruit', icon: '🍌' },
  { id: 'autre', nom: 'Autre', icon: '🌱' },
]

const statutsCulture = {
  planifie: { label: 'Planifié', color: 'default' as const },
  en_cours: { label: 'En plantation', color: 'warning' as const },
  croissance: { label: 'En croissance', color: 'info' as const },
  recolte: { label: 'Récolte', color: 'primary' as const },
  termine: { label: 'Terminé', color: 'success' as const },
}

export default function Cultures() {
  const [cultures, setCultures] = useLocalStorage<Culture[]>('agro_cultures', [
    {
      id: '1',
      nom: 'Maïs',
      type: 'cereal',
      surface: 2,
      unite: 'ha',
      datePlantation: '2024-03-15',
      dateRecoltePrevue: '2024-07-15',
      statut: 'croissance',
      rendementPrevu: 4500,
      notes: 'Variété améliorée, bonne germination',
      arrosage: 'pluie',
      dernierArrosage: '2024-03-20'
    },
    {
      id: '2',
      nom: 'Haricots',
      type: 'legume',
      surface: 0.5,
      unite: 'ha',
      datePlantation: '2024-02-01',
      dateRecoltePrevue: '2024-05-01',
      statut: 'recolte',
      rendementPrevu: 1200,
      notes: 'Première récolte partielle effectuée',
      arrosage: 'hebdo',
      dernierArrosage: '2024-04-15'
    },
    {
      id: '3',
      nom: 'Manioc',
      type: 'racine',
      surface: 1,
      unite: 'ha',
      datePlantation: '2024-01-10',
      dateRecoltePrevue: '2024-10-10',
      statut: 'croissance',
      rendementPrevu: 8000,
      notes: 'Culture en bonne santé',
      arrosage: 'pluie',
      dernierArrosage: '2024-03-18'
    }
  ])

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingCulture, setEditingCulture] = useState<Culture | null>(null)
  const [showMenuFor, setShowMenuFor] = useState<string | null>(null)

  const [formData, setFormData] = useState<Partial<Culture>>({
    type: 'cereal',
    unite: 'ha',
    statut: 'planifie',
    arrosage: 'pluie'
  })

  const handleSave = () => {
    if (!formData.nom || !formData.surface) return

    if (editingCulture) {
      setCultures(prev => prev.map(c => c.id === editingCulture.id ? { ...c, ...formData } as Culture : c))
    } else {
      const newCulture: Culture = {
        id: Date.now().toString(),
        nom: formData.nom!,
        type: formData.type as Culture['type'],
        surface: formData.surface!,
        unite: formData.unite as Culture['unite'],
        datePlantation: formData.datePlantation || new Date().toISOString().split('T')[0],
        dateRecoltePrevue: formData.dateRecoltePrevue || '',
        statut: formData.statut as Culture['statut'],
        rendementPrevu: formData.rendementPrevu || 0,
        notes: formData.notes || '',
        arrosage: formData.arrosage as Culture['arrosage'],
        dernierArrosage: formData.dernierArrosage || new Date().toISOString().split('T')[0]
      }
      setCultures(prev => [...prev, newCulture])
    }

    setShowAddDialog(false)
    setEditingCulture(null)
    setFormData({ type: 'cereal', unite: 'ha', statut: 'planifie', arrosage: 'pluie' })
  }

  const handleDelete = (id: string) => {
    setCultures(prev => prev.filter(c => c.id !== id))
    setShowMenuFor(null)
  }

  const handleEdit = (culture: Culture) => {
    setEditingCulture(culture)
    setFormData(culture)
    setShowAddDialog(true)
    setShowMenuFor(null)
  }

  const getProgress = (culture: Culture) => {
    if (!culture.datePlantation || !culture.dateRecoltePrevue) return 0
    const start = new Date(culture.datePlantation).getTime()
    const end = new Date(culture.dateRecoltePrevue).getTime()
    const now = Date.now()
    const progress = ((now - start) / (end - start)) * 100
    return Math.min(Math.max(progress, 0), 100)
  }

  const getDaysUntilHarvest = (culture: Culture) => {
    if (!culture.dateRecoltePrevue) return null
    const days = Math.ceil((new Date(culture.dateRecoltePrevue).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  const totalSurface = cultures.reduce((sum, c) => sum + c.surface, 0)
  const readyForHarvest = cultures.filter(c => c.statut === 'recolte').length

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
            <Sprout className="w-7 h-7 text-green-600" />
            Mes Cultures
          </h1>
          <p className="text-stone-500">Gérez vos champs et plantations</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Ajouter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{cultures.length}</p>
          <p className="text-xs text-stone-500">Cultures</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{totalSurface.toFixed(1)}</p>
          <p className="text-xs text-stone-500">Ha total</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{readyForHarvest}</p>
          <p className="text-xs text-stone-500">À récolter</p>
        </Card>
      </div>

      {/* Cultures List */}
      <div className="space-y-3">
        {cultures.length === 0 ? (
          <Card className="p-8 text-center">
            <Sprout className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-stone-600 mb-2">Aucune culture enregistrée</h3>
            <p className="text-stone-500 mb-4">Commencez par ajouter votre première culture</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Ajouter une culture
            </Button>
          </Card>
        ) : (
          cultures.map((culture) => {
            const progress = getProgress(culture)
            const daysUntil = getDaysUntilHarvest(culture)
            const typeInfo = typesCulture.find(t => t.id === culture.type)
            
            return (
              <Card key={culture.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                      {typeInfo?.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-stone-800">{culture.nom}</h3>
                        <Badge variant={statutsCulture[culture.statut].color}>
                          {statutsCulture[culture.statut].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-stone-500">
                        {culture.surface} {culture.unite} • Plantation: {new Date(culture.datePlantation).toLocaleDateString('fr-FR')}
                      </p>
                      {daysUntil !== null && daysUntil > 0 && (
                        <p className="text-xs text-amber-600 mt-1">
                          🌾 Récolte dans {daysUntil} jours
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setShowMenuFor(showMenuFor === culture.id ? null : culture.id)}
                      className="p-2 hover:bg-stone-100 rounded-lg"
                    >
                      <MoreVertical className="w-4 h-4 text-stone-400" />
                    </button>
                    {showMenuFor === culture.id && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-stone-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                        <button 
                          onClick={() => handleEdit(culture)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:bg-stone-100"
                        >
                          <Edit3 className="w-4 h-4" />
                          Modifier
                        </button>
                        <button 
                          onClick={() => handleDelete(culture.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {culture.statut !== 'termine' && culture.dateRecoltePrevue && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-stone-500">Progression</span>
                      <span className="font-medium text-stone-700">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-stone-100">
                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="text-stone-600 capitalize">{culture.arrosage}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-stone-600">{culture.rendementPrevu} kg</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <span className="text-stone-600">
                      {culture.dateRecoltePrevue ? new Date(culture.dateRecoltePrevue).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }) : '-'}
                    </span>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCulture ? 'Modifier la culture' : 'Nouvelle culture'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Nom de la culture</label>
              <input
                type="text"
                value={formData.nom || ''}
                onChange={e => setFormData({ ...formData, nom: e.target.value })}
                placeholder="Ex: Maïs, Haricots..."
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as Culture['type'] })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {typesCulture.map(t => (
                  <option key={t.id} value={t.id}>{t.icon} {t.nom}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Surface</label>
                <input
                  type="number"
                  value={formData.surface || ''}
                  onChange={e => setFormData({ ...formData, surface: parseFloat(e.target.value) })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Unité</label>
                <select
                  value={formData.unite}
                  onChange={e => setFormData({ ...formData, unite: e.target.value as Culture['unite'] })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="ha">Hectares (ha)</option>
                  <option value="m2">Mètres carrés (m²)</option>
                  <option value="ac">Acres</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Date plantation</label>
                <input
                  type="date"
                  value={formData.datePlantation || ''}
                  onChange={e => setFormData({ ...formData, datePlantation: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Date récolte prévue</label>
                <input
                  type="date"
                  value={formData.dateRecoltePrevue || ''}
                  onChange={e => setFormData({ ...formData, dateRecoltePrevue: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Statut</label>
              <select
                value={formData.statut}
                onChange={e => setFormData({ ...formData, statut: e.target.value as Culture['statut'] })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="planifie">Planifié</option>
                <option value="en_cours">En plantation</option>
                <option value="croissance">En croissance</option>
                <option value="recolte">Récolte</option>
                <option value="termine">Terminé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Rendement prévu (kg)</label>
              <input
                type="number"
                value={formData.rendementPrevu || ''}
                onChange={e => setFormData({ ...formData, rendementPrevu: parseFloat(e.target.value) })}
                placeholder="0"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Arrosage</label>
              <select
                value={formData.arrosage}
                onChange={e => setFormData({ ...formData, arrosage: e.target.value as Culture['arrosage'] })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="quotidien">Quotidien</option>
                <option value="hebdo">Hebdomadaire</option>
                <option value="pluie">Pluie naturelle</option>
                <option value="irrigation">Irrigation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Notes</label>
              <textarea
                value={formData.notes || ''}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Informations complémentaires..."
                rows={3}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowAddDialog(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {editingCulture ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
