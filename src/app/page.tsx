'use client'

import { useAppStore } from '@/lib/store'
import Navbar from '@/components/navbar'
import Landing from '@/components/landing'
import AuthDialog from '@/components/auth-dialog'
import Dashboard from '@/components/dashboard'
import ResumeBuilder from '@/components/resume-builder'
import AtsChecker from '@/components/ats-checker'
import CoverLetterGenerator from '@/components/cover-letter'

export default function Home() {
  const { currentView } = useAppStore()

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'builder':
        return <ResumeBuilder />
      case 'ats-checker':
        return <AtsChecker />
      case 'cover-letter':
        return <CoverLetterGenerator />
      case 'landing':
      default:
        return <Landing />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {renderView()}
      </main>
      <AuthDialog />
    </div>
  )
}
