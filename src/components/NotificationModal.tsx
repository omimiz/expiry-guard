import React, { useState, useEffect } from 'react'
import { X, Bell, Clock, Send } from 'lucide-react'
import { useDeck } from '../context/DeckContext'
import { LOYALTY_CATALOG } from '../data/loyaltyCatalog'
import {
  getNotificationPermission,
  requestNotificationPermission,
  sendLocalNotification,
  computeUpcomingAlerts
} from '../utils/notifications'
import type { ScheduledAlert } from '../utils/notifications'

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const { cards } = useDeck()
  const [perm, setPerm] = useState<string>('default')
  const [testSent, setTestSent] = useState(false)

  useEffect(() => {
    setPerm(getNotificationPermission())
  }, [isOpen])

  if (!isOpen) return null

  const upcomingAlerts: ScheduledAlert[] = computeUpcomingAlerts(cards, LOYALTY_CATALOG)

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission()
    setPerm(res)
    if (res === 'granted') {
      sendLocalNotification('ExpiryGuard Alerts Active', {
        body: 'You will receive notifications at 60d, 14d, and 48h before points expire.'
      })
    }
  }

  const handleSendTest = () => {
    const success = sendLocalNotification('ExpiryGuard Test Alert', {
      body: 'Emirates Skywards: points expiring in 14 days. Review rescue guide.',
      tag: 'expiry-test'
    })
    setTestSent(true)
    setTimeout(() => setTestSent(false), 2500)
    if (!success && perm !== 'granted') {
      alert('Please enable browser notification permissions first.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#111114] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800/80 flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Bell className="w-4 h-4 text-zinc-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Alert Schedule & Reminders</h3>
              <p className="text-xs text-zinc-400">Deterministic local notification cadence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Permission Status Box */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-zinc-300">Browser Permission:</span>
                <span className="text-xs text-zinc-400 font-mono">
                  {perm === 'granted' ? 'Granted' : perm === 'denied' ? 'Blocked' : 'Not Requested'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Local-first notifications. No emails, phone numbers, or third-party servers.
              </p>
            </div>

            <div>
              {perm !== 'granted' ? (
                <button
                  onClick={handleRequestPermission}
                  className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition cursor-pointer"
                >
                  Enable
                </button>
              ) : (
                <button
                  onClick={handleSendTest}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Send className="w-3 h-3 text-zinc-400" />
                  <span>{testSent ? 'Sent' : 'Test'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Trigger Cadence Overview */}
          <div className="space-y-2">
            <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              Reminder Cadence
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80">
                <div className="text-xs font-medium text-amber-300 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>60 Days</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">Gentle notice with low-effort partner tips.</p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80">
                <div className="text-xs font-medium text-rose-300 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>14 Days</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">High-priority warning for immediate action.</p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80">
                <div className="text-xs font-medium text-zinc-300 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>48 Hours</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">Final reminder before point expiration.</p>
              </div>
            </div>
          </div>

          {/* Upcoming Milestones */}
          <div className="space-y-2">
            <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              Upcoming Milestones ({upcomingAlerts.filter((a) => !a.isPast).length})
            </div>

            {upcomingAlerts.length > 0 ? (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {upcomingAlerts
                  .filter((a) => !a.isPast)
                  .slice(0, 6)
                  .map((alert, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/70 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-medium text-zinc-200">{alert.programName}</span>
                        <span className="text-zinc-400 ml-2 text-[11px]">
                          ({alert.triggerType.replace('_', ' ')})
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {alert.scheduledFor}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-zinc-900/40 text-center text-xs text-zinc-400">
                No active milestones pending.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
