import { useState } from 'react'
import { ShieldAlert, Satellite, Ship, ShieldCheck, Waves, Thermometer, Wind, Activity, ArrowRight, Cpu, Lock, Radar } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Kpi, Panel, ScoreBox, SevBadge, StatusBadge, Bar, Btn } from '../components/ui'
import CoastMap from '../components/CoastMap'
import { ALERTS, REGIONS, THREAT_ACTORS, regionById, series, rng } from '../data'

const traffic = (() => {
  const r = rng(7)
  return Array.from({ length: 24 }, (_, i) => ({ h: `${String(i).padStart(2, '0')}:00`, normal: Math.round(28000 + Math.sin(i / 3) * 6000 + r() * 4000), suspicious: Math.round(12000 + r() * 4000), blocked: Math.round(3500 + r() * 2500 + (i > 16 ? 2500 : 0)) }))
})()

export default function CommandCenter({ setPage }) {
  const [sel, setSel] = useState('mannar')
  const r = regionById(sel)
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="label flex items-center gap-2 text-cyan-300/80"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Mission Console · India Coastal Watch</div>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-wide text-white md:text-3xl">
            See the coast <span className="text-cyan-300" style={{ textShadow: '0 0 24px rgba(34,211,238,.6)' }}>before</span> it changes.
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">Ocean intelligence and cyber defense in one secured console — every sensor signed, every signal verified, every action audited.</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={() => setPage('cyber')}><ShieldCheck className="h-4 w-4" /> Cyber posture</Btn>
          <Btn onClick={() => setPage('alerts')}>Open alert center <ArrowRight className="h-4 w-4" /></Btn>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-6">
        <Kpi icon={ShieldAlert} label="Active Alerts" value="28" delta="12.5%" up good={false} color="#f43f5e" data={series(20, 30, 14, 3)} />
        <Kpi icon={ShieldCheck} label="Blocked Attacks" value="1,324" delta="15.3%" up color="#34d399" data={series(20, 40, 18, 5)} />
        <Kpi icon={Satellite} label="Sensors Online" value="2,184" delta="0.4%" up color="#22d3ee" data={series(20, 50, 6, 8)} sub="of 2,193 attested" />
        <Kpi icon={Ship} label="Vessels Tracked" value="8,547" delta="5.4%" up={false} good color="#a855f7" data={series(20, 40, 12, 9)} />
        <Kpi icon={Thermometer} label="SST Anomaly" value="+2.1°C" delta="0.3°C" up good={false} color="#f59e0b" data={series(20, 30, 8, 11)} />
        <Kpi icon={Activity} label="Ecosystem Index" value="68/100" delta="2 pts" up={false} good={false} color="#22d3ee" data={series(20, 40, 8, 13)} />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="Coastal Intelligence Grid" icon={Radar} className="xl:col-span-2" corners
          right={<div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">{['#34d399', '#fbbf24', '#fb923c', '#f43f5e'].map((c, i) => <span key={c} className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: c }} />{['Safe', 'Moderate', 'High', 'Critical'][i]}</span>)}</div>}>
          <CoastMap selected={sel} onSelect={setSel} height={430} />
        </Panel>
        <Panel title="Regional Dashboard" icon={Cpu} right={<StatusBadge status={r.status} />}>
          <div className="label">{r.state} · {r.sea}</div>
          <div className="mt-1 text-lg font-semibold text-white">{r.name}</div>
          <div className="font-mono text-[11px] text-slate-500">{r.lat.toFixed(1)}°N · {r.lng.toFixed(1)}°E · node {r.node}</div>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative grid h-24 w-24 place-items-center">
              <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#13233f" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.5" fill="none" stroke={r.health < 50 ? '#f43f5e' : r.health < 70 ? '#fbbf24' : '#34d399'} strokeWidth="3" strokeDasharray={`${r.health * 0.974} 100`} strokeLinecap="round" />
              </svg>
              <div className="text-center"><div className="font-display text-2xl font-bold text-white">{r.health}</div><div className="font-mono text-[9px] text-slate-500">HEALTH</div></div>
            </div>
            <div className="grid flex-1 grid-cols-1 gap-2 text-sm">
              <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-slate-400"><Thermometer className="h-3.5 w-3.5" /> Sea temp</span><span className="font-mono text-white">{r.sst}°C</span></div>
              <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-slate-400"><Waves className="h-3.5 w-3.5" /> Wave</span><span className="font-mono text-white">{r.wave} m</span></div>
              <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-slate-400"><Wind className="h-3.5 w-3.5" /> Wind</span><span className="font-mono text-white">{r.wind} km/h</span></div>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300"><Lock className="h-3.5 w-3.5" /> Node integrity verified</div>
            <div className="mt-1 font-mono text-[10px] text-slate-500">Ed25519 sig · last attest 42 s ago · fw 3.8.2 (signed)</div>
          </div>
          <div className="mt-4 label">All coastal areas · {REGIONS.length}</div>
          <div className="mt-2 max-h-40 space-y-1 overflow-y-auto pr-1">
            {REGIONS.map((x) => (
              <button key={x.id} onClick={() => setSel(x.id)} className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs ${x.id === sel ? 'bg-cyan-400/10 text-cyan-200' : 'text-slate-400 hover:bg-white/5'}`}>
                <span className="truncate">{x.name}</span>
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: { safe: '#34d399', moderate: '#fbbf24', high: '#fb923c', critical: '#f43f5e' }[x.status] }} />
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="Network & Telemetry Traffic · 24h" icon={Activity} className="xl:col-span-2"
          right={<div className="flex gap-3 font-mono text-[10px]"><span className="text-cyan-300">● Normal</span><span className="text-amber-300">● Suspicious</span><span className="text-rose-300">● Blocked</span></div>}>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={traffic} margin={{ left: -10, right: 8, top: 8 }}>
                <defs>
                  {[['n', '#22d3ee'], ['s', '#f59e0b'], ['b', '#f43f5e']].map(([k, c]) => (
                    <linearGradient key={k} id={'cc' + k} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={c} stopOpacity={0.35} /><stop offset="1" stopColor={c} stopOpacity={0} /></linearGradient>
                  ))}
                </defs>
                <CartesianGrid stroke="#13233f" strokeDasharray="3 3" />
                <XAxis dataKey="h" tick={{ fill: '#64748b', fontSize: 10 }} interval={3} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(v) => v / 1000 + 'k'} />
                <Tooltip contentStyle={{ background: '#060d1b', border: '1px solid #22d3ee55', borderRadius: 8, fontSize: 12 }} />
                <Area dataKey="normal" stroke="#22d3ee" fill="url(#ccn)" strokeWidth={2} />
                <Area dataKey="suspicious" stroke="#f59e0b" fill="url(#ccs)" strokeWidth={2} />
                <Area dataKey="blocked" stroke="#f43f5e" fill="url(#ccb)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="System Status" icon={Cpu} right={<span className="font-mono text-[10px] text-emerald-300">ALL SYSTEMS OPERATIONAL</span>}>
          {[['Edge compute load', 32, '#22d3ee'], ['Satellite uplink', 65, '#a855f7'], ['Data lake storage', 78, '#f59e0b'], ['SIEM ingestion', 45, '#34d399'], ['Encrypted channels', 99, '#34d399']].map(([l, v, c]) => (
            <div key={l} className="mb-4">
              <div className="mb-1.5 flex justify-between text-xs"><span className="text-slate-400">{l}</span><span className="font-mono text-white">{v}%</span></div>
              <Bar value={v} color={c} />
            </div>
          ))}
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Priority Alerts" icon={ShieldAlert} right={<button onClick={() => setPage('alerts')} className="text-xs text-cyan-300 hover:underline">View all</button>} bodyClass="p-2">
          {ALERTS.slice(0, 5).map((a) => (
            <button key={a.id} onClick={() => setPage('alerts')} className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-white/5">
              <ScoreBox score={a.score} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-slate-100">{a.title}</div>
                <div className="font-mono text-[10px] text-slate-500">{a.id} · {regionById(a.region).name} · {a.time}</div>
              </div>
              <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase ${a.kind === 'cyber' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-cyan-500/15 text-cyan-300'}`}>{a.kind}</span>
              <SevBadge sev={a.sev} />
            </button>
          ))}
        </Panel>
        <Panel title="Threat Actor Intelligence" icon={Radar} bodyClass="p-0">
          <table className="w-full text-left text-xs">
            <thead className="label"><tr className="border-b border-cyan-400/10">{['Threat actor IP', 'ASN / Location', 'Alerts', 'Score', 'Severity', 'Last active'].map((h) => <th key={h} className="px-4 py-2.5 font-normal">{h}</th>)}</tr></thead>
            <tbody>
              {THREAT_ACTORS.slice(0, 6).map((t) => (
                <tr key={t.ip} className="border-b border-cyan-400/5 hover:bg-white/5">
                  <td className="px-4 py-2.5 font-mono text-cyan-300">{t.ip}</td>
                  <td className="px-4 py-2.5 text-slate-300">{t.asn} <span className="text-slate-500">· {t.cc}</span></td>
                  <td className="px-4 py-2.5 font-mono">{t.alerts}</td>
                  <td className="px-4 py-2.5 font-mono">{t.score}</td>
                  <td className="px-4 py-2.5"><SevBadge sev={t.sev} /></td>
                  <td className="px-4 py-2.5 text-slate-500">{t.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  )
}
