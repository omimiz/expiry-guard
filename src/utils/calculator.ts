import type { LoyaltyProgram, UserCard, ExpirationCalculation, ExpiryStatus } from '../types'

/**
 * Calculates the exact deterministic expiration details for a loyalty card
 * based on the program decay rules and the card's last activity date.
 */
export function calculateExpiry(
  card: UserCard,
  program?: LoyaltyProgram,
  referenceDate: Date = new Date()
): ExpirationCalculation {
  // Normalize reference date to beginning of day
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate())

  const policyType = card.customPolicyType || program?.policyType || 'rolling_inactivity'
  const validityMonths = card.customValidityMonths ?? program?.validityMonths ?? 24

  // Check for immortal / non-expiring programs
  if (policyType === 'no_expiry' || validityMonths <= 0) {
    return {
      expiryDate: null,
      formattedDate: 'Never Expires',
      daysRemaining: Infinity,
      status: 'immortal',
      progressPercent: 100,
      statusText: 'Safe Forever',
      isExpired: false,
      isImmortal: true
    }
  }

  // Parse card lastActivityDate (YYYY-MM-DD)
  const [year, month, day] = card.lastActivityDate.split('-').map(Number)
  const activityDate = new Date(year, (month || 1) - 1, day || 1)

  let expiryDate: Date

  if (policyType === 'fixed_calendar') {
    // E.g., Carrefour SHARE expires Dec 31 of following calendar year
    const targetMonth = (program?.fixedMonth || 12) - 1 // Dec = 11
    const targetDay = program?.fixedDay || 31
    const yearOffset = Math.max(1, Math.floor(validityMonths / 12))
    expiryDate = new Date(activityDate.getFullYear() + yearOffset, targetMonth, targetDay, 23, 59, 59)

    // If calculated date is already past relative to activity date's target, bump to next year
    if (expiryDate.getTime() < activityDate.getTime()) {
      expiryDate = new Date(activityDate.getFullYear() + yearOffset + 1, targetMonth, targetDay, 23, 59, 59)
    }
  } else if (policyType === 'fixed_tenure') {
    // Fixed tenure (e.g., Emirates / Singapore Airlines: valid through end of the month + validityMonths)
    expiryDate = new Date(
      activityDate.getFullYear(),
      activityDate.getMonth() + validityMonths + 1,
      0, // last day of that target month
      23, 59, 59
    )
  } else {
    // Default: 'rolling_inactivity'
    // Expiration date = activityDate + validityMonths
    expiryDate = new Date(
      activityDate.getFullYear(),
      activityDate.getMonth() + validityMonths,
      activityDate.getDate(),
      23, 59, 59
    )
  }

  // Calculate day difference
  const diffMs = expiryDate.getTime() - today.getTime()
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  const isExpired = daysRemaining <= 0

  // Calculate progress percentage of lifespan remaining
  const totalLifespanDays = Math.max(30, validityMonths * 30.42)
  const elapsedDays = Math.max(0, Math.ceil((today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24)))
  const remainingRatio = Math.max(0, Math.min(1, (totalLifespanDays - elapsedDays) / totalLifespanDays))
  const progressPercent = Math.round(remainingRatio * 100)

  // Status computation
  let status: ExpiryStatus = 'healthy'
  let statusText = `${daysRemaining} Days Left`

  if (isExpired) {
    status = 'expired'
    const daysAgo = Math.abs(daysRemaining)
    statusText = daysAgo === 0 ? 'Expires Today' : `Expired ${daysAgo}d ago`
  } else if (daysRemaining <= 14) {
    status = 'critical'
    statusText = daysRemaining === 1 ? '1 Day Left!' : `⚠️ ${daysRemaining} Days Left`
  } else if (daysRemaining <= 60) {
    status = 'warning'
    statusText = `${daysRemaining} Days Left`
  } else {
    status = 'healthy'
    const monthsRemaining = Math.floor(daysRemaining / 30.4)
    if (monthsRemaining >= 2) {
      statusText = `${monthsRemaining} Mo (${daysRemaining}d)`
    } else {
      statusText = `${daysRemaining} Days Left`
    }
  }

  // Formatting date string
  const formattedDate = expiryDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return {
    expiryDate,
    formattedDate,
    daysRemaining,
    status,
    progressPercent,
    statusText,
    isExpired,
    isImmortal: false
  }
}

/**
 * Format currency estimation from points balance and program valuation
 */
export function calculateBalanceValuation(balance: number, valuationPerPointCents: number): string {
  if (!balance || balance <= 0) return '$0'
  const valueUsd = (balance * valuationPerPointCents) / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(valueUsd)
}

/**
 * Helper to compute quick presets for last activity
 */
export function getPresetDate(preset: 'today' | '30_days' | '90_days' | '180_days' | '1_year' | '2_years'): string {
  const d = new Date()
  switch (preset) {
    case 'today':
      break
    case '30_days':
      d.setDate(d.getDate() - 30)
      break
    case '90_days':
      d.setDate(d.getDate() - 90)
      break
    case '180_days':
      d.setDate(d.getDate() - 180)
      break
    case '1_year':
      d.setFullYear(d.getFullYear() - 1)
      break
    case '2_years':
      d.setFullYear(d.getFullYear() - 2)
      break
  }
  return d.toISOString().split('T')[0]
}
