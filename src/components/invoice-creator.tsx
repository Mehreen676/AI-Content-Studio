'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, generateInvoiceNumber } from '@/lib/utils'
import { Sparkles, Plus, Trash2, FileText, ArrowLeft, Wand2, Save } from 'lucide-react'

interface LineItem { description: string; quantity: number; rate: number; amount: number }

export default function InvoiceCreator() {
  const { user, setCurrentView } = useAppStore()
  const [clients, setClients] = useState<any[]>([])
  const [clientId, setClientId] = useState('')
  const [invoiceNumber] = useState(generateInvoiceNumber())
  const [dueDate, setDueDate] = useState('')
  const [items, setItems] = useState<LineItem[]>([{ description: '', quantity: 1, rate: 0, amount: 0 }])
  const [taxRate, setTaxRate] = useState(0)
  const [notes, setNotes] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    fetch(`/api/client?userId=${user.id}`).then(r => r.json()).then(d => { if (d.clients) setClients(d.clients) })
  }, [user])

  const subtotal = items.reduce((s, i) => s + i.amount, 0)
  const taxAmount = subtotal * (taxRate / 100)
  const total = subtotal + taxAmount

  const updateItem = (index: number, field: keyof LineItem, value: any) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    if (field === 'quantity' || field === 'rate') {
      updated[index].amount = (field === 'quantity' ? value : updated[index].quantity) * (field === 'rate' ? value : updated[index].rate)
    }
    setItems(updated)
  }

  const addItem = () => setItems([...items, { description: '', quantity: 1, rate: 0, amount: 0 }])
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i))

  const aiGenerateDescription = async (index: number) => {
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'description', context: items[index].description || 'web development services' }),
      })
      const data = await res.json()
      if (data.content) updateItem(index, 'description', data.content)
    } catch (err) { console.error(err) }
    setAiLoading(false)
  }

  const handleSave = async () => {
    if (!user || !clientId) return
    setSaving(true)
    try {
      const res = await fetch('/api/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          clientId,
          number: invoiceNumber,
          dueDate: dueDate || new Date(Date.now() + 30 * 86400000).toISOString(),
          items: JSON.stringify(items),
          subtotal,
          taxRate,
          taxAmount,
          total,
          notes,
        }),
      })
      const data = await res.json()
      if (data.invoice) setCurrentView('invoices')
    } catch (err) { console.error(err) }
    setSaving(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 lg:p-8 lg:ml-64">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('invoices')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-violet-400" /> Create Invoice
          </h1>
          <p className="text-muted-foreground text-sm">{invoiceNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select value={clientId} onValueChange={setClientId}>
                    <SelectTrigger className="bg-background/50"><SelectValue placeholder="Select client" /></SelectTrigger>
                    <SelectContent>
                      {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="bg-background/50" />
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Line Items</Label>
                  <Button variant="ghost" size="sm" onClick={addItem} className="text-violet-400 hover:text-violet-300">
                    <Plus className="w-4 h-4 mr-1" /> Add Item
                  </Button>
                </div>
                {items.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-12 sm:col-span-5 space-y-1">
                      {i === 0 && <Label className="text-xs text-muted-foreground">Description</Label>}
                      <div className="flex gap-1">
                        <Input value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} placeholder="Service description" className="bg-background/50 text-sm" />
                        <Button variant="ghost" size="icon" className="shrink-0 text-violet-400 hover:text-violet-300 h-9 w-9" onClick={() => aiGenerateDescription(i)} disabled={aiLoading}>
                          <Wand2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="col-span-4 sm:col-span-2 space-y-1">
                      {i === 0 && <Label className="text-xs text-muted-foreground">Qty</Label>}
                      <Input type="number" value={item.quantity} onChange={(e) => updateItem(i, 'quantity', Number(e.target.value))} className="bg-background/50 text-sm" min={1} />
                    </div>
                    <div className="col-span-4 sm:col-span-2 space-y-1">
                      {i === 0 && <Label className="text-xs text-muted-foreground">Rate</Label>}
                      <Input type="number" value={item.rate} onChange={(e) => updateItem(i, 'rate', Number(e.target.value))} className="bg-background/50 text-sm" min={0} step={0.01} />
                    </div>
                    <div className="col-span-3 sm:col-span-2 space-y-1">
                      {i === 0 && <Label className="text-xs text-muted-foreground">Amount</Label>}
                      <p className="text-sm font-medium py-2">{formatCurrency(item.amount)}</p>
                    </div>
                    <div className="col-span-1">
                      {items.length > 1 && (
                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 h-9 w-9" onClick={() => removeItem(i)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="bg-background/50" min={0} max={100} step={0.1} />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Payment terms, thank you message..." className="bg-background/50" rows={2} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <Card className="glass glow-purple">
            <CardHeader>
              <CardTitle className="text-lg">Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax ({taxRate}%)</span><span>{formatCurrency(taxAmount)}</span></div>
                <div className="border-t border-violet-500/20 pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="gradient-text">{formatCurrency(total)}</span>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white border-0 glow-purple" onClick={handleSave} disabled={saving || !clientId}>
                <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Invoice'}
              </Button>
              <Button variant="outline" className="w-full border-violet-500/30 hover:bg-violet-500/10">
                <Sparkles className="w-4 h-4 mr-2 text-violet-400" /> AI Generate Invoice
              </Button>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span className="text-sm font-medium">AI Tips</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Click the ✨ wand icon next to any description field to let AI generate a professional service description for you!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
