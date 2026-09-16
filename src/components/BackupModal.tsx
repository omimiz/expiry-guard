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
    a.download = `expiryguard-deck-backup-${new Date().toISOString().split('T')[0]}.json`
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
      setImportStatus({ success: true, msg: `Successfully imported ${res.count} loyalty cards!` })
    } else {
      setImportStatus({ success: false, msg: res.error || 'Failed to import deck.' })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <FileJson className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Local-First Backup & Sync</h3>
              <p className="text-xs text-slate-400">Export or restore your private wallet deck</p>
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
          {/* Export Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export Deck ({cards.length} Cards)</span>
              </h4>
            </div>
            <p className="text-xs text-slate-400">
              Download your offline deck backup JSON to migrate between devices or safeguard your tracking rules.
            </p>

            <div className="flex items-center space-x-2.5 pt-1">
              <button
                onClick={handleDownload}
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-indigo-600/20"
              >
                <Download className="w-4 h-4" />
                <span>Download .JSON Backup</span>
              </button>
              <button
                onClick={handleCopy}
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition flex items-center space-x-2 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Import Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import / Restore Deck</span>
            </h4>

            {importStatus && (
              <div
                className={`p-3 rounded-xl text-xs font-medium ${
                  importStatus.success
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {importStatus.msg}
              </div>
            )}

            <div>
              <label className="block p-4 rounded-2xl border-2 border-dashed border-slate-700 hover:border-indigo-500/60 bg-slate-900/50 hover:bg-slate-900 text-center cursor-pointer transition">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <span className="text-xs font-semibold text-slate-200 block">
                  Click to select JSON backup file
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Restores cards directly into your local browser storage
                </span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="pt-2">
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Or paste JSON code directly here..."
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {importText && (
                <button
                  onClick={() => executeImport(importText)}
                  className="mt-2 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition cursor-pointer"
                >
                  Load Pasted Data
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Clear all cards from your local deck?')) {
                clearDeck()
              }
            }}
            className="text-xs text-rose-400 hover:text-rose-300 cursor-pointer"
          >
            Reset All Data
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
