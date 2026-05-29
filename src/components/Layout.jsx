import { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search, LogOut, User, Mail, Shield, X, CheckCheck } from 'lucide-react';
import Footer from './Footer';

const API_BASE_URL = 'http://localhost:8000';

const Layout = ({ onLogout, admin }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handle = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // Pull recent announcements as notifications
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/announcements/get-all`);
        if (res.ok) {
          const data = await res.json();
          const notifs = data.slice(-10).reverse().map(a => ({
            id: a.announcement_id,
            title: a.title,
            body: a.content?.slice(0, 60) + (a.content?.length > 60 ? '...' : ''),
            time: new Date(a.created_at).toLocaleDateString(),
            read: false
          }));
          setNotifications(notifs);
          setUnreadCount(notifs.length);
        }
      } catch { /* silently ignore */ }
    };
    fetchNotifs();
  }, []);

  const markAllRead = () => {
    setNotifications(n => n.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const markRead = (id) => {
    setNotifications(n => n.map(notif => notif.id === id ? { ...notif, read: true } : notif));
    setUnreadCount(c => Math.max(0, c - 1));
  };

  const adminInitials = admin?.email
    ? admin.email.slice(0, 2).toUpperCase()
    : 'AD';

  const dropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 12px)',
    right: 0,
    background: 'rgba(5, 5, 15, 0.98)',
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
      <Sidebar onLogout={onLogout} />

      <main className="main-content">
        <header className="topbar">
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)' }}>Welcome back, Admin! ✈️</h2>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Ready for your next administration session?</p>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>

            {/* Notifications Bell */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button
                onClick={() => { setShowNotifications(v => !v); setShowProfile(false); }}
                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'var(--text-main)', cursor: 'pointer', padding: '10px', borderRadius: '12px', position: 'relative', display: 'flex', alignItems: 'center' }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-4px', right: '-4px',
                    background: '#ef4444', color: 'white', borderRadius: '50%',
                    width: '18px', height: '18px', fontSize: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700'
                  }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div style={{ ...dropdownStyle, width: '340px' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--primary-yellow)', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCheck size={14} /> Mark all read
                      </button>
                    )}
                  </div>
                  <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        No notifications
                      </div>
                    ) : notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => markRead(notif.id)}
                        style={{
                          padding: '14px 20px',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          cursor: 'pointer',
                          background: notif.read ? 'transparent' : 'rgba(245,195,0,0.05)',
                          transition: 'background 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <div>
                            <div style={{ fontWeight: notif.read ? '400' : '600', fontSize: '0.88rem', marginBottom: '4px' }}>
                              {!notif.read && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F5C300', display: 'inline-block', marginRight: '8px' }} />}
                              {notif.title}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{notif.body}</div>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>{notif.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div style={{ position: 'relative' }} ref={profileRef}>
              <div
                className="avatar"
                onClick={() => { setShowProfile(v => !v); setShowNotifications(false); }}
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
