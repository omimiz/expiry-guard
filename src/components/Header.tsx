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
    <header className="border-b border-[#c5a880]/15 bg-[#08080a]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1a1815] to-[#0d0c0b] border border-[#c5a880]/30 flex items-center justify-center text-[#d4af37] shadow-sm">
            <span className="font-serif-luxury text-base font-bold tracking-tight">P</span>
          </div>
          <div>
            <div className="flex items-baseline space-x-2.5">
              <span className="font-serif-luxury text-lg font-bold tracking-[0.24em] text-[#f3e7d3]">
                PERPETUA
              </span>
            </div>
            <p className="text-[9px] tracking-[0.22em] uppercase font-mono text-[#c5a880]/70 hidden sm:block">
              Private Rewards Folio · Zero-Credential
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Notification Button */}
          {permStatus !== 'granted' ? (
            <button
              onClick={handleEnableAlerts}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#141311] hover:bg-[#1a1916] border border-[#c5a880]/30 text-[#e5d3b3] text-xs font-medium transition cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden sm:inline">Enable Alerts</span>
              <span className="sm:hidden">Alerts</span>
            </button>
          ) : (
            <button
              onClick={onOpenNotifications}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#141311] hover:bg-[#1a1916] border border-[#c5a880]/25 text-[#e5d3b3] text-xs font-medium transition cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              <span>Protected</span>
            </button>
          )}

          {/* Backup Button */}
          <button
            onClick={onOpenBackup}
            className="p-2 rounded-lg bg-[#141311] hover:bg-[#1a1916] text-[#c5a880]/80 hover:text-[#f3e7d3] border border-[#c5a880]/20 transition cursor-pointer"
            title="Export / Restore Private Folio"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Install PWA Button */}
          {!isInstalled && (
            <button
              onClick={handleInstallClick}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#141311] hover:bg-[#1a1916] border border-[#c5a880]/20 text-[#c5a880] text-xs font-medium transition cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Install Folio</span>
            </button>
          )}

          {/* Add Program Button */}
          <button
            onClick={() => setIsDeckBuilderOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa823e] hover:from-[#e5c158] hover:to-[#be9448] text-[#0d0c0a] text-xs font-semibold shadow-md shadow-[#d4af37]/10 transition cursor-pointer active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Asset</span>
          </button>
        </div>
      </div>
    </header>
  )
}
