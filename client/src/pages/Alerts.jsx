import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Cpu, ArrowRight, Activity, ShieldAlert } from 'lucide-react';

export default function Alerts() {
  const [alertsData, setAlertsData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/alerts')
      .then(res => res.json())
      .then(data => {
        setAlertsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch alerts', err);
        setLoading(false);
      });
  }, []);

  const [activeTab, setActiveTab] = useState('All');

  if (loading) return <div style={{padding: '2rem', color: '#64748b'}}>Loading alerts...</div>;

  // Since alerts in DB are all combined, we can simulate today/yesterday splitting based on a simple slice or keep them together. Let's just use alertsData for today to keep it simple.
  const alertsToday = alertsData;
  const alertsYesterday = []; // Keep it empty for now, or populate it if you add timestamps


  return (
    <div className="main-content">
      <div className="topbar">
        <h2 style={{margin: 0, fontSize: '1.25rem'}}>Risk & Decision Center</h2>
      </div>

      <div className="dashboard-content" style={{paddingBottom: '2rem'}}>
        
        {/* Top Summary Cards */}
        <div className="grid-4" style={{marginBottom: '1.5rem'}}>
          <div className="card" style={{borderLeft: '4px solid #ef4444'}}>
            <div className="card-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><AlertCircle size={16} color="#ef4444"/> Critical</div>
            <div className="kpi-value" style={{color: '#fff'}}>1</div>
          </div>
          <div className="card" style={{borderLeft: '4px solid #f59e0b'}}>
            <div className="card-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><AlertTriangle size={16} color="#f59e0b"/> Warnings</div>
            <div className="kpi-value" style={{color: '#fff'}}>1</div>
          </div>
          <div className="card" style={{borderLeft: '4px solid #10b981'}}>
            <div className="card-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Info size={16} color="#10b981"/> Info</div>
            <div className="kpi-value" style={{color: '#fff'}}>2</div>
          </div>
          <div className="card" style={{borderLeft: '4px solid #0ea5e9'}}>
            <div className="card-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Cpu size={16} color="#0ea5e9"/> AI Alerts</div>
            <div className="kpi-value" style={{color: '#fff'}}>1</div>
          </div>
        </div>

        {/* Filters & Controls */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)'}}>
          <div style={{display: 'flex', gap: '1rem', fontSize: '0.875rem', fontWeight: 600}}>
            {['All', 'Critical', 'Warning', 'AI Alerts', 'Resolved'].map(tab => (
              <span 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{color: activeTab === tab ? '#fff' : 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s'}}
              >
                {tab}
              </span>
            ))}
          </div>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <select style={{background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem'}}>
              <option>Last 24h</option>
              <option>7 Days</option>
              <option>30 Days</option>
            </select>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div style={{display: 'flex', gap: '1.5rem'}}>
          
          {/* Left Column: Timeline */}
          <div style={{flex: 3}}>
            
            {/* TODAY */}
            <h3 style={{fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem'}}>Today</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem'}}>
              {alertsToday.map(alert => (
                <div key={alert.id} style={{display: 'flex', gap: '1rem', background: 'var(--surface)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-light)'}}>
                  {/* Time & Icon */}
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', minWidth: '60px'}}>
                    <div style={{fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)'}}>{alert.time}</div>
                    <div style={{background: alert.bg, padding: '0.4rem', borderRadius: '50%'}}>
                      {alert.type === 'ai' ? <Cpu size={20} color="#fff" /> : 
                       alert.type === 'critical' ? <AlertCircle size={20} color="#fff" /> : 
                       alert.type === 'warning' ? <AlertTriangle size={20} color="#fff" /> : 
                       <CheckCircle2 size={20} color="#fff" />}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div style={{flex: 1}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem'}}>
                      <h4 style={{margin: 0, fontSize: '1.1rem', color: '#fff'}}>{alert.title}</h4>
                      {alert.type === 'ai' && <span style={{background: 'rgba(14, 165, 233, 0.2)', color: '#0ea5e9', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '12px', fontWeight: 600, border: '1px solid rgba(14, 165, 233, 0.4)'}}>AI FORECAST</span>}
                    </div>
                    <div style={{color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem'}}>{alert.subtitle}</div>
                    <p style={{margin: '0 0 1rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5}}>{alert.desc}</p>
                    
                    {/* Action Row */}
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                      <div>
                        {alert.confidence && <span style={{fontSize: '0.75rem', color: '#0ea5e9', fontWeight: 700}}>AI Confidence: {alert.confidence}%</span>}
                      </div>
                      {alert.actionText && (
                        <button className="premium-btn" style={{padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: alert.type === 'ai' ? '#0ea5e9' : '#ef4444'}}>
                          {alert.actionText} <ArrowRight size={14}/>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* YESTERDAY */}
            <h3 style={{fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem'}}>Yesterday</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {alertsYesterday.map(alert => (
                <div key={alert.id} style={{display: 'flex', gap: '1rem', background: 'var(--surface)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-light)', opacity: 0.8}}>
                  {/* Time & Icon */}
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', minWidth: '60px'}}>
                    <div style={{fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)'}}>{alert.time}</div>
                    <div style={{background: alert.bg, padding: '0.4rem', borderRadius: '50%'}}>
                      {alert.type === 'ai' ? <Cpu size={20} color="#fff" /> : 
                       alert.type === 'critical' ? <AlertCircle size={20} color="#fff" /> : 
                       alert.type === 'warning' ? <AlertTriangle size={20} color="#fff" /> : 
                       <CheckCircle2 size={20} color="#fff" />}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div style={{flex: 1}}>
                    <h4 style={{margin: '0 0 0.25rem 0', fontSize: '1rem', color: '#fff'}}>{alert.title}</h4>
                    <div style={{color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.875rem', marginBottom: '0.25rem'}}>{alert.subtitle}</div>
                    <p style={{margin: 0, color: '#999', fontSize: '0.875rem'}}>{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Risk Overview */}
          <div style={{flex: 1}}>
            <div className="card" style={{position: 'sticky', top: '2rem'}}>
              <div className="card-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)', fontWeight: 600, marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)'}}>
                <ShieldAlert size={18} color="var(--primary)"/> Maritime Risk Overview
              </div>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>Freight Risk</span>
                  <span style={{background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600}}>Medium</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>Vessel Availability</span>
                  <span style={{background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600}}>High</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>Fuel Risk</span>
                  <span style={{background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600}}>Medium</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>Port Risk</span>
                  <span style={{background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600}}>Low</span>
                </div>
              </div>

              <div style={{marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)'}}>
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem'}}>Overall System Risk</div>
                <div style={{fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <Activity size={20}/> MEDIUM-HIGH
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
