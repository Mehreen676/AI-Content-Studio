'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { formatCurrency, formatDate, getCategoryInfo, EXPENSE_CATEGORIES } from '@/lib/utils'
import { Wallet, Plus, ArrowLeft, Trash2, Wand2, Receipt, Tag } from 'lucide-react'

export default function ExpenseTracker() {
  const { user, setCurrentView } = useAppStore()
  const [expenses, setExpenses] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    fetch(`/api/expense?userId=${user.id}`).then(r => r.json()).then(d => { if (d.expenses) setExpenses(d.expenses) })
  }, [user])

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)

  const handleSubmit = async () => {
    if (!user || !category || !description || !amount) return
    try {
      const res = await fetch('/api/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, category, description, amount: Number(amount), date: new Date(date).toISOString() }),
      })
      const data = await res.json()
      if (data.expense) {
        setExpenses([data.expense, ...expenses])
        setOpen(false)
        setCategory(''); setDescription(''); setAmount(''); setDate(new Date().toISOString().split('T')[0])
      }
    } catch (err) { console.error(err) }
  }

  const aiCategorize = async () => {
    if (!description) return
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'categorize', description }),
      })
      const data = await res.json()
      if (data.category) setCategory(data.category)
    } catch (err) { console.error(err) }
    setAiLoading(false)
  }

  const deleteExpense = async (id: string) => {
    if (!confirm('Delete this expense?')) return
    await fetch(`/api/expense/${id}`, { method: 'DELETE' })
    setExpenses(expenses.filter(e => e.id !== id))
  }

  const expensesByCategory = EXPENSE_CATEGORIES.map(cat => ({
    ...cat,
    total: expenses.filter(e => e.category === cat.value).reduce((s, e) => s + e.amount, 0),
    count: expenses.filter(e => e.category === cat.value).length,
  })).filter(c => c.count > 0)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 lg:p-8 lg:ml-64">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('dashboard')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="w-6 h-6 text-pink-400" /> Expenses
          </h1>
          <p className="text-muted-foreground text-sm">Total: <span className="font-bold gradient-text">{formatCurrency(totalExpenses)}</span></p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white border-0 glow-pink">
              <Plus className="w-4 h-4 mr-2" /> Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-pink-500/20">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Wallet className="w-5 h-5 text-pink-400" /> Add Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Description</Label>
                <div className="flex gap-2">
                  <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What did you spend on?" className="bg-background/50" />
                  <Button variant="ghost" size="icon" className="shrink-0 text-pink-400" onClick={aiCategorize} disabled={aiLoading}>
                    <Wand2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-background/50"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount ($)</Label>
                  <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="bg-background/50" min={0} step={0.01} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-background/50" />
              </div>
              <Button className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white border-0" onClick={handleSubmit}>
                <Plus className="w-4 h-4 mr-2" /> Add Expense
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense List */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {expenses.map((exp, i) => {
              const cat = getCategoryInfo(exp.category)
              return (
                <motion.div key={exp.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.05 }}>
                  <Card className="glass hover:glow-pink transition-all duration-300">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${cat.color}20` }}>
                          <Tag className="w-5 h-5" style={{ color: cat.color }} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{exp.description}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" style={{ borderColor: cat.color, color: cat.color }} className="text-[10px]">{cat.label}</Badge>
                            <span className="text-xs text-muted-foreground">{formatDate(exp.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{formatCurrency(exp.amount)}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300" onClick={() => deleteExpense(exp.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
          {expenses.length === 0 && (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-semibold mb-2">No expenses yet</h3>
                <p className="text-muted-foreground">Start tracking your expenses</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Category Breakdown */}
        <Card className="glass h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="w-5 h-5 text-orange-400" /> By Category
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {expensesByCategory.map(cat => (
              <div key={cat.value} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span style={{ color: cat.color }}>{cat.label}</span>
                  <span className="font-medium">{formatCurrency(cat.total)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${totalExpenses > 0 ? (cat.total / totalExpenses) * 100 : 0}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ background: cat.color }}
                  />
                </div>
              </div>
            ))}
            {expensesByCategory.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Add expenses to see breakdown</p>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
