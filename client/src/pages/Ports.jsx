import React from 'react';
import { Anchor, Cpu, ArrowRight, CheckCircle2, AlertTriangle, Ship, Info } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Helper to create colored dot icons for Leaflet
const createDotIcon = (colorHex) => {
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <circle cx="12" cy="12" r="8" fill="${colorHex}" stroke="#ffffff" stroke-width="2" />
    </svg>
  `);
  return new L.Icon({
    iconUrl: `data:image/svg+xml;charset=utf-8,${svg}`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

export default function Ports() {
  const [portsData, setPortsData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/ports')
      .then(res => res.json())
      .then(data => {
        if (data) setPortsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch ports', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{padding: '2rem', color: '#64748b'}}>Loading port data...</div>;
  return (
    <div className="main-content">
      <div className="topbar">
        <h2 style={{margin: 0, fontSize: '1.25rem'}}>Port & Route Optimization</h2>
      </div>

      <div className="dashboard-content" style={{paddingBottom: '2rem'}}>
        
        {/* Top KPI Cards */}
        <div className="grid-4" style={{marginBottom: '1.5rem'}}>
          <div className="card">
            <div className="card-title">⚓ Ports Monitored</div>
            <div className="kpi-value">4</div>
            <div className="trend-neutral" style={{color: 'var(--text-muted)'}}>East Coast India</div>
          </div>
          <div className="card">
            <div className="card-title">🚢 Operational</div>
            <div className="kpi-value">3</div>
            <div className="trend-down" style={{color: '#f59e0b'}}>1 Under Maintenance</div>
          </div>
          <div className="card">
            <div className="card-title">⚠️ Avg. Wait Time</div>
            <div className="kpi-value">1.8 <span style={{fontSize: '1rem'}}>Days</span></div>
            <div className="trend-down" style={{color: '#ef4444'}}>+0.4 Days vs Last Wk</div>
          </div>
          <div className="card">
            <div className="card-title">💰 Avg. Handling Cost</div>
            <div className="kpi-value">$3.96<span style={{fontSize: '1rem'}}>/MT</span></div>
            <div className="trend-up" style={{color: '#10b981'}}>Stable</div>
          </div>
        </div>

        {/* AI Route Recommendation Panel */}
        <div className="card" style={{marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
                <span style={{background: 'var(--success)', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem'}}><Cpu size={14}/> AI ROUTE RECOMMENDATION</span>
                <span style={{fontSize: '0.875rem', color: 'var(--success)', fontWeight: 600}}>AI Route Score: 92%</span>
              </div>
              <h2 style={{margin: '0 0 0.25rem 0', color: '#fff'}}>Recommended Port: Paradip Port</h2>
              <div style={{color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.75rem'}}>Best current option based on congestion, waiting time, handling cost and operational status.</div>
              
              <div style={{display: 'flex', gap: '1.5rem', fontSize: '0.875rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><CheckCircle2 size={16} color="var(--success)"/> <span style={{color: '#fff'}}>Low congestion</span></div>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><CheckCircle2 size={16} color="var(--success)"/> <span style={{color: '#fff'}}>&lt; 1 day waiting</span></div>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><CheckCircle2 size={16} color="var(--success)"/> <span style={{color: '#fff'}}>$3.50/MT handling cost</span></div>
              </div>
            </div>
            <button className="premium-btn" style={{padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              View Recommended Route <ArrowRight size={16}/>
            </button>
          </div>
        </div>

        {/* Map & Table Row */}
        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          
          {/* Live Indian Coastline Map */}
          <div className="card" style={{flex: '1', padding: 0, overflow: 'hidden', height: '400px', display: 'flex', flexDirection: 'column'}}>
            <div className="card-title" style={{padding: '1rem', margin: 0, background: 'var(--surface)', borderBottom: '1px solid var(--border-light)'}}>Live Status Map (East Coast India)</div>
            <div style={{flex: 1}}>
              <MapContainer center={[16.5, 84]} zoom={5} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}" />
                {portsData.map(port => (
                  <Marker key={port.port} position={port.coords} icon={createDotIcon(port.fill)}>
                    <Tooltip permanent direction="right" offset={[10, 0]} className="custom-tooltip">
                      <div style={{fontWeight: 'bold', color: '#333'}}>{port.port}</div>
                    </Tooltip>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Advanced Port Table */}
          <div className="card" style={{flex: '1.5', height: '400px', overflowY: 'auto'}}>
            <div className="card-title" style={{color: 'var(--text)', fontWeight: 600, marginBottom: '1rem'}}>Port Conditions & Risk Analysis</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{padding: '0.75rem 0.5rem'}}>Port</th>
                  <th style={{padding: '0.75rem 0.5rem'}}>Congestion</th>
                  <th style={{padding: '0.75rem 0.5rem'}}>Wait</th>
                  <th style={{padding: '0.75rem 0.5rem'}}>Handling</th>
                  <th style={{padding: '0.75rem 0.5rem'}}>Status</th>
                  <th style={{padding: '0.75rem 0.5rem'}}>Route Risk</th>
                  <th style={{padding: '0.75rem 0.5rem'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {portsData.map((port, idx) => (
                  <tr key={idx} style={{background: port.port === 'Paradip' ? 'rgba(16, 185, 129, 0.05)' : 'transparent'}}>
                    <td style={{fontWeight: 600, color: '#fff'}}>{port.port}</td>
                    <td><span style={{display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600}}>{port.color} {port.congestion}</span></td>
                    <td style={{fontWeight: 500}}>{port.wait}</td>
                    <td>{port.cost}</td>
                    <td style={{color: port.status === 'Operational' ? 'var(--success)' : 'var(--warning)', fontWeight: 500}}>
                      {port.status}
                    </td>
                    <td>
                      <span style={{
                        background: port.risk === 'High' ? 'rgba(239, 68, 68, 0.2)' : port.risk === 'Medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: port.risk === 'High' ? '#ef4444' : port.risk === 'Medium' ? '#f59e0b' : '#10b981',
                        padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600
                      }}>
                        {port.risk}
                      </span>
                    </td>
                    <td>
                      {port.port === 'Paradip' ? (
                        <button className="premium-btn" style={{padding: '0.25rem 0.75rem', fontSize: '0.75rem', background: 'var(--success)'}}>Recommended</button>
                      ) : (
                        <button className="premium-btn" style={{padding: '0.25rem 0.75rem', fontSize: '0.75rem', background: 'transparent', border: '1px solid var(--border-light)'}}>View</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Bottom Grid: Forecasting & Route Comparison */}
        <div className="grid-2">
          
          {/* Congestion Forecasting Chart */}
          <div className="card">
            <div className="card-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)', fontWeight: 600, marginBottom: '1.5rem'}}>
              <Cpu size={18} color="var(--primary)"/> Port Congestion Forecast — Next 7 Days
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
              {portsData.map((port, idx) => (
                <div key={idx} style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <div style={{width: '100px', fontWeight: 500, fontSize: '0.875rem', color: '#fff'}}>{port.port}</div>
                  
                  <div style={{flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    {/* Current Bar */}
                    <div style={{width: '100px', background: 'rgba(255,255,255,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden'}}>
                      <div style={{width: `${port.curWidth}%`, height: '100%', background: port.fill, opacity: 0.6}}></div>
                    </div>
                    <ArrowRight size={14} color="var(--text-muted)"/>
                    {/* Forecast Bar */}
                    <div style={{width: '100px', background: 'rgba(255,255,255,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden'}}>
                      <div style={{width: `${port.foreWidth}%`, height: '100%', background: port.fill}}></div>
                    </div>
                  </div>
                  
                  <div style={{width: '80px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', color: port.fill}}>
                    {port.trend}
                  </div>
                </div>
              ))}
            </div>
            <div style={{marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center'}}>
              AI models predict severe congestion buildup at Chennai. Rerouting cargo to Paradip is strongly advised.
            </div>
          </div>

          {/* Route-Level Comparison */}
          <div className="card">
            <div className="card-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)', fontWeight: 600, marginBottom: '1.5rem'}}>
              <Ship size={18} color="var(--primary)"/> Route-Level Comparison
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              
              {/* Paradip (Recommended) */}
              <div style={{background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: '8px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                  <div style={{fontWeight: 700, color: '#fff', fontSize: '1rem'}}>Australia → Paradip <span style={{fontSize: '0.65rem', background: 'var(--success)', color: '#fff', padding: '0.15rem 0.4rem', borderRadius: '4px', marginLeft: '0.5rem', verticalAlign: 'middle', textTransform: 'uppercase'}}>Best Route</span></div>
                  <div style={{fontWeight: 700, color: '#4ade80', fontSize: '1.1rem'}}>$31.80/MT</div>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-muted)'}}>
                  <span><strong style={{color: '#ccc'}}>ETA:</strong> 18.4 Days</span>
                  <span><strong style={{color: '#ccc'}}>Distance:</strong> 6,850 NM</span>
                  <span><strong style={{color: '#ccc'}}>Wait:</strong> &lt;1 Day</span>
                  <span><strong style={{color: '#ccc'}}>Handling:</strong> $3.50/MT</span>
                </div>
              </div>

              {/* Visakhapatnam */}
              <div style={{background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', padding: '1rem', borderRadius: '8px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                  <div style={{fontWeight: 600, color: '#ccc'}}>Australia → Visakhapatnam</div>
                  <div style={{fontWeight: 600, color: '#ccc'}}>$34.20/MT</div>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-muted)'}}>
                  <span><strong style={{color: '#999'}}>ETA:</strong> 19.1 Days</span>
                  <span><strong style={{color: '#999'}}>Distance:</strong> 6,550 NM</span>
                  <span><strong style={{color: '#999'}}>Wait:</strong> 1-2 Days</span>
                  <span><strong style={{color: '#999'}}>Handling:</strong> $3.80/MT</span>
                </div>
              </div>

              {/* Chennai */}
              <div style={{background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', padding: '1rem', borderRadius: '8px', opacity: 0.7}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                  <div style={{fontWeight: 600, color: '#999'}}>Australia → Chennai</div>
                  <div style={{fontWeight: 600, color: '#ef4444'}}>$39.50/MT</div>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-muted)'}}>
                  <span><strong style={{color: '#777'}}>ETA:</strong> 21.0 Days</span>
                  <span><strong style={{color: '#777'}}>Distance:</strong> 6,320 NM</span>
                  <span><strong style={{color: '#777'}}>Wait:</strong> 3-4 Days</span>
                  <span><strong style={{color: '#777'}}>Handling:</strong> $4.50/MT</span>
                </div>
              </div>

            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
