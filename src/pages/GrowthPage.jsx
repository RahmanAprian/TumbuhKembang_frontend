import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api/axios';

const WHO = {
  male:   { weight:{0:3.3,1:4.5,2:5.6,3:6.4,4:7.0,5:7.5,6:7.9,9:8.9,12:9.6,18:10.9,24:12.2}, height:{0:49.9,1:54.7,2:58.4,3:61.4,6:67.6,9:72.0,12:75.7,18:82.3,24:87.8} },
  female: { weight:{0:3.2,1:4.2,2:5.1,3:5.8,4:6.4,5:6.9,6:7.3,9:8.2,12:8.9,18:10.2,24:11.5}, height:{0:49.1,1:53.7,2:57.1,3:59.8,6:65.7,9:70.1,12:74.0,18:80.7,24:86.4} },
};

function getWHO(gender, type, month) {
  const tbl = WHO[gender]?.[type]; if (!tbl) return null;
  const keys = Object.keys(tbl).map(Number).sort((a,b)=>a-b);
  if (month<=keys[0]) return tbl[keys[0]];
  if (month>=keys[keys.length-1]) return tbl[keys[keys.length-1]];
  for (let i=0;i<keys.length-1;i++) {
    if (month>=keys[i]&&month<=keys[i+1]) { const r=(month-keys[i])/(keys[i+1]-keys[i]); return +(tbl[keys[i]]+r*(tbl[keys[i+1]]-tbl[keys[i]])).toFixed(1); }
  }
}

function monthsOld(dob) {
  const d=new Date(dob),n=new Date();
  return Math.max(0,(n.getFullYear()-d.getFullYear())*12+(n.getMonth()-d.getMonth()));
}

const STATUS_MAP = { normal:{label:'Normal',cls:'badge-normal'}, gizi_kurang:{label:'Gizi Kurang',cls:'badge-kurang'}, gizi_buruk:{label:'Gizi Buruk',cls:'badge-buruk'}, gizi_lebih:{label:'Gizi Lebih',cls:'badge-lebih'}, obesitas:{label:'Obesitas',cls:'badge-buruk'} };

export default function GrowthPage() {
  const [children, setChildren] = useState([]);
  const [selId,    setSelId]    = useState(null);
  const [records,  setRecords]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [err,      setErr]      = useState('');
  const [form, setForm] = useState({ weight:'', height:'', head_circumference:'', age_months:'', recorded_at: new Date().toISOString().split('T')[0], notes:'' });

  useEffect(() => {
    api.get('/children').then(r => {
      setChildren(r.data);
      if (r.data.length > 0) setSelId(r.data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selId) return;
    setLoading(true);
    api.get(`/children/${selId}/growth`).then(r => setRecords(r.data)).finally(()=>setLoading(false));
  }, [selId]);

  const child = children.find(c=>c.id===selId);
  const age   = child ? monthsOld(child.birth_date) : 0;
  const last  = records[records.length-1];

  const save = async () => {
    setErr('');
    if (!form.weight||!form.height||!form.age_months) { setErr('Berat, tinggi, dan usia wajib diisi!'); return; }
    setSaving(true);
    try {
      await api.post(`/children/${selId}/growth`, form);
      const r = await api.get(`/children/${selId}/growth`);
      setRecords(r.data); setShowForm(false);
      setForm({ weight:'',height:'',head_circumference:'',age_months:'',recorded_at:new Date().toISOString().split('T')[0],notes:'' });
    } catch(e) { setErr(e.response?.data?.message||'Gagal menyimpan'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Hapus rekaman ini?')) return;
    await api.delete(`/children/${selId}/growth/${id}`);
    setRecords(records.filter(r=>r.id!==id));
  };

  const chartData = records.map(r => ({
    bulan: `${r.age_months} bln`,
    'Berat (kg)': r.weight,
    'Ref WHO BB': getWHO(child?.gender||'male','weight',r.age_months),
    'Tinggi (cm)': r.height,
    'Ref WHO TB': getWHO(child?.gender||'male','height',r.age_months),
  }));

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 className="page-title">📊 Pantau Pertumbuhan</h2>
          <p className="page-sub">Catat & pantau berat, tinggi, dan status gizi anak</p>
        </div>
        {selId && <button className="btn btn-primary" onClick={()=>setShowForm(true)}>+ Catat Ukuran</button>}
      </div>

      {/* Child selector */}
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {children.map(c => (
          <button key={c.id} onClick={()=>setSelId(c.id)}
            style={{ background: selId===c.id?'#7C3AED':'#fff', color: selId===c.id?'#fff':'#374151', border:'1.5px solid', borderColor: selId===c.id?'#7C3AED':'#E5E7EB', borderRadius:24, padding:'8px 18px', fontWeight:600, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
            {c.gender==='female'?'👧':'👦'} {c.name} <span style={{ opacity:0.7, fontSize:11 }}>({monthsOld(c.birth_date)} bln)</span>
          </button>
        ))}
      </div>

      {child && (
        <>
          {/* Stat row */}
          <div className="grid-4" style={{ marginBottom:20 }}>
            {[
              { icon:'🎂', label:'Usia',           val:`${age} bln`,                  bg:'#EDE9FE', color:'#7C3AED' },
              { icon:'⚖️', label:'Berat Terakhir', val:last?`${last.weight} kg`:'–',  bg:'#D1FAE5', color:'#059669' },
              { icon:'📏', label:'Tinggi Terakhir',val:last?`${last.height} cm`:'–',  bg:'#DBEAFE', color:'#2563EB' },
              { icon:'📋', label:'Total Rekaman',  val:records.length,                bg:'#FEF3C7', color:'#D97706' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div style={{ fontSize:22, marginBottom:6 }}>{s.icon}</div>
                <div style={{ fontSize:11, color:'#9CA3AF', marginBottom:2 }}>{s.label}</div>
                <div style={{ fontSize:20, fontWeight:800, color:s.color }}>{s.val}</div>
                {s.label==='Berat Terakhir' && last && (
                  <span className={`badge ${STATUS_MAP[last.nutritional_status]?.cls||'badge-normal'}`} style={{ marginTop:4 }}>
                    {STATUS_MAP[last.nutritional_status]?.label||last.nutritional_status}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Charts */}
          {records.length >= 2 && (
            <div className="grid-2" style={{ marginBottom:20 }}>
              {[
                { keys:['Berat (kg)','Ref WHO BB'], colors:['#7C3AED','#C4B5FD'], title:'📈 Grafik Berat Badan' },
                { keys:['Tinggi (cm)','Ref WHO TB'], colors:['#2563EB','#93C5FD'], title:'📐 Grafik Tinggi Badan' },
              ].map(ch => (
                <div key={ch.title} className="card" style={{ padding:'1.2rem' }}>
                  <div style={{ fontWeight:600, color:'#374151', marginBottom:10, fontSize:13 }}>{ch.title}</div>
                  <ResponsiveContainer width="100%" height={190}>
                    <LineChart data={chartData} margin={{ top:4, right:8, left:-10, bottom:0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6"/>
                      <XAxis dataKey="bulan" tick={{ fontSize:10 }}/>
                      <YAxis tick={{ fontSize:10 }}/>
                      <Tooltip/>
                      <Legend wrapperStyle={{ fontSize:11 }}/>
                      <Line type="monotone" dataKey={ch.keys[1]} stroke={ch.colors[1]} strokeDasharray="4 4" dot={false}/>
                      <Line type="monotone" dataKey={ch.keys[0]} stroke={ch.colors[0]} strokeWidth={2.5} dot={{ r:4 }} connectNulls/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          )}

          {/* Records table */}
          <div className="card" style={{ overflow:'hidden' }}>
            <div style={{ padding:'1rem 1.4rem', borderBottom:'1px solid #F3F4F6', fontWeight:600, color:'#374151', fontSize:14 }}>
              Riwayat Pengukuran ({records.length} data)
            </div>
            {loading ? <div style={{ textAlign:'center', padding:'2rem', color:'#9CA3AF' }}>Memuat...</div> : (
              <div style={{ overflowX:'auto' }}>
                <table className="table">
                  <thead><tr>
                    {['Tgl Catat','Usia','BB (kg)','TB (cm)','LK (cm)','Status Gizi','Catatan',''].map(h=><th key={h}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {records.length===0
                      ? <tr><td colSpan={8} style={{ textAlign:'center', color:'#9CA3AF', padding:'2rem' }}>Belum ada data. Klik <b>+ Catat Ukuran</b></td></tr>
                      : records.map(r=>(
                        <tr key={r.id}>
                          <td>{r.recorded_at}</td>
                          <td>{r.age_months} bln</td>
                          <td><b>{r.weight}</b></td>
                          <td><b>{r.height}</b></td>
                          <td>{r.head_circumference||'–'}</td>
                          <td><span className={`badge ${STATUS_MAP[r.nutritional_status]?.cls||'badge-normal'}`}>{STATUS_MAP[r.nutritional_status]?.label||r.nutritional_status}</span></td>
                          <td style={{ maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.notes||'–'}</td>
                          <td><button className="btn btn-danger btn-sm" onClick={()=>del(r.id)}>🗑️</button></td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Add record modal */}
      {showForm && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div className="modal-box">
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              <h3 style={{ fontWeight:700, fontSize:17 }}>+ Catat Ukuran Baru</h3>
              <button onClick={()=>setShowForm(false)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#9CA3AF' }}>✕</button>
            </div>
            {err && <div className="alert alert-error">⚠️ {err}</div>}
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div className="grid-2">
                <div>
                  <label style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:5 }}>Berat (kg) *</label>
                  <input className="input" type="number" step="0.1" placeholder="misal: 7.5" value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})}/>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:5 }}>Tinggi (cm) *</label>
                  <input className="input" type="number" step="0.1" placeholder="misal: 68" value={form.height} onChange={e=>setForm({...form,height:e.target.value})}/>
                </div>
              </div>
              <div className="grid-2">
                <div>
                  <label style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:5 }}>Lingkar Kepala (cm)</label>
                  <input className="input" type="number" step="0.1" placeholder="opsional" value={form.head_circumference} onChange={e=>setForm({...form,head_circumference:e.target.value})}/>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:5 }}>Usia (bulan) *</label>
                  <input className="input" type="number" placeholder="misal: 6" value={form.age_months} onChange={e=>setForm({...form,age_months:e.target.value})}/>
                </div>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:5 }}>Tanggal Dicatat *</label>
                <input className="input" type="date" value={form.recorded_at} onChange={e=>setForm({...form,recorded_at:e.target.value})}/>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:5 }}>Catatan</label>
                <textarea className="input" rows={2} placeholder="Catatan kondisi anak, misal: aktif, agak rewel..." value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} style={{ resize:'vertical' }}/>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button className="btn btn-primary" onClick={save} disabled={saving} style={{ flex:1, justifyContent:'center' }}>{saving?'Menyimpan...':'💾 Simpan'}</button>
                <button className="btn btn-outline" onClick={()=>setShowForm(false)}>Batal</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
