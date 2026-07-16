'use client'

import { useState } from 'react'
import OutputCard from './OutputCard'
import { getDeviceFingerprint } from '@/lib/fingerprint'

const TONES = ['Professional', 'Friendly', 'Bold']

const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function CoverLetterForm() {
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [yourName, setYourName] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [experience, setExperience] = useState('')
  const [whyCompany, setWhyCompany] = useState('')
  const [tone, setTone] = useState('Professional')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    setIsLoading(true)
    setOutput('')

    try {
      const fingerprint = await getDeviceFingerprint()

      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          companyName,
          jobDescription,
          yourName,
          experience,
          whyCompany,
          tone,
          currentDate: getCurrentDate(),
          fingerprint,
        }),
      })
      const data = await res.json()

      if (res.status === 429) {
        setError(data.message || "Today's free limit has been used up. Please try again tomorrow!")
        return
      }

      if (!res.ok) { setError(data.error || 'Something went wrong.'); return }
      setOutput(data.coverLetter)
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Frontend Developer"
            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Company Name</label>
          <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Google"
            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
          Your Full Name <span className="text-red-500">*</span>
        </label>
        <input type="text" value={yourName} onChange={(e) => setYourName(e.target.value)}
          placeholder="e.g. Ahmed Khan"
          className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-sm font-medium text-[#1A1A1A]">
            Job Description <span className="text-red-500">*</span>
          </label>
          <span className={`text-xs ${jobDescription.length < 50 ? 'text-red-400' : 'text-[#6B7280]'}`}>
            {jobDescription.length} chars{' '}
            {jobDescription.length < 50 ? `(need ${50 - jobDescription.length} more)` : '✓'}
          </span>
        </div>
        <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          rows={5}
          className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
          Your Experience{' '}
          <span className="text-[#6B7280] font-normal">(optional)</span>
        </label>
        <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)}
          placeholder="e.g. 3 years in React, built 10+ production apps"
          className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
          Why This Company?{' '}
          <span className="text-[#6B7280] font-normal">(recommended)</span>
        </label>
        <input type="text" value={whyCompany} onChange={(e) => setWhyCompany(e.target.value)}
          placeholder="e.g. Their open-source contributions to React ecosystem"
          className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
      </div>

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

      <div className="flex items-center gap-2 text-xs text-[#6B7280] bg-gray-50 rounded-lg px-3 py-2 border border-[#E5E7EB]">
        <span>📅</span>
        <span>Cover letter date will be: <strong>{getCurrentDate()}</strong></span>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading || jobDescription.length < 50 || !yourName.trim()}
        className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? 'Generating...' : '✨ Generate Cover Letter'}
      </button>

      <OutputCard
        output={output}
        type="cover-letter"
        isLoading={isLoading}
        onRegenerate={handleSubmit}
        error={error || null}
      />
    </div>
  )
}