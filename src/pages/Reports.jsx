import { useEffect, useState } from 'react'
import { FileLock2, Link2, ShieldCheck, ShieldX, Send, Hash, Lock } from 'lucide-react'
import { Panel, PageHeader, Select, Btn } from '../components/ui'
import { ISSUE_TYPES, REGIONS, ROLES, SEED_REPORTS, WORKFLOW, regionById, sha256 } from '../data'
import { useStore } from '../store'

const KEY = 'orca-ledger-v1'
const payload = (r) => JSON.stringify({ id: r.id, region: r.region, issue: r.issue, role: r.role, urgency: r.urgency, desc: r.desc, ts: r.ts, prev: r.prev })

async function buildChain(items) {
  const out = []
  let prev = '0'.repeat(64)
  for (const it of items) {
    const r = { ...it, prev }
    r.hash = await sha256(payload(r))
    out.push(r)
    prev = r.hash
  }
  return out
}

export default function Reports() {
  const [chain, setChain] = useState([])
  const [form, setForm] = useState({ region: 'mannar', issue: ISSUE_TYPES[0], role: ROLES[0], urgency: 'Medium', desc: '' })
  const [verify, setVerify] = useState(null)
  const [busy, setBusy] = useState(false)
  const { log, toast } = useStore()

  useEffect(() => {
    const saved = localStorage.getItem(KEY)
    if (saved) { setChain(JSON.parse(saved)); return }
    const base = Date.now() - SEED_REPORTS.length * 3600000
    buildChain(SEED_REPORTS.slice().reverse().map((r, i) => ({ ...r, ts: base + i * 3600000 }))).then(setChain)
  }, [])
  useEffect(() => { if (chain.length) localStorage.setItem(KEY, JSON.stringify(chain)) }, [chain])

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    const prev = chain.length ? chain[chain.length - 1].hash : '0'.repeat(64)
    const r = { ...form, id: 'ORC-' + Math.random().toString(16).slice(2, 6).toUpperCase(), ts: Date.now(), stage: 1, prev }
    r.hash = await sha256(payload(r))
    setChain((c) => [...c, r])
    setForm({ ...form, desc: '' })
    setVerify(null)
    setBusy(false)
    log('Citizen', 'Submitted signed report', r.id)
    toast('Report signed & chained', `${r.id} · sha256 ${r.hash.slice(0, 12)}…`, 'green')
  }

  const advance = (id) => {
    setChain((c) => c.map((r) => (r.id === id ? { ...r, stage: Math.min(r.stage + 1, WORKFLOW.length - 1) } : r)))
    log('Analyst Akshith', 'Advanced report workflow', id)
  }

  const runVerify = async () => {
    let prev = '0'.repeat(64)
    for (const r of chain) {
      const h = await sha256(payload({ ...r, prev }))
      if (r.prev !== prev || h !== r.hash) { setVerify({ ok: false, at: r.id }); toast('Ledger tamper detected', `Chain broken at ${r.id}`, 'red'); return }
      prev = r.hash
    }
    setVerify({ ok: true })
    log('Validator', 'Verified report ledger', `${chain.length} blocks`, 'agent')
    toast('Ledger verified', `${chain.length} blocks · SHA-256 chain intact`, 'green')
  }

  const tamper = () => {
    if (chain.length < 3) return
    const i = Math.floor(chain.length / 2)
    setChain((c) => c.map((r, j) => (j === i ? { ...r, desc: r.desc + ' [edited]' } : r)))
    setVerify(null)
    toast('Simulated attack', `An attacker silently edited ${chain[i].id}. Run verification.`, 'red')
  }

  const reset = async () => {
    localStorage.removeItem(KEY)
    const base = Date.now() - SEED_REPORTS.length * 3600000
    setChain(await buildChain(SEED_REPORTS.slice().reverse().map((r, i) => ({ ...r, ts: base + i * 3600000 }))))
    setVerify(null)
  }

  const rows = chain.slice().reverse()
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="06 · Community Signal" title="Secure Citizen Reports" desc="Every shoreline observation is hashed with SHA-256 and chained to the previous one — a tamper-evident ledger, so no report can be silently altered or deleted." />
      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <Panel title="Log a shoreline observation" icon={FileLock2} corners>
          <form onSubmit={submit} className="space-y-3 text-sm">
            <label className="block"><span className="label">Location</span><Select className="mt-1 w-full" value={form.region} onChange={(v) => setForm({ ...form, region: v })}>{REGIONS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</Select></label>
            <label className="block"><span className="label">Issue type</span><Select className="mt-1 w-full" value={form.issue} onChange={(v) => setForm({ ...form, issue: v })}>{ISSUE_TYPES.map((r) => <option key={r}>{r}</option>)}</Select></label>
            <label className="block"><span className="label">Reporter role</span><Select className="mt-1 w-full" value={form.role} onChange={(v) => setForm({ ...form, role: v })}>{ROLES.map((r) => <option key={r}>{r}</option>)}</Select></label>
            <div><span className="label">Urgency</span>
              <div className="mt-1 grid grid-cols-3 gap-2">{['Low', 'Medium', 'High'].map((u) => <button type="button" key={u} onClick={() => setForm({ ...form, urgency: u })} className={`rounded-lg border py-2 text-xs ${form.urgency === u ? 'border-cyan-400 bg-cyan-400/15 text-cyan-200' : 'border-cyan-400/15 text-slate-400'}`}>{u}</button>)}</div>
            </div>
            <label className="block"><span className="label">Description</span><textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={3} placeholder="What did you observe?" className="mt-1 w-full rounded-lg border border-cyan-400/20 bg-abyss-850 px-3 py-2 text-sm focus:border-cyan-400/60" /></label>
            <Btn type="submit" className="w-full" disabled={busy}><Send className="h-4 w-4" /> Sign &amp; submit report</Btn>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500"><Lock className="h-3 w-3" /> Encrypted in transit · hashed client-side with Web Crypto</div>
          </form>
        </Panel>
        <div className="space-y-5">
          <Panel title="Hash-Chain Integrity" icon={Link2}
            right={<div className="flex gap-2"><Btn variant="ghost" className="!py-1 text-xs" onClick={tamper}>Simulate tamper</Btn><Btn variant="ghost" className="!py-1 text-xs" onClick={reset}>Reset</Btn><Btn className="!py-1 text-xs" onClick={runVerify}><ShieldCheck className="h-3.5 w-3.5" /> Verify ledger</Btn></div>}>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {chain.map((r, i) => {
                const broken = verify && !verify.ok && verify.at === r.id
                return (
                  <div key={r.id} className="flex items-center gap-2">
                    <div className={`w-36 shrink-0 rounded-lg border p-2 font-mono text-[10px] ${broken ? 'border-rose-500 bg-rose-500/15 shadow-glow-red' : verify?.ok ? 'border-emerald-400/50 bg-emerald-400/5' : 'border-cyan-400/20 bg-abyss-850'}`}>
                      <div className="flex justify-between text-slate-400"><span>#{i}</span><span className="text-cyan-300">{r.id}</span></div>
                      <div className="mt-1 truncate text-slate-500">prev {r.prev.slice(0, 10)}…</div>
                      <div className="truncate text-white">hash {r.hash.slice(0, 10)}…</div>
                    </div>
                    {i < chain.length - 1 && <Link2 className="h-3.5 w-3.5 shrink-0 text-cyan-400/50" />}
                  </div>
                )
              })}
            </div>
            {verify && (
              <div className={`mt-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${verify.ok ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300' : 'border-rose-500/50 bg-rose-500/15 text-rose-300'}`}>
                {verify.ok ? <ShieldCheck className="h-4 w-4" /> : <ShieldX className="h-4 w-4" />}
                {verify.ok ? `Ledger intact — all ${chain.length} blocks verified with SHA-256.` : `Tamper detected at ${verify.at}. Hash mismatch — record was modified after signing.`}
              </div>
            )}
          </Panel>
          <Panel title="Recent citizen reports" icon={Hash} bodyClass="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="label"><tr className="border-b border-cyan-400/10">{['Report ID', 'Region', 'Issue', 'Urgency', 'SHA-256', 'Workflow', 'Action'].map((h) => <th key={h} className="px-4 py-2.5 font-normal">{h}</th>)}</tr></thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-cyan-400/5 hover:bg-white/5">
                      <td className="px-4 py-2.5 font-mono text-cyan-300">{r.id}</td>
                      <td className="px-4 py-2.5 text-slate-300">{regionById(r.region).name}</td>
                      <td className="px-4 py-2.5">{r.issue}</td>
                      <td className="px-4 py-2.5"><span className={r.urgency === 'High' ? 'text-rose-300' : r.urgency === 'Medium' ? 'text-amber-300' : 'text-emerald-300'}>{r.urgency}</span></td>
                      <td className="px-4 py-2.5 font-mono text-[10px] text-slate-500">{r.hash.slice(0, 14)}…</td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-0.5">{WORKFLOW.map((w, i) => <span key={w} title={w} className={`h-1.5 w-4 rounded-full ${i <= r.stage ? 'bg-cyan-400' : 'bg-abyss-600'}`} />)}</div>
                        <div className="mt-1 text-[10px] text-slate-400">{WORKFLOW[r.stage]}</div>
                      </td>
                      <td className="px-4 py-2.5">{r.stage < WORKFLOW.length - 1 ? <button onClick={() => advance(r.id)} className="text-cyan-300 hover:underline">Advance →</button> : <span className="text-emerald-300">Done</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
