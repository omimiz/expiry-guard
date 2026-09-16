import React, { useState } from 'react'
import { Filter, ShieldCheck, ChevronsUpDown } from 'lucide-react'
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

  const [activeCardId, setActiveCardId] = useState<string | null>(null)
  const [isFanned, setIsFanned] = useState(false)

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
      <div className="py-24 px-4 text-center rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800 space-y-4 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-300">
          <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-serif-luxury font-semibold text-white">Your Folio is Empty</h3>
          <p className="text-xs text-zinc-400">
            Enroll your airline, hotel, and private membership assets to safeguard points capital.
          </p>
        </div>
        <button
          onClick={() => setIsDeckBuilderOpen(true)}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-white text-zinc-950 font-semibold text-xs shadow-sm transition cursor-pointer hover:bg-zinc-100"
        >
          <span>Curate First Asset</span>
        </button>
      </div>
    )
  }

  if (sortedCards.length === 0) {
    return (
      <div className="py-16 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-2">
        <Filter className="w-6 h-6 text-zinc-500 mx-auto" />
        <h4 className="text-xs font-serif-luxury font-medium text-zinc-200">No assets match this criteria</h4>
        <p className="text-[11px] text-zinc-500">Switch category or status filter to display portfolio assets.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {viewMode === 'deck' ? (
        /* Stacked Wallet Deck Mode */
        <div className="relative max-w-xl mx-auto pt-2 pb-16">
          <div className="flex items-center justify-between px-2 mb-3 text-xs text-zinc-400">
            <span className="font-mono text-[11px] tracking-wide">
              {isFanned ? 'Fanned View · Complete Access' : 'Stacked Folio · Tap any asset to focus'}
            </span>
            <button
              onClick={() => {
                setIsFanned(!isFanned)
                setActiveCardId(null)
              }}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition cursor-pointer text-[11px] font-medium"
            >
              <ChevronsUpDown className="w-3 h-3 text-zinc-400" />
              <span>{isFanned ? 'Compact Stack' : 'Fan All Cards'}</span>
            </button>
          </div>

          <div className="relative">
            {sortedCards.map((card, idx) => {
              const isSelected = activeCardId === card.id
              const marginTop = isFanned
                ? '16px'
                : idx === 0
                ? '0px'
                : isSelected
                ? '24px'
                : '-115px'

              return (
                <div
                  key={card.id}
                  onClick={() => {
                    if (!isFanned) {
                      setActiveCardId(isSelected ? null : card.id)
                    }
                  }}
                  className={`transition-all duration-300 relative cursor-pointer ${
                    isSelected ? 'ring-1 ring-white/30 rounded-2xl scale-[1.01] mb-6' : ''
                  }`}
                  style={{
                    marginTop: idx === 0 ? '0px' : marginTop,
                    zIndex: isSelected ? 40 : idx + 10
                  }}
                >
                  <PassCard card={card} isStacked={!isFanned} />
                </div>
              )
            })}
          </div>
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
