import React from 'react'

export default function Header({ active, onChange }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'loads', label: 'Carichi' },
    { id: 'map', label: 'Mappa' },
  ]
  return (
    <div className="sticky top-0 z-10 backdrop-blur-sm bg-slate-900/60 border-b border-blue-500/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="Flames" className="w-8 h-8" />
          <div className="text-white font-semibold tracking-tight">Flames Blue • Warehouse</div>
        </div>
        <nav className="flex items-center gap-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={(active === t.id ? 'bg-blue-500/20 text-white' : 'text-blue-200/80 hover:text-white hover:bg-blue-500/10') + ' px-4 py-2 rounded-lg transition-colors'}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
