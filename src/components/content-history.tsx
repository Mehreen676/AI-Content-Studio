'use client'

import { useEffect, useState } from 'react'
import { useAppStore, type ContentItem, type ContentType } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
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
  Clock,
  ArrowUpRight,
  Filter,
  SortAsc,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

type SortOption = 'newest' | 'oldest' | 'name'

export default function ContentHistory() {
  const { user, contents, setContents, removeContent, setCurrentContent, setCurrentView } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
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

  let filteredContents = contents.filter((c) => {
    const matchesType = typeFilter === 'all' || c.type === typeFilter
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.body.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  // Sort
  filteredContents = [...filteredContents].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      case 'oldest':
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      case 'name':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

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

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Content History</h1>
          <p className="text-muted-foreground">
            Browse and manage all your generated content ({contents.length} total)
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as ContentType | 'all')}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {(Object.keys(typeLabels) as ContentType[]).map((type) => (
                    <SelectItem key={type} value={type}>
                      {typeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content List */}
        {filteredContents.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-10 w-10 text-muted-foreground mb-3" />
              <h3 className="font-semibold mb-1">No content found</h3>
              <p className="text-sm text-muted-foreground">
                {contents.length === 0
                  ? 'Create your first content to see it here'
                  : 'Try adjusting your search or filters'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredContents.map((content) => {
              const Icon = typeIcons[content.type as ContentType] || FileText
              return (
                <Card key={content.id} className="border-0 shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg shrink-0 ${typeColors[content.type as ContentType] || ''}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm truncate">{content.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {typeLabels[content.type as ContentType] || content.type}
                              </Badge>
                              <Badge variant="outline" className="text-xs capitalize">
                                {content.tone}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {content.body.split(/\s+/).length} words
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleToggleFavorite(content)}
                              className="p-1.5 hover:bg-muted rounded transition-colors"
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  content.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'
                                }`}
                              />
                            </button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1.5 hover:bg-muted rounded transition-colors">
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
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {content.body.substring(0, 200)}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(content.updatedAt).toLocaleDateString()} at{' '}
                            {new Date(content.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
