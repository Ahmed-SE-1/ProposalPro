import { TEMPERATURE_CONFIG } from '@/lib/prompts'

export async function callGroq(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY not set')

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1000,
      temperature: TEMPERATURE_CONFIG.groq.temperature, // 👈 FIX: Hooked to config
      top_p: TEMPERATURE_CONFIG.groq.topP,             // 👈 FIX: Hooked to config
    }),
    cache: 'no-store' // 👈 FIX: Never cache responses
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq error: ${res.status} — ${err}`)
  }

  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content

  if (!text) throw new Error('Groq returned empty response')

  return text.trim()
}