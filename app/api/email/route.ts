import { NextRequest, NextResponse } from 'next/server'
import { generateContent } from '@/lib/router'
import { EMAIL_SYSTEM_PROMPT } from '@/lib/prompts'
import { addToQueue } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      hrName,
      companyName,
      jobTitle,
      foundVia,
      yourName,
      contact,
      skills,
      referral,
      attachments,
    } = body

    // ─── Validation ───────────────────────────────────
    if (!companyName || companyName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Company name is required.' },
        { status: 400 }
      )
    }

    if (!jobTitle || jobTitle.trim().length === 0) {
      return NextResponse.json(
        { error: 'Job title is required.' },
        { status: 400 }
      )
    }

    // ─── Format Attachments ───────────────────────────
    const attachmentList =
      Array.isArray(attachments) && attachments.length > 0
        ? attachments.join(', ')
        : 'Resume'

    // ─── Build User Prompt ────────────────────────────
    const userPrompt = `
Generate a job application email based on this information:

JOB DETAILS:
- Job Title: ${jobTitle}
- Company Name: ${companyName}
- HR / Hiring Manager Name: ${hrName || 'Hiring Manager'}
- Found Via: ${foundVia || 'Company Website'}

APPLICANT DETAILS:
- Full Name: ${yourName || 'Not specified'}
- Contact Info: ${contact || 'Not specified'}
- Key Skills: ${skills || 'Not specified'}
- Referral Name: ${referral || 'None'}

ATTACHMENTS TO MENTION:
${attachmentList}

IMPORTANT: ${
  referral
    ? `A referral was provided (${referral}) — mention this person's name in the VERY FIRST sentence.`
    : 'No referral — open with the position and where you found it.'
}

Write the email now. Follow all rules exactly. Start with "Subject:" on the first line.
`

    // ─── Generate ─────────────────────────────────────
    const email = await addToQueue(() =>
      generateContent(EMAIL_SYSTEM_PROMPT, userPrompt)
    )

    return NextResponse.json({ email })
  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate email. Please try again.' },
      { status: 500 }
    )
  }
}