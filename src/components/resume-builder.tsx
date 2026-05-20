'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Sparkles, Plus, Trash2, ArrowLeft, ArrowRight, Loader2,
  User, Briefcase, GraduationCap, Wrench, FolderOpen, Award
} from 'lucide-react'
import { toast } from 'sonner'
import ResumePreview from './resume-preview'

const STEPS = [
  { label: 'Personal', icon: User },
  { label: 'Experience', icon: Briefcase },
  { label: 'Education', icon: GraduationCap },
  { label: 'Skills', icon: Wrench },
  { label: 'Projects', icon: FolderOpen },
  { label: 'Preview', icon: Award },
]

interface PersonalInfo {
  name: string; email: string; phone: string; location: string;
  linkedin: string; website: string; summary: string;
}

interface Experience {
  company: string; title: string; startDate: string; endDate: string;
  current: boolean; description: string;
}

interface Education {
  institution: string; degree: string; field: string;
  startDate: string; endDate: string; gpa: string;
}

interface SkillCategory {
  category: string; items: string[];
}

interface Project {
  name: string; description: string; url: string; technologies: string;
}

interface Certification {
  name: string; issuer: string; date: string; url: string;
}

const defaultPersonal: PersonalInfo = {
  name: '', email: '', phone: '', location: '',
  linkedin: '', website: '', summary: '',
}

export default function ResumeBuilder() {
  const { currentUser, selectedResumeId, setView } = useAppStore()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [resumeId, setResumeId] = useState<string | null>(selectedResumeId)
  const [template, setTemplate] = useState('professional')
  const [title, setTitle] = useState('My Resume')

  const [personal, setPersonal] = useState<PersonalInfo>(defaultPersonal)
  const [experience, setExperience] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [skills, setSkills] = useState<SkillCategory[]>([{ category: 'Technical', items: [] }])
  const [projects, setProjects] = useState<Project[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])

  const [aiLoading, setAiLoading] = useState<string | null>(null)

  // Load existing resume
  useEffect(() => {
    if (selectedResumeId) {
      loadResume(selectedResumeId)
    }
  }, [selectedResumeId])

  const loadResume = async (id: string) => {
    try {
      const res = await fetch(`/api/resume/${id}`)
      const data = await res.json()
      if (data.resume) {
        const r = data.resume
        setTitle(r.title)
        setTemplate(r.template)
        setPersonal(r.personalInfo || defaultPersonal)
        setExperience(r.experience || [])
        setEducation(r.education || [])
        setSkills(r.skills || [{ category: 'Technical', items: [] }])
        setProjects(r.projects || [])
        setCertifications(r.certifications || [])
        setResumeId(id)
      }
    } catch (error) {
      toast.error('Failed to load resume')
    }
  }

  // AI generation
  const generateAI = async (type: string, context: string, field?: string, index?: number) => {
    setAiLoading(field || type)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, context, jobTitle: personal.name ? undefined : undefined }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'AI generation failed')
        return
      }

      if (type === 'summary') {
        setPersonal({ ...personal, summary: data.result })
      } else if (type === 'experience' && index !== undefined) {
        const updated = [...experience]
        updated[index] = { ...updated[index], description: data.result }
        setExperience(updated)
      } else if (type === 'skills') {
        try {
          const parsed = JSON.parse(data.result)
          if (Array.isArray(parsed)) {
            setSkills([{ category: 'Technical', items: parsed.map((s: string) => s) }])
          }
        } catch {
          toast.error('Failed to parse skills')
        }
      }

      toast.success('AI content generated!')
    } catch (error) {
      toast.error('AI generation failed')
    } finally {
      setAiLoading(null)
    }
  }

  // Save resume
  const saveResume = async () => {
    if (!currentUser) return
    setSaving(true)
    try {
      const body = {
        userId: currentUser.id,
        title,
        template,
        personalInfo: personal,
        experience,
        education,
        skills,
        projects,
        certifications,
        languages: [],
      }

      if (resumeId) {
        await fetch(`/api/resume/${resumeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        toast.success('Resume saved!')
      } else {
        const res = await fetch('/api/resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        const data = await res.json()
        if (data.resume) {
          setResumeId(data.resume.id)
        }
        toast.success('Resume created!')
      }
    } catch (error) {
      toast.error('Failed to save resume')
    } finally {
      setSaving(false)
    }
  }

  const resumeData = { personalInfo: personal, experience, education, skills, projects, certifications, languages: [], template }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => setView('dashboard')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold border-0 p-0 h-auto focus-visible:ring-0"
              placeholder="Resume Title"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={saveResume} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const isActive = i === step
            const isDone = i < step
            return (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                    : isDone
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-muted-foreground'
                }`}
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {i + 1}
                </div>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            )
          })}
        </div>
        <div className="mt-2 h-1 rounded-full bg-muted">
          <div
            className="h-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Step 0: Personal Info */}
          {step === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={personal.name} onChange={(e) => setPersonal({ ...personal, name: e.target.value })} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={personal.email} onChange={(e) => setPersonal({ ...personal, email: e.target.value })} placeholder="john@example.com" type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={personal.phone} onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} placeholder="+1 234 567 890" />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input value={personal.location} onChange={(e) => setPersonal({ ...personal, location: e.target.value })} placeholder="New York, NY" />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn</Label>
                    <Input value={personal.linkedin} onChange={(e) => setPersonal({ ...personal, linkedin: e.target.value })} placeholder="linkedin.com/in/johndoe" />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input value={personal.website} onChange={(e) => setPersonal({ ...personal, website: e.target.value })} placeholder="johndoe.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Professional Summary</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateAI('summary', `Name: ${personal.name}, Position: professional`)}
                      disabled={!!aiLoading}
                    >
                      {aiLoading === 'summary' ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Sparkles className="mr-1 h-3 w-3" />}
                      AI Generate
                    </Button>
                  </div>
                  <Textarea
                    value={personal.summary}
                    onChange={(e) => setPersonal({ ...personal, summary: e.target.value })}
                    placeholder="Write a compelling professional summary..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 1: Experience */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Work Experience</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => setExperience([...experience, { company: '', title: '', startDate: '', endDate: '', current: false, description: '' }])}
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {experience.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No experience entries yet. Click &quot;Add&quot; to get started.</p>
                  </div>
                )}
                {experience.map((exp, i) => (
                  <div key={i} className="relative space-y-3 p-4 rounded-lg border border-border">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 text-destructive"
                      onClick={() => setExperience(experience.filter((_, j) => j !== i))}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Job Title</Label>
                        <Input value={exp.title} onChange={(e) => {
                          const updated = [...experience]; updated[i] = { ...updated[i], title: e.target.value }; setExperience(updated)
                        }} placeholder="Software Engineer" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Company</Label>
                        <Input value={exp.company} onChange={(e) => {
                          const updated = [...experience]; updated[i] = { ...updated[i], company: e.target.value }; setExperience(updated)
                        }} placeholder="Google" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Start Date</Label>
                        <Input value={exp.startDate} onChange={(e) => {
                          const updated = [...experience]; updated[i] = { ...updated[i], startDate: e.target.value }; setExperience(updated)
                        }} placeholder="Jan 2022" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">End Date</Label>
                        <Input value={exp.endDate} onChange={(e) => {
                          const updated = [...experience]; updated[i] = { ...updated[i], endDate: e.target.value }; setExperience(updated)
                        }} placeholder="Present" disabled={exp.current} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Description</Label>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => generateAI('experience', `Job title: ${exp.title} at ${exp.company}`, 'experience', i)}
                          disabled={!!aiLoading}
                        >
                          {aiLoading === 'experience' ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Sparkles className="mr-1 h-3 w-3" />}
                          AI Generate
                        </Button>
                      </div>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => {
                          const updated = [...experience]; updated[i] = { ...updated[i], description: e.target.value }; setExperience(updated)
                        }}
                        placeholder="Describe your responsibilities and achievements..."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Education */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Education</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => setEducation([...education, { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }])}
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {education.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No education entries yet. Click &quot;Add&quot; to get started.</p>
                  </div>
                )}
                {education.map((edu, i) => (
                  <div key={i} className="relative space-y-3 p-4 rounded-lg border border-border">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 text-destructive"
                      onClick={() => setEducation(education.filter((_, j) => j !== i))}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Institution</Label>
                        <Input value={edu.institution} onChange={(e) => {
                          const updated = [...education]; updated[i] = { ...updated[i], institution: e.target.value }; setEducation(updated)
                        }} placeholder="MIT" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Degree</Label>
                        <Input value={edu.degree} onChange={(e) => {
                          const updated = [...education]; updated[i] = { ...updated[i], degree: e.target.value }; setEducation(updated)
                        }} placeholder="Bachelor of Science" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Field of Study</Label>
                        <Input value={edu.field} onChange={(e) => {
                          const updated = [...education]; updated[i] = { ...updated[i], field: e.target.value }; setEducation(updated)
                        }} placeholder="Computer Science" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">GPA</Label>
                        <Input value={edu.gpa} onChange={(e) => {
                          const updated = [...education]; updated[i] = { ...updated[i], gpa: e.target.value }; setEducation(updated)
                        }} placeholder="3.8/4.0" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Start Date</Label>
                        <Input value={edu.startDate} onChange={(e) => {
                          const updated = [...education]; updated[i] = { ...updated[i], startDate: e.target.value }; setEducation(updated)
                        }} placeholder="Sep 2018" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">End Date</Label>
                        <Input value={edu.endDate} onChange={(e) => {
                          const updated = [...education]; updated[i] = { ...updated[i], endDate: e.target.value }; setEducation(updated)
                        }} placeholder="Jun 2022" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Skills */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Skills</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateAI('skills', `${personal.name} - ${experience.map(e => e.title).join(', ')}`)}
                      disabled={!!aiLoading}
                    >
                      {aiLoading === 'skills' ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Sparkles className="mr-1 h-3 w-3" />}
                      AI Suggest
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setSkills([...skills, { category: 'New Category', items: [] }])}
                    >
                      <Plus className="mr-1 h-4 w-4" /> Category
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {skills.map((cat, i) => (
                  <div key={i} className="space-y-3 p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-2">
                      <Input
                        value={cat.category}
                        onChange={(e) => {
                          const updated = [...skills]; updated[i] = { ...updated[i], category: e.target.value }; setSkills(updated)
                        }}
                        className="font-semibold border-0 p-0 h-auto focus-visible:ring-0"
                        placeholder="Category name"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive flex-shrink-0"
                        onClick={() => setSkills(skills.filter((_, j) => j !== i))}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map((skill, j) => (
                        <Badge key={j} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                          {skill}
                          <button onClick={() => {
                            const updated = [...skills]
                            updated[i] = { ...updated[i], items: updated[i].items.filter((_, k) => k !== j) }
                            setSkills(updated)
                          }}>
                            <Trash2 className="h-3 w-3 ml-1" />
                          </button>
                        </Badge>
                      ))}
                      <Input
                        className="w-28 h-7 text-xs"
                        placeholder="Add skill..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value.trim()
                            if (val) {
                              const updated = [...skills]
                              updated[i] = { ...updated[i], items: [...updated[i].items, val] }
                              setSkills(updated)
                              ;(e.target as HTMLInputElement).value = ''
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Projects & Certifications */}
          {step === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Projects</CardTitle>
                    <Button
                      size="sm"
                      onClick={() => setProjects([...projects, { name: '', description: '', url: '', technologies: '' }])}
                    >
                      <Plus className="mr-1 h-4 w-4" /> Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projects.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No projects yet. Add your notable projects.</p>
                    </div>
                  )}
                  {projects.map((proj, i) => (
                    <div key={i} className="relative space-y-3 p-4 rounded-lg border border-border">
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-destructive"
                        onClick={() => setProjects(projects.filter((_, j) => j !== i))}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Project Name</Label>
                          <Input value={proj.name} onChange={(e) => {
                            const updated = [...projects]; updated[i] = { ...updated[i], name: e.target.value }; setProjects(updated)
                          }} placeholder="Portfolio Website" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">URL</Label>
                          <Input value={proj.url} onChange={(e) => {
                            const updated = [...projects]; updated[i] = { ...updated[i], url: e.target.value }; setProjects(updated)
                          }} placeholder="github.com/project" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Technologies</Label>
                        <Input value={proj.technologies} onChange={(e) => {
                          const updated = [...projects]; updated[i] = { ...updated[i], technologies: e.target.value }; setProjects(updated)
                        }} placeholder="React, Node.js, PostgreSQL" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Description</Label>
                        <Textarea value={proj.description} onChange={(e) => {
                          const updated = [...projects]; updated[i] = { ...updated[i], description: e.target.value }; setProjects(updated)
                        }} placeholder="Describe what you built..." rows={2} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Certifications</CardTitle>
                    <Button
                      size="sm"
                      onClick={() => setCertifications([...certifications, { name: '', issuer: '', date: '', url: '' }])}
                    >
                      <Plus className="mr-1 h-4 w-4" /> Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {certifications.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No certifications yet. Add your professional certifications.</p>
                    </div>
                  )}
                  {certifications.map((cert, i) => (
                    <div key={i} className="relative space-y-3 p-4 rounded-lg border border-border">
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-destructive"
                        onClick={() => setCertifications(certifications.filter((_, j) => j !== i))}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Certification Name</Label>
                          <Input value={cert.name} onChange={(e) => {
                            const updated = [...certifications]; updated[i] = { ...updated[i], name: e.target.value }; setCertifications(updated)
                          }} placeholder="AWS Solutions Architect" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Issuer</Label>
                          <Input value={cert.issuer} onChange={(e) => {
                            const updated = [...certifications]; updated[i] = { ...updated[i], issuer: e.target.value }; setCertifications(updated)
                          }} placeholder="Amazon" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Date</Label>
                          <Input value={cert.date} onChange={(e) => {
                            const updated = [...certifications]; updated[i] = { ...updated[i], date: e.target.value }; setCertifications(updated)
                          }} placeholder="Jan 2024" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">URL</Label>
                          <Input value={cert.url} onChange={(e) => {
                            const updated = [...certifications]; updated[i] = { ...updated[i], url: e.target.value }; setCertifications(updated)
                          }} placeholder="credential URL" />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Preview & Save */}
          {step === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Preview & Save</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select value={template} onValueChange={setTemplate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Resume Summary</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Name:</div>
                    <div>{personal.name || '—'}</div>
                    <div className="text-muted-foreground">Experience:</div>
                    <div>{experience.length} entries</div>
                    <div className="text-muted-foreground">Education:</div>
                    <div>{education.length} entries</div>
                    <div className="text-muted-foreground">Skills:</div>
                    <div>{skills.reduce((sum, s) => sum + s.items.length, 0)} skills</div>
                    <div className="text-muted-foreground">Projects:</div>
                    <div>{projects.length} entries</div>
                    <div className="text-muted-foreground">Certifications:</div>
                    <div>{certifications.length} entries</div>
                  </div>
                </div>

                <Separator />

                <Button
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                  onClick={saveResume}
                  disabled={saving}
                  size="lg"
                >
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Resume
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview Panel */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ResumePreview data={resumeData} />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Step {step + 1} of {STEPS.length}
        </span>
        <Button
          onClick={() => {
            if (step < STEPS.length - 1) setStep(step + 1)
            else saveResume()
          }}
          disabled={step === STEPS.length - 1}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
