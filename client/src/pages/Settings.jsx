import React, { useState } from 'react';
import axios from 'axios';
import { Settings as SettingsIcon, Cpu, Radio, Bell, Ship, Key, ChevronRight, Activity, Network } from 'lucide-react';

export default function Settings() {
  const [apiResults, setApiResults] = useState(null);
  const [testingApis, setTestingApis] = useState(false);
  const [lastTested, setLastTested] = useState(null);

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Apply theme classes on load
        if (parsed.theme) {
          document.documentElement.classList.remove('light-theme');
        } else {
          document.documentElement.classList.add('light-theme');
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return {
      theme: true, // true = Dark, false = Light
      language: 'English',
      timezone: 'IST (UTC+5:30)',
      currency: 'USD',
      forecastHorizon: '7 Days',
      confidence: 85,
      modelVersion: 'OceanCast ML v2.4',
      autoRetraining: true,
      explainableAI: true,
      autoRefresh: '5 seconds',
      realTimeFeed: true,
      strategy: 'balanced',
      riskLevel: 'Medium',
      vesselType: 'All Valid Ships',
      alertFreight: true,
      alertCongestion: true,
      alertWeather: true,
      alertAI: true,
      minRateChange: '5%'
    };
  });

  const updateSetting = (key, value) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      localStorage.setItem('settings', JSON.stringify(newSettings));
      
      if (key === 'theme') {
        if (value) {
          document.documentElement.classList.remove('light-theme');
        } else {
          document.documentElement.classList.add('light-theme');
        }
      }
      
      if (key === 'language') {
        window.dispatchEvent(new Event('language-change'));
      }
      
      return newSettings;
    });
  };

  const handleTestApis = async () => {
    setTestingApis(true);
    setApiResults(null);
    try {
      const res = await axios.get('http://localhost:5000/api/integrations/test');
      setApiResults(res.data.results);
      setLastTested(new Date());
    } catch (err) {
      setApiResults([
        { name: 'Ministry of Ports', key: '••••••••••••4F82', status: 'error', latency: 0, message: 'Server unreachable' },
        { name: 'UN Comtrade', key: '••••••••••••B921', status: 'error', latency: 0, message: 'Server unreachable' },
        { name: 'Baltic Exchange API', key: '••••••••••••7A3C', status: 'error', latency: 0, message: 'Server unreachable' },
        { name: 'Weather API (NOAA)', key: '••••••••••••119D', status: 'error', latency: 0, message: 'Server unreachable' },
      ]);
      setLastTested(new Date());
    } finally {
      setTestingApis(false);
    }
  };

  // Helper Components
  const Toggle = ({ checked, onChange }) => (
    <div 
      className={`toggle ${checked ? 'on' : ''}`} 
      onClick={() => onChange(!checked)}
      style={{cursor: 'pointer'}}
    ></div>
  );

  const Dropdown = ({ value, options, onChange }) => (
    <div className="settings-control" style={{position: 'relative'}}>
      {value} <ChevronRight size={16} color="var(--text-muted)"/>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        style={{
          position: 'absolute', opacity: 0, left: 0, top: 0, width: '100%', height: '100%', cursor: 'pointer'
        }}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  return (
    <div className="main-content">
      <div className="topbar">
        <div>
          <h2 style={{margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <SettingsIcon size={20} color="var(--primary)" /> 
            Settings & AI Control Center
          </h2>
          <span style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>
            Manage your Ocean Cast prediction engine and API integrations
          </span>
        </div>
      </div>

      <div className="dashboard-content" style={{paddingBottom: '2rem'}}>
        <div style={{display: 'flex', gap: '1.5rem', alignItems: 'flex-start'}}>
          
          {/* Left Column */}
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            
            {/* 1. GENERAL */}
            <div className="card">
              <div className="card-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)', fontWeight: 600, borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1rem'}}>
                <SettingsIcon size={16} color="var(--text-muted)"/> GENERAL
              </div>
              
              <div className="settings-row">
                <span className="settings-label">Theme</span>
                <div className="settings-control">
                  {settings.theme ? 'Dark Mode' : 'Light Mode'} 
                  <Toggle checked={settings.theme} onChange={(val) => updateSetting('theme', val)} />
                </div>
              </div>
              <div className="settings-row">
                <span className="settings-label">Language</span>
                <Dropdown 
                  value={settings.language} 
                  options={['English', 'Spanish', 'French', 'Mandarin']} 
                  onChange={(val) => updateSetting('language', val)} 
                />
              </div>
              <div className="settings-row">
                <span className="settings-label">Time Zone</span>
                <Dropdown 
                  value={settings.timezone} 
                  options={['IST (UTC+5:30)', 'GMT (UTC+0)', 'EST (UTC-5)', 'SGT (UTC+8)']} 
                  onChange={(val) => updateSetting('timezone', val)} 
                />
              </div>
              <div className="settings-row">
                <span className="settings-label">Currency</span>
                <Dropdown 
                  value={settings.currency} 
                  options={['USD', 'EUR', 'INR', 'GBP']} 
                  onChange={(val) => updateSetting('currency', val)} 
                />
              </div>
            </div>

            {/* 2. AI PREDICTION */}
            <div className="card">
              <div className="card-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)', fontWeight: 600, borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1rem'}}>
                <Cpu size={16} color="#0ea5e9"/> AI PREDICTION
              </div>
              
              <div className="settings-row">
                <span className="settings-label">Forecast Horizon</span>
                <Dropdown 
                  value={settings.forecastHorizon} 
                  options={['3 Days', '7 Days', '14 Days', '30 Days']} 
                  onChange={(val) => updateSetting('forecastHorizon', val)} 
                />
              </div>
              <div className="settings-row" style={{flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                  <span className="settings-label">Prediction Confidence Threshold</span>
                  <span className="settings-control" style={{color: '#0ea5e9', fontWeight: 600}}>{settings.confidence}%</span>
                </div>
                <input 
                  type="range" min="50" max="99" 
                  value={settings.confidence} 
                  onChange={(e) => updateSetting('confidence', e.target.value)}
                  className="range-slider" 
                />
              </div>
              <div className="settings-row">
                <span className="settings-label">Model Version</span>
                <Dropdown 
                  value={settings.modelVersion} 
                  options={['OceanCast ML v2.4', 'OceanCast ML v2.3 (Legacy)', 'OceanCast ML v3.0 (Beta)']} 
                  onChange={(val) => updateSetting('modelVersion', val)} 
                />
              </div>
              <div className="settings-row">
                <span className="settings-label">Auto Retraining</span>
                <div className="settings-control">
                  {settings.autoRetraining ? 'Enabled' : 'Disabled'} 
                  <Toggle checked={settings.autoRetraining} onChange={(val) => updateSetting('autoRetraining', val)} />
                </div>
              </div>
              <div className="settings-row">
                <span className="settings-label">Explainable AI (Logic Tracing)</span>
                <div className="settings-control">
                  {settings.explainableAI ? 'Enabled' : 'Disabled'} 
                  <Toggle checked={settings.explainableAI} onChange={(val) => updateSetting('explainableAI', val)} />
                </div>
              </div>
            </div>

            {/* 3. LIVE DATA */}
            <div className="card">
              <div className="card-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)', fontWeight: 600, borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1rem'}}>
                <Radio size={16} color="#10b981"/> LIVE DATA
              </div>
              
              <div className="settings-row">
                <span className="settings-label">Auto Refresh</span>
                <Dropdown 
                  value={settings.autoRefresh} 
                  options={['1 second', '5 seconds', '30 seconds', '1 minute']} 
                  onChange={(val) => updateSetting('autoRefresh', val)} 
                />
              </div>
              <div className="settings-row">
                <span className="settings-label">Real-Time Feed</span>
                <div className="settings-control">
                  {settings.realTimeFeed ? 'Enabled' : 'Disabled'} 
                  <Toggle checked={settings.realTimeFeed} onChange={(val) => updateSetting('realTimeFeed', val)} />
                </div>
              </div>
              <div style={{marginTop: '1rem'}}>
                <span className="settings-label" style={{marginBottom: '0.75rem', display: 'block'}}>Active Data Sources</span>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--surface-light)', padding: '1rem', borderRadius: '8px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem'}}>
                    <span style={{color: '#fff'}}><span className="dot-green"></span> Ministry of Ports</span>
                    <span style={{color: '#10b981', fontWeight: 600}}>Connected</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem'}}>
                    <span style={{color: '#fff'}}><span className="dot-green"></span> UN Comtrade</span>
                    <span style={{color: '#10b981', fontWeight: 600}}>Connected</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem'}}>
                    <span style={{color: '#fff'}}><span className="dot-green"></span> Baltic Exchange</span>
                    <span style={{color: '#10b981', fontWeight: 600}}>Connected</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem'}}>
                    <span style={{color: '#fff'}}><span className="dot-green"></span> Weather API</span>
                    <span style={{color: '#10b981', fontWeight: 600}}>Connected</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            
            {/* 4. CHARTERING PREFERENCES */}
            <div className="card" style={{border: '1px solid rgba(14, 165, 233, 0.3)', background: 'linear-gradient(180deg, var(--surface) 0%, rgba(14, 165, 233, 0.05) 100%)'}}>
              <div className="card-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)', fontWeight: 600, borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1rem'}}>
                <Ship size={16} color="#0ea5e9"/> CHARTERING PREFERENCES (AI OVERRIDE)
              </div>
              
              <div style={{marginBottom: '1.5rem'}}>
                <span className="settings-label" style={{marginBottom: '0.75rem', display: 'block'}}>Default Decision Strategy</span>
                <div style={{display: 'flex', gap: '1rem'}}>
                  <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: settings.strategy === 'conservative' ? '#fff' : 'var(--text-muted)'}}>
                    <input type="radio" name="strategy" checked={settings.strategy === 'conservative'} onChange={() => updateSetting('strategy', 'conservative')} /> Conservative
                  </label>
                  <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: settings.strategy === 'balanced' ? '#fff' : 'var(--text-muted)'}}>
                    <input type="radio" name="strategy" checked={settings.strategy === 'balanced'} onChange={() => updateSetting('strategy', 'balanced')} /> Balanced
                  </label>
                  <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: settings.strategy === 'aggressive' ? '#fff' : 'var(--text-muted)'}}>
                    <input type="radio" name="strategy" checked={settings.strategy === 'aggressive'} onChange={() => updateSetting('strategy', 'aggressive')} /> Aggressive
                  </label>
                </div>
              </div>

              <div>
                <span className="settings-label" style={{marginBottom: '0.75rem', display: 'block'}}>AI Decision Logic Rules</span>
                <div style={{background: 'var(--bg-dark)', borderRadius: '8px', overflow: 'hidden'}}>
                  <table style={{width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse'}}>
                    <tbody>
                      <tr style={{borderBottom: '1px solid var(--border)'}}>
                        <td style={{padding: '0.75rem 1rem', color: '#a1a1aa'}}>Expected Rate Drop</td>
                        <td style={{padding: '0.75rem 1rem', fontWeight: 600, color: '#f59e0b'}}>&gt; {settings.minRateChange}</td>
                        <td style={{padding: '0.75rem 1rem', color: '#a1a1aa'}}>→</td>
                        <td style={{padding: '0.75rem 1rem', fontWeight: 700, color: '#f59e0b'}}>WAIT</td>
                      </tr>
                      <tr style={{borderBottom: '1px solid var(--border)'}}>
                        <td style={{padding: '0.75rem 1rem', color: '#a1a1aa'}}>Expected Rate Increase</td>
                        <td style={{padding: '0.75rem 1rem', fontWeight: 600, color: '#ef4444'}}>&gt; {settings.minRateChange}</td>
                        <td style={{padding: '0.75rem 1rem', color: '#a1a1aa'}}>→</td>
                        <td style={{padding: '0.75rem 1rem', fontWeight: 700, color: '#10b981'}}>CHARTER NOW</td>
                      </tr>
                      <tr>
                        <td style={{padding: '0.75rem 1rem', color: '#a1a1aa'}}>High Weather Risk</td>
                        <td style={{padding: '0.75rem 1rem'}}></td>
                        <td style={{padding: '0.75rem 1rem', color: '#a1a1aa'}}>→</td>
                        <td style={{padding: '0.75rem 1rem', fontWeight: 700, color: '#ef4444'}}>AVOID</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{marginTop: '1.5rem'}}>
                <div className="settings-row">
                  <span className="settings-label">Maximum Route Risk Level</span>
                  <Dropdown 
                    value={settings.riskLevel} 
                    options={['Low', 'Medium', 'High', 'Critical']} 
                    onChange={(val) => updateSetting('riskLevel', val)} 
                  />
                </div>
                <div className="settings-row" style={{border: 'none', paddingBottom: 0}}>
                  <span className="settings-label">Preferred Vessel Type</span>
                  <Dropdown 
                    value={settings.vesselType} 
                    options={['All Valid Ships', 'Panamax Only', 'Capesize Only', 'Supramax Only']} 
                    onChange={(val) => updateSetting('vesselType', val)} 
                  />
                </div>
              </div>

            </div>

            {/* 5. ALERTS */}
            <div className="card">
              <div className="card-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)', fontWeight: 600, borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1rem'}}>
                <Bell size={16} color="#f59e0b"/> ALERTS & NOTIFICATIONS
              </div>
              
              <div className="settings-row">
                <span className="settings-label">Freight Rate Alert</span>
                <div className="settings-control">
                  {settings.alertFreight ? 'Enabled' : 'Disabled'} 
                  <Toggle checked={settings.alertFreight} onChange={(val) => updateSetting('alertFreight', val)} />
                </div>
              </div>
              <div className="settings-row">
                <span className="settings-label">Port Congestion Alert</span>
                <div className="settings-control">
                  {settings.alertCongestion ? 'Enabled' : 'Disabled'} 
                  <Toggle checked={settings.alertCongestion} onChange={(val) => updateSetting('alertCongestion', val)} />
                </div>
              </div>
              <div className="settings-row">
                <span className="settings-label">Weather Risk Alert</span>
                <div className="settings-control">
                  {settings.alertWeather ? 'Enabled' : 'Disabled'} 
                  <Toggle checked={settings.alertWeather} onChange={(val) => updateSetting('alertWeather', val)} />
                </div>
              </div>
              <div className="settings-row">
                <span className="settings-label">AI Decision Alert</span>
                <div className="settings-control">
                  {settings.alertAI ? 'Enabled' : 'Disabled'} 
                  <Toggle checked={settings.alertAI} onChange={(val) => updateSetting('alertAI', val)} />
                </div>
              </div>
              <div className="settings-row" style={{border: 'none', paddingBottom: 0}}>
                <span className="settings-label">Minimum Rate Change Threshold</span>
                <Dropdown 
                  value={settings.minRateChange} 
                  options={['1%', '2%', '5%', '10%']} 
                  onChange={(val) => updateSetting('minRateChange', val)} 
                />
              </div>
            </div>

            {/* 6. API MANAGEMENT */}
            <div className="card">
              <div className="card-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)', fontWeight: 600, borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1rem'}}>
                <Key size={16} color="#a855f7"/> API & INTEGRATIONS
              </div>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem'}}>
                {(apiResults || [
                  { name: 'Ministry of Ports', key: '••••••••••••4F82', status: 'connected', latency: null },
                  { name: 'UN Comtrade', key: '••••••••••••B921', status: 'connected', latency: null },
                  { name: 'Baltic Exchange API', key: '••••••••••••7A3C', status: 'connected', latency: null },
                  { name: 'Weather API (NOAA)', key: '••••••••••••119D', status: 'connected', latency: null },
                ]).map((api, idx) => (
                  <div key={idx} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-light)'}}>
                    <div>
                      <div style={{fontSize: '0.875rem', fontWeight: 600, color: '#fff'}}>{api.name}</div>
                      <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace'}}>{api.key}</div>
                    </div>
                    {testingApis ? (
                      <span style={{background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                        <Activity size={12} className="spin"/> Testing...
                      </span>
                    ) : api.status === 'error' ? (
                      <div style={{textAlign: 'right'}}>
                        <span style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem'}}>
                          <span className="dot-red" style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block'}}></span> Failed
                        </span>
                        {api.message && <div style={{fontSize: '0.7rem', color: '#ef4444', marginTop: '0.25rem'}}>{api.message}</div>}
                      </div>
                    ) : (
                      <span style={{background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                        <span className="dot-green"></span> Connected {api.latency ? `(${api.latency}ms)` : ''}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              
              <button onClick={handleTestApis} disabled={testingApis} className="premium-btn" style={{width: '100%', padding: '0.75rem', background: 'var(--surface-light)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: testingApis ? 'not-allowed' : 'pointer'}}>
                {testingApis ? <><Activity size={16} className="spin"/> Testing Connections...</> : <><Network size={16}/> Test All Connections</>}
              </button>
              {lastTested && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.75rem'}}>
                  Last tested: {lastTested.toLocaleTimeString()}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .settings-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border-light); }
        .settings-row:last-child { border-bottom: none; padding-bottom: 0; }
        .settings-label { color: #a1a1aa; font-size: 0.875rem; font-weight: 500; }
        .settings-control { display: flex; align-items: center; gap: 0.5rem; color: #fff; font-size: 0.875rem; font-weight: 600; cursor: pointer; }
        .toggle { width: 36px; height: 20px; background: var(--bg-dark); border-radius: 10px; position: relative; border: 1px solid var(--border-light); transition: 0.3s; }
        .toggle::after { content: ''; position: absolute; width: 14px; height: 14px; background: #fff; border-radius: 50%; top: 2px; left: 2px; transition: 0.3s; }
        .toggle.on { background: #10b981; border-color: #10b981; }
        .toggle.on::after { left: 18px; }
        .range-slider { -webkit-appearance: none; width: 100%; height: 6px; background: var(--bg-dark); border-radius: 3px; outline: none; }
        .range-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #0ea5e9; cursor: pointer; box-shadow: 0 0 10px rgba(14, 165, 233, 0.5); }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
