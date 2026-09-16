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
  const [balance, setBalance] = useState<string>('50000')
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
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#121216] to-[#0a0a0d] border border-[#c5a880]/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#d4af37] via-[#f3e7d3] to-[#aa823e]" />

        {/* Header */}
        <div className="p-5 border-b border-[#c5a880]/15 flex items-start justify-between bg-[#0e0e12]/80">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880] mb-0.5">
              Bespoke Asset
            </div>
            <h3 className="text-base font-serif-luxury font-semibold text-[#f3e7d3] flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Enroll Custom Loyalty Scheme</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Configure private aviation, regional bank, or private club points
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880] block mb-1">
              Program / Issuer Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. NetJets Rewards, Private Concierge Club"
              className="w-full px-3 py-2 rounded-xl bg-[#101013] border border-[#c5a880]/20 text-xs text-[#f3e7d3] focus:outline-none focus:border-[#d4af37]/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880] block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 rounded-xl bg-[#101013] border border-[#c5a880]/20 text-xs text-[#e5d3b3] focus:outline-none focus:border-[#d4af37]/60 cursor-pointer"
              >
                <option value="airlines">Aviation</option>
                <option value="hotels">Hospitality</option>
                <option value="retail">Retail & Luxury</option>
                <option value="dining">Private Dining</option>
                <option value="credit_card">Private Bank Card</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880] block mb-1">
                Decay Rule
              </label>
              <select
                value={policyType}
                onChange={(e) => setPolicyType(e.target.value as PolicyType)}
                className="w-full px-3 py-2 rounded-xl bg-[#101013] border border-[#c5a880]/20 text-xs text-[#e5d3b3] focus:outline-none focus:border-[#d4af37]/60 cursor-pointer"
              >
                <option value="rolling_inactivity">Rolling Inactivity</option>
                <option value="fixed_calendar">Calendar Year-End</option>
                <option value="fixed_tenure">Fixed Retention Window</option>
                <option value="no_expiry">Perpetual (No Expiry)</option>
              </select>
            </div>
          </div>

          {policyType !== 'no_expiry' && (
            <div>
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880] block mb-1">
                Validity Window (Months)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={validityMonths}
                onChange={(e) => setValidityMonths(parseInt(e.target.value) || 12)}
                className="w-full px-3 py-2 rounded-xl bg-[#101013] border border-[#c5a880]/20 text-xs text-[#f3e7d3] focus:outline-none focus:border-[#d4af37]/60"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880] block mb-1">
                Capital Balance
              </label>
              <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="50000"
                className="w-full px-3 py-2 rounded-xl bg-[#101013] border border-[#c5a880]/20 text-xs text-white font-mono focus:outline-none focus:border-[#d4af37]/60"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880] block mb-1">
                Last Activity
              </label>
              <input
                type="date"
                required
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#101013] border border-[#c5a880]/20 text-xs text-white focus:outline-none focus:border-[#d4af37]/60"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880] block mb-1">
              Private Note (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Account identifier or tier status"
              className="w-full px-3 py-2 rounded-xl bg-[#101013] border border-[#c5a880]/20 text-xs text-white focus:outline-none focus:border-[#d4af37]/60"
            />
          </div>

          <div className="pt-2.5 border-t border-[#c5a880]/15 flex items-center justify-end space-x-2">
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
              Enroll Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
