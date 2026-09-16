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
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#121216] to-[#0a0a0d] border border-[#c5a880]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Top Hairline Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#d4af37] via-[#f3e7d3] to-[#aa823e]" />

        {/* Header */}
        <div className="p-5 border-b border-[#c5a880]/15 flex items-start justify-between bg-[#0e0e12]/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a1815] border border-[#c5a880]/30 flex items-center justify-center">
              <Bell className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="text-sm font-serif-luxury font-semibold text-[#f3e7d3]">Private Reminder Cadence</h3>
              <p className="text-xs text-zinc-400">Autonomous notifications delivered strictly to this device</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:text-[#f3e7d3] hover:bg-[#1a1916] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Permission Status */}
          <div className="p-4 rounded-xl bg-[#111115] border border-[#c5a880]/15 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-[#e5d3b3]">Device Status:</span>
                <span className="text-xs font-mono text-[#d4af37]">
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
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa823e] text-[#0d0c0a] text-xs font-semibold shadow-sm transition cursor-pointer"
                >
                  Authorize
                </button>
              ) : (
                <button
                  onClick={handleSendTest}
                  className="px-3.5 py-1.5 rounded-lg bg-[#1a1815] hover:bg-[#221f1a] text-[#f3e7d3] text-xs font-medium border border-[#c5a880]/30 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Send className="w-3 h-3 text-[#d4af37]" />
                  <span>{testSent ? 'Dispatched' : 'Test Alert'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Trigger Cadence Overview */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880]">
              Notification Cadence
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-3 rounded-lg bg-[#111115] border border-[#c5a880]/15">
                <div className="text-xs font-serif-luxury font-semibold text-[#f3e7d3] flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-[#d4af37]" />
                  <span>60 Days</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1 font-sans">Strategic advance memo for low-effort partner spend.</p>
              </div>

              <div className="p-3 rounded-lg bg-[#111115] border border-[#c5a880]/15">
                <div className="text-xs font-serif-luxury font-semibold text-[#f3e7d3] flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-rose-400" />
                  <span>14 Days</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1 font-sans">High-urgency notice advising transfer or concierge spend.</p>
              </div>

              <div className="p-3 rounded-lg bg-[#111115] border border-[#c5a880]/15">
                <div className="text-xs font-serif-luxury font-semibold text-[#f3e7d3] flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-red-500" />
                  <span>48 Hours</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1 font-sans">Critical final alert before irreversible asset forfeiture.</p>
              </div>
            </div>
          </div>

          {/* Upcoming Milestones */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880]">
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
                      className="p-2.5 rounded-lg bg-[#111115] border border-[#c5a880]/10 flex items-center justify-between text-xs font-mono"
                    >
                      <div>
                        <span className="text-[#f3e7d3] font-serif-luxury text-xs">{alert.programName}</span>
                        <span className="text-zinc-500 ml-2 text-[10px]">
                          ({alert.triggerType.replace('_', ' ')})
                        </span>
                      </div>
                      <span className="text-[11px] text-[#c5a880]">
                        {alert.scheduledFor}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-[#111115] text-center text-xs text-zinc-400">
                All tracked assets are within secure retention windows.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#c5a880]/15 bg-[#0a0a0d] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-[#141311] hover:bg-[#1a1916] border border-[#c5a880]/20 text-xs font-medium text-[#c5a880] hover:text-[#f3e7d3] transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
