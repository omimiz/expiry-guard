import type { UserCard, LoyaltyProgram } from '../types'
import { calculateExpiry } from './calculator'

export interface ScheduledAlert {
  cardId: string
  programName: string
  triggerType: '60_days' | '14_days' | '48_hours'
  scheduledFor: string // formatted date string
  approxBalance: number
  pointUnit: string
  rescueTip: string
  isPast: boolean
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported'
  return Notification.permission
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported'
  try {
    const perm = await Notification.requestPermission()
    return perm
  } catch {
    return 'denied'
  }
}

export function sendLocalNotification(title: string, options?: NotificationOptions): boolean {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false
  }

  try {
    // If Service Worker is active, send via SW for background support, else native Notification
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          ...(options as any)
        })
      })
    } else {
      new Notification(title, {
        icon: '/icon-192.png',
        ...options
      })
    }
    return true
  } catch (err) {
    console.warn('Failed to send notification:', err)
    return false
  }
}

/**
 * Computes scheduled alert milestones for all active cards in user's deck
 */
export function computeUpcomingAlerts(cards: UserCard[], catalog: LoyaltyProgram[]): ScheduledAlert[] {
  const alerts: ScheduledAlert[] = []
  const today = new Date()

  for (const card of cards) {
    const program = catalog.find((p) => p.id === card.programId)
    const expiry = calculateExpiry(card, program, today)

    if (expiry.isImmortal || !expiry.expiryDate) continue

    const programName = program?.name || card.customProgramName || 'Loyalty Card'
    const topRescue = program?.rescueActions[0]?.title || 'Review rescue options in ExpiryGuard'
    const pointUnit = program?.pointUnit || 'pts'

    const expiryTime = expiry.expiryDate.getTime()

    // 60 days before
    const date60d = new Date(expiryTime - 60 * 24 * 60 * 60 * 1000)
    alerts.push({
      cardId: card.id,
      programName,
      triggerType: '60_days',
      scheduledFor: date60d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      approxBalance: card.approxBalance,
      pointUnit,
      rescueTip: topRescue,
      isPast: date60d.getTime() < today.getTime()
    })

    // 14 days before
    const date14d = new Date(expiryTime - 14 * 24 * 60 * 60 * 1000)
    alerts.push({
      cardId: card.id,
      programName,
      triggerType: '14_days',
      scheduledFor: date14d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      approxBalance: card.approxBalance,
      pointUnit,
      rescueTip: topRescue,
      isPast: date14d.getTime() < today.getTime()
    })

    // 48 hours before
    const date48h = new Date(expiryTime - 2 * 24 * 60 * 60 * 1000)
    alerts.push({
      cardId: card.id,
      programName,
      triggerType: '48_hours',
      scheduledFor: date48h.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      approxBalance: card.approxBalance,
      pointUnit,
      rescueTip: topRescue,
      isPast: date48h.getTime() < today.getTime()
    })
  }

  return alerts
}
