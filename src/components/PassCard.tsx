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
  const brandColor = program?.brandColor || '#a1a1aa'
  const pointUnit = program?.pointUnit || 'Points'
  const valCents = program?.valuationPerPointCents || 1.0
  const valuation = calculateBalanceValuation(card.approxBalance || 0, valCents)

  const handleResetClock = (e: React.MouseEvent) => {
    e.stopPropagation()

    // Cool platinum / silver / white particle burst
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#ffffff', '#f4f4f5', '#e4e4e7', '#a1a1aa', '#71717a']
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
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-zinc-850 text-zinc-200 border border-zinc-700/60 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            <span>{expiry.daysRemaining}d remaining</span>
          </span>
        )
      case 'expired':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-800 text-[10px] font-mono">
            <span>Expired</span>
          </span>
        )
      case 'immortal':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800 text-[10px] font-mono">
            <span>Perpetual</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800 text-[10px] font-mono">
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
      className={`relative rounded-2xl bg-[#111114] border border-white/[0.08] hover:border-zinc-700 transition-all duration-300 select-none flex flex-col justify-between overflow-hidden shadow-lg group ${
        isStacked ? 'hover:-translate-y-3 shadow-2xl' : 'hover:shadow-xl'
      }`}
    >
      {/* Top Hairline Brand Accent */}
      <div
        className="h-1 w-full opacity-70"
        style={{
          background: `linear-gradient(90deg, ${brandColor} 0%, rgba(255, 255, 255, 0.4) 50%, ${brandColor} 100%)`
        }}
      />

      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-5">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span
                className="w-2 h-2 rounded-full ring-2 ring-white/10"
                style={{ backgroundColor: brandColor }}
              />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
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
                  className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl py-1 z-30">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowMenu(false)
                        setEditingCard(card)
                      }}
                      className="w-full px-3 py-2 text-left text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center space-x-2 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
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
                      className="w-full px-3 py-2 text-left text-xs text-rose-400 hover:text-rose-300 hover:bg-zinc-800 flex items-center space-x-2 cursor-pointer"
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
          <h3 className="text-base sm:text-lg font-serif-luxury font-semibold text-white tracking-tight">
            {programName}
          </h3>

          {/* Capital Balance */}
          <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-2xl sm:text-3xl font-mono font-semibold tracking-tight text-white">
              {(card.approxBalance || 0).toLocaleString()}
            </span>
            <span className="text-xs text-zinc-400 font-medium">
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
              Expires: <span className="text-zinc-200">{expiry.formattedDate}</span>
            </span>
            <span>
              Active: <span className="text-zinc-400">{formattedActivity}</span>
            </span>
          </div>

          {!expiry.isImmortal && (
            <div className="w-full bg-zinc-800/80 rounded-full h-1 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  expiry.status === 'critical'
                    ? 'bg-rose-400'
                    : expiry.status === 'warning'
                    ? 'bg-zinc-300'
                    : 'bg-zinc-400'
                }`}
                style={{ width: `${expiry.progressPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Card Actions Footer */}
        <div className="pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-2 sm:gap-2.5">
          {/* Preservation Guide */}
          {program && program.rescueActions.length > 0 ? (
            <button
              onClick={() => setActiveRescueCard(card)}
              className="flex-1 min-h-[38px] py-1.5 px-2.5 sm:px-3 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap"
            >
              <Compass className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>Preservation</span>
            </button>
          ) : (
            <div className="flex-1" />
          )}

          {/* Renew Validity */}
          <button
            onClick={handleResetClock}
            disabled={justReset}
            className={`flex-1 min-h-[38px] py-1.5 px-2.5 sm:px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm whitespace-nowrap ${
              justReset
                ? 'bg-zinc-800 text-emerald-300 border border-zinc-700'
                : 'bg-white hover:bg-zinc-100 text-zinc-950 active:scale-98'
            }`}
          >
            {justReset ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Validity Extended</span>
              </>
            ) : (
              <>
                <RotateCw className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                <span>Renew Validity</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
