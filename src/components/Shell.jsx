import { useEffect, useState } from 'react'
import {
  LayoutDashboard, Map as MapIcon, Siren, ShieldCheck, Ship, FileLock2, BrainCircuit, CloudLightning, Navigation, ScrollText,
  Search, Bell, Lock, ChevronLeft, ChevronRight, Fingerprint, Radio,
} from 'lucide-react'
import { useStore } from '../store'

export const NAV = [
  { id: 'command', label: 'Command Center', icon: LayoutDashboard },
  { id: 'map', label: 'Coastal Threat Map', icon: MapIcon },
  { id: 'alerts', label: 'Alert Center', icon: Siren, badge: 6 },
  { id: 'cyber', label: 'Cyber Defense', icon: ShieldCheck, badge: 3 },
  { id: 'fleet', label: 'Fleet & Fisherman', icon: Ship },
  { id: 'reports', label: 'Secure Reports', icon: FileLock2 },
  { id: 'ai', label: 'ORCA AI Agents', icon: BrainCircuit },
  { id: 'forecast', label: 'Forecast', icon: CloudLightning },
  { id: 'mission', label: 'USV Mission Control', icon: Navigation },
  { id: 'audit', label: 'Audit Trail', icon: ScrollText },
]

export function Logo({ small }) {
  return (
    <div className="flex items-center gap-3">
      <img src="/orca.svg" alt="" className={small ? 'h-8 w-8' : 'h-10 w-10'} style={{ filter: 'drop-shadow(0 0 10px rgba(34,211,238,.6))' }} />
      {!small && (
        <div>
          <div className="font-display text-xl font-black tracking-[0.25em] text-white">ORCA</div>
          <div className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] text-cyan-300/70">Cyber-Secured Coastal Ops</div>
        </div>
      )}
    </div>
  )
}

export function Sidebar({ page, setPage, collapsed, setCollapsed }) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-cyan-400/10 bg-abyss-900/95 backdrop-blur transition-all md:flex ${collapsed ? 'w-[72px]' : 'w-64'}`}>
      <div className="flex h-16 items-center justify-between px-4">
        <Logo small={collapsed} />
      </div>
      <nav className="mt-2 flex-1 space-y-1 overflow-y-auto px-3">
        {NAV.map((n) => {
          const active = page === n.id
          return (
            <button key={n.id} onClick={() => setPage(n.id)} title={n.label}
              className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${active ? 'bg-cyan-400/10 text-cyan-200 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.3)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'}`}>
              {active && <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded bg-cyan-300 shadow-glow" />}
              <n.icon className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-cyan-300' : ''}`} />
              {!collapsed && <span className="truncate">{n.label}</span>}
              {!collapsed && n.badge && <span className="ml-auto rounded bg-rose-500/20 px-1.5 font-mono text-[10px] text-rose-300">{n.badge}</span>}
            </button>
          )
        })}
      </nav>
      <div className="space-y-3 p-3">
        {!collapsed && (
          <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-glow-green" /> Zero-Trust Mesh Online
            </div>
            <div className="mt-1 font-mono text-[10px] text-slate-500">TLS 1.3 · AES-256-GCM · mTLS</div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/10 py-2 text-xs text-slate-500 hover:text-cyan-300">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /> Collapse</>}
        </button>
      </div>
    </aside>
  )
}

function Clock() {
  const [t, setT] = useState(new Date())
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(i)
  }, [])
  const ist = t.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata' })
  const utc = t.toLocaleTimeString('en-GB', { timeZone: 'UTC' })
  return (
    <div className="hidden text-right lg:block">
      <div className="font-mono text-sm text-cyan-200">{ist} <span className="text-[10px] text-slate-500">IST</span></div>
      <div className="font-mono text-[10px] text-slate-500">{utc} UTC</div>
    </div>
  )
}

export function Topbar({ page, setPage }) {
  const { logs } = useStore()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-cyan-400/10 bg-abyss-950/80 px-4 backdrop-blur md:px-6">
      <div className="md:hidden"><Logo small /></div>
      <select value={page} onChange={(e) => setPage(e.target.value)} className="rounded-lg border border-cyan-400/20 bg-abyss-850 px-2 py-1.5 text-sm md:hidden">
        {NAV.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
      </select>
      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search threats, IPs, vessels, MMSI, regions…"
          className="w-full rounded-lg border border-cyan-400/15 bg-abyss-900 py-2 pl-9 pr-16 text-sm placeholder:text-slate-600 focus:border-cyan-400/50" />
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-slate-700 px-1.5 font-mono text-[10px] text-slate-500">CTRL K</kbd>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 sm:flex">
          <Radio className="h-3.5 w-3.5 animate-pulse text-amber-300" />
          <span className="font-mono text-[11px] font-bold tracking-widest text-amber-300">THREATCON · ELEVATED</span>
        </div>
        <div className="hidden items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-400/5 px-2.5 py-1.5 xl:flex">
          <Lock className="h-3.5 w-3.5 text-emerald-300" />
          <span className="font-mono text-[10px] text-emerald-300">E2E ENCRYPTED SESSION</span>
        </div>
        <Clock />
        <div className="relative">
          <button onClick={() => setOpen(!open)} className="relative rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 shadow-glow-red" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-80 panel p-2" onMouseLeave={() => setOpen(false)}>
              <div className="label px-2 py-1">Latest activity</div>
              {logs.slice(0, 5).map((l) => (
                <div key={l.id + l.ts} className="rounded-md px-2 py-2 text-xs hover:bg-white/5">
                  <span className="text-cyan-300">{l.actor}</span> <span className="text-slate-300">{l.action}</span>
                  <div className="font-mono text-[10px] text-slate-500">{l.target}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-cyan-400/15 bg-abyss-900 py-1 pl-1 pr-3">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-cyan-400 to-indigo-500 text-xs font-bold text-abyss-950">AK</div>
          <div className="hidden leading-tight sm:block">
            <div className="text-xs font-semibold text-white">Analyst Akshith</div>
            <div className="flex items-center gap-1 font-mono text-[9px] text-cyan-300/70"><Fingerprint className="h-2.5 w-2.5" /> L3 · SOC</div>
          </div>
        </div>
      </div>
    </header>
  )
}

const TICKS = [
  '[SENTINEL] AIS spoofing cluster quarantined · Gulf of Mannar',
  '[FIREWALL] 2,914 brute-force attempts blocked · SCADA-OD-VPN',
  '[OCEANUS] SST +2.1°C anomaly persists · Tuticorin reef',
  '[VALIDATOR] Unsigned firmware rejected · BUOY-WB-02',
  '[IMD-FEED] Cyclonic depression tracking NW · Bay of Bengal',
  '[KMS] Ed25519 uplink keys rotated · SAT-UPLINK-02',
  '[RF-WATCH] GNSS L1 jamming +23 dB · Konkan shipping lane',
  '[LEDGER] Citizen report ORC-B1B4 hash-chain verified',
]

export function Ticker() {
  const items = [...TICKS, ...TICKS]
  return (
    <div className="relative flex h-8 items-center overflow-hidden border-b border-cyan-400/10 bg-abyss-900/60">
      <div className="z-10 flex h-full items-center gap-2 bg-rose-500/90 px-3 font-mono text-[10px] font-bold tracking-widest text-white">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE
      </div>
      <div className="flex animate-ticker whitespace-nowrap">
        {items.map((t, i) => (
          <span key={i} className="mx-6 font-mono text-[11px] text-slate-400">
            <span className="text-cyan-300">{t.split(']')[0]}]</span>{t.split(']')[1]}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Toasts() {
  const { toasts } = useStore()
  return (
    <div className="fixed bottom-4 right-4 z-[1000] space-y-2">
      {toasts.map((t) => (
        <div key={t.id} className={`panel w-80 border-l-4 p-3 ${t.tone === 'red' ? 'border-l-rose-500' : t.tone === 'green' ? 'border-l-emerald-400' : 'border-l-cyan-400'}`}>
          <div className="text-sm font-semibold text-white">{t.title}</div>
          <div className="text-xs text-slate-400">{t.body}</div>
        </div>
      ))}
    </div>
  )
}

const BOOT = [
  'ORCA SECURE BOOT v4.2.1',
  'Verifying kernel signature ............ OK',
  'Establishing TLS 1.3 channel (X25519) .. OK',
  'Mutual TLS handshake with sensor mesh .. OK',
  'Loading zero-trust policy (412 rules) .. OK',
  'Attesting 2,184 edge nodes via TPM ..... OK',
  'Syncing threat intel feeds (CERT-In) ... OK',
  'Decrypting operator vault (AES-256) .... OK',
]

export function BootScreen({ onDone }) {
  const [n, setN] = useState(0)
  const done = n >= BOOT.length
  useEffect(() => {
    if (done) return
    const t = setTimeout(() => setN((x) => x + 1), 230)
    return () => clearTimeout(t)
  }, [n, done])
  return (
    <div className="grid-bg fixed inset-0 z-[2000] grid place-items-center bg-abyss-950 p-6">
      <div className="scanline" />
      <div className="relative w-full max-w-xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute inset-0 -m-6 rounded-full border border-cyan-400/20" />
            <div className="absolute inset-0 -m-6 animate-sweep rounded-full" style={{ background: 'conic-gradient(from 0deg, rgba(34,211,238,.35), transparent 30%)' }} />
            <img src="/orca.svg" alt="ORCA" className="relative h-20 w-20" style={{ filter: 'drop-shadow(0 0 20px rgba(34,211,238,.7))' }} />
          </div>
          <h1 className="mt-10 font-display text-5xl font-black tracking-[0.4em] text-white">ORCA</h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/80">Ocean Reconnaissance &amp; Cyber-secured Analytics</p>
        </div>
        <div className="panel panel-corners p-5 font-mono text-xs">
          {BOOT.slice(0, n).map((l, i) => (
            <div key={i} className={i === 0 ? 'mb-2 text-cyan-300' : 'text-slate-400'}>
              <span className="text-cyan-500">&gt;</span> {l.replace(' OK', '')}{l.endsWith('OK') && <span className="text-emerald-400"> OK</span>}
            </div>
          ))}
          {!done && <span className="inline-block h-3 w-2 animate-blink bg-cyan-300" />}
          {done && (
            <div className="mt-4 flex items-center justify-between border-t border-cyan-400/10 pt-4">
              <span className="flex items-center gap-2 font-bold tracking-widest text-emerald-300"><ShieldCheck className="h-4 w-4" /> ACCESS GRANTED</span>
              <button onClick={onDone} className="rounded-lg bg-cyan-400 px-4 py-2 font-sans text-sm font-semibold text-abyss-950 shadow-glow hover:bg-cyan-300">Enter Command Center →</button>
            </div>
          )}
        </div>
        <button onClick={onDone} className="mx-auto mt-4 block font-mono text-[10px] uppercase tracking-widest text-slate-600 hover:text-slate-400">Skip</button>
      </div>
    </div>
  )
}
