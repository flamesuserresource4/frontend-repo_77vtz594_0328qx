import React, { useEffect, useMemo, useState } from 'react'
import { API } from '../lib/api'

export default function Loads() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    code: '', category: '', date: new Date().toISOString().slice(0,16), quantity: 0,
    side: 'centro', section: 'C1', level: 'sopra', notes: ''
  })
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('present')

  async function load() {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (search) params.set('search', search)
    const res = await fetch(`${API}/loads?${params.toString()}`)
    const json = await res.json()
    setItems(json.items)
  }

  useEffect(() => { load() }, [status])

  async function create(e) {
    e.preventDefault()
    const payload = {
      ...form,
      date: new Date(form.date).toISOString(),
      quantity: Number(form.quantity)
    }
    await fetch(`${API}/loads`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setForm({ code: '', category: '', date: new Date().toISOString().slice(0,16), quantity: 0, side: 'centro', section: 'C1', level: 'sopra', notes: '' })
    await load()
  }

  async function move(id, side, section, level) {
    await fetch(`${API}/loads/move`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ load_id: id, side, section, level }) })
    await load()
  }

  async function out(id) {
    await fetch(`${API}/loads/out`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ load_id: id }) })
    await load()
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <form onSubmit={create} className="md:col-span-1 bg-slate-800/50 border border-blue-500/20 rounded-2xl p-4 space-y-3">
        <h3 className="text-white font-semibold">Nuovo carico</h3>
        <Input label="Codice" value={form.code} onChange={e=>setForm({...form, code:e.target.value})} required />
        <Input label="Categoria" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} required />
        <div className="grid grid-cols-2 gap-3">
          <Input type="datetime-local" label="Data" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} required />
          <Input type="number" step="0.01" label="Quantità" value={form.quantity} onChange={e=>setForm({...form, quantity:e.target.value})} required />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Select label="Lato" value={form.side} onChange={e=>setForm({...form, side:e.target.value})} options={[['sinistra','Sinistra'],['centro','Centro'],['destra','Destra']]} />
          <Input label="Sezione" value={form.section} onChange={e=>setForm({...form, section:e.target.value})} />
          <Select label="Livello" value={form.level} onChange={e=>setForm({...form, level:e.target.value})} options={[['sopra','Sopra'],['sotto','Sotto']]} />
        </div>
        <Textarea label="Note" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} />
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 transition">Registra carico</button>
      </form>

      <div className="md:col-span-2 space-y-4">
        <div className="flex items-center gap-3">
          <input className="flex-1 bg-slate-800/70 border border-blue-500/20 rounded-lg px-3 py-2 text-blue-100 placeholder:text-blue-300/50" placeholder="Cerca" value={search} onChange={e=>setSearch(e.target.value)} />
          <button onClick={load} className="px-4 py-2 rounded-lg bg-slate-800/50 border border-blue-500/20 text-blue-200 hover:text-white">Filtra</button>
          <select value={status} onChange={e=>setStatus(e.target.value)} className="px-3 py-2 bg-slate-800/70 border border-blue-500/20 rounded-lg text-blue-100">
            <option value="present">Presenti</option>
            <option value="out">Usciti</option>
            <option value="">Tutti</option>
          </select>
        </div>

        <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/70 text-blue-300/80">
              <tr>
                <Th>Codice</Th>
                <Th>Categoria</Th>
                <Th>Q.tà</Th>
                <Th>Posizione</Th>
                <Th>Data</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-500/10 text-blue-100">
              {items.map(it => (
                <tr key={it.id}>
                  <Td>{it.code}</Td>
                  <Td>{it.category}</Td>
                  <Td>{it.quantity}</Td>
                  <Td>{it.section} • {it.side} • {it.level}</Td>
                  <Td>{new Date(it.date).toLocaleString()}</Td>
                  <Td>
                    <div className="flex gap-2">
                      <button onClick={()=>move(it.id, 'sinistra', it.section, it.level)} className="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600">Sin</button>
                      <button onClick={()=>move(it.id, 'centro', it.section, it.level)} className="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600">Cen</button>
                      <button onClick={()=>move(it.id, 'destra', it.section, it.level)} className="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600">Des</button>
                      <button onClick={()=>move(it.id, it.side, it.section, it.level === 'sopra' ? 'sotto' : 'sopra')} className="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600">Toggle livello</button>
                      {it.status !== 'out' && (
                        <button onClick={()=>out(it.id)} className="px-2 py-1 text-xs rounded bg-red-600 hover:bg-red-700 text-white">Uscita</button>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Input({ label, ...props }) {
  return (
    <label className="block">
      <div className="text-blue-300/80 text-sm mb-1">{label}</div>
      <input {...props} className="w-full bg-slate-900/40 border border-blue-500/20 rounded-lg px-3 py-2 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
    </label>
  )
}

function Textarea({ label, ...props }) {
  return (
    <label className="block">
      <div className="text-blue-300/80 text-sm mb-1">{label}</div>
      <textarea {...props} className="w-full bg-slate-900/40 border border-blue-500/20 rounded-lg px-3 py-2 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
    </label>
  )
}

function Select({ label, options, ...props }) {
  return (
    <label className="block">
      <div className="text-blue-300/80 text-sm mb-1">{label}</div>
      <select {...props} className="w-full bg-slate-900/40 border border-blue-500/20 rounded-lg px-3 py-2 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40">
        {options.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  )
}

function Th({ children }) { return <th className="text-left px-3 py-2">{children}</th> }
function Td({ children }) { return <td className="px-3 py-2">{children}</td> }
