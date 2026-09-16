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
  const programName = program?.name || card.customProgramName || 'Loyalty Card'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-sm bg-[#111114] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800/80 flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Edit {programName}</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Update balance or last activity date
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 block mb-1">
              Balance ({program?.pointUnit || 'pts'})
            </label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 block mb-1">
              Last Activity Date
            </label>
            <input
              type="date"
              required
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 block mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Account goal"
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
