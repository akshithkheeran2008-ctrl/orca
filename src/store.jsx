import { createContext, useCallback, useContext, useState } from 'react'

const Ctx = createContext(null)

export function fnv(str) {
  let h1 = 0x811c9dc5, h2 = 0x01000193
  for (let i = 0; i < str.length; i++) {
    h1 = Math.imul(h1 ^ str.charCodeAt(i), 16777619)
    h2 = Math.imul(h2 ^ str.charCodeAt(i), 2246822519)
  }
  return ((h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0'))
}

const now = Date.now()
const SEED_LOGS = [
  ['Sentinel', 'Quarantined AIS feed', 'AIS-GW-TN-11', 'agent', 4],
  ['Validator', 'Rejected unsigned firmware', 'BUOY-WB-02', 'agent', 62],
  ['analyst.priya', 'Escalated alert', 'ALR-7729', 'human', 11],
  ['Responder', 'Issued no-sail directive', 'Sundarbans Delta Front', 'agent', 13],
  ['Firewall', 'Geo-blocked ASN AS51396', 'SCADA-OD-VPN', 'system', 23],
  ['Auditor', 'Rotated uplink keys (Ed25519)', 'SAT-UPLINK-02', 'agent', 64],
  ['analyst.rahul', 'Verified citizen report', 'ORC-B1B4', 'human', 70],
  ['KMS', 'Key rotation completed', 'TLS cert *.orca.gov.in', 'system', 120],
].map(([actor, action, target, type, mins], i) => {
  const ts = now - mins * 60000
  return { id: 'LOG-' + (9000 - i), ts, actor, action, target, type, hash: fnv(actor + action + target + ts) }
})

export function StoreProvider({ children }) {
  const [logs, setLogs] = useState(SEED_LOGS)
  const [toasts, setToasts] = useState([])

  const log = useCallback((actor, action, target, type = 'human') => {
    const ts = Date.now()
    setLogs((l) => [{ id: 'LOG-' + Math.floor(9000 + Math.random() * 999), ts, actor, action, target, type, hash: fnv(actor + action + target + ts) }, ...l])
  }, [])

  const toast = useCallback((title, body, tone = 'cyan') => {
    const id = Math.random()
    setToasts((t) => [...t, { id, title, body, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200)
  }, [])

  return <Ctx.Provider value={{ logs, log, toasts, toast }}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
