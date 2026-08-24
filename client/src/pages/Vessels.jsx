import React, { useState } from 'react';
import { Ship, Filter, Cpu, CheckCircle2, ArrowRight, ArrowDownRight, ArrowUpRight, Check, X, MapPin, TrendingUp } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Ship Icon for Mini Map
const shipSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18" width="100%" height="100%">
  <path d="M 2 12 L 22 12 L 20 15 L 4 15 Z" fill="#1e3a8a"/>
  <path d="M 4 15 L 20 15 L 18 17 L 6 17 Z" fill="#ef4444"/>
  <rect x="3" y="7" width="5" height="5" fill="#f8fafc"/>
  <rect x="4" y="5" width="2" height="2" fill="#334155"/>
  <rect x="9" y="8" width="4" height="4" fill="#f59e0b"/>
  <rect x="13" y="8" width="4" height="4" fill="#3b82f6"/>
  <rect x="17" y="8" width="4" height="4" fill="#ef4444"/>
</svg>
`);

const shipIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;charset=utf-8,${shipSvg}`,
  iconSize: [24, 18],
  iconAnchor: [12, 9]
});

export default function Vessels() {
  const [vesselsData, setVesselsData] = React.useState([]);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [loading, setLoading] = React.useState(true);
  const [charteredVessels, setCharteredVessels] = useState(new Set());

  const handleCharterVessel = (vesselId) => {
    setCharteredVessels(prev => {
      const next = new Set(prev);
      next.add(vesselId);
      return next;
    });
    alert(`Successfully chartered vessel! Booking reference: BC-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  React.useEffect(() => {
    fetch('http://localhost:5000/api/vessels')
      .then(res => res.json())
      .then(data => {
        setVesselsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch vessels', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{padding: '2rem', color: '#64748b'}}>Loading vessel data...</div>;

  return (
    <div className="main-content">
      <div className="topbar">
        <h2 style={{margin: 0, fontSize: '1.25rem'}}>Vessel Chartering & AI Procurement</h2>
      </div>

      <div className="dashboard-content" style={{paddingBottom: '2rem'}}>
        
        {/* Top KPI Cards */}
        <div className="grid-4" style={{marginBottom: '1.5rem'}}>
          <div className="card">
            <div className="card-title">Available Vessels</div>
            <div className="kpi-value">24</div>
            <div className="trend-neutral" style={{color: 'var(--text-muted)'}}>Across 8 Global Regions</div>
          </div>
          <div className="card">
            <div className="card-title">Active Routes</div>
            <div className="kpi-value">8</div>
            <div className="trend-neutral" style={{color: 'var(--text-muted)'}}>Connecting to India</div>
          </div>
          <div className="card">
            <div className="card-title">Avg Freight Rate</div>
            <div className="kpi-value">$32.40<span style={{fontSize: '1rem'}}>/MT</span></div>
            <div className="trend-down" style={{display: 'flex', alignItems: 'center'}}><ArrowDownRight size={14}/> -4.2% this week</div>
          </div>
          <div className="card">
            <div className="card-title">AI Recommended Options</div>
            <div className="kpi-value" style={{color: 'var(--success)'}}>6</div>
            <div className="trend-up" style={{display: 'flex', alignItems: 'center'}}><Cpu size={14} style={{marginRight: '0.25rem'}}/> High confidence</div>
          </div>
        </div>

        {/* AI Best Match Panel */}
        <div className="card" style={{marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
                <span style={{background: 'var(--success)', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem'}}><Cpu size={14}/> AI BEST MATCH</span>
                <span style={{fontSize: '0.875rem', color: 'var(--success)', fontWeight: 600}}>Score: 94%</span>
              </div>
              <h2 style={{margin: '0 0 0.25rem 0', color: '#fff'}}>Oceanic Horizon</h2>
              <div style={{color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem'}}>Australia → Chennai • 75,000 MT • Current: $34.20/MT</div>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><CheckCircle2 size={14} color="var(--success)"/> <strong style={{color: '#fff'}}>Perfect Capacity Match:</strong> Aligns precisely with your upcoming 75k MT coal requirement.</div>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><CheckCircle2 size={14} color="var(--success)"/> <strong style={{color: '#fff'}}>Favorable Freight Forecast:</strong> AI predicts rates will drop to $31.80/MT during booking window.</div>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><CheckCircle2 size={14} color="var(--success)"/> <strong style={{color: '#fff'}}>High Availability:</strong> Vessel is currently idle near origin port.</div>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><CheckCircle2 size={14} color="var(--success)"/> <strong style={{color: '#fff'}}>Suitable ETA:</strong> Arrives within your 5-day delivery threshold.</div>
              </div>
            </div>
            <button className="premium-btn" onClick={() => setSelectedVessel(vesselsData[0])} style={{padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              Review Charter Details <ArrowRight size={16}/>
            </button>
          </div>
        </div>

        {/* Vessel Table */}
        <div className="card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <div className="card-title" style={{color: 'var(--text)', fontWeight: 600, margin: 0}}>Available Fleet & Route Analysis</div>
            <button style={{ 
              background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', 
              padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <Filter size={16} /> Filter Results
            </button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Vessel Name</th>
                <th>Type</th>
                <th>Route</th>
                <th>Capacity</th>
                <th>Availability</th>
                <th>Cur. Freight</th>
                <th>Pred. Freight</th>
                <th>AI Score</th>
                <th>ETA</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {vesselsData.map((v) => (
                <tr key={v.id}>
                  <td style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500}}>
                    <img src={`data:image/svg+xml;charset=utf-8,${shipSvg}`} style={{width: 24, height: 18}} alt="Ship"/>
                    {v.name}
                  </td>
                  <td>{v.type}</td>
                  <td>{v.route}</td>
                  <td>{v.capacity} MT</td>
                  <td>
                    <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600}}>
                      {v.availColor} {charteredVessels.has(v.id) ? 'Chartered' : v.availStr}
                    </span>
                  </td>
                  <td>${v.curFreight.toFixed(2)}</td>
                  <td style={{color: v.predFreight < v.curFreight ? 'var(--success)' : 'var(--danger)', fontWeight: 600}}>
                    ${v.predFreight.toFixed(2)}
                  </td>
                  <td>
                    <span className="badge" style={{background: v.score >= 80 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: v.score >= 80 ? '#4ade80' : '#fbbf24', border: 'none'}}>
                      {v.score}%
                    </span>
                  </td>
                  <td>{v.eta}</td>
                  <td>
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <button className="premium-btn" onClick={() => setSelectedVessel(v)} style={{padding: '0.35rem 0.85rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                        View
                      </button>
                      {!charteredVessels.has(v.id) ? (
                        <button className="premium-btn" onClick={() => handleCharterVessel(v.id)} style={{padding: '0.35rem 0.85rem', fontSize: '0.75rem', background: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                          Charter
                        </button>
                      ) : (
                        <span style={{color: 'var(--success)', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem'}}><CheckCircle2 size={14}/> Booked</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View Details Modal */}
        {selectedVessel && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
          }}>
            <div className="card" style={{ width: '900px', maxHeight: '90vh', overflowY: 'auto', borderTop: '4px solid var(--secondary)', position: 'relative' }}>
              <button 
                onClick={() => setSelectedVessel(null)}
                style={{position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer'}}
              >&times;</button>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                <div>
                  <h2 style={{margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    {selectedVessel.name} 
                    <span style={{fontSize: '0.75rem', background: 'var(--primary)', padding: '0.25rem 0.5rem', borderRadius: '4px'}}>{selectedVessel.type}</span>
                  </h2>
                  <div style={{color: 'var(--text-muted)'}}>{selectedVessel.capacity} MT Capacity • Availability: {selectedVessel.availColor} {selectedVessel.availStr}</div>
                </div>
                <div style={{display: 'flex', gap: '0.75rem'}}>
                  <button className="premium-btn" style={{background: 'transparent', border: '1px solid var(--border)', padding: '0.5rem 1rem'}}>Compare</button>
                  {!charteredVessels.has(selectedVessel.id) ? (
                    <button className="premium-btn" onClick={() => handleCharterVessel(selectedVessel.id)} style={{padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>Charter Vessel <Check size={16}/></button>
                  ) : (
                    <button className="premium-btn" disabled style={{background: 'var(--success)', padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'not-allowed'}}>Chartered <CheckCircle2 size={16}/></button>
                  )}
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
                
                {/* Route Visualization */}
                <div>
                  <h3 style={{fontSize: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><MapPin size={16}/> Route Visualization</h3>
                  <div style={{fontWeight: 600, marginBottom: '0.5rem'}}>{selectedVessel.route.split('→')[0].trim()} <ArrowRight size={14} style={{verticalAlign: 'middle', margin: '0 0.25rem'}}/> {selectedVessel.route.split('→')[1].trim()}</div>
                  <div style={{height: '250px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)'}}>
                    <MapContainer center={[ (selectedVessel.origin[0] + selectedVessel.dest[0])/2, (selectedVessel.origin[1] + selectedVessel.dest[1])/2 ]} zoom={2.5} style={{ height: '100%', width: '100%' }}>
                      <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                      />
                      <Marker position={selectedVessel.origin}>
                         <Tooltip permanent direction="top">Origin</Tooltip>
                      </Marker>
                      <Marker position={selectedVessel.dest}>
                        <Tooltip permanent direction="bottom">Dest</Tooltip>
                      </Marker>
                      <Polyline positions={[selectedVessel.origin, selectedVessel.dest]} color="var(--primary)" weight={3} dashArray="5, 10" />
                      <Marker position={[(selectedVessel.origin[0]*0.8 + selectedVessel.dest[0]*0.2), (selectedVessel.origin[1]*0.8 + selectedVessel.dest[1]*0.2)]} icon={shipIcon} />
                    </MapContainer>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.875rem'}}>
                    <span><span style={{color: 'var(--text-muted)'}}>Distance:</span> ~4,200 NM</span>
                    <span><span style={{color: 'var(--text-muted)'}}>ETA:</span> {selectedVessel.eta}</span>
                  </div>
                </div>

                {/* Freight Forecast */}
                <div>
                  <h3 style={{fontSize: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><TrendingUp size={16}/> AI Freight Forecast</h3>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                    <div style={{background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px', flex: 1, marginRight: '0.5rem'}}>
                      <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Current Rate</div>
                      <div style={{fontSize: '1.25rem', fontWeight: 600}}>${selectedVessel.curFreight.toFixed(2)}</div>
                    </div>
                    <ArrowRight size={20} color="var(--text-muted)"/>
                    <div style={{background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.75rem', borderRadius: '8px', flex: 1, marginLeft: '0.5rem'}}>
                      <div style={{fontSize: '0.75rem', color: '#4ade80'}}>AI Predicted Rate</div>
                      <div style={{fontSize: '1.25rem', fontWeight: 600, color: '#4ade80'}}>${selectedVessel.predFreight.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div style={{height: '200px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '1rem 0'}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { day: 'Day -3', rate: selectedVessel.curFreight + 2 },
                        { day: 'Day -2', rate: selectedVessel.curFreight + 0.5 },
                        { day: 'Day -1', rate: selectedVessel.curFreight + 0.2 },
                        { day: 'Current', rate: selectedVessel.curFreight },
                        { day: 'Day +1', rate: selectedVessel.curFreight - (selectedVessel.curFreight - selectedVessel.predFreight) * 0.3 },
                        { day: 'Day +2', rate: selectedVessel.curFreight - (selectedVessel.curFreight - selectedVessel.predFreight) * 0.7 },
                        { day: 'Predicted', rate: selectedVessel.predFreight }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)"/>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'var(--text-muted)'}} />
                        <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
                        <Tooltip contentStyle={{background: '#1e293b', border: 'none', borderRadius: '4px'}}/>
                        <Line type="monotone" dataKey="rate" stroke="var(--success)" strokeWidth={3} dot={{r: 4, fill: 'var(--success)'}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center'}}>
                    The AI predicts a {(((selectedVessel.curFreight - selectedVessel.predFreight) / selectedVessel.curFreight) * 100).toFixed(1)}% drop in rates over the next 48 hours. Delay chartering to secure the optimal rate.
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
