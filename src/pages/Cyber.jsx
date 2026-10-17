import { useEffect, useMemo, useState } from 'react'
import { ShieldCheck, Lock, KeyRound, Cpu, Radio, Terminal, Globe, Fingerprint, Server, Wifi } from 'lucide-react'
import { Bar as RBar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Kpi, Panel, PageHeader, SevBadge, Bar } from '../components/ui'
import { ATTACK_TYPES, REGIONS, THREAT_ACTORS, series, rng } from '../data'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const blocked = (() => { const r = rng(4); return days.map((d) => ({ d, blocked: Math.round(140 + r() * 120), allowed: Math.round(10 + r() * 30) })) })()

const MITRE = [
  ['Initial Access', ['Spearphishing', 'Remote Services', 'Supply Chain'], [1, 2, 0]],
  ['Execution', ['Firmware Mod', 'Scripting', 'API Abuse'], [2, 0, 1]],
  ['Evasion', ['Spoof Reporting', 'Rootkit', 'Masquerade'], [3, 0, 1]],
  ['Discovery', ['Network Scan', 'Remote Discovery', 'Wireless Sniff'], [2, 1, 1]],
  ['Impact', ['Denial of Service', 'Loss of View', 'Manipulation'], [3, 1, 2]],
]

const LOG_SRC = [
  ['DROP', 'TCP', '45.95.147.236:51122', 'SCADA-OD-VPN:443', 'rose'],
  ['ALLOW', 'mTLS', 'BUOY-TN-11', 'ingest.orca:8883', 'emerald'],
  ['DROP', 'UDP', '185.220.101.47:9001', 'AIS-GW-TN-11:10110', 'rose'],
  ['ALLOW', 'mTLS', 'USV-NZ-001', 'ingest.orca:8883', 'emerald'],
  ['FLAG', 'NMEA', 'MMSI 419999004', 'AIS-GW-TN-11', 'amber'],
  ['DROP', 'TCP', '89.248.163.173:44321', 'api.orca:22', 'rose'],
  ['ALLOW', 'TLS1.3', 'analyst.priya', 'console.orca:443', 'emerald'],
  ['FLAG', 'RF', 'GNSS-L1 +23dB', 'BUOY-MH-04', 'amber'],
]

function LiveLog() {
  const [lines, setLines] = useState(() => LOG_SRC.slice(0, 6).map((l, i) => ({ l, t: Date.now() - i * 1500, k: i })))
  useEffect(() => {
    let k = 100
    const i = setInterval(() => setLines((ls) => [{ l: LOG_SRC[Math.floor(Math.random() * LOG_SRC.length)], t: Date.now(), k: k++ }, ...ls].slice(0, 14)), 1400)
    return () => clearInterval(i)
  }, [])
  return (
    <div className="h-72 overflow-hidden rounded-lg border border-cyan-400/10 bg-black/40 p-3 font-mono text-[11px]">
      {lines.map(({ l, t, k }) => (
        <div key={k} className="flex gap-3 whitespace-nowrap py-0.5">
          <span className="text-slate-600">{new Date(t).toLocaleTimeString('en-GB')}</span>
          <span className={`w-12 font-bold text-${l[4]}-400`}>{l[0]}</span>
          <span className="w-14 text-slate-500">{l[1]}</span>
          <span className="truncate text-cyan-300">{l[2]}</span>
          <span className="text-slate-600">→</span>
          <span className="truncate text-slate-300">{l[3]}</span>
        </div>
      ))}
    </div>
  )
}

export default function Cyber() {
  const nodes = useMemo(() => {
    const r = rng(21)
    return Array.from({ length: 96 }, (_, i) => {
      const x = r()
      return { id: i, st: x > 0.97 ? 'comp' : x > 0.91 ? 'warn' : 'ok', name: REGIONS[i % 16].node.replace(/\d+$/, String(i).padStart(2, '0')) }
    })
  }, [])
  const total = ATTACK_TYPES.reduce((s, x) => s + x.value, 0)
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="04 · Cyber Defense" title="Maritime Cyber Defense" desc="Zero-trust protection for every buoy, vessel transponder, port SCADA system and satellite uplink that feeds ORCA." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Kpi icon={ShieldCheck} label="Security Posture" value="94/100" delta="3 pts" up color="#34d399" data={series(20, 40, 6, 31)} />
        <Kpi icon={Globe} label="Intrusions Blocked" value="2,458" delta="12.5%" up color="#f43f5e" data={series(20, 40, 16, 32)} />
        <Kpi icon={Radio} label="AIS Spoofs Caught" value="156" delta="8.2%" up good={false} color="#22d3ee" data={series(20, 30, 14, 33)} />
        <Kpi icon={Wifi} label="Encrypted Traffic" value="2.45 TB" delta="23.1%" up color="#a855f7" data={series(20, 40, 12, 34)} />
        <Kpi icon={KeyRound} label="Keys Rotated (24h)" value="4,368" delta="on schedule" up color="#f59e0b" data={series(20, 30, 6, 35)} />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="Top Attack Types" icon={Globe}>
          <div className="flex items-center gap-4">
            <div className="relative h-48 w-48 shrink-0">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={ATTACK_TYPES} dataKey="value" innerRadius={58} outerRadius={84} paddingAngle={2} stroke="none">
                    {ATTACK_TYPES.map((x) => <Cell key={x.name} fill={x.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 grid place-items-center text-center"><div><div className="font-display text-2xl font-bold text-white">{total.toLocaleString()}</div><div className="font-mono text-[10px] text-slate-500">TOTAL</div></div></div>
            </div>
            <div className="flex-1 space-y-2">
              {ATTACK_TYPES.map((x) => (
                <div key={x.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-300"><span className="h-2.5 w-2.5 rounded-full" style={{ background: x.color }} />{x.name}</span>
                  <span className="font-mono text-slate-400">{((x.value / total) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
        <Panel title="Blocked vs Allowed Suspicious · 7d" icon={ShieldCheck}>
          <div className="h-52">
            <ResponsiveContainer>
              <BarChart data={blocked} margin={{ left: -20 }}>
                <CartesianGrid stroke="#13233f" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="d" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip cursor={{ fill: '#22d3ee11' }} contentStyle={{ background: '#060d1b', border: '1px solid #22d3ee55', borderRadius: 8, fontSize: 12 }} />
                <RBar dataKey="blocked" stackId="a" fill="#22d3ee" radius={[0, 0, 0, 0]} />
                <RBar dataKey="allowed" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Encryption & Identity" icon={Lock}>
          {[[Lock, 'Telemetry encryption', 'AES-256-GCM', 100], [KeyRound, 'Transport', 'TLS 1.3 · mTLS', 100], [Fingerprint, 'Operator MFA (FIDO2)', '98% enrolled', 98], [Cpu, 'Secure boot / TPM attest', '2,184 / 2,193', 99], [Server, 'Signed firmware', 'Ed25519', 97]].map(([I, l, v, p]) => (
            <div key={l} className="mb-3">
              <div className="mb-1 flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-slate-300"><I className="h-3.5 w-3.5 text-emerald-300" />{l}</span><span className="font-mono text-emerald-300">{v}</span></div>
              <Bar value={p} color="#34d399" />
            </div>
          ))}
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Edge Node Integrity · Sensor Mesh" icon={Cpu} right={<div className="flex gap-3 font-mono text-[10px]"><span className="text-emerald-300">● Attested</span><span className="text-amber-300">● Drift</span><span className="text-rose-300">● Quarantined</span></div>}>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}>
            {nodes.map((n) => (
              <div key={n.id} title={`${n.name} · ${n.st}`} className={`h-6 rounded-sm ${n.st === 'ok' ? 'bg-emerald-400/70' : n.st === 'warn' ? 'animate-pulse bg-amber-400' : 'animate-pulse bg-rose-500 shadow-glow-red'}`} />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            {[['Attested', nodes.filter((n) => n.st === 'ok').length, 'text-emerald-300'], ['Config drift', nodes.filter((n) => n.st === 'warn').length, 'text-amber-300'], ['Quarantined', nodes.filter((n) => n.st === 'comp').length, 'text-rose-300']].map(([l, v, c]) => (
              <div key={l} className="rounded-lg border border-cyan-400/10 bg-abyss-850 p-2"><div className={`font-display text-xl font-bold ${c}`}>{v}</div><div className="label">{l}</div></div>
            ))}
          </div>
        </Panel>
        <Panel title="Live Firewall / IDS Stream" icon={Terminal} right={<span className="flex items-center gap-1.5 font-mono text-[10px] text-rose-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />STREAMING</span>}>
          <LiveLog />
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="MITRE ATT&CK for ICS · Observed Techniques" icon={Fingerprint}>
          <div className="grid grid-cols-5 gap-2">
            {MITRE.map(([tac, techs, hits]) => (
              <div key={tac}>
                <div className="mb-2 truncate font-mono text-[10px] uppercase tracking-wider text-cyan-300">{tac}</div>
                {techs.map((t, i) => (
                  <div key={t} className={`mb-1.5 rounded-md border px-2 py-2 text-[11px] ${hits[i] >= 3 ? 'border-rose-500/50 bg-rose-500/20 text-rose-200' : hits[i] === 2 ? 'border-orange-400/40 bg-orange-400/15 text-orange-200' : hits[i] === 1 ? 'border-amber-400/30 bg-amber-400/10 text-amber-200' : 'border-cyan-400/10 bg-abyss-850 text-slate-500'}`}>{t}</div>
                ))}
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Top Threat Sources" icon={Globe} bodyClass="p-2">
          {THREAT_ACTORS.map((t) => (
            <div key={t.ip} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5">
              <span className="w-8 font-mono text-[10px] text-slate-500">{t.cc}</span>
              <div className="flex-1">
                <div className="font-mono text-xs text-cyan-300">{t.ip}</div>
                <div className="text-[10px] text-slate-500">{t.asn} · {t.ttp}</div>
              </div>
              <div className="w-24"><Bar value={t.score * 10} color={t.score >= 8 ? '#f43f5e' : t.score >= 6 ? '#f59e0b' : '#22d3ee'} /></div>
              <SevBadge sev={t.sev} />
            </div>
          ))}
        </Panel>
      </div>
    </div>
  )
}
