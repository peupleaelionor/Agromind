import { useEffect, useState } from 'react'
import { usePoulailler } from '../hooks/useLocalStorage'
import { mockWeather, mockPrix, actualitesAgricoles, previsionsMeteo } from '../data/mockData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import StatCard from '../components/UI/StatCard'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Badge from '../components/UI/Badge'
import { Egg, TrendingUp, Sun, Droplets, Wind, ArrowRight, Newspaper } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const { stockTotal, oeufsAttendus, revenuEstime } = usePoulailler()
  const [region] = useLocalStorage('agro_region', 'kinshasa')
  const [weather, setWeather] = useState(mockWeather[region])

  useEffect(() => { setWeather(mockWeather[region]) }, [region])
  useEffect(() => {
    const handleRegionChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      setWeather(mockWeather[customEvent.detail])
    }
    window.addEventListener('region-changed', handleRegionChange)
    return () => window.removeEventListener('region-changed', handleRegionChange)
  }, [])

  const prixOeufs = mockPrix[region]?.find(p => p.produit === 'Œufs') || { prix: 380, variation: '+0%' }
  const prixMonte = prixOeufs.variation.includes('+')

  const stats = [
    { title: 'Stock d\'œufs', value: stockTotal, subtitle: 'unités', icon: Egg, color: 'green' as const, trend: '12%', trendUp: true },
    { title: 'Œufs attendus', value: oeufsAttendus, subtitle: 'aujourd\'hui', icon: Sun, color: 'orange' as const },
    { title: 'Revenu estimé', value: `${revenuEstime.toLocaleString()} FC`, subtitle: 'valeur stock', icon: TrendingUp, color: 'blue' as const, trend: '8%', trendUp: true },
  ]

  return (
    <div className="space-y-5 pb-28">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm mb-1">Météo aujourd'hui</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{weather.temp}°</span>
              <span className="text-blue-100">{weather.condition}</span>
            </div>
            <div className="flex gap-4 mt-3 text-sm text-blue-100">
              <span className="flex items-center gap-1"><Droplets className="w-4 h-4" /> {weather.humidite}%</span>
              <span className="flex items-center gap-1"><Wind className="w-4 h-4" /> {weather.vent} km/h</span>
            </div>
          </div>
          <div className="text-5xl">{weather.icon}</div>
        </div>
        <div className="mt-4 pt-3 border-t border-white/20">
          <div className="flex justify-between">
            {previsionsMeteo.map((prev, i) => (
              <div key={i} className="text-center">
                <p className="text-[10px] text-blue-100">{prev.jour}</p>
                <p className="text-lg my-0.5">{prev.condition}</p>
                <p className="text-xs font-medium">{prev.temp}°</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-stone-800">Mon exploitation</h2>
          <Button to="/poulailler" variant="ghost" size="sm" className="text-green-600">Voir tout <ArrowRight className="w-4 h-4" /></Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-stone-800">Prix du marché</h2>
          <Button to="/marche" variant="ghost" size="sm" className="text-green-600">Voir tout <ArrowRight className="w-4 h-4" /></Button>
        </div>
        <Card>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><Egg className="w-5 h-5 text-green-600" /></div>
              <div><p className="font-semibold text-stone-800">Œufs</p><p className="text-xs text-stone-500">Pièce</p></div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-stone-800">{prixOeufs.prix} FC</p>
              <Badge variant={prixMonte ? 'success' : 'danger'}>{prixOeufs.variation}</Badge>
            </div>
          </div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{j:'J-6',p:320},{j:'J-5',p:330},{j:'J-4',p:340},{j:'J-3',p:350},{j:'J-2',p:360},{j:'J-1',p:370},{j:'Auj.',p:prixOeufs.prix}]}>
                <defs><linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/><stop offset="95%" stopColor="#16a34a" stopOpacity={0}/></linearGradient></defs>
                <Area type="monotone" dataKey="p" stroke="#16a34a" fill="url(#c)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center text-xl">🥚</div>
          <div>
            <h3 className="font-semibold text-stone-800 mb-1">Conseil du jour</h3>
            <p className="text-sm text-stone-600 leading-relaxed">Pour maximiser la production, assurez 16h de lumière/jour et une alimentation riche en calcium.</p>
            <Button to="/conseils" variant="outline" size="sm" className="mt-2">Plus de conseils</Button>
          </div>
        </div>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-stone-800">Actualités</h2>
          <Newspaper className="w-5 h-5 text-stone-400" />
        </div>
        <div className="space-y-3">
          {actualitesAgricoles.slice(0, 2).map((news) => (
            <Card key={news.id} hover>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-lg">📰</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-stone-800 text-sm line-clamp-2">{news.titre}</h4>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">{news.resume}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="info" className="text-[10px]">{news.source}</Badge>
                    <span className="text-[10px] text-stone-400">{new Date(news.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
