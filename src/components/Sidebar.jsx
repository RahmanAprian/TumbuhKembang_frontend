import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const PARENT_MENU = [
  { key:'home',       icon:'🏠', label:'Beranda'      },
  { key:'children',   icon:'👶', label:'Data Anak'    },
  { key:'growth',     icon:'📊', label:'Pertumbuhan'  },
  { key:'vaccines',   icon:'💉', label:'Vaksinasi'    },
  { key:'milestones', icon:'🏅', label:'Tonggak'      },
  { key:'tips',       icon:'💡', label:'Tips & Info'  },
];
const ADMIN_MENU = [
  { key:'admin-dashboard', icon:'📈', label:'Dashboard'       },
  { key:'admin-users',     icon:'👥', label:'Kelola Pengguna' },
  { key:'admin-children',  icon:'👶', label:'Kelola Anak'     },
  { key:'tips',            icon:'💡', label:'Tips & Info'     },
];

export default function Sidebar({ page, setPage }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menu = user?.role === 'admin' ? ADMIN_MENU : PARENT_MENU;

  const handleNav = (key) => {
    setPage(key);
    setMobileOpen(false);
  };

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside style={{ width:240, minHeight:'100vh', background:'#fff', borderRight:'1px solid #E5E7EB', position:'fixed', top:0, left:0, zIndex:50, display:'flex', flexDirection:'column' }}
        className="desktop-sidebar">

        {/* Brand */}
        <div style={{ padding:'20px 16px', borderBottom:'1px solid #F3F4F6' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:28 }}>🌱</span>
            <div>
              <div style={{ fontWeight:800, fontSize:15, color:'#1F2937' }}>TumbuhKembang</div>
              <div style={{ fontSize:11, color:'#9CA3AF' }}>v2.0</div>
            </div>
          </div>
        </div>

        {/* User info */}
        <div style={{ padding:'14px 16px', borderBottom:'1px solid #F3F4F6' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:'50%', background:user?.role==='admin'?'#FEF3C7':'#EDE9FE', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
              {user?.role==='admin'?'👑':'👩'}
            </div>
            <div style={{ overflow:'hidden' }}>
              <div style={{ fontWeight:700, fontSize:13, color:'#1F2937', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name}</div>
              <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99, background:user?.role==='admin'?'#FEF3C7':'#EDE9FE', color:user?.role==='admin'?'#92400E':'#5B21B6' }}>
                {user?.role==='admin'?'Admin':'Orang Tua'}
              </span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav style={{ flex:1, padding:'12px 10px', overflow:'auto' }}>
          {menu.map(m => (
            <button key={m.key} onClick={() => handleNav(m.key)}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', borderRadius:10, color:page===m.key?'#fff':'#4B5563', fontSize:14, fontWeight:500, cursor:'pointer', border:'none', background:page===m.key?'#7C3AED':'transparent', width:'100%', textAlign:'left', marginBottom:2, transition:'all 0.15s' }}>
              <span style={{ fontSize:17 }}>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding:'12px 10px', borderTop:'1px solid #F3F4F6' }}>
          <button onClick={logout}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', borderRadius:10, color:'#DC2626', fontSize:14, fontWeight:500, cursor:'pointer', border:'none', background:'transparent', width:'100%', textAlign:'left' }}>
            <span style={{ fontSize:17 }}>🚪</span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Navbar ── */}
      <div style={{ display:'none', position:'fixed', top:0, left:0, right:0, zIndex:100, background:'#fff', borderBottom:'1px solid #E5E7EB', padding:'10px 16px', alignItems:'center', justifyContent:'space-between', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}
        className="mobile-navbar">
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:22 }}>🌱</span>
          <span style={{ fontWeight:800, fontSize:15, color:'#1F2937' }}>TumbuhKembang</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background:'none', border:'none', fontSize:24, cursor:'pointer', color:'#374151' }}>
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:99 }}>
          {/* Backdrop */}
          <div onClick={() => setMobileOpen(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.4)' }} />
          {/* Drawer */}
          <div style={{ position:'absolute', top:0, left:0, bottom:0, width:260, background:'#fff', display:'flex', flexDirection:'column', boxShadow:'4px 0 20px rgba(0,0,0,0.15)' }}>
            <div style={{ padding:'16px', borderBottom:'1px solid #F3F4F6', display:'flex', alignItems:'center', gap:10, marginTop:10 }}>
              <div style={{ width:38, height:38, borderRadius:'50%', background:user?.role==='admin'?'#FEF3C7':'#EDE9FE', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
                {user?.role==='admin'?'👑':'👩'}
              </div>
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:'#1F2937' }}>{user?.name}</div>
                <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99, background:user?.role==='admin'?'#FEF3C7':'#EDE9FE', color:user?.role==='admin'?'#92400E':'#5B21B6' }}>
                  {user?.role==='admin'?'Admin':'Orang Tua'}
                </span>
              </div>
            </div>
            <nav style={{ flex:1, padding:'12px 10px', overflow:'auto' }}>
              {menu.map(m => (
                <button key={m.key} onClick={() => handleNav(m.key)}
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', borderRadius:10, color:page===m.key?'#fff':'#4B5563', fontSize:14, fontWeight:500, cursor:'pointer', border:'none', background:page===m.key?'#7C3AED':'transparent', width:'100%', textAlign:'left', marginBottom:2 }}>
                  <span style={{ fontSize:17 }}>{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </nav>
            <div style={{ padding:'12px 10px', borderTop:'1px solid #F3F4F6' }}>
              <button onClick={() => { logout(); setMobileOpen(false); }}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', borderRadius:10, color:'#DC2626', fontSize:14, fontWeight:500, cursor:'pointer', border:'none', background:'#FEE2E2', width:'100%', textAlign:'left', fontWeight:600 }}>
                <span style={{ fontSize:17 }}>🚪</span>
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CSS untuk responsive ── */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-navbar { display: flex !important; }
          .main-content { margin-left: 0 !important; padding-top: 70px !important; }
        }
        @media (min-width: 769px) {
          .desktop-sidebar { display: flex !important; }
          .mobile-navbar { display: none !important; }
        }
      `}</style>
    </>
  );
}