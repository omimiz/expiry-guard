import React, { useState } from 'react'
import {
  X,
  Search,
  Check,
  Calendar,
  ArrowRight
} from 'lucide-react'
import { LOYALTY_CATALOG, PRESET_STARTER_DECKS } from '../data/loyaltyCatalog'
import type { LoyaltyProgram } from '../types'
import { useDeck } from '../context/DeckContext'
import { getPresetDate, calculateExpiry } from '../utils/calculator'

interface DeckBuilderModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenCustomProgram: () => void
}

export const DeckBuilderModal: React.FC<DeckBuilderModalProps> = ({
  isOpen,
  onClose,
  onOpenCustomProgram
}) => {
  const { cards, addCard, loadStarterDeck } = useDeck()

  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const [selectedProgram, setSelectedProgram] = useState<LoyaltyProgram | null>(null)
  const [approxBalance, setApproxBalance] = useState<string>('25000')
  const [datePreset, setDatePreset] = useState<'today' | '30_days' | '90_days' | '180_days' | '1_year' | 'custom'>('30_days')
  const [customDate, setCustomDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState<string>('')

  if (!isOpen) return null

  const existingProgramIds = new Set(cards.map((c) => c.programId))

  const filteredCatalog = LOYALTY_CATALOG.filter((prog) => {
    const matchesCat = activeCategory === 'all' || prog.category === activeCategory
    const matchesSearch =
      prog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prog.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prog.officialPolicySummary.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCat && matchesSearch
  })

  const getEffectiveDate = (): string => {
    if (datePreset === 'custom') return customDate
    return getPresetDate(datePreset)
  }

  const liveExpiryPreview = selectedProgram
    ? calculateExpiry(
        {
          id: 'preview',
          programId: selectedProgram.id,
          approxBalance: Number(approxBalance) || 0,
          lastActivityDate: getEffectiveDate(),
          createdAt: new Date().toISOString()
        },
        selectedProgram
      )
    : null

  const handleOpenProgramConfig = (prog: LoyaltyProgram) => {
    setSelectedProgram(prog)
    setDatePreset('30_days')
    setCustomDate(new Date().toISOString().split('T')[0])
    setApproxBalance(prog.category === 'dining' ? '150' : '50000')
    setNotes('')
  }

  const handleSaveProgramToDeck = () => {
    if (!selectedProgram) return

    addCard({
      programId: selectedProgram.id,
      approxBalance: Math.max(0, parseInt(approxBalance) || 0),
      lastActivityDate: getEffectiveDate(),
      notes: notes.trim() || undefined
    })

    setSelectedProgram(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#121216] to-[#0a0a0d] border border-[#c5a880]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Top Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#d4af37] via-[#f3e7d3] to-[#aa823e]" />

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#c5a880]/15 flex items-start justify-between bg-[#0e0e12]/80">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880] mb-1">
              Perpetua · Asset Curation
            </div>
            <h2 className="text-xl font-serif-luxury font-bold text-[#f3e7d3] tracking-tight">
              Enroll Loyalty Asset
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select sovereign programs to monitor. Calculated locally using deterministic decay mathematics.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:text-[#f3e7d3] hover:bg-[#1a1916] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content View */}
        {!selectedProgram ? (
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
            {/* Curated Portfolios */}
            <div className="p-4 rounded-xl bg-[#111115] border border-[#c5a880]/15">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880] mb-2.5">
                Bespoke Starter Collections
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {PRESET_STARTER_DECKS.map((pack) => (
                  <button
                    key={pack.name}
                    onClick={() => {
                      loadStarterDeck(pack.programIds)
                      onClose()
                    }}
                    className="p-3 rounded-lg bg-[#141311] hover:bg-[#1c1a16] border border-[#c5a880]/20 text-left transition cursor-pointer group"
                  >
                    <div className="text-xs font-serif-luxury font-semibold text-[#f3e7d3] group-hover:text-white flex items-center justify-between">
                      <span>{pack.name}</span>
                      <ArrowRight className="w-3 h-3 text-[#c5a880]/70 group-hover:text-[#d4af37]" />
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">{pack.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Search & Custom Add */}
            <div className="space-y-3">
              <div className="flex gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#c5a880]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search global programs (Emirates, Marriott, Hyatt, Avios)..."
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#101013] border border-[#c5a880]/20 text-xs text-[#f3e7d3] placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]/60"
                  />
                </div>
                <button
                  onClick={onOpenCustomProgram}
                  className="px-3.5 py-2 rounded-xl bg-[#141311] hover:bg-[#1a1916] border border-[#c5a880]/25 text-xs font-medium text-[#e5d3b3] hover:text-[#f3e7d3] transition cursor-pointer"
                >
                  Custom Asset
                </button>
              </div>

              {/* Category tabs */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { label: 'All', value: 'all' },
                  { label: 'Airlines', value: 'airlines' },
                  { label: 'Hotels', value: 'hotels' },
                  { label: 'Retail & Concierge', value: 'retail' },
                  { label: 'Private Dining', value: 'dining' },
                  { label: 'Cards', value: 'credit_card' }
                ].map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setActiveCategory(c.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition cursor-pointer whitespace-nowrap ${
                      activeCategory === c.value
                        ? 'bg-[#1e1d1a] text-[#f3e7d3] border border-[#c5a880]/30 font-medium'
                        : 'text-zinc-400 hover:text-[#c5a880]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredCatalog.map((prog) => {
                const isAlreadyAdded = existingProgramIds.has(prog.id)
                return (
                  <div
                    key={prog.id}
                    onClick={() => !isAlreadyAdded && handleOpenProgramConfig(prog)}
                    className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                      isAlreadyAdded
                        ? 'bg-[#0e0e11]/40 border-[#c5a880]/10 opacity-40 cursor-default'
                        : 'bg-[#101013] hover:bg-[#15151a] border-[#c5a880]/20 hover:border-[#c5a880]/50 cursor-pointer'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: prog.brandColor }}
                          />
                          <span className="text-xs font-serif-luxury font-semibold text-[#f3e7d3]">
                            {prog.name}
                          </span>
                        </div>

                        {isAlreadyAdded ? (
                          <span className="text-[11px] text-[#c5a880]/80 font-mono flex items-center space-x-1">
                            <Check className="w-3 h-3 text-[#d4af37]" />
                            <span>Enrolled</span>
                          </span>
                        ) : (
                          <span className="text-xs text-[#c5a880] hover:text-[#f3e7d3] font-medium">
                            Enroll +
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                        {prog.officialPolicySummary}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#c5a880]/10 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                      <span className="capitalize">{prog.policyType.replace('_', ' ')}</span>
                      <span>{prog.validityMonths > 0 ? `${prog.validityMonths}m validity` : 'Perpetual'}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* Step 2: Configuration */
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#c5a880]/15">
              <div className="flex items-center space-x-2.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedProgram.brandColor }}
                />
                <div>
                  <h3 className="text-sm font-serif-luxury font-semibold text-[#f3e7d3]">{selectedProgram.name}</h3>
                  <p className="text-xs text-zinc-400">{selectedProgram.officialPolicySummary}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProgram(null)}
                className="text-xs text-[#c5a880] hover:text-[#f3e7d3] font-medium cursor-pointer"
              >
                ← Change Selection
              </button>
            </div>

            {/* Activity Date Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880] block">
                Last Qualifying Activity
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'today', label: 'Recent / Current' },
                  { id: '30_days', label: 'Within 30 Days' },
                  { id: '90_days', label: 'Quarterly (~3 Mo)' },
                  { id: '180_days', label: 'Semi-Annual (~6 Mo)' },
                  { id: '1_year', label: 'Over 1 Year' },
                  { id: 'custom', label: 'Exact Date' }
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setDatePreset(preset.id as any)}
                    className={`p-2.5 rounded-lg text-left border text-xs transition cursor-pointer ${
                      datePreset === preset.id
                        ? 'bg-[#1e1d1a] border-[#d4af37]/60 text-[#f3e7d3] font-medium'
                        : 'bg-[#111115] border-[#c5a880]/20 text-zinc-300 hover:border-[#c5a880]/40'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {datePreset === 'custom' && (
                <div className="mt-2 p-3 bg-[#111115] rounded-lg border border-[#c5a880]/20">
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-md bg-[#181715] border border-[#c5a880]/30 text-xs text-white focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Balance Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880] block">
                Estimated Capital Balance ({selectedProgram.pointUnit})
              </label>
              <input
                type="number"
                value={approxBalance}
                onChange={(e) => setApproxBalance(e.target.value)}
                placeholder="50000"
                className="w-full px-3 py-2 rounded-xl bg-[#101013] border border-[#c5a880]/20 text-white text-sm font-mono focus:outline-none focus:border-[#d4af37]/60"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880] block">
                Private Folio Note (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Platinum tier or family vacation allocation"
                className="w-full px-3 py-2 rounded-xl bg-[#101013] border border-[#c5a880]/20 text-xs text-white focus:outline-none focus:border-[#d4af37]/60"
              />
            </div>

            {/* Live Expiration Preview Box */}
            {liveExpiryPreview && (
              <div className="p-3.5 rounded-xl bg-[#111115] border border-[#c5a880]/20 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-zinc-400">Calculated Expiration:</span>
                  <span className="font-mono font-medium text-[#f3e7d3]">{liveExpiryPreview.formattedDate}</span>
                </div>
                <span className="text-[#d4af37] font-medium font-mono">{liveExpiryPreview.statusText}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-[#c5a880]/15">
              <button
                onClick={() => setSelectedProgram(null)}
                className="px-3.5 py-1.5 rounded-lg bg-[#141311] hover:bg-[#1a1916] text-[#c5a880] text-xs font-medium transition cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleSaveProgramToDeck}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa823e] hover:from-[#e5c158] hover:to-[#be9448] text-[#0d0c0a] text-xs font-semibold shadow-md transition cursor-pointer active:scale-98"
              >
                Add to Folio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
