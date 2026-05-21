import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

const CATEGORIES = ['office', 'travel', 'food', 'software', 'marketing', 'utilities', 'salary', 'other']

export async function POST(request: NextRequest) {
  try {
    const { type, description } = await request.json()
    const zai = await ZAI.create()

    const systemPrompt = `You are an expense categorization assistant. Given an expense description, return ONLY the category name from this list: ${CATEGORIES.join(', ')}. Return just the category word, nothing else.`
    const userPrompt = `Categorize this expense: "${description}"`

    const completion = await zai.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
      temperature: 0.3,
      max_tokens: 20,
    })

    let category = completion.choices[0]?.message?.content?.trim().toLowerCase() || 'other'
    // Validate category
    if (!CATEGORIES.includes(category)) category = 'other'

    return NextResponse.json({ category })
  } catch (error) {
    console.error('AI expense error:', error)
    return NextResponse.json({ category: 'other' })
  }
}
