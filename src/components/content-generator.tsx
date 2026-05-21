'use client'

import { useState } from 'react'
import { useAppStore, type ContentType, type ToneType, type ContentItem } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FileText,
  Share2,
  Megaphone,
  Mail,
  ShoppingBag,
  Search,
  Sparkles,
  Loader2,
  ArrowLeft,
  Save,
  Copy,
  Check,
  RotateCcw,
  Wand2,
} from 'lucide-react'
import { toast } from 'sonner'

const typeConfig: Record<ContentType, { icon: typeof FileText; label: string; color: string; description: string }> = {
  blog: {
    icon: FileText,
    label: 'Blog Post',
    color: 'from-emerald-500 to-green-600',
    description: 'Generate SEO-optimized blog posts with proper structure and engaging content.',
  },
  social: {
    icon: Share2,
    label: 'Social Media',
    color: 'from-pink-500 to-rose-600',
    description: 'Create viral social media posts with hashtags for any platform.',
  },
  ad: {
    icon: Megaphone,
    label: 'Ad Copy',
    color: 'from-amber-500 to-orange-600',
    description: 'Write high-converting ad copy using proven frameworks.',
  },
  email: {
    icon: Mail,
    label: 'Email',
    color: 'from-sky-500 to-blue-600',
    description: 'Craft professional emails with compelling subject lines and CTAs.',
  },
  product: {
    icon: ShoppingBag,
    label: 'Product Description',
    color: 'from-violet-500 to-purple-600',
    description: 'Create conversion-focused product descriptions that sell.',
  },
  seo: {
    icon: Search,
    label: 'SEO Content',
    color: 'from-teal-500 to-cyan-600',
    description: 'Generate search-optimized content with meta descriptions and keywords.',
  },
}

const toneOptions: { value: ToneType; label: string; emoji: string }[] = [
  { value: 'professional', label: 'Professional', emoji: '💼' },
  { value: 'casual', label: 'Casual', emoji: '😊' },
  { value: 'witty', label: 'Witty', emoji: '😄' },
  { value: 'formal', label: 'Formal', emoji: '🎩' },
  { value: 'friendly', label: 'Friendly', emoji: '🤝' },
  { value: 'persuasive', label: 'Persuasive', emoji: '🎯' },
]

const platformOptions = [
  'Instagram',
  'Twitter / X',
  'LinkedIn',
  'Facebook',
  'TikTok',
  'YouTube',
  'Pinterest',
]

export default function ContentGenerator() {
  const { user, generatorType, setGeneratorType, generatorTone, setGeneratorTone, addContent, setCurrentContent, setCurrentView } = useAppStore()
  const [selectedType, setSelectedType] = useState<ContentType>(generatorType)
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState<ToneType>(generatorTone)
  const [keywords, setKeywords] = useState('')
  const [platform, setPlatform] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [wordCount, setWordCount] = useState('')
  const [additionalInstructions, setAdditionalInstructions] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic')
      return
    }
    if (!user) {
      toast.error('Please login first')
      return
    }

    setIsGenerating(true)
    setGeneratedContent('')

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          topic,
          tone,
          keywords,
          platform,
          targetAudience,
          wordCount: wordCount ? parseInt(wordCount) : undefined,
          additionalInstructions,
        }),
      })

      const data = await res.json()
      if (data.error) {
        toast.error(data.error)
        return
      }

      setGeneratedContent(data.content)
      toast.success('Content generated successfully!')
    } catch {
      toast.error('Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!user || !generatedContent) return
    setIsSaving(true)
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: topic,
          type: selectedType,
          body: generatedContent,
          tone,
          metadata: JSON.stringify({ keywords, platform, targetAudience, wordCount }),
        }),
      })
      const data = await res.json()
      if (data.content) {
        addContent(data.content as ContentItem)
        toast.success('Content saved to your library!')
      }
    } catch {
      toast.error('Failed to save content')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEditInEditor = () => {
    setCurrentContent({
      id: 'temp-' + Date.now(),
      title: topic,
      type: selectedType,
      body: generatedContent,
      tone,
      metadata: JSON.stringify({ keywords, platform, targetAudience }),
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    setCurrentView('editor')
  }

  const handleReset = () => {
    setGeneratedContent('')
    setTopic('')
    setKeywords('')
    setPlatform('')
    setTargetAudience('')
    setWordCount('')
    setAdditionalInstructions('')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => setCurrentView('dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Content</h1>
            <p className="text-muted-foreground text-sm">Generate professional content with AI</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Generator Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content Type Selection */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Content Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(typeConfig) as ContentType[]).map((type) => {
                    const config = typeConfig[type]
                    const Icon = config.icon
                    const isSelected = selectedType === type
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          setSelectedType(type)
                          setGeneratorType(type)
                        }}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 shadow-sm'
                            : 'border-transparent bg-muted/50 hover:bg-muted'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            isSelected
                              ? `bg-gradient-to-br ${config.color} text-white`
                              : 'bg-background text-muted-foreground'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground'
                          }`}
                        >
                          {config.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Topic & Details */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Topic / Subject *</Label>
                  <Input
                    placeholder="e.g., Benefits of remote work for startups"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tone</Label>
                  <div className="flex flex-wrap gap-2">
                    {toneOptions.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => {
                          setTone(t.value)
                          setGeneratorTone(t.value)
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          tone === t.value
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        <span>{t.emoji}</span>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Keywords (comma separated)</Label>
                  <Input
                    placeholder="e.g., productivity, remote teams, collaboration"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                </div>

                {selectedType === 'social' && (
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platformOptions.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Input
                    placeholder="e.g., startup founders, marketing professionals"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Word Count (approximate)</Label>
                  <Select value={wordCount} onValueChange={setWordCount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select word count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300">Short (~300 words)</SelectItem>
                      <SelectItem value="600">Medium (~600 words)</SelectItem>
                      <SelectItem value="1000">Long (~1000 words)</SelectItem>
                      <SelectItem value="1500">Comprehensive (~1500 words)</SelectItem>
                      <SelectItem value="2000">In-depth (~2000 words)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Additional Instructions</Label>
                  <Textarea
                    placeholder="Any specific requirements, style preferences, or points to cover..."
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="flex gap-3">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white h-12 text-base gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" /> Generate Content
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
            </div>
          </div>

          {/* Right: Generated Content Preview */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-sm h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">Generated Content</CardTitle>
                    {generatedContent && (
                      <Badge variant="secondary" className="text-xs">
                        {generatedContent.split(/\s+/).length} words
                      </Badge>
                    )}
                  </div>
                  {generatedContent && (
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5">
                        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleEditInEditor} className="gap-1.5">
                        <Wand2 className="h-4 w-4" /> Edit
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
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-full border-4 border-emerald-200 dark:border-emerald-800" />
                      <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                    </div>
                    <p className="mt-4 text-muted-foreground">Generating your content...</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This may take a few seconds
                    </p>
                  </div>
                ) : generatedContent ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {generatedContent}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="p-4 rounded-full bg-muted mb-4">
                      <Sparkles className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-1">Ready to Create</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Select a content type, enter your topic, and click Generate to create
                      professional content with AI.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
