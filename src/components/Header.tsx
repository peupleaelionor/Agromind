import { useState, useEffect } from 'react'
import { MapPin, Bell, X, Settings, User, LogOut } from 'lucide-react'
import { regions } from '../data/mockData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Logo from './Logo'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'alert'
  date: string
  read: boolean
}

export default function Header() {
  const [region, setRegion] = useLocalStorage('agro_region', 'kinshasa')
  const [showRegionMenu, setShowRegionMenu] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('agro_notifications', [
    { id: '1', title: 'Prix du maïs en hausse', message: 'Le prix du maïs a augmenté de 5% à Kinshasa', type: 'alert', date: new Date().toISOString(), read: false },
    { id: '2', title: 'Rappel vaccination', message: 'Vaccination des poules prévue demain', type: 'warning', date: new Date(Date.now() - 86400000).toISOString(), read: false },
    { id: '3', title: 'Nouveau conseil disponible', message: 'Comment optimiser la production d\'œufs', type: 'info', date: new Date(Date.now() - 172800000).toISOString(), read: true },
  ])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const regionName = regions.find(r => r.id === region)?.nom || 'Kinshasa'
  const unreadCount = notifications.filter(n => !n.read).length

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert': return '🔴'
      case 'warning': return '🟡'
      case 'success': return '🟢'
      default: return '🔵'
    }
  }

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Logo size="md" />
          
          <div className="flex flex-col items-center">
            <button 
              onClick={() => setShowRegionMenu(!showRegionMenu)} 
              className="flex items-center gap-1 text-sm text-stone-600 hover:text-green-600 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span className="font-medium">{regionName}</span>
            </button>
            <span className="text-[10px] text-stone-400">
              {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {/* Notifications */}
            <button 
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 text-stone-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {/* User Menu */}
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 text-stone-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
            >
              <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>
        </div>

        {/* Region Selector */}
        {showRegionMenu && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-stone-200 shadow-lg animate-slide-up">
            <div className="max-w-5xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-stone-800">Choisir votre région</p>
                  <p className="text-xs text-stone-500">Les prix et la météo seront adaptés</p>
                </div>
                <button onClick={() => setShowRegionMenu(false)} className="p-1 hover:bg-stone-100 rounded">
                  <X className="w-5 h-5 text-stone-400" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {regions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { 
                      setRegion(r.id); 
                      setShowRegionMenu(false); 
                      window.dispatchEvent(new CustomEvent('region-changed', { detail: r.id })) 
                    }}
                    className={`text-left px-3 py-3 rounded-xl text-sm transition-all ${
                      region === r.id 
                        ? 'bg-green-100 text-green-700 font-medium ring-2 ring-green-500 ring-offset-1' 
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span className="font-medium">{r.nom}</span>
                    <span className="text-xs text-stone-400 block">{r.province}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notifications Panel */}
        {showNotifs && (
          <div className="absolute top-full right-0 left-0 sm:left-auto sm:right-4 sm:w-80 bg-white border border-stone-200 shadow-xl rounded-b-xl sm:rounded-xl mt-1 z-50">
            <div className="p-3 border-b border-stone-100 flex items-center justify-between">
              <span className="font-semibold text-stone-800">Notifications</span>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-green-600 hover:text-green-700 font-medium"
                >
                  Tout marquer lu
                </button>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-4 text-center text-sm text-stone-400">Aucune notification</p>
              ) : (
                notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`w-full text-left p-3 border-b border-stone-50 hover:bg-stone-50 transition-colors ${
                      !notif.read ? 'bg-green-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{getNotificationIcon(notif.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notif.read ? 'font-semibold text-stone-800' : 'text-stone-700'}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-stone-500 line-clamp-2">{notif.message}</p>
                        <p className="text-[10px] text-stone-400 mt-1">
                          {new Date(notif.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      {!notif.read && <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1"></span>}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* User Menu */}
        {showUserMenu && (
          <div className="absolute top-full right-4 w-56 bg-white border border-stone-200 shadow-xl rounded-xl mt-1 z-50">
            <div className="p-3 border-b border-stone-100">
              <p className="font-semibold text-stone-800">Agriculteur AgroMind RDC</p>
              <p className="text-xs text-stone-500">agriculteur@agromind-rdc.cd</p>
            </div>
            <div className="p-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition-colors">
                <User className="w-4 h-4" />
                Mon profil
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
                Paramètres
              </button>
              <hr className="my-2 border-stone-100" />
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay to close menus */}
      {(showRegionMenu || showNotifs || showUserMenu) && (
        <div 
          className="fixed inset-0 z-[-1]" 
          onClick={() => { setShowRegionMenu(false); setShowNotifs(false); setShowUserMenu(false); }}
        />
      )}
    </header>
  )
}
