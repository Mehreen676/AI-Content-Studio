'use client'

import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import {
  FileText,
  LayoutDashboard,
  Shield,
  PenTool,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  User
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { view: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { view: 'builder' as const, label: 'Builder', icon: FileText },
  { view: 'ats-checker' as const, label: 'ATS Check', icon: Shield },
  { view: 'cover-letter' as const, label: 'Cover Letter', icon: PenTool },
]

export default function Navbar() {
  const {
    currentUser, currentView, isMobileMenuOpen,
    setView, openAuth, logout, setMobileMenuOpen
  } = useAppStore()
  const { theme, setTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setView(currentUser ? 'dashboard' : 'landing')}
            className="flex items-center gap-2 text-xl font-bold"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm font-bold">
              R
            </div>
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ResumeAI
            </span>
          </button>

          {/* Desktop Nav */}
          {currentUser && (
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = currentView === item.view
                return (
                  <button
                    key={item.view}
                    onClick={() => setView(item.view)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-xs">
                        {currentUser.name?.[0]?.toUpperCase() || currentUser.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{currentUser.name || currentUser.email.split('@')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" onClick={() => openAuth('login')}>
                  Login
                </Button>
                <Button
                  onClick={() => openAuth('signup')}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                >
                  Sign Up Free
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border md:hidden overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {currentUser ? (
                <>
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = currentView === item.view
                    return (
                      <button
                        key={item.view}
                        onClick={() => { setView(item.view); setMobileMenuOpen(false) }}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                            : 'text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false) }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-2 pt-2">
                  <Button variant="outline" className="w-full" onClick={() => { openAuth('login'); setMobileMenuOpen(false) }}>
                    Login
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                    onClick={() => { openAuth('signup'); setMobileMenuOpen(false) }}
                  >
                    Sign Up Free
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
