import { useState } from 'react';
import { ArrowRight, User, Lock } from 'lucide-react';

export default function Login({ onLogin, onNavigateSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(email && password) {
      fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      .then(res => res.json())
      .then(data => {
        if(data.error) {
          alert(data.error);
        } else {
          onLogin();
        }
      })
      .catch(err => {
        console.error('Login failed', err);
        alert('Login failed');
      });
    }
  };

  return (
    <div style={{
      height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-dark)', backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(14, 165, 233, 0.05), transparent 25%), radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.05), transparent 25%)'
    }}>
      <div className="card" style={{ width: '400px', padding: '3rem 2rem', textAlign: 'center', borderTop: '4px solid var(--primary)' }}>
        <img src="/logo.jpg" alt="Ocean Cast" style={{width: 80, height: 80, borderRadius: 12, marginBottom: '1rem', boxShadow: '0 0 20px var(--primary-glow)'}} />
        <h2 style={{fontFamily: 'var(--font-heading)', color: '#fff', margin: '0 0 0.5rem 0'}}>Welcome Back</h2>
        <p style={{color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem'}}>Sign in to the Predictive Maritime Engine</p>
        
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
          <div style={{position: 'relative', textAlign: 'left'}}>
            <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase'}}>Email Address</label>
            <div style={{position: 'relative'}}>
              <User size={18} color="var(--text-muted)" style={{position: 'absolute', left: 12, top: 11}} />
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@oceancast.com" 
                style={{
                  width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--border-light)', color: '#fff', 
                  padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '6px', outline: 'none', transition: 'border 0.3s'
                }} 
              />
            </div>
          </div>
          
          <div style={{position: 'relative', textAlign: 'left'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
              <label style={{fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase'}}>Password</label>
              <a href="#" style={{fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none'}}>Forgot?</a>
            </div>
            <div style={{position: 'relative'}}>
              <Lock size={18} color="var(--text-muted)" style={{position: 'absolute', left: 12, top: 11}} />
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" 
                style={{
                  width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--border-light)', color: '#fff', 
                  padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '6px', outline: 'none', transition: 'border 0.3s'
                }} 
              />
            </div>
          </div>

          <button type="submit" className="premium-btn" style={{marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.75rem'}}>
            Sign In <ArrowRight size={16} />
          </button>
        </form>
        
        <div style={{marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)'}}>
          Don't have an account? <span onClick={onNavigateSignup} style={{color: 'var(--primary)', cursor: 'pointer', fontWeight: 600}}>Create one</span>
        </div>
      </div>
    </div>
  );
}
