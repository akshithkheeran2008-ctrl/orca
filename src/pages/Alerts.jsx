import { useState } from 'react'
import { Siren, ThumbsUp, ThumbsDown, Send, ShieldOff, Eye, Zap } from 'lucide-react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts'
import { Panel, PageHeader, ScoreBox, SevBadge, Btn } from '../components/ui'
import { ALERTS, regionById } from '../data'
import { useStore } from '../store'

const FILTERS = ['all', 'critical', 'high', 'medium', 'low']

export default function Alerts() {
  const [f, setF] = useState('all')
  const [kind, setKind] = useState('all')
  const [selId, setSelId] = useState(ALERTS[0].id)
  const [dispatched, setDispatched] = useState({})
  const { log, toast } = useStore()
  const list = ALERTS.filter((a) => (f === 'all' || a.sev === f) && (kind === 'all' || a.kind === kind))
  const a = ALERTS.find((x) => x.id === selId)
  const reg = regionById(a.region)
  const radar = [
    { k: 'Threat', v: a.score * 10 }, { k: 'Score', v: a.score * 9 }, { k: 'Severity', v: a.score * 8 + 10 }, { k: 'TTPs', v: a.kind === 'cyber' ? 80 : 30 }, { k: 'Spread', v: 40 + a.escalations * 4 },
  ]

  const act = (label) => {
    setDispatched((d) => ({ ...d, [a.id]: label }))
    log('Analyst Akshith', label, a.id)
    toast(label, `${a.id} · ${a.title}`, a.kind === 'cyber' ? 'red' : 'cyan')
  }

  return (
    <div>
      <PageHeader eyebrow="03 · Security Operations" title="Alert Center" desc="Unified queue of ocean hazards and cyber threats, scored by the ORCA AI agents and paired with a response playbook."
        right={<div className="flex gap-1 rounded-lg border border-cyan-400/15 bg-abyss-900 p-1 text-xs">{['all', 'cyber', 'ocean'].map((k) => <button key={k} onClick={() => setKind(k)} className={`rounded-md px-3 py-1.5 capitalize ${kind === k ? 'bg-cyan-400/15 text-cyan-200' : 'text-slate-400'}`}>{k}</button>)}</div>} />
      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <Panel title="Alerts" icon={Siren} bodyClass="p-2"
          right={<div className="flex gap-1">{FILTERS.map((x) => <button key={x} onClick={() => setF(x)} className={`rounded px-2 py-0.5 text-[10px] capitalize ${f === x ? 'bg-cyan-400/15 text-cyan-200' : 'text-slate-500 hover:text-slate-300'}`}>{x}</button>)}</div>}>
          <div className="max-h-[720px] space-y-1 overflow-y-auto">
            {list.map((x) => (
              <button key={x.id} onClick={() => setSelId(x.id)} className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition ${x.id === selId ? 'bg-cyan-400/10 ring-1 ring-cyan-400/30' : 'hover:bg-white/5'}`}>
                <ScoreBox score={x.score} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-100">{x.title}</div>
                  <div className="mt-1 flex items-center gap-2 font-mono text-[10px] text-slate-500">{x.time} · {regionById(x.region).state}
                    <span className={`rounded px-1 uppercase ${x.kind === 'cyber' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-cyan-500/15 text-cyan-300'}`}>{x.kind}</span>
                  </div>
                </div>
                {x.sev === 'critical' && <span className="mt-1 h-2.5 w-2.5 animate-pulse rounded-full bg-rose-500 shadow-glow-red" />}
              </button>
            ))}
          </div>
        </Panel>
        <Panel corners bodyClass="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="font-mono text-[11px] text-slate-500">{a.id} · {a.time}</div>
              <h2 className="mt-1 text-2xl font-semibold text-white">{a.title}</h2>
            </div>
            <div className="flex items-center gap-2 text-slate-500"><ThumbsUp className="h-4 w-4 cursor-pointer hover:text-emerald-300" /><ThumbsDown className="h-4 w-4 cursor-pointer hover:text-rose-300" /></div>
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-300">{a.desc}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <SevBadge sev={a.sev} />
            <span className="rounded border border-rose-500/40 bg-rose-500/15 px-1.5 py-0.5 font-mono text-[10px] uppercase text-rose-300">{a.status}</span>
            <span className="rounded border border-indigo-400/30 bg-indigo-400/10 px-1.5 py-0.5 font-mono text-[10px] text-indigo-300">{a.mitre}</span>
            <button onClick={() => act('Boosted priority')} className="inline-flex items-center gap-1 rounded border border-emerald-400/40 px-2 py-0.5 text-[11px] text-emerald-300 hover:bg-emerald-400/10"><Zap className="h-3 w-3" /> Boost</button>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_260px]">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              {[['Source', a.src, true], ['AS / Origin', a.asn], ['Target asset', a.target, true], ['Region', reg.name], ['Total score', a.score], ['Escalations', a.escalations]].map(([k, v, mono]) => (
                <div key={k} className="border-b border-cyan-400/10 pb-3">
                  <div className="label">{k}</div>
                  <div className={`mt-1 ${mono ? 'font-mono text-cyan-300' : 'text-slate-100'}`}>{v}</div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-cyan-400/15 bg-abyss-850 p-2">
              <div className="h-52">
                <ResponsiveContainer>
                  <RadarChart data={radar} outerRadius="70%">
                    <PolarGrid stroke="#1c3156" />
                    <PolarAngleAxis dataKey="k" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Radar dataKey="v" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.35} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          {a.escalations > 0 && <div className="mt-5 rounded-lg border border-rose-500/40 bg-rose-500/15 px-4 py-2 text-center text-sm text-rose-200">Escalated {a.escalations} times · most recent {a.time}</div>}
          <div className="mt-5 rounded-xl border border-cyan-400/15 bg-abyss-850 p-4">
            <div className="label text-cyan-300">Suggested response · ORCA Responder agent</div>
            <p className="mt-2 text-sm text-slate-200">{a.action}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Btn onClick={() => act('Dispatched response')}><Send className="h-4 w-4" /> Dispatch response</Btn>
              {a.kind === 'cyber' && <Btn variant="danger" onClick={() => act('Isolated asset')}><ShieldOff className="h-4 w-4" /> Isolate asset</Btn>}
              <Btn variant="ghost" onClick={() => act('Marked as investigating')}><Eye className="h-4 w-4" /> Investigate</Btn>
            </div>
            {dispatched[a.id] && <div className="mt-3 font-mono text-[11px] text-emerald-300">✓ {dispatched[a.id]} · signed &amp; written to audit trail</div>}
          </div>
        </Panel>
      </div>
    </div>
  )
}
