import { TEMPERATURE_CONFIG, isWordCountAcceptable, ProposalMode } from '@/lib/prompts'

export async function callGemini(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not set')

  // Safe fallback if systemPrompt or userPrompt is missing or undefined
  const safeSystemPrompt = systemPrompt || '';
  const safeUserPrompt = userPrompt || '';

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

  let attempts = 0
  const maxAttempts = 2 // 👈 FIX: Reduced from 4 to 2 to prevent timeouts
  let bestAttemptText = '' // 👈 Store the last attempt for graceful degradation

  // 1. Determine target mode dynamically for the new validator
  const isShortTarget = safeSystemPrompt.toLowerCase().includes('short') || safeUserPrompt.toLowerCase().includes('short')
  const mode: ProposalMode = isShortTarget ? 'short' : 'deep'

  // The v3 prompt is strictly controlled now, so we just use the generated system prompt directly
  const strictSystemPrompt = safeSystemPrompt

  while (attempts < maxAttempts) {
    attempts++

    const body = {
      system_instruction: {
        parts: [{ text: strictSystemPrompt }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: safeUserPrompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1200,
        temperature: TEMPERATURE_CONFIG.gemini.temperature, // 👈 FIX: Hooked to config
        topP: TEMPERATURE_CONFIG.gemini.topP,               // 👈 FIX: Hooked to config
      },
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store' // 👈 FIX: Never cache responses
      })

      if (!res.ok) {
        const err = await res.text()
        console.error(`Gemini API Error (Attempt ${attempts}):`, err)
        if (attempts >= maxAttempts) throw new Error(`Gemini error: ${res.status} — ${err}`)
        continue
      }

      const data = await res.json()
      const candidate = data?.candidates?.[0]
      const text = candidate?.content?.parts?.[0]?.text
      const finishReason = candidate?.finishReason

      if (!text) {
        console.warn(`[Attempt ${attempts}] Gemini returned empty response parts.`)
        if (attempts >= maxAttempts) {
          if (bestAttemptText) return bestAttemptText; // Graceful degradation
          throw new Error('Gemini returned empty response')
        }
        continue
      }

      const trimmedText = text.trim()
      bestAttemptText = trimmedText // Save this attempt in case the next one fails
      const wordCount = trimmedText.split(/\s+/).filter(Boolean).length

      console.log("=========================================")
      console.log(`🔄 ATTEMPT: ${attempts}/${maxAttempts}`)
      console.log("🛑 GEMINI FINISH REASON:", finishReason)
      console.log("🔢 GENERATED WORD COUNT:", wordCount)
      console.log(`🎯 TARGET MODE: ${mode.toUpperCase()}`)
      console.log("=========================================")

      if (finishReason === 'MAX_TOKENS') {
        if (attempts >= maxAttempts) return bestAttemptText;
        continue
      }

      // 👈 FIX: Use the new lenient validation helper instead of exact bounds
      if (!isWordCountAcceptable(trimmedText, mode)) {
        console.warn(`Word count ${wordCount} is outside tolerance for mode: ${mode}.`)
        if (attempts >= maxAttempts) {
          console.log(`Max attempts reached. Returning closest attempt (${wordCount} words) instead of failing.`)
          return bestAttemptText; // Graceful degradation instead of crashing
        }
        continue
      }

      return trimmedText

    } catch (loopError) {
      console.error(`Unexpected execution error on attempt ${attempts}:`, loopError)
      if (attempts >= maxAttempts) {
        if (bestAttemptText) return bestAttemptText;
        throw loopError
      }
    }
  }

  return bestAttemptText;
}