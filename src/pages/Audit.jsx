import { useState } from 'react'
import { ScrollText, User, Bot, Server, ShieldCheck, Download } from 'lucide-react'
import { Panel, PageHeader, Btn } from '../components/ui'
import { useStore } from '../store'

const TYPE = { human: [User, 'text-cyan-300'], agent: [Bot, 'text-purple-300'], system: [Server, 'text-amber-300'] }

export default function Audit() {
  const { logs } = useStore()
  const [f, setF] = useState('all')
  const list = logs.filter((l) => f === 'all' || l.type === f)
  const exportCsv = () => {
    const csv = ['id,timestamp,actor,action,target,type,hash', ...logs.map((l) => [l.id, new Date(l.ts).toISOString(), l.actor, l.action, l.target, l.type, l.hash].map((x) => `"${x}"`).join(','))].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'orca-audit-trail.csv'
    a.click()
  }
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="10 · Compliance" title="Immutable Audit Trail" desc="Every action by analysts, AI agents and systems is time-stamped and hashed. Actions you take across ORCA appear here instantly."
        right={<Btn variant="ghost" onClick={exportCsv}><Download className="h-4 w-4" /> Export CSV</Btn>} />
      <div className="grid gap-4 md:grid-cols-4">
        {[['Total entries', logs.length, 'text-white'], ['Human actions', logs.filter((l) => l.type === 'human').length, 'text-cyan-300'], ['Agent actions', logs.filter((l) => l.type === 'agent').length, 'text-purple-300'], ['System events', logs.filter((l) => l.type === 'system').length, 'text-amber-300']].map(([l, v, c]) => (
          <div key={l} className="panel p-4"><div className="label">{l}</div><div className={`mt-1 font-display text-2xl font-bold ${c}`}>{v}</div></div>
        ))}
      </div>
      <Panel title="Action Logs" icon={ScrollText} bodyClass="p-0"
        right={<div className="flex gap-1">{['all', 'human', 'agent', 'system'].map((x) => <button key={x} onClick={() => setF(x)} className={`rounded px-2 py-0.5 text-[11px] capitalize ${f === x ? 'bg-cyan-400/15 text-cyan-200' : 'text-slate-500'}`}>{x}</button>)}</div>}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="label"><tr className="border-b border-cyan-400/10">{['Time', 'Log ID', 'Actor', 'Action', 'Target', 'Hash', ''].map((h) => <th key={h} className="px-4 py-2.5 font-normal">{h}</th>)}</tr></thead>
            <tbody>
              {list.map((l) => {
                const [I, c] = TYPE[l.type]
                return (
                  <tr key={l.id + l.ts} className="border-b border-cyan-400/5 hover:bg-white/5">
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-slate-400">{new Date(l.ts).toLocaleString('en-GB')}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-500">{l.id}</td>
                    <td className={`px-4 py-2.5 ${c}`}><span className="flex items-center gap-1.5"><I className="h-3.5 w-3.5" />{l.actor}</span></td>
                    <td className="px-4 py-2.5 text-slate-200">{l.action}</td>
                    <td className="px-4 py-2.5 font-mono text-cyan-300/80">{l.target}</td>
                    <td className="px-4 py-2.5 font-mono text-[10px] text-slate-500">{l.hash}</td>
                    <td className="px-4 py-2.5"><ShieldCheck className="h-4 w-4 text-emerald-400" /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
