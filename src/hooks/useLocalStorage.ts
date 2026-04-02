import { useState, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}

export function usePoulailler() {
  const [poules, setPoules] = useLocalStorage('agro_poules', 125)
  const [pondeuses, setPondeuses] = useLocalStorage('agro_pondeuses', 82)
  const [stock, setStock] = useLocalStorage('agro_stock', { petit: 0, moyen: 0, gros: 0, extra: 0 })
  const [historique, setHistorique] = useLocalStorage<Array<{id: number, date: string, quantite: number, calibre: string, type: string, prixUnitaire?: number, total?: number}>>('agro_historique', [])

  const oeufsAttendus = Math.round(pondeuses * 0.72)
  const stockTotal = stock.petit + stock.moyen + stock.gros + stock.extra
  const revenuEstime = stockTotal * 380

  const ajouterOeufs = (nombre: number, calibre = 'moyen') => {
    if (nombre <= 0) return
    setStock(prev => ({ ...prev, [calibre]: prev[calibre as keyof typeof prev] + nombre }))
    const nouvelleEntree = {
      id: Date.now(),
      date: new Date().toISOString(),
      quantite: nombre,
      calibre,
      type: 'collecte'
    }
    setHistorique(prev => [nouvelleEntree, ...prev].slice(0, 100))
  }

  const vendreOeufs = (nombre: number, calibre = 'moyen', prixUnitaire = 380) => {
    if (stock[calibre as keyof typeof stock] < nombre) return false
    setStock(prev => ({ ...prev, [calibre]: prev[calibre as keyof typeof prev] - nombre }))
    const nouvelleVente = {
      id: Date.now(),
      date: new Date().toISOString(),
      quantite: nombre,
      calibre,
      prixUnitaire,
      total: nombre * prixUnitaire,
      type: 'vente'
    }
    setHistorique(prev => [nouvelleVente, ...prev].slice(0, 100))
    return true
  }

  const transfererCalibre = (from: string, to: string, quantite: number) => {
    if (stock[from as keyof typeof stock] < quantite) return false
    setStock(prev => ({ ...prev, [from]: prev[from as keyof typeof prev] - quantite, [to]: prev[to as keyof typeof prev] + quantite }))
    return true
  }

  return {
    poules, setPoules, pondeuses, setPondeuses, stock, stockTotal,
    oeufsAttendus, revenuEstime, historique,
    ajouterOeufs, vendreOeufs, transfererCalibre
  }
}
