import React, { useState } from 'react'
import {
  X,
  Search,
  Check,
  Calendar,
  Sparkles,
  Plane,
  Hotel,
  Coffee,
  ShoppingBag,
  CreditCard,
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

  // Currently configuring program
  const [selectedProgram, setSelectedProgram] = useState<LoyaltyProgram | null>(null)
  const [approxBalance, setApproxBalance] = useState<string>('25000')
  const [datePreset, setDatePreset] = useState<'today' | '30_days' | '90_days' | '180_days' | '1_year' | 'custom'>('30_days')
  const [customDate, setCustomDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState<string>('')

  if (!isOpen) return null

  const existingProgramIds = new Set(cards.map((c) => c.programId))

  // Filter catalog
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

  // Live preview calculation for the selected program
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
    setApproxBalance(prog.category === 'dining' ? '150' : '25000')
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

  const renderProgramIcon = (iconKey: string) => {
    const cls = 'w-4 h-4'
    switch (iconKey) {
      case 'plane':
        return <Plane className={cls} />
      case 'hotel':
        return <Hotel className={cls} />
      case 'coffee':
        return <Coffee className={cls} />
      case 'shopping-bag':
        return <ShoppingBag className={cls} />
      case 'credit-card':
        return <CreditCard className={cls} />
      default:
        return <Sparkles className={cls} />
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                60-Second Deck Builder
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Fast Add
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select your loyalty programs. We track expiration dates deterministically without requiring any passwords.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content View */}
        {!selectedProgram ? (
          <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
            {/* Quick Starter Packs Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1-Click Starter Packs</span>
                </span>
                <span className="text-[11px] text-slate-400">Instantly populate popular combinations</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {PRESET_STARTER_DECKS.map((pack) => (
                  <button
                    key={pack.name}
                    onClick={() => {
                      loadStarterDeck(pack.programIds)
                      onClose()
                    }}
                    className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 text-left transition group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-indigo-300 flex items-center justify-between">
                      <span>{pack.name}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{pack.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Search & Category Filter */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search programs (e.g. Emirates, Marriott, Starbucks, Avios)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <button
                  onClick={onOpenCustomProgram}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition whitespace-nowrap cursor-pointer"
                >
                  + Add Custom Program
                </button>
              </div>

              {/* Category selector */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { label: 'All Programs', value: 'all' },
                  { label: '✈️ Airlines', value: 'airlines' },
                  { label: '🏨 Hotels', value: 'hotels' },
                  { label: '🛍️ Retail', value: 'retail' },
                  { label: '☕ Dining', value: 'dining' },
                  { label: '💳 Credit Cards', value: 'credit_card' }
                ].map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setActiveCategory(c.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                      activeCategory === c.value
                        ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredCatalog.map((prog) => {
                const isAlreadyAdded = existingProgramIds.has(prog.id)
                return (
                  <div
                    key={prog.id}
                    onClick={() => !isAlreadyAdded && handleOpenProgramConfig(prog)}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isAlreadyAdded
                        ? 'bg-slate-900/40 border-slate-800 opacity-60 cursor-default'
                        : 'bg-slate-900 hover:bg-slate-800/90 border-slate-800 hover:border-indigo-500/50 hover:shadow-xl cursor-pointer group'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm"
                            style={{ backgroundColor: prog.brandColor }}
                          >
                            {renderProgramIcon(prog.iconKey)}
                          </span>
                          <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                            {prog.name}
                          </span>
                        </div>

                        {isAlreadyAdded ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold flex items-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>In Deck</span>
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-indigo-400 group-hover:translate-x-0.5 transition flex items-center space-x-1">
                            <span>Add</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                        {prog.officialPolicySummary}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="capitalize">
                        Rule: {prog.policyType.replace('_', ' ')}
                      </span>
                      <span>
                        {prog.validityMonths > 0 ? `${prog.validityMonths} Mo Validity` : 'Never Expires'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* Step 2: Rapid Configurator for selected card */
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: selectedProgram.brandColor }}
                >
                  {renderProgramIcon(selectedProgram.iconKey)}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedProgram.name}</h3>
                  <p className="text-xs text-slate-400">{selectedProgram.officialPolicySummary}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProgram(null)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
              >
                ← Back to Catalog
              </button>
            </div>

            {/* Rapid Activity Date Picker */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                1. When was your last qualifying activity?
              </label>
              <p className="text-xs text-slate-400">
                (Flight taken, hotel stay, dining purchase, or points transfer)
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {[
                  { id: 'today', label: 'Today / Recent', hint: 'Just used it' },
                  { id: '30_days', label: 'Within 30 Days', hint: '~1 month ago' },
                  { id: '90_days', label: '3 Months Ago', hint: 'Last quarter' },
                  { id: '180_days', label: '6 Months Ago', hint: 'Mid year' },
                  { id: '1_year', label: '1 Year Ago', hint: 'Over a year' },
                  { id: 'custom', label: 'Pick Exact Date', hint: 'Calendar' }
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setDatePreset(preset.id as any)}
                    className={`p-3 rounded-xl text-left border transition cursor-pointer ${
                      datePreset === preset.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{preset.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{preset.hint}</div>
                  </button>
                ))}
              </div>

              {datePreset === 'custom' && (
                <div className="mt-3 p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                  <label className="text-xs text-slate-300 block mb-1">Select Exact Date:</label>
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Balance input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                2. Rough Points / Miles Balance (Optional)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={approxBalance}
                  onChange={(e) => setApproxBalance(e.target.value)}
                  placeholder="e.g. 25000"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-base font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase">
                  {selectedProgram.pointUnit}
                </span>
              </div>
            </div>

            {/* Optional notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                3. Personal Note (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Saved for family summer flight"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>

            {/* Live Expiration Preview Box */}
            {liveExpiryPreview && (
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">
                      Calculated Expiry Date:
                    </span>
                    <span className="text-base font-bold text-white">
                      {liveExpiryPreview.formattedDate}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">Status</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block ${
                      liveExpiryPreview.status === 'critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : liveExpiryPreview.status === 'warning'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {liveExpiryPreview.statusText}
                  </span>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedProgram(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProgramToDeck}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition cursor-pointer active:scale-95"
              >
                Save to My Deck
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
