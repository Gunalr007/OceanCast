import { useState } from 'react';
import { ArrowRight, User, Lock, Mail, Building } from 'lucide-react';

export default function Signup({ onSignup, onNavigateLogin }) {
  const [formData, setFormData] = useState({
    name: '', email: '', company: '', password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(formData.email && formData.password) {
      fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(res => res.json())
      .then(data => {
        if(data.error) {
          alert(data.error);
        } else {
          onSignup();
        }
      })
      .catch(err => {
        console.error('Signup failed', err);
        alert('Signup failed');
      });
    }
  };

  return (
    <div style={{
      height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-dark)', backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(14, 165, 233, 0.05), transparent 25%), radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.05), transparent 25%)'
    }}>
      <div className="card" style={{ width: '450px', padding: '3rem 2rem', textAlign: 'center', borderTop: '4px solid var(--secondary)' }}>
        <h2 style={{fontFamily: 'var(--font-heading)', color: '#fff', margin: '0 0 0.5rem 0'}}>Create an Account</h2>
        <p style={{color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem'}}>Join the future of maritime intelligence</p>
        
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
          
          <div style={{display: 'flex', gap: '1rem'}}>
            <div style={{position: 'relative', textAlign: 'left', flex: 1}}>
              <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase'}}>Full Name</label>
              <div style={{position: 'relative'}}>
                <User size={18} color="var(--text-muted)" style={{position: 'absolute', left: 12, top: 11}} />
                <input 
                  type="text" required placeholder="John Doe" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{
                    width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--border-light)', color: '#fff', 
                    padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '6px', outline: 'none'
                  }} 
                />
              </div>
            </div>
            <div style={{position: 'relative', textAlign: 'left', flex: 1}}>
              <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase'}}>Company</label>
              <div style={{position: 'relative'}}>
                <Building size={18} color="var(--text-muted)" style={{position: 'absolute', left: 12, top: 11}} />
                <input 
                  type="text" required placeholder="Logistics Inc" 
                  value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}
                  style={{
                    width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--border-light)', color: '#fff', 
                    padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '6px', outline: 'none'
                  }} 
                />
              </div>
            </div>
          </div>

          <div style={{position: 'relative', textAlign: 'left'}}>
            <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase'}}>Work Email</label>
            <div style={{position: 'relative'}}>
              <Mail size={18} color="var(--text-muted)" style={{position: 'absolute', left: 12, top: 11}} />
              <input 
                type="email" required placeholder="admin@oceancast.com" 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                style={{
                  width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--border-light)', color: '#fff', 
                  padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '6px', outline: 'none'
                }} 
              />
            </div>
          </div>
          
          <div style={{position: 'relative', textAlign: 'left'}}>
            <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase'}}>Password</label>
            <div style={{position: 'relative'}}>
              <Lock size={18} color="var(--text-muted)" style={{position: 'absolute', left: 12, top: 11}} />
              <input 
                type="password" required placeholder="••••••••" 
                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                style={{
                  width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--border-light)', color: '#fff', 
                  padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '6px', outline: 'none'
                }} 
              />
            </div>
          </div>

          <button type="submit" className="premium-btn" style={{marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.75rem'}}>
            Create Account <ArrowRight size={16} />
          </button>
        </form>
        
        <div style={{marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)'}}>
          Already have an account? <span onClick={onNavigateLogin} style={{color: 'var(--primary)', cursor: 'pointer', fontWeight: 600}}>Sign In</span>
        </div>
      </div>
    </div>
  );
}
