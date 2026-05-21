'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate, getStatusInfo } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import {
  Receipt, Wallet, Users, TrendingUp, TrendingDown, DollarSign,
  FileText, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertCircle, Plus
} from 'lucide-react'

interface Invoice { id: string; number: string; status: string; total: number; issueDate: string; dueDate: string; client: { name: string } }
interface Expense { id: string; category: string; description: string; amount: number; date: string }
interface Client { id: string; name: string; email: string }

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }
const item = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }

export default function Dashboard() {
  const { user, setCurrentView } = useAppStore()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      try {
        const [invRes, expRes, cliRes] = await Promise.all([
          fetch(`/api/invoice?userId=${user.id}`),
          fetch(`/api/expense?userId=${user.id}`),
          fetch(`/api/client?userId=${user.id}`),
        ])
        const invData = await invRes.json()
        const expData = await expRes.json()
        const cliData = await cliRes.json()
        if (invData.invoices) setInvoices(invData.invoices)
        if (expData.expenses) setExpenses(expData.expenses)
        if (cliData.clients) setClients(cliData.clients)
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    fetchData()
  }, [user])

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0)
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const pendingAmount = invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.total, 0)
  const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0)

  // Monthly revenue data
  const monthlyData = [
    { month: 'Jan', revenue: 4200, expenses: 2800 },
    { month: 'Feb', revenue: 5100, expenses: 3100 },
    { month: 'Mar', revenue: 4800, expenses: 2600 },
    { month: 'Apr', revenue: 6200, expenses: 3400 },
    { month: 'May', revenue: 5800, expenses: 2900 },
    { month: 'Jun', revenue: totalRevenue || 7100, expenses: totalExpenses || 3200 },
  ]

  // Expense breakdown
  const expenseByCategory = expenses.reduce((acc: Record<string, number>, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {})
  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }))
  const PIE_COLORS = ['#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#6366f1', '#ef4444', '#22c55e', '#64748b']

  const statCards = [
    { title: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, change: '+12.5%', up: true, color: 'from-violet-500 to-purple-600', glow: 'glow-purple' },
    { title: 'Total Expenses', value: formatCurrency(totalExpenses), icon: Wallet, change: '-3.2%', up: false, color: 'from-pink-500 to-rose-600', glow: 'glow-pink' },
    { title: 'Pending', value: formatCurrency(pendingAmount), icon: Clock, change: `${invoices.filter(i => i.status === 'sent').length} invoices`, up: true, color: 'from-orange-500 to-amber-600', glow: 'glow-orange' },
    { title: 'Overdue', value: formatCurrency(overdueAmount), icon: AlertCircle, change: `${invoices.filter(i => i.status === 'overdue').length} invoices`, up: false, color: 'from-red-500 to-rose-600', glow: '' },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-4 lg:p-8 space-y-6 lg:ml-64">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-muted-foreground mt-1">Here&apos;s your financial overview</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white border-0 glow-purple" onClick={() => setCurrentView('create-invoice')}>
            <Plus className="w-4 h-4 mr-2" /> New Invoice
          </Button>
          <Button variant="outline" className="border-violet-500/30 hover:bg-violet-500/10" onClick={() => setCurrentView('expenses')}>
            <Wallet className="w-4 h-4 mr-2" /> Add Expense
          </Button>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.title} variants={item}>
            <Card className={`glass hover:${stat.glow} transition-all duration-300 hover:scale-105 cursor-pointer`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-xs font-medium flex items-center gap-1 ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-400" /> Revenue vs Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#1e1b4b', border: '1px solid #8b5cf640', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fill="url(#revenueGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expenses" stroke="#ec4899" fill="url(#expenseGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expense Breakdown */}
        <motion.div variants={item}>
          <Card className="glass h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-pink-400" /> Expense Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e1b4b', border: '1px solid #ec489940', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No expenses yet
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Invoices */}
      <motion.div variants={item}>
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-400" /> Recent Invoices
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('invoices')} className="text-violet-400 hover:text-violet-300">
              View All <ArrowUpRight className="w-3 h-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Receipt className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No invoices yet. Create your first invoice!</p>
                <Button className="mt-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white border-0" onClick={() => setCurrentView('create-invoice')}>
                  <Plus className="w-4 h-4 mr-2" /> Create Invoice
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {invoices.slice(0, 5).map((inv) => {
                  const status = getStatusInfo(inv.status)
                  return (
                    <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-violet-500/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-violet-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{inv.number}</p>
                          <p className="text-xs text-muted-foreground">{inv.client?.name || 'Unknown Client'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(inv.total)}</p>
                        <Badge variant="outline" style={{ borderColor: status.color, color: status.color }} className="text-[10px]">
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: 'New Invoice', view: 'create-invoice', color: 'from-violet-500 to-purple-600' },
          { icon: Wallet, label: 'Add Expense', view: 'expenses', color: 'from-pink-500 to-rose-600' },
          { icon: Users, label: 'Add Client', view: 'clients', color: 'from-orange-500 to-amber-600' },
          { icon: BarChart3, label: 'View Reports', view: 'reports', color: 'from-teal-500 to-emerald-600' },
        ].map((action) => (
          <motion.div key={action.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card className="glass cursor-pointer hover:glow-purple transition-all duration-300" onClick={() => setCurrentView(action.view as any)}>
              <CardContent className="p-4 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
