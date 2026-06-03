import { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, LogOut, User, Mail, Shield, Menu } from 'lucide-react';
import Footer from './Footer';
import NotificationBell from './NotificationBell';
import GlobalSearch from './GlobalSearch';

const API_BASE_URL = 'https://appbackend.vwings247.me';

const Layout = ({ onLogout, admin }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const profileRef = useRef(null);
  // Close profile on outside click
  useEffect(() => {
    const handle = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const adminInitials = admin?.email
    ? admin.email.slice(0, 2).toUpperCase()
    : 'AD';

  const dropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 12px)',
    right: 0,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
    zIndex: 9999,
    overflow: 'hidden',
    animation: 'slideDown 0.2s ease'
  };

  return (
    <div className="app-container">
      <div
        className={`sidebar-overlay ${isMobileSidebarOpen ? 'open' : ''}`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />
      <Sidebar
        onLogout={onLogout}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileSidebarOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex' }}
            >
              <Menu size={28} />
            </button>
            <div className="welcome-text">
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)' }}>Welcome back! ✈️</h2>
              <p className="welcome-sub" style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Ready for your next administration session?</p>
            </div>
          </div>

          <div className="topbar-right">

            {/* Global Search */}
            <GlobalSearch />

            {/* Notifications Bell */}
            <NotificationBell role="admin" userId={admin?.id || "admin"} />

            {/* Profile Avatar */}
            <div style={{ position: 'relative' }} ref={profileRef}>
              <div
                className="avatar"
                onClick={() => setShowProfile(v => !v)}
                title={admin?.email}
                style={{ cursor: 'pointer' }}
              >
                {adminInitials}
              </div>

              {showProfile && (
                <div style={{ ...dropdownStyle, width: '280px' }}>
                  {/* Profile Header */}
                  <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                    <div style={{
                      width: '60px', height: '60px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--deep-navy), var(--magenta))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.4rem', fontWeight: '700', margin: '0 auto 12px'
                    }}>
                      {adminInitials}
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Administrator</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '4px' }}>{admin?.email}</div>
                  </div>

                  {/* Profile Info */}
                  <div style={{ padding: '12px 8px' }}>
                    <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.88rem', borderRadius: '8px' }}>
                      <Shield size={16} color="var(--primary-yellow)" />
                      <span>Role: <strong style={{ color: 'var(--text-main)' }}>Super Admin</strong></span>
                    </div>
                    <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.88rem', borderRadius: '8px' }}>
                      <Mail size={16} color="#60a5fa" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{admin?.email}</span>
                    </div>
                    <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.88rem', borderRadius: '8px' }}>
                      <User size={16} color="#4ade80" />
                      <span>ID: <span style={{ color: 'var(--text-main)', fontSize: '0.78rem' }}>{admin?.id || '—'}</span></span>
                    </div>
                  </div>

                  {/* Logout */}
                  <div style={{ padding: '8px', borderTop: '1px solid var(--border)' }}>
                    <button
                      onClick={() => { setShowProfile(false); onLogout(); }}
                      style={{
                        width: '100%', padding: '12px 16px',
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '10px', color: '#f87171', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        fontSize: '0.9rem', fontWeight: '500', transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="content-wrapper" style={{ animation: 'slideUp 0.5s ease' }}>
          <Outlet />
          <Footer />
        </div>
      </main>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Layout;
