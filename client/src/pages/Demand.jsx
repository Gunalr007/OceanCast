import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Filter, TrendingUp, TrendingDown, Cpu, ArrowRight } from 'lucide-react';

export default function Demand() {
  const [demandData, setDemandData] = useState({ commodityData: [], totalDemand: 0, regionData: [], forecastData: [] });
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/demand')
      .then(res => res.json())
      .then(data => {
        if (data) setDemandData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch demand', err);
        setLoading(false);
      });
  }, []);

  const [commodity, setCommodity] = useState('All');
  const [region, setRegion] = useState('East Coast India');
  const [period, setPeriod] = useState('Next 30 Days');
  const [forecast, setForecast] = useState('Predicted');

  if (loading) return <div style={{padding: '2rem', color: '#64748b'}}>Loading demand data...</div>;

  const { commodityData, totalDemand, regionData, forecastData } = demandData;

  // Dynamic Filtering Logic based on selected options
  const filteredCommodityData = commodityData.filter(item => {
    if (commodity === 'All') return true;
    return item.name.toLowerCase() === commodity.toLowerCase();
  });

  const filteredTotalDemand = filteredCommodityData.reduce((acc, curr) => acc + curr.value, 0).toFixed(2);

  const filteredRegionData = regionData.filter(item => {
    if (region === 'Global') return true;
    if (region === 'East Coast India') {
      return item.region.includes('India') || item.region === 'Southeast Asia';
    }
    return item.region.toLowerCase() === region.toLowerCase();
  });

  const filteredForecastData = forecastData.filter(item => {
    if (commodity === 'All') return true;
    return item.commodity.toLowerCase() === commodity.toLowerCase();
  }).map(item => {
    const mult = period === 'Next 90 Days' ? 2.8 : 1.0;
    return {
      ...item,
      current: parseFloat((item.current * mult).toFixed(2)),
      forecast: parseFloat((item.forecast * mult).toFixed(2)),
      change: parseFloat((item.change * (period === 'Next 90 Days' ? 1.5 : 1.0)).toFixed(1))
    };
  });

  // Dynamic AI Insight content
  const getAIInsight = () => {
    if (commodity === 'Coal') {
      return {
        text: `Coal demand is expected to increase by 10.4% over the next 30 days due to rising energy requirements in East Coast India. Recommending early booking of Capesize/Panamax vessels.`,
        action: `Secure Panamax Capacity`
      };
    }
    if (commodity === 'Iron Ore') {
      return {
        text: `Iron Ore demand is projected to grow by 8.3% over the next 30 days. Visakhapatnam steel output is driving this demand. Secure Supramax/Capesize logistics.`,
        action: `Book Capesize Fleet`
      };
    }
    return {
      text: `Combined commodity demand across East Coast India is projected to rise by 7.2% overall, led mainly by Coal (42%) and Iron Ore (28%).`,
      action: `Optimize Fleet Charter`
    };
  };

  const aiInsight = getAIInsight();

  return (
    <div className="main-content">
      <div className="topbar">
        <h2 style={{margin: 0, fontSize: '1.25rem'}}>Cargo Demand & Forecast Analysis</h2>
      </div>

      <div className="dashboard-content" style={{paddingBottom: '2rem'}}>
        
        {/* Interactive Filter Bar */}
        <div className="card" style={{padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <Filter size={18} color="var(--primary)"/>
          <select value={commodity} onChange={(e) => setCommodity(e.target.value)} style={{background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-light)', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer'}}>
            <option value="All">Commodity: All</option>
            <option value="Coal">Commodity: Coal</option>
            <option value="Iron Ore">Commodity: Iron Ore</option>
          </select>
          <select value={region} onChange={(e) => setRegion(e.target.value)} style={{background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-light)', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer'}}>
            <option value="East Coast India">Region: East Coast India</option>
            <option value="Southeast Asia">Region: Southeast Asia</option>
            <option value="Global">Region: Global</option>
          </select>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} style={{background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-light)', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer'}}>
            <option value="Next 30 Days">Period: Next 30 Days</option>
            <option value="Next 90 Days">Period: Next 90 Days</option>
          </select>
          <select value={forecast} onChange={(e) => setForecast(e.target.value)} style={{background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-light)', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer'}}>
            <option value="Predicted">Forecast: Predicted</option>
            <option value="Actual">Forecast: Actual</option>
          </select>
        </div>

        {/* Charts Grid */}
        <div className="grid-3" style={{marginBottom: '1.5rem'}}>
          
          {/* Enhanced Donut Chart */}
          <div className="card" style={{height: '380px', display: 'flex', flexDirection: 'column'}}>
            <div className="card-title" style={{color: 'var(--text)', fontWeight: 600}}>Demand by Commodity</div>
            
            <div style={{display: 'flex', flex: 1, alignItems: 'center', marginTop: '1rem'}}>
              {/* Donut Container */}
              <div style={{flex: 1, position: 'relative', height: '100%'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={filteredCommodityData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {filteredCommodityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{background: '#0f172a', border: '1px solid #334155', borderRadius: '4px'}}/>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}>
                  <div style={{fontSize: '1.25rem', fontWeight: 700, color: '#fff'}}>{filteredTotalDemand}M</div>
                  <div style={{fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px'}}>Total MT</div>
                </div>
              </div>
              
              {/* Custom Legend */}
              <div style={{flex: 1.2, display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                {filteredCommodityData.map((item, idx) => (
                  <div key={idx} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <div style={{width: 10, height: 10, borderRadius: '50%', background: item.fill}}></div>
                      <span style={{color: 'var(--text-muted)'}}>{item.name}</span>
                    </div>
                    <div style={{fontWeight: 600}}>
                      <span style={{color: '#fff', marginRight: '0.5rem'}}>{item.percent}%</span>
                      <span style={{color: 'var(--primary)'}}>{item.value}M MT</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Regional Bar Chart */}
          <div className="card" style={{height: '380px'}}>
            <div className="card-title" style={{color: 'var(--text)', fontWeight: 600, marginBottom: '1rem'}}>Regional Demand Overview</div>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={filteredRegionData} layout="vertical" margin={{top: 0, right: 40, left: 20, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" hide />
                <YAxis dataKey="region" type="category" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11}} width={100} />
                <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{background: '#0f172a', border: '1px solid #334155'}}/>
                <Bar dataKey="demand" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={20}>
                  <LabelList dataKey="demand" position="right" formatter={(val) => `${val}M MT`} fill="#fff" fontSize={11} fontWeight={600} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Demand Forecast Table */}
          <div className="card" style={{height: '380px', display: 'flex', flexDirection: 'column'}}>
            <div className="card-title" style={{color: 'var(--text)', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <TrendingUp size={18} color="#f97316"/> 
              Demand Forecast ({period})
            </div>
            
            <table className="data-table" style={{flex: 1}}>
              <thead>
                <tr>
                  <th style={{padding: '0.5rem', fontSize: '0.75rem'}}>Commodity</th>
                  <th style={{padding: '0.5rem', fontSize: '0.75rem'}}>Current</th>
                  <th style={{padding: '0.5rem', fontSize: '0.75rem'}}>Forecast</th>
                  <th style={{padding: '0.5rem', fontSize: '0.75rem'}}>Change</th>
                </tr>
              </thead>
              <tbody>
                {filteredForecastData.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{padding: '0.75rem 0.5rem', fontWeight: 500}}>{row.commodity}</td>
                    <td style={{padding: '0.75rem 0.5rem', color: 'var(--text-muted)'}}>{row.current}M</td>
                    <td style={{padding: '0.75rem 0.5rem', color: '#fff'}}>{row.forecast}M</td>
                    <td style={{padding: '0.75rem 0.5rem'}}>
                      {row.change >= 0 ? (
                        <span style={{color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, fontSize: '0.75rem'}}><TrendingUp size={12}/> {row.change}%</span>
                      ) : (
                        <span style={{color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, fontSize: '0.75rem'}}><TrendingDown size={12}/> {row.change}%</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insight Box */}
        <div style={{background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.3)', borderRadius: '8px', padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
          <div style={{background: '#f97316', padding: '1rem', borderRadius: '50%'}}>
            <Cpu size={32} color="#fff" />
          </div>
          <div style={{flex: 1}}>
            <h3 style={{margin: '0 0 0.5rem 0', color: '#f97316', fontSize: '1.125rem'}}>AI Demand Insight</h3>
            <p style={{margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6}}>
              {aiInsight.text}
            </p>
          </div>
          <div>
            <div style={{fontSize: '0.75rem', textTransform: 'uppercase', color: '#f97316', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '1px'}}>Recommended Action</div>
            <button className="premium-btn" style={{background: '#f97316', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem'}}>
              {aiInsight.action} <ArrowRight size={16}/>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
