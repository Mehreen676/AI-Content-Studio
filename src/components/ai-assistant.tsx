'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import ReactMarkdown from 'react-markdown'
import { Sparkles, ArrowLeft, Send, FileText, Wallet, TrendingUp, Lightbulb } from 'lucide-react'

const aiTools = [
  { id: 'invoice-desc', icon: FileText, title: 'Invoice Description', desc: 'Generate professional service descriptions', color: 'from-violet-500 to-purple-600' },
  { id: 'expense-insight', icon: Wallet, title: 'Expense Insights', desc: 'Analyze spending patterns and get recommendations', color: 'from-pink-500 to-rose-600' },
  { id: 'financial-advice', icon: TrendingUp, title: 'Financial Advice', desc: 'Get personalized financial tips and strategies', color: 'from-orange-500 to-amber-600' },
  { id: 'business-idea', icon: Lightbulb, title: 'Business Ideas', desc: 'Generate ideas to grow your freelance business', color: 'from-teal-500 to-emerald-600' },
]

export default function AIAssistant() {
  const { user, setCurrentView } = useAppStore()
  const [activeTool, setActiveTool] = useState('invoice-desc')
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!input) return
    setLoading(true)
    setResult('')
    try {
      const res = await fetch('/api/ai/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activeTool, prompt: input }),
      })
      const data = await res.json()
      if (data.content) setResult(data.content)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 lg:p-8 lg:ml-64">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('dashboard')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-violet-400" /> AI Assistant
        </h1>
      </div>

      {/* AI Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {aiTools.map((tool) => (
          <motion.div key={tool.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card
              className={`glass cursor-pointer transition-all duration-300 ${activeTool === tool.id ? 'glow-purple border-violet-500/50' : 'hover:border-violet-500/20'}`}
              onClick={() => { setActiveTool(tool.id); setInput(''); setResult('') }}
            >
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
                  <tool.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold">{tool.title}</h3>
                <p className="text-[11px] text-muted-foreground">{tool.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              {aiTools.find(t => t.id === activeTool)?.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                activeTool === 'invoice-desc' ? 'Describe the service you provided (e.g., "Web development for e-commerce store")...' :
                activeTool === 'expense-insight' ? 'Describe your expense situation or paste your expenses...' :
                activeTool === 'financial-advice' ? 'Ask any financial question (e.g., "How can I improve cash flow?")...' :
                'What kind of business ideas are you looking for?'
              }
              className="bg-background/50 min-h-[150px]"
            />
            <Button
              className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white border-0 glow-purple"
              onClick={handleGenerate}
              disabled={loading || !input}
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <><Send className="w-4 h-4 mr-2" /> Generate</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">AI Result</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </motion.div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>AI result will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
