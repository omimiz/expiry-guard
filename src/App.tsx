import React, { useState } from 'react'
import { DeckProvider, useDeck } from './context/DeckContext'
import { Header } from './components/Header'
import { SummaryBanner } from './components/SummaryBanner'
import { WalletDeck } from './components/WalletDeck'
import { DeckBuilderModal } from './components/DeckBuilderModal'
import { RescueModal } from './components/RescueModal'
import { CustomCardModal } from './components/CustomCardModal'
import { EditCardModal } from './components/EditCardModal'
import { NotificationModal } from './components/NotificationModal'
import { BackupModal } from './components/BackupModal'
import { Lock } from 'lucide-react'

const AppContent: React.FC = () => {
  const {
    activeRescueCard,
    setActiveRescueCard,
    editingCard,
    setEditingCard,
    isDeckBuilderOpen,
    setIsDeckBuilderOpen
  } = useDeck()

  const [isCustomOpen, setIsCustomOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isBackupOpen, setIsBackupOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* App Header */}
      <Header
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Metric Aggregates & Filters */}
        <SummaryBanner />

        {/* The Card Deck / Grid */}
        <WalletDeck />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>Zero-Credential Guarantee:</strong> No passwords or logins are ever collected or transmitted.
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Deterministic Program Decay Rules</span>
            <span>•</span>
            <span>PWA & Offline Ready</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DeckBuilderModal
        isOpen={isDeckBuilderOpen}
        onClose={() => setIsDeckBuilderOpen(false)}
        onOpenCustomProgram={() => {
          setIsDeckBuilderOpen(false)
          setIsCustomOpen(true)
        }}
      />

      <RescueModal
        card={activeRescueCard}
        onClose={() => setActiveRescueCard(null)}
      />

      <CustomCardModal
        isOpen={isCustomOpen}
        onClose={() => setIsCustomOpen(false)}
      />

      <EditCardModal
        card={editingCard}
        onClose={() => setEditingCard(null)}
      />

      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />
    </div>
  )
}

export default function App() {
  return (
    <DeckProvider>
      <AppContent />
    </DeckProvider>
  )
}
