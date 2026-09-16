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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Edit2 className="w-4 h-4 text-indigo-400" />
              <span>Edit {programName}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Update balance or adjust last activity date
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Points / Miles Balance ({program?.pointUnit || 'pts'})
            </label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Last Activity Date
            </label>
            <input
              type="date"
              required
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Account goal or tier level"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
