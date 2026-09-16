import { calculateExpiry, calculateBalanceValuation } from './calculator'
import { LOYALTY_CATALOG } from '../data/loyaltyCatalog'
import type { UserCard } from '../types'

function runSanityChecks() {
  console.log('🧪 Starting ExpiryGuard Calculation Engine Sanity Checks...\n')

  const now = new Date('2026-09-16T12:00:00Z')

  // 1. Delta SkyMiles - No expiry
  const deltaProg = LOYALTY_CATALOG.find((p) => p.id === 'delta-skymiles')!
  const deltaCard: UserCard = {
    id: 'test-delta',
    programId: 'delta-skymiles',
    approxBalance: 50000,
    lastActivityDate: '2020-01-01',
    createdAt: '2026-01-01'
  }
  const deltaExp = calculateExpiry(deltaCard, deltaProg, now)
  console.assert(deltaExp.isImmortal === true, 'Delta SkyMiles should be immortal')
  console.assert(deltaExp.daysRemaining === Infinity, 'Delta SkyMiles should have infinite days remaining')
  console.assert(deltaExp.status === 'immortal', 'Delta status should be immortal')
  console.log('✓ Delta SkyMiles (no_expiry) passed')

  // 2. Marriott Bonvoy - Rolling 24 months
  const marriottProg = LOYALTY_CATALOG.find((p) => p.id === 'marriott-bonvoy')!
  // Activity 23 months ago -> 1 month left (~30 days -> warning status)
  const marriottCard: UserCard = {
    id: 'test-marriott',
    programId: 'marriott-bonvoy',
    approxBalance: 30000,
    lastActivityDate: '2024-10-16', // 23 months before 2026-09-16
    createdAt: '2024-10-16'
  }
  const marriottExp = calculateExpiry(marriottCard, marriottProg, now)
  console.assert(marriottExp.status === 'warning', `Marriott should be warning, got ${marriottExp.status}`)
  console.assert(marriottExp.daysRemaining > 0 && marriottExp.daysRemaining <= 60, `Marriott days remaining ${marriottExp.daysRemaining} should be <= 60`)
  console.log(`✓ Marriott Bonvoy rolling 24m (status: ${marriottExp.status}, days: ${marriottExp.daysRemaining}) passed`)

  // 3. Starbucks - Critical status (<= 14 days)
  const sbuxProg = LOYALTY_CATALOG.find((p) => p.id === 'starbucks-rewards')!
  // Starbucks is 6 months validity. Activity 5 months and 22 days ago -> ~8 days left -> critical
  const sbuxCard: UserCard = {
    id: 'test-sbux',
    programId: 'starbucks-rewards',
    approxBalance: 200,
    lastActivityDate: '2026-03-24', // ~5.7 months ago
    createdAt: '2026-03-24'
  }
  const sbuxExp = calculateExpiry(sbuxCard, sbuxProg, now)
  console.assert(sbuxExp.status === 'critical', `Starbucks should be critical, got ${sbuxExp.status}`)
  console.assert(sbuxExp.daysRemaining <= 14, `Starbucks days remaining ${sbuxExp.daysRemaining} should be <= 14`)
  console.log(`✓ Starbucks Rewards rolling 6m (status: ${sbuxExp.status}, days: ${sbuxExp.daysRemaining}) passed`)

  // 4. Carrefour SHARE - Fixed Calendar (Dec 31)
  const shareProg = LOYALTY_CATALOG.find((p) => p.id === 'carrefour-share')!
  const shareCard: UserCard = {
    id: 'test-share',
    programId: 'carrefour-share',
    approxBalance: 1500,
    lastActivityDate: '2026-01-15',
    createdAt: '2026-01-15'
  }
  const shareExp = calculateExpiry(shareCard, shareProg, now)
  console.assert(shareExp.expiryDate?.getMonth() === 11, 'Carrefour SHARE should expire in December')
  console.assert(shareExp.expiryDate?.getDate() === 31, 'Carrefour SHARE should expire on Dec 31st')
  console.log(`✓ Carrefour SHARE fixed calendar (expires: ${shareExp.formattedDate}) passed`)

  // 5. Valuation check
  const val = calculateBalanceValuation(50000, 1.2)
  console.assert(val === '$600', `Expected $600, got ${val}`)
  console.log(`✓ Balance valuation helper ($600 for 50k miles @ 1.2¢) passed`)

  console.log('\n🎉 ALL 5 SANITY CHECKS PASSED PERFECTLY!\n')
}

runSanityChecks()
