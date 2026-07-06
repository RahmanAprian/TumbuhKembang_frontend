import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function ParentHome({ setPage }) {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get('/children').then(r => setChildren(r.data)).finally(() => setLoading(false));
  }, []);

  const totalRec = children.reduce((a,c) => a + (c.growth_records?.length || 0), 0);
  const totalVax = children.reduce((a,c) => a + (c.vaccines?.filter(v=>v.is_done).length || 0), 0);

  return (
    <div>
      {/* Welcome banner */}
      <div style={{ background:'linear-gradient(135deg,#7C3AED,#3B82F6)', borderRadius:16, padding:'1.6rem 2rem', marginBottom:24, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:20, top:-10, fontSize:100, opacity:0.08 }}>👶</div>
        <p style={{ color:'rgba(255,255,255,0.75)', fontSize:13, margin:'0 0 4px' }}>Selamat datang,</p>
        <h2 style={{ color:'#fff', fontWeight:800, fontSize:24, margin:'0 0 6px' }}>Halo, {user?.name}! 👋</h2>
        <p style={{ color:'rgba(255,255,255,0.8)', fontSize:14, margin:0 }}>Pantau tumbuh kembang si kecil dengan mudah dan akurat.</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom:24 }}>
        {[
          { icon:'👶', label:'Anak Terdaftar',   val: children.length, color:'#7C3AED', bg:'#EDE9FE' },
          { icon:'📋', label:'Total Rekaman',    val: totalRec,        color:'#2563EB', bg:'#DBEAFE' },
          { icon:'💉', label:'Vaksin Diberikan', val: totalVax,        color:'#059669', bg:'#D1FAE5' },
          { icon:'📅', label:'Pantau Bulan Ini', val: '—',             color:'#D97706', bg:'#FEF3C7' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ textAlign:'center' }}>
            <div style={{ width:44, height:44, borderRadius:12, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, margin:'0 auto 10px' }}>{s.icon}</div>
            <div style={{ fontSize:26, fontWeight:800, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Children cards */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <h3 style={{ fontWeight:700, fontSize:17, color:'#1F2937' }}>👧👦 Anak Saya</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setPage('children')}>+ Tambah Anak</button>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:'2rem', color:'#9CA3AF' }}>Memuat data...</div>
      ) : children.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'3rem', color:'#9CA3AF' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>👶</div>
          <p style={{ marginBottom:12 }}>Belum ada data anak.</p>
          <button className="btn btn-primary" onClick={() => setPage('children')}>+ Tambah Anak Pertama</button>
        </div>
      ) : (
        <div className="grid-3">
          {children.map(c => {
            const last     = c.growth_records?.[c.growth_records.length - 1];
            const dob      = new Date(c.birth_date);
            const now      = new Date();
            const age      = (now.getFullYear()-dob.getFullYear())*12 + (now.getMonth()-dob.getMonth());
            const vaxDone  = c.vaccines?.filter(v=>v.is_done).length || 0;
            const vaxTotal = c.vaccines?.length || 0;
            return (
              <div key={c.id} className="card" style={{ overflow:'hidden', cursor:'pointer' }} onClick={() => setPage('growth')}>
                <div style={{ background: c.gender==='female' ? 'linear-gradient(135deg,#F9A8D4,#C084FC)' : 'linear-gradient(135deg,#93C5FD,#6EE7B7)', padding:'1.2rem 1.4rem' }}>
                  <div style={{ fontSize:38 }}>{c.gender==='female' ? '👧' : '👦'}</div>
                  <div style={{ fontWeight:800, fontSize:17, color:'#fff', marginTop:6 }}>{c.name}</div>
                  <div style={{ color:'rgba(255,255,255,0.85)', fontSize:12 }}>{age} bulan · {c.gender==='female' ? 'Perempuan' : 'Laki-laki'}</div>
                </div>
                <div style={{ padding:'1rem 1.2rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontSize:11, color:'#9CA3AF' }}>Berat</div>
                      <div style={{ fontWeight:700, color:'#1F2937' }}>{last ? `${last.weight} kg` : '–'}</div>
                    </div>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontSize:11, color:'#9CA3AF' }}>Tinggi</div>
                      <div style={{ fontWeight:700, color:'#1F2937' }}>{last ? `${last.height} cm` : '–'}</div>
                    </div>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontSize:11, color:'#9CA3AF' }}>Vaksin</div>
                      <div style={{ fontWeight:700, color:'#1F2937' }}>{vaxDone}/{vaxTotal}</div>
                    </div>
                  </div>
                  {last && (
                    <span className={`badge badge-${
                      last.nutritional_status === 'normal' ? 'normal' :
                      last.nutritional_status.includes('kurang') || last.nutritional_status.includes('buruk') ? 'kurang' : 'lebih'
                    }`}>
                      {last.nutritional_status.replace('_', ' ')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick links */}
      <h3 style={{ fontWeight:700, fontSize:17, color:'#1F2937', margin:'28px 0 14px' }}>⚡ Akses Cepat</h3>
      <div className="grid-4">
        {[
          { icon:'📊', label:'Catat Pertumbuhan', page:'growth',     bg:'#EDE9FE', color:'#7C3AED' },
          { icon:'🏅', label:'Tonggak Tumbuh',    page:'milestones', bg:'#DBEAFE', color:'#2563EB' },
          { icon:'💉', label:'Jadwal Vaksin',      page:'vaccines',   bg:'#D1FAE5', color:'#059669' },
          { icon:'💡', label:'Tips Parenting',    page:'tips',       bg:'#FEF3C7', color:'#D97706' },
        ].map(a => (
          <div key={a.page} onClick={() => setPage(a.page)}
            style={{ background:a.bg, borderRadius:12, padding:'1rem', textAlign:'center', cursor:'pointer', border:'1px solid rgba(0,0,0,0.04)', transition:'transform 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
            <div style={{ fontSize:28, marginBottom:6 }}>{a.icon}</div>
            <div style={{ fontSize:12, fontWeight:600, color:a.color }}>{a.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}