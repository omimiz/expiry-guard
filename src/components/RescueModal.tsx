import React from 'react'
import confetti from 'canvas-confetti'
import {
  X,
  Check,
  Coins,
  ShieldCheck
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

  const programName = program?.name || card.customProgramName || 'Loyalty Scheme'
  const brandColor = program?.brandColor || '#a1a1aa'
  const valCents = program?.valuationPerPointCents || 1.0
  const valuation = calculateBalanceValuation(card.approxBalance || 0, valCents)
  const pointUnit = program?.pointUnit || 'Points'

  const handleRescueActionCompleted = (_actionTitle: string) => {
    confetti({
      particleCount: 45,
      spread: 55,
      origin: { y: 0.7 },
      colors: ['#ffffff', '#f4f4f5', '#a1a1aa', '#71717a']
    })
    resetActivityClock(card.id)
    onClose()
  }

  const getEffortTag = (effort: EffortLevel) => {
    switch (effort) {
      case 'instant_free':
        return (
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
            Zero Cost · Instant
          </span>
        )
      case 'low_cost':
        return (
          <span className="text-[10px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-700/60 px-2 py-0.5 rounded">
            Nominal Spend ($1–$5)
          </span>
        )
      case 'transfer':
        return (
          <span className="text-[10px] font-mono text-white bg-zinc-850 border border-zinc-700 px-2 py-0.5 rounded">
            Capital Transfer
          </span>
        )
      case 'partner':
        return (
          <span className="text-[10px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
            Concierge & Partner
          </span>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#121216] to-[#09090b] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Hairline Platinum Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-zinc-500 via-white to-zinc-500" />

        {/* Advisory Header */}
        <div className="p-6 border-b border-zinc-800 flex items-start justify-between bg-zinc-950/70">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColor }} />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                Perpetua Advisory · Capital Retention
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white tracking-tight">
              Safeguard {(card.approxBalance || 0).toLocaleString()} {pointUnit}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Estimated asset value ≈ <strong className="text-zinc-200">{valuation}</strong> · {programName} ({expiry.formattedDate})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preservation Strategy List */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-1 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
            <span>Preservation Maneuvers</span>
          </div>

          {program && program.rescueActions.length > 0 ? (
            program.rescueActions.map((action, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif-luxury font-semibold text-white">
                    {action.title}
                  </span>
                  {getEffortTag(action.effort)}
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {action.description}
                </p>

                {action.partnerExample && (
                  <div className="text-[11px] text-zinc-500 font-mono">
                    Channel: <span className="text-zinc-300">{action.partnerExample}</span>
                  </div>
                )}

                <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400">
                    {action.actionHint || 'Extends full retention cycle'}
                  </span>
                  <button
                    onClick={() => handleRescueActionCompleted(action.title)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-white text-xs font-medium border border-zinc-700 transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Execute & Renew Validity</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-zinc-400 space-y-2">
              <Coins className="w-6 h-6 text-zinc-500 mx-auto" />
              <p>Trigger any qualifying earning or transfer transaction to renew this asset's validity.</p>
              <button
                onClick={() => handleRescueActionCompleted('Activity')}
                className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-xs font-medium mt-2"
              >
                Renew Validity
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-[11px] text-zinc-500">
          <span>
            Deterministic rules · Zero credential transmission
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
