import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Settings2, ArrowRight } from 'lucide-react';

export default function Forecast() {
  const [data, setData] = useState(null);
  const [params, setParams] = useState({
    cargoType: 'coal',
    volatility: 1.0,
    trend: 0
  });

  const fetchForecast = () => {
    axios.get(`http://localhost:5000/api/forecast?cargoType=${params.cargoType}&volatility=${params.volatility}&trend=${params.trend}`)
      .then(res => setData(res.data.forecast))
      .catch(console.error);
  };

  // Fetch initially and whenever params change
  useEffect(() => {
    fetchForecast();
  }, [params]);

  if (!data) return <div className="main-content" style={{justifyContent: 'center', alignItems: 'center'}}>Loading Simulation Engine...</div>;

  return (
    <div className="main-content">
      <div className="topbar">
        <div>
          <h2 style={{margin: 0, fontSize: '1.25rem'}}>Predictive Forecast Simulation</h2>
          <span style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>Adjust parameters to see how the model reacts</span>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="grid-2">
          
          {/* Chart Area */}
          <div className="card" style={{height: 500}}>
            <div className="card-title" style={{color: 'var(--text)', fontWeight: 600, marginBottom: '1rem'}}>
              Freight Rate Forecast ($/MT) - {params.cargoType.toUpperCase()}
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--text-muted)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--text-muted)'}} domain={['auto', 'auto']} />
                <RechartsTooltip />
                <Legend verticalAlign="top" height={36} iconType="plainline"/>
                <Line type="monotone" dataKey="historical" stroke="var(--primary)" strokeWidth={2} dot={false} name="Historical" />
                <Line type="monotone" dataKey="forecast" stroke="var(--secondary)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Forecast" />
                <Line type="monotone" dataKey="upperBound" stroke="var(--danger)" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Upper Confidence Bound" />
                <Line type="monotone" dataKey="lowerBound" stroke="#8b5cf6" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Lower Confidence Bound" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Control Panel Area */}
          <div className="card" style={{height: 500, display: 'flex', flexDirection: 'column'}}>
            <div className="card-title" style={{color: 'var(--text)', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Settings2 size={20} /> Simulation Controls
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1}}>
              
              {/* Cargo Selector */}
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600}}>Commodity Type</label>
                <div style={{display: 'flex', gap: '1rem'}}>
                  {['coal', 'iron_ore', 'grain'].map(type => (
                    <button 
                      key={type}
                      onClick={() => setParams({...params, cargoType: type})}
                      style={{
                        padding: '0.5rem 1rem', 
                        borderRadius: '4px', 
                        background: params.cargoType === type ? 'var(--primary)' : 'var(--surface-light)',
                        color: params.cargoType === type ? '#fff' : 'var(--text)',
                        border: 'none',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        flex: 1
                      }}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volatility Slider */}
              <div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                  <label style={{fontSize: '0.875rem', fontWeight: 600}}>Market Volatility</label>
                  <span style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>{params.volatility}x</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" max="3.0" step="0.1" 
                  value={params.volatility}
                  onChange={(e) => setParams({...params, volatility: parseFloat(e.target.value)})}
                  style={{width: '100%', cursor: 'pointer'}}
                />
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem'}}>
                  <span>Stable</span>
                  <span>Erratic</span>
                </div>
              </div>

              {/* Trend Slider */}
              <div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                  <label style={{fontSize: '0.875rem', fontWeight: 600}}>Economic Trend (Daily Offset)</label>
                  <span style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>{params.trend > 0 ? '+' : ''}{params.trend} $/MT</span>
                </div>
                <input 
                  type="range" 
                  min="-0.2" max="0.2" step="0.01" 
                  value={params.trend}
                  onChange={(e) => setParams({...params, trend: parseFloat(e.target.value)})}
                  style={{width: '100%', cursor: 'pointer'}}
                />
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem'}}>
                  <span>Bearish</span>
                  <span>Bullish</span>
                </div>
              </div>
              
              <div style={{background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--text-muted)'}}>
                <strong>How this works:</strong> The ML engine uses these parameters combined with built-in seasonal patterns (e.g. Winter Coal Demand) to mathematically generate realistic forecasting cones. Adjusting the volatility will widen the 95% confidence bounds.
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
