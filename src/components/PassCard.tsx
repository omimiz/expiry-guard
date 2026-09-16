import React, { useState } from 'react'
import confetti from 'canvas-confetti'
import {
  MoreHorizontal,
  Trash2,
  Edit2,
  Check,
  RotateCw,
  Compass
} from 'lucide-react'
import type { UserCard, LoyaltyProgram, ExpirationCalculation } from '../types'
import { LOYALTY_CATALOG } from '../data/loyaltyCatalog'
import { calculateExpiry, calculateBalanceValuation } from '../utils/calculator'
import { useDeck } from '../context/DeckContext'

interface PassCardProps {
  card: UserCard
  index?: number
  isStacked?: boolean
}

export const PassCard: React.FC<PassCardProps> = ({ card, isStacked = false }) => {
  const { resetActivityClock, removeCard, setActiveRescueCard, setEditingCard } = useDeck()
  const [showMenu, setShowMenu] = useState(false)
  const [justReset, setJustReset] = useState(false)

  const program: LoyaltyProgram | undefined = LOYALTY_CATALOG.find((p) => p.id === card.programId)
  const expiry: ExpirationCalculation = calculateExpiry(card, program)

  const programName = program?.name || card.customProgramName || 'Loyalty Card'
  const brandColor = program?.brandColor || '#c5a880'
  const pointUnit = program?.pointUnit || 'Points'
  const valCents = program?.valuationPerPointCents || 1.0
  const valuation = calculateBalanceValuation(card.approxBalance || 0, valCents)

  const handleResetClock = (e: React.MouseEvent) => {
    e.stopPropagation()

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#D4AF37', '#F3E7D3', '#AA823E', '#FFFFFF']
    })

    resetActivityClock(card.id)
    setJustReset(true)
    setTimeout(() => setJustReset(false), 2000)
  }

  const getStatusBadge = () => {
    switch (expiry.status) {
      case 'critical':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-rose-950/40 text-rose-300 border border-rose-800/40 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>{expiry.daysRemaining <= 1 ? '1d left' : `${expiry.daysRemaining}d remaining`}</span>
          </span>
        )
      case 'warning':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#2a1d0f] text-[#f3e7d3] border border-[#c5a880]/30 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            <span>{expiry.daysRemaining}d remaining</span>
          </span>
        )
      case 'expired':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800 text-[10px] font-mono">
            <span>Expired</span>
          </span>
        )
      case 'immortal':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#161513] text-[#c5a880] border border-[#c5a880]/20 text-[10px] font-mono">
            <span>Perpetual</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#121411] text-emerald-300 border border-emerald-800/30 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{expiry.daysRemaining > 60 ? `${Math.floor(expiry.daysRemaining / 30.4)}mo validity` : `${expiry.daysRemaining}d left`}</span>
          </span>
        )
    }
  }

  const formattedActivity = (() => {
    try {
      const [y, m, d] = card.lastActivityDate.split('-').map(Number)
      return new Date(y, m - 1, d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return card.lastActivityDate
    }
  })()

  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-b from-[#131318] via-[#0e0e12] to-[#08080a] border border-[#c5a880]/20 hover:border-[#c5a880]/50 transition-all duration-300 select-none flex flex-col justify-between overflow-hidden shadow-lg group ${
        isStacked ? 'hover:-translate-y-3 shadow-2xl' : 'hover:shadow-xl'
      }`}
    >
      {/* Top Hairline Brand Foil Accent */}
      <div
        className="h-1 w-full opacity-80"
        style={{
          background: `linear-gradient(90deg, ${brandColor} 0%, rgba(212, 175, 55, 0.6) 50%, ${brandColor} 100%)`
        }}
      />

      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-5">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span
                className="w-2 h-2 rounded-full ring-2 ring-[#c5a880]/20"
                style={{ backgroundColor: brandColor }}
              />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880]/90">
                {program?.category || 'Asset'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {getStatusBadge()}

              {/* Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(!showMenu)
                  }}
                  className="p-1 rounded-lg text-zinc-500 hover:text-[#f3e7d3] hover:bg-[#1f1e1a] transition cursor-pointer"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-[#141311] border border-[#c5a880]/30 shadow-2xl py-1 z-30">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowMenu(false)
                        setEditingCard(card)
                      }}
                      className="w-full px-3 py-2 text-left text-xs text-[#e5d3b3] hover:text-white hover:bg-[#1f1d19] flex items-center space-x-2 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#c5a880]" />
                      <span>Adjust asset balance</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowMenu(false)
                        if (confirm(`Remove ${programName} from folio?`)) {
                          removeCard(card.id)
                        }
                      }}
                      className="w-full px-3 py-2 text-left text-xs text-rose-400 hover:text-rose-300 hover:bg-[#1f1d19] flex items-center space-x-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove asset</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scheme Name */}
          <h3 className="text-base sm:text-lg font-serif-luxury font-semibold text-[#f3e7d3] tracking-tight">
            {programName}
          </h3>

          {/* Capital Balance */}
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-mono font-semibold tracking-tight text-white">
              {(card.approxBalance || 0).toLocaleString()}
            </span>
            <span className="text-xs text-[#c5a880] font-medium">
              {pointUnit}
            </span>
            <span className="text-xs text-zinc-400 font-normal">
              · ≈ {valuation}
            </span>
          </div>
        </div>

        {/* Expiration Details & Subtle Progress Line */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
            <span>
              Expires: <span className="text-[#f3e7d3]">{expiry.formattedDate}</span>
            </span>
            <span>
              Active: <span className="text-zinc-300">{formattedActivity}</span>
            </span>
          </div>

          {!expiry.isImmortal && (
            <div className="w-full bg-[#1b1a18] rounded-full h-1 overflow-hidden border border-[#c5a880]/10">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  expiry.status === 'critical'
                    ? 'bg-rose-400'
                    : expiry.status === 'warning'
                    ? 'bg-[#d4af37]'
                    : 'bg-[#c5a880]/80'
                }`}
                style={{ width: `${expiry.progressPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Card Actions Footer */}
        <div className="pt-3.5 border-t border-[#c5a880]/15 flex items-center justify-between gap-2.5">
          {/* Preservation Guide */}
          {program && program.rescueActions.length > 0 ? (
            <button
              onClick={() => setActiveRescueCard(card)}
              className="flex-1 py-1.5 px-3 rounded-lg bg-[#141311] hover:bg-[#1a1916] border border-[#c5a880]/25 text-[#e5d3b3] hover:text-[#f3e7d3] text-xs font-medium transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Preservation</span>
            </button>
          ) : (
            <div className="flex-1" />
          )}

          {/* Renew Validity / Log Activity */}
          <button
            onClick={handleResetClock}
            disabled={justReset}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm ${
              justReset
                ? 'bg-[#1b1916] text-[#d4af37] border border-[#d4af37]/50'
                : 'bg-gradient-to-r from-[#d4af37] to-[#aa823e] hover:from-[#e5c158] hover:to-[#be9448] text-[#0d0c0a]'
            }`}
          >
            {justReset ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Validity Extended</span>
              </>
            ) : (
              <>
                <RotateCw className="w-3.5 h-3.5 text-[#0d0c0a]" />
                <span>Renew Validity</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
