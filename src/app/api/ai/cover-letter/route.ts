import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { resumeId, companyName, jobTitle, tone } = body

    if (!resumeId || !companyName || !jobTitle) {
      return NextResponse.json({ error: 'resumeId, companyName, and jobTitle are required' }, { status: 400 })
    }

    const resume = await db.resume.findUnique({ where: { id: resumeId } })
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    const parsedResume = {
      personalInfo: JSON.parse(resume.personalInfo),
      experience: JSON.parse(resume.experience),
      education: JSON.parse(resume.education),
      skills: JSON.parse(resume.skills),
    }

    const toneMap: Record<string, string> = {
      professional: 'formal and professional',
      casual: 'warm and conversational',
      enthusiastic: 'energetic and passionate',
    }

    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a professional cover letter writer. Write a compelling cover letter that is ${toneMap[tone] || 'professional'}. The letter should be 3-4 paragraphs, highlight relevant experience from the resume, and show enthusiasm for the role. Return only the cover letter text, no headers or subject lines.`
        },
        {
          role: 'user',
          content: `Write a cover letter for:

Company: ${companyName}
Job Title: ${jobTitle}

APPLICANT'S RESUME:
${JSON.stringify(parsedResume, null, 2)}`
        }
      ],
    })

    const content = completion.choices[0]?.message?.content || ''

    const coverLetter = await db.coverLetter.create({
      data: {
        userId: resume.userId,
        resumeId,
        title: `Cover Letter - ${companyName}`,
        companyName,
        jobTitle,
        content,
        tone: tone || 'professional',
      }
    })

    return NextResponse.json({ coverLetter })
  } catch (error) {
    console.error('Cover letter error:', error)
    return NextResponse.json({ error: 'Cover letter generation failed' }, { status: 500 })
  }
}
