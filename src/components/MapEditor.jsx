import React, { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

export default function MapEditor() {
  const [map, setMap] = useState(null)
  const [form, setForm] = useState({ name: 'Default Map', sections: [], active: true })

  async function load() {
    try {
      const res = await fetch(`${API}/map`)
      const json = await res.json()
      setMap(json)
      setForm({ name: json.name, sections: json.sections || [], active: true })
    } catch(e) {
      console.error(e)
    }
  }

  useEffect(() => { load() }, [])

  function addSection() {
    setForm(f => ({...f, sections: [...f.sections, { side: 'centro', section: 'C1', levels: [{level:'sopra'},{level:'sotto'}] }]}))
  }

  function updateSection(i, patch) {
    const next = [...form.sections]
    next[i] = { ...next[i], ...patch }
    setForm({ ...form, sections: next })
  }

  function addLevel(i) {
    const next = [...form.sections]
    next[i].levels = [...(next[i].levels||[]), { level: 'sopra' }]
    setForm({ ...form, sections: next })
  }

  function removeSection(i) {
    const next = [...form.sections]
    next.splice(i, 1)
    setForm({ ...form, sections: next })
  }

  async function save() {
    await fetch(`${API}/map`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    await load()
  }

  if (!form) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="bg-slate-900/40 border border-blue-500/20 rounded-lg px-3 py-2 text-blue-100" />
        <button onClick={addSection} className="px-3 py-2 rounded-lg bg-slate-800/60 border border-blue-500/20 text-blue-200 hover:text-white">Aggiungi sezione</button>
        <button onClick={save} className="px-3 py-2 rounded-lg bg-blue-600 text-white">Salva mappa</button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {form.sections.map((s, i) => (
          <div key={i} className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <select value={s.side} onChange={e=>updateSection(i,{side:e.target.value})} className="px-3 py-2 bg-slate-900/40 border border-blue-500/20 rounded-lg text-blue-100">
                <option value="sinistra">Sinistra</option>
                <option value="centro">Centro</option>
                <option value="destra">Destra</option>
              </select>
              <input value={s.section} onChange={e=>updateSection(i,{section:e.target.value})} className="flex-1 bg-slate-900/40 border border-blue-500/20 rounded-lg px-3 py-2 text-blue-100" />
              <button onClick={()=>removeSection(i)} className="px-2 py-1 rounded bg-red-600 text-white">Rimuovi</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(s.levels||[]).map((lvl, k) => (
                <span key={k} className="px-2 py-1 rounded bg-blue-500/20 text-blue-200 text-xs">{lvl.level}</span>
              ))}
              <button onClick={()=>addLevel(i)} className="px-2 py-1 rounded bg-slate-700 text-blue-100 text-xs">+ livello</button>
            </div>
          </div>
        ))}
      </div>

      {map && (
        <div className="text-blue-300/70 text-sm">Mappa attiva: {map.name} • Sezioni: {map.sections?.length || 0}</div>
      )}
    </div>
  )
}
