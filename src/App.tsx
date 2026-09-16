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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white antialiased">
      {/* App Header */}
      <Header
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Metric Aggregates & Filters */}
        <SummaryBanner />

        {/* The Card Deck / Grid */}
        <WalletDeck />
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-800/60 bg-[#09090b] mt-16 py-6 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Zero-Credential Architecture · No logins or passwords stored.</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-zinc-400">
            <span>Deterministic Decay Rules</span>
            <span>·</span>
            <span>Local-First PWA</span>
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
