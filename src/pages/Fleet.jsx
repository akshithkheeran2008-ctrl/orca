import { useState } from 'react'
import { Ship, Anchor, Waves, Wind, Fish, Navigation, ShieldCheck, TriangleAlert, Fuel } from 'lucide-react'
import { Area, AreaChart, Bar as RBar, BarChart, ResponsiveContainer, XAxis, Tooltip } from 'recharts'
import CoastMap, { Polyline, CircleMarker, Tooltip as MTip } from '../components/CoastMap'
import { Panel, PageHeader, Select, Kpi } from '../components/ui'
import { REGIONS, regionById, rng, series } from '../data'

const catchData = (() => { const r = rng(5); return ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'].map((w) => ({ w, t: Math.round(40 + r() * 60) })) })()

function verdict(r) {
  if (r.wave >= 2.8 || r.wind >= 32) return { k: 'nosail', label: 'Do Not Sail', c: 'rose', txt: 'High wave energy and wind create unsafe conditions for all small craft.' }
  if (r.wave >= 2 || r.wind >= 24) return { k: 'caution', label: 'Sail with Caution', c: 'amber', txt: 'Moderate swell. Stay within 12 nm and keep VHF Ch16 open.' }
  return { k: 'safe', label: 'Safe to Sail', c: 'emerald', txt: 'Calm conditions. Potential fishing zone active within range.' }
}

export default function Fleet() {
  const [rid, setRid] = useState('goa')
  const r = regionById(rid)
  const v = verdict(r)
  const dir = r.lng < 80 ? -1 : 1
  const pfz = [r.lat + 0.6, r.lng + dir * 1.4]
  const route = [[r.lat, r.lng], [r.lat + 0.25, r.lng + dir * 0.5], [r.lat + 0.5, r.lng + dir * 1.0], pfz]
  const cls = { rose: 'border-rose-500/50 bg-rose-500/10 text-rose-300', amber: 'border-amber-400/50 bg-amber-400/10 text-amber-300', emerald: 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300' }[v.c]
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="05 · Sea-Ready Guidance" title="Fleet & Fisherman Support" desc="Route optimization, potential fishing zones and a clear no-sail signal — delivered over authenticated SMS and VHF so advisories can't be spoofed."
        right={<div className="flex items-center gap-2"><span className="label">Sailing from</span><Select value={rid} onChange={setRid}>{REGIONS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</Select></div>} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi icon={Ship} label="Live Vessels" value="24 / 31" color="#22d3ee" data={series(16, 30, 6, 51)} sub="co-op fleet online" />
        <Kpi icon={Fish} label="Weekly Catch" value="86 t" delta="9%" up color="#34d399" data={series(16, 30, 10, 52)} />
        <Kpi icon={Fuel} label="Fleet Efficiency" value="87%" delta="4%" up color="#a855f7" data={series(16, 30, 8, 53)} />
        <Kpi icon={ShieldCheck} label="Signed Advisories" value="1,942" sub="Ed25519 · tamper-proof" color="#f59e0b" data={series(16, 30, 8, 54)} />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Panel title="Safe Route Preview" icon={Navigation} bodyClass="p-2" corners>
          <CoastMap selected={rid} onSelect={setRid} height={600} fly flyZoom={7} regions={REGIONS}>
            <Polyline positions={route} pathOptions={{ color: v.k === 'nosail' ? '#f43f5e' : '#22d3ee', weight: 3, dashArray: '8 6' }} />
            <CircleMarker center={pfz} radius={22} pathOptions={{ color: '#34d399', weight: 1.5, fillColor: '#34d399', fillOpacity: 0.2 }}>
              <MTip className="orca-tip" permanent direction="right">PFZ · {v.k === 'nosail' ? 'CLOSED' : 'ACTIVE'}</MTip>
            </CircleMarker>
            <CircleMarker center={[r.lat, r.lng]} radius={6} pathOptions={{ color: '#fff', weight: 2, fillColor: '#22d3ee', fillOpacity: 1 }}>
              <MTip className="orca-tip" permanent direction="left">HARBOUR</MTip>
            </CircleMarker>
          </CoastMap>
        </Panel>
        <div className="space-y-5">
          <div className={`panel border-2 p-5 ${cls}`}>
            <div className="flex items-center gap-3">
              {v.k === 'nosail' ? <TriangleAlert className="h-8 w-8" /> : <Anchor className="h-8 w-8" />}
              <div><div className="label">District advisory</div><div className="font-display text-2xl font-bold">{v.label}</div></div>
            </div>
            <p className="mt-3 text-sm text-slate-300">{v.txt}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[[Waves, r.wave + ' m', 'Wave'], [Wind, r.wind + ' km/h', 'Wind'], [Fish, v.k === 'safe' ? 'Strong' : v.k === 'caution' ? 'Moderate' : 'Weak', 'PFZ']].map(([I, val, l]) => (
                <div key={l} className="rounded-lg bg-black/30 p-2"><I className="mx-auto h-4 w-4" /><div className="mt-1 font-mono text-sm text-white">{val}</div><div className="font-mono text-[9px] text-slate-500">{l}</div></div>
              ))}
            </div>
            <div className="mt-3 font-mono text-[11px] text-slate-400">Fishing window: <span className="text-white">{v.k === 'nosail' ? '— closed —' : '05:30 – 09:30 IST'}</span></div>
            <div className="mt-1 font-mono text-[10px] text-slate-500">Advisory sig: ed25519:7f3a…c91e ✓ verified</div>
          </div>
          <Panel title="Weekly Catch Volume" icon={Fish}>
            <div className="h-36">
              <ResponsiveContainer>
                <BarChart data={catchData}><XAxis dataKey="w" tick={{ fill: '#64748b', fontSize: 9 }} /><Tooltip cursor={{ fill: '#22d3ee11' }} contentStyle={{ background: '#060d1b', border: '1px solid #22d3ee55', borderRadius: 8, fontSize: 12 }} /><RBar dataKey="t" fill="#22d3ee" radius={[3, 3, 0, 0]} /></BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
          <Panel title="Ocean Productivity" icon={Waves}>
            <div className="h-24"><ResponsiveContainer><AreaChart data={series(30, 50, 12, 77)}><Area dataKey="v" stroke="#34d399" fill="#34d39933" /></AreaChart></ResponsiveContainer></div>
            <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-[11px]">
              <div><span className="text-slate-500">Wind</span><div className="text-white">{(r.wind / 1.85).toFixed(1)} kts</div></div>
              <div><span className="text-slate-500">Waves</span><div className="text-white">{r.wave} m</div></div>
              <div><span className="text-slate-500">Chl-a</span><div className="text-white">{(0.4 + r.health / 100).toFixed(2)} mg/m³</div></div>
            </div>
          </Panel>
        </div>
      </div>
      <p className="font-mono text-[10px] text-slate-600">Simulated preview — do not use for real navigation. Follow official INCOIS / IMD bulletins.</p>
    </div>
  )
}
