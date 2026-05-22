'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  PenTool,
  Moon,
  Sun,
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Sparkles,
  BookTemplate,
  LogOut,
  History,
} from 'lucide-react'
import { useTheme } from 'next-themes'

export default function Navbar() {
  const { user, isAuthenticated, setCurrentView, setAuthDialogOpen, logout } = useAppStore()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = isAuthenticated
    ? [
        { label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' as const },
        { label: 'Create', icon: Sparkles, view: 'generator' as const },
        { label: 'Templates', icon: BookTemplate, view: 'templates' as const },
        { label: 'History', icon: History, view: 'history' as const },
      ]
    : [
        { label: 'Features', view: 'landing' as const },
        { label: 'Pricing', view: 'landing' as const },
      ]

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setCurrentView(isAuthenticated ? 'dashboard' : 'landing')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <PenTool className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ContentAI
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentView(item.view)
                  }}
                  className="gap-2"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </Button>
              ))
            ) : (
              navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView(item.view)}
                >
                  {item.label}
                </Button>
              ))
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <div>
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCurrentView('dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentView('generator')}>
                    <Sparkles className="mr-2 h-4 w-4" /> Create Content
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentView('templates')}>
                    <BookTemplate className="mr-2 h-4 w-4" /> Templates
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setAuthDialogOpen(true)}>
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => setAuthDialogOpen(true)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                >
                  Get Started Free
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-3 space-y-1">
            {isAuthenticated ? (
              <>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      setCurrentView(item.view)
                      setMobileMenuOpen(false)
                    }}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </Button>
                ))}
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Button
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                  onClick={() => {
                    setAuthDialogOpen(true)
                    setMobileMenuOpen(false)
                  }}
                >
                  Get Started Free
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
