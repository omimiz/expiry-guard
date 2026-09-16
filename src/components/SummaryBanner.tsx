import React from 'react'
import { AlertTriangle, ShieldCheck, Flame, Coins, LayoutGrid, Layers, ArrowUpDown } from 'lucide-react'
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

  // Calculate aggregates
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

  const categories: { label: string; value: string }[] = [
    { label: 'All Categories', value: 'all' },
    { label: '✈️ Airlines', value: 'airlines' },
    { label: '🏨 Hotels', value: 'hotels' },
    { label: '🛍️ Retail', value: 'retail' },
    { label: '☕ Dining', value: 'dining' },
    { label: '💳 Cards', value: 'credit_card' }
  ]

  return (
    <section className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Points */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800/80 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Tracked Points</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {totalPoints.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Across {cards.length} active programs</p>
        </div>

        {/* Estimated Value */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800/80 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Estimated Value</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
            ${Math.round(totalValueUsd).toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Total reward wealth protected</p>
        </div>

        {/* Urgent Risk Count */}
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-lg relative overflow-hidden transition-all ${
          urgentTotal > 0 
            ? 'bg-gradient-to-b from-rose-950/40 to-slate-900 border-rose-500/30' 
            : 'bg-gradient-to-b from-slate-900 to-slate-900/60 border-slate-800/80'
        }`}>
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
            <Flame className={`w-4 h-4 ${urgentTotal > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} />
            <span>At Risk (≤ 60d)</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${urgentTotal > 0 ? 'text-rose-400' : 'text-white'}`}>
              {urgentTotal}
            </span>
            {criticalCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {criticalCount} Critical
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {urgentTotal === 0 ? 'All programs healthy' : 'Immediate rescue recommended'}
          </p>
        </div>

        {/* Active Protection Status */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800/80 shadow-lg relative overflow-hidden">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Protection Status</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="text-emerald-300 text-base sm:text-lg">Real-Time Active</span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">No login credentials needed</p>
        </div>
      </div>

      {/* Urgent Warning Notification Banner */}
      {urgentTotal > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-900/40 via-amber-900/30 to-slate-900 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-rose-950/20">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-rose-200">
                Action Required: {urgentTotal} {urgentTotal === 1 ? 'program is' : 'programs are'} nearing expiration!
              </h4>
              <p className="text-xs text-rose-300/80 mt-0.5">
                Don't let valuable points vanish. Tap <strong>Quick Rescue</strong> or reset the clock if you recently engaged with the brand.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilterStatus('urgent')}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 text-rose-200 text-xs font-semibold transition shrink-0 cursor-pointer self-end sm:self-auto"
          >
            Filter At-Risk Cards
          </button>
        </div>
      )}

      {/* Controls & Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-2">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1.5 lg:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilterCategory(cat.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                filterCategory === cat.value
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status Filter & Sort Controls */}
        <div className="flex items-center justify-between sm:justify-end space-x-2.5">
          {/* Status Filter Tabs */}
          <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({cards.length})
            </button>
            <button
              onClick={() => setFilterStatus('urgent')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center space-x-1 cursor-pointer ${
                filterStatus === 'urgent'
                  ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Urgent</span>
              {urgentTotal > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {urgentTotal}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilterStatus('healthy')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                filterStatus === 'healthy'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Healthy
            </button>
            {expiredCount > 0 && (
              <button
                onClick={() => setFilterStatus('expired')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  filterStatus === 'expired'
                    ? 'bg-slate-700 text-slate-200 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Expired ({expiredCount})
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="urgency">Most Urgent</option>
              <option value="balance_desc">Highest Balance</option>
              <option value="balance_asc">Lowest Balance</option>
              <option value="name">Program Name</option>
              <option value="category">Category</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('deck')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'deck' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Wallet Deck View"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
