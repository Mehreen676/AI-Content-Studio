import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const resume = await db.resume.findUnique({ where: { id } })

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    return NextResponse.json({
      resume: {
        ...resume,
        personalInfo: JSON.parse(resume.personalInfo),
        experience: JSON.parse(resume.experience),
        education: JSON.parse(resume.education),
        skills: JSON.parse(resume.skills),
        projects: JSON.parse(resume.projects),
        certifications: JSON.parse(resume.certifications),
        languages: JSON.parse(resume.languages),
        atsFeedback: resume.atsFeedback ? JSON.parse(resume.atsFeedback) : null,
      }
    })
  } catch (error) {
    console.error('Get resume error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const updateData: Record<string, unknown> = {}
    const jsonFields = ['personalInfo', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'atsFeedback']

    for (const [key, value] of Object.entries(body)) {
      if (jsonFields.includes(key) && typeof value === 'object') {
        updateData[key] = JSON.stringify(value)
      } else if (key === 'atsScore') {
        updateData[key] = value
      } else if (['title', 'template', 'isPublic', 'slug'].includes(key)) {
        updateData[key] = value
      }
    }

    const resume = await db.resume.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ resume })
  } catch (error) {
    console.error('Update resume error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.resume.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete resume error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
