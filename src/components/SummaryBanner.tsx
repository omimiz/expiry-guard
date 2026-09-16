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
    <section className="space-y-5 pt-1">
      {/* Private Client Portfolio Ticker */}
      <div className="p-4 sm:p-7 rounded-2xl bg-zinc-900/40 border border-white/[0.08] shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-8 relative z-10">
          {/* Preserved Value */}
          <div className="min-w-0">
            <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-zinc-400 truncate">
              Preserved Wealth
            </div>
            <div className="text-base sm:text-3xl font-serif-luxury font-bold text-white tracking-tight mt-0.5 sm:mt-1 truncate">
              ${Math.round(totalValueUsd).toLocaleString()}
            </div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 hidden sm:block">
              Estimated redemption valuation
            </div>
          </div>

          {/* Points Capital */}
          <div className="min-w-0 border-l border-white/[0.06] pl-2.5 sm:pl-0 sm:border-l-0">
            <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-zinc-400 truncate">
              Portfolio Capital
            </div>
            <div className="text-base sm:text-3xl font-mono font-semibold text-zinc-100 tracking-tight mt-0.5 sm:mt-1 truncate">
              {totalPoints.toLocaleString()}
            </div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 hidden sm:block">
              Across {cards.length} monitored schemes
            </div>
          </div>

          {/* Retention Status */}
          <div className="min-w-0 border-l border-white/[0.06] pl-2.5 sm:pl-0 sm:border-l-0">
            <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-zinc-400 truncate">
              Retention Status
            </div>
            <div className="text-base sm:text-3xl font-serif-luxury font-medium tracking-tight mt-0.5 sm:mt-1 truncate">
              {urgentTotal > 0 ? (
                <span className="text-zinc-200">
                  {urgentTotal} at risk
                </span>
              ) : (
                <span className="text-emerald-400">Preserved</span>
              )}
            </div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 hidden sm:block">
              {urgentTotal > 0 ? `${criticalCount} require renewal action` : 'Zero forfeiture risk'}
            </div>
          </div>
        </div>

        {/* Attention Callout */}
        {urgentTotal > 0 && (
          <div className="mt-4 pt-3.5 border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center space-x-2 text-zinc-300">
              <ShieldAlert className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>
                <strong className="text-white">{urgentTotal} loyalty assets</strong> require attention. Review preservation maneuvers below.
              </span>
            </div>
            <button
              onClick={() => setFilterStatus(filterStatus === 'urgent' ? 'all' : 'urgent')}
              className="text-white hover:text-zinc-300 font-medium underline underline-offset-4 cursor-pointer text-xs shrink-0"
            >
              {filterStatus === 'urgent' ? 'Show all assets' : 'Filter urgent assets'}
            </button>
          </div>
        )}
      </div>

      {/* Segmented Category Filters & Controls */}
      <div className="space-y-3 pt-1">
        {/* Category Tabs (Smooth touch scrolling) */}
        <div className="flex items-center p-1 bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-x-auto scrollbar-none w-full">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilterCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs transition cursor-pointer whitespace-nowrap shrink-0 ${
                filterCategory === cat.value
                  ? 'bg-zinc-800 text-white font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Subcontrols: Status filter + Sort + View Mode */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 w-full">
          {/* Status Filter */}
          <div className="flex items-center p-1 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs overflow-x-auto scrollbar-none">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer whitespace-nowrap ${
                filterStatus === 'all'
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('urgent')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center space-x-1 whitespace-nowrap ${
                filterStatus === 'urgent'
                  ? 'bg-zinc-800 text-zinc-100 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>At Risk</span>
              {urgentTotal > 0 && (
                <span className="text-[10px] text-zinc-300 font-mono">({urgentTotal})</span>
              )}
            </button>
            <button
              onClick={() => setFilterStatus('healthy')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer whitespace-nowrap ${
                filterStatus === 'healthy'
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Secured
            </button>
            {expiredCount > 0 && (
              <button
                onClick={() => setFilterStatus('expired')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer whitespace-nowrap ${
                  filterStatus === 'expired'
                    ? 'bg-zinc-800 text-zinc-300 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Expired
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 ml-auto sm:ml-0">
            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="pl-2.5 pr-7 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 font-medium focus:outline-none focus:border-zinc-600 cursor-pointer appearance-none min-h-[34px]"
              >
                <option value="urgency">Urgency</option>
                <option value="balance_desc">Highest capital</option>
                <option value="balance_asc">Lowest capital</option>
                <option value="name">Scheme name</option>
                <option value="category">Category</option>
              </select>
              <ArrowUpDown className="w-3 h-3 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('deck')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'deck' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Folio Deck View"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
