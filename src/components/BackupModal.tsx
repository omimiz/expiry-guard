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
    a.download = `expiryguard-backup-${new Date().toISOString().split('T')[0]}.json`
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
      setImportStatus({ success: true, msg: `Restored ${res.count} cards successfully.` })
    } else {
      setImportStatus({ success: false, msg: res.error || 'Failed to import deck.' })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#111114] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800/80 flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <FileJson className="w-4 h-4 text-zinc-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Local-First Backup</h3>
              <p className="text-xs text-zinc-400">Export or restore your private wallet deck</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Export Section */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              Export ({cards.length} Cards)
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Export your card configurations to JSON. Transfer easily between devices without syncing to external servers.
            </p>

            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={handleDownload}
                className="flex-1 py-2 px-3 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .json</span>
              </button>
              <button
                onClick={handleCopy}
                className="py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition flex items-center space-x-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="h-px bg-zinc-800/80" />

          {/* Import Section */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              Restore from Backup
            </div>

            {importStatus && (
              <div
                className={`p-2.5 rounded-lg text-xs font-medium ${
                  importStatus.success
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/50'
                    : 'bg-rose-950/40 text-rose-300 border border-rose-800/50'
                }`}
              >
                {importStatus.msg}
              </div>
            )}

            <div>
              <label className="block p-3.5 rounded-xl border border-dashed border-zinc-800 hover:border-zinc-750 bg-zinc-900/40 text-center cursor-pointer transition">
                <Upload className="w-5 h-5 text-zinc-500 mx-auto mb-1" />
                <span className="text-xs font-medium text-zinc-300 block">
                  Select JSON backup file
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
                placeholder="Or paste JSON content here..."
                rows={2}
                className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              />
              {importText && (
                <button
                  onClick={() => executeImport(importText)}
                  className="mt-1.5 w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition cursor-pointer"
                >
                  Load Pasted Data
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Clear all cards from your local deck?')) {
                clearDeck()
              }
            }}
            className="text-xs text-rose-400 hover:text-rose-300 cursor-pointer"
          >
            Clear data
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
