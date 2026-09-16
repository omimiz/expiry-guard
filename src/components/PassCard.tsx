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
  const brandColor = program?.brandColor || '#71717a'
  const pointUnit = program?.pointUnit || 'Points'
  const valCents = program?.valuationPerPointCents || 1.0
  const valuation = calculateBalanceValuation(card.approxBalance || 0, valCents)

  const handleResetClock = (e: React.MouseEvent) => {
    e.stopPropagation()

    confetti({
      particleCount: 35,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#a1a1aa', '#f4f4f5', '#d4d4d8']
    })

    resetActivityClock(card.id)
    setJustReset(true)
    setTimeout(() => setJustReset(false), 2000)
  }

  const getStatusBadge = () => {
    switch (expiry.status) {
      case 'critical':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>{expiry.daysRemaining <= 1 ? '1d left' : `${expiry.daysRemaining}d left`}</span>
          </span>
        )
      case 'warning':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>{expiry.daysRemaining}d left</span>
          </span>
        )
      case 'expired':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/60 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            <span>Expired</span>
          </span>
        )
      case 'immortal':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700/50 text-[11px] font-medium">
            <span>No expiry</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700/50 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
            <span>{expiry.daysRemaining > 60 ? `${Math.floor(expiry.daysRemaining / 30.4)}mo left` : `${expiry.daysRemaining}d left`}</span>
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
      className={`relative rounded-2xl bg-[#121215] border border-zinc-800/90 hover:border-zinc-700 transition-all duration-200 select-none flex flex-col justify-between overflow-hidden group ${
        isStacked ? 'hover:-translate-y-3 shadow-2xl' : 'shadow-sm hover:shadow-md'
      }`}
    >
      {/* Subtle top edge accent representing the loyalty scheme brand color */}
      <div
        className="h-1 w-full"
        style={{ backgroundColor: brandColor }}
      />

      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-5">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColor }} />
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                {program?.category || 'Loyalty'}
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
                  className="p-1 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition cursor-pointer"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-1.5 w-40 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl py-1 z-30">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowMenu(false)
                        setEditingCard(card)
                      }}
                      className="w-full px-3 py-2 text-left text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center space-x-2 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Edit details</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowMenu(false)
                        if (confirm(`Remove ${programName} from deck?`)) {
                          removeCard(card.id)
                        }
                      }}
                      className="w-full px-3 py-2 text-left text-xs text-rose-400 hover:text-rose-300 hover:bg-zinc-800 flex items-center space-x-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete card</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Program Name */}
          <h3 className="text-base sm:text-lg font-semibold text-zinc-100 tracking-tight">
            {programName}
          </h3>

          {/* Numeric Balance */}
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-white font-mono">
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

        {/* Expiration Details & Subtle Timeline */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>
              Expires: <span className="text-zinc-300 font-medium">{expiry.formattedDate}</span>
            </span>
            <span>
              Active: <span className="text-zinc-300">{formattedActivity}</span>
            </span>
          </div>

          {!expiry.isImmortal && (
            <div className="w-full bg-zinc-800/80 rounded-full h-1 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  expiry.status === 'critical'
                    ? 'bg-rose-400'
                    : expiry.status === 'warning'
                    ? 'bg-amber-400'
                    : 'bg-zinc-400'
                }`}
                style={{ width: `${expiry.progressPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Card Actions Footer */}
        <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between gap-2">
          {/* Quick Rescue Guide */}
          {program && program.rescueActions.length > 0 ? (
            <button
              onClick={() => setActiveRescueCard(card)}
              className="flex-1 py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-zinc-400" />
              <span>Rescue Guide</span>
            </button>
          ) : (
            <div className="flex-1" />
          )}

          {/* I Used This Card / Reset Clock */}
          <button
            onClick={handleResetClock}
            disabled={justReset}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              justReset
                ? 'bg-zinc-800 text-emerald-300 border border-zinc-700'
                : 'bg-zinc-100 hover:bg-white text-zinc-950 shadow-sm'
            }`}
          >
            {justReset ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reset!</span>
              </>
            ) : (
              <>
                <RotateCw className="w-3.5 h-3.5 text-zinc-600" />
                <span>Reset Clock</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
