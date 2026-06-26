import { NextRequest, NextResponse } from 'next/server'
import { generateContent } from '@/lib/router'
import { getProposalSystemPrompt } from '@/lib/prompts'
import { addToQueue } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      skill,
      experience,
      rate,
      jobDescription,
      pastExperience,
      tone,
      targetRange, // 👈 Frontend se targetRange receive karein ('short' ya 'long')
    } = body

    // ─── Validation ───────────────────────────────────
    if (!jobDescription || jobDescription.trim().length < 50) {
      return NextResponse.json(
        { error: 'Job description must be at least 50 characters.' },
        { status: 400 }
      )
    }

    // ─── Word Counts Setup ────────────────────────────
    // Agar targetRange specify nahi hai toh default 'short' (80-99) rakhein, ya apni marzi ka fallback lagayein
    const isShort = targetRange === 'short' || !targetRange; 
    const minWords = isShort ? 80 : 130;
    const maxWords = isShort ? 99 : 150;

    // ─── Build User Prompt ────────────────────────────
    const userPrompt = `
Generate a winning Upwork proposal based on this information:

JOB DESCRIPTION:
${jobDescription}

FREELANCER DETAILS:
- Skill/Category: ${skill || 'Not specified'}
- Experience Level: ${experience || 'Intermediate'}
- Hourly Rate / Fixed Price: ${rate || 'Not specified'}
- Past Experience / Portfolio: ${pastExperience || 'No past experience mentioned — use a personal or practice project'}
- Tone Preference: ${tone || 'Professional'}

TARGET RANGE INDICATOR: Please aim for a ${isShort ? 'short (80-99 words)' : 'long (130-150 words)'} proposal structure.

Write the proposal now. Follow all rules exactly.
`

    // ─── Generate ─────────────────────────────────────
    // 💡 FIX: Yahan minWords aur maxWords function ke andar pass kar diye hain
    const systemPromptWithLimits = getProposalSystemPrompt(minWords, maxWords)

    const proposal = await addToQueue(() =>
      generateContent(systemPromptWithLimits, userPrompt)
    )

    return NextResponse.json({ proposal })
  } catch (error) {
    console.error('Proposal API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate proposal. Please try again.' },
      { status: 500 }
    )
  }
}