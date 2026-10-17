import { useMemo, useState } from 'react'
import { Layers, Ship, Crosshair, Thermometer, Waves, Wind, ShieldAlert, Eye } from 'lucide-react'
import CoastMap, { CircleMarker, Polyline, Tooltip } from '../components/CoastMap'
import { Panel, PageHeader, StatusBadge, SevBadge } from '../components/ui'
import { ALERTS, REGIONS, regionById, rng } from '../data'

const LAYERS = [
  { id: 'vessels', label: 'AIS Vessel Traffic', color: '#22d3ee' },
  { id: 'spoof', label: 'Spoofed / Ghost Vessels', color: '#f43f5e' },
  { id: 'jam', label: 'GNSS Jamming Zones', color: '#a855f7' },
  { id: 'lanes', label: 'Shipping Lanes', color: '#f59e0b' },
  { id: 'sst', label: 'SST Heat Anomaly', color: '#fb923c' },
]

export default function ThreatMap() {
  const [sel, setSel] = useState('mannar')
  const [on, setOn] = useState({ vessels: true, spoof: true, jam: true, lanes: true, sst: false })
  const r = regionById(sel)

  const vessels = useMemo(() => {
    const g = rng(42)
    return Array.from({ length: 70 }, (_, i) => {
      const base = REGIONS[i % REGIONS.length]
      return { id: 'MMSI 41' + (9000000 + Math.floor(g() * 999999)), lat: base.lat + (g() - 0.5) * 3.2 - 0.6, lng: base.lng + (g() - 0.3) * 3 - (base.lng < 80 ? 1.2 : -0.8), spd: (4 + g() * 14).toFixed(1) }
    })
  }, [])
  const ghosts = useMemo(() => {
    const g = rng(9)
    return Array.from({ length: 14 }, (_, i) => ({ id: 'MMSI 4199990' + String(i).padStart(2, '0'), lat: 7.9 + g() * 0.5, lng: 78.0 + g() * 0.6 }))
  }, [])
  const regionAlerts = ALERTS.filter((a) => a.region === sel)

  return (
    <div>
      <PageHeader eyebrow="01 · Coastal Intelligence" title="Coastal Threat Map" desc="Satellite imagery fused with AIS, RF and sensor-mesh telemetry. Spoofed vessels and jamming zones are detected and flagged in real time." />
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <Panel bodyClass="p-2" corners>
          <div className="relative">
            <CoastMap selected={sel} onSelect={setSel} height={640} fly>
              {on.lanes && (
                <>
                  <Polyline positions={[[23, 66], [19, 71.5], [15, 72.8], [9.5, 75], [6.2, 79], [6, 85], [9.5, 89], [15, 89], [21, 89.2]]} pathOptions={{ color: '#f59e0b', weight: 1.5, dashArray: '6 8', opacity: 0.8 }} />
                  <Polyline positions={[[6, 79], [5.5, 92], [7, 98]]} pathOptions={{ color: '#f59e0b', weight: 1.5, dashArray: '6 8', opacity: 0.8 }} />
                </>
              )}
              {on.sst && REGIONS.filter((x) => x.sst > 30).map((x) => (
                <CircleMarker key={'sst' + x.id} center={[x.lat, x.lng]} radius={40} pathOptions={{ color: '#fb923c', weight: 0, fillColor: '#fb923c', fillOpacity: 0.18 }} />
              ))}
              {on.jam && (
                <CircleMarker center={[18.6, 72.2]} radius={55} pathOptions={{ color: '#a855f7', weight: 1, dashArray: '4 4', fillColor: '#a855f7', fillOpacity: 0.12 }}>
                  <Tooltip className="orca-tip">GNSS L1 jamming · +23 dB noise floor</Tooltip>
                </CircleMarker>
              )}
              {on.vessels && vessels.map((v) => (
                <CircleMarker key={v.id} center={[v.lat, v.lng]} radius={2.5} pathOptions={{ color: '#22d3ee', weight: 1, fillColor: '#22d3ee', fillOpacity: 0.9 }}>
                  <Tooltip className="orca-tip">{v.id} · {v.spd} kn · verified</Tooltip>
                </CircleMarker>
              ))}
              {on.spoof && ghosts.map((v) => (
                <CircleMarker key={v.id} center={[v.lat, v.lng]} radius={4} pathOptions={{ color: '#f43f5e', weight: 1.5, fillColor: '#f43f5e', fillOpacity: 0.4 }}>
                  <Tooltip className="orca-tip">⚠ {v.id} · SPOOFED · 62 kn jump</Tooltip>
                </CircleMarker>
              ))}
            </CoastMap>
            <div className="absolute left-3 top-3 z-[500] w-56 rounded-lg border border-cyan-400/20 bg-abyss-950/85 p-3 backdrop-blur">
              <div className="label mb-2 flex items-center gap-1.5"><Layers className="h-3 w-3" /> Intelligence Layers</div>
              {LAYERS.map((l) => (
                <label key={l.id} className="flex cursor-pointer items-center justify-between py-1 text-xs text-slate-300">
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: l.color }} />{l.label}</span>
                  <input type="checkbox" checked={on[l.id]} onChange={() => setOn({ ...on, [l.id]: !on[l.id] })} className="accent-cyan-400" />
                </label>
              ))}
            </div>
            <div className="absolute bottom-3 left-3 z-[500] flex gap-2 font-mono text-[10px]">
              <span className="rounded border border-cyan-400/30 bg-abyss-950/85 px-2 py-1 text-cyan-300"><Ship className="mr-1 inline h-3 w-3" />{vessels.length * 122} vessels</span>
              <span className="rounded border border-rose-500/40 bg-abyss-950/85 px-2 py-1 text-rose-300"><Crosshair className="mr-1 inline h-3 w-3" />{ghosts.length} spoofed</span>
            </div>
          </div>
        </Panel>
        <div className="space-y-5">
          <Panel title="Selected Sector" icon={Eye} right={<StatusBadge status={r.status} />}>
            <div className="text-lg font-semibold text-white">{r.name}</div>
            <div className="font-mono text-[11px] text-slate-500">{r.state} · {r.lat}°N {r.lng}°E</div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[[Thermometer, r.sst + '°C', 'SST'], [Waves, r.wave + ' m', 'Wave'], [Wind, r.wind, 'km/h']].map(([I, v, l]) => (
                <div key={l} className="rounded-lg border border-cyan-400/10 bg-abyss-850 p-2 text-center">
                  <I className="mx-auto h-4 w-4 text-cyan-300" />
                  <div className="mt-1 font-mono text-sm text-white">{v}</div>
                  <div className="font-mono text-[9px] text-slate-500">{l}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between"><span className="text-slate-500">Sensor node</span><span className="text-cyan-300">{r.node}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Firmware</span><span className="text-emerald-300">3.8.2 · signed</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Uplink</span><span className="text-emerald-300">mTLS · healthy</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Ecosystem</span><span className="text-white">{r.health}/100</span></div>
            </div>
          </Panel>
          <Panel title="Sector Alerts" icon={ShieldAlert} bodyClass="p-2">
            {regionAlerts.length === 0 && <div className="p-3 text-xs text-slate-500">No open alerts for this sector.</div>}
            {regionAlerts.map((a) => (
              <div key={a.id} className="rounded-lg p-2 hover:bg-white/5">
                <div className="flex items-center justify-between"><span className="font-mono text-[10px] text-slate-500">{a.id} · {a.time}</span><SevBadge sev={a.sev} /></div>
                <div className="mt-1 text-sm text-slate-100">{a.title}</div>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  )
}
