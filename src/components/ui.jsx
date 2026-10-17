import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { SEVERITY, STATUS } from '../data'

export function Panel({ title, icon: Icon, right, children, className = '', bodyClass = 'p-4', corners = false }) {
  return (
    <section className={`panel ${corners ? 'panel-corners' : ''} ${className}`}>
      {title && (
        <header className="flex items-center justify-between gap-2 border-b border-cyan-400/10 px-4 py-3">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-cyan-300" />}
            <h3 className="text-sm font-semibold tracking-wide text-slate-100">{title}</h3>
          </div>
          {right}
        </header>
      )}
      <div className={bodyClass}>{children}</div>
    </section>
  )
}

export function Sparkline({ data, color = '#22d3ee', height = 40 }) {
  const id = 'g' + color.replace('#', '')
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, bottom: 0, left: 0, right: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={color} stopOpacity={0.45} />
              <stop offset="1" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.6} fill={`url(#${id})`} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function Kpi({ icon: Icon, label, value, delta, up = true, good = true, color = '#22d3ee', data, sub }) {
  return (
    <div className="panel p-4 overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <span className="label flex min-w-0 items-center gap-2 truncate">
          {Icon && <Icon className="h-3.5 w-3.5" style={{ color }} />}
          {label}
        </span>
        {delta && (
          <span className={`shrink-0 whitespace-nowrap font-mono text-[11px] ${good ? 'text-emerald-300' : 'text-rose-300'}`}>
            {up ? '▲' : '▼'} {delta}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <div className="font-display text-2xl font-bold text-white" style={{ textShadow: `0 0 18px ${color}55` }}>{value}</div>
          {sub && <div className="mt-0.5 text-[11px] text-slate-500">{sub}</div>}
        </div>
        {data && <div className="w-28"><Sparkline data={data} color={color} height={38} /></div>}
      </div>
    </div>
  )
}

export function SevBadge({ sev }) {
  const s = SEVERITY[sev]
  return <span className={`inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${s.cls}`}>{s.label}</span>
}

export function StatusBadge({ status }) {
  const s = STATUS[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] ${s.text} ${s.bg} ${s.border}`}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
      {s.label}
    </span>
  )
}

export function ScoreBox({ score }) {
  const c = score >= 8 ? 'bg-rose-500 text-white' : score >= 6 ? 'bg-orange-400 text-black' : score >= 4 ? 'bg-amber-300 text-black' : 'bg-emerald-400 text-black'
  return <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md font-display text-sm font-bold ${c}`}>{score}</span>
}

export function PageHeader({ eyebrow, title, desc, right }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="label text-cyan-300/80">{eyebrow}</div>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-wide text-white md:text-3xl">{title}</h1>
        {desc && <p className="mt-1 max-w-2xl text-sm text-slate-400">{desc}</p>}
      </div>
      {right}
    </div>
  )
}

export function Bar({ value, color = '#22d3ee' }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-abyss-700">
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color, boxShadow: `0 0 10px ${color}` }} />
    </div>
  )
}

export function Btn({ children, variant = 'primary', className = '', ...p }) {
  const v = {
    primary: 'bg-cyan-400 text-abyss-950 hover:bg-cyan-300 shadow-glow',
    ghost: 'border border-cyan-400/25 text-cyan-200 hover:bg-cyan-400/10',
    danger: 'bg-rose-500/90 text-white hover:bg-rose-500 shadow-glow-red',
  }[variant]
  return (
    <button className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${v} ${className}`} {...p}>
      {children}
    </button>
  )
}

export function Select({ value, onChange, children, className = '' }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`rounded-lg border border-cyan-400/20 bg-abyss-850 px-3 py-2 text-sm text-slate-200 focus:border-cyan-400/60 ${className}`}>
      {children}
    </select>
  )
}
