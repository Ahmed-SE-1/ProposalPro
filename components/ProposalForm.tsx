'use client'

import { useState } from 'react'
import SkillPills from './SkillPills'
import OutputCard from './OutputCard'

const TONES = ['Professional', 'Friendly', 'Bold']
const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Expert']

// 🎯 Define interface props to receive length preference from parent page
interface ProposalFormProps {
  targetRange?: 'short' | 'long'
}

export default function ProposalForm({ targetRange = 'short' }: ProposalFormProps) {
  const [skill, setSkill] = useState('Web Dev')
  const [experience, setExperience] = useState('Intermediate')
  const [rate, setRate] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [pastExperience, setPastExperience] = useState('')
  const [tone, setTone] = useState('Professional')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    setIsLoading(true)
    setOutput('')

    try {
      const res = await fetch('/api/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 💡 ADDED: targetRange included in the payload request body
        body: JSON.stringify({ 
          skill, 
          experience, 
          rate, 
          jobDescription, 
          pastExperience, 
          tone,
          targetRange 
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
      {/* Skill Pills */}
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
          Your Skill / Category
        </label>
        <SkillPills selected={skill} onSelect={setSkill} />
      </div>

      {/* Experience + Rate */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
            Experience Level
          </label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white"
          >
            {EXPERIENCE_LEVELS.map((lvl) => <option key={lvl}>{lvl}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
            Rate (e.g. $25/hr)
          </label>
          <input
            type="text"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="$25/hr or $500 fixed"
            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>
      </div>

      {/* Job Description */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-sm font-medium text-[#1A1A1A]">
            Job Description <span className="text-red-500">*</span>
          </label>
          <span className={`text-xs ${jobDescription.length < 50 ? 'text-red-400' : 'text-[#6B7280]'}`}>
            {jobDescription.length} chars {jobDescription.length < 50 ? `(need ${50 - jobDescription.length} more)` : '✓'}
          </span>
        </div>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full Upwork/Fiverr job description here..."
          rows={5}
          className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
        />
      </div>

      {/* Past Experience */}
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
          Past Experience / Portfolio{' '}
          <span className="text-[#6B7280] font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={pastExperience}
          onChange={(e) => setPastExperience(e.target.value)}
          placeholder="e.g. Built an e-commerce site with 200+ products"
          className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
      </div>

      {/* Tone */}
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Tone</label>
        <div className="flex gap-2">
          {TONES.map((t) => (
            <button key={t} type="button" onClick={() => setTone(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                tone === t
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isLoading || jobDescription.length < 50}
        className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? 'Generating...' : '✨ Generate Proposal'}
      </button>

      <OutputCard output={output} type="proposal" isLoading={isLoading} onRegenerate={handleSubmit} />
    </div>
  )
}