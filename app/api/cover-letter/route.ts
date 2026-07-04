import { NextRequest, NextResponse } from 'next/server'
import { generateContent } from '@/lib/router'
import { getCoverLetterSystemPrompt } from '@/lib/prompts'
import { addToQueue } from '@/lib/rateLimit'

// 🎯 Ensures this route is never cached
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
    } = body

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

    // 🎯 Generate the dynamic system prompt using the new v3 function
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

    return NextResponse.json({ coverLetter })
  } catch (error) {
    console.error('Cover Letter API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate cover letter. Please try again.' },
      { status: 500 }
    )
  }
}