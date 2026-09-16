import React from 'react'
import { LayoutGrid, Layers, ArrowUpDown, ShieldAlert } from 'lucide-react'
import { useDeck } from '../context/DeckContext'
import { LOYALTY_CATALOG } from '../data/loyaltyCatalog'
import { calculateExpiry } from '../utils/calculator'
import type { SortOption } from '../types'

export const SummaryBanner: React.FC = () => {
  const {
    cards,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode
  } = useDeck()

  let totalPoints = 0
  let totalValueUsd = 0
  let criticalCount = 0
  let warningCount = 0
  let expiredCount = 0

  cards.forEach((card) => {
    const program = LOYALTY_CATALOG.find((p) => p.id === card.programId)
    const expiry = calculateExpiry(card, program)

    totalPoints += card.approxBalance || 0
    const valPerPoint = program?.valuationPerPointCents || 1.0
    totalValueUsd += ((card.approxBalance || 0) * valPerPoint) / 100

    if (expiry.status === 'critical') criticalCount++
    else if (expiry.status === 'warning') warningCount++
    else if (expiry.status === 'expired') expiredCount++
  })

  const urgentTotal = criticalCount + warningCount

  const categories = [
    { label: 'All Assets', value: 'all' },
    { label: 'Airlines', value: 'airlines' },
    { label: 'Hotels', value: 'hotels' },
    { label: 'Retail & Concierge', value: 'retail' },
    { label: 'Private Dining', value: 'dining' },
    { label: 'Centurion & Cards', value: 'credit_card' }
  ]

  return (
    <section className="space-y-6 pt-2">
      {/* Private Client Portfolio Ticker */}
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#111114] to-[#0a0a0d] border border-[#c5a880]/20 shadow-xl relative overflow-hidden">
        {/* Subtle diagonal ambient sheen */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/[0.02] rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 relative z-10">
          {/* Preserved Value */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880]/80">
              Preserved Wealth
            </div>
            <div className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#f3e7d3] tracking-tight mt-1">
              ${Math.round(totalValueUsd).toLocaleString()}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Estimated redemption valuation</div>
          </div>

          {/* Points Capital */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880]/80">
              Portfolio Capital
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-semibold text-white tracking-tight mt-1">
              {totalPoints.toLocaleString()}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Across {cards.length} monitored schemes</div>
          </div>

          {/* Retention Status */}
          <div className="col-span-2 sm:col-span-1">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880]/80">
              Retention Status
            </div>
            <div className="text-2xl sm:text-3xl font-serif-luxury font-medium tracking-tight mt-1">
              {urgentTotal > 0 ? (
                <span className="text-[#d4af37]">
                  {urgentTotal} at risk
                </span>
              ) : (
                <span className="text-emerald-400/90">Preserved</span>
              )}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              {urgentTotal > 0 ? `${criticalCount} require immediate renewal` : 'Zero forfeiture risk'}
            </div>
          </div>
        </div>

        {/* Quiet Attention Callout */}
        {urgentTotal > 0 && (
          <div className="mt-5 pt-4 border-t border-[#c5a880]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-zinc-300">
              <ShieldAlert className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>
                <strong className="text-[#f3e7d3]">{urgentTotal} loyalty assets</strong> have elapsed validity windows. Review preservation maneuvers below.
              </span>
            </div>
            <button
              onClick={() => setFilterStatus(filterStatus === 'urgent' ? 'all' : 'urgent')}
              className="text-[#d4af37] hover:text-[#f3e7d3] font-medium underline underline-offset-4 cursor-pointer text-xs shrink-0"
            >
              {filterStatus === 'urgent' ? 'Show all assets' : 'Filter urgent assets'}
            </button>
          </div>
        )}
      </div>

      {/* Segmented Category Filters & Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Category Tabs */}
        <div className="flex items-center p-1 bg-[#101013] border border-[#c5a880]/20 rounded-xl overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilterCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs transition cursor-pointer whitespace-nowrap ${
                filterCategory === cat.value
                  ? 'bg-gradient-to-b from-[#1f1d19] to-[#151412] text-[#f3e7d3] border border-[#c5a880]/30 font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-[#c5a880]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          {/* Status Filter */}
          <div className="flex items-center p-1 bg-[#101013] border border-[#c5a880]/20 rounded-xl text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-[#1e1d1a] text-[#f3e7d3] font-medium'
                  : 'text-zinc-400 hover:text-[#c5a880]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('urgent')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center space-x-1 ${
                filterStatus === 'urgent'
                  ? 'bg-[#1e1d1a] text-[#d4af37] font-medium'
                  : 'text-zinc-400 hover:text-[#c5a880]'
              }`}
            >
              <span>At Risk</span>
              {urgentTotal > 0 && (
                <span className="text-[10px] text-[#d4af37] font-mono">({urgentTotal})</span>
              )}
            </button>
            <button
              onClick={() => setFilterStatus('healthy')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                filterStatus === 'healthy'
                  ? 'bg-[#1e1d1a] text-[#f3e7d3] font-medium'
                  : 'text-zinc-400 hover:text-[#c5a880]'
              }`}
            >
              Secured
            </button>
            {expiredCount > 0 && (
              <button
                onClick={() => setFilterStatus('expired')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  filterStatus === 'expired'
                    ? 'bg-[#1e1d1a] text-zinc-300 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Expired
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="pl-2.5 pr-7 py-1.5 rounded-xl bg-[#101013] border border-[#c5a880]/20 text-xs text-[#e5d3b3] font-medium focus:outline-none focus:border-[#d4af37]/60 cursor-pointer appearance-none"
            >
              <option value="urgency">Urgency</option>
              <option value="balance_desc">Highest capital</option>
              <option value="balance_asc">Lowest capital</option>
              <option value="name">Scheme name</option>
              <option value="category">Category</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-[#c5a880]/70 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center p-1 bg-[#101013] border border-[#c5a880]/20 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#1e1d1a] text-[#f3e7d3]' : 'text-zinc-400 hover:text-[#c5a880]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('deck')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'deck' ? 'bg-[#1e1d1a] text-[#f3e7d3]' : 'text-zinc-400 hover:text-[#c5a880]'
              }`}
              title="Folio Deck View"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
