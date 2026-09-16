import React, { createContext, useContext, useState, useEffect } from 'react'
import type { UserCard, FilterStatus, SortOption } from '../types'
import { LOYALTY_CATALOG } from '../data/loyaltyCatalog'

interface DeckContextType {
  cards: UserCard[]
  addCard: (card: Omit<UserCard, 'id' | 'createdAt'>) => void
  updateCard: (id: string, updates: Partial<UserCard>) => void
  removeCard: (id: string) => void
  resetActivityClock: (id: string) => void
  loadStarterDeck: (programIds: string[]) => void
  clearDeck: () => void
  exportDeck: () => string
  importDeck: (jsonStr: string) => { success: boolean; count?: number; error?: string }
  activeRescueCard: UserCard | null
  setActiveRescueCard: (card: UserCard | null) => void
  editingCard: UserCard | null
  setEditingCard: (card: UserCard | null) => void
  isDeckBuilderOpen: boolean
  setIsDeckBuilderOpen: (open: boolean) => void
  filterCategory: string
  setFilterCategory: (cat: string) => void
  filterStatus: FilterStatus
  setFilterStatus: (status: FilterStatus) => void
  sortBy: SortOption
  setSortBy: (sort: SortOption) => void
  viewMode: 'deck' | 'grid'
  setViewMode: (mode: 'deck' | 'grid') => void
}

const STORAGE_KEY = 'expiryguard_user_deck_v2'

// Initial realistic default deck to give immediate delight and show urgency states
const INITIAL_DEMO_CARDS: UserCard[] = [
  {
    id: 'demo-1',
    programId: 'marriott-bonvoy',
    approxBalance: 34500,
    // 22.5 months ago -> ~45 days left (Warning status)
    lastActivityDate: (() => {
      const d = new Date()
      d.setMonth(d.getMonth() - 22)
      d.setDate(d.getDate() - 15)
      return d.toISOString().split('T')[0]
    })(),
    notes: 'Saved up from business travel stays',
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-2',
    programId: 'starbucks-rewards',
    approxBalance: 210,
    // 5.7 months ago -> ~9 days left (Critical status)
    lastActivityDate: (() => {
      const d = new Date()
      d.setMonth(d.getMonth() - 5)
      d.setDate(d.getDate() - 22)
      return d.toISOString().split('T')[0]
    })(),
    notes: 'Enough stars for 2 free handcrafted drinks',
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-3',
    programId: 'emirates-skywards',
    approxBalance: 52000,
    // 14 months ago -> ~22 months left (Healthy status)
    lastActivityDate: (() => {
      const d = new Date()
      d.setMonth(d.getMonth() - 14)
      return d.toISOString().split('T')[0]
    })(),
    notes: 'Planning upgrade on DXB to LHR flight',
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-4',
    programId: 'carrefour-share',
    approxBalance: 1250,
    // Activity within past 3 months (Healthy status)
    lastActivityDate: (() => {
      const d = new Date()
      d.setMonth(d.getMonth() - 3)
      return d.toISOString().split('T')[0]
    })(),
    notes: 'Weekly grocery earnings',
    createdAt: new Date().toISOString()
  }
]

const DeckContext = createContext<DeckContextType | undefined>(undefined)

export const DeckProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<UserCard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch (e) {
      console.error('Failed to load cards from storage', e)
    }
    return INITIAL_DEMO_CARDS
  })

  const [activeRescueCard, setActiveRescueCard] = useState<UserCard | null>(null)
  const [editingCard, setEditingCard] = useState<UserCard | null>(null)
  const [isDeckBuilderOpen, setIsDeckBuilderOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [sortBy, setSortBy] = useState<SortOption>('urgency')
  const [viewMode, setViewMode] = useState<'deck' | 'grid'>('grid')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
    } catch (e) {
      console.error('Failed to persist cards', e)
    }
  }, [cards])

  const addCard = (newCardData: Omit<UserCard, 'id' | 'createdAt'>) => {
    const card: UserCard = {
      ...newCardData,
      id: 'card-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString()
    }
    setCards((prev) => [card, ...prev])
  }

  const updateCard = (id: string, updates: Partial<UserCard>) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, ...updates } : card))
    )
  }

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id))
    if (activeRescueCard?.id === id) setActiveRescueCard(null)
    if (editingCard?.id === id) setEditingCard(null)
  }

  const resetActivityClock = (id: string) => {
    const todayStr = new Date().toISOString().split('T')[0]
    setCards((prev) =>
      prev.map((card) =>
        card.id === id
          ? {
              ...card,
              lastActivityDate: todayStr
            }
          : card
      )
    )
  }

  const loadStarterDeck = (programIds: string[]) => {
    const todayStr = new Date().toISOString().split('T')[0]
    const newCards: UserCard[] = programIds
      .map((pid) => {
        const prog = LOYALTY_CATALOG.find((p) => p.id === pid)
        if (!prog) return null
        return {
          id: 'card-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
          programId: pid,
          approxBalance: 15000,
          lastActivityDate: todayStr,
          createdAt: new Date().toISOString()
        }
      })
      .filter((c): c is UserCard => c !== null)

    setCards(newCards)
  }

  const clearDeck = () => {
    setCards([])
  }

  const exportDeck = (): string => {
    return JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        cards
      },
      null,
      2
    )
  }

  const importDeck = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr)
      const importedCards = data.cards || data
      if (Array.isArray(importedCards)) {
        // Validate each card has required fields
        const validCards = importedCards.filter(
          (c) => c && typeof c.programId === 'string' && typeof c.lastActivityDate === 'string'
        )
        if (validCards.length === 0) {
          return { success: false, error: 'No valid loyalty cards found in file.' }
        }
        setCards(validCards)
        return { success: true, count: validCards.length }
      }
      return { success: false, error: 'Invalid file format: expected array of cards.' }
    } catch {
      return { success: false, error: 'JSON parsing failed. Please verify the file.' }
    }
  }

  return (
    <DeckContext.Provider
      value={{
        cards,
        addCard,
        updateCard,
        removeCard,
        resetActivityClock,
        loadStarterDeck,
        clearDeck,
        exportDeck,
        importDeck,
        activeRescueCard,
        setActiveRescueCard,
        editingCard,
        setEditingCard,
        isDeckBuilderOpen,
        setIsDeckBuilderOpen,
        filterCategory,
        setFilterCategory,
        filterStatus,
        setFilterStatus,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode
      }}
    >
      {children}
    </DeckContext.Provider>
  )
}

export const useDeck = () => {
  const ctx = useContext(DeckContext)
  if (!ctx) {
    throw new Error('useDeck must be used within a DeckProvider')
  }
  return ctx
}
