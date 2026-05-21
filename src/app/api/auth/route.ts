import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, action } = await request.json()
    if (!email || !password) return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })

    if (action === 'signup') {
      const existing = await db.user.findUnique({ where: { email } })
      if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
      const user = await db.user.create({ data: { email, name: name || email.split('@')[0], plan: 'free' } })
      return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, company: user.company, plan: user.plan } })
    }

    if (action === 'login') {
      const user = await db.user.findUnique({ where: { email } })
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
      return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, company: user.company, plan: user.plan } })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
