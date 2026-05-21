import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 })

    const clients = await db.client.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ clients })
  } catch (error) {
    console.error('Client fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, name, email, phone, address, company } = await request.json()
    if (!userId || !name || !email) return NextResponse.json({ error: 'userId, name, and email are required' }, { status: 400 })

    const client = await db.client.create({ data: { userId, name, email, phone: phone || '', address: address || '', company: company || '' } })
    return NextResponse.json({ client })
  } catch (error) {
    console.error('Client create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
