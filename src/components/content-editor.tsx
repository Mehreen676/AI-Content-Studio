'use client'

import { useState } from 'react'
import { useAppStore, type ToneType } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  Save,
  Copy,
  Check,
  Wand2,
  Sparkles,
  Loader2,
  Type,
  Minimize2,
  Maximize2,
  SpellCheck,
  RotateCcw,
  PenLine,
  Expand,
  FileText,
} from 'lucide-react'
import { toast } from 'sonner'

const improveActions = [
  { value: 'improve', label: 'Improve', icon: Wand2, description: 'Make it more engaging and impactful' },
  { value: 'rewrite', label: 'Rewrite', icon: RotateCcw, description: 'Completely rewrite with fresh language' },
  { value: 'expand', label: 'Expand', icon: Expand, description: 'Add more details and depth' },
  { value: 'shorten', label: 'Shorten', icon: Minimize2, description: 'Condense while keeping key points' },
  { value: 'grammar', label: 'Fix Grammar', icon: SpellCheck, description: 'Fix grammar and spelling errors' },
] as const

const toneOptions: { value: ToneType; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'witty', label: 'Witty' },
  { value: 'formal', label: 'Formal' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'persuasive', label: 'Persuasive' },
]

export default function ContentEditor() {
  const { currentContent, setCurrentContent, setCurrentView, user, updateContent, addContent } = useAppStore()
  const [title, setTitle] = useState(currentContent?.title || '')
  const [body, setBody] = useState(currentContent?.body || '')
  const [tone, setTone] = useState<ToneType>(currentContent?.tone || 'professional')
  const [isImproving, setIsImproving] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [additionalInstructions, setAdditionalInstructions] = useState('')
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string>('improve')
  const [improveTone, setImproveTone] = useState<ToneType>('professional')

  const handleImprove = async () => {
    if (!body.trim()) {
      toast.error('No content to improve')
      return
    }
    setIsImproving(true)
    try {
      const res = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: body,
          action: selectedAction,
          tone: improveTone,
          instructions: additionalInstructions,
        }),
      })
      const data = await res.json()
      if (data.error) {
        toast.error(data.error)
        return
      }
      setBody(data.content)
      toast.success('Content improved!')
    } catch {
      toast.error('Failed to improve content')
    } finally {
      setIsImproving(false)
    }
  }

  const handleSave = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      if (currentContent?.id && !currentContent.id.startsWith('temp-')) {
        // Update existing
        await fetch(`/api/content/${currentContent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, body, tone }),
        })
        updateContent(currentContent.id, { title, body, tone })
        toast.success('Content updated!')
      } else {
        // Save new
        const res = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            title,
            type: currentContent?.type || 'blog',
            body,
            tone,
            metadata: currentContent?.metadata || '{}',
          }),
        })
        const data = await res.json()
        if (data.content) {
          addContent(data.content)
          setCurrentContent(data.content)
          toast.success('Content saved!')
        }
      }
    } catch {
      toast.error('Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(body)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setCurrentView('dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Content Editor</h1>
              <p className="text-muted-foreground text-sm">Edit and refine your content with AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5">
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              Copy
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white gap-1.5"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Content title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg font-semibold"
                  />
                </div>

                {currentContent && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs capitalize">
                      {currentContent.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {tone} tone
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {body.split(/\s+/).filter(Boolean).length} words
                    </Badge>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    placeholder="Your content goes here..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="min-h-[500px] font-mono text-sm leading-relaxed resize-y"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Tools Sidebar */}
          <div className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-500" /> AI Tools
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAIPanel(!showAIPanel)}
                  >
                    {showAIPanel ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </CardHeader>
              {showAIPanel && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Action</Label>
                    <div className="space-y-2">
                      {improveActions.map((action) => {
                        const Icon = action.icon
                        return (
                          <button
                            key={action.value}
                            onClick={() => setSelectedAction(action.value)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                              selectedAction === action.value
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                                : 'border-border hover:bg-muted'
                            }`}
                          >
                            <Icon className={`h-4 w-4 shrink-0 ${
                              selectedAction === action.value ? 'text-emerald-600' : 'text-muted-foreground'
                            }`} />
                            <div>
                              <p className={`text-sm font-medium ${
                                selectedAction === action.value ? 'text-emerald-700 dark:text-emerald-400' : ''
                              }`}>
                                {action.label}
                              </p>
                              <p className="text-xs text-muted-foreground">{action.description}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Adjust Tone</Label>
                    <Select value={improveTone} onValueChange={(v) => setImproveTone(v as ToneType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {toneOptions.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Instructions</Label>
                    <Textarea
                      placeholder="Any specific improvements..."
                      value={additionalInstructions}
                      onChange={(e) => setAdditionalInstructions(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleImprove}
                    disabled={isImproving || !body.trim()}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white gap-2"
                  >
                    {isImproving ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Improving...</>
                    ) : (
                      <><Wand2 className="h-4 w-4" /> Apply AI</>
                    )}
                  </Button>
                </CardContent>
              )}
            </Card>

            {/* Quick Info */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Content Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Words</span>
                    <span className="font-medium">{body.split(/\s+/).filter(Boolean).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Characters</span>
                    <span className="font-medium">{body.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paragraphs</span>
                    <span className="font-medium">{body.split(/\n\n+/).filter(Boolean).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reading Time</span>
                    <span className="font-medium">
                      {Math.max(1, Math.ceil(body.split(/\s+/).filter(Boolean).length / 200))} min
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tone Selector */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Type className="h-4 w-4" /> Tone
                </h3>
                <div className="flex flex-wrap gap-2">
                  {toneOptions.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        tone === t.value
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
