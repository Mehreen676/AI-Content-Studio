import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, context, jobTitle } = body

    if (!type || !context) {
      return NextResponse.json({ error: 'type and context are required' }, { status: 400 })
    }

    const zai = await ZAI.create()

    let systemPrompt = ''
    let userPrompt = ''

    switch (type) {
      case 'summary':
        systemPrompt = 'You are a professional resume writer. Write a compelling professional summary for a resume. Keep it concise (2-3 sentences), impactful, and tailored to the job. Use action verbs and quantifiable results where possible. Return only the summary text, no labels or headers.'
        userPrompt = `Write a professional summary for someone with the following background:\n\n${context}${jobTitle ? `\n\nTarget job title: ${jobTitle}` : ''}`
        break
      case 'experience':
        systemPrompt = 'You are a professional resume writer. Write 3-5 bullet points for a work experience entry. Start each bullet with a strong action verb. Include quantifiable results where possible. Format each bullet on a new line starting with "•". Return only the bullet points.'
        userPrompt = `Write experience bullet points for the following role:\n\n${context}${jobTitle ? `\n\nJob title: ${jobTitle}` : ''}`
        break
      case 'skills':
        systemPrompt = 'You are a professional resume writer. Suggest relevant skills for the given context. Return as a JSON array of strings, e.g. ["React", "TypeScript"]. Only return the JSON array, nothing else.'
        userPrompt = `Suggest professional skills for:\n\n${context}${jobTitle ? `\n\nTarget role: ${jobTitle}` : ''}`
        break
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
    })

    const result = completion.choices[0]?.message?.content || ''

    return NextResponse.json({ result })
  } catch (error) {
    console.error('AI generate error:', error)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
