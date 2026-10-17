import { useEffect, useRef, useState } from 'react'
import { BrainCircuit, Bot, ShieldAlert, Satellite, ShieldCheck, LineChart, Siren, ScrollText, Terminal, Send } from 'lucide-react'
import { Panel, PageHeader, Select } from '../components/ui'
import { AGENTS, REGIONS, regionById } from '../data'

const ICONS = { sentinel: ShieldAlert, oceanus: Satellite, validator: ShieldCheck, forecaster: LineChart, responder: Siren, auditor: ScrollText }
const POS = { sentinel: [16, 18], oceanus: [84, 18], validator: [92, 50], forecaster: [84, 82], responder: [16, 82], auditor: [8, 50] }

function Diagram({ active }) {
  return (
    <div className="relative h-[460px] w-full">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {AGENTS.map((a) => {
          const [x, y] = POS[a.id]
          const on = active === a.id
          return <line key={a.id} x1="50" y1="50" x2={x} y2={y} stroke={on ? a.color : '#22d3ee'} strokeOpacity={on ? 0.9 : 0.35} strokeWidth={on ? 0.5 : 0.3} strokeDasharray="1.5 1.5" vectorEffect="non-scaling-stroke" className="animate-dash" style={{ strokeWidth: on ? 2.5 : 1.5 }} />
        })}
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="relative mx-auto grid h-32 w-48 place-items-center rounded-2xl border-2 border-cyan-400/60 bg-abyss-900 shadow-glow">
          <div className="absolute inset-0 -m-3 rounded-3xl border border-cyan-400/15" />
          <div>
            <Bot className="mx-auto h-9 w-9 text-cyan-300" />
            <div className="mt-1 font-display text-sm font-bold tracking-widest text-white">CENTRAL</div>
            <div className="font-display text-sm font-bold tracking-widest text-white">ORCHESTRATOR</div>
          </div>
        </div>
        <div className="mt-2 label">Task router · consensus engine</div>
      </div>
      {AGENTS.map((a) => {
        const I = ICONS[a.id]
        const [x, y] = POS[a.id]
        const on = active === a.id
        return (
          <div key={a.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
            <div className={`w-44 rounded-xl border bg-abyss-900/95 p-3 transition ${on ? 'scale-105' : ''}`} style={{ borderColor: on ? a.color : a.color + '55', boxShadow: on ? `0 0 28px -4px ${a.color}` : 'none' }}>
              <div className="flex items-center gap-2">
                <I className="h-5 w-5" style={{ color: a.color }} />
                <div><div className="text-sm font-bold text-white">{a.name}</div><div className="font-mono text-[9px] uppercase tracking-wider text-slate-400">{a.role}</div></div>
              </div>
              <div className="mt-2 flex items-center justify-between font-mono text-[9px]"><span className="flex items-center gap-1 text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{on ? 'WORKING' : 'IDLE'}</span><span className="text-slate-500">{a.tasks.toLocaleString()} tasks</span></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function plan(q, r) {
  return [
    ['oceanus', `Fused SST (${r.sst}°C), wave height (${r.wave} m) and wind (${r.wind} km/h) for ${r.name}. Ecosystem index ${r.health}/100.`],
    ['sentinel', `Scanned AIS + RF + network telemetry around ${r.node}. ${r.status === 'critical' ? '14 spoofed transponders and 1 intrusion attempt flagged.' : 'No active spoofing or intrusion signatures.'}`],
    ['validator', `Cross-checked ${r.node} against 3 neighbour buoys and satellite pass. Signatures valid · hash chain intact · confidence 94%.`],
    ['forecaster', `72-hour outlook: ${r.wave > 2.5 ? 'wave energy rising, surge risk elevated' : 'stable conditions with mild swell'}. Bleaching probability ${r.sst > 30.5 ? 'HIGH' : 'low'}.`],
    ['responder', r.status === 'critical' || r.status === 'high' ? `Recommend: issue signed no-sail advisory, alert district authority, and dispatch verification patrol.` : `Recommend: routine monitoring. Publish safe-to-sail advisory to fisher co-ops.`],
    ['auditor', `Decision trail signed (Ed25519) and appended to immutable audit log. Query: "${q}".`],
  ]
}

const SAMPLES = ['Explain the SST spike this week', 'Is anyone spoofing AIS near my coast?', 'Which districts need a fisherman advisory today?', 'Summarise mangrove health and cyber risk']

export default function Agents() {
  const [rid, setRid] = useState('mannar')
  const [q, setQ] = useState('')
  const [msgs, setMsgs] = useState([{ who: 'sys', text: 'ORCA multi-agent terminal ready. Secure channel established (TLS 1.3). Ask a question or pick a sample.' }])
  const [active, setActive] = useState(null)
  const [running, setRunning] = useState(false)
  const box = useRef(null)

  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight, behavior: 'smooth' }) }, [msgs])

  const ask = (text) => {
    if (running || !text.trim()) return
    const r = regionById(rid)
    setMsgs((m) => [...m, { who: 'you', text }])
    setQ('')
    setRunning(true)
    const steps = plan(text, r)
    steps.forEach(([agent, t], i) => {
      setTimeout(() => {
        setActive(agent)
        setMsgs((m) => [...m, { who: agent, text: t }])
        if (i === steps.length - 1) setTimeout(() => { setActive(null); setRunning(false) }, 900)
      }, 700 * (i + 1))
    })
  }

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="07 · Explainable Intelligence" title="ORCA AI · Multi-Agent System" desc="Six specialised agents coordinated by a central orchestrator. Every inference is validated, explained and signed — not just a warning, a why." />
      <Panel title="Multi-Agent System Architecture" icon={BrainCircuit} corners className="grid-bg">
        <Diagram active={active} />
      </Panel>
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Panel title="ORCA AI Terminal" icon={Terminal} right={<Select value={rid} onChange={setRid} className="!py-1 text-xs">{REGIONS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</Select>} bodyClass="p-0">
          <div ref={box} className="h-80 space-y-2 overflow-y-auto bg-black/40 p-4 font-mono text-xs">
            {msgs.map((m, i) => {
              const a = AGENTS.find((x) => x.id === m.who)
              return (
                <div key={i} className="leading-relaxed">
                  {m.who === 'you' ? <span className="text-white"><span className="text-cyan-400">analyst@orca:~$</span> {m.text}</span>
                    : m.who === 'sys' ? <span className="text-slate-500"># {m.text}</span>
                      : <span><span className="font-bold" style={{ color: a.color }}>[{a.name.toUpperCase()}]</span> <span className="text-slate-300">{m.text}</span></span>}
                </div>
              )
            })}
            {running && <span className="inline-block h-3 w-2 animate-blink bg-cyan-300" />}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(q) }} className="flex items-center gap-2 border-t border-cyan-400/10 p-3">
            <span className="font-mono text-xs text-cyan-400">$</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask ORCA…" className="flex-1 bg-transparent font-mono text-sm text-white placeholder:text-slate-600" />
            <button className="rounded-md bg-cyan-400 p-2 text-abyss-950 hover:bg-cyan-300"><Send className="h-4 w-4" /></button>
          </form>
        </Panel>
        <div className="space-y-5">
          <Panel title="Sample queries" icon={Bot} bodyClass="p-2">
            {SAMPLES.map((s) => <button key={s} onClick={() => ask(s)} disabled={running} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-slate-300 hover:bg-cyan-400/10 hover:text-cyan-200 disabled:opacity-40">“{s}”</button>)}
          </Panel>
          <Panel title="Agent roster" icon={BrainCircuit} bodyClass="p-2">
            {AGENTS.map((a) => { const I = ICONS[a.id]; return (
              <div key={a.id} className="flex gap-3 rounded-lg p-2"><I className="mt-0.5 h-4 w-4 shrink-0" style={{ color: a.color }} /><div><div className="text-sm font-semibold text-white">{a.name} <span className="font-normal text-slate-500">· {a.role}</span></div><div className="text-xs text-slate-400">{a.desc}</div></div></div>
            ) })}
          </Panel>
        </div>
      </div>
      <p className="font-mono text-[10px] text-slate-600">Simulated inference · no live LLM connected in this build.</p>
    </div>
  )
}
