import React from 'react'
import confetti from 'canvas-confetti'
import {
  X,
  Check,
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

  const programName = program?.name || card.customProgramName || 'Loyalty Card'
  const brandColor = program?.brandColor || '#71717a'
  const valCents = program?.valuationPerPointCents || 1.0
  const valuation = calculateBalanceValuation(card.approxBalance || 0, valCents)
  const pointUnit = program?.pointUnit || 'Points'

  const handleRescueActionCompleted = (_actionTitle: string) => {
    confetti({
      particleCount: 35,
      spread: 45,
      origin: { y: 0.7 },
      colors: ['#a1a1aa', '#f4f4f5']
    })
    resetActivityClock(card.id)
    onClose()
  }

  const getEffortTag = (effort: EffortLevel) => {
    switch (effort) {
      case 'instant_free':
        return (
          <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-md">
            Free & Instant
          </span>
        )
      case 'low_cost':
        return (
          <span className="text-[10px] font-medium text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-md">
            Low Cost ($1–$5)
          </span>
        )
      case 'transfer':
        return (
          <span className="text-[10px] font-medium text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded-md">
            Points Transfer
          </span>
        )
      case 'partner':
        return (
          <span className="text-[10px] font-medium text-zinc-300 bg-zinc-800/80 border border-zinc-700/60 px-2 py-0.5 rounded-md">
            Partner Earn
          </span>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#111114] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800/80 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: brandColor }} />
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                {programName}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-white tracking-tight">
              Preserve {(card.approxBalance || 0).toLocaleString()} {pointUnit}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Estimated value ≈ <strong className="text-zinc-200">{valuation}</strong> · {expiry.statusText} ({expiry.formattedDate})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rescue Actions List */}
        <div className="p-5 sm:p-6 space-y-3.5 overflow-y-auto flex-1">
          <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
            Recommended Rescue Actions
          </div>

          {program && program.rescueActions.length > 0 ? (
            program.rescueActions.map((action, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-100">
                    {action.title}
                  </span>
                  {getEffortTag(action.effort)}
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {action.description}
                </p>

                {action.partnerExample && (
                  <div className="text-[11px] text-zinc-400">
                    Partner: <span className="text-zinc-300">{action.partnerExample}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400">
                    {action.actionHint || 'Resets validity period'}
                  </span>
                  <button
                    onClick={() => handleRescueActionCompleted(action.title)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-medium border border-zinc-700/60 transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Done, reset clock</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-zinc-400 space-y-2">
              <Coins className="w-6 h-6 text-zinc-500 mx-auto" />
              <p>Complete any qualifying activity with this program to extend points.</p>
              <button
                onClick={() => handleRescueActionCompleted('Activity')}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 text-xs font-medium mt-2"
              >
                Reset Clock
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950 flex items-center justify-between">
          <span className="text-[11px] text-zinc-400">
            Deterministic rules · Zero credentials
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
