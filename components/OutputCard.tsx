'use client'

import { useState } from 'react'
import { Copy, Check, RefreshCw, Loader2 } from 'lucide-react'
import { scoreProposal, getImprovementTips } from '@/lib/score'
import QualityScore from './QualityScore'

interface OutputCardProps {
  output: string
  type: 'proposal' | 'cover-letter' | 'email'
  isLoading: boolean
  onRegenerate: () => void
}

export default function OutputCard({
  output,
  type,
  isLoading,
  onRegenerate,
}: OutputCardProps) {
  const [copied, setCopied] = useState(false)

  const wordCount = output.trim().split(/\s+/).filter(Boolean).length
  const readTimeSec = Math.ceil((wordCount / 238) * 60)
  const score = output ? scoreProposal(output, type) : 0
  const tips = output ? getImprovementTips(output, type) : []

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = output
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#0D1220] p-8 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-sm text-slate-400">Generating your {type}...</p>
        <p className="text-xs text-slate-500">This takes 5–10 seconds</p>
      </div>
    )
  }

  if (!output) return null

  return (
    <div className="mt-6 space-y-4">
      {/* Quality Score */}
      <QualityScore score={score} tips={tips} type={type} />

      {/* Output Box */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0D1220] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white capitalize">
              {type === 'cover-letter' ? 'Cover Letter'
                : type === 'email' ? 'Email'
                : 'Proposal'}
            </span>
            <span className="text-xs text-slate-500">
              {wordCount} words · ~{readTimeSec}s read
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-200 transition-colors px-2 py-1 rounded-lg hover:bg-white/[0.06]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Regenerate
            </button>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                copied
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
            >
              {copied ? (
                <><Check className="w-3.5 h-3.5" /> Copied!</>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Copy</>
              )}
            </button>
          </div>
        </div>

        {/* Content — THIS was the bug: text-[#1A1A1A] is near-black, invisible on dark bg */}
        <div className="p-4 max-h-96 overflow-y-auto">
          <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
            {output}
          </p>
        </div>

      </div>
    </div>
  )
}