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
  const maxAttempts = 4 

  // 1. Determine target ranges safely without crashing on undefined
  const isShortTarget = safeSystemPrompt.toLowerCase().includes('short') || safeUserPrompt.toLowerCase().includes('short')
  const minWords = isShortTarget ? 80 : 130
  const maxWords = isShortTarget ? 99 : 150

  // 2. CLEAN UP & OVERRIDE conflicting system prompt rules dynamically
  let sanitizedSystemPrompt = safeSystemPrompt
    .replace(/Do NOT count words, just ensure it is structured and concise\./gi, '')
    .replace(/2-3 bullet points/gi, '2-3 short sentences in plain text')

  // 3. Append constraints securely
  const strictSystemPrompt = `
${sanitizedSystemPrompt}

CRITICAL FORMATTING AND LENGTH CONTROL:
- Your output MUST be strictly between ${minWords} and ${maxWords} words long.
- DO NOT use any bullet points, asterisks (*), dashes (-), or lists. Write ONLY in plain text paragraphs.
- Keep your sentences concise, compact, and highly professional to stay inside the ${minWords}-${maxWords} word bracket.
- Terminate your response cleanly with the single smart question within the limit. Do not overflow.
`.trim()

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
        temperature: 0.5, 
      },
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
        if (attempts >= maxAttempts) throw new Error('Gemini returned empty response')
        continue
      }

      const trimmedText = text.trim()
      const wordCount = trimmedText.split(/\s+/).filter(Boolean).length // Safe and clean type filtering

      console.log("=========================================")
      console.log(`🔄 ATTEMPT: ${attempts}/${maxAttempts}`)
      console.log("🛑 GEMINI FINISH REASON:", finishReason)
      console.log("📝 TEXT LENGTH (CHARS):", trimmedText.length)
      console.log("🔢 GENERATED WORD COUNT:", wordCount)
      console.log(`🎯 TARGET RANGE: ${minWords}-${maxWords} words`)
      console.log("=========================================")

      if (finishReason === 'MAX_TOKENS') {
        continue
      }

      if (wordCount < minWords || wordCount > maxWords) {
        continue
      }

      return trimmedText

    } catch (loopError) {
      console.error(`Unexpected execution error on attempt ${attempts}:`, loopError)
      if (attempts >= maxAttempts) throw loopError
    }
  }

  throw new Error(`Failed to generate a valid proposal within the required word count constraint (${minWords}-${maxWords} words) after ${maxAttempts} attempts.`)
}