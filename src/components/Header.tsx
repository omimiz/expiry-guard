import React, { useState, useEffect } from 'react'
import { ShieldCheck, Plus, Bell, Download, Smartphone } from 'lucide-react'
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
      alert('To install ExpiryGuard on iOS: Tap Share -> Add to Home Screen.\nOn Desktop Chrome/Edge: Click the install icon in your address bar.')
    }
  }

  const handleEnableAlerts = async () => {
    const res = await requestNotificationPermission()
    setPermStatus(res)
    if (res === 'granted') {
      sendLocalNotification('🛡️ ExpiryGuard Alerts Activated!', {
        body: `We will safeguard your ${cards.length} loyalty programs and alert you at 60d, 14d, and 48h before points expire.`,
      })
    }
  }

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20 ring-1 ring-white/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                ExpiryGuard
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Zero Credential
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Loyalty & Rewards Loss Prevention
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Notification Button */}
          {permStatus !== 'granted' ? (
            <button
              onClick={handleEnableAlerts}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all duration-150 cursor-pointer shadow-sm"
              title="Enable expiry push notifications"
            >
              <Bell className="w-3.5 h-3.5 animate-bounce" />
              <span className="hidden md:inline">Enable Alerts</span>
              <span className="md:hidden">Alerts</span>
            </button>
          ) : (
            <button
              onClick={onOpenNotifications}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all duration-150 cursor-pointer shadow-sm"
              title="Alerts are active - View notification schedule"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Alerts Active</span>
            </button>
          )}

          {/* Backup / Export button */}
          <button
            onClick={onOpenBackup}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            title="Backup & Export Deck"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Install PWA Button */}
          {!isInstalled && (
            <button
              onClick={handleInstallClick}
              className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/70 text-slate-200 text-xs font-medium transition cursor-pointer"
              title="Install ExpiryGuard PWA on device"
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
              <span>Install App</span>
            </button>
          )}

          {/* Add Program Button */}
          <button
            onClick={() => setIsDeckBuilderOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-rose-600/25 border border-rose-400/30 hover:shadow-rose-600/40 transition-all duration-150 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Program</span>
          </button>
        </div>
      </div>
    </header>
  )
}
