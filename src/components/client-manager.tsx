'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users, Plus, ArrowLeft, Mail, Phone, Building2, Trash2 } from 'lucide-react'

export default function ClientManager() {
  const { user, setCurrentView } = useAppStore()
  const [clients, setClients] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [company, setCompany] = useState('')

  useEffect(() => {
    if (!user) return
    fetch(`/api/client?userId=${user.id}`).then(r => r.json()).then(d => { if (d.clients) setClients(d.clients) })
  }, [user])

  const handleSubmit = async () => {
    if (!user || !name || !email) return
    try {
      const res = await fetch('/api/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, name, email, phone, address, company }),
      })
      const data = await res.json()
      if (data.client) {
        setClients([data.client, ...clients])
        setOpen(false)
        setName(''); setEmail(''); setPhone(''); setAddress(''); setCompany('')
      }
    } catch (err) { console.error(err) }
  }

  const deleteClient = async (id: string) => {
    if (!confirm('Delete this client?')) return
    await fetch(`/api/client/${id}`, { method: 'DELETE' })
    setClients(clients.filter(c => c.id !== id))
  }

  const colors = ['from-violet-500 to-purple-600', 'from-pink-500 to-rose-600', 'from-orange-500 to-amber-600', 'from-teal-500 to-emerald-600', 'from-blue-500 to-indigo-600']

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 lg:p-8 lg:ml-64">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('dashboard')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-orange-400" /> Clients
          </h1>
          <p className="text-muted-foreground text-sm">{clients.length} total clients</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white border-0 glow-orange">
              <Plus className="w-4 h-4 mr-2" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-orange-500/20">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-orange-400" /> Add Client</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="bg-background/50" /></div>
                <div className="space-y-2"><Label>Company</Label><Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc" className="bg-background/50" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@acme.com" className="bg-background/50" /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 890" className="bg-background/50" /></div>
              </div>
              <div className="space-y-2"><Label>Address</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, City" className="bg-background/50" /></div>
              <Button className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white border-0" onClick={handleSubmit}>
                <Plus className="w-4 h-4 mr-2" /> Add Client
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {clients.length === 0 ? (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
            <p className="text-muted-foreground">Add your first client to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {clients.map((client, i) => (
              <motion.div key={client.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="glass hover:glow-purple transition-all duration-300 hover:scale-105">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <Avatar className={`h-12 w-12 bg-gradient-to-br ${colors[i % colors.length]}`}>
                        <AvatarFallback className="bg-transparent text-white font-bold">{client.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300" onClick={() => deleteClient(client.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <h3 className="font-semibold text-lg">{client.name}</h3>
                    {client.company && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Building2 className="w-3.5 h-3.5" /> {client.company}
                      </p>
                    )}
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> {client.email}</p>
                      {client.phone && <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" /> {client.phone}</p>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
