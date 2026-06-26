'use client'

import { getScoreColor, getScoreBgColor, getScoreLabel } from '@/lib/score'

interface QualityScoreProps {
  score: number
  tips: string[]
  type: 'proposal' | 'cover-letter' | 'email'
}

export default function QualityScore({ score, tips }: QualityScoreProps) {
  const colorClass = getScoreColor(score)
  const bgClass = getScoreBgColor(score)
  const label = getScoreLabel(score)

  return (
    <div className={`rounded-xl border p-4 ${bgClass}`}>
      {/* Score + Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className={`text-4xl font-bold ${colorClass}`}>{score}</div>
          <div className={`text-xs font-medium ${colorClass}`}>/100</div>
        </div>
        <div className="flex-1">
          <div className={`text-sm font-semibold ${colorClass} mb-1`}>{label}</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                score >= 90 ? 'bg-green-500'
                : score >= 75 ? 'bg-yellow-500'
                : score >= 60 ? 'bg-orange-500'
                : 'bg-red-500'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tips */}
      {tips.length > 0 && (
        <div className="mt-3 space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Improvement Tips
          </p>
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-2 text-sm text-gray-700">
              <span className="mt-0.5 flex-shrink-0">💡</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}