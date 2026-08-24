import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { TrendingDown, TrendingUp, Cpu, Anchor, AlertTriangle, ArrowRight } from 'lucide-react';

export default function Trends() {
  const [trendsData, setTrendsData] = React.useState({ bunkerData: [], bdiData: [], freightData: [] });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/trends')
      .then(res => res.json())
      .then(data => {
        if (data) setTrendsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch trends', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{padding: '2rem', color: '#64748b'}}>Loading market trends...</div>;

  const { bunkerData, bdiData, freightData } = trendsData;

  return (
    <div className="main-content">
      <div className="topbar">
        <h2 style={{margin: 0, fontSize: '1.25rem'}}>Market Trends & AI Insights</h2>
      </div>

      <div className="dashboard-content" style={{paddingBottom: '2rem'}}>
        
        {/* Top KPI Cards */}
        <div className="grid-4" style={{marginBottom: '1.5rem'}}>
          <div className="card">
            <div className="card-title">Bunker Price</div>
            <div className="kpi-value">$682<span style={{fontSize: '1rem'}}>/MT</span></div>
            <div className="trend-down" style={{display: 'flex', alignItems: 'center'}}><TrendingDown size={14} style={{marginRight: '0.25rem'}}/> 0.4%</div>
          </div>
          <div className="card">
            <div className="card-title">BDI Index</div>
            <div className="kpi-value">1,320</div>
            <div className="trend-down" style={{display: 'flex', alignItems: 'center'}}><TrendingDown size={14} style={{marginRight: '0.25rem'}}/> 2.6%</div>
          </div>
          <div className="card">
            <div className="card-title">Freight Trend</div>
            <div className="kpi-value" style={{color: 'var(--danger)'}}>+8.4%</div>
            <div className="trend-up" style={{color: 'var(--danger)', display: 'flex', alignItems: 'center'}}><TrendingUp size={14} style={{marginRight: '0.25rem'}}/> Rising</div>
          </div>
          <div className="card">
            <div className="card-title">Market Risk</div>
            <div className="kpi-value" style={{color: '#f59e0b'}}>Medium</div>
            <div className="trend-neutral" style={{color: '#f59e0b', display: 'flex', alignItems: 'center'}}><AlertTriangle size={14} style={{marginRight: '0.25rem'}}/> Volatile</div>
          </div>
        </div>

        {/* AI Market Insight Panel */}
        <div className="card" style={{marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)', border: '1px solid rgba(249, 115, 22, 0.3)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
                <span style={{background: '#f97316', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem'}}><Cpu size={14}/> AI MARKET INSIGHT</span>
                <span style={{fontSize: '0.875rem', color: '#f97316', fontWeight: 600}}>Confidence: 91%</span>
              </div>
              <p style={{color: '#fff', fontSize: '1rem', lineHeight: 1.6, margin: '0.5rem 0 0.5rem 0', maxWidth: '800px'}}>
                Bunker prices have increased significantly since March while the BDI remains elevated. The AI model predicts a cascading effect resulting in a <strong style={{color: '#f97316'}}>6.8% increase in freight rates</strong> over the next 30 days.
              </p>
            </div>
            <div style={{background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #f97316', minWidth: '250px'}}>
              <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem'}}>Recommended Action</div>
              <div style={{color: '#f97316', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem'}}><AlertTriangle size={16}/> Secure capacity early</div>
            </div>
          </div>
        </div>

        {/* Charts & Correlation Row */}
        <div className="grid-3" style={{marginBottom: '1.5rem'}}>
          
          {/* Freight Rate Forecast Chart */}
          <div className="card" style={{height: 320}}>
            <div className="card-title" style={{color: 'var(--text)', fontWeight: 600, display: 'flex', justifyContent: 'space-between'}}>
              Freight Rate Forecast ($/MT)
              <span style={{fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-muted)'}}>Current: $32.40 | +8.4%</span>
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={freightData} margin={{top: 20, right: 10, left: -20, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11}} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11}} />
                <Tooltip contentStyle={{background: '#0f172a', border: '1px solid #334155'}}/>
                <ReferenceLine x="Jun" stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={3} name="Actual" dot={{r: 3, fill: '#06b6d4'}} />
                <Line type="monotone" dataKey="forecast" stroke="#f97316" strokeWidth={3} strokeDasharray="5 5" name="AI Forecast" dot={{r: 3, fill: '#f97316'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bunker Price Forecast Chart */}
          <div className="card" style={{height: 320}}>
            <div className="card-title" style={{color: 'var(--text)', fontWeight: 600, display: 'flex', justifyContent: 'space-between'}}>
              Bunker Fuel Price ($/MT)
              <span style={{fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-muted)'}}>Current: $682 | -0.4%</span>
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={bunkerData} margin={{top: 20, right: 10, left: -10, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11}} />
                <YAxis domain={['dataMin - 30', 'dataMax + 30']} axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11}} />
                <Tooltip contentStyle={{background: '#0f172a', border: '1px solid #334155'}}/>
                <ReferenceLine x="Jun" stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="actual" stroke="#8b5cf6" strokeWidth={3} name="Actual" dot={{r: 3, fill: '#8b5cf6'}} />
                <Line type="monotone" dataKey="forecast" stroke="#f97316" strokeWidth={3} strokeDasharray="5 5" name="AI Forecast" dot={{r: 3, fill: '#f97316'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* BDI Index Forecast Chart */}
          <div className="card" style={{height: 320}}>
            <div className="card-title" style={{color: 'var(--text)', fontWeight: 600, display: 'flex', justifyContent: 'space-between'}}>
              Baltic Dry Index (BDI)
              <span style={{fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-muted)'}}>Current: 1,320 | -2.6%</span>
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={bdiData} margin={{top: 20, right: 10, left: 0, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11}} />
                <YAxis domain={['dataMin - 100', 'dataMax + 100']} axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11}} />
                <Tooltip contentStyle={{background: '#0f172a', border: '1px solid #334155'}}/>
                <ReferenceLine x="Jun" stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} name="Actual" dot={{r: 3, fill: '#10b981'}} />
                <Line type="monotone" dataKey="forecast" stroke="#f97316" strokeWidth={3} strokeDasharray="5 5" name="AI Forecast" dot={{r: 3, fill: '#f97316'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Insight & Correlation Bottom Row */}
        <div className="grid-2">
          
          {/* Market Impact & Correlation Analysis */}
          <div className="card">
            <div className="card-title" style={{color: 'var(--text)', fontWeight: 600, marginBottom: '1.5rem'}}>Market Impact Analysis</div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)'}}>
                <span style={{fontSize: '1.2rem'}}>⛽</span>
                <div style={{flex: 1, fontWeight: 500, color: '#ccc'}}>Bunker prices <span style={{color: '#ef4444'}}>↑</span> &rarr; Freight cost <span style={{color: '#ef4444'}}>↑</span></div>
                <div style={{background: 'var(--bg-dark)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, color: '#f97316'}}>Corr: 0.78</div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)'}}>
                <span style={{fontSize: '1.2rem'}}>📈</span>
                <div style={{flex: 1, fontWeight: 500, color: '#ccc'}}>BDI <span style={{color: '#ef4444'}}>↑</span> &rarr; Vessel demand <span style={{color: '#ef4444'}}>↑</span></div>
                <div style={{background: 'var(--bg-dark)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, color: '#f97316'}}>Corr: 0.84</div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)'}}>
                <span style={{fontSize: '1.2rem'}}>⚓</span>
                <div style={{flex: 1, fontWeight: 500, color: '#ccc'}}>Port congestion <span style={{color: '#ef4444'}}>↑</span> &rarr; ETA <span style={{color: '#ef4444'}}>↑</span></div>
                <div style={{background: 'var(--bg-dark)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, color: '#f97316'}}>Corr: 0.62</div>
              </div>
            </div>

            <div style={{marginTop: '1.5rem'}}>
              <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem'}}>Macro Market Risk</div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <span style={{fontSize: '0.75rem', fontWeight: 600}}>LOW</span>
                <div style={{flex: 1, height: '6px', background: 'linear-gradient(to right, #10b981, #f59e0b, #ef4444)', borderRadius: '3px', position: 'relative'}}>
                  <div style={{position: 'absolute', top: '-6px', left: '60%', width: '18px', height: '18px', background: '#f59e0b', borderRadius: '50%', border: '3px solid var(--surface)'}}></div>
                </div>
                <span style={{fontSize: '0.75rem', fontWeight: 600}}>HIGH</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem'}}>
                <span><strong style={{color: '#ccc'}}>Primary:</strong> Rising bunker prices</span>
                <span><strong style={{color: '#ccc'}}>Secondary:</strong> Vessel demand</span>
              </div>
            </div>
          </div>

          {/* Chartering Impact Matrix */}
          <div className="card">
            <div className="card-title" style={{color: 'var(--text)', fontWeight: 600, marginBottom: '1.5rem'}}>⚓ Chartering Impact Matrix</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{padding: '0.75rem 0.5rem'}}>Market Factor</th>
                  <th style={{padding: '0.75rem 0.5rem', textAlign: 'center'}}>Trend</th>
                  <th style={{padding: '0.75rem 0.5rem'}}>Impact Level</th>
                  <th style={{padding: '0.75rem 0.5rem'}}>Recommendation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{fontWeight: 500, color: '#ccc'}}>Bunker Price</td>
                  <td style={{textAlign: 'center', color: '#ef4444', fontWeight: 700}}>↑</td>
                  <td><span style={{background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600}}>High</span></td>
                  <td style={{fontWeight: 600}}>Charter earlier</td>
                </tr>
                <tr>
                  <td style={{fontWeight: 500, color: '#ccc'}}>BDI Index</td>
                  <td style={{textAlign: 'center', color: '#ef4444', fontWeight: 700}}>↑</td>
                  <td><span style={{background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600}}>High</span></td>
                  <td style={{fontWeight: 600}}>Secure capacity</td>
                </tr>
                <tr>
                  <td style={{fontWeight: 500, color: '#ccc'}}>Freight Rate</td>
                  <td style={{textAlign: 'center', color: '#ef4444', fontWeight: 700}}>↑</td>
                  <td><span style={{background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600}}>High</span></td>
                  <td style={{fontWeight: 600}}>Lock rate</td>
                </tr>
                <tr>
                  <td style={{fontWeight: 500, color: '#ccc'}}>Port Congestion</td>
                  <td style={{textAlign: 'center', color: '#f59e0b', fontWeight: 700}}>→</td>
                  <td><span style={{background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600}}>Medium</span></td>
                  <td style={{fontWeight: 600}}>Monitor closely</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
