import React from 'react'
import confetti from 'canvas-confetti'
import {
  X,
  LifeBuoy,
  CheckCircle2,
  Sparkles,
  Coins
} from 'lucide-react'
import type { UserCard, LoyaltyProgram, EffortLevel } from '../types'
import { LOYALTY_CATALOG } from '../data/loyaltyCatalog'
import { calculateExpiry, calculateBalanceValuation } from '../utils/calculator'
import { useDeck } from '../context/DeckContext'

interface RescueModalProps {
  card: UserCard | null
  onClose: () => void
}

export const RescueModal: React.FC<RescueModalProps> = ({ card, onClose }) => {
  const { resetActivityClock } = useDeck()

  if (!card) return null

  const program: LoyaltyProgram | undefined = LOYALTY_CATALOG.find((p) => p.id === card.programId)
  const expiry = calculateExpiry(card, program)

  const brandColor = program?.brandColor || '#dc2626'
  const valCents = program?.valuationPerPointCents || 1.0
  const valuation = calculateBalanceValuation(card.approxBalance || 0, valCents)
  const pointUnit = program?.pointUnit || 'Points'

  const handleRescueActionCompleted = (_actionTitle: string) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#6366F1', '#F59E0B']
    })
    resetActivityClock(card.id)
    onClose()
  }

  const getEffortBadge = (effort: EffortLevel) => {
    switch (effort) {
      case 'instant_free':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
            ⚡ Instant & Free
          </span>
        )
      case 'low_cost':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
            💵 Low Cost ($1-$5)
          </span>
        )
      case 'transfer':
        return (
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold uppercase tracking-wider">
            🔄 Points Transfer
          </span>
        )
      case 'partner':
        return (
          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider">
            🤝 Partner Earn
          </span>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Hero */}
        <div
          className="p-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${brandColor}DD 0%, #0f172a 100%)`
          }}
        >
          <div className="pass-sheen absolute inset-0 opacity-30 pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/40 hover:bg-black/60 text-white/80 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-white/90 text-xs font-bold uppercase tracking-wider mb-2">
            <LifeBuoy className="w-4 h-4 text-amber-300" />
            <span>Rescue Plan & Loss Prevention</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Don't let {(card.approxBalance || 0).toLocaleString()} {pointUnit} burn!
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white font-semibold border border-white/20">
              Value at Risk: <strong className="text-amber-300">{valuation}</strong>
            </span>
            <span
              className={`px-3 py-1 rounded-full font-semibold border ${
                expiry.status === 'critical'
                  ? 'bg-rose-500/30 text-rose-200 border-rose-400/50'
                  : 'bg-amber-500/30 text-amber-200 border-amber-400/50'
              }`}
            >
              Expires: {expiry.formattedDate} ({expiry.statusText})
            </span>
          </div>
        </div>

        {/* Rescue Actions List */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 bg-slate-950">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Recommended Rescue Maneuvers
            </h4>
            <span className="text-[11px] text-slate-500">
              Reset your {program?.validityMonths || 24}-month timer today
            </span>
          </div>

          {program && program.rescueActions.length > 0 ? (
            <div className="space-y-3">
              {program.rescueActions.map((action, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        {getEffortBadge(action.effort)}
                        {action.partnerExample && (
                          <span className="text-[11px] text-slate-400 font-medium">
                            • {action.partnerExample}
                          </span>
                        )}
                      </div>
                      <h5 className="text-sm font-bold text-white tracking-tight">
                        {action.title}
                      </h5>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {action.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{action.actionHint || 'Resets full validity clock'}</span>
                    </span>

                    <button
                      onClick={() => handleRescueActionCompleted(action.title)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 hover:border-indigo-500 text-white text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>I Did This (Reset Clock)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <Coins className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-xs text-slate-300">
                To reset this program's clock, complete any qualifying earning or redemption activity (such as a partner transfer, shopping portal purchase, or booking).
              </p>
              <button
                onClick={() => handleRescueActionCompleted('Standard Activity')}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
              >
                Mark Activity Complete & Reset Clock
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            Zero credentials stored. ExpiryGuard calculates dates offline via public decay rules.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
