'use client'

import { useState } from 'react'
import OutputCard from './OutputCard'

const FOUND_VIA_OPTIONS = ['LinkedIn', 'Company Website', 'Referral', 'Indeed', 'Other']
const ATTACHMENT_OPTIONS = ['Cover Letter', 'Resume', 'Portfolio', 'All']

export default function EmailForm() {
  const [hrName, setHrName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [foundVia, setFoundVia] = useState('LinkedIn')
  const [yourName, setYourName] = useState('')
  const [contact, setContact] = useState('')
  const [skills, setSkills] = useState('')
  const [referral, setReferral] = useState('')
  const [attachments, setAttachments] = useState<string[]>(['Resume'])
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleAttachment = (item: string) => {
    if (item === 'All') {
      setAttachments(['Cover Letter', 'Resume', 'Portfolio'])
      return
    }
    setAttachments((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    )
  }

  const handleSubmit = async () => {
    setError('')
    setIsLoading(true)
    setOutput('')

    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hrName, companyName, jobTitle, foundVia, yourName, contact, skills, referral, attachments }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return }
      setOutput(data.email)
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* HR Name + Company */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
            HR / Manager Name <span className="text-[#6B7280] font-normal">(optional)</span>
          </label>
          <input type="text" value={hrName} onChange={(e) => setHrName(e.target.value)}
            placeholder="e.g. Sarah Ahmed"
            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Systems Ltd"
            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>
      </div>

      {/* Job Title + Found Via */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Full Stack Developer"
            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Found Via</label>
          <select value={foundVia} onChange={(e) => setFoundVia(e.target.value)}
            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white"
          >
            {FOUND_VIA_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
          </select>
        </div>
      </div>

      {/* Your Name + Contact */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Your Full Name</label>
          <input type="text" value={yourName} onChange={(e) => setYourName(e.target.value)}
            placeholder="e.g. Ahmed Khan"
            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Contact Info</label>
          <input type="text" value={contact} onChange={(e) => setContact(e.target.value)}
            placeholder="email or phone"
            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
          Key Skills <span className="text-[#6B7280] font-normal">(optional)</span>
        </label>
        <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)}
          placeholder="e.g. React, Node.js, 3 years experience, 15+ apps built"
          className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
      </div>

      {/* Referral */}
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
          Referral Name{' '}
          <span className="text-green-600 font-normal text-xs">⚡ 3x response rate boost!</span>
        </label>
        <input type="text" value={referral} onChange={(e) => setReferral(e.target.value)}
          placeholder="e.g. Ali Hassan (leave blank if none)"
          className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
      </div>

      {/* Attachments */}
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
          Attachments to Mention
        </label>
        <div className="flex flex-wrap gap-2">
          {ATTACHMENT_OPTIONS.map((item) => {
            const isSelected =
              item === 'All'
                ? attachments.length === 3
                : attachments.includes(item)
            return (
              <button key={item} type="button" onClick={() => toggleAttachment(item)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  isSelected
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                }`}
              >
                {item}
              </button>
            )
          })}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading || !companyName.trim() || !jobTitle.trim()}
        className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? 'Generating...' : '✨ Generate Email'}
      </button>

      <OutputCard output={output} type="email" isLoading={isLoading} onRegenerate={handleSubmit} />
    </div>
  )
}