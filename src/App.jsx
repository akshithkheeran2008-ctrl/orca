import { useEffect, useState } from 'react'
import { Sidebar, Topbar, Ticker, Toasts, BootScreen, NAV } from './components/Shell'
import CommandCenter from './pages/CommandCenter'
import ThreatMap from './pages/ThreatMap'
import Alerts from './pages/Alerts'
import Cyber from './pages/Cyber'
import Fleet from './pages/Fleet'
import Reports from './pages/Reports'
import Agents from './pages/Agents'
import Forecast from './pages/Forecast'
import Mission from './pages/Mission'
import Audit from './pages/Audit'

const PAGES = { command: CommandCenter, map: ThreatMap, alerts: Alerts, cyber: Cyber, fleet: Fleet, reports: Reports, ai: Agents, forecast: Forecast, mission: Mission, audit: Audit }

const fromHash = () => {
  const h = window.location.hash.replace('#/', '').replace('#', '')
  return NAV.some((n) => n.id === h) ? h : 'command'
}

export default function App() {
  const [page, setPageState] = useState(fromHash)
  const [collapsed, setCollapsed] = useState(false)
  const [booted, setBooted] = useState(() => sessionStorage.getItem('orca-boot') === '1')

  useEffect(() => {
    const f = () => setPageState(fromHash())
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])

  const setPage = (p) => {
    window.location.hash = '/' + p
    window.scrollTo({ top: 0 })
  }
  const Page = PAGES[page]

  return (
    <>
      {!booted && <BootScreen onDone={() => { sessionStorage.setItem('orca-boot', '1'); setBooted(true) }} />}
      <Sidebar page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`min-h-full transition-all ${collapsed ? 'md:pl-[72px]' : 'md:pl-64'}`}>
        <Topbar page={page} setPage={setPage} />
        <Ticker />
        <main className="mx-auto max-w-[1600px] p-4 md:p-6">
          <Page setPage={setPage} />
        </main>
        <footer className="border-t border-cyan-400/10 px-6 py-4 text-center font-mono text-[10px] text-slate-600">
          ORCA · Ocean Reconnaissance &amp; Cyber-secured Analytics · Demonstration build with simulated data — not for real navigation. Follow official INCOIS / IMD / Indian Coast Guard bulletins.
        </footer>
      </div>
      <Toasts />
    </>
  )
}
