import { create } from 'zustand'

export type ViewType = 'landing' | 'dashboard' | 'generator' | 'editor' | 'templates' | 'history'
export type ContentType = 'blog' | 'social' | 'ad' | 'email' | 'product' | 'seo'
export type ToneType = 'professional' | 'casual' | 'witty' | 'formal' | 'friendly' | 'persuasive'

export interface ContentItem {
  id: string
  title: string
  type: ContentType
  body: string
  tone: ToneType
  metadata: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface TemplateItem {
  id: string
  name: string
  type: ContentType
  category: string
  description: string
  prompt: string
  icon: string
}

interface AppState {
  // Auth
  user: { id: string; email: string; name: string; plan: string } | null
  isAuthenticated: boolean
  setUser: (user: AppState['user']) => void
  logout: () => void

  // Navigation
  currentView: ViewType
  setCurrentView: (view: ViewType) => void

  // Content
  contents: ContentItem[]
  setContents: (contents: ContentItem[]) => void
  addContent: (content: ContentItem) => void
  updateContent: (id: string, data: Partial<ContentItem>) => void
  removeContent: (id: string) => void

  // Current editing
  currentContent: ContentItem | null
  setCurrentContent: (content: ContentItem | null) => void

  // Generator state
  generatorType: ContentType
  setGeneratorType: (type: ContentType) => void
  generatorTone: ToneType
  setGeneratorTone: (tone: ToneType) => void

  // UI
  authDialogOpen: boolean
  setAuthDialogOpen: (open: boolean) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false, currentView: 'landing', contents: [], currentContent: null }),

  // Navigation
  currentView: 'landing',
  setCurrentView: (currentView) => set({ currentView }),

  // Content
  contents: [],
  setContents: (contents) => set({ contents }),
  addContent: (content) => set((state) => ({ contents: [content, ...state.contents] })),
  updateContent: (id, data) => set((state) => ({
    contents: state.contents.map((c) => (c.id === id ? { ...c, ...data } : c)),
  })),
  removeContent: (id) => set((state) => ({
    contents: state.contents.filter((c) => c.id !== id),
  })),

  // Current editing
  currentContent: null,
  setCurrentContent: (currentContent) => set({ currentContent }),

  // Generator state
  generatorType: 'blog',
  setGeneratorType: (generatorType) => set({ generatorType }),
  generatorTone: 'professional',
  setGeneratorTone: (generatorTone) => set({ generatorTone }),

  // UI
  authDialogOpen: false,
  setAuthDialogOpen: (authDialogOpen) => set({ authDialogOpen }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}))
