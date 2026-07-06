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
  const menu = user?.role === 'admin' ? ADMIN_MENU : PARENT_MENU;

  return (
    <aside className="sidebar">
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
          <div style={{ width:38, height:38, borderRadius:'50%', background: user?.role==='admin'?'#FEF3C7':'#EDE9FE', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
            {user?.role === 'admin' ? '👑' : '👩'}
          </div>
          <div style={{ overflow:'hidden' }}>
            <div style={{ fontWeight:700, fontSize:13, color:'#1F2937', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name}</div>
            <span className={`badge ${user?.role==='admin'?'badge-admin':'badge-parent'}`} style={{ fontSize:10 }}>
              {user?.role === 'admin' ? 'Admin' : 'Orang Tua'}
            </span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav style={{ flex:1, padding:'12px 10px', overflow:'auto' }}>
        {menu.map(m => (
          <button key={m.key} className={`sidebar-link ${page===m.key?'active':''}`} onClick={() => setPage(m.key)}>
            <span style={{ fontSize:17 }}>{m.icon}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding:'12px 10px', borderTop:'1px solid #F3F4F6' }}>
        <button className="sidebar-link" onClick={logout} style={{ color:'#DC2626' }}>
          <span style={{ fontSize:17 }}>🚪</span>
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
