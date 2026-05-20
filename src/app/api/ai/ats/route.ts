import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { resumeId, jobDescription } = body

    if (!resumeId || !jobDescription) {
      return NextResponse.json({ error: 'resumeId and jobDescription are required' }, { status: 400 })
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

    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an ATS (Applicant Tracking System) resume analyzer. Analyze the resume against the job description and provide a detailed assessment. Return your response as a JSON object with this exact structure:
{
  "score": <number 0-100>,
  "keywords": {
    "found": ["keyword1", "keyword2"],
    "missing": ["keyword3", "keyword4"]
  },
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}

Be strict but fair. Consider keyword matching, skills alignment, experience relevance, and education match. Provide at least 5 suggestions for improvement.`
        },
        {
          role: 'user',
          content: `Analyze this resume against the job description:

RESUME:
${JSON.stringify(parsedResume, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Return only the JSON object.`
        }
      ],
    })

    const resultText = completion.choices[0]?.message?.content || '{}'

    let atsResult
    try {
      atsResult = JSON.parse(resultText)
    } catch {
      atsResult = {
        score: 50,
        keywords: { found: [], missing: [] },
        suggestions: ['Unable to parse full AI response. Please try again.']
      }
    }

    await db.resume.update({
      where: { id: resumeId },
      data: {
        atsScore: atsResult.score,
        atsFeedback: JSON.stringify(atsResult),
      }
    })

    return NextResponse.json(atsResult)
  } catch (error) {
    console.error('ATS check error:', error)
    return NextResponse.json({ error: 'ATS analysis failed' }, { status: 500 })
  }
}
