import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// ── CONSTANTS ──────────────────────────────────────────────────────────────────

const VESSEL_NAMES = [
  'MV Oceanic Horizon', 'MV Nordic Spirit', 'MV Baltic Trader',
  'MV Pacific Carrier', 'MV Indian Star', 'MV Atlantic Pioneer',
  'MV Cape Glory', 'MV Suez Express', 'MV Singapore Maru',
  'MV Rotterdam Bridge', 'MV Panama Pacific', 'MV Coral Arrow',
  'MV Santos Crown', 'MV Iron Hawk', 'MV Dubai Spirit',
];

const CARGO_TYPES = ['Coal', 'Iron Ore', 'Containers', 'Crude Oil', 'LNG', 'Grain', 'Fertilizers'];
const VESSEL_TYPES = ['Capesize', 'Panamax', 'Supramax', 'VLCC', 'Container Ship', 'Handymax'];

const CARGO_VESSEL_MAP = {
  R1: { cargo: 'Coal', type: 'Capesize' },
  R2: { cargo: 'Iron Ore', type: 'Supramax' },
  R3: { cargo: 'Coal', type: 'Capesize' },
  R4: { cargo: 'Iron Ore', type: 'Capesize' },
  R5: { cargo: 'Crude Oil', type: 'VLCC' },
  R6: { cargo: 'Grain', type: 'Panamax' },
  R7: { cargo: 'Containers', type: 'Container Ship' },
  R8: { cargo: 'Containers', type: 'Panamax' },
  R9: { cargo: 'Containers', type: 'Container Ship' },
  R10: { cargo: 'Containers', type: 'Container Ship' },
  R11: { cargo: 'Containers', type: 'Container Ship' },
  R12: { cargo: 'Containers', type: 'Container Ship' },
  R13: { cargo: 'Grain', type: 'Panamax' },
  R14: { cargo: 'Iron Ore', type: 'Capesize' },
  R15: { cargo: 'LNG', type: 'Container Ship' },
};

const PORTS = {
  Chennai: { coords: [13.0827, 80.2707], country: 'India', congestion: 'High', wait: '3–4 days', freight: '$34.20/MT' },
  Vizag: { coords: [17.6868, 83.2185], country: 'India', congestion: 'Medium', wait: '1–2 days', freight: '$28.50/MT' },
  Paradip: { coords: [20.2666, 86.6738], country: 'India', congestion: 'Low', wait: '<1 day', freight: '$26.10/MT' },
  Ennore: { coords: [13.2500, 80.3333], country: 'India', congestion: 'Medium', wait: '2 days', freight: '$33.80/MT' },
  Mumbai: { coords: [18.9438, 72.8359], country: 'India', congestion: 'Low', wait: '1 day', freight: '$24.50/MT' },
  Kandla: { coords: [23.0333, 70.2167], country: 'India', congestion: 'Low', wait: '1 day', freight: '$22.10/MT' },
  Shanghai: { coords: [31.2304, 121.4737], country: 'China', congestion: 'High', wait: '2–3 days', freight: '$18.90/MT' },
  Singapore: { coords: [1.3521, 103.8198], country: 'Singapore', congestion: 'Medium', wait: '1 day', freight: '$15.20/MT' },
  Rotterdam: { coords: [51.9225, 4.4791], country: 'Netherlands', congestion: 'Medium', wait: '2 days', freight: '$22.50/MT' },
  'New York': { coords: [40.7128, -74.0060], country: 'USA', congestion: 'High', wait: '3 days', freight: '$25.80/MT' },
  'Los Angeles': { coords: [33.7288, -118.2620], country: 'USA', congestion: 'High', wait: '2–4 days', freight: '$24.10/MT' },
  'Richards Bay': { coords: [-28.7807, 32.0383], country: 'South Africa', congestion: 'Low', wait: '1 day', freight: '$19.50/MT' },
  Santos: { coords: [-23.9618, -46.3322], country: 'Brazil', congestion: 'Medium', wait: '2–3 days', freight: '$21.80/MT' },
  Newcastle: { coords: [-32.9283, 151.7817], country: 'Australia', congestion: 'Low', wait: '1 day', freight: '$18.20/MT' },
  'Port Hedland': { coords: [-20.3100, 118.5760], country: 'Australia', congestion: 'Low', wait: '<1 day', freight: '$16.80/MT' },
  Samarinda: { coords: [-0.5022, 117.1536], country: 'Indonesia', congestion: 'Low', wait: '1 day', freight: '$17.50/MT' },
  'Ras Tanura': { coords: [26.6430, 50.1587], country: 'Saudi Arabia', congestion: 'Medium', wait: '2 days', freight: '$12.80/MT' },
  'Jebel Ali': { coords: [24.9857, 55.0273], country: 'UAE', congestion: 'Medium', wait: '1–2 days', freight: '$14.20/MT' },
  Vitoria: { coords: [-20.3194, -40.3378], country: 'Brazil', congestion: 'Low', wait: '1 day', freight: '$18.90/MT' },
  'New Orleans': { coords: [29.9511, -90.0715], country: 'USA', congestion: 'Low', wait: '1–2 days', freight: '$20.50/MT' },
  'Panama Canal': { coords: [9.1438, -79.7248], country: 'Panama', congestion: 'High', wait: '1–3 days', freight: 'Transit' },
  Suez: { coords: [30.0832, 32.5498], country: 'Egypt', congestion: 'Medium', wait: '1–2 days', freight: 'Transit' },
};

const CONGESTION_COLOR = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
const SIZE_OPTIONS = { Small: [32, 44], Medium: [48, 66], Large: [64, 88] };

// ── HELPERS ────────────────────────────────────────────────────────────────────

/** Interpolate position along a waypoint array. progress: 0→1 */
const getPositionAtProgress = (wps, progress) => {
  if (!wps || wps.length < 2) return wps?.[0] ?? [0, 0];
  const p = Math.min(Math.max(progress, 0), 0.9999);
  const total = wps.length - 1;
  const pos = p * total;
  const idx = Math.min(Math.floor(pos), total - 1);
  const t = pos - idx;
  return [
    wps[idx][0] + (wps[idx + 1][0] - wps[idx][0]) * t,
    wps[idx][1] + (wps[idx + 1][1] - wps[idx][1]) * t,
  ];
};

/** Compute compass bearing from start → end */
const calcBearing = ([lat1, lon1], [lat2, lon2]) => {
  const r = Math.PI / 180;
  const dLon = (lon2 - lon1) * r;
  const y = Math.sin(dLon) * Math.cos(lat2 * r);
  const x = Math.cos(lat1 * r) * Math.sin(lat2 * r) - Math.sin(lat1 * r) * Math.cos(lat2 * r) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
};

/** Bearing of the current segment at the given progress */
const bearingAtProgress = (wps, progress) => {
  if (!wps || wps.length < 2) return 0;
  const total = wps.length - 1;
  const idx = Math.min(Math.floor(Math.min(progress, 0.9999) * total), total - 1);
  return calcBearing(wps[idx], wps[idx + 1]);
};

/** Top-down ship icon (faces right when bearing=90°) */
const createShipIcon = (bearing, color, size) => {
  const [w, h] = SIZE_OPTIONS[size] || SIZE_OPTIONS.Small;
  const glow = `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 3px rgba(0,0,0,0.9))`;
  return L.divIcon({
    html: `<div style="
        transform:rotate(${bearing - 90}deg);
        transform-origin:center;
        width:${w}px;height:${h}px;
        filter:${glow};
      ">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="${w}" height="${h}" style="overflow:visible;">
        <!-- Glowing Wake -->
        <circle cx="-5" cy="20" r="10" fill="${color}" opacity="0.4" />
        <circle cx="-15" cy="20" r="6" fill="${color}" opacity="0.2" />
        
        <!-- Hull -->
        <path d="M 85 20 C 70 5 15 5 5 12 L 5 28 C 15 35 70 35 85 20 Z"
              fill="#1e293b" stroke="${color}" stroke-width="2"/>
        
        <!-- Cargo Containers -->
        <rect x="25" y="10" width="10" height="8" fill="#ef4444" stroke="#000" stroke-width="1"/>
        <rect x="35" y="10" width="10" height="8" fill="#3b82f6" stroke="#000" stroke-width="1"/>
        <rect x="45" y="10" width="10" height="8" fill="#eab308" stroke="#000" stroke-width="1"/>
        
        <rect x="25" y="22" width="10" height="8" fill="#22c55e" stroke="#000" stroke-width="1"/>
        <rect x="35" y="22" width="10" height="8" fill="#f97316" stroke="#000" stroke-width="1"/>
        <rect x="45" y="22" width="10" height="8" fill="#8b5cf6" stroke="#000" stroke-width="1"/>

        <!-- Bridge / Superstructure -->
        <rect x="10" y="12" width="12" height="16" rx="2" fill="#cbd5e1" stroke="#000" stroke-width="1"/>
        <rect x="14" y="14" width="4" height="12" fill="#475569"/>
        
      </svg>
    </div>`,
    iconSize: [w, h],
    iconAnchor: [w / 2, h / 2],
    popupAnchor: [0, -(h / 2) - 4],
    className: '',
  });
};

/** Colored dot icon for ports */
const createPortIcon = (congestion) => {
  const color = CONGESTION_COLOR[congestion] || '#60a5fa';
  return L.divIcon({
    html: `<div style="
        width:10px;height:10px;
        background:${color};
        border:2px solid rgba(255,255,255,0.8);
        border-radius:50%;
        box-shadow:0 0 8px ${color};
      "></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
    popupAnchor: [0, -9],
    className: '',
  });
};

// ── MAP CONTROLLER (fits bounds on route select) ───────────────────────────────

function MapController({ selectedRoute }) {
  const map = useMap();
  const prev = useRef(null);
  useEffect(() => {
    if (selectedRoute && selectedRoute.id !== prev.current) {
      prev.current = selectedRoute.id;
      const wps = selectedRoute.waypoints || selectedRoute.path;
      if (wps && wps.length > 0) {
        try {
          map.fitBounds(L.latLngBounds(wps), { padding: [60, 60], maxZoom: 8 });
        } catch (_) {}
      }
    } else if (!selectedRoute) {
      prev.current = null;
    }
  }, [selectedRoute, map]);
  return null;
}

// ── DETAIL PANEL ───────────────────────────────────────────────────────────────

function DetailRow({ label, value, highlight }) {
  return (
    <div>
      <div style={{ color: '#64748b', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      <div style={{ color: highlight ? '#34d399' : '#e2e8f0', fontWeight: 600, fontSize: '0.82rem', marginTop: '1px' }}>{value}</div>
    </div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────

export default function OceanMap() {
  const [routes, setRoutes] = useState([]);
  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [selectedPort, setSelectedPort] = useState(null);

  const [activeSize, setActiveSize] = useState('Small');
  const [showFilters, setShowFilters] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [filterCargo, setFilterCargo] = useState(new Set(CARGO_TYPES));
  const [filterVesselType, setFilterVesselType] = useState(new Set(VESSEL_TYPES));

  const routesRef = useRef([]);
  useEffect(() => { routesRef.current = routes; }, [routes]);

  // ── CSS Injection for animated route lines ────────────────────────────────
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes dashFlow {
        from { stroke-dashoffset: 24; }
        to { stroke-dashoffset: 0; }
      }
      .animated-route-line {
        animation: dashFlow 1.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // ── Fetch routes & init vessels ─────────────────────────────────────────────
  useEffect(() => {
    fetch('http://localhost:5000/api/routes')
      .then(r => r.json())
      .then(data => {
        setRoutes(data);
        const vList = data.map((route, i) => {
          const cv = CARGO_VESSEL_MAP[route.id] || { cargo: CARGO_TYPES[i % CARGO_TYPES.length], type: VESSEL_TYPES[i % VESSEL_TYPES.length] };
          return {
            id: `V${i + 1}`,
            name: VESSEL_NAMES[i % VESSEL_NAMES.length],
            routeId: route.id,
            progress: Math.random(),
            speed: 0.0025 + Math.random() * 0.0025,
            cargo: cv.cargo,
            vesselType: cv.type,
            mmsi: `477${Math.floor(1000000 + Math.random() * 9000000)}`,
            imo: `9${Math.floor(100000 + Math.random() * 900000)}`,
            speedKnots: +(10 + Math.random() * 6).toFixed(1),
            bearing: 0,
            status: 'Underway',
          };
        });
        setVessels(vList);
        setLoading(false);
      })
      .catch(err => {
        console.error('Routes fetch failed:', err);
        setError('Could not connect to server. Ensure the backend is running.');
        setLoading(false);
      });
  }, []);

  // ── Animation loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setVessels(prev => prev.map(v => {
        const route = routesRef.current.find(r => r.id === v.routeId);
        if (!route) return v;
        const wps = route.waypoints || route.path;
        if (!wps || wps.length < 2) return v;
        let np = v.progress + v.speed;
        if (np >= 1) np -= 1;
        return { ...v, progress: np, bearing: bearingAtProgress(wps, np) };
      }));
      setLastUpdated(new Date());
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const closePanel = () => { setSelectedRoute(null); setSelectedVessel(null); setSelectedPort(null); };

  const filteredVessels = vessels.filter(v =>
    filterCargo.has(v.cargo) && filterVesselType.has(v.vesselType)
  );

  const panelOpen = !!(selectedRoute || selectedVessel || selectedPort);

  const toggleFilter = (set, setFn, key) => {
    setFn(prev => {
      const s = new Set(prev);
      s.has(key) ? s.delete(key) : s.add(key);
      return s;
    });
  };

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="main-content">
      {/* Top Bar */}
      <div className="topbar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>🌊 Global Ocean Routes — Live Map</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Real maritime sea corridors · {routes.length} routes · {filteredVessels.length} vessels tracked
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
            color: '#f87171', borderRadius: '5px', padding: '0.3rem 0.8rem',
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.3px',
          }}>
            ⚠ AIS: Simulated
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="dashboard-content" style={{ flex: 1, paddingBottom: 0 }}>
        <div className="card" style={{ height: 'calc(100vh - 125px)', padding: 0, overflow: 'hidden', position: 'relative' }}>

          {/* ── Filter Toggle ─────────────────────────────────────────── */}
          <button onClick={() => setShowFilters(f => !f)} style={{
            position: 'absolute', top: '1rem', left: '1rem', zIndex: 1000,
            background: showFilters ? 'var(--primary)' : 'rgba(10,18,30,0.92)',
            border: `1px solid ${showFilters ? 'var(--primary)' : 'var(--border-light)'}`,
            color: '#fff', padding: '0.45rem 1rem', borderRadius: '6px',
            cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}>
            ⚙ Filters
          </button>

          {/* ── Filter Panel ───────────────────────────────────────────── */}
          {showFilters && (
            <div style={{
              position: 'absolute', top: '3.6rem', left: '1rem', zIndex: 1000,
              background: 'rgba(8,14,24,0.97)', padding: '1.1rem',
              borderRadius: '10px', border: '1px solid var(--border-light)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.8)',
              width: '210px', maxHeight: 'calc(100% - 160px)', overflowY: 'auto',
            }}>
              {/* Vessel Size */}
              <div style={{ marginBottom: '1.1rem' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                  Vessel Icon Size
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {Object.keys(SIZE_OPTIONS).map(s => (
                    <button key={s} onClick={() => setActiveSize(s)} style={{
                      background: activeSize === s ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                      border: 'none', color: '#fff', padding: '0.3rem 0.6rem',
                      borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer',
                      fontWeight: activeSize === s ? 700 : 400,
                    }}>{s}</button>
                  ))}
                </div>
              </div>

              {/* Cargo Type */}
              <div style={{ marginBottom: '1.1rem' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                  Cargo Type
                </div>
                {CARGO_TYPES.map(c => (
                  <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.35rem', fontSize: '0.78rem', color: '#cbd5e1' }}>
                    <input type="checkbox" checked={filterCargo.has(c)} onChange={() => toggleFilter(filterCargo, setFilterCargo, c)} style={{ accentColor: 'var(--primary)' }} />
                    {c}
                  </label>
                ))}
              </div>

              {/* Vessel Type */}
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                  Vessel Type
                </div>
                {VESSEL_TYPES.map(t => (
                  <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.35rem', fontSize: '0.78rem', color: '#cbd5e1' }}>
                    <input type="checkbox" checked={filterVesselType.has(t)} onChange={() => toggleFilter(filterVesselType, setFilterVesselType, t)} style={{ accentColor: 'var(--primary)' }} />
                    {t}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ── Detail Panel (Route / Vessel / Port) ─────────────────── */}
          {panelOpen && (
            <div style={{
              position: 'absolute', top: '1rem', right: '1rem', zIndex: 1000,
              background: 'rgba(8,14,24,0.97)', padding: '1.25rem',
              borderRadius: '12px', border: '1px solid var(--border-light)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.85)',
              width: '290px', maxHeight: 'calc(100% - 100px)', overflowY: 'auto',
            }}>
              <button onClick={closePanel} style={{
                position: 'absolute', top: '0.8rem', right: '0.8rem',
                background: 'none', border: 'none', color: '#64748b',
                cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1,
              }}>✕</button>

              {/* Vessel Panel */}
              {selectedVessel && (() => {
                const route = routes.find(r => r.id === selectedVessel.routeId);
                const wps = route?.waypoints || route?.path || [];
                const pos = getPositionAtProgress(wps, selectedVessel.progress);
                return (
                  <div>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, letterSpacing: '1px', marginBottom: '4px' }}>
                      Vessel Details
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', paddingRight: '1.5rem' }}>
                      {selectedVessel.name}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem', marginBottom: '1rem' }}>
                      <DetailRow label="MMSI" value={selectedVessel.mmsi} />
                      <DetailRow label="IMO" value={selectedVessel.imo} />
                      <DetailRow label="Vessel Type" value={selectedVessel.vesselType} />
                      <DetailRow label="Speed" value={`${selectedVessel.speedKnots} kts`} highlight />
                      <DetailRow label="Cargo" value={selectedVessel.cargo} />
                      <DetailRow label="Bearing" value={`${Math.round(selectedVessel.bearing)}°`} />
                      <DetailRow label="Status" value={selectedVessel.status} highlight />
                      <DetailRow label="ETA" value={`${route?.etaDays ?? '?'} days`} />
                    </div>
                    {route && (
                      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginBottom: '0.75rem' }}>
                        <DetailRow label="Route" value={route.name} />
                        <div style={{ marginTop: '0.5rem' }}>
                          <DetailRow label="Corridor" value={route.corridor || 'Open Ocean'} />
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>
                          <DetailRow label="Distance" value={`${route.distanceNm?.toLocaleString() ?? '—'} nm`} />
                        </div>
                      </div>
                    )}
                    <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.7rem', background: 'rgba(239,68,68,0.1)', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.25)', fontSize: '0.7rem', color: '#f87171' }}>
                      ⚠ Simulated Position — Live AIS requires API subscription
                    </div>
                  </div>
                );
              })()}

              {/* Route Panel */}
              {selectedRoute && !selectedVessel && (
                <div>
                  {selectedRoute.id === 'R8' && (
                    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.4rem 0.7rem', marginBottom: '0.8rem', fontSize: '0.7rem', color: '#e2e8f0', fontWeight: 600, textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                      ⭐ Featured Route — Suez Canal Corridor
                    </div>
                  )}
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, letterSpacing: '1px', marginBottom: '4px' }}>
                    Route Details
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', paddingRight: '1.5rem' }}>
                    {selectedRoute.name}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem', marginBottom: '1rem' }}>
                    <DetailRow label="Origin" value={selectedRoute.origin || '—'} />
                    <DetailRow label="Destination" value={selectedRoute.destination || '—'} />
                    <DetailRow label="Distance" value={`${selectedRoute.distanceNm?.toLocaleString() ?? '—'} nm`} highlight />
                    <DetailRow label="ETA" value={`${selectedRoute.etaDays ?? '—'} days`} highlight />
                    <DetailRow label="Corridor" value={selectedRoute.corridor || 'Open Ocean'} />
                    <DetailRow label="Vessel Type" value={selectedRoute.vesselType || 'Bulk Carrier'} />
                    <DetailRow label="Active Vessels" value={vessels.filter(v => v.routeId === selectedRoute.id).length} />
                    <DetailRow label="Status" value="Active" highlight />
                  </div>
                  {/* Waypoint path description */}
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Waypoints</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.6 }}>
                      {(selectedRoute.waypoints || selectedRoute.path || []).length} coordinate points along navigable sea lanes
                    </div>
                  </div>
                </div>
              )}

              {/* Port Panel */}
              {selectedPort && !selectedVessel && !selectedRoute && (
                <div>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, letterSpacing: '1px', marginBottom: '4px' }}>
                    Port Information
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem', paddingRight: '1.5rem' }}>
                    ⚓ {selectedPort.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>{selectedPort.country}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
                    <DetailRow label="Congestion" value={selectedPort.congestion} />
                    <DetailRow label="Waiting Time" value={selectedPort.wait} />
                    <DetailRow label="Freight Rate" value={selectedPort.freight} highlight />
                    <DetailRow label="Status" value="Operational" highlight />
                    <DetailRow label="Lat" value={selectedPort.coords[0].toFixed(4)} />
                    <DetailRow label="Lng" value={selectedPort.coords[1].toFixed(4)} />
                  </div>
                  <div style={{ marginTop: '0.75rem', borderRadius: '6px', overflow: 'hidden', height: '6px', background: 'rgba(255,255,255,0.08)' }}>
                    <div style={{
                      height: '100%',
                      width: selectedPort.congestion === 'High' ? '80%' : selectedPort.congestion === 'Medium' ? '50%' : '25%',
                      background: CONGESTION_COLOR[selectedPort.congestion],
                      transition: 'width 0.4s',
                    }} />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: CONGESTION_COLOR[selectedPort.congestion], marginTop: '4px', fontWeight: 600 }}>
                    {selectedPort.congestion} Congestion
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Legend ─────────────────────────────────────────────────── */}
          <div style={{
            position: 'absolute', bottom: '2.8rem', right: '1rem', zIndex: 1000,
            background: 'rgba(8,14,24,0.92)', padding: '0.75rem 1rem',
            borderRadius: '8px', border: '1px solid var(--border-light)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
          }}>
            <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '0.5rem', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Legend
            </div>
            {[
              { color: '#fff', label: 'Chennai → Rotterdam (Suez Canal)', dash: false },
              { color: '#10b981', label: 'Active shipping route', dash: true },
              { color: '#60a5fa', label: 'Vessel (animated)', dash: false },
              { color: '#ef4444', label: 'High congestion port', dot: true },
              { color: '#f59e0b', label: 'Medium congestion port', dot: true },
              { color: '#10b981', label: 'Low congestion port', dot: true },
            ].map(({ color, label, dash, dot }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', fontSize: '0.72rem', color: '#94a3b8' }}>
                {dot
                  ? <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, border: '1px solid rgba(255,255,255,0.5)', flexShrink: 0 }} />
                  : <div style={{ width: '22px', height: '2.5px', background: dash ? 'transparent' : color, borderTop: dash ? `2px dashed ${color}` : 'none', flexShrink: 0 }} />
                }
                {label}
              </div>
            ))}
          </div>

          {/* ── Status Bar ─────────────────────────────────────────────── */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000,
            background: 'rgba(5,10,18,0.97)', borderTop: '1px solid var(--border-light)',
            padding: '0.35rem 1rem', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', fontSize: '0.7rem',
          }}>
            <div style={{ display: 'flex', gap: '1.5rem', color: '#64748b' }}>
              <span>Routes: <b style={{ color: '#60a5fa' }}>{routes.length}</b></span>
              <span>Vessels: <b style={{ color: '#34d399' }}>{filteredVessels.length}</b></span>
              <span>Ports: <b style={{ color: '#f59e0b' }}>{Object.keys(PORTS).length}</b></span>
              {filteredVessels.length < vessels.length && (
                <span style={{ color: '#f59e0b' }}>{vessels.length - filteredVessels.length} filtered</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ color: '#ef4444', fontWeight: 600 }}>
                ⚠ AIS Data: Simulated — Real AIS requires API subscription
              </span>
              <span style={{ color: '#475569' }}>Updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>

          {/* ── Map ────────────────────────────────────────────────────── */}
          {error ? (
            <div style={{
              height: '100%', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: 'rgba(5,10,18,0.9)', color: '#f87171',
              fontSize: '0.9rem', gap: '0.5rem',
            }}>
              <span style={{ fontSize: '2rem' }}>⚠</span>
              <span>{error}</span>
            </div>
          ) : (
            <MapContainer
              center={[18, 40]}
              zoom={3}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
              attributionControl={false}
            >
              {/* High resolution colorful base map */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                subdomains="abcd"
                maxZoom={19}
              />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                subdomains="abcd"
                maxZoom={19}
              />

              <MapController selectedRoute={selectedRoute} />

              {/* Port Markers */}
              {Object.entries(PORTS).map(([name, info]) => (
                <Marker
                  key={name}
                  position={info.coords}
                  icon={createPortIcon(info.congestion)}
                  eventHandlers={{
                    click: (e) => {
                      e.originalEvent?.stopPropagation?.();
                      setSelectedVessel(null);
                      setSelectedRoute(null);
                      setSelectedPort({ name, ...info });
                    },
                  }}
                >
                  <Popup>
                    <div style={{ minWidth: '160px', fontFamily: 'monospace', fontSize: '12px' }}>
                      <b>⚓ {name}</b><br />
                      {info.country}<br />
                      Congestion: {info.congestion}<br />
                      Wait: {info.wait}<br />
                      Freight: {info.freight}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Route Polylines */}
              {routes.map(route => {
                const wps = route.waypoints || route.path;
                const isSel = selectedRoute?.id === route.id;
                const hasSel = !!selectedRoute;
                const isFeatured = route.id === 'R8';
                return (
                  <Polyline
                    key={route.id}
                    positions={wps}
                    pathOptions={{
                      className: 'animated-route-line',
                      color: isSel ? '#fff' : route.color,
                      weight: isSel ? 5 : isFeatured ? 3.5 : 2.5,
                      opacity: isSel ? 1 : hasSel ? 0.2 : isFeatured ? 0.9 : 0.65,
                      dashArray: isSel ? null : isFeatured ? null : '12, 12',
                    }}
                    eventHandlers={{
                      click: (e) => {
                        e.originalEvent?.stopPropagation?.();
                        setSelectedVessel(null);
                        setSelectedPort(null);
                        setSelectedRoute(isSel ? null : route);
                      },
                    }}
                  >
                    <Popup>
                      <div style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                        <b>{route.name}</b><br />
                        {route.corridor}<br />
                        Distance: {route.distanceNm?.toLocaleString()} nm<br />
                        ETA: ~{route.etaDays} days
                      </div>
                    </Popup>
                  </Polyline>
                );
              })}

              {/* Vessel Markers */}
              {filteredVessels.map(vessel => {
                const route = routes.find(r => r.id === vessel.routeId);
                if (!route) return null;
                const wps = route.waypoints || route.path;
                if (!wps || wps.length < 2) return null;
                const position = getPositionAtProgress(wps, vessel.progress);
                const icon = createShipIcon(vessel.bearing, route.color, activeSize);
                return (
                  <Marker
                    key={vessel.id}
                    position={position}
                    icon={icon}
                    eventHandlers={{
                      click: (e) => {
                        e.originalEvent?.stopPropagation?.();
                        setSelectedRoute(null);
                        setSelectedPort(null);
                        setSelectedVessel(vessel);
                      },
                    }}
                  >
                    <Popup>
                      <div style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                        <b>{vessel.name}</b><br />
                        MMSI: {vessel.mmsi}<br />
                        {vessel.vesselType} · {vessel.cargo}<br />
                        Speed: {vessel.speedKnots} kts<br />
                        Route: {route.name}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          )}

          {/* Loading overlay */}
          {loading && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 2000,
              background: 'rgba(5,10,18,0.88)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '1rem',
            }}>
              <div className="loading-spinner" />
              <span style={{ color: '#60a5fa', fontSize: '0.95rem' }}>Loading maritime data...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
