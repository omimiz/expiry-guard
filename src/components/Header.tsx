import React, { useState, useEffect } from 'react'
import { Plus, Bell, Download, Smartphone } from 'lucide-react'
import { useDeck } from '../context/DeckContext'
import { getNotificationPermission, requestNotificationPermission, sendLocalNotification } from '../utils/notifications'

interface HeaderProps {
  onOpenNotifications: () => void
  onOpenBackup: () => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications, onOpenBackup }) => {
  const { setIsDeckBuilderOpen, cards } = useDeck()
  const [permStatus, setPermStatus] = useState<string>('default')
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    setPermStatus(getNotificationPermission())

    const handleBeforeInstall = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setIsInstalled(true)
      }
      setDeferredPrompt(null)
    } else {
      alert('To install Perpetua on iOS: Tap Share -> Add to Home Screen.\nOn Desktop: Click Install in address bar.')
    }
  }

  const handleEnableAlerts = async () => {
    const res = await requestNotificationPermission()
    setPermStatus(res)
    if (res === 'granted') {
      sendLocalNotification('PERPETUA · Private Folio Active', {
        body: `Asset protection active for ${cards.length} programs with discrete cadence reminders.`,
      })
    }
  }

  return (
    <header className="border-b border-white/[0.08] bg-zinc-950/85 backdrop-blur-md sticky top-0 z-30 pt-safe transition-all">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 min-h-[64px] sm:min-h-[72px] flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-white shadow-sm shrink-0">
            <span className="font-serif-luxury text-sm sm:text-base font-bold tracking-tight">P</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline space-x-2">
              <span className="font-serif-luxury text-base sm:text-lg font-bold tracking-[0.2em] sm:tracking-[0.24em] text-white">
                PERPETUA
              </span>
            </div>
            <p className="text-[9px] tracking-[0.2em] uppercase font-mono text-zinc-400 hidden sm:block">
              Private Rewards Folio · Zero-Credential
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
          {/* Notification Button */}
          {permStatus !== 'granted' ? (
            <button
              onClick={handleEnableAlerts}
              className="inline-flex items-center justify-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition cursor-pointer min-h-[36px]"
              title="Enable Autonomous Alerts"
            >
              <Bell className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden md:inline">Enable Alerts</span>
              <span className="md:hidden hidden sm:inline">Alerts</span>
            </button>
          ) : (
            <button
              onClick={onOpenNotifications}
              className="inline-flex items-center justify-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition cursor-pointer min-h-[36px]"
              title="Protected Alert Cadence"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="hidden sm:inline">Protected</span>
            </button>
          )}

          {/* Backup Button */}
          <button
            onClick={onOpenBackup}
            className="p-2 sm:px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition cursor-pointer min-h-[36px] flex items-center justify-center"
            title="Export / Restore Private Folio"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Install PWA Button */}
          {!isInstalled && (
            <button
              onClick={handleInstallClick}
              className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition cursor-pointer min-h-[36px]"
            >
              <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
              <span>Install Folio</span>
            </button>
          )}

          {/* Add Program Button */}
          <button
            onClick={() => setIsDeckBuilderOpen(true)}
            className="inline-flex items-center justify-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-semibold shadow-sm transition cursor-pointer active:scale-98 min-h-[36px] whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Asset</span>
            <span className="sm:hidden">Asset</span>
          </button>
        </div>
      </div>
    </header>
  )
}
