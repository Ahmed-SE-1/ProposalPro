import { NextRequest, NextResponse } from 'next/server'
import { generateContent } from '@/lib/router'
import { addToQueue } from '@/lib/rateLimit'
import { 
  getProposalSystemPrompt, 
  getProposalSystemPromptGroqLite, 
  detectMultipleQuestions, 
  HOOK_STYLES, 
  PROPOSAL_FEW_SHOT_EXAMPLES, 
  CLOSING_PHRASES, 
  ProposalMode, 
  ProposalCategory 
} from '@/lib/prompts'

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
      targetRange, // 'short' ya 'long' (jisko hum 'deep' mein map karenge)
      category,    // Frontend se 'web-dev' | 'engineering' | 'writing' | 'va' aayega
      clientName   // Frontend se extracted client name
    } = body

    // ─── Validation ───────────────────────────────────
    if (!jobDescription || jobDescription.trim().length < 50) {
      return NextResponse.json(
        { error: 'Job description must be at least 50 characters.' },
        { status: 400 }
      )
    }

    // ─── 1. Bimodal Length Setup ──────────────────────
    const isShort = targetRange === 'short' || !targetRange; 
    const mode: ProposalMode = isShort ? 'short' : 'deep';

    // ─── 2. Random Rotation Setup (Uniqueness Lock) ───
    const randomHookId = HOOK_STYLES[Math.floor(Math.random() * HOOK_STYLES.length)].id;
    const randomFewShot = PROPOSAL_FEW_SHOT_EXAMPLES[Math.floor(Math.random() * PROPOSAL_FEW_SHOT_EXAMPLES.length)];
    const randomClosing = CLOSING_PHRASES[Math.floor(Math.random() * CLOSING_PHRASES.length)];

    // ─── 3. Smart Question Detector ───────────────────
    const hasMultipleQuestions = detectMultipleQuestions(jobDescription);

    // ─── 4. Build Prompts ─────────────────────────────
    const promptParams = {
      mode,
      clientName,
      category: category as ProposalCategory, // Safe type casting
      hookStyleId: randomHookId,
      fewShotExample: randomFewShot,
      closingPhrase: randomClosing,
      hasMultipleQuestions
    };

    // Full Gemini v3.2 Prompt
    const systemPrompt = getProposalSystemPrompt(promptParams);
    // Trimmed Llama/Groq Prompt (for fallback)
    const fallbackGroqPrompt = getProposalSystemPromptGroqLite(promptParams);

    const userPrompt = `
Generate a winning Upwork proposal based on this information:

JOB DESCRIPTION:
${jobDescription}

FREELANCER DETAILS:
- Skill/Category: ${skill || 'Not specified'}
- Experience Level: ${experience || 'Intermediate'}
- Hourly Rate / Fixed Price: ${rate || 'Not specified'}
- Past Experience / Portfolio: ${pastExperience || 'No past experience mentioned — stay general but confident.'}
- Tone Preference: ${tone || 'Professional'}

Write the proposal now. Follow all rules exactly.
`

    // ─── 5. Generate ──────────────────────────────────
    const proposal = await addToQueue(() =>
      // 💡 Naya architecture: Dono prompts pass kar rahe hain!
      generateContent(systemPrompt, userPrompt, fallbackGroqPrompt)
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