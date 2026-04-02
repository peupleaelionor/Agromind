import { 
  Building2, 
  ExternalLink, 
  Phone, 
  MapPin, 
  Calendar,
  CheckCircle2,
  Info
} from 'lucide-react'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Badge from '../components/UI/Badge'

interface Programme {
  id: string
  nom: string
  organisme: string
  description: string
  avantages: string[]
  contact: string
  region: string
  dateLimite?: string
  statut: 'ouvert' | 'bientot' | 'ferme'
}

const programmes: Programme[] = [
  {
    id: '1',
    nom: 'PAU - Projet Amenagement Urgentes',
    organisme: 'Ministere de l\'Agriculture',
    description: 'Soutien aux agriculteurs pour l\'achat d\'intrants agricoles et d\'equipements.',
    avantages: [
      'Subvention de 50% sur les engrais',
      'Acces aux semences ameliorees',
      'Formation technique gratuite'
    ],
    contact: '+243 81 234 5678',
    region: 'National',
    dateLimite: '2024-06-30',
    statut: 'ouvert'
  },
  {
    id: '2',
    nom: 'Programme d\'Appui aux Cooperatives',
    organisme: 'Fonds de Promotion de l\'Industrie',
    description: 'Financement et accompagnement des cooperatives agricoles.',
    avantages: [
      'Prets a taux preferentiel (8%)',
      'Accompagnement technique',
      'Acces aux marches'
    ],
    contact: '+243 82 345 6789',
    region: 'National',
    statut: 'ouvert'
  },
  {
    id: '3',
    nom: 'Projet Agricole du Grand Katanga',
    organisme: 'Gouvernorat du Haut-Katanga',
    description: 'Developpement de l\'agriculture dans la province du Haut-Katanga.',
    avantages: [
      'Mise a disposition de terres',
      'Irrigation subventionnee',
      'Formation aux techniques modernes'
    ],
    contact: '+243 99 123 4567',
    region: 'Haut-Katanga',
    statut: 'bientot'
  },
  {
    id: '4',
    nom: 'Initiative Jeunes Agriculteurs',
    organisme: 'PNUD RDC',
    description: 'Programme de soutien aux jeunes souhaitant s\'installer en agriculture.',
    avantages: [
      'Formation professionnelle',
      'Kit de demarrage',
      'Mentorat par des experts'
    ],
    contact: '+243 84 567 8901',
    region: 'National',
    dateLimite: '2024-05-15',
    statut: 'ouvert'
  },
  {
    id: '5',
    nom: 'Projet Mais Plus',
    organisme: 'FAO RDC',
    description: 'Amelioration de la production et de la commercialisation du mais.',
    avantages: [
      'Semences certifiees',
      'Engrais subventionnes',
      'Appui a la commercialisation'
    ],
    contact: '+243 81 876 5432',
    region: 'Bandundu, Kasai',
    statut: 'ouvert'
  }
]

const statuts = {
  ouvert: { label: 'Inscriptions ouvertes', color: 'success' as const },
  bientot: { label: 'Bientot disponible', color: 'warning' as const },
  ferme: { label: 'Inscriptions fermees', color: 'secondary' as const },
}

export default function Programmes() {
  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
          <Building2 className="w-7 h-7 text-teal-600" />
          Programmes Gouvernementaux
        </h1>
        <p className="text-stone-500">Aides et subventions pour les agriculteurs</p>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-teal-800 mb-1">Comment beneficier de ces programmes?</h3>
            <p className="text-sm text-teal-700">
              Contactez directement l\'organisme concerne ou rendez-vous dans les bureaux provinciaux de l\'agriculture. 
              Preparez vos documents (carte d\'identite, attestation de terre, etc.).
            </p>
          </div>
        </div>
      </Card>

      {/* Programmes List */}
      <div className="space-y-4">
        {programmes.map((programme) => (
          <Card key={programme.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <Badge variant={statuts[programme.statut].color} className="mb-2">
                  {statuts[programme.statut].label}
                </Badge>
                <h3 className="font-semibold text-stone-800">{programme.nom}</h3>
                <p className="text-sm text-stone-500">{programme.organisme}</p>
              </div>
            </div>

            <p className="text-sm text-stone-600 mb-4">{programme.description}</p>

            <div className="mb-4">
              <p className="text-xs font-medium text-stone-500 uppercase mb-2">Avantages</p>
              <ul className="space-y-1">
                {programme.avantages.map((avantage, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-stone-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {avantage}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500 pt-3 border-t border-stone-100">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {programme.region}
              </span>
              {programme.dateLimite && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Limite: {new Date(programme.dateLimite).toLocaleDateString('fr-FR')}
                </span>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <a 
                href={`tel:${programme.contact}`}
                className="flex-1"
              >
                <Button variant="secondary" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Appeler
                </Button>
              </a>
              <Button className="flex-1">
                <ExternalLink className="w-4 h-4 mr-2" />
                Plus d\'infos
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
