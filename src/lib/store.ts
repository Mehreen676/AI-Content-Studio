import { create } from 'zustand'

export type ViewType = 'landing' | 'dashboard' | 'invoices' | 'create-invoice' | 'expenses' | 'clients' | 'reports' | 'ai-assistant'

interface User {
  id: string
  email: string
  name: string
  company?: string
  plan: string
}

interface AppState {
  currentView: ViewType
  setCurrentView: (view: ViewType) => void
  user: User | null
  setUser: (user: User | null) => void
  selectedInvoice: string | null
  setSelectedInvoice: (id: string | null) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'landing',
  setCurrentView: (view) => set({ currentView: view }),
  user: null,
  setUser: (user) => set({ user }),
  selectedInvoice: null,
  setSelectedInvoice: (id) => set({ selectedInvoice: id }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
