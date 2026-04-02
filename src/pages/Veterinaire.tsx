import { useState } from 'react'
import { 
  Stethoscope, 
  Plus, 
  Calendar, 
  Syringe,
  AlertCircle,
  CheckCircle2,
  HeartPulse,
  Edit3,
  Search
} from 'lucide-react'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Badge from '../components/UI/Badge'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/UI/Dialog'

interface Animal {
  id: string
  nom: string
  espece: 'poule' | 'coq' | 'canard' | 'lapin' | 'chevre' | 'mouton' | 'porc' | 'vache' | 'autre'
  identifiant: string
  dateNaissance: string
  poids: number
  etat: 'excellent' | 'bon' | 'moyen' | 'faible' | 'malade'
  notes: string
}

interface Soin {
  id: string
  animalId: string
  date: string
  type: 'vaccination' | 'traitement' | 'vermifuge' | 'consultation' | 'autre'
  description: string
  produit: string
  dosage: string
  veterinaire: string
  cout: number
  prochainRdv: string
}

const especes = [
  { id: 'poule', nom: 'Poule', icon: '🐔' },
  { id: 'coq', nom: 'Coq', icon: '🐓' },
  { id: 'canard', nom: 'Canard', icon: '🦆' },
  { id: 'lapin', nom: 'Lapin', icon: '🐰' },
  { id: 'chevre', nom: 'Chèvre', icon: '🐐' },
  { id: 'mouton', nom: 'Mouton', icon: '🐑' },
  { id: 'porc', nom: 'Porc', icon: '🐷' },
  { id: 'vache', nom: 'Vache', icon: '🐄' },
  { id: 'autre', nom: 'Autre', icon: '🐾' },
]

const etatsSante = {
  excellent: { label: 'Excellent', color: 'success' as const },
  bon: { label: 'Bon', color: 'info' as const },
  moyen: { label: 'Moyen', color: 'warning' as const },
  faible: { label: 'Faible', color: 'secondary' as const },
  malade: { label: 'Malade', color: 'danger' as const },
}

const typesSoin = [
  { id: 'vaccination', nom: 'Vaccination', icon: '💉' },
  { id: 'traitement', nom: 'Traitement', icon: '💊' },
  { id: 'vermifuge', nom: 'Vermifuge', icon: '🐛' },
  { id: 'consultation', nom: 'Consultation', icon: '👨‍⚕️' },
  { id: 'autre', nom: 'Autre', icon: '📝' },
]

export default function Veterinaire() {
  const [animaux, setAnimaux] = useLocalStorage<Animal[]>('agro_animaux', [
    {
      id: '1',
      nom: 'Coco',
      espece: 'poule',
      identifiant: 'P-001',
      dateNaissance: '2023-06-15',
      poids: 2.1,
      etat: 'bon',
      notes: 'Pondeuse régulière'
    },
    {
      id: '2',
      nom: 'Rex',
      espece: 'lapin',
      identifiant: 'L-001',
      dateNaissance: '2023-08-20',
      poids: 3.5,
      etat: 'excellent',
      notes: 'Reproducteur'
    }
  ])

  const [soins, setSoins] = useLocalStorage<Soin[]>('agro_soins', [
    {
      id: '1',
      animalId: '1',
      date: '2024-03-01',
      type: 'vaccination',
      description: 'Vaccination contre la maladie de Newcastle',
      produit: 'Nobilis ND',
      dosage: '0.5ml',
      veterinaire: 'Dr. Kabongo',
      cout: 5000,
      prochainRdv: '2024-09-01'
    }
  ])

  const [activeTab, setActiveTab] = useState<'animaux' | 'soins' | 'calendrier'>('animaux')
  const [showAddAnimal, setShowAddAnimal] = useState(false)
  const [showAddSoin, setShowAddSoin] = useState(false)
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [animalForm, setAnimalForm] = useState<Partial<Animal>>({
    espece: 'poule',
    etat: 'bon'
  })

  const [soinForm, setSoinForm] = useState<Partial<Soin>>({
    type: 'vaccination',
    animalId: ''
  })

  const handleSaveAnimal = () => {
    if (!animalForm.nom) return

    if (editingAnimal) {
      setAnimaux(prev => prev.map(a => a.id === editingAnimal.id ? { ...a, ...animalForm } as Animal : a))
    } else {
      const newAnimal: Animal = {
        id: Date.now().toString(),
        nom: animalForm.nom!,
        espece: animalForm.espece as Animal['espece'],
        identifiant: animalForm.identifiant || `A-${Date.now()}`,
        dateNaissance: animalForm.dateNaissance || new Date().toISOString().split('T')[0],
        poids: animalForm.poids || 0,
        etat: animalForm.etat as Animal['etat'],
        notes: animalForm.notes || ''
      }
      setAnimaux(prev => [...prev, newAnimal])
    }

    setShowAddAnimal(false)
    setEditingAnimal(null)
    setAnimalForm({ espece: 'poule', etat: 'bon' })
  }

  const handleSaveSoin = () => {
    if (!soinForm.animalId || !soinForm.description) return

    const newSoin: Soin = {
      id: Date.now().toString(),
      animalId: soinForm.animalId,
      date: soinForm.date || new Date().toISOString().split('T')[0],
      type: soinForm.type as Soin['type'],
      description: soinForm.description,
      produit: soinForm.produit || '',
      dosage: soinForm.dosage || '',
      veterinaire: soinForm.veterinaire || '',
      cout: soinForm.cout || 0,
      prochainRdv: soinForm.prochainRdv || ''
    }

    setSoins(prev => [...prev, newSoin])
    setShowAddSoin(false)
    setSoinForm({ type: 'vaccination', animalId: '' })
  }

  const filteredAnimaux = animaux.filter(a => 
    a.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.identifiant.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const animauxMalades = animaux.filter(a => a.etat === 'malade').length
  const totalAnimaux = animaux.length
  const soinsAVenir = soins.filter(s => s.prochainRdv && new Date(s.prochainRdv) > new Date()).length

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
            <Stethoscope className="w-7 h-7 text-rose-600" />
            Vétérinaire
          </h1>
          <p className="text-stone-500">Santé animale et soins</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{totalAnimaux}</p>
          <p className="text-xs text-stone-500">Animaux</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-rose-600">{animauxMalades}</p>
          <p className="text-xs text-stone-500">Malades</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{soinsAVenir}</p>
          <p className="text-xs text-stone-500">Rendez-vous</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-stone-100 p-1 rounded-xl">
        {[
          { id: 'animaux', label: 'Animaux', icon: HeartPulse },
          { id: 'soins', label: 'Soins', icon: Syringe },
          { id: 'calendrier', label: 'Calendrier', icon: Calendar },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Add */}
      {activeTab === 'animaux' && (
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher un animal..."
              className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <Button onClick={() => setShowAddAnimal(true)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      )}

      {activeTab === 'soins' && (
        <Button onClick={() => setShowAddSoin(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Enregistrer un soin
        </Button>
      )}

      {/* Content */}
      {activeTab === 'animaux' && (
        <div className="space-y-3">
          {filteredAnimaux.length === 0 ? (
            <Card className="p-8 text-center">
              <HeartPulse className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-stone-600 mb-2">Aucun animal enregistré</h3>
              <Button onClick={() => setShowAddAnimal(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Ajouter un animal
              </Button>
            </Card>
          ) : (
            filteredAnimaux.map((animal) => {
              const especeInfo = especes.find(e => e.id === animal.espece)
              const soinsAnimal = soins.filter(s => s.animalId === animal.id)
              
              return (
                <Card key={animal.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-2xl">
                        {especeInfo?.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-stone-800">{animal.nom}</h3>
                          <Badge variant={etatsSante[animal.etat].color}>
                            {etatsSante[animal.etat].label}
                          </Badge>
                        </div>
                        <p className="text-sm text-stone-500">
                          {especeInfo?.nom} • {animal.identifiant}
                        </p>
                        <p className="text-xs text-stone-400 mt-1">
                          {animal.poids} kg • Né(e) le {new Date(animal.dateNaissance).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setEditingAnimal(animal)}
                      className="p-2 hover:bg-stone-100 rounded-lg"
                    >
                      <Edit3 className="w-4 h-4 text-stone-400" />
                    </button>
                  </div>

                  {soinsAnimal.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-stone-100">
                      <p className="text-xs font-medium text-stone-500 mb-2">Derniers soins</p>
                      <div className="space-y-1">
                        {soinsAnimal.slice(0, 2).map((soin) => (
                          <div key={soin.id} className="flex items-center gap-2 text-sm">
                            <span>{typesSoin.find(t => t.id === soin.type)?.icon}</span>
                            <span className="text-stone-600">{soin.description}</span>
                            <span className="text-xs text-stone-400">
                              {new Date(soin.date).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              )
            })
          )}
        </div>
      )}

      {activeTab === 'soins' && (
        <div className="space-y-3">
          {soins.length === 0 ? (
            <Card className="p-8 text-center">
              <Syringe className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-stone-600 mb-2">Aucun soin enregistré</h3>
            </Card>
          ) : (
            soins.map((soin) => {
              const animal = animaux.find(a => a.id === soin.animalId)
              return (
                <Card key={soin.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-lg">
                      {typesSoin.find(t => t.id === soin.type)?.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-stone-800">{soin.description}</h3>
                        <span className="text-sm font-medium text-green-600">{soin.cout} FC</span>
                      </div>
                      <p className="text-sm text-stone-500">
                        {animal?.nom} • {new Date(soin.date).toLocaleDateString('fr-FR')}
                      </p>
                      {soin.produit && (
                        <p className="text-xs text-stone-400 mt-1">
                          Produit: {soin.produit} {soin.dosage && `(${soin.dosage})`}
                        </p>
                      )}
                      {soin.prochainRdv && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                          <Calendar className="w-3 h-3" />
                          Prochain RDV: {new Date(soin.prochainRdv).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      )}

      {activeTab === 'calendrier' && (
        <div className="space-y-3">
          <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <h3 className="font-semibold text-amber-800 flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5" />
              Rendez-vous à venir
            </h3>
            {soins.filter(s => s.prochainRdv && new Date(s.prochainRdv) > new Date()).length === 0 ? (
              <p className="text-sm text-amber-600">Aucun rendez-vous programmé</p>
            ) : (
              <div className="space-y-2">
                {soins
                  .filter(s => s.prochainRdv && new Date(s.prochainRdv) > new Date())
                  .sort((a, b) => new Date(a.prochainRdv!).getTime() - new Date(b.prochainRdv!).getTime())
                  .map((soin) => {
                    const animal = animaux.find(a => a.id === soin.animalId)
                    const daysLeft = Math.ceil((new Date(soin.prochainRdv!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    return (
                      <div key={soin.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                        <div>
                          <p className="font-medium text-stone-800">{soin.description}</p>
                          <p className="text-sm text-stone-500">{animal?.nom}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-amber-600">
                            {daysLeft === 0 ? 'Aujourd\'hui' : `J-${daysLeft}`}
                          </p>
                          <p className="text-xs text-stone-400">
                            {new Date(soin.prochainRdv!).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold text-stone-800 mb-3">Conseils de santé</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-stone-600">Vacciner les poussins contre la maladie de Newcastle à 2-3 semaines</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-stone-600">Vermifuger tous les 3 mois pour préserver la santé digestive</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-stone-600">Isoler immédiatement les animaux malades</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add Animal Dialog */}
      <Dialog open={showAddAnimal} onOpenChange={setShowAddAnimal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAnimal ? 'Modifier l\'animal' : 'Nouvel animal'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Nom</label>
              <input
                type="text"
                value={animalForm.nom || ''}
                onChange={e => setAnimalForm({ ...animalForm, nom: e.target.value })}
                placeholder="Ex: Coco"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Espèce</label>
              <select
                value={animalForm.espece}
                onChange={e => setAnimalForm({ ...animalForm, espece: e.target.value as Animal['espece'] })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {especes.map(e => (
                  <option key={e.id} value={e.id}>{e.icon} {e.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Identifiant</label>
              <input
                type="text"
                value={animalForm.identifiant || ''}
                onChange={e => setAnimalForm({ ...animalForm, identifiant: e.target.value })}
                placeholder="Ex: P-001"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Date de naissance</label>
                <input
                  type="date"
                  value={animalForm.dateNaissance || ''}
                  onChange={e => setAnimalForm({ ...animalForm, dateNaissance: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Poids (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={animalForm.poids || ''}
                  onChange={e => setAnimalForm({ ...animalForm, poids: parseFloat(e.target.value) })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">État de santé</label>
              <select
                value={animalForm.etat}
                onChange={e => setAnimalForm({ ...animalForm, etat: e.target.value as Animal['etat'] })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="excellent">Excellent</option>
                <option value="bon">Bon</option>
                <option value="moyen">Moyen</option>
                <option value="faible">Faible</option>
                <option value="malade">Malade</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Notes</label>
              <textarea
                value={animalForm.notes || ''}
                onChange={e => setAnimalForm({ ...animalForm, notes: e.target.value })}
                placeholder="Informations complémentaires..."
                rows={3}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowAddAnimal(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSaveAnimal} className="flex-1">
              {editingAnimal ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Soin Dialog */}
      <Dialog open={showAddSoin} onOpenChange={setShowAddSoin}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enregistrer un soin</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Animal</label>
              <select
                value={soinForm.animalId}
                onChange={e => setSoinForm({ ...soinForm, animalId: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Sélectionner un animal</option>
                {animaux.map(a => (
                  <option key={a.id} value={a.id}>
                    {especes.find(e => e.id === a.espece)?.icon} {a.nom} ({a.identifiant})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Type de soin</label>
              <select
                value={soinForm.type}
                onChange={e => setSoinForm({ ...soinForm, type: e.target.value as Soin['type'] })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {typesSoin.map(t => (
                  <option key={t.id} value={t.id}>{t.icon} {t.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
              <input
                type="text"
                value={soinForm.description || ''}
                onChange={e => setSoinForm({ ...soinForm, description: e.target.value })}
                placeholder="Ex: Vaccination contre..."
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Produit utilisé</label>
              <input
                type="text"
                value={soinForm.produit || ''}
                onChange={e => setSoinForm({ ...soinForm, produit: e.target.value })}
                placeholder="Ex: Nobilis ND"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Dosage</label>
                <input
                  type="text"
                  value={soinForm.dosage || ''}
                  onChange={e => setSoinForm({ ...soinForm, dosage: e.target.value })}
                  placeholder="Ex: 0.5ml"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Coût (FC)</label>
                <input
                  type="number"
                  value={soinForm.cout || ''}
                  onChange={e => setSoinForm({ ...soinForm, cout: parseFloat(e.target.value) })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Date</label>
                <input
                  type="date"
                  value={soinForm.date || ''}
                  onChange={e => setSoinForm({ ...soinForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Prochain RDV</label>
                <input
                  type="date"
                  value={soinForm.prochainRdv || ''}
                  onChange={e => setSoinForm({ ...soinForm, prochainRdv: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Vétérinaire</label>
              <input
                type="text"
                value={soinForm.veterinaire || ''}
                onChange={e => setSoinForm({ ...soinForm, veterinaire: e.target.value })}
                placeholder="Nom du vétérinaire"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowAddSoin(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSaveSoin} className="flex-1">
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
