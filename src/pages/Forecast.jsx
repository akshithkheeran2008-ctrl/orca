import { useMemo, useState } from 'react'
import { CloudLightning, Waves, Wind, Droplets, TriangleAlert } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Panel, PageHeader, Select } from '../components/ui'
import { REGIONS, rng } from '../data'

export default function Forecast() {
  const [rid, setRid] = useState('all')
  const [sel, setSel] = useState(0)
  const days = useMemo(() => {
    const r = rng(rid.length * 97 + rid.charCodeAt(0))
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(Date.now() + i * 86400000)
      const wave = +(1.2 + r() * 3.6).toFixed(2), wind = +(14 + r() * 28).toFixed(1), rain = Math.round(15 + r() * 70)
      const risk = wave > 3.2 || wind > 36 ? 'danger' : wave > 2 || wind > 26 ? 'caution' : 'safe'
      return { d, label: d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit' }), mon: d.toLocaleDateString('en-GB', { month: 'short' }), wave, wind, rain, risk }
    })
  }, [rid])
  const s = days[sel]
  const col = { safe: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300', caution: 'border-amber-400/40 bg-amber-400/10 text-amber-300', danger: 'border-rose-500/50 bg-rose-500/15 text-rose-300' }
  const counts = ['safe', 'caution', 'danger'].map((k) => days.filter((d) => d.risk === k).length)
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="08 · Predictive Telemetry" title="30-Day Coastal Forecast" desc="Calamity and sail-condition outlook blending IMD- and INCOIS-style feeds, delivered through integrity-checked data pipelines."
        right={<Select value={rid} onChange={(v) => { setRid(v); setSel(0) }}><option value="all">All coasts (national)</option>{REGIONS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</Select>} />
      <div className="flex gap-3 font-mono text-xs">
        <span className="rounded border border-emerald-400/40 px-2 py-1 text-emerald-300">Safe · {counts[0]}</span>
        <span className="rounded border border-amber-400/40 px-2 py-1 text-amber-300">Caution · {counts[1]}</span>
        <span className="rounded border border-rose-500/50 px-2 py-1 text-rose-300">Danger · {counts[2]}</span>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <Panel title="Calendar" icon={CloudLightning}>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6 2xl:grid-cols-10">
            {days.map((d, i) => (
              <button key={i} onClick={() => setSel(i)} className={`rounded-lg border p-2 text-left transition ${col[d.risk]} ${sel === i ? 'ring-2 ring-cyan-300' : 'hover:brightness-125'}`}>
                <div className="text-xs font-semibold text-white">{d.label}</div>
                <div className="font-mono text-[9px] text-slate-400">{d.mon}</div>
                <div className="mt-1.5 font-mono text-[10px]">{d.wave} m</div>
                <div className="font-mono text-[10px] text-slate-400">{d.wind} km/h</div>
              </button>
            ))}
          </div>
        </Panel>
        <Panel title="Day Briefing" icon={TriangleAlert} corners>
          <div className={`inline-block rounded border px-2 py-0.5 font-mono text-[10px] uppercase ${col[s.risk]}`}>{s.risk}</div>
          <div className="mt-2 text-xl font-semibold text-white">{s.d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[[Waves, s.wave + ' m', 'Wave'], [Wind, s.wind, 'km/h'], [Droplets, s.rain + '%', 'Rain']].map(([I, v, l]) => (
              <div key={l} className="rounded-lg border border-cyan-400/10 bg-abyss-850 p-2"><I className="mx-auto h-4 w-4 text-cyan-300" /><div className="mt-1 font-mono text-sm text-white">{v}</div><div className="font-mono text-[9px] text-slate-500">{l}</div></div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-300">{s.risk === 'danger' ? 'Severe sea state expected. Small craft must remain in harbour. District authorities on standby.' : s.risk === 'caution' ? 'Moderate swell. Small craft advised to stay near shore and monitor VHF Ch16.' : 'Favourable conditions for fishing and coastal operations.'}</p>
          <div className="mt-3 font-mono text-[10px] text-slate-500">Feed integrity: sha256 ✓ · source signed</div>
        </Panel>
      </div>
      <Panel title="Wave & Wind Trend" icon={Waves}>
        <div className="h-60">
          <ResponsiveContainer>
            <AreaChart data={days} margin={{ left: -10, right: 8 }}>
              <defs><linearGradient id="fw" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#22d3ee" stopOpacity={0.4} /><stop offset="1" stopColor="#22d3ee" stopOpacity={0} /></linearGradient><linearGradient id="fwi" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#a855f7" stopOpacity={0.3} /><stop offset="1" stopColor="#a855f7" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke="#13233f" strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 10 }} interval={2} />
              <YAxis yAxisId="a" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis yAxisId="b" orientation="right" tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#060d1b', border: '1px solid #22d3ee55', borderRadius: 8, fontSize: 12 }} />
              <Area yAxisId="a" dataKey="wave" name="Wave (m)" stroke="#22d3ee" fill="url(#fw)" strokeWidth={2} />
              <Area yAxisId="b" dataKey="wind" name="Wind (km/h)" stroke="#a855f7" fill="url(#fwi)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  )
}
