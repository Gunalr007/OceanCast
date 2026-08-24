import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { LayoutDashboard, Ship, Bell, TrendingUp, Search, Calendar, User, MoreHorizontal, AlertTriangle, AlertCircle, Info, CheckCircle2, ArrowUpRight, ArrowDownRight, Anchor, Settings as SettingsIcon, FileText, BarChart2, Plus, Database } from 'lucide-react';
import axios from 'axios';
import './index.css';
import Forecast from './pages/Forecast';
import Vessels from './pages/Vessels';
import Alerts from './pages/Alerts';
import Demand from './pages/Demand';
import Trends from './pages/Trends';
import Ports from './pages/Ports';
import OceanMap from './pages/OceanMap';

import DataFeed from './pages/DataFeed';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';

const API_BASE = 'http://localhost:5000/api';

function SplashScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'var(--bg-dark)', zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="splash-logo-container">
        <img src="/logo.jpg" alt="Ocean Cast Logo" className="splash-logo" />
        <div className="splash-glow"></div>
      </div>
      <h1 style={{fontFamily: 'var(--font-heading)', color: '#fff', marginTop: '2rem', marginBottom: '0.5rem', letterSpacing: '2px'}}>OCEAN CAST</h1>
      <p style={{color: 'var(--primary)', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600}}>Predictive Maritime Engine</p>
      
      <div style={{marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
        <div className="loading-spinner"></div>
        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem', fontFamily: 'monospace'}}>Initializing AI Core...</span>
      </div>
    </div>
  );
}

const TRANSLATIONS = {
  English: {
    dashboard: "Dashboard",
    liveOceanMap: "Live Ocean Map",
    freightForecast: "Freight Forecast",
    cargoDemand: "Cargo Demand",
    vesselChartering: "Vessel Chartering",
    portRouteData: "Port / Route Data",
    marketTrends: "Market Trends",
    alertsNotifications: "Alerts & Notifications",
    liveDataFeed: "Live Data Feed",
    settings: "Settings",
    activeRoutes: "Active Routes",
    addNewRoute: "Add New Route",
    summary: "AI Executive Summary",
  },
  Spanish: {
    dashboard: "Tablero",
    liveOceanMap: "Mapa del Océano en Vivo",
    freightForecast: "Pronóstico de Flete",
    cargoDemand: "Demanda de Carga",
    vesselChartering: "Fletamento de Buques",
    portRouteData: "Datos de Puerto / Ruta",
    marketTrends: "Tendencias del Mercado",
    alertsNotifications: "Alertas y Notificaciones",
    liveDataFeed: "Transmisión de Datos en Vivo",
    settings: "Configuración",
    activeRoutes: "Rutas Activas",
    addNewRoute: "Agregar Nueva Ruta",
    summary: "Resumen Ejecutivo de IA",
  },
  French: {
    dashboard: "Tableau de bord",
    liveOceanMap: "Carte de l'océan en direct",
    freightForecast: "Prévisions de fret",
    cargoDemand: "Demande de cargaison",
    vesselChartering: "Affrètement de navires",
    portRouteData: "Données portuaires / routières",
    marketTrends: "Tendances du marché",
    alertsNotifications: "Alertes et notifications",
    liveDataFeed: "Flux de données en direct",
    settings: "Paramètres",
    activeRoutes: "Routes actives",
    addNewRoute: "Ajouter une nouvelle route",
    summary: "Résumé Exécutif de l'IA",
  },
  Mandarin: {
    dashboard: "仪表板",
    liveOceanMap: "实时海洋图",
    freightForecast: "运费预测",
    cargoDemand: "货物需求",
    vesselChartering: "船舶租船",
    portRouteData: "港口/航线数据",
    marketTrends: "市场趋势",
    alertsNotifications: "警报与通知",
    liveDataFeed: "实时数据流",
    settings: "设置",
    activeRoutes: "活动航线",
    addNewRoute: "添加新航线",
    summary: "AI 执行摘要",
  }
};

function Sidebar({ language }) {
  const location = useLocation();
  const trans = TRANSLATIONS[language] || TRANSLATIONS.English;
  
  const navItems = [
    { path: '/', icon: <LayoutDashboard size={18}/>, label: trans.dashboard },
    { path: '/map', icon: <Anchor size={18}/>, label: trans.liveOceanMap },
    { path: '/forecast', icon: <TrendingUp size={18}/>, label: trans.freightForecast },
    { path: '/demand', icon: <BarChart2 size={18}/>, label: trans.cargoDemand },
    { path: '/vessels', icon: <Ship size={18}/>, label: trans.vesselChartering },
    { path: '/planner', icon: <Anchor size={18}/>, label: trans.portRouteData },
    { path: '/insights', icon: <TrendingUp size={18}/>, label: trans.marketTrends },
    { path: '/alerts', icon: <Bell size={18}/>, label: trans.alertsNotifications },
    { path: '/reports', icon: <Database size={18}/>, label: trans.liveDataFeed },
    { path: '/settings', icon: <SettingsIcon size={18}/>, label: trans.settings },
  ];

  const activeRoutes = [
    { name: 'Australia → Chennai', color: '#10b981' },
    { name: 'Indonesia → Vizag', color: '#10b981' },
    { name: 'South Africa → Paradip', color: '#f59e0b' },
    { name: 'Australia → Ennore', color: '#ef4444' },
    { name: 'Saudi Arabia → Mumbai', color: '#8b5cf6' },
    { name: 'Brazil → Vizag', color: '#0ea5e9' },
    { name: 'USA → Paradip', color: '#ec4899' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo-container">
        <img src="/logo.jpg" alt="Ocean Cast Logo" className="sidebar-logo" />
        <div>
          <h2 className="sidebar-title">Ocean Cast</h2>
          <div className="sidebar-subtitle">Predictive Engine</div>
        </div>
      </div>
      
      {navItems.map(item => (
        <Link key={item.path} to={item.path} className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}>
          {item.icon}
          {item.label}
        </Link>
      ))}

      <div className="sidebar-section">{trans.activeRoutes}</div>
      {activeRoutes.map(route => (
        <div key={route.name} className="sidebar-link" style={{ padding: '0.5rem 1rem' }}>
          <span className="route-dot" style={{ backgroundColor: route.color }}></span>
          {route.name}
        </div>
      ))}
      <button style={{ 
        background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', 
        padding: '0.5rem', borderRadius: '4px', margin: '1rem', cursor: 'pointer',
        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
      }}>
        <Plus size={16} /> {trans.addNewRoute}
      </button>
    </div>
  );
}

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [dateRange, setDateRange] = useState('01 May 2024 - 31 May 2024');

  useEffect(() => {
    axios.get(`${API_BASE}/dashboard`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <div className="main-content" style={{justifyContent: 'center', alignItems: 'center'}}>Loading...</div>;

  return (
    <div className="main-content">
      <div className="topbar">
        <div>
          <h2 style={{margin: 0, fontSize: '1.25rem'}}>Dashboard</h2>
          <span style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>Intelligent Freight Forecasting & Optimized Vessel Chartering</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <Bell size={20} color="var(--text-muted)" />
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border)', padding: '0.25rem 0.75rem', borderRadius: '4px', position: 'relative'}}>
            <Calendar size={16} color="var(--text-muted)" />
            <span style={{fontSize: '0.875rem'}}>{dateRange}</span>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              style={{position: 'absolute', opacity: 0, left: 0, top: 0, width: '100%', height: '100%', cursor: 'pointer'}}
            >
              <option value="01 May 2024 - 31 May 2024">01 May 2024 - 31 May 2024</option>
              <option value="01 Jun 2024 - 30 Jun 2024">01 Jun 2024 - 30 Jun 2024</option>
              <option value="01 Jul 2024 - 31 Jul 2024">01 Jul 2024 - 31 Jul 2024</option>
              <option value="Last 90 Days">Last 90 Days</option>
            </select>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <div style={{width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>AM</div>
            <div>
              <div style={{fontSize: '0.875rem', fontWeight: 600}}>Admin</div>
              <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Logistics Team</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        
        {/* AI Executive Summary */}
        <div className="ai-summary-box">
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: 600}}>
            <TrendingUp size={18} /> AI Executive Summary
          </div>
          Ocean Cast ML models detect a highly bullish trend in Coal freight rates due to upcoming winter seasonality and tightening vessel availability on the Australia → Chennai route. Recommended action: <strong>Charter Capesize vessels within the next 10 days to lock in rates before the forecasted 8.6% surge.</strong>
        </div>

        {/* Top KPIs */}
        <div className="grid-4">
          <div className="card">
            <div className="card-title">Predicted Avg Freight (Next 30 Days)</div>
            <div className="kpi-value">{data.kpis.predictedAvgFreight.value}</div>
            <div className="trend-down" style={{display: 'flex', alignItems: 'center'}}><ArrowUpRight size={14}/> {data.kpis.predictedAvgFreight.trend}</div>
          </div>
          <div className="card">
            <div className="card-title">Total Cargo Demand (Next 90 Days)</div>
            <div className="kpi-value">{data.kpis.totalCargoDemand.value}</div>
            <div className="trend-up" style={{display: 'flex', alignItems: 'center'}}><ArrowUpRight size={14}/> {data.kpis.totalCargoDemand.trend}</div>
          </div>
          <div className="card">
            <div className="card-title">Recommended Charter Window</div>
            <div className="kpi-value">{data.kpis.recommendedCharterWindow.value}</div>
            <div className="trend-neutral">{data.kpis.recommendedCharterWindow.subtext}</div>
          </div>
          <div className="card">
            <div className="card-title">Estimated Savings</div>
            <div className="kpi-value">{data.kpis.estimatedSavings.value}</div>
            <div className="trend-neutral">{data.kpis.estimatedSavings.subtext}</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid-2">
          <div className="card" style={{height: 350}}>
            <div className="card-title" style={{color: 'var(--text)', fontWeight: 600, marginBottom: '1rem'}}>Freight Rate Forecast ($/MT)</div>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={data.freightForecast}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--text-muted)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--text-muted)'}} domain={[15, 50]} />
                <RechartsTooltip />
                <Legend verticalAlign="top" height={36} iconType="plainline"/>
                <Line type="monotone" dataKey="historical" stroke="var(--primary)" strokeWidth={2} dot={false} name="Historical" />
                <Line type="monotone" dataKey="forecast" stroke="var(--secondary)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Forecast" />
                <Line type="monotone" dataKey="upperBound" stroke="var(--danger)" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Upper Bound" />
                <Line type="monotone" dataKey="lowerBound" stroke="#8b5cf6" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Lower Bound" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card" style={{height: 350}}>
            <div className="card-title" style={{color: 'var(--text)', fontWeight: 600, marginBottom: '1rem'}}>Cargo Demand Forecast (MT)</div>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={data.cargoDemandForecast}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--text-muted)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--text-muted)'}} tickFormatter={(val) => `${val/1000}K`} />
                <RechartsTooltip />
                <Legend verticalAlign="top" height={36} iconType="square"/>
                <Bar dataKey="historical" fill="var(--primary)" name="Historical" radius={[4, 4, 0, 0]} />
                <Bar dataKey="forecast" fill="var(--secondary)" name="Forecast" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Widgets */}
        <div className="grid-3-bottom">
          <div className="card">
            <div className="card-title" style={{color: 'var(--text)', fontWeight: 600, marginBottom: '1rem'}}>Route & Vessel Availability</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Vessel Availability</th>
                  <th>Est. Freight ($/MT)</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {data.routeAvailability.map(r => (
                  <tr key={r.id}>
                    <td>{r.route}</td>
                    <td><span className={`badge badge-${r.availability}`}>{r.availability}</span></td>
                    <td>{r.estFreight}</td>
                    <td>{r.trend === 'up' ? <ArrowUpRight size={16} color="var(--danger)"/> : r.trend === 'down' ? <ArrowDownRight size={16} color="var(--success)"/> : <ArrowUpRight size={16} color="var(--danger)"/>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{textAlign: 'center', marginTop: '1rem'}}><a href="#" style={{fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none'}}>View All Routes</a></div>
          </div>
          
          <div className="card">
            <div className="card-title" style={{color: 'var(--text)', fontWeight: 600, marginBottom: '1rem'}}>Optimization Recommendation</div>
            <div style={{background: '#dcfce7', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <div style={{fontSize: '0.75rem', color: '#166534', fontWeight: 600}}>{data.optimizationRec.action}</div>
                <div style={{fontSize: '1.125rem', color: '#14532d', fontWeight: 700}}>{data.optimizationRec.dates}</div>
              </div>
              <div style={{background: '#166534', padding: '0.5rem', borderRadius: '50%'}}>
                <CheckCircle2 size={24} color="#fff" />
              </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}><span><CheckCircle2 size={14} color="var(--success)" style={{marginRight: '0.5rem'}}/> Expected Freight Rate</span> <strong>{data.optimizationRec.expectedFreight}</strong></div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}><span><CheckCircle2 size={14} color="var(--success)" style={{marginRight: '0.5rem'}}/> Recommended Cargo Quantity</span> <strong>{data.optimizationRec.cargoQty}</strong></div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}><span><CheckCircle2 size={14} color="var(--success)" style={{marginRight: '0.5rem'}}/> Estimated Total Cost</span> <strong>{data.optimizationRec.estTotalCost}</strong></div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}><span><CheckCircle2 size={14} color="var(--success)" style={{marginRight: '0.5rem'}}/> Potential Savings</span> <strong style={{color: 'var(--success)'}}>{data.optimizationRec.potentialSavings}</strong></div>
            </div>
            <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
              <a href="#" onClick={(e) => { e.preventDefault(); setShowDetailModal(true); }} style={{fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none'}}>View Full Recommendation</a>
            </div>
          </div>

          <div className="card">
            <div className="card-title" style={{color: 'var(--text)', fontWeight: 600, marginBottom: '1rem'}}>Cost Breakdown (Estimated)</div>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div style={{width: '50%'}}>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={data.costBreakdown} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {data.costBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{width: '50%', display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                {data.costBreakdown.map((item, idx) => (
                  <div key={idx} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <span style={{width: 8, height: 8, borderRadius: '50%', background: item.fill}}></span>
                      <span style={{color: 'var(--text-muted)'}}>{item.name}</span>
                    </div>
                    <strong>{item.percent}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div style={{textAlign: 'center', marginTop: '1rem'}}>
              <a href="#" onClick={(e) => { e.preventDefault(); setShowDetailModal(true); }} style={{fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none'}}>View Cost Details</a>
            </div>
          </div>
        </div>

        {/* Footer Alerts */}
        <div className="alerts-footer">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
            <h3 style={{fontSize: '1rem', margin: 0}}>Recent Alerts & Notifications</h3>
            <a href="/alerts" style={{fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none'}}>View All Alerts</a>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            {data.recentAlerts.map(alert => (
              <div key={alert.id} className="alert-item">
                {alert.type === 'warning' && <AlertTriangle size={18} className="icon-warning" />}
                {alert.type === 'danger' && <AlertCircle size={18} className="icon-danger" />}
                {alert.type === 'info' && <Info size={18} className="icon-info" />}
                {alert.type === 'success' && <CheckCircle2 size={18} className="icon-success" />}
                <div>
                  <div style={{fontWeight: 500}}>{alert.text}</div>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{alert.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Recommendation & Cost Modal */}
        {showDetailModal && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
          }}>
            <div className="card" style={{ width: '800px', maxHeight: '90vh', overflowY: 'auto', borderTop: '4px solid var(--primary)', position: 'relative' }}>
              <button 
                onClick={() => setShowDetailModal(false)}
                style={{position: 'absolute', top: '1rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer'}}
              >&times;</button>
              
              <h2 style={{fontFamily: 'var(--font-heading)', color: '#fff', margin: '0 0 1.5rem 0'}}>AI Optimization Analysis</h2>
              
              <div style={{display: 'flex', gap: '2rem'}}>
                {/* Left Column: Recommendation */}
                <div style={{flex: 1}}>
                  <h3 style={{color: 'var(--text)', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem'}}>Charter Strategy</h3>
                  <div style={{background: 'rgba(22, 101, 52, 0.2)', border: '1px solid #166534', padding: '1.5rem', borderRadius: '8px', margin: '1rem 0'}}>
                    <div style={{color: '#4ade80', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem'}}>Action Required</div>
                    <div style={{fontSize: '1.5rem', color: '#fff', fontWeight: 700, margin: '0.5rem 0'}}>{data.optimizationRec.action}</div>
                    <div style={{color: '#a7f3d0'}}>{data.optimizationRec.dates}</div>
                  </div>
                  <p style={{color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6}}>
                    The AI engine has detected a massive localized pressure system moving into the Bay of Bengal which will spike freight rates by an estimated 15% next week. By accelerating your charter window, you lock in the current depressed rate.
                  </p>
                  
                  <h3 style={{color: 'var(--text)', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginTop: '2rem'}}>Cost vs. Savings</h3>
                  <table style={{width: '100%', fontSize: '0.875rem', marginTop: '1rem'}}>
                    <tbody>
                      <tr><td style={{padding: '0.5rem 0', color: 'var(--text-muted)'}}>Standard Cost</td><td style={{textAlign: 'right', fontWeight: 600}}>$152,400</td></tr>
                      <tr><td style={{padding: '0.5rem 0', color: 'var(--text-muted)'}}>Optimized Cost</td><td style={{textAlign: 'right', fontWeight: 600}}>{data.optimizationRec.estTotalCost}</td></tr>
                      <tr style={{borderTop: '1px solid var(--border-light)'}}>
                        <td style={{padding: '0.75rem 0', color: '#4ade80', fontWeight: 600}}>Net Savings</td>
                        <td style={{textAlign: 'right', color: '#4ade80', fontWeight: 700, fontSize: '1.1rem'}}>{data.optimizationRec.potentialSavings}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Right Column: Cost Breakdown */}
                <div style={{flex: 1}}>
                  <h3 style={{color: 'var(--text)', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem'}}>Estimated Cost Breakdown</h3>
                  
                  <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
                    {data.costBreakdown.map((item, idx) => (
                      <div key={idx} style={{background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', borderLeft: `4px solid ${item.fill}`}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem'}}>
                          <strong style={{color: '#fff'}}>{item.name}</strong>
                          <span style={{color: 'var(--text-muted)', fontWeight: 600}}>{item.percent}</span>
                        </div>
                        <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>
                          {item.name === 'Freight' ? 'Calculated at $18.50/MT locked rate.' : 
                           item.name === 'Bunker (Fuel)' ? 'Assumes 450MT VLSFO consumption.' :
                           item.name === 'Port Charges' ? 'Includes Vizag docking & pilotage.' : 'Contingency and insurance.'}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button onClick={() => setShowDetailModal(false)} className="premium-btn" style={{width: '100%', marginTop: '2rem', padding: '0.75rem'}}>
                    Acknowledge & Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Placeholder for other pages
const Placeholder = ({ title }) => (
  <div className="main-content">
    <div className="topbar">
      <h2 style={{margin: 0, fontSize: '1.25rem'}}>{title}</h2>
    </div>
    <div className="dashboard-content">
      <div className="card">
        <p>This module is fully integrated with the sidebar layout and is ready for implementation.</p>
      </div>
    </div>
  </div>
);

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadSettings = () => {
      const saved = localStorage.getItem('settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setLanguage(parsed.language || 'English');
          if (parsed.theme) {
            document.documentElement.classList.remove('light-theme');
          } else {
            document.documentElement.classList.add('light-theme');
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    
    loadSettings();
    window.addEventListener('language-change', loadSettings);
    return () => window.removeEventListener('language-change', loadSettings);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    if (authMode === 'login') {
      return <Login onLogin={() => setIsAuthenticated(true)} onNavigateSignup={() => setAuthMode('signup')} />;
    } else {
      return <Signup onSignup={() => setIsAuthenticated(true)} onNavigateLogin={() => setAuthMode('login')} />;
    }
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar language={language} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<OceanMap />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/demand" element={<Demand />} />
          <Route path="/vessels" element={<Vessels />} />
          <Route path="/planner" element={<Ports />} />
          <Route path="/insights" element={<Trends />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<DataFeed />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}
