import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const resumes = await db.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({ resumes })
  } catch (error) {
    console.error('Get resumes error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, title, template, personalInfo, experience, education, skills, projects, certifications, languages } = body

    if (!userId || !title) {
      return NextResponse.json({ error: 'userId and title are required' }, { status: 400 })
    }

    const resume = await db.resume.create({
      data: {
        userId,
        title,
        template: template || 'professional',
        personalInfo: JSON.stringify(personalInfo || {}),
        experience: JSON.stringify(experience || []),
        education: JSON.stringify(education || []),
        skills: JSON.stringify(skills || []),
        projects: JSON.stringify(projects || []),
        certifications: JSON.stringify(certifications || []),
        languages: JSON.stringify(languages || []),
      }
    })

    return NextResponse.json({ resume })
  } catch (error) {
    console.error('Create resume error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
