import React, { useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Loads from './components/Loads'
import MapEditor from './components/MapEditor'

function App() {
  const [tab, setTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <Header active={tab} onChange={setTab} />

      <main className="relative max-w-7xl mx-auto px-4 py-8">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'loads' && <Loads />}
        {tab === 'map' && <MapEditor />}
      </main>
    </div>
  )
}

export default App
