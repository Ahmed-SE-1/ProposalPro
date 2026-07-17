import { NextRequest, NextResponse } from 'next/server'
import { generateContent } from '@/lib/router'
import { getCoverLetterSystemPrompt } from '@/lib/prompts'
import { addToQueue, checkRateLimit } from '@/lib/rateLimit'
import { trackQuery } from '@/lib/queryTracker'

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      jobTitle,
      companyName,
      jobDescription,
      yourName,
      experience,
      whyCompany,
      tone,
      currentDate,
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

    if (!jobDescription || jobDescription.trim().length < 50) {
      return NextResponse.json(
        { error: 'Job description must be at least 50 characters.' },
        { status: 400 }
      )
    }

    if (!yourName || yourName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Your name is required.' },
        { status: 400 }
      )
    }

    const systemPrompt = getCoverLetterSystemPrompt({
      candidateName: yourName,
      jobTitle: jobTitle,
      companyName: companyName,
    });

    const userPrompt = `
Generate a professional cover letter based on this information:

JOB DETAILS:
- Job Title: ${jobTitle || 'Not specified'}
- Company Name: ${companyName || 'Not specified'}
- Job Description: ${jobDescription}

APPLICANT DETAILS:
- Full Name: ${yourName}
- Date: ${currentDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
- Years of Experience: ${experience || 'Not specified'}
- Why This Company: ${whyCompany || 'Not specified'}
- Tone Preference: ${tone || 'Professional'}

IMPORTANT: Use the exact date "${currentDate}" at the top of the letter. Do not use a placeholder like [Date].

Write the cover letter now. Follow all rules exactly.
`

    const coverLetter = await addToQueue(() =>
      generateContent(systemPrompt, userPrompt)
    )

    // ─── Track successful query (for admin dashboard) ───
    await trackQuery()

    return NextResponse.json({ coverLetter })
  } catch (error) {
    console.error('Cover Letter API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate cover letter. Please try again.' },
      { status: 500 }
    )
  }
}