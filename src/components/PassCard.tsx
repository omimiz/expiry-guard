import React, { useState } from 'react'
import confetti from 'canvas-confetti'
import {
  Plane,
  Hotel,
  Coffee,
  ShoppingBag,
  CreditCard,
  Sparkles,
  RotateCw,
  LifeBuoy,
  Calendar,
  MoreVertical,
  Trash2,
  Edit2,
  CheckCircle2,
  ShieldCheck
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

  // Find program metadata
  const program: LoyaltyProgram | undefined = LOYALTY_CATALOG.find((p) => p.id === card.programId)
  const expiry: ExpirationCalculation = calculateExpiry(card, program)

  // Program visuals
  const programName = program?.name || card.customProgramName || 'Custom Loyalty'
  const brandColor = program?.brandColor || '#3b82f6'
  const accentColor = program?.accentColor || '#1e1b4b'
  const pointUnit = program?.pointUnit || 'Points'
  const valCents = program?.valuationPerPointCents || 1.0
  const valuation = calculateBalanceValuation(card.approxBalance || 0, valCents)

  const renderIcon = () => {
    const iconKey = program?.iconKey || 'sparkles'
    const cls = 'w-4 h-4'
    switch (iconKey) {
      case 'plane':
        return <Plane className={cls} />
      case 'hotel':
        return <Hotel className={cls} />
      case 'coffee':
        return <Coffee className={cls} />
      case 'shopping-bag':
        return <ShoppingBag className={cls} />
      case 'credit-card':
        return <CreditCard className={cls} />
      default:
        return <Sparkles className={cls} />
    }
  }

  const handleResetClock = (e: React.MouseEvent) => {
    e.stopPropagation()

    // Trigger celebratory confetti burst
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#3B82F6', '#F59E0B', '#EC4899']
    })

    resetActivityClock(card.id)
    setJustReset(true)
    setTimeout(() => setJustReset(false), 2200)
  }

  const getStatusBadge = () => {
    switch (expiry.status) {
      case 'critical':
        return (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/25 border border-rose-500/50 text-rose-200 text-xs font-bold tracking-wide shadow-lg shadow-rose-900/50 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span>{expiry.statusText}</span>
          </div>
        )
      case 'warning':
        return (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/25 border border-amber-500/50 text-amber-200 text-xs font-bold tracking-wide shadow-md shadow-amber-950/40">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{expiry.statusText}</span>
          </div>
        )
      case 'expired':
        return (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-600 text-slate-400 text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            <span>{expiry.statusText}</span>
          </div>
        )
      case 'immortal':
        return (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/25 border border-indigo-400/40 text-indigo-200 text-xs font-semibold tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
            <span>Never Expires</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{expiry.statusText}</span>
          </div>
        )
    }
  }

  // Format last activity date nicely
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
      className={`relative rounded-3xl overflow-hidden transition-all duration-300 shadow-xl border select-none group ${
        isStacked ? 'hover:-translate-y-4 hover:shadow-2xl' : 'hover:-translate-y-1.5 hover:shadow-2xl'
      } ${
        expiry.status === 'critical'
          ? 'border-rose-500/40 ring-1 ring-rose-500/20 shadow-rose-950/40'
          : expiry.status === 'warning'
          ? 'border-amber-500/30 shadow-amber-950/30'
          : 'border-slate-700/60 shadow-black/40'
      }`}
      style={{
        background: `linear-gradient(145deg, ${brandColor}EE 0%, ${accentColor} 85%, #0a0e1a 100%)`
      }}
    >
      {/* Gloss / Sheen overlay */}
      <div className="pass-sheen absolute inset-0 opacity-40 pointer-events-none" />

      {/* Decorative top pass notch accent */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="relative p-5 sm:p-6 flex flex-col justify-between h-full min-h-[300px]">
        {/* Card Header */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 text-white text-xs font-semibold flex items-center space-x-1.5">
                {renderIcon()}
                <span className="uppercase tracking-wider text-[11px] font-bold">
                  {program?.shortCode || 'CARD'}
                </span>
              </span>
              <span className="text-xs text-white/70 font-medium capitalize">
                {program?.category || 'Loyalty'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {getStatusBadge()}

              {/* Menu button */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(!showMenu)
                  }}
                  className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-black/30 transition cursor-pointer"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-2xl py-1 z-30">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowMenu(false)
                        setEditingCard(card)
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center space-x-2 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Card / Balance</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowMenu(false)
                        if (confirm(`Remove ${programName} from your deck?`)) {
                          removeCard(card.id)
                        }
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 flex items-center space-x-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Card</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Program Name & Balances */}
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
              {programName}
            </h3>
            <div className="mt-2 flex items-baseline space-x-2.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow">
                {(card.approxBalance || 0).toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-white/80">{pointUnit}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-sm text-white/90 border border-white/10">
                ≈ {valuation}
              </span>
            </div>
          </div>
        </div>

        {/* Expiry Details & Timeline Progress */}
        <div className="my-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-white/80">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-white/60" />
              <span>Expires: <strong className="text-white">{expiry.formattedDate}</strong></span>
            </div>
            <div className="text-[11px] text-white/60">
              Active: {formattedActivity}
            </div>
          </div>

          {/* Lifespan Remaining Bar (unless immortal) */}
          {!expiry.isImmortal && (
            <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/10 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  expiry.status === 'critical'
                    ? 'bg-gradient-to-r from-rose-500 to-rose-400 shadow-sm shadow-rose-500/50'
                    : expiry.status === 'warning'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                }`}
                style={{ width: `${expiry.progressPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Card Actions Bottom Bar */}
        <div className="pt-3 border-t border-white/15 flex items-center justify-between gap-2.5">
          {/* Quick Rescue Button */}
          {program && program.rescueActions.length > 0 && (
            <button
              onClick={() => setActiveRescueCard(card)}
              className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-98 border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
              title="View quick ways to reset this clock"
            >
              <LifeBuoy className="w-3.5 h-3.5 text-amber-300" />
              <span>Quick Rescue</span>
            </button>
          )}

          {/* I Used This Card / Reset Clock Button */}
          <button
            onClick={handleResetClock}
            disabled={justReset}
            className={`flex-1 py-2 px-3 rounded-xl active:scale-98 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg ${
              justReset
                ? 'bg-emerald-500 text-white border border-emerald-400 ring-2 ring-emerald-300/40'
                : 'bg-white text-slate-900 hover:bg-slate-100 hover:shadow-white/20'
            }`}
            title="Bump activity date to today and reset the expiration clock"
          >
            {justReset ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-white animate-bounce" />
                <span>Reset Clock! ✨</span>
              </>
            ) : (
              <>
                <RotateCw className="w-3.5 h-3.5 text-slate-800 group-hover:rotate-180 transition-transform duration-500" />
                <span>I Used This Card</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
