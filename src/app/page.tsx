'use client'

import { useAppStore } from '@/lib/store'
import Navbar from '@/components/navbar'
import AuthDialog from '@/components/auth-dialog'
import Landing from '@/components/landing'
import Dashboard from '@/components/dashboard'
import ContentGenerator from '@/components/content-generator'
import ContentEditor from '@/components/content-editor'
import TemplatesBrowser from '@/components/templates-browser'
import ContentHistory from '@/components/content-history'

export default function Home() {
  const { currentView } = useAppStore()

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <Landing />
      case 'dashboard':
        return <Dashboard />
      case 'generator':
        return <ContentGenerator />
      case 'editor':
        return <ContentEditor />
      case 'templates':
        return <TemplatesBrowser />
      case 'history':
        return <ContentHistory />
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
