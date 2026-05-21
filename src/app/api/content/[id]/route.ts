import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const content = await db.content.findUnique({ where: { id } })
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }
    return NextResponse.json({ content })
  } catch (error) {
    console.error('Content fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()
    const content = await db.content.update({
      where: { id },
      data,
    })
    return NextResponse.json({ content })
  } catch (error) {
    console.error('Content update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.content.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Content delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
