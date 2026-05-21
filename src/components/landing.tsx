'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Scene3D from '@/components/scene-3d'
import {
  Receipt, Wallet, Users, BarChart3, Sparkles, Shield,
  Zap, TrendingUp, ArrowRight, CheckCircle2
} from 'lucide-react'

const features = [
  { icon: Receipt, title: 'Invoice Generator', desc: 'Create professional invoices in seconds with AI-powered descriptions', color: 'from-violet-500 to-purple-600' },
  { icon: Wallet, title: 'Expense Tracking', desc: 'Track expenses by category with smart AI categorization', color: 'from-pink-500 to-rose-600' },
  { icon: Users, title: 'Client Management', desc: 'Manage clients, view history, and track payment status', color: 'from-orange-500 to-amber-600' },
  { icon: BarChart3, title: 'Financial Reports', desc: 'Visual charts and insights for revenue, expenses, and profit', color: 'from-teal-500 to-emerald-600' },
  { icon: Sparkles, title: 'AI Assistant', desc: 'Generate invoice descriptions, categorize expenses, get financial insights', color: 'from-blue-500 to-indigo-600' },
  { icon: Shield, title: 'Payment Tracking', desc: 'Track paid, pending, and overdue invoices at a glance', color: 'from-red-500 to-rose-600' },
]

const stats = [
  { label: 'Invoices Created', value: '10K+' },
  { label: 'Users', value: '2.5K+' },
  { label: 'Money Tracked', value: '$5M+' },
  { label: 'Time Saved', value: '80%' },
]

export default function Landing() {
  const { setCurrentView } = useAppStore()

  return (
    <div className="min-h-screen overflow-hidden relative">
      <Scene3D />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center glow-purple">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">InvoiceFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => setCurrentView('dashboard')}>
            Login
          </Button>
          <Button className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 glow-purple text-white border-0" onClick={() => setCurrentView('dashboard')}>
            Get Started <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Badge className="mb-6 bg-violet-500/20 text-violet-300 border-violet-500/30 px-4 py-1.5 text-sm">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> AI-Powered Finance Management
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Smart Invoices &<br />
            <span className="gradient-text">Expense Tracking</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Create professional invoices, track expenses, manage clients, and get AI-powered financial insights — all in one beautiful platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white border-0 text-lg px-8 py-6 glow-purple"
              onClick={() => setCurrentView('dashboard')}
            >
              Start Free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-violet-500/30 hover:bg-violet-500/10">
              <Zap className="w-5 h-5 mr-2 text-violet-400" /> Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8 + i * 0.1 }}>
              <Card className="glass text-center py-4 hover:glow-purple transition-all duration-300">
                <CardContent className="p-0">
                  <p className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to <span className="gradient-text">Manage Finances</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful tools with AI intelligence to streamline your invoicing and expense management workflow.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass hover:scale-105 transition-all duration-300 group cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
        >
          <Card className="glass glow-purple border-violet-500/20">
            <CardContent className="p-10 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Finances?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of freelancers and small businesses using InvoiceFlow to save time and get paid faster.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {['Free forever plan', 'No credit card required', 'AI-powered features'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white border-0 text-lg px-10 py-6 glow-purple"
                onClick={() => setCurrentView('dashboard')}
              >
                <TrendingUp className="w-5 h-5 mr-2" /> Get Started Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
