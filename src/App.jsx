import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import AuthPage from './components/AuthPage';
import Sidebar from './components/Sidebar';
import ParentHome from './pages/ParentHome';
import GrowthPage from './pages/GrowthPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import { ChildrenPage, VaccinePage, MilestonesPage, TipsPage, AdminChildrenPage } from './pages/Pages';

export default function App() {
  const { user } = useAuth();
  const defaultPage = user?.role === 'admin' ? 'admin-dashboard' : 'home';
  const [page, setPage] = useState(defaultPage);
  const [history, setHistory] = useState([defaultPage]);

  // Push ke browser history saat page berubah
  const navigate = (newPage) => {
    window.history.pushState({ page: newPage }, '', '');
    setPage(newPage);
    setHistory(prev => [...prev, newPage]);
  };

  // Handle tombol back browser
  useEffect(() => {
    const handlePop = () => {
      setHistory(prev => {
        if (prev.length <= 1) return prev;
        const newHistory = prev.slice(0, -1);
        setPage(newHistory[newHistory.length - 1]);
        return newHistory;
      });
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  if (!user) return <AuthPage />;

  const renderPage = () => {
    if (user.role === 'admin') {
      switch (page) {
        case 'admin-dashboard': return <AdminDashboard />;
        case 'admin-users':     return <AdminUsers />;
        case 'admin-children':  return <AdminChildrenPage />;
        case 'tips':            return <TipsPage />;
        default:                return <AdminDashboard />;
      }
    }
    switch (page) {
      case 'home':       return <ParentHome setPage={navigate} />;
      case 'children':   return <ChildrenPage />;
      case 'growth':     return <GrowthPage />;
      case 'vaccines':   return <VaccinePage />;
      case 'milestones': return <MilestonesPage />;
      case 'tips':       return <TipsPage />;
      default:           return <ParentHome setPage={navigate} />;
    }
  };

  return (
    <div style={{ display:'flex' }}>
      <Sidebar page={page} setPage={navigate} />
      <main className="main-content">{renderPage()}</main>
    </div>
  );
}