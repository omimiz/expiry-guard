import React from 'react'
import { Sparkles, Filter, Inbox } from 'lucide-react'
import { useDeck } from '../context/DeckContext'
import { PassCard } from './PassCard'
import { LOYALTY_CATALOG } from '../data/loyaltyCatalog'
import { calculateExpiry } from '../utils/calculator'

export const WalletDeck: React.FC = () => {
  const {
    cards,
    filterCategory,
    filterStatus,
    sortBy,
    viewMode,
    setIsDeckBuilderOpen
  } = useDeck()

  // Filter cards
  const filteredCards = cards.filter((card) => {
    const program = LOYALTY_CATALOG.find((p) => p.id === card.programId)
    const expiry = calculateExpiry(card, program)

    // Category filter
    if (filterCategory !== 'all') {
      const cardCat = program?.category || 'retail'
      if (cardCat !== filterCategory) return false
    }

    // Status filter
    if (filterStatus === 'urgent') {
      return expiry.status === 'critical' || expiry.status === 'warning'
    } else if (filterStatus === 'healthy') {
      return expiry.status === 'healthy' || expiry.status === 'immortal'
    } else if (filterStatus === 'expired') {
      return expiry.status === 'expired'
    }

    return true
  })

  // Sort cards
  const sortedCards = [...filteredCards].sort((a, b) => {
    const progA = LOYALTY_CATALOG.find((p) => p.id === a.programId)
    const progB = LOYALTY_CATALOG.find((p) => p.id === b.programId)
    const expA = calculateExpiry(a, progA)
    const expB = calculateExpiry(b, progB)

    switch (sortBy) {
      case 'urgency': {
        // Expired or Critical first, then Warning, then Healthy, then Immortal
        const getRank = (status: string, days: number) => {
          if (status === 'critical') return 1000 - days
          if (status === 'warning') return 5000 - days
          if (status === 'healthy') return 10000 - days
          if (status === 'expired') return 100 // show expired near top or bottom
          return 50000 // immortal
        }
        return getRank(expA.status, expA.daysRemaining) - getRank(expB.status, expB.daysRemaining)
      }
      case 'balance_desc':
        return (b.approxBalance || 0) - (a.approxBalance || 0)
      case 'balance_asc':
        return (a.approxBalance || 0) - (b.approxBalance || 0)
      case 'name': {
        const nameA = progA?.name || a.customProgramName || ''
        const nameB = progB?.name || b.customProgramName || ''
        return nameA.localeCompare(nameB)
      }
      case 'category': {
        const catA = progA?.category || ''
        const catB = progB?.category || ''
        return catA.localeCompare(catB)
      }
      default:
        return 0
    }
  })

  if (cards.length === 0) {
    return (
      <div className="py-20 px-4 text-center rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 space-y-4 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
          <Inbox className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">Your Wallet Deck is Empty</h3>
          <p className="text-sm text-slate-400">
            Start protecting your rewards wealth in 60 seconds with zero passwords.
          </p>
        </div>
        <button
          onClick={() => setIsDeckBuilderOpen(true)}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-sm shadow-xl shadow-rose-600/30 hover:shadow-rose-600/50 transition cursor-pointer active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch 60-Second Deck Builder</span>
        </button>
      </div>
    )
  }

  if (sortedCards.length === 0) {
    return (
      <div className="py-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
        <Filter className="w-8 h-8 text-slate-500 mx-auto" />
        <h4 className="text-base font-semibold text-white">No loyalty cards match this filter</h4>
        <p className="text-xs text-slate-400">Try switching your category or urgency filter above.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cards View Rendering */}
      {viewMode === 'deck' ? (
        /* Stacked Wallet Deck Mode */
        <div className="relative max-w-2xl mx-auto pt-6 pb-20">
          {sortedCards.map((card, idx) => (
            <div
              key={card.id}
              className="transition-all duration-300 relative cursor-pointer"
              style={{
                marginTop: idx === 0 ? '0px' : '-160px',
                zIndex: idx + 10
              }}
            >
              <PassCard card={card} index={idx} isStacked={true} />
            </div>
          ))}
        </div>
      ) : (
        /* Grid Layout Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {sortedCards.map((card, idx) => (
            <PassCard key={card.id} card={card} index={idx} isStacked={false} />
          ))}
        </div>
      )}
    </div>
  )
}
