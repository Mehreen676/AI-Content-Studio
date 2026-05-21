import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { type, context } = await request.json()
    const zai = await ZAI.create()

    const systemPrompt = 'You are a professional invoicing assistant. Generate clear, professional service descriptions for invoices. Keep descriptions concise but detailed. Return only the description text, no extra formatting.'
    const userPrompt = `Generate a professional invoice service description for: "${context}". Include specific deliverables. Keep it under 2 sentences.`

    const completion = await zai.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
      temperature: 0.7,
      max_tokens: 500,
    })

    return NextResponse.json({ content: completion.choices[0]?.message?.content || '' })
  } catch (error) {
    console.error('AI invoice error:', error)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
