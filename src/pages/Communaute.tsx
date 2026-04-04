import { useState } from 'react'
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2,
  MapPin,
  Phone,
  Star,
  Plus,
  Send,
  User as UserIcon
} from 'lucide-react'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Badge from '../components/UI/Badge'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/UI/Dialog'

interface Post {
  id: string
  auteur: string
  avatar: string
  region: string
  date: string
  contenu: string
  image?: string
  likes: number
  commentaires: Commentaire[]
  categorie: string
  liked?: boolean
}

interface Commentaire {
  id: string
  auteur: string
  contenu: string
  date: string
}

interface Cooperatives {
  id: string
  nom: string
  region: string
  membres: number
  activite: string
  contact: string
  note: number
}

const categories = [
  { id: 'all', nom: 'Tout', icon: '🌐' },
  { id: 'conseil', nom: 'Conseils', icon: '💡' },
  { id: 'vente', nom: 'Ventes', icon: '💰' },
  { id: 'achat', nom: 'Achats', icon: '🛒' },
  { id: 'question', nom: 'Questions', icon: '❓' },
  { id: 'evenement', nom: 'Événements', icon: '📅' },
]

const mockPosts: Post[] = [
  {
    id: '1',
    auteur: 'Jean Kabongo',
    avatar: '👨‍🌾',
    region: 'Kinshasa',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    contenu: 'Bonjour à tous! J\'ai une question sur la vaccination des poussins. Quel est le meilleur âge pour la première vaccination contre la maladie de Newcastle? Merci d\'avance!',
    likes: 12,
    commentaires: [
      { id: '1', auteur: 'Marie T.', contenu: 'Généralement à 2-3 semaines, mais consultez un vétérinaire', date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() }
    ],
    categorie: 'question'
  },
  {
    id: '2',
    auteur: 'Pauline M.',
    avatar: '👩‍🌾',
    region: 'Lubumbashi',
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    contenu: 'Super récolte de maïs cette saison! 45 sacs de 50kg sur seulement 1 hectare. Merci aux conseils de cette communauté! 🌾🎉',
    likes: 28,
    commentaires: [],
    categorie: 'conseil'
  },
  {
    id: '3',
    auteur: 'Pierre L.',
    avatar: '👨‍🌾',
    region: 'Goma',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    contenu: 'À vendre: 200 poulets de chair de 8 semaines, bien vaccinés. Prix: 7 500 FC l\'unité. Contactez-moi en MP.',
    likes: 8,
    commentaires: [
      { id: '1', auteur: 'Sophie K.', contenu: 'Je suis intéressée, je vous contacte', date: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() }
    ],
    categorie: 'vente'
  }
]

const mockCooperatives: Cooperatives[] = [
  { id: '1', nom: 'COOPAVI Kinshasa', region: 'Kinshasa', membres: 150, activite: 'Aviculture', contact: '+243 81 234 5678', note: 4.5 },
  { id: '2', nom: 'AGRILUBA', region: 'Lubumbashi', membres: 89, activite: 'Cultures vivrières', contact: '+243 99 876 5432', note: 4.2 },
  { id: '3', nom: 'COOPEGOMA', region: 'Goma', membres: 120, activite: 'Élevage divers', contact: '+243 85 123 4567', note: 4.7 },
  { id: '4', nom: 'AGRIKIS', region: 'Kisangani', membres: 75, activite: 'Pêche et agriculture', contact: '+243 82 345 6789', note: 4.0 },
]

export default function Communaute() {
  const [posts, setPosts] = useLocalStorage<Post[]>('agro_posts', mockPosts)
  const [cooperatives] = useLocalStorage<Cooperatives[]>('agro_cooperatives', mockCooperatives)
  
  const [activeTab, setActiveTab] = useState<'fil' | 'cooperatives'>('fil')
  const [filterCategorie, setFilterCategorie] = useState('all')
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostCategorie, setNewPostCategorie] = useState('conseil')
  const [commentInput, setCommentInput] = useState<Record<string, string>>({})

  const filteredPosts = posts.filter(p => filterCategorie === 'all' || p.categorie === filterCategorie)

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.liked ? p.likes - 1 : p.likes + 1,
          liked: !p.liked
        }
      }
      return p
    }))
  }

  const handleAddComment = (postId: string) => {
    const content = commentInput[postId]
    if (!content?.trim()) return

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentaires: [...p.commentaires, {
            id: Date.now().toString(),
            auteur: 'Vous',
            contenu: content,
            date: new Date().toISOString()
          }]
        }
      }
      return p
    }))

    setCommentInput({ ...commentInput, [postId]: '' })
  }

  const handleNewPost = () => {
    if (!newPostContent.trim()) return

    const newPost: Post = {
      id: Date.now().toString(),
      auteur: 'Vous',
      avatar: '👤',
      region: 'Kinshasa',
      date: new Date().toISOString(),
      contenu: newPostContent,
      likes: 0,
      commentaires: [],
      categorie: newPostCategorie
    }

    setPosts(prev => [newPost, ...prev])
    setNewPostContent('')
    setShowNewPost(false)
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) return 'À l\'instant'
    if (hours < 24) return `Il y a ${hours}h`
    if (days < 7) return `Il y a ${days}j`
    return d.toLocaleDateString('fr-FR')
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-600" />
            Communauté
          </h1>
          <p className="text-stone-500">Échangez avec d'autres agriculteurs</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-stone-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('fil')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'fil'
              ? 'bg-white text-green-600 shadow-sm'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          Fil d'actualité
        </button>
        <button
          onClick={() => setActiveTab('cooperatives')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'cooperatives'
              ? 'bg-white text-green-600 shadow-sm'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          Coopératives
        </button>
      </div>

      {activeTab === 'fil' && (
        <>
          {/* New Post Button */}
          <Button onClick={() => setShowNewPost(true)} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle publication
          </Button>

          {/* Categories Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategorie(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  filterCategorie === cat.id
                    ? 'bg-green-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.icon} {cat.nom}
              </button>
            ))}
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="p-4">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center text-xl">
                      {post.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-800">{post.auteur}</h3>
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <MapPin className="w-3 h-3" />
                        {post.region}
                        <span>•</span>
                        {formatDate(post.date)}
                      </div>
                    </div>
                  </div>
                  <Badge variant="default" className="text-[10px]">
                    {categories.find(c => c.id === post.categorie)?.icon} {categories.find(c => c.id === post.categorie)?.nom}
                  </Badge>
                </div>

                {/* Post Content */}
                <p className="text-stone-700 mb-4 whitespace-pre-wrap">{post.contenu}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-3 border-t border-stone-100">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 text-sm ${post.liked ? 'text-red-500' : 'text-stone-500 hover:text-red-500'} transition-colors`}
                  >
                    <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-1 text-sm text-stone-500 hover:text-green-600 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    {post.commentaires.length}
                  </button>
                  <button className="flex items-center gap-1 text-sm text-stone-500 hover:text-green-600 transition-colors ml-auto">
                    <Share2 className="w-4 h-4" />
                    Partager
                  </button>
                </div>

                {/* Comments */}
                {post.commentaires.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-stone-100 space-y-3">
                    {post.commentaires.map((comment) => (
                      <div key={comment.id} className="flex gap-2">
                        <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-stone-400" />
                        </div>
                        <div className="flex-1 bg-stone-50 rounded-lg p-2">
                          <p className="text-xs font-medium text-stone-700">{comment.auteur}</p>
                          <p className="text-sm text-stone-600">{comment.contenu}</p>
                          <p className="text-[10px] text-stone-400 mt-1">{formatDate(comment.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={commentInput[post.id] || ''}
                    onChange={e => setCommentInput({ ...commentInput, [post.id]: e.target.value })}
                    placeholder="Ajouter un commentaire..."
                    className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    onKeyPress={e => e.key === 'Enter' && handleAddComment(post.id)}
                  />
                  <button 
                    onClick={() => handleAddComment(post.id)}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeTab === 'cooperatives' && (
        <div className="space-y-4">
          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Rejoignez une coopérative!</h3>
            <p className="text-sm text-green-700 mb-3">
              Les coopératives vous permettent d'acheter en groupe à meilleur prix et de vendre vos produits plus facilement.
            </p>
            <Button variant="secondary" className="bg-white">
              <Plus className="w-4 h-4 mr-2" />
              Créer une coopérative
            </Button>
          </Card>

          <div className="space-y-3">
            {cooperatives.map((coop) => (
              <Card key={coop.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-stone-800">{coop.nom}</h3>
                    <div className="flex items-center gap-2 text-sm text-stone-500 mt-1">
                      <MapPin className="w-4 h-4" />
                      {coop.region}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-stone-600">
                        <Users className="w-4 h-4 inline mr-1" />
                        {coop.membres} membres
                      </span>
                      <span className="text-sm text-stone-600">
                        {coop.activite}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(coop.note) ? 'text-amber-400 fill-current' : 'text-stone-300'}`} 
                        />
                      ))}
                      <span className="text-sm text-stone-500 ml-1">{coop.note}</span>
                    </div>
                  </div>
                  <a 
                    href={`tel:${coop.contact}`}
                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* New Post Dialog */}
      <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle publication</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Catégorie</label>
              <select
                value={newPostCategorie}
                onChange={e => setNewPostCategorie(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {categories.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Votre message</label>
              <textarea
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                placeholder="Partagez votre expérience, posez une question..."
                rows={5}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowNewPost(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleNewPost} className="flex-1">
              Publier
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
