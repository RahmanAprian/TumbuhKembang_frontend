import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { login, register } = useAuth();
  const [tab,     setTab]     = useState('login');
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState('');
  const [ok,      setOk]      = useState('');

  const [lEmail, setLEmail] = useState('');
  const [lPass,  setLPass]  = useState('');
  const [showP,  setShowP]  = useState(false);

  const [rName,  setRName]  = useState('');
  const [rEmail, setREmail] = useState('');
  const [rPass,  setRPass]  = useState('');
  const [rPass2, setRPass2] = useState('');
  const [rPhone, setRPhone] = useState('');
  const [rAddr,  setRAddr]  = useState('');

  const switchTab = (t) => { setTab(t); setErr(''); setOk(''); };

  const doLogin = async () => {
    setErr('');
    if (!lEmail || !lPass) { setErr('Email dan password wajib diisi!'); return; }
    setLoading(true);
    try { await login(lEmail, lPass); }
    catch (e) { setErr(e.response?.data?.message || 'Login gagal!'); }
    finally { setLoading(false); }
  };

  const doRegister = async () => {
    setErr(''); setOk('');
    if (!rName || !rEmail || !rPass || !rPass2) { setErr('Semua kolom wajib diisi!'); return; }
    if (rPass.length < 6) { setErr('Password minimal 6 karakter!'); return; }
    if (rPass !== rPass2) { setErr('Konfirmasi password tidak cocok!'); return; }
    setLoading(true);
    try {
      await register({ name: rName, email: rEmail, password: rPass, password_confirmation: rPass2, phone: rPhone, address: rAddr });
    } catch (e) { setErr(e.response?.data?.message || 'Registrasi gagal!'); }
    finally { setLoading(false); }
  };

  const features = [
    { icon: '📊', text: 'Pantau berat & tinggi badan' },
    { icon: '💉', text: 'Jadwal vaksinasi lengkap'    },
    { icon: '🏅', text: 'Tonggak perkembangan anak'   },
    { icon: '💡', text: 'Tips & panduan parenting'    },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#7C3AED 0%,#3B82F6 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ width:'100%', maxWidth:480 }}>

        {/* Brand */}
        <div style={{ textAlign:'center', marginBottom:20 }}>
          <div style={{ fontSize:56, marginBottom:8 }}>🌱</div>
          <h1 style={{ color:'#fff', fontWeight:800, fontSize:30, margin:'0 0 8px' }}>TumbuhKembang</h1>
          <p style={{ color:'rgba(255,255,255,0.85)', fontSize:15, margin:'0 0 14px' }}>
            Platform Pemantauan Tumbuh Kembang Anak
          </p>
          {/* Feature pills */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
            {features.map(f => (
              <div key={f.text} style={{ background:'rgba(255,255,255,0.15)', borderRadius:99, padding:'5px 14px', fontSize:12, color:'#fff', display:'flex', alignItems:'center', gap:6 }}>
                <span>{f.icon}</span>{f.text}
              </div>
            ))}
          </div>
        </div>

        {/* App description */}
        <div style={{ background:'rgba(255,255,255,0.12)', borderRadius:14, padding:'14px 18px', marginBottom:16, border:'1px solid rgba(255,255,255,0.2)' }}>
          <p style={{ color:'#fff', fontSize:13, margin:0, lineHeight:1.7, textAlign:'center' }}>
            Aplikasi ini membantu <b>orang tua</b> memantau tumbuh kembang anak secara digital —
            dari berat badan, tinggi, vaksinasi, hingga tonggak perkembangan.
            Data tersimpan aman dan dapat dipantau kapan saja. 🍼
          </p>
        </div>

        {/* Auth card */}
        <div style={{ background:'#fff', borderRadius:20, padding:'1.8rem', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>

          {/* Tab */}
          <div style={{ display:'flex', background:'#F3F4F6', borderRadius:12, padding:4, marginBottom:22 }}>
            {[['login','🔑 Masuk'],['register','📝 Daftar']].map(([k,l]) => (
              <button key={k} onClick={() => switchTab(k)} style={{
                flex:1, background:tab===k?'#fff':'transparent',
                color:tab===k?'#7C3AED':'#6B7280',
                border:'none', borderRadius:9, padding:'8px',
                fontWeight:700, fontSize:14, cursor:'pointer',
                boxShadow:tab===k?'0 2px 8px rgba(0,0,0,0.08)':'none', transition:'all 0.2s',
              }}>{l}</button>
            ))}
          </div>

          {err && <div className="alert alert-error">⚠️ {err}</div>}
          {ok  && <div className="alert alert-success">✅ {ok}</div>}

          {/* LOGIN */}
          {tab === 'login' && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Email</label>
                <input className="input" type="email" placeholder="email@contoh.com"
                  value={lEmail} onChange={e=>setLEmail(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&doLogin()} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Password</label>
                <div style={{ position:'relative' }}>
                  <input className="input" type={showP?'text':'password'} placeholder="Password..."
                    value={lPass} onChange={e=>setLPass(e.target.value)}
                    onKeyDown={e=>e.key==='Enter'&&doLogin()}
                    style={{ paddingRight:42, width:'100%' }} />
                  <button onClick={()=>setShowP(!showP)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:16 }}>
                    {showP?'🙈':'👁️'}
                  </button>
                </div>
              </div>
              <button onClick={doLogin} disabled={loading} style={{ width:'100%', background:'linear-gradient(135deg,#7C3AED,#3B82F6)', color:'#fff', border:'none', borderRadius:12, padding:'12px', fontWeight:700, fontSize:15, cursor:'pointer' }}>
                {loading?'⏳ Masuk...':'Masuk →'}
              </button>
              <p style={{ textAlign:'center', fontSize:13, color:'#6B7280', margin:0 }}>
                Belum punya akun?{' '}
                <button onClick={()=>switchTab('register')} style={{ background:'none', border:'none', color:'#7C3AED', fontWeight:700, cursor:'pointer', fontSize:13 }}>
                  Daftar sekarang
                </button>
              </p>
            </div>
          )}

          {/* REGISTER */}
          {tab === 'register' && (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div>
                <h3 style={{ fontWeight:700, color:'#1F2937', fontSize:17, margin:'0 0 4px' }}>Buat Akun Orang Tua</h3>
                <p style={{ fontSize:13, color:'#6B7280', margin:0 }}>Daftar gratis untuk mulai memantau tumbuh kembang anak</p>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Nama Lengkap <span style={{ color:'red' }}>*</span></label>
                <input className="input" placeholder="Contoh: Ibu Rina" value={rName} onChange={e=>setRName(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Email <span style={{ color:'red' }}>*</span></label>
                <input className="input" type="email" placeholder="email@contoh.com" value={rEmail} onChange={e=>setREmail(e.target.value)} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Password <span style={{ color:'red' }}>*</span></label>
                  <input className="input" type="password" placeholder="Min. 6 karakter" value={rPass} onChange={e=>setRPass(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Konfirmasi <span style={{ color:'red' }}>*</span></label>
                  <input className="input" type="password" placeholder="Ulangi password"
                    value={rPass2} onChange={e=>setRPass2(e.target.value)}
                    style={{ borderColor: rPass2&&rPass!==rPass2?'#EF4444':'#E5E7EB' }} />
                  {rPass2&&rPass!==rPass2&&<p style={{ fontSize:11, color:'#EF4444', margin:'3px 0 0' }}>Password tidak cocok</p>}
                </div>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>No. HP</label>
                <input className="input" type="tel" placeholder="08xx-xxxx-xxxx" value={rPhone} onChange={e=>setRPhone(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:'#374151', display:'block', marginBottom:5 }}>Alamat</label>
                <input className="input" placeholder="Alamat tempat tinggal (opsional)" value={rAddr} onChange={e=>setRAddr(e.target.value)} />
              </div>
              <div style={{ background:'#F5F3FF', borderRadius:10, padding:'10px 12px', fontSize:12, color:'#6B7280', border:'1px solid #EDE9FE' }}>
                🔒 Akun ini terdaftar sebagai <b>Orang Tua</b>. Data Anda aman dan tidak dibagikan ke pihak lain.
              </div>
              <button onClick={doRegister} disabled={loading} style={{ width:'100%', background:'linear-gradient(135deg,#059669,#0D9488)', color:'#fff', border:'none', borderRadius:12, padding:'12px', fontWeight:700, fontSize:15, cursor:'pointer' }}>
                {loading?'⏳ Mendaftar...':'🎉 Daftar Sekarang'}
              </button>
              <p style={{ textAlign:'center', fontSize:13, color:'#6B7280', margin:0 }}>
                Sudah punya akun?{' '}
                <button onClick={()=>switchTab('login')} style={{ background:'none', border:'none', color:'#7C3AED', fontWeight:700, cursor:'pointer', fontSize:13 }}>
                  Masuk di sini
                </button>
              </p>
            </div>
          )}
        </div>

        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.5)', fontSize:12, marginTop:16 }}>
          © 2025 TumbuhKembang · Data berdasarkan standar WHO & Kemenkes RI
        </p>
      </div>
    </div>
  );
}
