import { useState, useEffect, useRef } from 'react'
import { Bot, Send, X, Sparkles, Lightbulb, Calculator, Cloud, Sprout, HandHeart } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface Message {
  id: string
  text: string
  sender: 'robbie' | 'user'
  type?: 'info' | 'success' | 'alert' | 'warning'
  actions?: { label: string; action: string }[]
}

interface RobbieContext {
  poules: number
  pondeuses: number
  oeufsJour: number
  region: string
  cultures: number
  tachesAFaire: number
  animaux: number
}

const conseilsAgricoles = [
  'Arrosez vos plants tôt le matin pour minimiser l\'évaporation.',
  'Vermifugez vos animaux tous les 3 mois.',
  'La cendre de bois est un excellent engrais naturel.',
  'Tournez vos œufs régulièrement pour améliorer l\'éclosion.',
  'Plantez du marigold près de vos cultures pour repousser les parasites.',
  'Ne récoltez jamais sous la pluie pour éviter les maladies.',
  'Un poulet adulte consomme environ 120g d\'aliment par jour.',
  'La lune croissante est idéale pour les semis.',
]

const reponsesCles: Record<string, string> = {
  'partage': 'Le système de Partage de Récoltes permet aux foyers inscrits de partager leurs surplus avec les voisins. Moins de pertes, plus de solidarité! Rendez-vous dans l\'onglet Partage.',
  'surplus': 'Vous avez des surplus de récoltes? Inscrivez votre foyer dans le système de Partage pour aider vos voisins et réduire les pertes alimentaires!',
  'voisin': 'L\'agriculture entre voisins est au cœur d\'AgroMind RDC. Partagez vos surplus, récupérez ceux des autres, et contribuez à une meilleure circulation des aliments!',
  'bonjour': 'Bonjour! 👋 Je suis Robbie, votre assistant AgroMind RDC. Comment puis-je vous aider aujourd\'hui?',
  'salut': 'Salut! 😊 Comment se passe votre journée agricole?',
  'oeuf': 'Pour maximiser la production d\'œufs, assurez-vous que vos poules ont: 16h de lumière/jour, de l\'eau fraîche constante, et un aliment riche en calcium.',
  'poule': 'Une poule pondeuse bien nourrie peut produire 280-300 œufs par an. La race Rhode Island Red est particulièrement productive en RDC.',
  'mais': 'Le maïs se plante en début de saison des pluies. Espacez les plants de 75cm x 25cm pour un bon rendement.',
  'vaccin': 'Les vaccins essentiels pour vos volailles: Newcastle (2-3 semaines), Gumboro (2-4 semaines), et Bronchite (selon risque).',
  'prix': 'Les prix varient selon les régions. Consultez l\'onglet Marché pour les prix actualisés de votre zone.',
  'meteo': 'La météo influence beaucoup vos activités! Évitez les traitements phytosanitaires par temps de pluie.',
  'finance': 'Gardez un registre de toutes vos dépenses et recettes. Cela vous aidera à calculer votre profit réel.',
  'aide': 'Je peux vous aider avec: conseils agricoles, calculs de profit, prix du marché, partage de récoltes entre voisins, rappels de tâches, et bien plus!',
  'merci': 'Avec plaisir! 🌾 N\'hésitez pas si vous avez d\'autres questions.',
}

export default function Robbie() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useLocalStorage<Message[]>('agro_robbie_messages', [])
  const [input, setInput] = useState('')
  const [hasGreeted, setHasGreeted] = useLocalStorage('agro_robbie_greeted', false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [poules] = useLocalStorage('agro_poules', 125)
  const [pondeuses] = useLocalStorage('agro_pondeuses', 82)
  const [region] = useLocalStorage('agro_region', 'kinshasa')
  const [cultures] = useLocalStorage('agro_cultures', [])
  const [taches] = useLocalStorage('agro_taches', [])
  const [animaux] = useLocalStorage('agro_animaux', [])

  const context: RobbieContext = {
    poules,
    pondeuses,
    oeufsJour: Math.round(pondeuses * 0.75),
    region,
    cultures: cultures.length,
    tachesAFaire: taches.filter((t: any) => !t.complete).length,
    animaux: animaux.length
  }

  useEffect(() => {
    if (!hasGreeted) {
      setTimeout(() => {
        addMessage({
          id: Date.now().toString(),
          text: `Bonjour! 👋 Je suis Robbie, votre assistant AgroMind RDC. Je vois que vous avez ${context.pondeuses} pondeuses et ${context.cultures} cultures. Avez-vous pensé au Partage de Récoltes entre voisins?`,
          sender: 'robbie',
          type: 'info',
          actions: [
            { label: 'Conseil du jour', action: 'conseil' },
            { label: 'Calculer profit', action: 'calcul' },
            { label: 'Partage', action: 'partage' },
          ]
        })
        setHasGreeted(true)
      }, 2000)
    }
  }, [hasGreeted])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message])
  }

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    // Check for keyword matches
    for (const [keyword, response] of Object.entries(reponsesCles)) {
      if (input.includes(keyword)) {
        return response
      }
    }

    // Context-aware responses
    if (input.includes('tache') || input.includes('travail') || input.includes('faire')) {
      if (context.tachesAFaire > 0) {
        return `Vous avez ${context.tachesAFaire} tâches en attente. Consultez l'onglet Tâches pour voir la liste!`
      }
      return 'Vous n\'avez aucune tâche en attente. Profitez-en pour planifier vos activités de la semaine!'
    }

    if (input.includes('culture') || input.includes('champ')) {
      if (context.cultures > 0) {
        return `Vous gérez actuellement ${context.cultures} cultures. N'oubliez pas de vérifier leurs besoins en eau et engrais!`
      }
      return 'Ajoutez vos cultures dans l\'onglet Cultures pour suivre leur évolution et recevoir des rappels!'
    }

    if (input.includes('animal') || input.includes('veto') || input.includes('sante')) {
      if (context.animaux > 0) {
        return `Vous avez ${context.animaux} animaux enregistrés. Pensez à vérifier leur carnet de vaccination!`
      }
      return 'Enregistrez vos animaux dans la section Vétérinaire pour suivre leur santé et les soins nécessaires.'
    }

    if (input.includes('oeuf') && context.pondeuses > 0) {
      return `Avec ${context.pondeuses} pondeuses, vous devriez récolter environ ${context.oeufsJour} œufs par jour. Vérifiez la qualité de l\'aliment et l\'eau!`
    }

    // Default responses
    const defaultResponses = [
      'Je ne suis pas sûr de comprendre. Pouvez-vous reformuler ou choisir parmi mes suggestions?',
      'Intéressant! Pour plus d\'aide, essayez de me demander: conseils sur les poules, le maïs, la météo, ou vos finances.',
      'Je peux vous aider avec de nombreux sujets agricoles. Que souhaitez-vous savoir?',
    ]
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    addMessage({
      id: Date.now().toString(),
      text: input,
      sender: 'user'
    })

    const userInput = input
    setInput('')

    // Generate and add Robbie response
    setTimeout(() => {
      const response = generateResponse(userInput)
      addMessage({
        id: Date.now().toString(),
        text: response,
        sender: 'robbie',
        type: 'info'
      })
    }, 500)
  }

  const handleAction = (action: string) => {
    switch (action) {
      case 'conseil':
        const conseil = conseilsAgricoles[Math.floor(Math.random() * conseilsAgricoles.length)]
        addMessage({
          id: Date.now().toString(),
          text: `💡 Conseil du jour: ${conseil}`,
          sender: 'robbie',
          type: 'success'
        })
        break
      case 'calcul':
        addMessage({
          id: Date.now().toString(),
          text: 'Rendez-vous dans l\'onglet Outils > Calculateur de profit pour estimer vos revenus!',
          sender: 'robbie',
          type: 'info'
        })
        window.location.href = '/calculatrice'
        break
      case 'meteo':
        addMessage({
          id: Date.now().toString(),
          text: 'Consultez les prévisions météo pour planifier vos activités agricoles!',
          sender: 'robbie',
          type: 'info'
        })
        window.location.href = '/meteo'
        break
      case 'partage':
        addMessage({
          id: Date.now().toString(),
          text: '🤝 Découvrez le système de Partage de Récoltes! Inscrivez votre foyer pour partager vos surplus avec vos voisins et réduire les pertes alimentaires en RDC.',
          sender: 'robbie',
          type: 'success'
        })
        window.location.href = '/partage'
        break
      case 'conseils':
        addMessage({
          id: Date.now().toString(),
          text: 'Découvrez tous nos conseils agricoles dans l\'onglet Conseils!',
          sender: 'robbie',
          type: 'info'
        })
        window.location.href = '/conseils'
        break
    }
  }

  const quickActions = [
    { icon: Lightbulb, label: 'Conseil', action: 'conseil' },
    { icon: HandHeart, label: 'Partage', action: 'partage' },
    { icon: Calculator, label: 'Profit', action: 'calcul' },
    { icon: Cloud, label: 'Météo', action: 'meteo' },
    { icon: Sprout, label: 'Conseils', action: 'conseils' },
  ]

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Robbie</h3>
                <p className="text-xs text-green-100">Assistant AgroMind RDC 🇨🇩</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-stone-50">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-green-300 mx-auto mb-3" />
                <p className="text-stone-500 text-sm">
                  Posez-moi vos questions sur l'agriculture!
                </p>
              </div>
            )}
            
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-white text-stone-700 border border-stone-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  
                  {msg.actions && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.actions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAction(action.action)}
                          className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 transition-colors"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="p-2 bg-white border-t border-stone-100">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {quickActions.map((action) => (
                <button
                  key={action.action}
                  onClick={() => handleAction(action.action)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 text-stone-600 text-xs rounded-full hover:bg-green-100 hover:text-green-700 transition-colors whitespace-nowrap"
                >
                  <action.icon className="w-3 h-3" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-stone-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="Écrivez votre message..."
                className="flex-1 px-4 py-2 bg-stone-100 border-0 rounded-full text-sm focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 ${
          isOpen ? 'bg-stone-700 rotate-45' : 'bg-gradient-to-br from-green-500 to-green-600'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Bot className="w-7 h-7 text-white" />
        )}
        
        {/* Notification dot */}
        {!isOpen && messages.filter(m => m.sender === 'robbie').length > 0 && messages.length < 3 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>
    </>
  )
}
