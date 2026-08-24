import React, { useState, useEffect } from 'react';
import { Database, Search, Activity, Network, CheckCircle2, ChevronRight, X, Info, ShieldAlert, Zap, Box, CloudRain, TrendingDown, PlayCircle, Anchor, Cpu } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DataFeed() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/feed')
      .then(res => res.json())
      .then(data => {
        setTableData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch feed', err);
        setLoading(false);
      });
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDecision, setFilterDecision] = useState('ALL');
  const [selectedRow, setSelectedRow] = useState(null);
  const [refreshTimer, setRefreshTimer] = useState(2);

  const chartData = [
    { time: '15:45', actual: 25.80, forecast: 25.80 },
    { time: '15:46', actual: 25.95, forecast: 25.60 },
    { time: '15:47', actual: 26.20, forecast: 25.40 },
    { time: '15:48', actual: 26.45, forecast: 25.20 },
    { time: '15:49', actual: 26.60, forecast: 24.80 },
    { time: '15:50', actual: 26.65, forecast: 24.50 },
    { time: '15:51', actual: 26.71, forecast: 24.10 },
  ];

  const filteredData = tableData.filter(row => {
    const matchesSearch = row.port.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          row.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          row.origin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDecision = filterDecision === 'ALL' || row.decision === filterDecision;
    return matchesSearch && matchesDecision;
  });

  // Fake timer for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTimer(prev => prev === 0 ? 5 : prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-content" style={{position: 'relative'}}>
      
      {/* Live Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <div>
          <h2 style={{margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 700}}>
              <span className="live-pulse"></span> LIVE DATA STREAM
            </span>
          </h2>
          <div style={{fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', gap: '1.5rem'}}>
            <span>Last update: <strong>15:51:32 IST</strong></span>
            <span>Next refresh: <strong style={{color: refreshTimer === 0 ? '#10b981' : '#fff'}}>0{refreshTimer}s</strong></span>
            <span>Records/sec: <strong>2,400</strong></span>
          </div>
        </div>
      </div>

      <div className="dashboard-content" style={{paddingBottom: '2rem', padding: 0}}>
        
        {/* Top 5 Metric Cards */}
        <div className="grid-5" style={{marginBottom: '1.5rem'}}>
          <div className="card" style={{padding: '1rem', textAlign: 'center'}}>
            <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem'}}>Live Events</div>
            <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#fff'}}>12,480</div>
          </div>
          <div className="card" style={{padding: '1rem', textAlign: 'center'}}>
            <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem'}}>API Health</div>
            <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#10b981'}}>98.7%</div>
          </div>
          <div className="card" style={{padding: '1rem', textAlign: 'center'}}>
            <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem'}}>ML Prediction</div>
            <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#0ea5e9'}}>2.4k/s</div>
          </div>
          <div className="card" style={{padding: '1rem', textAlign: 'center'}}>
            <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem'}}>Active Ships</div>
            <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#fff'}}>184</div>
          </div>
          <div className="card" style={{padding: '1rem', textAlign: 'center'}}>
            <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem'}}>Avg Freight Rate</div>
            <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b'}}>$25.84/MT</div>
          </div>
        </div>

        {/* Middle Row: API Status, Event Stream, Live Chart */}
        <div className="grid-3" style={{marginBottom: '1.5rem', alignItems: 'stretch'}}>
          
          {/* API Status */}
          <div className="card" style={{display: 'flex', flexDirection: 'column'}}>
            <div className="card-title" style={{fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px'}}>Live Data Sources</div>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem'}}>
                <span style={{color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><span className="dot-green"></span> Ministry of Ports</span>
                <span style={{color: '#a1a1aa'}}>12 ms</span>
                <span style={{color: '#a1a1aa', width: '100px', textAlign: 'right'}}>1,240 ev/min</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem'}}>
                <span style={{color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><span className="dot-green"></span> UN Comtrade</span>
                <span style={{color: '#a1a1aa'}}>45 ms</span>
                <span style={{color: '#a1a1aa', width: '100px', textAlign: 'right'}}>820 ev/min</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem'}}>
                <span style={{color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><span className="dot-green"></span> Baltic Exchange</span>
                <span style={{color: '#a1a1aa'}}>28 ms</span>
                <span style={{color: '#a1a1aa', width: '100px', textAlign: 'right'}}>340 ev/min</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem'}}>
                <span style={{color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><span className="dot-green"></span> Weather API</span>
                <span style={{color: '#a1a1aa'}}>31 ms</span>
                <span style={{color: '#a1a1aa', width: '100px', textAlign: 'right'}}>610 ev/min</span>
              </div>
            </div>
            <div style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)'}}>
              <div style={{fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem'}}>ML Engine</div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem'}}>
                <span style={{color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600}}><span className="dot-cyan"></span> Active Process</span>
                <span style={{color: '#0ea5e9', fontWeight: 600}}>2.4k rows/s</span>
              </div>
            </div>
          </div>

          {/* Readable Event Stream */}
          <div className="card" style={{display: 'flex', flexDirection: 'column'}}>
            <div className="card-title" style={{fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px'}}>Live Event Stream</div>
            <div style={{flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', paddingRight: '0.5rem', fontSize: '0.85rem'}}>
              
              <div>
                <div style={{color: 'var(--text-muted)'}}>15:51:32 <strong style={{color: '#10b981', marginLeft: '0.5rem'}}>API_PORTS</strong></div>
                <div style={{color: '#fff', marginLeft: '65px'}}>Port Chennai updated<br/><span style={{color: '#a1a1aa'}}>Traffic: 80,04,636 MT</span></div>
              </div>
              
              <div>
                <div style={{color: 'var(--text-muted)'}}>15:51:33 <strong style={{color: '#f59e0b', marginLeft: '0.5rem'}}>API_WEATHER</strong></div>
                <div style={{color: '#fff', marginLeft: '65px'}}>Wind: 15.2 kt<br/><span style={{color: '#a1a1aa'}}>Visibility: 8.4 km</span></div>
              </div>

              <div>
                <div style={{color: 'var(--text-muted)'}}>15:51:34 <strong style={{color: '#0ea5e9', marginLeft: '0.5rem'}}>ML_ENGINE</strong></div>
                <div style={{color: '#fff', marginLeft: '65px'}}>Prediction completed<br/><span style={{color: '#a1a1aa'}}>Freight: $24.10/MT | Conf: 91%</span></div>
              </div>

            </div>
          </div>

          {/* Real-Time Freight Rate Chart */}
          <div className="card" style={{display: 'flex', flexDirection: 'column'}}>
            <div className="card-title" style={{fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px'}}>Real-Time Freight Rate ($/MT)</div>
            <div style={{flex: 1, marginTop: '1rem'}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{top: 5, right: 5, left: -25, bottom: 0}}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 10}} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 10}} />
                  <Tooltip contentStyle={{background: '#0f172a', border: '1px solid #334155'}}/>
                  <Line type="monotone" dataKey="actual" stroke="#ef4444" strokeWidth={2} name="Current Rate" dot={false} />
                  <Line type="monotone" dataKey="forecast" stroke="#0ea5e9" strokeWidth={2} strokeDasharray="4 4" name="AI Forecast" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.5rem'}}>
              <span style={{fontSize: '0.75rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem'}}><div style={{width: 8, height: 2, background: '#ef4444'}}></div> Current</span>
              <span style={{fontSize: '0.75rem', color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '0.25rem'}}><div style={{width: 8, height: 2, background: '#0ea5e9'}}></div> Forecast</span>
            </div>
          </div>

        </div>

        {/* Simplified Table with Why Button */}
        <div className="card" style={{padding: 0, overflow: 'hidden'}}>
          <div className="card-title" style={{padding: '1rem', margin: 0, background: 'var(--surface)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
              <span>AI Decision Matrix (Filtered)</span>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <input 
                  type="text" 
                  placeholder="Filter port/commodity..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  style={{background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-light)', padding: '0.35rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem'}}
                />
                <select 
                  value={filterDecision} 
                  onChange={(e) => setFilterDecision(e.target.value)} 
                  style={{background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-light)', padding: '0.35rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem'}}
                >
                  <option value="ALL">Decision: All</option>
                  <option value="WAIT">WAIT</option>
                  <option value="CHARTER">CHARTER</option>
                </select>
              </div>
            </div>
            <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal'}}>All timestamps are IST</span>
          </div>
          <div style={{overflowX: 'auto'}}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{padding: '1rem'}}>Time</th>
                  <th>Freshness</th>
                  <th>Port</th>
                  <th>Commodity</th>
                  <th>Origin</th>
                  <th>Cargo</th>
                  <th>Current Freight</th>
                  <th style={{background: 'rgba(14, 165, 233, 0.1)', color: '#38bdf8'}}>AI Prediction</th>
                  <th style={{background: 'rgba(168, 85, 247, 0.1)', color: '#c084fc'}}>AI Decision</th>
                  <th style={{textAlign: 'right', paddingRight: '1rem'}}>Logic Trace</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(row => (
                  <tr key={row.id} style={{background: selectedRow?.id === row.id ? 'rgba(255,255,255,0.05)' : 'transparent', transition: 'background 0.2s'}}>
                    <td style={{padding: '1rem', color: 'var(--text-muted)'}}>{row.time}</td>
                    <td>
                      {row.freshness === 'Fresh' && <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.75rem'}}><span className="dot-green"></span> &lt; 1 min</span>}
                      {row.freshness === 'Aging' && <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.75rem'}}><span className="dot-yellow"></span> 1-5 min</span>}
                      {row.freshness === 'Stale' && <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontSize: '0.75rem'}}><span className="dot-red"></span> &gt; 5 min</span>}
                    </td>
                    <td style={{fontWeight: 600}}>{row.port}</td>
                    <td>{row.commodity}</td>
                    <td>{row.origin}</td>
                    <td>{row.cargo}</td>
                    <td style={{color: '#94a3b8'}}>{row.freight}</td>
                    <td style={{background: 'rgba(14, 165, 233, 0.05)', fontWeight: 700, color: '#38bdf8'}}>{row.prediction}</td>
                    <td style={{background: 'rgba(168, 85, 247, 0.05)', fontWeight: 700, color: row.color}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                        {row.decision === 'WAIT' ? <div style={{width: 8, height: 8, borderRadius: '50%', background: '#f59e0b'}}></div> : <div style={{width: 8, height: 8, borderRadius: '50%', background: '#10b981'}}></div>}
                        {row.decision}
                      </div>
                    </td>
                    <td style={{textAlign: 'right', paddingRight: '1rem'}}>
                      <button 
                        onClick={() => setSelectedRow(row)}
                        style={{background: 'var(--surface-light, rgba(255,255,255,0.05))', border: '1px solid var(--border-light)', color: 'var(--text-main)', padding: '0.4rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', transition: 'all 0.2s'}}
                        onMouseOver={e => e.currentTarget.style.borderColor = '#0ea5e9'}
                        onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                      >
                        Why? <ChevronRight size={14}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Decision Trace Drawer */}
      {selectedRow && (
        <div className="logic-trace-drawer" style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '450px', background: '#0f172a', 
          borderLeft: '1px solid #334155', zIndex: 1000, boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column', animation: 'slideIn 0.3s ease'
        }}>
          {/* Drawer Header */}
          <div style={{padding: '1.5rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b'}}>
            <div>
              <h3 style={{margin: 0, color: '#fff', fontSize: '1.25rem'}}>WHY {selectedRow.decision}?</h3>
              <div className="text-muted" style={{fontSize: '0.875rem', marginTop: '0.25rem'}}>Logic Trace for ID #{selectedRow.id}</div>
            </div>
            <button onClick={() => setSelectedRow(null)} style={{background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '0.5rem'}}><X size={24}/></button>
          </div>

          {/* Drawer Body (Trace) */}
          <div style={{flex: 1, overflowY: 'auto', padding: '1.5rem'}}>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
              
              {/* Step 1: Live Record */}
              <div style={{background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)'}}>
                <div className="text-muted" style={{fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><PlayCircle size={14}/> LIVE RECORD ({selectedRow.time})</div>
                <div style={{color: '#fff', fontWeight: 600}}>{selectedRow.port} | {selectedRow.cargo}</div>
              </div>

              <div style={{textAlign: 'center', color: '#334155', height: '20px'}}>↓</div>

              {/* Step 2: APIs */}
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <div style={{flex: 1, background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)'}}>
                  <div className="text-muted" style={{fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600}}><Anchor size={12}/> Port Data</div>
                  <div style={{color: '#fff', fontSize: '0.875rem'}}>80,04,636 MT</div>
                </div>
                <div style={{flex: 1, background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)'}}>
                  <div className="text-muted" style={{fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600}}><Box size={12}/> Comtrade</div>
                  <div style={{color: '#fff', fontSize: '0.875rem'}}>{selectedRow.commodity}</div>
                </div>
              </div>
              <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
                <div style={{flex: 1, background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)'}}>
                  <div className="text-muted" style={{fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600}}><CloudRain size={12}/> Weather</div>
                  <div style={{color: '#fff', fontSize: '0.875rem'}}>15.2 kt wind</div>
                </div>
                <div style={{flex: 1, background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)'}}>
                  <div className="text-muted" style={{fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600}}><TrendingDown size={12}/> Baltic dry</div>
                  <div style={{color: '#ef4444', fontSize: '0.875rem', fontWeight: 700}}>{selectedRow.freight}</div>
                </div>
              </div>

              <div style={{textAlign: 'center', color: '#334155', height: '20px', marginTop: '0.25rem'}}>↓</div>

              {/* Step 3: ML Engine */}
              <div style={{background: 'rgba(14, 165, 233, 0.1)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(14, 165, 233, 0.3)', position: 'relative'}}>
                <div style={{fontSize: '0.75rem', color: '#0ea5e9', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Cpu size={16}/> ML PREDICTION</div>
                <div style={{fontSize: '1.5rem', color: '#fff', fontWeight: 700}}>{selectedRow.prediction} / MT</div>
                <div style={{fontSize: '0.875rem', color: '#0ea5e9', fontWeight: 600, marginTop: '0.25rem'}}>Confidence: 91%</div>
                
                <div style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(14, 165, 233, 0.2)'}}>
                  <div className="text-muted" style={{fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem'}}>Main Influencing Factors:</div>
                  <ul style={{margin: 0, paddingLeft: '1.25rem', color: '#e2e8f0', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                    <li>Baltic dry macro trend is dropping</li>
                    <li>Port congestion at {selectedRow.port} is decreasing</li>
                    <li>Weather stable on route</li>
                  </ul>
                </div>
              </div>

              <div style={{textAlign: 'center', color: '#334155', height: '20px'}}>↓</div>

              {/* Step 4: Final Decision */}
              <div style={{background: selectedRow.decision === 'WAIT' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', padding: '1.25rem', borderRadius: '8px', border: `1px solid ${selectedRow.decision === 'WAIT' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`}}>
                <div style={{fontSize: '0.75rem', color: selectedRow.color, textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Zap size={16}/> CHARTER ENGINE</div>
                <div style={{fontSize: '1.5rem', color: selectedRow.color, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <div style={{width: 12, height: 12, borderRadius: '50%', background: selectedRow.color, boxShadow: `0 0 10px ${selectedRow.color}`}}></div>
                  {selectedRow.decision}
                </div>
                
                <div style={{marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '4px'}}>
                  <span className="text-muted" style={{fontSize: '0.875rem'}}>Estimated AI Savings:</span>
                  <span style={{color: '#10b981', fontSize: '1.1rem', fontWeight: 700}}>{selectedRow.savings} / MT</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .live-pulse { width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block; box-shadow: 0 0 0 rgba(16, 185, 129, 0.7); animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
        .dot-green { width: 6px; height: 6px; border-radius: 50%; background: #10b981; display: inline-block; }
        .dot-yellow { width: 6px; height: 6px; border-radius: 50%; background: #f59e0b; display: inline-block; }
        .dot-red { width: 6px; height: 6px; border-radius: 50%; background: #ef4444; display: inline-block; }
        .dot-cyan { width: 6px; height: 6px; border-radius: 50%; background: #0ea5e9; display: inline-block; }
        
        .logic-trace-drawer, .logic-trace-drawer div, .logic-trace-drawer h3, .logic-trace-drawer li, .logic-trace-drawer strong {
          color: #f8fafc !important;
        }
        .logic-trace-drawer .text-muted {
          color: #94a3b8 !important;
        }
      `}} />

    </div>
  );
}
