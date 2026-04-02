import { useState } from 'react'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Input from '../components/UI/Input'
import { Calculator, TrendingUp, DollarSign, Package, RefreshCw, Save } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function Calculatrice() {
  const [activeTab, setActiveTab] = useState('profit')
  
  const [prixVente, setPrixVente] = useState(380)
  const [quantiteVente, setQuantiteVente] = useState(100)
  const [coutAliment, setCoutAliment] = useState(50000)
  const [coutSoins, setCoutSoins] = useState(15000)
  const [coutAutres, setCoutAutres] = useState(10000)
  
  const [nombrePoules, setNombrePoules] = useState(100)
  const [consommationJour, setConsommationJour] = useState(0.12)
  const [prixSac, setPrixSac] = useState(45000)
  const [poidsSac, setPoidsSac] = useState(50)

  const revenuTotal = prixVente * quantiteVente
  const coutTotal = coutAliment + coutSoins + coutAutres
  const profit = revenuTotal - coutTotal
  const marge = revenuTotal > 0 ? (profit / revenuTotal) * 100 : 0

  const consommationTotale = nombrePoules * consommationJour * 30
  const nombreSacs = Math.ceil(consommationTotale / poidsSac)
  const coutAlimentMois = nombreSacs * prixSac

  const dataRepartition = [
    { name: 'Aliment', value: coutAliment, color: '#16a34a' },
    { name: 'Soins', value: coutSoins, color: '#f59e0b' },
    { name: 'Autres', value: coutAutres, color: '#6b7280' },
  ]

  return (
    <div className="space-y-5 pb-28">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">🧮 Outils de calcul</h1>
        <Calculator className="w-6 h-6 text-green-600" />
      </div>

      <div className="flex gap-2 border-b border-stone-200">
        {[{id:'profit',label:'Profit',icon:TrendingUp},{id:'ration',label:'Ration',icon:Package}].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-[2px] ${activeTab===t.id?'text-green-600 border-green-600':'text-stone-500 border-transparent'}`}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {activeTab === 'profit' && (
        <div className="space-y-4 animate-fade-in">
          <Card className={`${profit>=0?'bg-green-50 border-green-200':'bg-red-50 border-red-200'}`}>
            <div className="text-center">
              <p className="text-sm text-stone-500 mb-1">Profit estimé</p>
              <p className={`text-4xl font-bold ${profit>=0?'text-green-600':'text-red-600'}`}>{profit>=0?'+':''}{profit.toLocaleString()} FC</p>
              <p className="text-sm text-stone-500 mt-1">Marge : <span className={`font-semibold ${marge>=0?'text-green-600':'text-red-600'}`}>{marge.toFixed(1)}%</span></p>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5 text-green-600" />Revenus</h3>
            <div className="space-y-4">
              <Input label="Prix de vente unitaire (FC)" type="number" value={prixVente} onChange={(e) => setPrixVente(parseInt(e.target.value)||0)} />
              <Input label="Quantité vendue" type="number" value={quantiteVente} onChange={(e) => setQuantiteVente(parseInt(e.target.value)||0)} />
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-stone-600">Revenu total</p>
                <p className="text-xl font-bold text-green-600">{revenuTotal.toLocaleString()} FC</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-stone-600" />Coûts</h3>
            <div className="space-y-4">
              <Input label="Alimentation (FC)" type="number" value={coutAliment} onChange={(e) => setCoutAliment(parseInt(e.target.value)||0)} />
              <Input label="Soins vétérinaires (FC)" type="number" value={coutSoins} onChange={(e) => setCoutSoins(parseInt(e.target.value)||0)} />
              <Input label="Autres dépenses (FC)" type="number" value={coutAutres} onChange={(e) => setCoutAutres(parseInt(e.target.value)||0)} />
              <div className="bg-stone-100 p-3 rounded-lg">
                <p className="text-sm text-stone-600">Coût total</p>
                <p className="text-xl font-bold text-stone-700">{coutTotal.toLocaleString()} FC</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-stone-800 mb-4">Répartition des coûts</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dataRepartition} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={5} dataKey="value">
                    {dataRepartition.map((e,i) => <Cell key={`cell-${i}`} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v.toLocaleString()} FC`} contentStyle={{borderRadius:12,border:'none'}}/></PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {dataRepartition.map((i) => (<div key={i.name} className="flex items-center gap-1"><div className="w-3 h-3 rounded-full" style={{backgroundColor:i.color}}/><span className="text-xs text-stone-600">{i.name}</span></div>))}
            </div>
          </Card>

          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => {setPrixVente(380);setQuantiteVente(100);setCoutAliment(50000);setCoutSoins(15000);setCoutAutres(10000)}}><RefreshCw className="w-4 h-4"/>Réinitialiser</Button>
            <Button variant="primary" className="flex-1" onClick={() => window.dispatchEvent(new CustomEvent('robbie-message',{detail:{text:'✅ Calcul sauvegardé !',type:'success'}}))}><Save className="w-4 h-4"/>Sauvegarder</Button>
          </div>
        </div>
      )}

      {activeTab === 'ration' && (
        <div className="space-y-4 animate-fade-in">
          <Card className="bg-amber-50 border-amber-200">
            <div className="text-center">
              <p className="text-sm text-stone-500 mb-1">Besoin mensuel</p>
              <p className="text-4xl font-bold text-amber-600">{consommationTotale.toFixed(1)} kg</p>
              <p className="text-sm text-stone-500 mt-1">Soit <span className="font-semibold text-amber-600">{nombreSacs} sacs</span> de {poidsSac}kg</p>
              <p className="text-lg font-bold text-stone-700 mt-2">{coutAlimentMois.toLocaleString()} FC/mois</p>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-stone-800 mb-4">Paramètres</h3>
            <div className="space-y-4">
              <Input label="Nombre de poules" type="number" value={nombrePoules} onChange={(e) => setNombrePoules(parseInt(e.target.value)||0)} />
              <Input label="Consommation par poule (kg/jour)" type="number" step="0.01" value={consommationJour} onChange={(e) => setConsommationJour(parseFloat(e.target.value)||0)} />
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">💡 Une poule pondeuse consomme en moyenne 110-120g/jour</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-stone-800 mb-4">Coût de l'aliment</h3>
            <div className="space-y-4">
              <Input label="Prix d'un sac (FC)" type="number" value={prixSac} onChange={(e) => setPrixSac(parseInt(e.target.value)||0)} />
              <Input label="Poids d'un sac (kg)" type="number" value={poidsSac} onChange={(e) => setPoidsSac(parseInt(e.target.value)||0)} />
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-stone-600">Prix au kg</p>
                <p className="text-lg font-bold text-green-600">{Math.round(prixSac/poidsSac).toLocaleString()} FC/kg</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-stone-800 mb-4">Récapitulatif mensuel</h3>
            <div className="space-y-2">
              {[{l:'Consommation totale',v:`${consommationTotale.toFixed(1)} kg`},{l:'Nombre de sacs',v:nombreSacs},{l:'Coût alimentation',v:`${coutAlimentMois.toLocaleString()} FC`},{l:'Coût par poule',v:`${Math.round(coutAlimentMois/nombrePoules).toLocaleString()} FC`}].map((item,i) => (
                <div key={i} className="flex justify-between py-2 border-b border-stone-100 last:border-0">
                  <span className="text-sm text-stone-600">{item.l}</span>
                  <span className="font-medium text-stone-800">{item.v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
