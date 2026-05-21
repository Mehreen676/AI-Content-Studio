import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { content, action, tone, instructions } = await request.json()

    if (!content || !action) {
      return NextResponse.json({ error: 'content and action are required' }, { status: 400 })
    }

    const zai = await ZAI.create()

    let systemPrompt = 'You are an expert content editor and copywriter. Improve the given content while maintaining its core message and purpose.'
    let userPrompt = ''

    switch (action) {
      case 'improve':
        userPrompt = `Improve the following content. Make it more engaging, clear, and impactful. ${tone ? `Adjust the tone to be more ${tone}.` : ''} ${instructions ? `Additional instructions: ${instructions}` : ''}\n\nContent:\n${content}`
        break
      case 'rewrite':
        userPrompt = `Completely rewrite the following content with fresh language and structure while keeping the same message. ${tone ? `Use a ${tone} tone.` : ''} ${instructions ? `Additional instructions: ${instructions}` : ''}\n\nContent:\n${content}`
        break
      case 'expand':
        userPrompt = `Expand the following content by adding more details, examples, and depth. ${tone ? `Maintain a ${tone} tone.` : ''} ${instructions ? `Additional instructions: ${instructions}` : ''}\n\nContent:\n${content}`
        break
      case 'shorten':
        userPrompt = `Shorten the following content while keeping the key message intact. Remove any fluff or redundancy. ${instructions ? `Additional instructions: ${instructions}` : ''}\n\nContent:\n${content}`
        break
      case 'grammar':
        userPrompt = `Fix all grammar, spelling, and punctuation errors in the following content. Also improve sentence structure where needed.\n\nContent:\n${content}`
        break
      default:
        userPrompt = `Improve the following content:\n\n${content}`
    }

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    })

    const improvedContent = completion.choices[0]?.message?.content || ''

    return NextResponse.json({ content: improvedContent })
  } catch (error) {
    console.error('AI improve error:', error)
    return NextResponse.json({ error: 'Failed to improve content' }, { status: 500 })
  }
}
