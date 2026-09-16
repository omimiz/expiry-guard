export type PolicyType = 'rolling_inactivity' | 'fixed_calendar' | 'fixed_tenure' | 'no_expiry'

export type Category = 'airlines' | 'hotels' | 'retail' | 'dining' | 'credit_card'

export type EffortLevel = 'instant_free' | 'low_cost' | 'transfer' | 'partner'

export interface RescueAction {
  title: string
  description: string
  effort: EffortLevel
  partnerExample?: string
  actionHint?: string
}

export interface LoyaltyProgram {
  id: string
  name: string
  shortCode: string
  category: Category
  brandColor: string // primary color gradient start
  accentColor: string // primary color gradient end
  textColor: string // contrast text
  iconKey: 'plane' | 'hotel' | 'coffee' | 'shopping-bag' | 'credit-card' | 'sparkles'
  policyType: PolicyType
  validityMonths: number
  fixedMonth?: number // 1-12 (e.g. 12 for Dec 31st)
  fixedDay?: number // e.g. 31
  pointUnit: string // "Miles", "Points", "Stars", "Avios", "SHARE Pts"
  valuationPerPointCents: number // estimated valuation (e.g. 1.2 = $0.012)
  officialPolicySummary: string
  rescueActions: RescueAction[]
}

export interface UserCard {
  id: string
  programId: string
  customProgramName?: string
  approxBalance: number
  lastActivityDate: string // YYYY-MM-DD
  notes?: string
  customValidityMonths?: number
  customPolicyType?: PolicyType
  createdAt: string
}

export type ExpiryStatus = 'healthy' | 'warning' | 'critical' | 'expired' | 'immortal'

export interface ExpirationCalculation {
  expiryDate: Date | null
  formattedDate: string
  daysRemaining: number
  status: ExpiryStatus
  progressPercent: number
  statusText: string
  isExpired: boolean
  isImmortal: boolean
}

export type SortOption = 'urgency' | 'balance_desc' | 'balance_asc' | 'name' | 'category'

export type FilterStatus = 'all' | 'urgent' | 'healthy' | 'expired'
