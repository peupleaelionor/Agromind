import { 
  CloudSun, 
  Sun, 
  Cloud,
  CloudRain,
  CloudLightning,
  Droplets,
  Wind,
  Thermometer,
  MapPin,
  Umbrella
} from 'lucide-react'
import Card from '../components/UI/Card'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface Prevision {
  date: string
  tempMin: number
  tempMax: number
  condition: 'soleil' | 'nuageux' | 'pluie' | 'orage'
  precipitation: number
  humidite: number
  vent: number
}

const conditions = {
  soleil: { label: 'Ensoleillé', icon: Sun, color: 'text-amber-500' },
  nuageux: { label: 'Nuageux', icon: Cloud, color: 'text-stone-500' },
  pluie: { label: 'Pluvieux', icon: CloudRain, color: 'text-blue-500' },
  orage: { label: 'Orageux', icon: CloudLightning, color: 'text-purple-500' },
}

const mockPrevisions: Prevision[] = [
  {
    date: new Date().toISOString().split('T')[0],
    tempMin: 22,
    tempMax: 31,
    condition: 'soleil',
    precipitation: 10,
    humidite: 65,
    vent: 12
  },
  {
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tempMin: 21,
    tempMax: 29,
    condition: 'nuageux',
    precipitation: 20,
    humidite: 70,
    vent: 15
  },
  {
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tempMin: 20,
    tempMax: 27,
    condition: 'pluie',
    precipitation: 80,
    humidite: 85,
    vent: 18
  },
  {
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tempMin: 21,
    tempMax: 28,
    condition: 'nuageux',
    precipitation: 30,
    humidite: 75,
    vent: 14
  },
  {
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tempMin: 22,
    tempMax: 30,
    condition: 'soleil',
    precipitation: 5,
    humidite: 60,
    vent: 10
  },
  {
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tempMin: 23,
    tempMax: 32,
    condition: 'soleil',
    precipitation: 0,
    humidite: 55,
    vent: 8
  },
  {
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tempMin: 22,
    tempMax: 31,
    condition: 'nuageux',
    precipitation: 15,
    humidite: 68,
    vent: 12
  }
]

const conseilsMeteo: Record<string, string[]> = {
  soleil: [
    'Arrosez tôt le matin ou en soirée',
    'Protégez les jeunes plants du soleil direct',
    'Surveillez le stress hydrique'
  ],
  pluie: [
    'Évitez les traitements phytosanitaires',
    'Surveillez le drainage des champs',
    'Protégez les récoltes en cours'
  ],
  nuageux: [
    'Bon moment pour les semis',
    'Conditions idéales pour le travail du sol',
    'Réduisez l\'arrosage'
  ],
  orage: [
    'Sécurisez les animaux et l\'équipement',
    'Évitez les champs exposés',
    'Surveillez les inondations potentielles'
  ]
}

export default function Meteo() {
  const [region] = useLocalStorage('agro_region', 'kinshasa')
  const [previsions] = useLocalStorage<Prevision[]>('agro_previsions', mockPrevisions)

  const aujourdhui = previsions[0]
  const conditionAujourdhui = conditions[aujourdhui.condition]
  const joursSemaine = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
          <CloudSun className="w-7 h-7 text-sky-600" />
          Météo
        </h1>
        <p className="text-stone-500 flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {region.charAt(0).toUpperCase() + region.slice(1)}, RDC
        </p>
      </div>

      {/* Current Weather */}
      <Card className="p-6 bg-gradient-to-br from-sky-400 to-blue-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sky-100 text-sm">Aujourd'hui</p>
            <p className="text-5xl font-bold mt-1">{Math.round((aujourdhui.tempMin + aujourdhui.tempMax) / 2)}°</p>
            <p className="text-sky-100 mt-1">{conditionAujourdhui.label}</p>
            <p className="text-sm text-sky-100 mt-2">
              {aujourdhui.tempMin}° / {aujourdhui.tempMax}°
            </p>
          </div>
          <div className="text-6xl">
            <conditionAujourdhui.icon className="w-20 h-20 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
          <div className="text-center">
            <Droplets className="w-5 h-5 mx-auto mb-1 text-sky-100" />
            <p className="text-lg font-semibold">{aujourdhui.humidite}%</p>
            <p className="text-xs text-sky-100">Humidité</p>
          </div>
          <div className="text-center">
            <Wind className="w-5 h-5 mx-auto mb-1 text-sky-100" />
            <p className="text-lg font-semibold">{aujourdhui.vent} km/h</p>
            <p className="text-xs text-sky-100">Vent</p>
          </div>
          <div className="text-center">
            <Umbrella className="w-5 h-5 mx-auto mb-1 text-sky-100" />
            <p className="text-lg font-semibold">{aujourdhui.precipitation}%</p>
            <p className="text-xs text-sky-100">Pluie</p>
          </div>
        </div>
      </Card>

      {/* 7-Day Forecast */}
      <div>
        <h2 className="text-lg font-semibold text-stone-800 mb-3">Prévisions 7 jours</h2>
        <Card className="p-4">
          <div className="space-y-3">
            {previsions.map((prev, idx) => {
              const condition = conditions[prev.condition]
              const date = new Date(prev.date)
              const jourLabel = idx === 0 ? 'Aujourd\'hui' : joursSemaine[date.getDay()]
              
              return (
                <div key={prev.date} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 w-24">
                    <span className="text-sm font-medium text-stone-700">{jourLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <condition.icon className={`w-5 h-5 ${condition.color}`} />
                    <span className="text-xs text-stone-500 hidden sm:inline">{condition.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {prev.precipitation > 30 && (
                      <span className="text-xs text-blue-500">{prev.precipitation}%</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-stone-400">{prev.tempMin}°</span>
                    <div className="w-16 h-1 bg-stone-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-amber-400 rounded-full"
                        style={{ 
                          width: '100%',
                          marginLeft: `${(prev.tempMin / 40) * 100}%`,
                          marginRight: `${((40 - prev.tempMax) / 40) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-stone-700 font-medium">{prev.tempMax}°</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Agricultural Advice */}
      <div>
        <h2 className="text-lg font-semibold text-stone-800 mb-3">Conseils agricoles</h2>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <Sun className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Pour aujourd'hui</h3>
          </div>
          <ul className="space-y-2">
            {conseilsMeteo[aujourdhui.condition].map((conseil, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-green-700">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                {conseil}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Monthly Overview */}
      <Card className="p-4">
        <h3 className="font-semibold text-stone-800 mb-3">Ce mois-ci</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-stone-800">28°C</p>
              <p className="text-xs text-stone-500">Temp. moyenne</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CloudRain className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-stone-800">12 jours</p>
              <p className="text-xs text-stone-500">Jours de pluie</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
