import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 })

    const expenses = await db.expense.findMany({ where: { userId }, orderBy: { date: 'desc' } })
    return NextResponse.json({ expenses })
  } catch (error) {
    console.error('Expense fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, category, description, amount, date } = await request.json()
    if (!userId || !category || !description || !amount) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    const expense = await db.expense.create({
      data: { userId, category, description, amount: Number(amount), date: date ? new Date(date) : new Date() },
    })
    return NextResponse.json({ expense })
  } catch (error) {
    console.error('Expense create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
