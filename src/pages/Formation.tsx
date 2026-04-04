import { useState } from 'react'
import { 
  BookOpen, 
  Play, 
  Clock, 
  Award,
  CheckCircle2,
  ChevronRight,
  Star,
  Users,
  FileText,
  Video
} from 'lucide-react'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Badge from '../components/UI/Badge'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface Cours {
  id: string
  titre: string
  description: string
  categorie: string
  duree: string
  niveau: 'debutant' | 'intermediaire' | 'avance'
  modules: number
  completions: number
  note: number
  image: string
  complet?: boolean
}

interface Guide {
  id: string
  titre: string
  description: string
  type: 'pdf' | 'video' | 'article'
  taille?: string
  duree?: string
}

const cours: Cours[] = [
  {
    id: '1',
    titre: 'L\'aviculture pour débutants',
    description: 'Apprenez les bases de l\'élevage de poules pondeuses et de chair.',
    categorie: 'Aviculture',
    duree: '4h30',
    niveau: 'debutant',
    modules: 8,
    completions: 1250,
    note: 4.8,
    image: '🐔'
  },
  {
    id: '2',
    titre: 'Culture du maïs optimisée',
    description: 'Techniques modernes pour maximiser votre rendement en maïs.',
    categorie: 'Cultures',
    duree: '3h15',
    niveau: 'intermediaire',
    modules: 6,
    completions: 890,
    note: 4.6,
    image: '🌽'
  },
  {
    id: '3',
    titre: 'Gestion financière agricole',
    description: 'Apprenez à gérer les finances de votre exploitation agricole.',
    categorie: 'Gestion',
    duree: '2h45',
    niveau: 'debutant',
    modules: 5,
    completions: 650,
    note: 4.7,
    image: '💰'
  },
  {
    id: '4',
    titre: 'Santé animale avancée',
    description: 'Prévention et traitement des maladies courantes en élevage.',
    categorie: 'Vétérinaire',
    duree: '5h00',
    niveau: 'avance',
    modules: 10,
    completions: 420,
    note: 4.9,
    image: '💉'
  },
  {
    id: '5',
    titre: 'Irrigation et gestion de l\'eau',
    description: 'Techniques d\'irrigation adaptées au contexte congolais.',
    categorie: 'Techniques',
    duree: '3h00',
    niveau: 'intermediaire',
    modules: 7,
    completions: 380,
    note: 4.5,
    image: '💧'
  }
]

const guides: Guide[] = [
  {
    id: '1',
    titre: 'Guide complet de la volaille',
    description: 'Tout ce que vous devez savoir sur l\'élevage de poules',
    type: 'pdf',
    taille: '2.5 MB'
  },
  {
    id: '2',
    titre: 'Calendrier cultural du maïs',
    description: 'Planifiez votre culture du maïs mois par mois',
    type: 'pdf',
    taille: '1.8 MB'
  },
  {
    id: '3',
    titre: 'Tutoriel: Vaccination des poussins',
    description: 'Vidéo pas à pas pour vacciner vos poussins',
    type: 'video',
    duree: '15 min'
  },
  {
    id: '4',
    titre: 'Les engrais naturels',
    description: 'Comment fabriquer vos propres engrais organiques',
    type: 'article'
  }
]

const niveaux = {
  debutant: { label: 'Débutant', color: 'success' as const },
  intermediaire: { label: 'Intermédiaire', color: 'warning' as const },
  avance: { label: 'Avancé', color: 'danger' as const },
}

export default function Formation() {
  const [activeTab, setActiveTab] = useState<'cours' | 'guides'>('cours')
  const [myCourses, setMyCourses] = useLocalStorage<string[]>('agro_my_courses', [])
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)

  const toggleCourse = (courseId: string) => {
    if (myCourses.includes(courseId)) {
      setMyCourses(prev => prev.filter(id => id !== courseId))
    } else {
      setMyCourses(prev => [...prev, courseId])
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />
      case 'video': return <Video className="w-5 h-5 text-blue-500" />
      default: return <FileText className="w-5 h-5 text-green-500" />
    }
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-cyan-600" />
          Formation
        </h1>
        <p className="text-stone-500">Apprenez et perfectionnez-vous</p>
      </div>

      {/* Progress Card */}
      {myCourses.length > 0 && (
        <Card className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-cyan-800">Votre progression</h3>
              <p className="text-sm text-cyan-700">
                {myCourses.length} cours en cours
              </p>
            </div>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Award className="w-8 h-8 text-cyan-600" />
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-2 bg-stone-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('cours')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'cours'
              ? 'bg-white text-green-600 shadow-sm'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          Cours en ligne
        </button>
        <button
          onClick={() => setActiveTab('guides')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'guides'
              ? 'bg-white text-green-600 shadow-sm'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          Guides & PDF
        </button>
      </div>

      {activeTab === 'cours' && (
        <div className="space-y-4">
          {cours.map((c) => {
            const isEnrolled = myCourses.includes(c.id)
            const isExpanded = expandedCourse === c.id
            
            return (
              <Card key={c.id} className="p-4 overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                    {c.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant={niveaux[c.niveau].color} className="mb-1 text-[10px]">
                          {niveaux[c.niveau].label}
                        </Badge>
                        <h3 className="font-semibold text-stone-800">{c.titre}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-stone-500 mt-1 line-clamp-2">{c.description}</p>
                    
                    <div className="flex items-center gap-3 mt-2 text-xs text-stone-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {c.duree}
                      </span>
                      <span className="flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        {c.modules} modules
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {c.completions}
                      </span>
                      <span className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        {c.note}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button 
                    variant={isEnrolled ? 'secondary' : 'primary'}
                    onClick={() => toggleCourse(c.id)}
                    className="flex-1"
                  >
                    {isEnrolled ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        En cours
                      </>
                    ) : (
                      'Commencer'
                    )}
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => setExpandedCourse(isExpanded ? null : c.id)}
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </Button>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-stone-100">
                    <p className="text-sm font-medium text-stone-700 mb-2">Modules du cours</p>
                    <div className="space-y-2">
                      {[...Array(c.modules)].map((_, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-stone-600">
                          <div className="w-6 h-6 bg-stone-100 rounded-full flex items-center justify-center text-xs">
                            {i + 1}
                          </div>
                          <span>Module {i + 1}: {['Introduction', 'Les bases', 'Techniques avancées', 'Pratique', 'Maintenance', 'Dépannage', 'Optimisation', 'Conclusion'][i] || `Leçon ${i + 1}`}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {activeTab === 'guides' && (
        <div className="space-y-3">
          {guides.map((guide) => (
            <Card key={guide.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {getTypeIcon(guide.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-stone-800">{guide.titre}</h3>
                  <p className="text-sm text-stone-500">{guide.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-stone-400">
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      {guide.type}
                    </Badge>
                    {guide.taille && <span>{guide.taille}</span>}
                    {guide.duree && <span>{guide.duree}</span>}
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
