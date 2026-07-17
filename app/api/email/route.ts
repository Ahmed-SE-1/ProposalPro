import { NextRequest, NextResponse } from 'next/server'
import { generateContent } from '@/lib/router'
import { getEmailSystemPrompt } from '@/lib/prompts'
import { addToQueue, checkRateLimit } from '@/lib/rateLimit'
import { trackQuery } from '@/lib/queryTracker'

export const dynamic = 'force-dynamic';

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
      fingerprint
    } = body

    // ─── Rate Limit Check ──────────────────────────────
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] 
      ?? req.headers.get('x-real-ip') 
      ?? 'unknown';

    const rateCheck = await checkRateLimit(fingerprint, ip);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: 'RATE_LIMIT_EXCEEDED',
          message: "Today's free limit has been used up. Please try again tomorrow!",
          resetAt: rateCheck.resetAt,
        },
        { status: 429 }
      );
    }

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

    const systemPrompt = getEmailSystemPrompt({
      referralName: referral,
      applicantName: yourName,
      jobTitle: jobTitle,
    });

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

    const email = await addToQueue(() =>
      generateContent(systemPrompt, userPrompt)
    )

    // ─── Track successful query (for admin dashboard) ───
    await trackQuery()

    return NextResponse.json({ email })
  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate email. Please try again.' },
      { status: 500 }
    )
  }
}