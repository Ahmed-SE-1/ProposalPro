import { callGemini } from './gemini'
import { callGroq } from './groq'

let geminiFailures = 0
const MAX_GEMINI_FAILURES = 3

export async function generateContent(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {

  // Agar Gemini 3 baar fail ho chuka → seedha Groq
  if (geminiFailures >= MAX_GEMINI_FAILURES) {
    console.log('Gemini failure limit reached — using Groq')
    try {
      const result = await callGroq(systemPrompt, userPrompt)
      return result
    } catch (groqError) {
      throw new Error(`Both AIs failed. Groq: ${groqError}`)
    }
  }

  // Gemini try karo
  try {
    const result = await callGemini(systemPrompt, userPrompt)
    geminiFailures = 0 // success → counter reset
    return result
  } catch (geminiError) {
    geminiFailures++
    console.warn(`Gemini failed (${geminiFailures}/${MAX_GEMINI_FAILURES}) — falling back to Groq`)

    // Groq fallback
    try {
      const result = await callGroq(systemPrompt, userPrompt)
      return result
    } catch (groqError) {
      throw new Error(`Both AIs failed. Gemini: ${geminiError} | Groq: ${groqError}`)
    }
  }
}