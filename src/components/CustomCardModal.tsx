import React, { useState } from 'react'
import { X, Sparkles } from 'lucide-react'
import type { PolicyType, Category } from '../types'
import { useDeck } from '../context/DeckContext'

interface CustomCardModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CustomCardModal: React.FC<CustomCardModalProps> = ({ isOpen, onClose }) => {
  const { addCard } = useDeck()

  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('retail')
  const [policyType, setPolicyType] = useState<PolicyType>('rolling_inactivity')
  const [validityMonths, setValidityMonths] = useState<number>(12)
  const [balance, setBalance] = useState<string>('5000')
  const [activityDate, setActivityDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState<string>('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    addCard({
      programId: 'custom-' + name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      customProgramName: name.trim(),
      approxBalance: parseInt(balance) || 0,
      lastActivityDate: activityDate,
      customPolicyType: policyType,
      customValidityMonths: validityMonths,
      notes: notes.trim() || undefined
    })

    setName('')
    setNotes('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#111114] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800/80 flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <span>Add Custom Program</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Add any local gym, regional airline, or retailer scheme
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 block mb-1">
              Program Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Local Co-op Points"
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600 cursor-pointer"
              >
                <option value="retail">Retail</option>
                <option value="dining">Dining</option>
                <option value="airlines">Airlines</option>
                <option value="hotels">Hotels</option>
                <option value="credit_card">Credit Card</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 block mb-1">
                Policy Rule
              </label>
              <select
                value={policyType}
                onChange={(e) => setPolicyType(e.target.value as PolicyType)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600 cursor-pointer"
              >
                <option value="rolling_inactivity">Rolling Inactivity</option>
                <option value="fixed_calendar">Calendar Year-End</option>
                <option value="fixed_tenure">Fixed Validity Period</option>
                <option value="no_expiry">No Expiry</option>
              </select>
            </div>
          </div>

          {policyType !== 'no_expiry' && (
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 block mb-1">
                Validity Window (Months)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={validityMonths}
                onChange={(e) => setValidityMonths(parseInt(e.target.value) || 12)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 block mb-1">
                Balance
              </label>
              <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="5000"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 block mb-1">
                Last Activity
              </label>
              <input
                type="date"
                required
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 block mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Card number or tier"
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
              Add Card
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
