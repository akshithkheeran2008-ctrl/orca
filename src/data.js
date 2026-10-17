export function rng(seed = 1) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

export const STATUS = {
  safe: { label: 'Safe', color: '#34d399', text: 'text-emerald-300', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
  moderate: { label: 'Moderate', color: '#fbbf24', text: 'text-amber-300', bg: 'bg-amber-400/10', border: 'border-amber-400/30' },
  high: { label: 'High Risk', color: '#fb923c', text: 'text-orange-300', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
  critical: { label: 'Critical', color: '#f43f5e', text: 'text-rose-300', bg: 'bg-rose-500/10', border: 'border-rose-500/40' },
}

export const SEVERITY = {
  critical: { label: 'Critical', cls: 'text-rose-300 bg-rose-500/15 border-rose-500/40', score: 9 },
  high: { label: 'High', cls: 'text-orange-300 bg-orange-500/15 border-orange-500/40', score: 7 },
  medium: { label: 'Medium', cls: 'text-amber-300 bg-amber-500/15 border-amber-500/40', score: 5 },
  low: { label: 'Low', cls: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/40', score: 2 },
}

export const REGIONS = [
  { id: 'kutch', name: 'Kutch & Gulf of Khambhat', state: 'Gujarat', sea: 'Arabian Sea', lat: 22.6, lng: 69.6, health: 71, sst: 28.4, wave: 1.6, wind: 22, status: 'moderate', node: 'BUOY-GJ-01' },
  { id: 'mumbai', name: 'Mumbai & Konkan Coast', state: 'Maharashtra', sea: 'Arabian Sea', lat: 18.95, lng: 72.75, health: 52, sst: 29.6, wave: 2.1, wind: 26, status: 'high', node: 'BUOY-MH-04' },
  { id: 'goa', name: 'Goa Coastal Shelf', state: 'Goa', sea: 'Arabian Sea', lat: 15.4, lng: 73.7, health: 78, sst: 28.9, wave: 1.3, wind: 18, status: 'safe', node: 'BUOY-GA-02' },
  { id: 'karwar', name: 'Karwar & Canara Coast', state: 'Karnataka', sea: 'Arabian Sea', lat: 14.2, lng: 74.3, health: 74, sst: 29.1, wave: 1.5, wind: 19, status: 'safe', node: 'BUOY-KA-03' },
  { id: 'kochi', name: 'Malabar & Kochi Offshore', state: 'Kerala', sea: 'Arabian Sea', lat: 10.0, lng: 75.9, health: 66, sst: 29.8, wave: 2.0, wind: 21, status: 'moderate', node: 'BUOY-KL-07' },
  { id: 'mannar', name: 'Cape Comorin & Gulf of Mannar', state: 'Tamil Nadu', sea: 'Indian Ocean', lat: 8.6, lng: 78.4, health: 43, sst: 31.4, wave: 3.4, wind: 28, status: 'critical', node: 'BUOY-TN-11' },
  { id: 'lakshadweep', name: 'Lakshadweep Coral Atolls', state: 'Lakshadweep', sea: 'Arabian Sea', lat: 10.6, lng: 72.6, health: 61, sst: 30.6, wave: 1.9, wind: 20, status: 'moderate', node: 'BUOY-LD-01' },
  { id: 'chennai', name: 'Coromandel & Chennai Coast', state: 'Tamil Nadu', sea: 'Bay of Bengal', lat: 13.1, lng: 80.5, health: 58, sst: 30.1, wave: 2.4, wind: 24, status: 'high', node: 'BUOY-TN-02' },
  { id: 'puducherry', name: 'Puducherry Shoreline', state: 'Puducherry', sea: 'Bay of Bengal', lat: 11.9, lng: 80.0, health: 69, sst: 29.7, wave: 1.7, wind: 17, status: 'moderate', node: 'BUOY-PY-01' },
  { id: 'kg', name: 'Krishna-Godavari Basin', state: 'Andhra Pradesh', sea: 'Bay of Bengal', lat: 16.2, lng: 82.4, health: 64, sst: 29.4, wave: 1.8, wind: 23, status: 'moderate', node: 'RIG-AP-KG5' },
  { id: 'vizag', name: 'Visakhapatnam Deep Sea', state: 'Andhra Pradesh', sea: 'Bay of Bengal', lat: 17.6, lng: 83.6, health: 72, sst: 28.8, wave: 1.6, wind: 20, status: 'safe', node: 'BUOY-AP-09' },
  { id: 'odisha', name: 'Utkal Coast & Chilika Lake', state: 'Odisha', sea: 'Bay of Bengal', lat: 19.6, lng: 86.0, health: 49, sst: 30.3, wave: 2.9, wind: 34, status: 'high', node: 'BUOY-OD-05' },
  { id: 'sundarbans', name: 'Sundarbans Delta Front', state: 'West Bengal', sea: 'Bay of Bengal', lat: 21.5, lng: 88.6, health: 38, sst: 30.9, wave: 3.1, wind: 41, status: 'critical', node: 'BUOY-WB-02' },
  { id: 'nandaman', name: 'North Andaman Waters', state: 'Andaman & Nicobar', sea: 'Andaman Sea', lat: 13.2, lng: 93.0, health: 81, sst: 29.0, wave: 1.4, wind: 16, status: 'safe', node: 'BUOY-AN-01' },
  { id: 'portblair', name: 'South Andaman & Port Blair', state: 'Andaman & Nicobar', sea: 'Andaman Sea', lat: 11.6, lng: 92.9, health: 76, sst: 29.3, wave: 1.5, wind: 18, status: 'safe', node: 'BUOY-AN-03' },
  { id: 'nicobar', name: 'Great Nicobar Biosphere', state: 'Andaman & Nicobar', sea: 'Indian Ocean', lat: 7.0, lng: 93.8, health: 68, sst: 29.9, wave: 2.2, wind: 22, status: 'moderate', node: 'BUOY-AN-07' },
]

export const ALERTS = [
  { id: 'ALR-7731', kind: 'cyber', sev: 'critical', score: 9, title: 'AIS spoofing cluster near Gulf of Mannar', region: 'mannar', time: '4 min ago', src: '185.220.101.47', asn: 'Tor Exit · DE', target: 'AIS-GW-TN-11', mitre: 'T0856 · Spoof Reporting Message', desc: '14 vessel transponders broadcasting identical MMSI prefix with physically impossible 62-knot jumps. Signal triangulation places transmitters inside a 400 m radius — a classic ghost-fleet spoofing pattern used to mask illegal trawling.', action: 'Quarantine AIS feed, flag MMSI block, dispatch Coast Guard patrol for visual confirmation.', status: 'Escalated', escalations: 12 },
  { id: 'ALR-7729', kind: 'ocean', sev: 'critical', score: 9, title: 'Cyclone & high-wave warning', region: 'sundarbans', time: '11 min ago', src: 'SAT-OCEANSAT-3', asn: 'ISRO · IN', target: 'South 24 Parganas', mitre: '—', desc: 'Cyclonic depression tracking north-west with a 3.1 m surge model. Wind shear rising 18% per hour across Sundarbans sensor mesh.', action: 'Issue no-sail directive. Coordinate evacuation of low-lying pockets with district authority.', status: 'Active', escalations: 6 },
  { id: 'ALR-7724', kind: 'cyber', sev: 'high', score: 8, title: 'Brute-force on Paradip port SCADA VPN', region: 'odisha', time: '23 min ago', src: '45.95.147.236', asn: 'Pfcloud UG · NL', target: 'SCADA-OD-VPN', mitre: 'T0866 · Exploitation of Remote Services', desc: '2,914 failed authentication attempts in 6 minutes targeting the crane-control VPN concentrator. Credential list matches leaked maritime-sector dump.', action: 'Geo-block ASN, enforce hardware-key MFA, rotate service credentials.', status: 'Blocked', escalations: 3 },
  { id: 'ALR-7720', kind: 'ocean', sev: 'high', score: 7, title: 'Coral bleaching risk', region: 'mannar', time: '38 min ago', src: 'BUOY-TN-11', asn: 'ORCA Mesh', target: 'Tuticorin Reef', mitre: '—', desc: 'Sea surface temperature +2.1°C above seasonal baseline for 9 consecutive days. Degree-heating-weeks crossing bleaching alert level 1.', action: 'Pause reef-adjacent activity, deploy conservation dive team.', status: 'Monitoring', escalations: 2 },
  { id: 'ALR-7716', kind: 'cyber', sev: 'high', score: 7, title: 'GNSS jamming detected — Konkan shipping lane', region: 'mumbai', time: '52 min ago', src: 'RF-ANOMALY', asn: 'Unknown emitter', target: 'GNSS L1 band', mitre: 'T0814 · Denial of Service', desc: 'Sustained L1 band noise floor +23 dB across 3 buoys. 41 vessels reported position drift > 300 m.', action: 'Broadcast navigational warning, switch fleet to eLoran fallback, triangulate emitter.', status: 'Escalated', escalations: 8 },
  { id: 'ALR-7711', kind: 'ocean', sev: 'medium', score: 5, title: 'Possible oil pollution', region: 'mumbai', time: '1 h ago', src: 'Citizen ORC-B1B4', asn: 'Verified report', target: 'Sewri Mudflats', mitre: '—', desc: 'Citizen report matched to dark surface slick signature on SAR imagery. Estimated 0.8 km² spread.', action: 'Dispatch verification team, pre-position containment booms.', status: 'Investigating', escalations: 1 },
  { id: 'ALR-7705', kind: 'cyber', sev: 'medium', score: 6, title: 'Firmware tamper attempt on buoy BUOY-WB-02', region: 'sundarbans', time: '1 h ago', src: '103.75.190.12', asn: 'Unknown · VN', target: 'BUOY-WB-02', mitre: 'T0857 · System Firmware', desc: 'Unsigned firmware image pushed over satellite uplink. Secure-boot rejected the payload; signature mismatch logged.', action: 'Node isolated to read-only mode. Re-attest via TPM and rotate uplink keys.', status: 'Contained', escalations: 2 },
  { id: 'ALR-7698', kind: 'ocean', sev: 'medium', score: 5, title: 'Rip current advisory', region: 'chennai', time: '2 h ago', src: 'BUOY-TN-02', asn: 'ORCA Mesh', target: 'Marina Beach', mitre: '—', desc: 'Wave interaction with tidal drift generating rip channels along 2.3 km stretch.', action: 'Deploy lifeguards and publish public swim advisory.', status: 'Monitoring', escalations: 0 },
  { id: 'ALR-7690', kind: 'cyber', sev: 'low', score: 3, title: 'Phishing campaign targeting fisheries co-op', region: 'kochi', time: '3 h ago', src: 'mail.fish-subsidy[.]in', asn: 'Namecheap · US', target: '312 co-op inboxes', mitre: 'T0865 · Spearphishing Attachment', desc: 'Lookalike subsidy-portal emails with credential-harvesting link. 4 clicks, 0 credentials submitted thanks to FIDO2 enforcement.', action: 'Domain sinkholed. Awareness SMS sent to co-op members.', status: 'Resolved', escalations: 0 },
  { id: 'ALR-7684', kind: 'ocean', sev: 'low', score: 3, title: 'Mangrove stress signal', region: 'sundarbans', time: '4 h ago', src: 'SAT-NDVI', asn: 'Sentinel-2', target: 'North 24 Parganas', mitre: '—', desc: 'Salinity rising with a 6% NDVI drop observed over 14 days.', action: 'Alert forest wardens, schedule sapling reinforcement.', status: 'Monitoring', escalations: 0 },
]

export const THREAT_ACTORS = [
  { ip: '185.220.101.47', asn: 'Tor Exit Node', cc: 'DE', alerts: 14, score: 9, sev: 'critical', last: '4 min ago', ttp: 'AIS spoofing' },
  { ip: '45.95.147.236', asn: 'Pfcloud UG', cc: 'NL', alerts: 9, score: 8, sev: 'high', last: '23 min ago', ttp: 'VPN brute force' },
  { ip: '103.75.190.12', asn: 'VNPT Corp', cc: 'VN', alerts: 4, score: 7, sev: 'high', last: '1 h ago', ttp: 'Firmware tamper' },
  { ip: '89.248.163.173', asn: 'IP Volume Inc', cc: 'NL', alerts: 6, score: 6, sev: 'medium', last: '2 h ago', ttp: 'Port scanning' },
  { ip: '159.65.174.25', asn: 'DigitalOcean', cc: 'US', alerts: 3, score: 5, sev: 'medium', last: '3 h ago', ttp: 'API enumeration' },
  { ip: '198.235.24.15', asn: 'Google Cloud', cc: 'US', alerts: 2, score: 4, sev: 'low', last: '5 h ago', ttp: 'Recon crawl' },
  { ip: '3.132.23.201', asn: 'Amazon-02', cc: 'US', alerts: 2, score: 4, sev: 'low', last: '7 h ago', ttp: 'Credential stuffing' },
]

export const ATTACK_TYPES = [
  { name: 'AIS Spoofing', value: 812, color: '#22d3ee' },
  { name: 'GNSS Jamming', value: 561, color: '#f43f5e' },
  { name: 'SCADA Brute Force', value: 450, color: '#f59e0b' },
  { name: 'Firmware Tamper', value: 312, color: '#a855f7' },
  { name: 'Phishing', value: 194, color: '#34d399' },
  { name: 'Other', value: 129, color: '#64748b' },
]

export const ISSUE_TYPES = ['Plastic Waste', 'Oil Spill', 'Coral Bleaching', 'Fish Mortality', 'Injured Marine Animal', 'Illegal Fishing', 'Suspicious Vessel', 'Beach Erosion', 'Algal Bloom']
export const ROLES = ['Community Scout', 'Coastal Volunteer', 'Fisherfolk Rep', 'Marine Biologist', 'NGO Field Officer', 'Port Authority Observer']
export const WORKFLOW = ['Reported', 'Signed', 'AI Analyzed', 'Verified', 'Dispatched', 'Resolved']

export const SEED_REPORTS = [
  { id: 'ORC-0BB5', region: 'mannar', issue: 'Algal Bloom', role: 'Marine Biologist', urgency: 'High', stage: 3, desc: 'Green-brown discolouration across 400 m near Tuticorin jetty.' },
  { id: 'ORC-B1B4', region: 'mumbai', issue: 'Oil Spill', role: 'Port Authority Observer', urgency: 'High', stage: 3, desc: 'Sheen and tar balls at Sewri mudflats.' },
  { id: 'ORC-1AF0', region: 'odisha', issue: 'Fish Mortality', role: 'Fisherfolk Rep', urgency: 'High', stage: 4, desc: 'Dead fish washing ashore near Chilika mouth.' },
  { id: 'ORC-664C', region: 'goa', issue: 'Illegal Fishing', role: 'Coastal Volunteer', urgency: 'Medium', stage: 2, desc: 'Trawler with AIS off operating inside 5 nm zone.' },
  { id: 'ORC-6E16', region: 'vizag', issue: 'Beach Erosion', role: 'Community Scout', urgency: 'Medium', stage: 1, desc: 'Retaining wall collapse at RK beach.' },
  { id: 'ORC-1A7E', region: 'chennai', issue: 'Injured Marine Animal', role: 'NGO Field Officer', urgency: 'Medium', stage: 5, desc: 'Olive ridley turtle entangled in ghost net.' },
  { id: 'ORC-7E27', region: 'kutch', issue: 'Plastic Waste', role: 'Community Scout', urgency: 'Low', stage: 2, desc: 'Plastic accumulation at mangrove fringe.' },
]

export const AGENTS = [
  { id: 'sentinel', name: 'Sentinel', role: 'Threat Detection', desc: 'Watches AIS, RF and network telemetry for spoofing, jamming and intrusion signatures.', color: '#f43f5e', tasks: 1284 },
  { id: 'oceanus', name: 'Oceanus', role: 'Sensor Fusion', desc: 'Fuses satellite SST, chlorophyll, SAR and buoy data into one ocean state.', color: '#22d3ee', tasks: 3412 },
  { id: 'validator', name: 'Validator', role: 'Integrity Verifier', desc: 'Checks signatures, hash chains and cross-sensor consistency before data is trusted.', color: '#34d399', tasks: 2210 },
  { id: 'forecaster', name: 'Forecaster', role: 'Predictive Models', desc: 'Runs 30-day wave, surge and bleaching risk models.', color: '#a855f7', tasks: 640 },
  { id: 'responder', name: 'Responder', role: 'Action Planner', desc: 'Turns risks into playbooks: advisories, dispatches and quarantines.', color: '#f59e0b', tasks: 412 },
  { id: 'auditor', name: 'Auditor', role: 'Compliance & Logs', desc: 'Signs every decision into an immutable, time-stamped audit trail.', color: '#6366f1', tasks: 5120 },
]

export function regionById(id) {
  return REGIONS.find((r) => r.id === id) || REGIONS[0]
}

export function series(n, base, spread, seed) {
  const r = rng(seed)
  let v = base
  return Array.from({ length: n }, (_, i) => {
    v = Math.max(0, v + (r() - 0.5) * spread)
    return { i, v: Math.round(v) }
  })
}

export async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}
