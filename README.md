# ORCA — Ocean Reconnaissance & Cyber-secured Analytics

A cyber-secured coastal command platform: maritime situational awareness, threat detection, fleet advisories and explainable multi-agent AI in a SOC-style dashboard.

> Demo build with simulated data — not for real navigation. Follow official INCOIS / IMD / Indian Coast Guard bulletins.

## Modules
- **Command Center** – KPIs, live coastal map, regional dashboard, priority alerts, threat actors
- **Coastal Threat Map** – AIS traffic, spoofed/ghost vessels, GNSS jamming zones, shipping lanes, SST anomalies
- **Alert Center** – filterable alerts with dispatch / isolate / investigate actions
- **Cyber Defense** – attack mix, IDS stream, edge-node integrity matrix, MITRE ATT&CK for ICS
- **Fleet & Fisherman** – Safe / Caution / Do-Not-Sail advisories, fishing zones, route preview
- **Secure Reports** – SHA-256 hash-chained citizen report ledger with tamper detection
- **ORCA AI Agents** – six-agent orchestration with an explainable terminal
- **Forecast**, **USV Mission Control**, **Audit Trail** (CSV export)

## Stack
React 19 · Vite · Tailwind CSS · Recharts · Leaflet · Lucide

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```
