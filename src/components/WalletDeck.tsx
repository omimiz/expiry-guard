import React from 'react'
import { Filter, CreditCard } from 'lucide-react'
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
        const getRank = (status: string, days: number) => {
          if (status === 'critical') return 1000 - days
          if (status === 'warning') return 5000 - days
          if (status === 'healthy') return 10000 - days
          if (status === 'expired') return 100
          return 50000
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
      <div className="py-24 px-4 text-center rounded-2xl bg-zinc-900/30 border border-dashed border-zinc-800 space-y-4 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
          <CreditCard className="w-5 h-5 text-zinc-400 stroke-[1.5]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-white">Wallet Deck is Empty</h3>
          <p className="text-xs text-zinc-400">
            Add loyalty schemes to monitor expiration dates without credentials.
          </p>
        </div>
        <button
          onClick={() => setIsDeckBuilderOpen(true)}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs shadow-sm transition cursor-pointer"
        >
          <span>Add Your First Card</span>
        </button>
      </div>
    )
  }

  if (sortedCards.length === 0) {
    return (
      <div className="py-16 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-2">
        <Filter className="w-6 h-6 text-zinc-500 mx-auto" />
        <h4 className="text-xs font-medium text-zinc-300">No programs match this filter</h4>
        <p className="text-[11px] text-zinc-500">Switch category or status filter to see cards.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {viewMode === 'deck' ? (
        /* Stacked Wallet Deck Mode */
        <div className="relative max-w-xl mx-auto pt-4 pb-16">
          {sortedCards.map((card, idx) => (
            <div
              key={card.id}
              className="transition-all duration-300 relative"
              style={{
                marginTop: idx === 0 ? '0px' : '-130px',
                zIndex: idx + 10
              }}
            >
              <PassCard card={card} isStacked={true} />
            </div>
          ))}
        </div>
      ) : (
        /* Grid Layout Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {sortedCards.map((card) => (
            <PassCard key={card.id} card={card} isStacked={false} />
          ))}
        </div>
      )}
    </div>
  )
}
