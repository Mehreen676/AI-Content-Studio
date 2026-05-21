import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const where: Record<string, string> = { userId }
    if (type) where.type = type

    const contents = await db.content.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ contents })
  } catch (error) {
    console.error('Content fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, title, type, body, tone, metadata, isFavorite } = await request.json()

    if (!userId || !title || !type || !body) {
      return NextResponse.json({ error: 'userId, title, type, and body are required' }, { status: 400 })
    }

    const content = await db.content.create({
      data: {
        userId,
        title,
        type,
        body,
        tone: tone || 'professional',
        metadata: metadata || '{}',
        isFavorite: isFavorite || false,
      },
    })

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Content create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
