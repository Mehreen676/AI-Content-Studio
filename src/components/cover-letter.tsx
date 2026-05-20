'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  PenTool, ArrowLeft, Loader2, Copy, Download
} from 'lucide-react'
import { toast } from 'sonner'

interface Resume {
  id: string; title: string;
}

export default function CoverLetterGenerator() {
  const { currentUser, setView } = useAppStore()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResume, setSelectedResume] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [tone, setTone] = useState('professional')
  const [loading, setLoading] = useState(false)
  const [generatedLetter, setGeneratedLetter] = useState('')

  useEffect(() => {
    if (currentUser) {
      fetch(`/api/resume?userId=${currentUser.id}`)
        .then(res => res.json())
        .then(data => setResumes(data.resumes || []))
        .catch(() => toast.error('Failed to load resumes'))
    }
  }, [currentUser])

  const handleGenerate = async () => {
    if (!selectedResume) {
      toast.error('Please select a resume')
      return
    }
    if (!companyName.trim()) {
      toast.error('Please enter the company name')
      return
    }
    if (!jobTitle.trim()) {
      toast.error('Please enter the job title')
      return
    }

    setLoading(true)
    setGeneratedLetter('')
    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: selectedResume,
          companyName: companyName.trim(),
          jobTitle: jobTitle.trim(),
          tone,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Cover letter generation failed')
        return
      }

      setGeneratedLetter(data.coverLetter?.content || '')
      toast.success('Cover letter generated!')
    } catch (error) {
      toast.error('Cover letter generation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" onClick={() => setView('dashboard')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <PenTool className="h-8 w-8 text-emerald-600" />
          AI Cover Letter Generator
        </h1>
        <p className="mt-2 text-muted-foreground">
          Generate a tailored cover letter using AI based on your resume and the target job.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Resume</Label>
                {resumes.length === 0 ? (
                  <div className="text-center py-3 text-muted-foreground">
                    <p className="text-sm">No resumes found.</p>
                    <Button variant="outline" className="mt-2" onClick={() => setView('builder')}>Create Resume</Button>
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
              </div>

              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Google, Microsoft"
                />
              </div>

              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual & Warm</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading || !selectedResume || !companyName.trim() || !jobTitle.trim()}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <PenTool className="mr-2 h-4 w-4" />
                    Generate Cover Letter
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output Panel */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Generated Cover Letter</CardTitle>
                {generatedLetter && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleCopy}>
                      <Copy className="mr-1 h-3.5 w-3.5" />
                      Copy
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generatedLetter ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <Textarea
                    value={generatedLetter}
                    onChange={(e) => setGeneratedLetter(e.target.value)}
                    rows={20}
                    className="resize-y text-sm leading-relaxed"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <PenTool className="h-12 w-12 mb-4 opacity-30" />
                  <p className="text-sm">Your generated cover letter will appear here</p>
                  <p className="text-xs mt-1">Select a resume, enter job details, and click Generate</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
