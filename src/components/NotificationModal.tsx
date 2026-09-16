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
      sendLocalNotification('PERPETUA · Private Alerts Active', {
        body: 'Discreet milestone alerts active at 60d, 14d, and 48h prior to capital forfeiture.'
      })
    }
  }

  const handleSendTest = () => {
    const success = sendLocalNotification('PERPETUA · Capital Advisory', {
      body: 'Emirates Skywards: 52,000 miles approaching 14-day threshold. Review preservation strategy.',
      tag: 'perpetua-test'
    })
    setTestSent(true)
    setTimeout(() => setTestSent(false), 2500)
    if (!success && perm !== 'granted') {
      alert('Please enable browser notification permissions first.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#121216] to-[#09090b] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] max-h-[90dvh]">
        {/* Top Platinum Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-zinc-500 via-white to-zinc-500" />

        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-start justify-between bg-zinc-950/70 gap-2">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-zinc-300" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-serif-luxury font-semibold text-white truncate">Private Reminder Cadence</h3>
              <p className="text-xs text-zinc-400">Autonomous notifications delivered strictly to this device</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition cursor-pointer shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Permission Status */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-zinc-200">Device Status:</span>
                <span className="text-xs font-mono text-white">
                  {perm === 'granted' ? 'Active & Encrypted' : perm === 'denied' ? 'Disabled' : 'Action Required'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Zero third-party services. All alerts originate locally within browser memory.
              </p>
            </div>

            <div>
              {perm !== 'granted' ? (
                <button
                  onClick={handleRequestPermission}
                  className="px-3.5 py-1.5 rounded-lg bg-white text-zinc-950 text-xs font-semibold shadow-sm transition cursor-pointer hover:bg-zinc-100"
                >
                  Authorize
                </button>
              ) : (
                <button
                  onClick={handleSendTest}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-white text-xs font-medium border border-zinc-700 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Send className="w-3 h-3 text-zinc-300" />
                  <span>{testSent ? 'Dispatched' : 'Test Alert'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Trigger Cadence Overview */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
              Notification Cadence
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div className="text-xs font-serif-luxury font-semibold text-white flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-zinc-300" />
                  <span>60 Days</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1 font-sans">Strategic advance memo for low-effort partner spend.</p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div className="text-xs font-serif-luxury font-semibold text-white flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-rose-400" />
                  <span>14 Days</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1 font-sans">High-urgency notice advising transfer or concierge spend.</p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div className="text-xs font-serif-luxury font-semibold text-white flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-red-500" />
                  <span>48 Hours</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1 font-sans">Critical final alert before irreversible asset forfeiture.</p>
              </div>
            </div>
          </div>

          {/* Upcoming Milestones */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
              Pending Milestones ({upcomingAlerts.filter((a) => !a.isPast).length})
            </div>

            {upcomingAlerts.length > 0 ? (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {upcomingAlerts
                  .filter((a) => !a.isPast)
                  .slice(0, 6)
                  .map((alert, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs font-mono"
                    >
                      <div>
                        <span className="text-white font-serif-luxury text-xs">{alert.programName}</span>
                        <span className="text-zinc-500 ml-2 text-[10px]">
                          ({alert.triggerType.replace('_', ' ')})
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-300">
                        {alert.scheduledFor}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-zinc-900/40 text-center text-xs text-zinc-400">
                All tracked assets are within secure retention windows.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
