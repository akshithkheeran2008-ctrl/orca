import { MapContainer, TileLayer, Marker, Tooltip, Polyline, CircleMarker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { REGIONS, STATUS } from '../data'

function icon(color, selected) {
  const s = selected ? 18 : 12
  return L.divIcon({
    className: '',
    iconSize: [s, s],
    iconAnchor: [s / 2, s / 2],
    html: `<div class="orca-marker" style="width:${s}px;height:${s}px"><span class="ring" style="background:${color}55"></span><span class="dot" style="background:${color};box-shadow:0 0 12px ${color}${selected ? ';outline:2px solid #fff;outline-offset:2px' : ''}"></span></div>`,
  })
}

function FlyTo({ target, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (target) map.flyTo(target, zoom ?? map.getZoom(), { duration: 0.8 })
  }, [target, zoom, map])
  return null
}

export default function CoastMap({ selected, onSelect, height = 420, center = [15.5, 80.5], zoom = 5, regions = REGIONS, fly = false, flyZoom, children, labels = true }) {
  const sel = regions.find((r) => r.id === selected)
  return (
    <div className="orca-map relative overflow-hidden rounded-lg" style={{ height }}>
      <MapContainer center={center} zoom={zoom} minZoom={3} scrollWheelZoom zoomControl attributionControl className="h-full w-full">
        <TileLayer attribution="Imagery &copy; Esri" url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        {labels && <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" opacity={0.75} />}
        {regions.map((r) => (
          <Marker key={r.id} position={[r.lat, r.lng]} icon={icon(STATUS[r.status].color, r.id === selected)} eventHandlers={{ click: () => onSelect?.(r.id) }}>
            <Tooltip className="orca-tip" direction="top" offset={[0, -8]}>
              <div className="font-semibold">{r.name}</div>
              <div className="text-[10px] text-slate-400">{r.node} · {r.sst}°C · {r.wave} m</div>
            </Tooltip>
          </Marker>
        ))}
        {fly && sel && <FlyTo target={[sel.lat, sel.lng]} zoom={flyZoom} />}
        {children}
      </MapContainer>
      <div className="scanline z-[400]" />
      <div className="pointer-events-none absolute inset-0 z-[401] rounded-lg ring-1 ring-inset ring-cyan-400/20" />
    </div>
  )
}

export { Polyline, CircleMarker, Tooltip }
