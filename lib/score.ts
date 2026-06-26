export function scoreProposal(
  text: string,
  type: 'proposal' | 'cover-letter' | 'email'
): number {
  const lower = text.toLowerCase()
  const wordCount = text.trim().split(/\s+/).length

  let score = 60

  // ─── UNIVERSAL SIGNALS ───────────────────────────────
  // Contains a question
  if (text.includes('?')) score += 8

  // Doesn't start with "I" or "I'"
  const firstWord = text.trim().split(/\s+/)[0].toLowerCase()
  if (firstWord !== 'i' && !firstWord.startsWith("i'")) score += 7

  // ─── PROPOSAL SIGNALS ────────────────────────────────
  if (type === 'proposal') {
    // Word count sweet spot
    if (wordCount >= 80 && wordCount <= 150) score += 10

    // Research-backed phrase
    if (lower.includes('happy to') || lower.includes('feel free')) score += 8

    // Shows relevant experience
    if (lower.includes('similar project') || lower.includes('similar work')) score += 7

    // Hard penalties
    if (lower.includes('calendly') || lower.includes('discovery call')) score -= 15
    if (lower.includes('best regards')) score -= 5
    if (lower.includes('hardworking') || lower.includes('team player')) score -= 10
    if (
      lower.includes('excited to apply') ||
      lower.includes('i am confident') ||
      lower.includes("i'm confident")
    ) score -= 12
  }

  // ─── COVER LETTER SIGNALS ────────────────────────────
  if (type === 'cover-letter') {
    // Word count sweet spot
    if (wordCount >= 200 && wordCount <= 350) score += 10

    // Contains real numbers/metrics
    if (/\d+%|\d+ years|\d+ projects|\d+ clients|\d+x/i.test(text)) score += 12

    // Hard penalties
    if (lower.includes('hardworking') || lower.includes('team player')) score -= 8
  }

  // ─── EMAIL SIGNALS ───────────────────────────────────
  if (type === 'email') {
    // Word count sweet spot
    if (wordCount >= 100 && wordCount <= 200) score += 10

    // Mentions attachments
    if (lower.includes('attached') || lower.includes('attachment')) score += 5

    // Has subject line
    if (lower.includes('subject:')) score += 5
  }

  // ─── CLAMP TO 0–100 ──────────────────────────────────
  return Math.min(Math.max(score, 0), 100)
}

// ─────────────────────────────────────────────────────────
// Score → Tailwind color class
// ─────────────────────────────────────────────────────────
export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600'
  if (score >= 75) return 'text-yellow-600'
  if (score >= 60) return 'text-orange-600'
  return 'text-red-600'
}

// ─────────────────────────────────────────────────────────
// Score → Background color (for badge)
// ─────────────────────────────────────────────────────────
export function getScoreBgColor(score: number): string {
  if (score >= 90) return 'bg-green-50 border-green-200'
  if (score >= 75) return 'bg-yellow-50 border-yellow-200'
  if (score >= 60) return 'bg-orange-50 border-orange-200'
  return 'bg-red-50 border-red-200'
}

// ─────────────────────────────────────────────────────────
// Score → Label
// ─────────────────────────────────────────────────────────
export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 75) return 'Good'
  if (score >= 60) return 'Average'
  return 'Needs Work'
}

// ─────────────────────────────────────────────────────────
// Improvement Tips — based on what's missing
// ─────────────────────────────────────────────────────────
export function getImprovementTips(
  text: string,
  type: 'proposal' | 'cover-letter' | 'email'
): string[] {
  const lower = text.toLowerCase()
  const wordCount = text.trim().split(/\s+/).length
  const firstWord = text.trim().split(/\s+/)[0].toLowerCase()
  const tips: string[] = []

  // Universal tips
  if (!text.includes('?')) {
    tips.push('End with a smart question — it shows interest and boosts reply rate significantly.')
  }

  if (firstWord === 'i' || firstWord.startsWith("i'")) {
    tips.push('Don\'t start with "I" — open with the client\'s problem or a strong hook instead.')
  }

  // Proposal tips
  if (type === 'proposal') {
    if (wordCount < 80) {
      tips.push(`Too short (${wordCount} words) — aim for 80–150 words for best results.`)
    } else if (wordCount > 150) {
      tips.push(`Too long (${wordCount} words) — trim to under 150 words. Clients skim, not read.`)
    }

    if (!lower.includes('happy to') && !lower.includes('feel free')) {
      tips.push('Add "happy to answer any questions you may have" — research shows +5.89pp reply rate boost.')
    }

    if (lower.includes('calendly') || lower.includes('discovery call')) {
      tips.push('Remove "Calendly" or "discovery call" — these phrases kill reply rates drastically.')
    }

    if (lower.includes('hardworking') || lower.includes('team player') || lower.includes('i am confident')) {
      tips.push('Remove AI clichés like "hardworking", "team player", or "I am confident" — they signal generic proposals.')
    }

    if (!lower.includes('similar project') && !lower.includes('similar work')) {
      tips.push('Mention a similar project or relevant past work to build instant credibility.')
    }
  }

  // Cover letter tips
  if (type === 'cover-letter') {
    if (wordCount < 200) {
      tips.push(`Too short (${wordCount} words) — cover letters need 200–350 words to be taken seriously.`)
    } else if (wordCount > 350) {
      tips.push(`Too long (${wordCount} words) — cut down to 350 words max. Hiring managers skim.`)
    }

    if (!/\d+%|\d+ years|\d+ projects|\d+ clients|\d+x/i.test(text)) {
      tips.push('Add at least one specific number or metric (e.g. "increased sales by 40%") — it makes your achievement real.')
    }

    if (lower.includes('hardworking') || lower.includes('team player')) {
      tips.push('Remove buzzwords like "hardworking" or "team player" — they are ATS red flags and HR eye-rolls.')
    }
  }

  // Email tips
  if (type === 'email') {
    if (wordCount > 200) {
      tips.push(`Too long (${wordCount} words) — job emails must be under 200 words. Cut ruthlessly.`)
    }

    if (!lower.includes('attached') && !lower.includes('attachment')) {
      tips.push('Explicitly list your attachments at the end — e.g. "Attached: Resume, Portfolio".')
    }

    if (!lower.includes('subject:')) {
      tips.push('Make sure your email has a clear subject line: "Application for [Role] — [Your Name]".')
    }
  }

  // Return max 3 tips
  return tips.slice(0, 3)
}