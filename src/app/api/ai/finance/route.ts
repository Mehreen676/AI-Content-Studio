import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { type, prompt } = await request.json()
    const zai = await ZAI.create()

    let systemPrompt = ''
    let userPrompt = ''

    switch (type) {
      case 'invoice-desc':
        systemPrompt = 'You are a professional invoicing assistant. Generate clear, professional service descriptions for invoices.'
        userPrompt = `Generate a professional invoice description for: "${prompt}". Include deliverables and scope.`
        break
      case 'expense-insight':
        systemPrompt = 'You are a financial advisor specializing in expense management. Provide actionable insights and recommendations.'
        userPrompt = `Analyze this expense situation and provide insights: "${prompt}". Include specific recommendations for reducing costs.`
        break
      case 'financial-advice':
        systemPrompt = 'You are a professional financial advisor for freelancers and small businesses. Provide practical, actionable advice.'
        userPrompt = `Provide financial advice for: "${prompt}". Include specific strategies and action items.`
        break
      case 'business-idea':
        systemPrompt = 'You are a business strategy consultant for freelancers. Generate creative, practical business growth ideas.'
        userPrompt = `Generate business growth ideas for: "${prompt}". Include revenue streams, marketing strategies, and scaling tips.`
        break
      default:
        systemPrompt = 'You are a helpful financial assistant.'
        userPrompt = prompt
    }

    const completion = await zai.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
      temperature: 0.8,
      max_tokens: 2000,
    })

    return NextResponse.json({ content: completion.choices[0]?.message?.content || '' })
  } catch (error) {
    console.error('AI finance error:', error)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
