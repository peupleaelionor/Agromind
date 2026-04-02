import { useState, useMemo } from 'react'
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Download
} from 'lucide-react'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Badge from '../components/UI/Badge'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/UI/Dialog'
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface Transaction {
  id: string
  date: string
  type: 'revenu' | 'depense'
  categorie: string
  description: string
  montant: number
  methode: 'especes' | 'mobile' | 'banque' | 'autre'
}

const categoriesRevenu = [
  { id: 'vente_oeufs', nom: 'Vente d\'œufs', icon: '🥚' },
  { id: 'vente_poulets', nom: 'Vente de poulets', icon: '🐔' },
  { id: 'vente_cultures', nom: 'Vente de cultures', icon: '🌾' },
  { id: 'vente_lait', nom: 'Vente de lait', icon: '🥛' },
  { id: 'subvention', nom: 'Subvention', icon: '🏛️' },
  { id: 'autre_revenu', nom: 'Autre revenu', icon: '💰' },
]

const categoriesDepense = [
  { id: 'alimentation', nom: 'Alimentation', icon: '🌽' },
  { id: 'veterinaire', nom: 'Vétérinaire', icon: '💉' },
  { id: 'equipement', nom: 'Équipement', icon: '🛠️' },
  { id: 'main_oeuvre', nom: 'Main d\'œuvre', icon: '👷' },
  { id: 'transport', nom: 'Transport', icon: '🚚' },
  { id: 'semences', nom: 'Semences', icon: '🌱' },
  { id: 'engrais', nom: 'Engrais', icon: '⚗️' },
  { id: 'autre_depense', nom: 'Autre dépense', icon: '📝' },
]

const methodesPaiement = [
  { id: 'especes', nom: 'Espèces', icon: '💵' },
  { id: 'mobile', nom: 'Mobile Money', icon: '📱' },
  { id: 'banque', nom: 'Banque', icon: '🏦' },
  { id: 'autre', nom: 'Autre', icon: '💳' },
]

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

export default function Finances() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('agro_transactions', [
    {
      id: '1',
      date: '2024-03-15',
      type: 'revenu',
      categorie: 'vente_oeufs',
      description: 'Vente 50 œufs au marché',
      montant: 12500,
      methode: 'especes'
    },
    {
      id: '2',
      date: '2024-03-14',
      type: 'depense',
      categorie: 'alimentation',
      description: 'Achat aliment poules 50kg',
      montant: 35000,
      methode: 'mobile'
    },
    {
      id: '3',
      date: '2024-03-12',
      type: 'revenu',
      categorie: 'vente_poulets',
      description: 'Vente 10 poulets de chair',
      montant: 75000,
      methode: 'especes'
    },
    {
      id: '4',
      date: '2024-03-10',
      type: 'depense',
      categorie: 'veterinaire',
      description: 'Vaccination poulailler',
      montant: 15000,
      methode: 'mobile'
    }
  ])

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<'toutes' | 'revenus' | 'depenses'>('toutes')
  const [formData, setFormData] = useState<Partial<Transaction>>({
    type: 'revenu',
    date: new Date().toISOString().split('T')[0],
    methode: 'especes'
  })

  const filteredTransactions = useMemo(() => {
    let filtered = transactions
    if (activeTab === 'revenus') filtered = filtered.filter(t => t.type === 'revenu')
    if (activeTab === 'depenses') filtered = filtered.filter(t => t.type === 'depense')
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [transactions, activeTab])

  const stats = useMemo(() => {
    const revenus = transactions.filter(t => t.type === 'revenu').reduce((sum, t) => sum + t.montant, 0)
    const depenses = transactions.filter(t => t.type === 'depense').reduce((sum, t) => sum + t.montant, 0)
    const solde = revenus - depenses
    return { revenus, depenses, solde }
  }, [transactions])

  const chartData = useMemo(() => {
    const data: Record<string, number> = {}
    transactions.forEach(t => {
      const cat = [...categoriesRevenu, ...categoriesDepense].find(c => c.id === t.categorie)?.nom || t.categorie
      data[cat] = (data[cat] || 0) + t.montant
    })
    return Object.entries(data).map(([name, value]) => ({ name, value }))
  }, [transactions])

  const handleSave = () => {
    if (!formData.description || !formData.montant) return

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: formData.date || new Date().toISOString().split('T')[0],
      type: formData.type as Transaction['type'],
      categorie: formData.categorie || (formData.type === 'revenu' ? 'autre_revenu' : 'autre_depense'),
      description: formData.description,
      montant: formData.montant,
      methode: formData.methode as Transaction['methode']
    }

    setTransactions(prev => [...prev, newTransaction])
    setShowAddDialog(false)
    setFormData({ type: 'revenu', date: new Date().toISOString().split('T')[0], methode: 'especes' })
  }

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-CD', { style: 'currency', currency: 'CDF', maximumFractionDigits: 0 }).format(montant)
  }

  const exportData = () => {
    const csv = [
      ['Date', 'Type', 'Catégorie', 'Description', 'Montant', 'Méthode'].join(','),
      ...transactions.map(t => [
        t.date,
        t.type,
        t.categorie,
        `"${t.description}"`,
        t.montant,
        t.methode
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `agromind-finances-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
            <Wallet className="w-7 h-7 text-emerald-600" />
            Finances
          </h1>
          <p className="text-stone-500">Suivi des revenus et dépenses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={exportData}>
            <Download className="w-4 h-4" />
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Solde Card */}
      <Card className={`p-6 ${stats.solde >= 0 ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 'bg-gradient-to-br from-rose-500 to-rose-600'} text-white`}>
        <p className="text-emerald-100 text-sm mb-1">Solde actuel</p>
        <p className="text-4xl font-bold">{formatMontant(stats.solde)}</p>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-emerald-100">Revenus</p>
              <p className="font-semibold">{formatMontant(stats.revenus)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-emerald-100">Dépenses</p>
              <p className="font-semibold">{formatMontant(stats.depenses)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold text-stone-800 mb-4">Répartition par catégorie</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatMontant(value)} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-2 bg-stone-100 p-1 rounded-xl">
        {[
          { id: 'toutes', label: 'Toutes' },
          { id: 'revenus', label: 'Revenus' },
          { id: 'depenses', label: 'Dépenses' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <Card className="p-8 text-center">
            <Wallet className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-stone-600 mb-2">Aucune transaction</h3>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Ajouter une transaction
            </Button>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => {
            const categorie = [...categoriesRevenu, ...categoriesDepense].find(c => c.id === transaction.categorie)
            const methode = methodesPaiement.find(m => m.id === transaction.methode)
            const isRevenu = transaction.type === 'revenu'
            
            return (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                      isRevenu ? 'bg-emerald-100' : 'bg-rose-100'
                    }`}>
                      {categorie?.icon}
                    </div>
                    <div>
                      <p className="font-medium text-stone-800">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-sm text-stone-500">
                        <span>{categorie?.nom}</span>
                        <span>•</span>
                        <span>{new Date(transaction.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-stone-400 mt-1">
                        <span>{methode?.icon}</span>
                        <span>{methode?.nom}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-right ${isRevenu ? 'text-emerald-600' : 'text-rose-600'}`}>
                    <p className="font-bold flex items-center gap-1">
                      {isRevenu ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {formatMontant(transaction.montant)}
                    </p>
                    <Badge variant={isRevenu ? 'success' : 'danger'} className="text-[10px]">
                      {isRevenu ? 'Revenu' : 'Dépense'}
                    </Badge>
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
            <DialogTitle>Nouvelle transaction</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex gap-2 bg-stone-100 p-1 rounded-lg">
              <button
                onClick={() => setFormData({ ...formData, type: 'revenu' })}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  formData.type === 'revenu'
                    ? 'bg-emerald-500 text-white'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Revenu
              </button>
              <button
                onClick={() => setFormData({ ...formData, type: 'depense' })}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  formData.type === 'depense'
                    ? 'bg-rose-500 text-white'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Dépense
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Catégorie</label>
              <select
                value={formData.categorie}
                onChange={e => setFormData({ ...formData, categorie: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {(formData.type === 'revenu' ? categoriesRevenu : categoriesDepense).map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
              <input
                type="text"
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Vente d'œufs..."
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Montant (FC)</label>
              <input
                type="number"
                value={formData.montant || ''}
                onChange={e => setFormData({ ...formData, montant: parseFloat(e.target.value) })}
                placeholder="0"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Méthode</label>
                <select
                  value={formData.methode}
                  onChange={e => setFormData({ ...formData, methode: e.target.value as Transaction['methode'] })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  {methodesPaiement.map(m => (
                    <option key={m.id} value={m.id}>{m.icon} {m.nom}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowAddDialog(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
