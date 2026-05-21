'use client'

import { useAppStore } from '@/lib/store'
import Navbar from '@/components/navbar'
import Landing from '@/components/landing'
import AuthDialog from '@/components/auth-dialog'
import Dashboard from '@/components/dashboard'
import InvoiceCreator from '@/components/invoice-creator'
import InvoiceList from '@/components/invoice-list'
import ExpenseTracker from '@/components/expense-tracker'
import ClientManager from '@/components/client-manager'
import Reports from '@/components/reports'
import AIAssistant from '@/components/ai-assistant'
import { useEffect, useState } from 'react'

export default function Home() {
  const { currentView, user, setUser, setCurrentView } = useAppStore()
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  // Auto-show auth if user navigates to protected view without login
  useEffect(() => {
    if (!user && currentView !== 'landing') {
      setAuthOpen(true)
    }
  }, [user, currentView])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, action: authMode }),
      })
      const data = await res.json()
      if (data.user) {
        setUser(data.user)
        setCurrentView('dashboard')
        setAuthOpen(false)
      } else {
        alert(data.error || 'Authentication failed')
      }
    } catch (err) {
      console.error(err)
    }
 finally {
      setAuthLoading(false)
    }
  }

  const renderView = () => {
    if (!user) return <Landing />
    switch (currentView) {
      case 'landing': return <Landing />
      case 'dashboard': return <Dashboard />
      case 'invoices': return <InvoiceList />
      case 'create-invoice': return <InvoiceCreator />
      case 'expenses': return <ExpenseTracker />
      case 'clients': return <ClientManager />
      case 'reports': return <Reports />
      case 'ai-assistant': return <AIAssistant />
      default: return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen">
      {user && <Navbar />}
      <main className="flex-1">{renderView()}</main>

      {/* Auth Modal */}
      {authOpen && !user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-2xl p-8 w-full max-w-md mx-4 border-violet-500/20 glow-purple">
            <h2 className="text-2xl font-bold mb-2 text-center">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              {authMode === 'login' ? 'Sign in to your account' : 'Start managing your finances'}
            </p>
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe" required
                    className="w-full px-4 py-2.5 rounded-xl bg-background/50 border border-violet-500/20 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com" required
                  className="w-full px-4 py-2.5 rounded-xl bg-background/50 border border-violet-500/20 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Password</label>
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full px-4 py-2.5 rounded-xl bg-background/50 border border-violet-500/20 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>
              <button
                type="submit" disabled={authLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-medium transition-all glow-purple disabled:opacity-50"
              >
                {authLoading ? 'Please wait...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-violet-400 hover:underline">
                {authMode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
