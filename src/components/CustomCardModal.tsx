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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Add Custom Program</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Add any local gym, regional airline, or supermarket reward scheme
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Program / Scheme Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fitness First Points, Local Grocery Rewards"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="retail">Retail</option>
                <option value="dining">Dining</option>
                <option value="airlines">Airlines</option>
                <option value="hotels">Hotels</option>
                <option value="credit_card">Credit Card</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Expiration Policy
              </label>
              <select
                value={policyType}
                onChange={(e) => setPolicyType(e.target.value as PolicyType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="rolling_inactivity">Rolling Inactivity</option>
                <option value="fixed_calendar">End of Calendar Year</option>
                <option value="fixed_tenure">Fixed Validity from Date</option>
                <option value="no_expiry">Never Expires</option>
              </select>
            </div>
          </div>

          {policyType !== 'no_expiry' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Validity Window (Months)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={validityMonths}
                onChange={(e) => setValidityMonths(parseInt(e.target.value) || 12)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Approximate Balance
              </label>
              <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Membership ID or goal reward"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
              Add to Deck
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
