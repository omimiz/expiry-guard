import React, { useState } from 'react'
import { X, Download, Upload, Copy, Check, FileJson } from 'lucide-react'
import { useDeck } from '../context/DeckContext'

interface BackupModalProps {
  isOpen: boolean
  onClose: () => void
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const { exportDeck, importDeck, clearDeck, cards } = useDeck()
  const [copied, setCopied] = useState(false)
  const [importText, setImportText] = useState('')
  const [importStatus, setImportStatus] = useState<{ success?: boolean; msg?: string } | null>(null)

  if (!isOpen) return null

  const jsonContent = exportDeck()

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `perpetua-folio-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setImportText(text)
      executeImport(text)
    }
    reader.readAsText(file)
  }

  const executeImport = (rawText: string) => {
    const res = importDeck(rawText)
    if (res.success) {
      setImportStatus({ success: true, msg: `Restored ${res.count} loyalty assets into folio.` })
    } else {
      setImportStatus({ success: false, msg: res.error || 'Failed to import folio file.' })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#121216] to-[#0a0a0d] border border-[#c5a880]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Top Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#d4af37] via-[#f3e7d3] to-[#aa823e]" />

        {/* Header */}
        <div className="p-5 border-b border-[#c5a880]/15 flex items-start justify-between bg-[#0e0e12]/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a1815] border border-[#c5a880]/30 flex items-center justify-center">
              <FileJson className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="text-sm font-serif-luxury font-semibold text-[#f3e7d3]">Private Folio Backup</h3>
              <p className="text-xs text-zinc-400">Zero-credential local storage export & migration</p>
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
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Export */}
          <div className="space-y-2.5">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880]">
              Folio Export ({cards.length} Assets)
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Export your asset portfolio file to transfer across private devices without linking cloud accounts or credentials.
            </p>

            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={handleDownload}
                className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa823e] text-[#0d0c0a] text-xs font-semibold transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .JSON Folio</span>
              </button>
              <button
                onClick={handleCopy}
                className="py-2 px-3 rounded-lg bg-[#141311] hover:bg-[#1a1916] border border-[#c5a880]/25 text-[#e5d3b3] hover:text-[#f3e7d3] text-xs font-medium transition flex items-center space-x-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#d4af37]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="h-px bg-[#c5a880]/15" />

          {/* Import */}
          <div className="space-y-2.5">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a880]">
              Restore Folio
            </div>

            {importStatus && (
              <div
                className={`p-2.5 rounded-lg text-xs font-medium font-mono ${
                  importStatus.success
                    ? 'bg-[#1b251a] text-emerald-300 border border-emerald-800/40'
                    : 'bg-[#291414] text-rose-300 border border-rose-800/40'
                }`}
              >
                {importStatus.msg}
              </div>
            )}

            <div>
              <label className="block p-3.5 rounded-xl border border-dashed border-[#c5a880]/20 hover:border-[#c5a880]/40 bg-[#111115] text-center cursor-pointer transition">
                <Upload className="w-5 h-5 text-[#c5a880]/60 mx-auto mb-1" />
                <span className="text-xs font-medium text-[#f3e7d3] block">
                  Select Folio Backup File (.json)
                </span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="pt-1">
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Or paste folio JSON code directly here..."
                rows={2}
                className="w-full p-2.5 rounded-xl bg-[#101013] border border-[#c5a880]/20 text-xs text-[#f3e7d3] font-mono placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]/60"
              />
              {importText && (
                <button
                  onClick={() => executeImport(importText)}
                  className="mt-1.5 w-full py-1.5 rounded-lg bg-[#1a1815] hover:bg-[#221f1a] text-xs font-medium text-[#e5d3b3] border border-[#c5a880]/30 transition cursor-pointer"
                >
                  Load Folio
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#c5a880]/15 bg-[#0a0a0d] flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Clear all assets from local folio?')) {
                clearDeck()
              }
            }}
            className="text-xs text-rose-400 hover:text-rose-300 cursor-pointer font-mono text-[11px]"
          >
            Clear Folio
          </button>
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
