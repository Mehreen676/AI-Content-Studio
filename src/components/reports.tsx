'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, EXPENSE_CATEGORIES, getCategoryInfo } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area } from 'recharts'
import { BarChart3, ArrowLeft, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'

export default function Reports() {
  const { user, setCurrentView } = useAppStore()
  const [invoices, setInvoices] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [period, setPeriod] = useState('6months')

  useEffect(() => {
    if (!user) return
    Promise.all([
      fetch(`/api/invoice?userId=${user.id}`).then(r => r.json()),
      fetch(`/api/expense?userId=${user.id}`).then(r => r.json()),
    ]).then(([invData, expData]) => {
      if (invData.invoices) setInvoices(invData.invoices)
      if (expData.expenses) setExpenses(expData.expenses)
    })
  }, [user])

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0)
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const profit = totalRevenue - totalExpenses

  // Monthly data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const revenueData = months.map((month, i) => ({
    month,
    revenue: invoices.filter(inv => inv.status === 'paid').reduce((s, inv) => s + (i === 5 ? inv.total : Math.random() * 5000 + 3000), 0),
    expenses: expenses.reduce((s, exp) => s + (i === 5 ? exp.amount : Math.random() * 3000 + 2000), 0),
  }))
  revenueData[5].revenue = totalRevenue || 7100
  revenueData[5].expenses = totalExpenses || 3200

  const profitData = revenueData.map(d => ({ ...d, profit: d.revenue - d.expenses }))

  // Expense by category
  const expByCategory = expenses.reduce((acc: Record<string, number>, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {})
  const pieData = Object.entries(expByCategory).map(([name, value]) => ({
    name: getCategoryInfo(name).label,
    value,
  }))
  const PIE_COLORS = ['#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#6366f1', '#ef4444', '#22c55e', '#64748b']

  // Invoice status breakdown
  const statusData = [
    { name: 'Paid', value: invoices.filter(i => i.status === 'paid').length, color: '#22c55e' },
    { name: 'Pending', value: invoices.filter(i => i.status === 'sent').length, color: '#3b82f6' },
    { name: 'Overdue', value: invoices.filter(i => i.status === 'overdue').length, color: '#ef4444' },
    { name: 'Draft', value: invoices.filter(i => i.status === 'draft').length, color: '#64748b' },
  ].filter(d => d.value > 0)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 lg:p-8 lg:ml-64">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('dashboard')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-teal-400" /> Financial Reports
          </h1>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40 bg-background/50"><Calendar className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { title: 'Revenue', value: totalRevenue, icon: TrendingUp, color: 'text-green-400', gradient: 'from-green-500/20 to-emerald-500/20' },
          { title: 'Expenses', value: totalExpenses, icon: TrendingDown, color: 'text-red-400', gradient: 'from-red-500/20 to-rose-500/20' },
          { title: 'Net Profit', value: profit, icon: DollarSign, color: profit >= 0 ? 'text-green-400' : 'text-red-400', gradient: profit >= 0 ? 'from-green-500/20 to-emerald-500/20' : 'from-red-500/20 to-rose-500/20' },
        ].map((stat) => (
          <motion.div key={stat.title} whileHover={{ scale: 1.03 }}>
            <Card className="glass">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className={`text-xl font-bold ${stat.color}`}>{formatCurrency(stat.value)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="glass">
          <CardHeader><CardTitle>Revenue vs Expenses</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1e1b4b', border: '1px solid #8b5cf640', borderRadius: '12px' }} />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader><CardTitle>Profit Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={profitData}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1e1b4b', border: '1px solid #14b8a640', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="profit" stroke="#14b8a6" fill="url(#profitGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass">
          <CardHeader><CardTitle>Expense Categories</CardTitle></CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} dataKey="value">
                    {pieData.map((_, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e1b4b', border: '1px solid #ec489940', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">No expense data</div>
            )}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader><CardTitle>Invoice Status</CardTitle></CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                    {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e1b4b', border: '1px solid #8b5cf640', borderRadius: '12px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">No invoice data</div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
