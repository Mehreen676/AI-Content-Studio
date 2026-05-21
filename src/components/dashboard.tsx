'use client'

import { useEffect, useState } from 'react'
import { useAppStore, type ContentItem, type ContentType } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sparkles,
  FileText,
  Share2,
  Megaphone,
  Mail,
  ShoppingBag,
  Search,
  Star,
  MoreVertical,
  Trash2,
  Pencil,
  Plus,
  TrendingUp,
  Clock,
  Heart,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

const typeIcons: Record<ContentType, typeof FileText> = {
  blog: FileText,
  social: Share2,
  ad: Megaphone,
  email: Mail,
  product: ShoppingBag,
  seo: Search,
}

const typeColors: Record<ContentType, string> = {
  blog: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  social: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  ad: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  email: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  product: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  seo: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
}

const typeLabels: Record<ContentType, string> = {
  blog: 'Blog Post',
  social: 'Social Media',
  ad: 'Ad Copy',
  email: 'Email',
  product: 'Product Description',
  seo: 'SEO Content',
}

export default function Dashboard() {
  const { user, contents, setContents, setCurrentView, removeContent, setCurrentContent, setGeneratorType } = useAppStore()
  const [filter, setFilter] = useState<ContentType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchContents = async () => {
      if (!user) return
      try {
        const res = await fetch(`/api/content?userId=${user.id}`)
        const data = await res.json()
        if (data.contents) setContents(data.contents)
      } catch (error) {
        console.error('Failed to fetch contents:', error)
      }
    }
    fetchContents()
  }, [user, setContents])

  const filteredContents = contents.filter((c) => {
    const matchesType = filter === 'all' || c.type === filter
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.body.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const stats = [
    {
      label: 'Total Content',
      value: contents.length,
      icon: FileText,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      label: 'This Week',
      value: contents.filter((c) => {
        const d = new Date(c.createdAt)
        const now = new Date()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return d >= weekAgo
      }).length,
      icon: TrendingUp,
      color: 'text-pink-600',
      bg: 'bg-pink-50 dark:bg-pink-950/30',
    },
    {
      label: 'Favorites',
      value: contents.filter((c) => c.isFavorite).length,
      icon: Heart,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
    },
    {
      label: 'Content Types',
      value: new Set(contents.map((c) => c.type)).size,
      icon: BarChart3,
      color: 'text-violet-600',
      bg: 'bg-violet-50 dark:bg-violet-950/30',
    },
  ]

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await fetch(`/api/content/${id}`, { method: 'DELETE' })
      removeContent(id)
      toast.success('Content deleted')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (content: ContentItem) => {
    setCurrentContent(content)
    setCurrentView('editor')
  }

  const handleToggleFavorite = async (content: ContentItem) => {
    try {
      await fetch(`/api/content/${content.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !content.isFavorite }),
      })
      useAppStore.getState().updateContent(content.id, { isFavorite: !content.isFavorite })
    } catch {
      toast.error('Failed to update')
    }
  }

  const handleNewContent = (type: ContentType) => {
    setGeneratorType(type)
    setCurrentView('generator')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-muted-foreground">Here&apos;s your content overview</p>
          </div>
          <Button
            onClick={() => setCurrentView('generator')}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white gap-2"
          >
            <Plus className="h-4 w-4" /> Create Content
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Create */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Create</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {(Object.keys(typeIcons) as ContentType[]).map((type) => {
              const Icon = typeIcons[type]
              return (
                <button
                  key={type}
                  onClick={() => handleNewContent(type)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-card hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
                >
                  <div className={`p-2.5 rounded-lg ${typeColors[type]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-center">{typeLabels[type]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content List */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold">Recent Content</h2>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sm:w-64"
              />
              <div className="flex gap-1 overflow-x-auto">
                <Button
                  variant={filter === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                {(Object.keys(typeLabels) as ContentType[]).map((type) => (
                  <Button
                    key={type}
                    variant={filter === type ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter(type)}
                    className="hidden sm:inline-flex"
                  >
                    {typeLabels[type]}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {filteredContents.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="p-4 rounded-full bg-muted mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">No content yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Create your first piece of content with AI</p>
                <Button
                  onClick={() => setCurrentView('generator')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white gap-2"
                >
                  <Sparkles className="h-4 w-4" /> Create Content
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContents.map((content, i) => {
                const Icon = typeIcons[content.type as ContentType] || FileText
                return (
                  <motion.div
                    key={content.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                  >
                    <Card className="group hover:shadow-md transition-all border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-md ${typeColors[content.type as ContentType] || ''}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {typeLabels[content.type as ContentType] || content.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleToggleFavorite(content)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  content.isFavorite
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            </button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1 hover:bg-muted rounded transition-colors">
                                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(content)}>
                                  <Pencil className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(content.id)}
                                  className="text-red-600"
                                  disabled={deletingId === content.id}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <h3 className="font-semibold text-sm mb-2 line-clamp-1">{content.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {content.body.substring(0, 120)}...
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(content.updatedAt).toLocaleDateString()}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() => handleEdit(content)}
                          >
                            Open <ArrowUpRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
