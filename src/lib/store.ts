'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ViewType = 'landing' | 'dashboard' | 'builder' | 'ats-checker' | 'cover-letter'

interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  plan: string
}

interface AppState {
  currentView: ViewType
  currentUser: User | null
  selectedResumeId: string | null
  isAuthDialogOpen: boolean
  authMode: 'login' | 'signup'
  isMobileMenuOpen: boolean

  setView: (view: ViewType) => void
  setUser: (user: User | null) => void
  setSelectedResumeId: (id: string | null) => void
  setAuthDialogOpen: (open: boolean) => void
  setAuthMode: (mode: 'login' | 'signup') => void
  setMobileMenuOpen: (open: boolean) => void
  logout: () => void
  openAuth: (mode: 'login' | 'signup') => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentView: 'landing',
      currentUser: null,
      selectedResumeId: null,
      isAuthDialogOpen: false,
      authMode: 'login',
      isMobileMenuOpen: false,

      setView: (view) => set({ currentView: view }),
      setUser: (user) => set({ currentUser: user }),
      setSelectedResumeId: (id) => set({ selectedResumeId: id }),
      setAuthDialogOpen: (open) => set({ isAuthDialogOpen: open }),
      setAuthMode: (mode) => set({ authMode: mode }),
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      logout: () => set({ currentUser: null, currentView: 'landing', selectedResumeId: null }),
      openAuth: (mode) => set({ authMode: mode, isAuthDialogOpen: true }),
    }),
    {
      name: 'resumeai-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        currentView: state.currentUser ? state.currentView : 'landing',
      }),
    }
  )
)
