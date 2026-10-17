import { useEffect, useState } from 'react'
import { Navigation, Pause, Play, CircleCheck, Battery, Gauge, Compass, Radio, Lock, Camera, Cpu } from 'lucide-react'
import CoastMap, { Polyline, CircleMarker, Tooltip } from '../components/CoastMap'
import { Panel, PageHeader, Btn, Select, Bar } from '../components/ui'
import { useStore } from '../store'

const WPS = [[9.05, 79.55], [8.75, 79.05], [8.4, 78.6], [8.0, 78.15], [7.75, 77.6]]
const TIMELINE = [
  { t: '13:00', name: 'USV Patrol Route A', st: 'Completed', meta: '2.5 km' },
  { t: '13:25', name: 'Harbour Perimeter Scan', st: 'Completed', meta: '1.8 km' },
  { t: '13:50', name: 'Water Sampling', st: 'In Progress', meta: '4 samples' },
  { t: '14:30', name: 'AIS Ghost-Fleet Verification', st: 'Queued', meta: 'Sector TN-11' },
  { t: '15:30', name: 'Reef Sonar Survey', st: 'Queued', meta: 'High-res grid' },
]

export default function Mission() {
  const [running, setRunning] = useState(true)
  const [prog, setProg] = useState(0.35)
  const [mode, setMode] = useState('Real-time Detection')
  const [secs, setSecs] = useState(134)
  const { log, toast } = useStore()

  useEffect(() => {
    if (!running) return
    const i = setInterval(() => { setProg((p) => (p >= 1 ? 0 : p + 0.004)); setSecs((s) => s + 1) }, 250)
    return () => clearInterval(i)
  }, [running])

  const seg = Math.min(Math.floor(prog * (WPS.length - 1)), WPS.length - 2)
  const f = prog * (WPS.length - 1) - seg
  const pos = [WPS[seg][0] + (WPS[seg + 1][0] - WPS[seg][0]) * f, WPS[seg][1] + (WPS[seg + 1][1] - WPS[seg][1]) * f]

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="09 · Autonomous Ops" title="USV Mission Control" desc="Uncrewed surface vessels patrolling the Gulf of Mannar over an encrypted, authenticated command link — commands are signed so hijacking is impossible."
        right={<div className="flex gap-2">
          <Btn variant="ghost" onClick={() => { setRunning(!running); log('Analyst Akshith', running ? 'Paused USV mission' : 'Resumed USV mission', 'USV Sentinel NZ-001') }}>{running ? <><Pause className="h-4 w-4" /> Pause mission</> : <><Play className="h-4 w-4" /> Resume</>}</Btn>
          <Btn variant="danger" onClick={() => { setRunning(false); setProg(1); log('Analyst Akshith', 'Completed USV mission', 'USV Sentinel NZ-001'); toast('Mission complete', 'USV Sentinel NZ-001 returning to base', 'green') }}><CircleCheck className="h-4 w-4" /> Complete mission</Btn>
        </div>} />
      <div className="grid gap-5 xl:grid-cols-[300px_1fr_300px]">
        <div className="space-y-5">
          <Panel title="Mission Status" icon={Navigation}>
            <div className="flex items-center gap-2"><span className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${running ? 'bg-cyan-400 text-abyss-950' : 'bg-amber-400 text-abyss-950'}`}>{running ? 'ACTIVE' : 'PAUSED'}</span><span className="font-mono text-xs text-slate-400">{Math.floor(secs / 60)}m {secs % 60}s elapsed</span></div>
            <div className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">USV</span><span className="text-white">Sentinel NZ-001</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Waypoints</span><span className="text-white">{WPS.length}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Progress</span><span className="font-mono text-cyan-300">{Math.round(prog * 100)}%</span></div>
            </div>
            <div className="mt-3"><Bar value={prog * 100} /></div>
          </Panel>
          <Panel title="Sensor Parameters" icon={Cpu}>
            <div className="space-y-3 text-sm">
              {[['Identification mode', mode, setMode, ['Real-time Detection', 'Batch Analysis', 'Stealth Survey']], ['Detection target', 'Invasive Species + Dark Vessels', null, ['Invasive Species + Dark Vessels']], ['Confidence threshold', '90% (High)', null, ['90% (High)']], ['Sonar frequency', 'High Frequency', null, ['High Frequency']]].map(([l, v, set, opts]) => (
                <label key={l} className="block"><span className="label">{l}</span><Select className="mt-1 w-full" value={v} onChange={set || (() => {})}>{opts.map((o) => <option key={o}>{o}</option>)}</Select></label>
              ))}
            </div>
          </Panel>
        </div>
        <Panel bodyClass="p-2" corners>
          <CoastMap height={620} center={[8.6, 78.6]} zoom={8} regions={[]}>
            <Polyline positions={WPS} pathOptions={{ color: '#22d3ee', weight: 2, dashArray: '6 6' }} />
            {WPS.map((w, i) => (
              <CircleMarker key={i} center={w} radius={7} pathOptions={{ color: '#fff', weight: 2, fillColor: i === 0 ? '#34d399' : i === WPS.length - 1 ? '#f43f5e' : '#6366f1', fillOpacity: 1 }}>
                <Tooltip className="orca-tip" permanent direction="top">{i === 0 ? 'S' : i === WPS.length - 1 ? 'E' : `WP${i}`}</Tooltip>
              </CircleMarker>
            ))}
            <CircleMarker center={pos} radius={10} pathOptions={{ color: '#22d3ee', weight: 3, fillColor: '#030712', fillOpacity: 1 }}>
              <Tooltip className="orca-tip" direction="right">USV NZ-001 · 6.2 kn</Tooltip>
            </CircleMarker>
          </CoastMap>
        </Panel>
        <div className="space-y-5">
          <Panel title="Live Telemetry" icon={Gauge}>
            {[[Battery, 'Battery', `${Math.max(20, 92 - Math.floor(secs / 20))}%`], [Gauge, 'Speed', running ? '6.2 kn' : '0.0 kn'], [Compass, 'Heading', `${218 + Math.round(Math.sin(secs / 10) * 6)}°`], [Radio, 'Link', '-61 dBm · SATCOM']].map(([I, l, v]) => (
              <div key={l} className="flex items-center justify-between border-b border-cyan-400/10 py-2.5 text-sm"><span className="flex items-center gap-2 text-slate-400"><I className="h-4 w-4 text-cyan-300" />{l}</span><span className="font-mono text-white">{v}</span></div>
            ))}
          </Panel>
          <Panel title="Command Link Security" icon={Lock}>
            <div className="space-y-2 font-mono text-[11px]">
              {[['Cipher', 'ChaCha20-Poly1305'], ['Auth', 'Ed25519 signed cmds'], ['Replay guard', 'nonce + timestamp'], ['GNSS', 'Anti-spoof (multi-band)'], ['Last cmd sig', 'a91f…03bc ✓']].map(([k, v]) => (
                <div key={k} className="flex justify-between"><span className="text-slate-500">{k}</span><span className="text-emerald-300">{v}</span></div>
              ))}
            </div>
          </Panel>
          <Panel title="Camera Feed" icon={Camera} bodyClass="p-2">
            <div className="relative grid h-32 place-items-center overflow-hidden rounded-lg bg-gradient-to-b from-sky-900/60 via-cyan-950 to-abyss-950">
              <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-300/40" />
              <div className="absolute left-1/2 top-0 h-full w-px bg-cyan-300/20" />
              <div className="h-10 w-10 rounded border border-rose-400/80" />
              <span className="absolute left-2 top-2 flex items-center gap-1 font-mono text-[9px] text-rose-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />REC · CAM-01</span>
              <span className="absolute bottom-2 right-2 font-mono text-[9px] text-cyan-300">TGT: vessel · 0.91</span>
            </div>
          </Panel>
        </div>
      </div>
      <Panel title="Mission Timeline" icon={Navigation}>
        <div className="grid gap-3 md:grid-cols-5">
          {TIMELINE.map((t) => (
            <div key={t.name} className={`rounded-lg border p-3 ${t.st === 'In Progress' ? 'border-indigo-400/50 bg-indigo-500/15' : t.st === 'Completed' ? 'border-cyan-400/20 bg-abyss-850' : 'border-slate-700 bg-abyss-900'}`}>
              <div className="font-mono text-[10px] text-slate-500">{t.t}</div>
              <div className="mt-1 text-sm font-semibold text-white">{t.name}</div>
              <div className="text-xs text-slate-400">{t.meta}</div>
              <div className={`mt-2 font-mono text-[10px] ${t.st === 'Completed' ? 'text-emerald-300' : t.st === 'In Progress' ? 'text-indigo-300' : 'text-slate-500'}`}>{t.st}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
