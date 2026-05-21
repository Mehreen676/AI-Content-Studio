'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDate, getStatusInfo } from '@/lib/utils'
import { FileText, Plus, Search, Filter, ArrowLeft, Trash2, Eye } from 'lucide-react'

export default function InvoiceList() {
  const { user, setCurrentView, setSelectedInvoice } = useAppStore()
  const [invoices, setInvoices] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!user) return
    fetch(`/api/invoice?userId=${user.id}`).then(r => r.json()).then(d => { if (d.invoices) setInvoices(d.invoices) })
  }, [user])

  const filtered = invoices.filter(inv => {
    if (filter !== 'all' && inv.status !== filter) return false
    if (search && !inv.number.toLowerCase().includes(search.toLowerCase()) && !inv.client?.name?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const deleteInvoice = async (id: string) => {
    if (!confirm('Delete this invoice?')) return
    await fetch(`/api/invoice/${id}`, { method: 'DELETE' })
    setInvoices(invoices.filter(i => i.id !== id))
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 lg:p-8 lg:ml-64">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('dashboard')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-violet-400" /> Invoices
          </h1>
          <p className="text-muted-foreground text-sm">{invoices.length} total invoices</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white border-0 glow-purple" onClick={() => setCurrentView('create-invoice')}>
          <Plus className="w-4 h-4 mr-2" /> New Invoice
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search invoices..." className="pl-10 bg-background/50" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40 bg-background/50"><Filter className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoice List */}
      {filtered.length === 0 ? (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
            <p className="text-muted-foreground mb-4">Create your first invoice to get started</p>
            <Button className="bg-gradient-to-r from-violet-600 to-pink-600 text-white border-0" onClick={() => setCurrentView('create-invoice')}>
              <Plus className="w-4 h-4 mr-2" /> Create Invoice
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((inv, i) => {
            const status = getStatusInfo(inv.status)
            return (
              <motion.div key={inv.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="glass hover:glow-purple transition-all duration-300 hover:scale-[1.01] cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <p className="font-semibold">{inv.number}</p>
                        <p className="text-sm text-muted-foreground">{inv.client?.name || 'Unknown'} · Due {formatDate(inv.dueDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(inv.total)}</p>
                        <Badge variant="outline" style={{ borderColor: status.color, color: status.color }} className="text-xs">{status.label}</Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-violet-400 hover:text-violet-300"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300" onClick={() => deleteInvoice(inv.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
