import React, { useState, useEffect } from 'react'
import { X, Edit2 } from 'lucide-react'
import type { UserCard } from '../types'
import { LOYALTY_CATALOG } from '../data/loyaltyCatalog'
import { useDeck } from '../context/DeckContext'

interface EditCardModalProps {
  card: UserCard | null
  onClose: () => void
}

export const EditCardModal: React.FC<EditCardModalProps> = ({ card, onClose }) => {
  const { updateCard } = useDeck()

  const [balance, setBalance] = useState('')
  const [activityDate, setActivityDate] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (card) {
      setBalance(card.approxBalance?.toString() || '0')
      setActivityDate(card.lastActivityDate || new Date().toISOString().split('T')[0])
      setNotes(card.notes || '')
    }
  }, [card])

  if (!card) return null

  const program = LOYALTY_CATALOG.find((p) => p.id === card.programId)
  const programName = program?.name || card.customProgramName || 'Loyalty Scheme'

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateCard(card.id, {
      approxBalance: Math.max(0, parseInt(balance) || 0),
      lastActivityDate: activityDate,
      notes: notes.trim() || undefined
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#121216] to-[#0a0a0d] border border-[#c5a880]/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#d4af37] via-[#f3e7d3] to-[#aa823e]" />

        {/* Header */}
        <div className="p-5 border-b border-[#c5a880]/15 flex items-start justify-between bg-[#0e0e12]/80">
          <div>
            <h3 className="text-sm font-serif-luxury font-semibold text-[#f3e7d3] flex items-center space-x-2">
              <Edit2 className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Modify {programName}</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Update capital balance or qualifying activity
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:text-[#f3e7d3] hover:bg-[#1a1916] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880] block mb-1">
              Capital Balance ({program?.pointUnit || 'pts'})
            </label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#101013] border border-[#c5a880]/20 text-xs text-[#f3e7d3] font-mono focus:outline-none focus:border-[#d4af37]/60"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880] block mb-1">
              Last Qualifying Activity Date
            </label>
            <input
              type="date"
              required
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-[#101013] border border-[#c5a880]/20 text-xs text-white focus:outline-none focus:border-[#d4af37]/60"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880] block mb-1">
              Private Note (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Account goal"
              className="w-full px-3 py-2 rounded-xl bg-[#101013] border border-[#c5a880]/20 text-xs text-white focus:outline-none focus:border-[#d4af37]/60"
            />
          </div>

          <div className="pt-2 border-t border-[#c5a880]/15 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-[#141311] text-[#c5a880] hover:text-white text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa823e] text-[#0d0c0a] text-xs font-semibold shadow-md transition cursor-pointer"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
