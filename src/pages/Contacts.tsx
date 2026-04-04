import { 
  Phone, 
  MapPin, 
  Mail, 
  Building2,
  User,
  Stethoscope,
  Tractor,
  Sprout,
  Plus
} from 'lucide-react'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'

interface Contact {
  id: string
  nom: string
  type: 'ministere' | 'veterinaire' | 'cooperative' | 'fournisseur' | 'expert'
  telephone: string
  email?: string
  adresse?: string
  region: string
  services: string[]
  disponible: boolean
}

const contacts: Contact[] = [
  {
    id: '1',
    nom: 'Ministère de l\'Agriculture - Kinshasa',
    type: 'ministere',
    telephone: '+243 81 234 5678',
    email: 'contact@agriculture.gouv.cd',
    adresse: 'Boulevard du 30 Juin, Kinshasa-Gombe',
    region: 'Kinshasa',
    services: ['Subventions', 'Formation', 'Certification'],
    disponible: true
  },
  {
    id: '2',
    nom: 'Dr. Kabongo - Vétérinaire',
    type: 'veterinaire',
    telephone: '+243 82 345 6789',
    email: 'dr.kabongo@veto.rdc',
    adresse: 'Avenue de la Paix, Lubumbashi',
    region: 'Lubumbashi',
    services: ['Vaccination', 'Consultation', 'Urgences'],
    disponible: true
  },
  {
    id: '3',
    nom: 'AgroVet Services',
    type: 'fournisseur',
    telephone: '+243 85 123 4567',
    email: 'contact@agrovet.rdc',
    adresse: 'Route de l\'Aéroport, Goma',
    region: 'Goma',
    services: ['Médicaments', 'Aliments', 'Équipements'],
    disponible: true
  },
  {
    id: '4',
    nom: 'COOPAVI Kinshasa',
    type: 'cooperative',
    telephone: '+243 81 876 5432',
    email: 'coopavi@email.cd',
    adresse: 'Quartier Industriel, Kinshasa',
    region: 'Kinshasa',
    services: ['Achat groupé', 'Vente collective', 'Formation'],
    disponible: true
  },
  {
    id: '5',
    nom: 'M. Mutombo - Expert Agricole',
    type: 'expert',
    telephone: '+243 99 234 5678',
    email: 'mutombo.expert@agri.cd',
    region: 'Kisangani',
    services: ['Conseil technique', 'Audit', 'Formation'],
    disponible: false
  },
  {
    id: '6',
    nom: 'Ministère Provincial Agriculture - Haut-Katanga',
    type: 'ministere',
    telephone: '+243 82 987 6543',
    adresse: 'Avenue Lumumba, Lubumbashi',
    region: 'Haut-Katanga',
    services: ['Enregistrement', 'Subventions', 'Information'],
    disponible: true
  },
  {
    id: '7',
    nom: 'Clinique Vétérinaire du Nord-Kivu',
    type: 'veterinaire',
    telephone: '+243 84 567 8901',
    adresse: 'Avenue Kanyamahanga, Goma',
    region: 'Goma',
    services: ['Soins', 'Vaccination', 'Chirurgie'],
    disponible: true
  },
  {
    id: '8',
    nom: 'Semences du Congo',
    type: 'fournisseur',
    telephone: '+243 81 345 6789',
    email: 'semences@rdc.cd',
    adresse: 'Zone Industrielle, Kinshasa',
    region: 'Kinshasa',
    services: ['Semences certifiées', 'Engrais', 'Conseil'],
    disponible: true
  }
]

const typesContact = {
  ministere: { label: 'Ministère', icon: Building2, color: 'bg-blue-100 text-blue-600' },
  veterinaire: { label: 'Vétérinaire', icon: Stethoscope, color: 'bg-rose-100 text-rose-600' },
  cooperative: { label: 'Coopérative', icon: Sprout, color: 'bg-green-100 text-green-600' },
  fournisseur: { label: 'Fournisseur', icon: Tractor, color: 'bg-amber-100 text-amber-600' },
  expert: { label: 'Expert', icon: User, color: 'bg-purple-100 text-purple-600' },
}

export default function Contacts() {
  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
          <Phone className="w-7 h-7 text-lime-600" />
          Contacts Utiles
        </h1>
        <p className="text-stone-500">Services agricoles en RDC</p>
      </div>

      {/* Emergency Card */}
      <Card className="p-4 bg-gradient-to-br from-rose-50 to-red-50 border-rose-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h3 className="font-semibold text-rose-800">Urgence vétérinaire</h3>
            <p className="text-sm text-rose-700">Service disponible 24/7</p>
            <a href="tel:+243999999999" className="text-lg font-bold text-rose-600">
              +243 99 999 9999
            </a>
          </div>
        </div>
      </Card>

      {/* Filter by Type */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(typesContact).map(([key, type]) => (
          <div 
            key={key}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${type.color} whitespace-nowrap`}
          >
            <type.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{type.label}</span>
          </div>
        ))}
      </div>

      {/* Contacts List */}
      <div className="space-y-3">
        {contacts.map((contact) => {
          const typeInfo = typesContact[contact.type]
          
          return (
            <Card key={contact.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeInfo.color}`}>
                  <typeInfo.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-stone-800">{contact.nom}</h3>
                      <div className="flex items-center gap-2 text-sm text-stone-500">
                        <MapPin className="w-3 h-3" />
                        {contact.region}
                        {contact.disponible ? (
                          <span className="text-green-600 text-xs">● Disponible</span>
                        ) : (
                          <span className="text-stone-400 text-xs">○ Indisponible</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {contact.services.map((service, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 bg-stone-100 text-stone-600 text-[10px] rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  {contact.adresse && (
                    <p className="text-sm text-stone-500 mt-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {contact.adresse}
                    </p>
                  )}

                  <div className="flex gap-2 mt-3">
                    <a href={`tel:${contact.telephone}`} className="flex-1">
                      <Button variant="secondary" className="w-full">
                        <Phone className="w-4 h-4 mr-2" />
                        Appeler
                      </Button>
                    </a>
                    {contact.email && (
                      <a href={`mailto:${contact.email}`}>
                        <Button variant="secondary">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Add Contact CTA */}
      <Card className="p-4 bg-gradient-to-br from-lime-50 to-green-50 border-lime-200">
        <div className="text-center">
          <h3 className="font-semibold text-lime-800 mb-2">Vous connaissez un service utile?</h3>
          <p className="text-sm text-lime-700 mb-3">
            Aidez la communauté en partageant vos contacts agricoles de confiance.
          </p>
          <Button variant="secondary" className="bg-white">
            <Plus className="w-4 h-4 mr-2" />
            Proposer un contact
          </Button>
        </div>
      </Card>
    </div>
  )
}
