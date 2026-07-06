import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [page,    setPage]    = useState(1);
  const [meta,    setMeta]    = useState(null);
  const [detail,  setDetail]  = useState(null);

  const load = async (p=1, s='') => {
    setLoading(true);
    try {
      const r = await api.get(`/admin/users?page=${p}&search=${s}`);
      setUsers(r.data.data);
      setMeta(r.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(1, search); }, []);

  const doSearch = () => { setPage(1); load(1, search); };
  const doDelete = async (id) => {
    if (!confirm('Hapus pengguna ini beserta semua data anaknya?')) return;
    await api.delete(`/admin/users/${id}`);
    load(page, search);
  };
  const showDetail = async (id) => {
    const r = await api.get(`/admin/users/${id}`);
    setDetail(r.data);
  };

  return (
    <div>
      <h2 className="page-title">👥 Kelola Pengguna</h2>
      <p className="page-sub">Lihat dan kelola akun orang tua yang terdaftar</p>

      {/* Search */}
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <input className="input" placeholder="🔍 Cari nama pengguna..." value={search}
          onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doSearch()}
          style={{ maxWidth:320 }} />
        <button className="btn btn-primary" onClick={doSearch}>Cari</button>
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table className="table">
            <thead><tr>
              {['Nama','Email','No. HP','Jumlah Anak','Aksi'].map(h=><th key={h}>{h}</th>)}
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign:'center', padding:'2rem', color:'#9CA3AF' }}>Memuat data...</td></tr>
              ) : users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight:600 }}>👩 {u.name}</td>
                  <td style={{ color:'#6B7280' }}>{u.email}</td>
                  <td>{u.phone||'–'}</td>
                  <td><span className="badge badge-parent">{u.children_count} anak</span></td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn btn-outline btn-sm" onClick={()=>showDetail(u.id)}>👁️ Detail</button>
                      <button className="btn btn-danger btn-sm" onClick={()=>doDelete(u.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div style={{ padding:'1rem 1.4rem', borderTop:'1px solid #F3F4F6', display:'flex', gap:8, alignItems:'center' }}>
            {Array.from({length:meta.last_page},(_,i)=>i+1).map(p=>(
              <button key={p} onClick={()=>{setPage(p);load(p,search);}}
                style={{ width:32, height:32, borderRadius:8, border:'1.5px solid', borderColor:p===page?'#7C3AED':'#E5E7EB', background:p===page?'#7C3AED':'#fff', color:p===page?'#fff':'#374151', fontWeight:600, cursor:'pointer', fontSize:13 }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {detail && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setDetail(null)}>
          <div className="modal-box" style={{ maxWidth:560 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              <h3 style={{ fontWeight:700 }}>Detail: {detail.name}</h3>
              <button onClick={()=>setDetail(null)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#9CA3AF' }}>✕</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
              {[['Email',detail.email],['No. HP',detail.phone||'–'],['Alamat',detail.address||'–'],['Terdaftar',detail.created_at?.split('T')[0]]].map(([l,v])=>(
                <div key={l} style={{ background:'#F9FAFB', borderRadius:10, padding:'10px 12px' }}>
                  <div style={{ fontSize:11, color:'#9CA3AF', marginBottom:2 }}>{l}</div>
                  <div style={{ fontWeight:600, fontSize:13 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ fontWeight:700, marginBottom:10 }}>👶 Anak ({detail.children?.length||0})</div>
            {detail.children?.map(c=>(
              <div key={c.id} style={{ background:'#F9FAFB', borderRadius:10, padding:'10px 12px', marginBottom:8 }}>
                <div style={{ fontWeight:600 }}>{c.gender==='female'?'👧':'👦'} {c.name}</div>
                <div style={{ fontSize:12, color:'#6B7280' }}>{c.birth_date} · {c.growth_records?.length||0} rekaman</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
