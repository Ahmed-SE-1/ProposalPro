import { callGemini } from './gemini'
import { callGroq } from './groq'

let geminiFailures = 0
const MAX_GEMINI_FAILURES = 3

export async function generateContent(
  systemPrompt: string,
  userPrompt: string,
  fallbackSystemPrompt?: string // 👈 Optional lite prompt added for Groq
): Promise<string> {

  // Agar fallback prompt provide nahi kiya, toh default wala hi use karo (Cover Letter / Email ke liye)
  const groqPrompt = fallbackSystemPrompt || systemPrompt;

  // Agar Gemini 3 baar fail ho chuka → seedha Groq
  if (geminiFailures >= MAX_GEMINI_FAILURES) {
    console.log('Gemini failure limit reached — using Groq')
    try {
      const result = await callGroq(groqPrompt, userPrompt)
      return result
    } catch (groqError) {
      throw new Error(`Both AIs failed. Groq: ${groqError}`)
    }
  }

  // Pehli koshish: Gemini
  try {
    const result = await callGemini(systemPrompt, userPrompt)
    geminiFailures = 0 // success → counter reset
    return result
  } catch (geminiError) {
    geminiFailures++
    console.warn(`Gemini failed (${geminiFailures}/${MAX_GEMINI_FAILURES}) — falling back to Groq`)

    // Gemini fail hua, Groq par shift karo (with lite prompt)
    try {
      const result = await callGroq(groqPrompt, userPrompt)
      return result
    } catch (groqError) {
      throw new Error(`Both AIs failed. Gemini: ${geminiError} | Groq: ${groqError}`)
    }
  }
}