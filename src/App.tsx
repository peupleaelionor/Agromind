import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Robbie from './components/Robbie'
import Dashboard from './pages/Dashboard'
import Poulailler from './pages/Poulailler'
import Cultures from './pages/Cultures'
import Marche from './pages/Marche'
import Veterinaire from './pages/Veterinaire'
import Finances from './pages/Finances'
import Taches from './pages/Taches'
import Conseils from './pages/Conseils'
import Communaute from './pages/Communaute'
import Calculatrice from './pages/Calculatrice'
import Menu from './pages/Menu'
import Programmes from './pages/Programmes'
import Formation from './pages/Formation'
import Contacts from './pages/Contacts'
import Actualites from './pages/Actualites'
import Meteo from './pages/Meteo'
import Partage from './pages/Partage'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-stone-50 to-amber-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/poulailler" element={<Poulailler />} />
          <Route path="/cultures" element={<Cultures />} />
          <Route path="/marche" element={<Marche />} />
          <Route path="/veterinaire" element={<Veterinaire />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/taches" element={<Taches />} />
          <Route path="/conseils" element={<Conseils />} />
          <Route path="/communaute" element={<Communaute />} />
          <Route path="/calculatrice" element={<Calculatrice />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/programmes" element={<Programmes />} />
          <Route path="/formation" element={<Formation />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/actualites" element={<Actualites />} />
          <Route path="/meteo" element={<Meteo />} />
          <Route path="/partage" element={<Partage />} />
        </Routes>
      </main>
      <Robbie />
      <Navigation />
    </div>
  )
}

export default App
