import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, UserPlus, AlertCircle, Check } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Something went wrong'); return; }

      localStorage.setItem('g2h_token', data.token);
      localStorage.setItem('g2h_user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch {
      setError('Cannot connect to server. Make sure the backend is running.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-rose-600/5 rounded-full blur-3xl" />
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-baseline justify-center mb-3">
            <span className="text-5xl font-black text-primary-500 tracking-tighter drop-shadow-[0_0_20px_rgba(240,73,97,0.5)]">Gate</span>
            <span className="text-4xl font-black text-slate-500 mx-1">2</span>
            <span className="text-3xl font-bold text-primary-400 tracking-tight">Hotels</span>
          </div>
          <p className="text-[11px] text-slate-500 uppercase tracking-[0.4em] font-black">Channel Manager Platform</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-[40px] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/5">
          {/* Tabs */}
          <div className="flex bg-slate-800/50 rounded-2xl p-1.5 mb-8">
            {[{ key: 'login', label: 'Sign In', icon: LogIn }, { key: 'register', label: 'Create Account', icon: UserPlus }].map(tab => (
              <button key={tab.key} onClick={() => { setMode(tab.key); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === tab.key ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-slate-500 hover:text-slate-300'}`}>
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Full Name</label>
                <input type="text" value={form.name} onChange={set('name')} required placeholder="Your full name"
                  className="w-full px-5 py-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl text-sm text-white font-medium outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 placeholder-slate-600 transition-all" />
              </div>
            )}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Email Address</label>
              <input type="email" value={form.email} onChange={set('email')} required placeholder="your@email.com"
                className="w-full px-5 py-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl text-sm text-white font-medium outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 placeholder-slate-600 transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={set('password')} required placeholder="••••••••"
                  className="w-full px-5 py-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl text-sm text-white font-medium outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 placeholder-slate-600 transition-all pr-12" />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl px-5 py-4">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <p className="text-rose-400 text-xs font-bold">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 mt-2 bg-gradient-to-r from-primary-600 to-rose-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[3px] hover:shadow-[0_10px_30px_rgba(240,73,97,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>{mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  {mode === 'login' ? 'Sign In' : 'Create Account'}</>
              )}
            </button>
          </form>

          {/* Demo hint */}
          {mode === 'login' && (
            <div className="mt-6 p-4 bg-slate-800/40 rounded-2xl border border-slate-700/30">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Demo Account</p>
              <p className="text-[10px] text-slate-400 font-medium">Email: <span className="text-primary-400 font-black">admin@gate2hotels.com</span></p>
              <p className="text-[10px] text-slate-400 font-medium">Password: <span className="text-primary-400 font-black">admin123</span></p>
            </div>
          )}
        </div>

        <p className="text-center text-slate-600 text-[10px] font-black uppercase tracking-widest mt-8">
          © 2026 Gate2Hotels — All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Login;
