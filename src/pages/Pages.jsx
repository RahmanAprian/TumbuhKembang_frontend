import { useEffect, useState } from 'react';
import api from '../api/axios';

// ── CHILDREN PAGE ──────────────────────────────────────────────────────────
export function ChildrenPage() {
  const [children, setChildren] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [err,      setErr]      = useState('');
  const [form, setForm] = useState({ name:'', birth_date:'', gender:'female', blood_type:'' });

  const load = () => { setLoading(true); api.get('/children').then(r=>setChildren(r.data)).finally(()=>setLoading(false)); };
  useEffect(load, []);

  const save = async () => {
    setErr('');
    if (!form.name||!form.birth_date) { setErr('Nama dan tanggal lahir wajib diisi!'); return; }
    try {
      if (editing) await api.put(`/children/${editing.id}`, form);
      else         await api.post('/children', form);
      setShowForm(false); setEditing(null); setForm({name:'',birth_date:'',gender:'female',blood_type:''}); load();
    } catch(e) { setErr(e.response?.data?.message||'Gagal'); }
  };

  const del = async (id) => {
    if (!confirm('Hapus data anak ini?')) return;
    await api.delete(`/children/${id}`); load();
  };

  const openEdit = (c) => { setEditing(c); setForm({name:c.name,birth_date:c.birth_date,gender:c.gender,blood_type:c.blood_type||''}); setShowForm(true); };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <div>
          <h2 className="page-title">👶 Data Anak</h2>
          <p className="page-sub">Tambah dan kelola data anak Anda</p>
        </div>
        <button className="btn btn-primary" onClick={()=>{setEditing(null);setForm({name:'',birth_date:'',gender:'female',blood_type:''});setShowForm(true)}}>+ Tambah Anak</button>
      </div>

      {loading ? <div style={{ textAlign:'center', color:'#9CA3AF', padding:'3rem' }}>Memuat...</div>
       : children.length===0 ? (
        <div className="card" style={{ textAlign:'center', padding:'3rem', color:'#9CA3AF' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>👶</div>
          <p>Belum ada data anak. Tambahkan sekarang!</p>
        </div>
       ) : (
        <div className="grid-3">
          {children.map(c => {
            const dob=new Date(c.birth_date),now=new Date();
            const age=(now.getFullYear()-dob.getFullYear())*12+(now.getMonth()-dob.getMonth());
            return (
              <div key={c.id} className="card" style={{ overflow:'hidden' }}>
                <div style={{ background:c.gender==='female'?'linear-gradient(135deg,#F9A8D4,#C084FC)':'linear-gradient(135deg,#93C5FD,#6EE7B7)', padding:'1.2rem' }}>
                  <div style={{ fontSize:38 }}>{c.gender==='female'?'👧':'👦'}</div>
                  <div style={{ fontWeight:800, fontSize:17, color:'#fff', marginTop:6 }}>{c.name}</div>
                  <div style={{ color:'rgba(255,255,255,0.85)', fontSize:12 }}>{age} bulan · {c.gender==='female'?'Perempuan':'Laki-laki'}{c.blood_type?` · Gol. ${c.blood_type}`:''}</div>
                </div>
                <div style={{ padding:'1rem', display:'flex', gap:8 }}>
                  <button className="btn btn-outline btn-sm" onClick={()=>openEdit(c)} style={{ flex:1, justifyContent:'center' }}>✏️ Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={()=>del(c.id)}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
       )}

      {showForm && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div className="modal-box">
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              <h3 style={{ fontWeight:700 }}>{editing?'Edit':'Tambah'} Data Anak</h3>
              <button onClick={()=>setShowForm(false)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#9CA3AF' }}>✕</button>
            </div>
            {err && <div className="alert alert-error">⚠️ {err}</div>}
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div><label style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:5 }}>Nama Anak *</label>
                <input className="input" placeholder="Nama lengkap anak" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
              <div><label style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:5 }}>Tanggal Lahir *</label>
                <input className="input" type="date" value={form.birth_date} onChange={e=>setForm({...form,birth_date:e.target.value})}/></div>
              <div className="grid-2">
                <div><label style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:5 }}>Jenis Kelamin</label>
                  <select className="input" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
                    <option value="female">Perempuan</option><option value="male">Laki-laki</option>
                  </select></div>
                <div><label style={{ fontSize:12, fontWeight:600, display:'block', marginBottom:5 }}>Golongan Darah</label>
                  <select className="input" value={form.blood_type} onChange={e=>setForm({...form,blood_type:e.target.value})}>
                    <option value="">Tidak tahu</option>{['A','B','AB','O'].map(x=><option key={x} value={x}>{x}</option>)}
                  </select></div>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button className="btn btn-primary" onClick={save} style={{ flex:1, justifyContent:'center' }}>💾 Simpan</button>
                <button className="btn btn-outline" onClick={()=>setShowForm(false)}>Batal</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── VACCINES PAGE ──────────────────────────────────────────────────────────
export function VaccinePage() {
  const [children, setChildren] = useState([]);
  const [selId,    setSelId]    = useState(null);
  const [vaccines, setVaccines] = useState([]);
  const [saving,   setSaving]   = useState(null);

  useEffect(() => { api.get('/children').then(r=>{ setChildren(r.data); if(r.data[0]) setSelId(r.data[0].id); }); }, []);
  useEffect(() => { if(selId) api.get(`/children/${selId}/vaccines`).then(r=>setVaccines(r.data)); }, [selId]);

  const toggle = async (v) => {
    setSaving(v.id);
    const updated = await api.put(`/children/${selId}/vaccines/${v.id}`, { is_done:!v.is_done, given_date:!v.is_done?new Date().toISOString().split('T')[0]:null });
    setVaccines(vaccines.map(x=>x.id===v.id?updated.data:x));
    setSaving(null);
  };

  const done  = vaccines.filter(v=>v.is_done).length;
  const total = vaccines.length;
  const pct   = total ? Math.round(done/total*100) : 0;

  return (
    <div>
      <h2 className="page-title">💉 Jadwal Vaksinasi</h2>
      <p className="page-sub">Pantau kelengkapan imunisasi dasar anak sesuai jadwal Kemenkes & IDAI</p>
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {children.map(c=>(
          <button key={c.id} onClick={()=>setSelId(c.id)}
            style={{ background:selId===c.id?'#7C3AED':'#fff', color:selId===c.id?'#fff':'#374151', border:'1.5px solid', borderColor:selId===c.id?'#7C3AED':'#E5E7EB', borderRadius:24, padding:'7px 16px', fontWeight:600, fontSize:13, cursor:'pointer' }}>
            {c.gender==='female'?'👧':'👦'} {c.name}
          </button>
        ))}
      </div>
      {selId && (
        <>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:13, fontWeight:600 }}>Progres Vaksinasi</span>
                <span style={{ fontSize:13, fontWeight:700, color:'#7C3AED' }}>{done}/{total} ({pct}%)</span>
              </div>
              <div className="progress"><div className="progress-fill" style={{ width:`${pct}%` }}/></div>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {vaccines.map(v=>(
              <div key={v.id} style={{ background:'#fff', borderRadius:12, border:v.is_done?'1.5px solid #059669':'1px solid #E5E7EB', padding:'12px 16px', display:'flex', alignItems:'center', gap:14 }}>
                <button onClick={()=>toggle(v)} disabled={saving===v.id}
                  style={{ width:28, height:28, borderRadius:8, border:v.is_done?'none':'2px solid #D1D5DB', background:v.is_done?'#059669':'#fff', color:'#fff', fontWeight:700, fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
                  {saving===v.id?'⏳':v.is_done?'✓':''}
                </button>
                <div style={{ background:'#FCE7F3', borderRadius:8, padding:'4px 12px', minWidth:88, textAlign:'center', flexShrink:0 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:'#BE185D' }}>{v.recommended_age_months === 0 ? 'Lahir' : `${v.recommended_age_months} bln`}</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, color:'#1F2937', fontSize:14 }}>{v.vaccine_name}</div>
                  {v.is_done && v.given_date && <div style={{ fontSize:11, color:'#059669', marginTop:2 }}>✅ Diberikan: {v.given_date}</div>}
                </div>
                {v.is_done && <span style={{ color:'#059669', fontSize:12, fontWeight:600 }}>Selesai</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── MILESTONES PAGE ────────────────────────────────────────────────────────
const MS = [
  {m:1,ic:'👁️',t:'Fokus Pandang',d:'Mengikuti wajah dengan mata'},
  {m:2,ic:'😊',t:'Senyum Sosial',d:'Senyum merespons wajah & suara'},
  {m:3,ic:'🗣️',t:'Vokalisasi',d:'Bunyi "aah" dan "ooh"'},
  {m:4,ic:'🤲',t:'Meraih Benda',d:'Meraih mainan di depannya'},
  {m:6,ic:'🪑',t:'Duduk Dibantu',d:'Duduk dengan sedikit bantuan'},
  {m:7,ic:'🍼',t:'MPASI Siap',d:'Siap makanan pendamping ASI'},
  {m:9,ic:'🚶',t:'Merambat',d:'Berdiri sambil berpegangan'},
  {m:12,ic:'🎉',t:'Langkah Pertama',d:'Berjalan tanpa bantuan'},
  {m:18,ic:'💬',t:'Kosa Kata',d:'10–20 kata bisa diucapkan'},
  {m:24,ic:'🧩',t:'Kalimat Pendek',d:'Menggabungkan 2–3 kata'},
];

export function MilestonesPage() {
  const [children, setChildren] = useState([]);
  const [selId,    setSelId]    = useState(null);
  const [achieved, setAchieved] = useState({});

  useEffect(() => {
    api.get('/children').then(r => {
      setChildren(r.data);
      if (r.data[0]) setSelId(r.data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selId) return;
    api.get(`/children/${selId}/milestones`).then(r => {
      const map = {};
      r.data.forEach(m => { if (m.is_achieved) map[m.month] = true; });
      setAchieved(map);
    });
  }, [selId]);

  const toggle = async (month) => {
    await api.post(`/children/${selId}/milestones/toggle`, { month });
    setAchieved(p => ({ ...p, [month]: !p[month] }));
  };

  const done = Object.values(achieved).filter(Boolean).length;

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
        <div><h2 className="page-title">🏅 Tonggak Perkembangan</h2><p className="page-sub">Centang milestone yang sudah dicapai si kecil</p></div>
        <div style={{ background:'#EDE9FE', borderRadius:12, padding:'10px 18px', textAlign:'center' }}>
          <div style={{ fontSize:22, fontWeight:800, color:'#7C3AED' }}>{done}/{MS.length}</div>
          <div style={{ fontSize:11, color:'#8B5CF6' }}>Dicapai</div>
        </div>
      </div>

      {/* Child selector */}
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {children.map(c => (
          <button key={c.id} onClick={() => setSelId(c.id)}
            style={{ background:selId===c.id?'#7C3AED':'#fff', color:selId===c.id?'#fff':'#374151', border:'1.5px solid', borderColor:selId===c.id?'#7C3AED':'#E5E7EB', borderRadius:24, padding:'7px 16px', fontWeight:600, fontSize:13, cursor:'pointer' }}>
            {c.gender==='female'?'👧':'👦'} {c.name}
          </button>
        ))}
      </div>

      <div className="progress" style={{ marginBottom:24 }}><div className="progress-fill" style={{ width:`${done/MS.length*100}%` }}/></div>
      <div className="grid-4" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))' }}>
        {MS.map(m => {
          const ch = achieved[m.m];
          return (
            <div key={m.m} onClick={() => toggle(m.m)}
              style={{ background:ch?'#D1FAE5':'#fff', border:ch?'2px solid #059669':'1px solid #E5E7EB', borderRadius:12, padding:'1rem', cursor:'pointer', transition:'all 0.15s' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:26 }}>{m.ic}</span>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:3 }}>
                  <span style={{ background:'#EDE9FE', color:'#7C3AED', borderRadius:8, padding:'2px 7px', fontSize:10, fontWeight:700 }}>Bln {m.m}</span>
                  {ch && <span style={{ fontSize:14 }}>✅</span>}
                </div>
              </div>
              <div style={{ fontWeight:700, color:ch?'#065F46':'#1F2937', fontSize:13, marginBottom:3 }}>{m.t}</div>
              <div style={{ fontSize:11, color:'#6B7280', lineHeight:1.5 }}>{m.d}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── TIPS PAGE ──────────────────────────────────────────────────────────────
const TIPS = [
  {cat:'ASI',ic:'🤱',col:'#F0FDF4',bd:'#16A34A',t:'Posisi Menyusui Benar',b:'Pastikan seluruh areola masuk ke mulut bayi. Coba posisi cradle, football, atau side-lying sesuai kenyamanan.'},
  {cat:'Tidur',ic:'😴',col:'#EFF6FF',bd:'#2563EB',t:'Safe Sleep 7 Aturan',b:'Tidurkan bayi telentang di permukaan keras. Jauhkan bantal & selimut tebal dari area tidur untuk cegah SIDS.'},
  {cat:'Stimulasi',ic:'🎨',col:'#FFFBEB',bd:'#D97706',t:'Tummy Time Sejak Lahir',b:'Lakukan 2–3 menit, 2–3x sehari sejak hari pertama. Perkuat otot leher & bahu untuk persiapan tengkurap.'},
  {cat:'Nutrisi',ic:'🥕',col:'#FFF7ED',bd:'#EA580C',t:'MPASI di Usia 6 Bulan',b:'Mulai MPASI tekstur lembut tepat 6 bulan. Kenalkan satu bahan baru tiap 3 hari untuk pantau alergi.'},
  {cat:'Tumbuh',ic:'📏',col:'#F5F3FF',bd:'#7C3AED',t:'Pantau BB & TB Rutin',b:'Timbang & ukur tiap bulan sampai 1 tahun, lalu tiap 3 bulan. Plotkan ke KMS untuk deteksi dini masalah gizi.'},
  {cat:'Stimulasi',ic:'📖',col:'#F0FDFA',bd:'#0D9488',t:'Bacakan Buku Sejak Bayi',b:'Membacakan buku sejak lahir merangsang perkembangan bahasa. Pilih buku gambar kontras tinggi untuk 0–3 bulan.'},
  {cat:'Kesehatan',ic:'🌡️',col:'#FEF2F2',bd:'#DC2626',t:'Kenali Tanda Bahaya',b:'Segera ke dokter jika: demam >38°C pada bayi <3 bln, napas cepat, tidak mau menyusu, atau tidak responsif.'},
  {cat:'Nutrisi',ic:'💧',col:'#F0F9FF',bd:'#0284C7',t:'Kebutuhan Cairan Bayi',b:'Bayi 0–6 bulan cukup ASI saja, tidak perlu air putih. Setelah 6 bulan boleh diberi air sedikit bersamaan MPASI.'},
];

export function TipsPage() {
  const [cat, setCat] = useState('Semua');
  const cats = ['Semua',...new Set(TIPS.map(t=>t.cat))];
  const list = cat==='Semua'?TIPS:TIPS.filter(t=>t.cat===cat);
  return (
    <div>
      <h2 className="page-title">💡 Tips & Info Parenting</h2>
      <p className="page-sub">Panduan perawatan anak berbasis standar WHO & Kemenkes RI</p>
      <div style={{ display:'flex', gap:8, marginBottom:22, flexWrap:'wrap' }}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{ background:cat===c?'#7C3AED':'#fff', color:cat===c?'#fff':'#374151', border:'1.5px solid', borderColor:cat===c?'#7C3AED':'#E5E7EB', borderRadius:20, padding:'6px 16px', fontWeight:600, fontSize:12, cursor:'pointer' }}>{c}</button>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:14 }}>
        {list.map((t,i)=>(
          <div key={i} style={{ background:t.col, borderRadius:14, padding:'1.3rem', borderLeft:`4px solid ${t.bd}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <span style={{ fontSize:26 }}>{t.ic}</span>
              <span style={{ background:t.bd, color:'#fff', borderRadius:99, padding:'2px 10px', fontSize:11, fontWeight:700 }}>{t.cat}</span>
            </div>
            <h3 style={{ fontSize:14, fontWeight:700, color:'#1F2937', marginBottom:7 }}>{t.t}</h3>
            <p style={{ fontSize:12, color:'#4B5563', margin:0, lineHeight:1.6 }}>{t.b}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ADMIN CHILDREN PAGE ────────────────────────────────────────────────────
export function AdminChildrenPage() {
  const [children, setChildren] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [page,     setPage]     = useState(1);
  const [meta,     setMeta]     = useState(null);

  const load = (p=1,s='') => {
    setLoading(true);
    api.get(`/admin/children?page=${p}&search=${s}`).then(r=>{setChildren(r.data.data);setMeta(r.data);}).finally(()=>setLoading(false));
  };
  useEffect(()=>load(),[]);

  const del = async (id) => {
    if (!confirm('Hapus data anak ini?')) return;
    await api.delete(`/admin/children/${id}`); load(page,search);
  };

  const STATUS_MAP = { normal:{label:'Normal',cls:'badge-normal'}, gizi_kurang:{label:'Gizi Kurang',cls:'badge-kurang'}, gizi_buruk:{label:'Gizi Buruk',cls:'badge-buruk'}, gizi_lebih:{label:'Gizi Lebih',cls:'badge-lebih'} };

  return (
    <div>
      <h2 className="page-title">👶 Kelola Data Anak</h2>
      <p className="page-sub">Lihat dan kelola seluruh data anak yang terdaftar di sistem</p>
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <input className="input" placeholder="🔍 Cari nama anak..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&load(1,search)} style={{ maxWidth:320 }}/>
        <button className="btn btn-primary" onClick={()=>load(1,search)}>Cari</button>
      </div>
      <div className="card" style={{ overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table className="table">
            <thead><tr>{['Nama Anak','Orang Tua','Tgl Lahir','Usia','BB Terakhir','TB Terakhir','Status Gizi','Hapus'].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={8} style={{ textAlign:'center', padding:'2rem', color:'#9CA3AF' }}>Memuat...</td></tr>
               : children.map(c=>{
                const dob=new Date(c.birth_date),now=new Date();
                const age=(now.getFullYear()-dob.getFullYear())*12+(now.getMonth()-dob.getMonth());
                const last=c.growth_records?.[0];
                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight:600 }}>{c.gender==='female'?'👧':'👦'} {c.name}</td>
                    <td style={{ color:'#6B7280' }}>{c.user?.name||'–'}</td>
                    <td>{c.birth_date}</td>
                    <td>{age} bln</td>
                    <td>{last?`${last.weight} kg`:'–'}</td>
                    <td>{last?`${last.height} cm`:'–'}</td>
                    <td>{last?<span className={`badge ${STATUS_MAP[last.nutritional_status]?.cls||'badge-normal'}`}>{STATUS_MAP[last.nutritional_status]?.label||last.nutritional_status}</span>:'–'}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={()=>del(c.id)}>🗑️</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {meta&&meta.last_page>1&&(
          <div style={{ padding:'1rem 1.4rem', borderTop:'1px solid #F3F4F6', display:'flex', gap:8 }}>
            {Array.from({length:meta.last_page},(_,i)=>i+1).map(p=>(
              <button key={p} onClick={()=>{setPage(p);load(p,search);}}
                style={{ width:32, height:32, borderRadius:8, border:'1.5px solid', borderColor:p===page?'#7C3AED':'#E5E7EB', background:p===page?'#7C3AED':'#fff', color:p===page?'#fff':'#374151', fontWeight:600, cursor:'pointer', fontSize:13 }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
