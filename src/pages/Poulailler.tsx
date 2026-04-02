import { useState } from 'react'
import { usePoulailler } from '../hooks/useLocalStorage'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Input from '../components/UI/Input'
import ProgressBar from '../components/UI/ProgressBar'
import { Plus, Minus, Egg, Package, DollarSign, ArrowRightLeft, History } from 'lucide-react'

const CALIBRES = [
  { id: 'petit', nom: 'Petit', desc: '<50g', color: 'blue' as const },
  { id: 'moyen', nom: 'Moyen', desc: '50-60g', color: 'green' as const },
  { id: 'gros', nom: 'Gros', desc: '60-65g', color: 'orange' as const },
  { id: 'extra', nom: 'Extra', desc: '>65g', color: 'purple' as const },
]

export default function Poulailler() {
  const { poules, setPoules, pondeuses, setPondeuses, stock, stockTotal, oeufsAttendus, revenuEstime, ajouterOeufs, vendreOeufs, transfererCalibre, historique } = usePoulailler()
  const [quantiteInput, setQuantiteInput] = useState('')
  const [calibreSelected, setCalibreSelected] = useState('moyen')
  const [activeTab, setActiveTab] = useState('stock')
  const [showVente, setShowVente] = useState(false)
  const [venteQte, setVenteQte] = useState('')
  const [venteCalibre, setVenteCalibre] = useState('moyen')
  const [ventePrix, setVentePrix] = useState(380)

  const handleCollecte = (n: number) => {
    ajouterOeufs(n, calibreSelected)
    window.dispatchEvent(new CustomEvent('robbie-message', { detail: { text: `✅ ${n} œufs ajoutés !`, type: 'success' } }))
  }

  const handleVente = () => {
    const q = parseInt(venteQte) || 0
    if (q > 0 && vendreOeufs(q, venteCalibre, ventePrix)) {
      setShowVente(false)
      setVenteQte('')
      window.dispatchEvent(new CustomEvent('robbie-message', { detail: { text: `💰 Vente de ${q} œufs enregistrée !`, type: 'success' } }))
    } else {
      window.dispatchEvent(new CustomEvent('robbie-message', { detail: { text: '❌ Stock insuffisant', type: 'alert' } }))
    }
  }

  const handleTransfert = (f: string, t: string) => {
    if (transfererCalibre(f, t, 1)) {
      window.dispatchEvent(new CustomEvent('robbie-message', { detail: { text: `✅ Transfert ${f} → ${t}`, type: 'success' } }))
    }
  }

  return (
    <div className="space-y-5 pb-28">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">🐔 Mon Poulailler</h1>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">{poules} poules</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center gap-2 mb-2"><Egg className="w-5 h-5 text-green-600" /><span className="text-sm text-stone-600">Stock total</span></div>
          <p className="text-3xl font-bold text-stone-800">{stockTotal}</p>
          <p className="text-xs text-stone-500">œufs</p>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <div className="flex items-center gap-2 mb-2"><DollarSign className="w-5 h-5 text-amber-600" /><span className="text-sm text-stone-600">Valeur</span></div>
          <p className="text-3xl font-bold text-stone-800">{revenuEstime.toLocaleString()}</p>
          <p className="text-xs text-stone-500">FC</p>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold text-stone-800 mb-4">Gestion des poules</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="font-medium text-stone-800">Total poules</p><p className="text-sm text-stone-500">Effectif total</p></div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPoules(Math.max(0, poules - 1))} className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center hover:bg-stone-200"><Minus className="w-4 h-4" /></button>
              <span className="w-10 text-center text-xl font-bold">{poules}</span>
              <button onClick={() => setPoules(poules + 1)} className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center hover:bg-green-200"><Plus className="w-4 h-4 text-green-600" /></button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div><p className="font-medium text-stone-800">Pondeuses</p><p className="text-sm text-stone-500">~{oeufsAttendus} œufs/jour</p></div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPondeuses(Math.max(0, Math.min(poules, pondeuses - 1)))} className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center hover:bg-stone-200"><Minus className="w-4 h-4" /></button>
              <span className="w-10 text-center text-xl font-bold">{pondeuses}</span>
              <button onClick={() => setPondeuses(Math.min(poules, pondeuses + 1))} className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center hover:bg-green-200"><Plus className="w-4 h-4 text-green-600" /></button>
            </div>
          </div>
          <ProgressBar value={pondeuses} max={poules} color="green" />
        </div>
      </Card>

      <div className="flex gap-2 border-b border-stone-200">
        {[{id:'stock',label:'Stock',icon:Package},{id:'collecte',label:'Collecte',icon:Egg},{id:'historique',label:'Historique',icon:History}].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-[2px] ${activeTab===t.id?'text-green-600 border-green-600':'text-stone-500 border-transparent'}`}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {activeTab === 'stock' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-3">
            {CALIBRES.map((c) => (
              <Card key={c.id} className={`bg-${c.color}-50`}>
                <div className="flex items-center justify-between mb-1"><span className="text-sm font-medium text-stone-700">{c.nom}</span><span className="text-xs text-stone-400">{c.desc}</span></div>
                <p className="text-2xl font-bold text-stone-800">{stock[c.id as keyof typeof stock]}</p>
                <p className="text-xs text-stone-500">œufs</p>
              </Card>
            ))}
          </div>
          <Card>
            <h4 className="font-medium text-stone-800 mb-3">Transferts rapides</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => handleTransfert('petit','moyen')} variant="secondary" size="sm" disabled={stock.petit<1}><ArrowRightLeft className="w-4 h-4"/>Petit→Moyen</Button>
              <Button onClick={() => handleTransfert('moyen','gros')} variant="secondary" size="sm" disabled={stock.moyen<1}><ArrowRightLeft className="w-4 h-4"/>Moyen→Gros</Button>
              <Button onClick={() => handleTransfert('gros','extra')} variant="secondary" size="sm" disabled={stock.gros<1}><ArrowRightLeft className="w-4 h-4"/>Gros→Extra</Button>
              <Button onClick={() => setShowVente(true)} variant="accent" size="sm" disabled={stockTotal<1}><DollarSign className="w-4 h-4"/>Vendre</Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'collecte' && (
        <div className="space-y-4 animate-fade-in">
          <Card>
            <h4 className="font-medium text-stone-800 mb-3">Collecte du jour</h4>
            <p className="text-sm text-stone-500 mb-4">Attendu : <span className="font-semibold text-green-600">{oeufsAttendus} œufs</span></p>
            <div className="mb-4">
              <label className="text-sm text-stone-600 mb-2 block">Calibre</label>
              <div className="grid grid-cols-4 gap-2">
                {CALIBRES.map((c) => <button key={c.id} onClick={() => setCalibreSelected(c.id)} className={`px-2 py-2 rounded-lg text-xs font-medium ${calibreSelected===c.id?'bg-green-600 text-white':'bg-stone-100 text-stone-600'}`}>{c.nom}</button>)}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[1,5,10,oeufsAttendus].map((n) => <Button key={n} onClick={() => handleCollecte(n)} variant="primary" size="sm">+{n}</Button>)}
            </div>
            <div className="flex gap-2">
              <Input type="number" value={quantiteInput} onChange={(e) => setQuantiteInput(e.target.value)} placeholder="Quantité" className="flex-1" />
              <Button onClick={() => { handleCollecte(parseInt(quantiteInput)||0); setQuantiteInput('') }} variant="primary">Ajouter</Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'historique' && (
        <div className="space-y-3 animate-fade-in">
          {historique.length === 0 ? <Card className="text-center py-8"><p className="text-stone-500">Aucune activité</p></Card> :
            historique.slice(0, 15).map((item) => (
              <Card key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type==='collecte'?'bg-green-100':'bg-amber-100'}`}>
                    {item.type==='collecte'?<Egg className="w-5 h-5 text-green-600" />:<DollarSign className="w-5 h-5 text-amber-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-stone-800">{item.type==='collecte'?'Collecte':'Vente'} : {item.quantite} œufs</p>
                    <p className="text-xs text-stone-500">{new Date(item.date).toLocaleDateString('fr-FR')} • {item.calibre}</p>
                  </div>
                </div>
                {item.total && <p className="font-semibold text-green-600">+{item.total.toLocaleString()} FC</p>}
              </Card>
            ))}
        </div>
      )}

      {showVente && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-stone-800">Enregistrer une vente</h3><button onClick={() => setShowVente(false)}>✕</button></div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-stone-600 mb-2 block">Calibre</label>
                <div className="grid grid-cols-4 gap-2">
                  {CALIBRES.map((c) => <button key={c.id} onClick={() => setVenteCalibre(c.id)} className={`px-2 py-2 rounded-lg text-xs ${venteCalibre===c.id?'bg-green-600 text-white':'bg-stone-100'}`}>{c.nom}</button>)}
                </div>
              </div>
              <Input label="Quantité" type="number" value={venteQte} onChange={(e) => setVenteQte(e.target.value)} placeholder="Nombre d'œufs" />
              <Input label="Prix unitaire (FC)" type="number" value={ventePrix} onChange={(e) => setVentePrix(parseInt(e.target.value)||0)} />
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-stone-600">Total estimé</p>
                <p className="text-2xl font-bold text-green-600">{(parseInt(venteQte||'0')*ventePrix).toLocaleString()} FC</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowVente(false)} variant="secondary" className="flex-1">Annuler</Button>
                <Button onClick={handleVente} variant="accent" className="flex-1">Confirmer</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
