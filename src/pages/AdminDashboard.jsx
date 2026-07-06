import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [stats, setStats]     = useState(null);
  const [recent, setRecent]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/children?per_page=5'),
    ]).then(([s, c]) => {
      setStats(s.data);
      setRecent(c.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { icon:'👥', label:'Orang Tua',      val:stats.total_users,    color:'#7C3AED', bg:'#EDE9FE' },
    { icon:'👶', label:'Total Anak',     val:stats.total_children, color:'#2563EB', bg:'#DBEAFE' },
    { icon:'📋', label:'Total Rekaman',  val:stats.total_records,  color:'#059669', bg:'#D1FAE5' },
    { icon:'⚠️', label:'Perlu Perhatian',val:stats.need_attention, color:'#DC2626', bg:'#FEE2E2' },
  ] : [];

  const STATUS_MAP = { normal:{label:'Normal',cls:'badge-normal'}, gizi_kurang:{label:'Gizi Kurang',cls:'badge-kurang'}, gizi_buruk:{label:'Gizi Buruk',cls:'badge-buruk'}, gizi_lebih:{label:'Gizi Lebih',cls:'badge-lebih'} };

  return (
    <div>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1E1B4B,#4C1D95)', borderRadius:16, padding:'1.6rem 2rem', marginBottom:24, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:20, top:-10, fontSize:90, opacity:0.08 }}>👑</div>
        <p style={{ color:'rgba(255,255,255,0.65)', fontSize:13, margin:'0 0 4px' }}>Panel Administrator</p>
        <h2 style={{ color:'#fff', fontWeight:800, fontSize:22, margin:'0 0 6px' }}>Dashboard Admin 👑</h2>
        <p style={{ color:'rgba(255,255,255,0.75)', fontSize:13, margin:0 }}>Kelola seluruh data pengguna dan anak yang terdaftar di sistem.</p>
      </div>

      {loading ? <div style={{ textAlign:'center', padding:'3rem', color:'#9CA3AF' }}>Memuat data...</div> : (
        <>
          {/* Stats */}
          <div className="grid-4" style={{ marginBottom:24 }}>
            {cards.map(s => (
              <div key={s.label} className="stat-card" style={{ textAlign:'center' }}>
                <div style={{ width:46, height:46, borderRadius:14, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, margin:'0 auto 10px' }}>{s.icon}</div>
                <div style={{ fontSize:28, fontWeight:800, color:s.color }}>{s.val}</div>
                <div style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Alert */}
          {stats?.need_attention > 0 && (
            <div className="alert alert-error" style={{ marginBottom:20 }}>
              ⚠️ Terdapat <b>{stats.need_attention} anak</b> dengan status gizi kurang/buruk yang memerlukan perhatian khusus.
            </div>
          )}

          {/* Recent children */}
          <div className="card" style={{ overflow:'hidden' }}>
            <div style={{ padding:'1rem 1.4rem', borderBottom:'1px solid #F3F4F6', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontWeight:700, fontSize:14 }}>👶 Anak Terbaru Terdaftar</span>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table className="table">
                <thead><tr>
                  {['Nama Anak','Orang Tua','Usia','BB Terakhir','TB Terakhir','Status Gizi'].map(h=><th key={h}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {recent.map(c => {
                    const dob = new Date(c.birth_date), now = new Date();
                    const age = (now.getFullYear()-dob.getFullYear())*12+(now.getMonth()-dob.getMonth());
                    const last = c.growth_records?.[0];
                    return (
                      <tr key={c.id}>
                        <td style={{ fontWeight:600 }}>{c.gender==='female'?'👧':'👦'} {c.name}</td>
                        <td>{c.user?.name||'–'}</td>
                        <td>{age} bln</td>
                        <td>{last?`${last.weight} kg`:'–'}</td>
                        <td>{last?`${last.height} cm`:'–'}</td>
                        <td>{last ? <span className={`badge ${STATUS_MAP[last.nutritional_status]?.cls||'badge-normal'}`}>{STATUS_MAP[last.nutritional_status]?.label||last.nutritional_status}</span> : '–'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
