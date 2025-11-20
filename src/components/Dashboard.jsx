import React, { useEffect, useState } from 'react'
import { API } from '../lib/api'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      const res = await fetch(`${API}/dashboard`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <div className="text-blue-200">Caricamento…</div>
  if (!data) return <div className="text-red-300">Errore nel caricamento</div>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Presenti" value={data.present} />
        <StatCard title="Usciti" value={data.out} />
        <StatCard title="Avvisi" value={data.alerts?.length || 0} />
        <StatCard title="Movimenti" value={data.recent_moves?.length || 0} />
      </div>

      <section className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-4">
        <h3 className="text-white font-semibold mb-3">Priorità di prelievo</h3>
        <div className="divide-y divide-blue-500/10">
          {data.pick_priority.map((p) => (
            <div key={p.id} className="py-2 flex items-center justify-between text-blue-100">
              <div className="flex items-center gap-3">
                <span className={"px-2 py-0.5 text-xs rounded bg-blue-500/20 " + (p.level === 'sopra' ? 'text-blue-200' : 'text-blue-300/70')}>{p.level}</span>
                <span className="font-medium">{p.code}</span>
                <span className="text-blue-300/70">{p.section} • {p.side}</span>
              </div>
              <div className="text-blue-200">{p.quantity}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-4">
        <h3 className="text-white font-semibold mb-3">Movimenti recenti</h3>
        <div className="divide-y divide-blue-500/10">
          {data.recent_moves.map(m => (
            <div key={m.id} className="py-2 text-blue-100 flex items-center justify-between">
              <div>
                <span className="font-medium">{m.type.toUpperCase()}</span>
                <span className="ml-2 text-blue-300/70">{new Date(m.timestamp).toLocaleString()}</span>
              </div>
              <div className="text-blue-300/70">
                {m.to_position?.section || m.from_position?.section} • {m.to_position?.side || m.from_position?.side}
              </div>
            </div>
          ))}
        </div>
      </section>

      {data.alerts.length > 0 && (
        <section className="bg-amber-500/10 border border-amber-400/20 rounded-2xl p-4">
          <h3 className="text-amber-300 font-semibold mb-2">Avvisi</h3>
          <ul className="list-disc list-inside text-amber-200/90">
            {data.alerts.map((a, i) => <li key={i}>{a.message}</li>)}
          </ul>
        </section>
      )}
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-4">
      <div className="text-blue-300/80 text-sm">{title}</div>
      <div className="text-white text-2xl font-bold">{value}</div>
    </div>
  )
}
