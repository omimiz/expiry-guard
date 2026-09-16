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
  const brandColor = program?.brandColor || '#c5a880'
  const valCents = program?.valuationPerPointCents || 1.0
  const valuation = calculateBalanceValuation(card.approxBalance || 0, valCents)
  const pointUnit = program?.pointUnit || 'Points'

  const handleRescueActionCompleted = (_actionTitle: string) => {
    confetti({
      particleCount: 45,
      spread: 55,
      origin: { y: 0.7 },
      colors: ['#D4AF37', '#F3E7D3', '#AA823E']
    })
    resetActivityClock(card.id)
    onClose()
  }

  const getEffortTag = (effort: EffortLevel) => {
    switch (effort) {
      case 'instant_free':
        return (
          <span className="text-[10px] font-mono text-[#d4af37] bg-[#221c12] border border-[#c5a880]/30 px-2 py-0.5 rounded">
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
          <span className="text-[10px] font-mono text-[#f3e7d3] bg-[#1a1815] border border-[#c5a880]/40 px-2 py-0.5 rounded">
            Capital Transfer
          </span>
        )
      case 'partner':
        return (
          <span className="text-[10px] font-mono text-[#c5a880] bg-[#161512] border border-[#c5a880]/25 px-2 py-0.5 rounded">
            Concierge & Partner
          </span>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#121216] to-[#0a0a0d] border border-[#c5a880]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Hairline Gold Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#d4af37] via-[#f3e7d3] to-[#aa823e]" />

        {/* Advisory Header */}
        <div className="p-6 border-b border-[#c5a880]/15 flex items-start justify-between bg-[#0e0e12]/80">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColor }} />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880]">
                Perpetua Advisory · Capital Retention
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#f3e7d3] tracking-tight">
              Safeguard {(card.approxBalance || 0).toLocaleString()} {pointUnit}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Estimated asset value ≈ <strong className="text-[#f3e7d3]">{valuation}</strong> · {programName} ({expiry.formattedDate})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:text-[#f3e7d3] hover:bg-[#1a1916] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preservation Strategy List */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880]/80 mb-1 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Preservation Maneuvers</span>
          </div>

          {program && program.rescueActions.length > 0 ? (
            program.rescueActions.map((action, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#111115] border border-[#c5a880]/15 hover:border-[#c5a880]/35 transition space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif-luxury font-semibold text-[#f3e7d3]">
                    {action.title}
                  </span>
                  {getEffortTag(action.effort)}
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {action.description}
                </p>

                {action.partnerExample && (
                  <div className="text-[11px] text-zinc-400 font-mono">
                    Channel: <span className="text-[#e5d3b3]">{action.partnerExample}</span>
                  </div>
                )}

                <div className="pt-2.5 border-t border-[#c5a880]/10 flex items-center justify-between">
                  <span className="text-[11px] text-[#c5a880]/80">
                    {action.actionHint || 'Extends full retention cycle'}
                  </span>
                  <button
                    onClick={() => handleRescueActionCompleted(action.title)}
                    className="px-3 py-1.5 rounded-lg bg-[#1a1815] hover:bg-[#24211c] text-[#f3e7d3] hover:text-white text-xs font-medium border border-[#c5a880]/30 transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Check className="w-3 h-3 text-[#d4af37]" />
                    <span>Execute & Renew Validity</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-zinc-400 space-y-2">
              <Coins className="w-6 h-6 text-[#d4af37] mx-auto" />
              <p>Trigger any qualifying earning or transfer transaction to renew this asset's validity.</p>
              <button
                onClick={() => handleRescueActionCompleted('Activity')}
                className="px-4 py-2 rounded-lg bg-[#1a1815] border border-[#c5a880]/30 text-[#f3e7d3] text-xs font-medium mt-2"
              >
                Renew Validity
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#c5a880]/15 bg-[#0a0a0d] flex items-center justify-between text-[11px] text-zinc-400">
          <span>
            Deterministic rules · Zero credential transmission
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-[#141311] hover:bg-[#1a1916] border border-[#c5a880]/20 text-[#e5d3b3] text-xs font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
