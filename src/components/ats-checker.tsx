'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Shield, ArrowLeft, Loader2, CheckCircle2, AlertCircle,
  Lightbulb, Target
} from 'lucide-react'
import { toast } from 'sonner'

interface Resume {
  id: string; title: string;
}

interface AtsResult {
  score: number
  keywords: { found: string[]; missing: string[] }
  suggestions: string[]
}

export default function AtsChecker() {
  const { currentUser, setView } = useAppStore()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResume, setSelectedResume] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AtsResult | null>(null)

  useEffect(() => {
    if (currentUser) {
      fetch(`/api/resume?userId=${currentUser.id}`)
        .then(res => res.json())
        .then(data => setResumes(data.resumes || []))
        .catch(() => toast.error('Failed to load resumes'))
    }
  }, [currentUser])

  const handleAnalyze = async () => {
    if (!selectedResume) {
      toast.error('Please select a resume')
      return
    }
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description')
      return
    }

    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/ai/ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: selectedResume, jobDescription: jobDescription.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'ATS analysis failed')
        return
      }

      setResult(data)
    } catch (error) {
      toast.error('ATS analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600'
    if (score >= 60) return 'text-amber-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Needs Improvement'
    return 'Low'
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500'
    if (score >= 60) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" onClick={() => setView('dashboard')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <Shield className="h-8 w-8 text-emerald-600" />
          ATS Score Checker
        </h1>
        <p className="mt-2 text-muted-foreground">
          Analyze your resume against a job description to see how well it matches ATS requirements.
        </p>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Resume</CardTitle>
          </CardHeader>
          <CardContent>
            {resumes.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">No resumes found. Create one first.</p>
                <Button
                  variant="outline"
                  className="mt-3"
                  onClick={() => setView('builder')}
                >
                  Create Resume
                </Button>
              </div>
            ) : (
              <Select value={selectedResume} onValueChange={setSelectedResume}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a resume..." />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={8}
              className="resize-y"
            />
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={handleAnalyze}
        disabled={loading || !selectedResume || !jobDescription.trim()}
        className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white mb-8"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing Resume...
          </>
        ) : (
          <>
            <Shield className="mr-2 h-4 w-4" />
            Analyze ATS Score
          </>
        )}
      </Button>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Score Card */}
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}
                </div>
                <p className="text-lg font-medium mt-2">ATS Compatibility Score</p>
                <Badge
                  variant="secondary"
                  className={`mt-2 ${
                    result.score >= 80
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                      : result.score >= 60
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}
                >
                  {getScoreLabel(result.score)}
                </Badge>
                <div className="w-full max-w-md mt-6">
                  <Progress value={result.score} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  Keywords Found
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.keywords.found.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.found.map((kw, i) => (
                      <Badge key={i} className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 border-0">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No matching keywords found</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Keywords Missing
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.keywords.missing.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.missing.map((kw, i) => (
                      <Badge key={i} variant="secondary" className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Great! No critical keywords missing</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Suggestions for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-muted-foreground">{s}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
