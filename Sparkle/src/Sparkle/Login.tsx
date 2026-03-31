import { useState } from 'react';
import API from '../api';

const Login = ({ isOpen, onClose, onLoginSuccess }: {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: any) => void;
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const response = await API.post(endpoint, payload);

      localStorage.setItem('sparkle_token', response.data.token);
      localStorage.setItem('sparkle_user', JSON.stringify(response.data.user));

      setSuccess(response.data.message);
      if (onLoginSuccess) onLoginSuccess(response.data.user);

      setTimeout(() => {
        setSuccess('');
        setForm({ name: '', email: '', password: '' });
        onClose();
      }, 1400);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (valid?: boolean): React.CSSProperties => ({
    width: '100%', padding: '13px 16px', borderRadius: '12px',
    border: `1.5px solid ${error && valid === false ? '#fca5a5' : '#e5e7eb'}`,
    fontSize: '15px', color: '#1a1a2e', outline: 'none',
    boxSizing: 'border-box', background: '#fafafa',
    fontFamily: 'inherit', transition: 'border-color 0.2s',
  });

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,12,41,0.75)',
        zIndex: 10000, backdropFilter: 'blur(8px)',
      }} />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '440px', maxWidth: '92vw',
        background: '#fff', borderRadius: '24px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
        zIndex: 11000, overflow: 'hidden',
        animation: 'fadeUp 0.35s ease',
        fontFamily: "'Sora', system-ui, sans-serif",
      }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #0d1b4b 100%)',
          padding: '32px 28px 28px', textAlign: 'center', position: 'relative',
        }}>
          {/* Close Button */}
          <button onClick={onClose} style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'rgba(255,255,255,0.1)', border: 'none',
            borderRadius: '8px', width: '32px', height: '32px',
            cursor: 'pointer', color: '#fff', fontSize: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          >✕</button>

          <div style={{
            width: '60px', height: '60px', borderRadius: '16px',
            background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', margin: '0 auto 16px',
          }}>✨</div>

          <h2 style={{ color: '#fff', margin: '0 0 6px', fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px' }}>
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', margin: 0, fontSize: '14px' }}>
            {mode === 'login' ? 'Sign in to continue your skincare journey' : 'Join thousands of happy customers'}
          </p>
        </div>

        {/* Mode Tabs */}
        <div style={{ display: 'flex', background: '#f9fafb', borderBottom: '1px solid #f0f0f0' }}>
          {(['login', 'register'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); setSuccess(''); }} style={{
              flex: 1, padding: '14px', fontWeight: '700', fontSize: '14px',
              border: 'none', cursor: 'pointer',
              background: mode === m ? '#fff' : 'transparent',
              color: mode === m ? '#0d6efd' : '#aaa',
              borderBottom: mode === m ? '2.5px solid #0d6efd' : '2.5px solid transparent',
              transition: 'all 0.2s', letterSpacing: '-0.2px',
            }}>
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
          {mode === 'register' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '6px', letterSpacing: '0.5px' }}>FULL NAME</label>
              <input
                style={inputStyle()}
                placeholder="Enter your full name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                onFocus={e => (e.target.style.borderColor = '#0d6efd')}
                onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
              />
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '6px', letterSpacing: '0.5px' }}>EMAIL ADDRESS</label>
            <input
              style={inputStyle()}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onFocus={e => (e.target.style.borderColor = '#0d6efd')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '6px', letterSpacing: '0.5px' }}>PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <input
                style={{ ...inputStyle(), paddingRight: '48px' }}
                type={showPassword ? 'text' : 'password'}
                placeholder={mode === 'register' ? 'Minimum 6 characters' : 'Enter your password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onFocus={e => (e.target.style.borderColor = '#0d6efd')}
                onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#aaa', fontSize: '16px',
              }}>{showPassword ? '🙈' : '👁️'}</button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fca5a5',
              borderRadius: '10px', padding: '12px 16px', marginBottom: '16px',
              color: '#dc2626', fontSize: '14px', fontWeight: '600',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{
              background: '#f0fdf4', border: '1px solid #86efac',
              borderRadius: '10px', padding: '12px 16px', marginBottom: '16px',
              color: '#16a34a', fontSize: '14px', fontWeight: '600',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              ✅ {success}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading} style={{
            width: '100%',
            background: loading ? '#93c5fd' : 'linear-gradient(135deg, #0d6efd, #0056d2)',
            color: '#fff', border: 'none', borderRadius: '14px',
            padding: '15px', fontWeight: '800', fontSize: '15px',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 6px 20px rgba(13,110,253,0.3)',
            transition: 'all 0.2s', letterSpacing: '-0.3px',
          }}>
            {loading
              ? '⏳ Please wait...'
              : mode === 'login' ? 'Sign In →' : 'Create Account →'
            }
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
            <span style={{ fontSize: '12px', color: '#ccc', fontWeight: '600' }}>
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
          </div>
          <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} style={{
            width: '100%', background: 'none', color: '#0d6efd',
            border: '1.5px solid #e5e7eb', borderRadius: '14px',
            padding: '13px', fontWeight: '700', fontSize: '14px',
            cursor: 'pointer', marginTop: '12px', transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#0d6efd')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
          >
            {mode === 'login' ? 'Create a free account' : 'Sign in instead'}
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
