import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 })

    const invoices = await db.invoice.findMany({
      where: { userId },
      include: { client: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ invoices })
  } catch (error) {
    console.error('Invoice fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, clientId, number, dueDate, items, subtotal, taxRate, taxAmount, total, notes } = await request.json()
    if (!userId || !clientId || !number) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    const invoice = await db.invoice.create({
      data: { userId, clientId, number, status: 'draft', dueDate: new Date(dueDate), items, subtotal, taxRate, taxAmount, total, notes },
    })
    return NextResponse.json({ invoice })
  } catch (error) {
    console.error('Invoice create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
