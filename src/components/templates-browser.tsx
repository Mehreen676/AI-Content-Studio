'use client'

import { useState } from 'react'
import { useAppStore, type ContentType } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Share2,
  Megaphone,
  Mail,
  ShoppingBag,
  Search,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react'
import { motion } from 'framer-motion'

interface Template {
  id: string
  name: string
  type: ContentType
  category: string
  description: string
  icon: string
  prompt: string
}

const templates: Template[] = [
  // Blog Templates
  {
    id: 't1',
    name: 'How-To Guide',
    type: 'blog',
    category: 'Instructional',
    description: 'Step-by-step tutorial with clear instructions and practical tips.',
    icon: 'FileText',
    prompt: 'Write a comprehensive how-to guide about [TOPIC]. Include an introduction, numbered steps with detailed explanations, tips and warnings, and a conclusion. Make it practical and actionable.',
  },
  {
    id: 't2',
    name: 'Listicle',
    type: 'blog',
    category: 'Engagement',
    description: 'Numbered list article that is easy to scan and share.',
    icon: 'FileText',
    prompt: 'Write an engaging listicle about [TOPIC]. Create a compelling list of [NUMBER] items with a brief introduction and conclusion. Each item should have a clear heading and 2-3 sentences of explanation.',
  },
  {
    id: 't3',
    name: 'Thought Leadership',
    type: 'blog',
    category: 'Authority',
    description: 'Opinion piece that establishes expertise and industry insight.',
    icon: 'FileText',
    prompt: 'Write a thought leadership article about [TOPIC]. Share unique insights, challenge common assumptions, and provide forward-thinking perspectives. Include data points and examples to support your arguments.',
  },
  // Social Media Templates
  {
    id: 't4',
    name: 'Instagram Carousel',
    type: 'social',
    category: 'Visual',
    description: 'Multi-slide Instagram post with engaging content for each slide.',
    icon: 'Share2',
    prompt: 'Create an Instagram carousel about [TOPIC]. Design 5-7 slides with: Slide 1: Hook/title, Slides 2-6: Key points with tips, Final slide: CTA. Include relevant hashtags and emoji.',
  },
  {
    id: 't5',
    name: 'Twitter Thread',
    type: 'social',
    category: 'Engagement',
    description: 'Viral Twitter/X thread that tells a story or shares insights.',
    icon: 'Share2',
    prompt: 'Write a viral Twitter/X thread about [TOPIC]. Start with a hook tweet, then 5-8 follow-up tweets with key points, and end with a CTA. Keep each tweet under 280 characters. Number the tweets.',
  },
  {
    id: 't6',
    name: 'LinkedIn Post',
    type: 'social',
    category: 'Professional',
    description: 'Professional LinkedIn post that drives engagement and thought leadership.',
    icon: 'Share2',
    prompt: 'Write a LinkedIn post about [TOPIC]. Use a storytelling format with a hook opening, personal insight, key takeaway, and a question to drive comments. Keep it professional yet conversational.',
  },
  // Ad Copy Templates
  {
    id: 't7',
    name: 'Google Search Ad',
    type: 'ad',
    category: 'Search',
    description: 'High-converting Google Ads copy with headlines and descriptions.',
    icon: 'Megaphone',
    prompt: 'Write Google Search Ads copy for [TOPIC]. Create: 3 headlines (30 chars max each), 2 descriptions (90 chars max each), and sitelink suggestions. Focus on benefits and strong CTAs.',
  },
  {
    id: 't8',
    name: 'Facebook Ad',
    type: 'ad',
    category: 'Social',
    description: 'Scroll-stopping Facebook ad with primary text, headline, and CTA.',
    icon: 'Megaphone',
    prompt: 'Write Facebook ad copy for [TOPIC]. Include: Primary text (engaging hook + benefits + CTA), Headline (attention-grabbing, 40 chars max), Description (supporting detail), and CTA button suggestion. Create 3 variations.',
  },
  // Email Templates
  {
    id: 't9',
    name: 'Welcome Email',
    type: 'email',
    category: 'Onboarding',
    description: 'Warm welcome email that sets expectations and drives first action.',
    icon: 'Mail',
    prompt: 'Write a welcome email for [TOPIC]. Include: warm greeting, what they can expect, key benefits, getting started steps, and a primary CTA. Make it personal and engaging.',
  },
  {
    id: 't10',
    name: 'Newsletter',
    type: 'email',
    category: 'Retention',
    description: 'Engaging newsletter that subscribers look forward to reading.',
    icon: 'Mail',
    prompt: 'Write an email newsletter about [TOPIC]. Include: catchy subject line, personal intro, 3-4 key insights or updates, a featured section, and a clear CTA. Make it scannable and valuable.',
  },
  {
    id: 't11',
    name: 'Cold Outreach',
    type: 'email',
    category: 'Sales',
    description: 'Cold email that gets replies and starts conversations.',
    icon: 'Mail',
    prompt: 'Write a cold outreach email for [TOPIC]. Keep it short (under 100 words), personalize the opening, clearly state the value proposition, include social proof, and end with a soft CTA. Make it feel personal, not salesy.',
  },
  // Product Templates
  {
    id: 't12',
    name: 'E-commerce Product',
    type: 'product',
    category: 'Retail',
    description: 'Product description that drives purchases on e-commerce stores.',
    icon: 'ShoppingBag',
    prompt: 'Write an e-commerce product description for [TOPIC]. Include: attention-grabbing headline, sensory-rich opening paragraph, 5 key features with benefits, specifications table, and urgency CTA.',
  },
  {
    id: 't13',
    name: 'SaaS Product',
    type: 'product',
    category: 'Technology',
    description: 'SaaS product description that converts visitors to users.',
    icon: 'ShoppingBag',
    prompt: 'Write a SaaS product description for [TOPIC]. Include: clear value proposition headline, problem statement, solution overview, key features with benefits, use cases, social proof elements, and a free trial CTA.',
  },
  // SEO Templates
  {
    id: 't14',
    name: 'SEO Blog Outline',
    type: 'seo',
    category: 'Planning',
    description: 'SEO-optimized blog outline with keywords, headings, and meta data.',
    icon: 'Search',
    prompt: 'Create an SEO blog outline for [TOPIC]. Include: target keyword, secondary keywords, SEO title tag (under 60 chars), meta description (under 160 chars), H1/H2/H3 heading structure, and content brief for each section.',
  },
  {
    id: 't15',
    name: 'Landing Page SEO',
    type: 'seo',
    category: 'Conversion',
    description: 'SEO-optimized landing page copy that ranks and converts.',
    icon: 'Search',
    prompt: 'Write SEO landing page copy for [TOPIC]. Include: H1 with target keyword, compelling subheadline, benefit-driven body copy, feature/benefit sections, social proof, FAQ section with schema, and multiple CTAs.',
  },
]

const typeIcons: Record<ContentType, typeof FileText> = {
  blog: FileText,
  social: Share2,
  ad: Megaphone,
  email: Mail,
  product: ShoppingBag,
  seo: Search,
}

const typeColors: Record<ContentType, string> = {
  blog: 'from-emerald-500 to-green-600',
  social: 'from-pink-500 to-rose-600',
  ad: 'from-amber-500 to-orange-600',
  email: 'from-sky-500 to-blue-600',
  product: 'from-violet-500 to-purple-600',
  seo: 'from-teal-500 to-cyan-600',
}

const typeLabels: Record<ContentType, string> = {
  blog: 'Blog',
  social: 'Social',
  ad: 'Ads',
  email: 'Email',
  product: 'Product',
  seo: 'SEO',
}

export default function TemplatesBrowser() {
  const { setCurrentView, setGeneratorType } = useAppStore()
  const [filter, setFilter] = useState<ContentType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTemplates = templates.filter((t) => {
    const matchesType = filter === 'all' || t.type === filter
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const handleUseTemplate = (template: Template) => {
    setGeneratorType(template.type)
    setCurrentView('generator')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold">Content Templates</h1>
          </div>
          <p className="text-muted-foreground">
            Start with a proven template and customize it with AI. Choose from {templates.length} professional templates.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sm:w-72"
          />
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            {(Object.keys(typeLabels) as ContentType[]).map((type) => {
              const Icon = typeIcons[type]
              return (
                <Button
                  key={type}
                  variant={filter === type ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter(type)}
                  className="gap-1.5"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {typeLabels[type]}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template, i) => {
            const Icon = typeIcons[template.type]
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm h-full">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${typeColors[template.type]} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-1">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{template.description}</p>
                    <Button
                      onClick={() => handleUseTemplate(template)}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white gap-2 group-hover:shadow-md transition-shadow"
                    >
                      <Sparkles className="h-4 w-4" /> Use Template
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-1">No templates found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
