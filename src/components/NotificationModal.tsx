import React, { useState, useEffect } from 'react'
import { X, Bell, AlertTriangle, Clock, Send } from 'lucide-react'
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
      sendLocalNotification('🔔 ExpiryGuard Notifications Enabled', {
        body: 'You will receive proactive alerts 60d, 14d, and 48h before any loyalty points expire.'
      })
    }
  }

  const handleSendTest = () => {
    const success = sendLocalNotification('🛡️ ExpiryGuard Test Alert', {
      body: '⚠️ Emirates Skywards: 45,000 miles expiring in 14 days! Tap to review rescue actions.',
      tag: 'expiry-test'
    })
    setTestSent(true)
    setTimeout(() => setTestSent(false), 2500)
    if (!success && perm !== 'granted') {
      alert('Please enable browser notification permissions first.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
              <Bell className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Loss Prevention Alert Schedule</h3>
              <p className="text-xs text-slate-400">Proactive Web Push & local alert triggers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Permission Status Box */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-300">Browser Permission:</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    perm === 'granted'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : perm === 'denied'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {perm === 'granted' ? 'Active & Ready' : perm === 'denied' ? 'Blocked in Browser' : 'Permission Required'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Web Push notifications run locally in your browser. No emails, no phone numbers, zero tracking.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {perm !== 'granted' ? (
                <button
                  onClick={handleRequestPermission}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  Enable Alerts
                </button>
              ) : (
                <button
                  onClick={handleSendTest}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{testSent ? 'Sent!' : 'Test Alert'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Trigger Cadence Overview */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Autonomous Reminder Cadence
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>60 Days Prior</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Gentle heads-up with low-effort rescue recommendations (e.g. dining or partner purchase).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs font-bold text-rose-400 flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>14 Days Prior</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  High-urgency notice advising instant action like 1,000 pt transfer or micro-purchase.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs font-bold text-red-500 flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>48 Hours Prior</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Final emergency call to burn points on shopping vouchers or charity donations before forfeiture.
                </p>
              </div>
            </div>
          </div>

          {/* Computed Upcoming Milestones */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Upcoming Trigger Milestones For Your Deck
            </h4>

            {upcomingAlerts.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {upcomingAlerts
                  .filter((a) => !a.isPast)
                  .slice(0, 6)
                  .map((alert, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{alert.programName}</div>
                        <div className="text-[11px] text-slate-400">
                          {alert.triggerType.replace('_', ' ')} alert: {alert.rescueTip}
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-semibold px-2 py-1 rounded bg-slate-800 text-indigo-300 shrink-0 ml-2">
                        {alert.scheduledFor}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900 text-center text-xs text-slate-400">
                All tracked cards are currently immortal or outside active alert windows.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
