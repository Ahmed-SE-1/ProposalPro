'use client'

import { useState } from 'react'
import SkillPills from './SkillPills'
import OutputCard from './OutputCard'

const TONES = ['Professional', 'Friendly', 'Bold']
const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Expert']

interface ProposalFormProps {
  targetRange: 'short' | 'long'
}

export default function ProposalForm({ targetRange }: ProposalFormProps) {
  const [skills, setSkills] = useState<string[]>([])
  const [experience, setExperience] = useState('Intermediate')
  const [rateType, setRateType] = useState<'fixed' | 'hourly'>('hourly')
  const [rateValue, setRateValue] = useState('')
  
  // Naye States (Priority 4)
  const [clientName, setClientName] = useState('')
  const [includeLoom, setIncludeLoom] = useState(true)
  const [includeGuarantee, setIncludeGuarantee] = useState(true)
  
  const [jobDescription, setJobDescription] = useState('')
  const [pastExperience, setPastExperience] = useState('')
  const [tone, setTone] = useState('Professional')
  
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSkillToggle = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const getRateString = () => {
    if (!rateValue) return 'Not specified'
    return rateType === 'fixed' ? `$${rateValue} fixed price` : `$${rateValue}/hr`
  }

  const handleSubmit = async () => {
    setError('')
    setIsLoading(true)
    setOutput('')

    try {
      const res = await fetch('/api/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: skills.length > 0 ? skills.join(', ') : 'Not specified',
          category: skills.length > 0 ? skills[0].toLowerCase().replace(/\s+/g, '-') : 'web-dev',
          experience,
          rate: getRateString(),
          jobDescription,
          pastExperience,
          tone,
          targetRange,
          // 👈 Naye parameters backend ko bhej rahe hain
          clientName,
          includeLoom,
          includeGuarantee
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return }
      setOutput(data.proposal)
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Multi-select Skill Pills */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Your Skills / Categories{' '}
          <span className="text-slate-400 font-normal">(select multiple)</span>
        </label>
        <SkillPills selected={skills} onSelect={handleSkillToggle} />
      </div>

      {/* Experience + Rate */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1.5">
            Experience Level
          </label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white bg-[#0D1220] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {EXPERIENCE_LEVELS.map((lvl) => <option key={lvl}>{lvl}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1.5">
            Your Rate
          </label>
          <div className="flex border border-white/10 rounded-lg overflow-hidden mb-2">
            <button type="button" onClick={() => setRateType('fixed')}
              className={`flex-1 py-2 text-sm font-medium transition-all ${
                rateType === 'fixed'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#0D1220] text-slate-400 hover:text-white'
              }`}
            >
              Fixed
            </button>
            <button type="button" onClick={() => setRateType('hourly')}
              className={`flex-1 py-2 text-sm font-medium border-l border-white/10 transition-all ${
                rateType === 'hourly'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#0D1220] text-slate-400 hover:text-white'
              }`}
            >
              Per Hour
            </button>
          </div>
          {/* 🎯 NAYA CODE: Clean Rate Field with External Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Main Input Field */}
            <div className="flex-1 flex items-center border border-white/10 rounded-lg px-3 py-2 bg-[#0D1220] focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <span className="text-sm text-slate-400">$</span>
              <input
                type="number"
                min="0"
                value={rateValue}
                onChange={(e) => setRateValue(e.target.value)}
                placeholder={rateType === 'fixed' ? '500' : '25'}
                // Tailwind classes to hide default browser arrows and remove background
                className="w-full bg-transparent px-1 py-0.5 text-sm text-white placeholder-slate-600 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                {rateType === 'fixed' ? 'USD' : 'USD/hr'}
              </span>
            </div>

            {/* Custom + / - Buttons */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setRateValue(prev => String(Math.max(0, Number(prev || 0) - 1)))}
                className="flex items-center justify-center w-9 h-[42px] rounded-lg border border-white/10 bg-[#0D1220] text-slate-400 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all focus:outline-none"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setRateValue(prev => String(Number(prev || 0) + 1))}
                className="flex items-center justify-center w-9 h-[42px] rounded-lg border border-white/10 bg-[#0D1220] text-slate-400 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all focus:outline-none"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 Naya Field: Client Name */}
      <div>
        <label className="block text-sm font-medium text-white mb-1.5">
          Client Name <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="e.g. John (leave blank if unknown)"
          className="w-full border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white bg-[#0D1220] placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Job Description */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-sm font-medium text-white">
            Job Description <span className="text-red-400">*</span>
          </label>
          <span className={`text-xs ${jobDescription.length < 50 ? 'text-red-400' : 'text-slate-500'}`}>
            {jobDescription.length} chars{' '}
            {jobDescription.length < 50 ? `(need ${50 - jobDescription.length} more)` : '✓'}
          </span>
        </div>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full Upwork/Fiverr job description here..."
          rows={5}
          className="w-full border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white bg-[#0D1220] placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      {/* Past Experience */}
      <div>
        <label className="block text-sm font-medium text-white mb-1.5">
          Past Experience / Portfolio{' '}
          {/* 🎯 Naya Hint */}
          <span className="text-slate-400 font-normal">(Numbers & specific results work best)</span>
        </label>
        <input
          type="text"
          value={pastExperience}
          onChange={(e) => setPastExperience(e.target.value)}
          placeholder="e.g. Built a Next.js site, improved load time by 40%"
          className="w-full border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white bg-[#0D1220] placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* 🎯 Naya Field: Loom & Guarantee Toggles */}
      <div className="grid grid-cols-2 gap-4">
        {/* Loom Toggle */}
        <div 
          onClick={() => setIncludeLoom(!includeLoom)}
          className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-[#0D1220] cursor-pointer hover:border-white/30 transition-all select-none"
        >
          <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${includeLoom ? 'bg-indigo-600' : 'bg-slate-700'}`}>
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${includeLoom ? 'translate-x-4' : 'translate-x-1'}`} />
          </div>
          <span className="text-sm text-white font-medium">Offer Loom Video</span>
        </div>
        
        {/* Guarantee Toggle */}
        <div 
          onClick={() => setIncludeGuarantee(!includeGuarantee)}
          className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-[#0D1220] cursor-pointer hover:border-white/30 transition-all select-none"
        >
          <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${includeGuarantee ? 'bg-indigo-600' : 'bg-slate-700'}`}>
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${includeGuarantee ? 'translate-x-4' : 'translate-x-1'}`} />
          </div>
          <span className="text-sm text-white font-medium">Include Guarantee</span>
        </div>
      </div>

      {/* Tone */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Tone</label>
        <div className="flex gap-2">
          {TONES.map((t) => (
            <button key={t} type="button" onClick={() => setTone(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                tone === t
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-[#0D1220] text-slate-400 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 🎯 Updated targetRange indicator */}
      <div className="flex items-center gap-2 text-xs text-slate-500 bg-[#0D1220] rounded-lg px-3 py-2 border border-white/[0.06]">
        <span>📏</span>
        <span>
          Target length:{' '}
          <strong className="text-indigo-400">
            {targetRange === 'short' ? 'Short Punchy (50–65 words)' : 'Deep Specific (300–400 words)'}
          </strong>
          {' '}— change from Length dropdown above
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isLoading || jobDescription.length < 50}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? 'Generating...' : '✨ Generate Proposal'}
      </button>

      <OutputCard
        output={output}
        type="proposal"
        isLoading={isLoading}
        onRegenerate={handleSubmit}
      />
    </div>
  )
}