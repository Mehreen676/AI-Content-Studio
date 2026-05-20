'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText, Plus, Shield, PenTool, Trash2, Edit,
  Loader2, Clock, AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface Resume {
  id: string
  title: string
  template: string
  atsScore: number | null
  updatedAt: string
}

export default function Dashboard() {
  const { currentUser, setView, setSelectedResumeId } = useAppStore()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)

  const fetchResumes = async () => {
    if (!currentUser) return
    try {
      const res = await fetch(`/api/resume?userId=${currentUser.id}`)
      const data = await res.json()
      setResumes(data.resumes || [])
    } catch (error) {
      toast.error('Failed to load resumes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [currentUser])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return
    try {
      await fetch(`/api/resume/${id}`, { method: 'DELETE' })
      setResumes(resumes.filter((r) => r.id !== id))
      toast.success('Resume deleted')
    } catch (error) {
      toast.error('Failed to delete resume')
    }
  }

  const handleEdit = (id: string) => {
    setSelectedResumeId(id)
    setView('builder')
  }

  const handleNewResume = () => {
    setSelectedResumeId(null)
    setView('builder')
  }

  const avgAtsScore = resumes.length > 0
    ? Math.round(resumes.filter(r => r.atsScore !== null).reduce((sum, r) => sum + (r.atsScore || 0), 0) / Math.max(resumes.filter(r => r.atsScore !== null).length, 1))
    : 0

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-muted-foreground'
    if (score >= 80) return 'text-emerald-600'
    if (score >= 60) return 'text-amber-600'
    return 'text-red-600'
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome back, {currentUser?.name || 'there'}! 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your resumes, check ATS scores, and generate cover letters.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Resumes</p>
                <p className="text-3xl font-bold mt-1">{resumes.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900">
                <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg ATS Score</p>
                <p className={`text-3xl font-bold mt-1 ${getScoreColor(avgAtsScore)}`}>
                  {avgAtsScore || '—'}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900">
                <Shield className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cover Letters</p>
                <p className="text-3xl font-bold mt-1">—</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-900">
                <PenTool className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Button
          onClick={handleNewResume}
          className="h-auto py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Resume
        </Button>
        <Button
          variant="outline"
          onClick={() => setView('ats-checker')}
          className="h-auto py-4"
        >
          <Shield className="mr-2 h-5 w-5" />
          Check ATS Score
        </Button>
        <Button
          variant="outline"
          onClick={() => setView('cover-letter')}
          className="h-auto py-4"
        >
          <PenTool className="mr-2 h-5 w-5" />
          Generate Cover Letter
        </Button>
      </div>

      {/* Resumes List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Resumes</h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : resumes.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No resumes yet</h3>
              <p className="text-muted-foreground text-sm mb-4 text-center max-w-sm">
                Create your first AI-powered resume and start landing interviews.
              </p>
              <Button
                onClick={handleNewResume}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Resume
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume) => (
              <Card key={resume.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base font-semibold line-clamp-1">
                      {resume.title}
                    </CardTitle>
                    <Badge variant="secondary" className="capitalize text-xs">
                      {resume.template}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    {resume.atsScore !== null && (
                      <span className={`font-medium ${getScoreColor(resume.atsScore)}`}>
                        ATS: {resume.atsScore}%
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(resume.updatedAt)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(resume.id)}
                      className="flex-1"
                    >
                      <Edit className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(resume.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
