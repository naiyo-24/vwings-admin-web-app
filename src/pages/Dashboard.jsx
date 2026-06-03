import { useState, useEffect } from 'react';
import {
  Users, UserCog, BookOpen, Wallet, Briefcase, HelpCircle,
  Megaphone, ClipboardList, GraduationCap, TrendingUp, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = 'https://appbackend.vwings247.me';

const StatCard = ({ title, value, icon, color, delay = 0, loading }) => (
  <motion.div
    className="glass-card stat-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-muted)' }}>{title}</span>
      <div style={{ padding: '10px', background: `${color}22`, borderRadius: '12px' }}>
        {icon}
      </div>
    </div>
    <div style={{ fontSize: '2.2rem', fontWeight: '700', color: 'var(--text-main)' }}>
      {loading ? (
        <div style={{ width: '60px', height: '36px', background: 'var(--surface-hover)', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
      ) : value}
    </div>
  </motion.div>
);

const RecentCard = ({ title, items, icon, keyField, nameField, subField, loading }) => (
  <div className="glass-panel" style={{ padding: '24px', flex: 1, minWidth: '300px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
      {icon}
      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h3>
    </div>
    {loading ? (
      <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
    ) : items.length === 0 ? (
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No records yet.</p>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.slice(0, 5).map((item, i) => (
          <div key={item[keyField] || i} style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', color: '#FFFFFF', flexShrink: 0 }}>
              {(item[nameField] || '?').charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: '500', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item[nameField]}</div>
              {subField && <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{item[subField]}</div>}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0, teachers: 0, counsellors: 0, courses: 0,
    fees: 0, enquiries: 0, helpTickets: 0, announcements: 0
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentTeachers, setRecentTeachers] = useState([]);
  const [recentCounsellors, setRecentCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const endpoints = [
          '/api/students/get-all',
          '/api/teachers/get-all',
          '/api/counsellors/get-all',
          '/api/courses/get-all',
          '/api/fees/get-all',
          '/api/admission-enquiries/get-all',
          '/api/help-center/get-all',
          '/announcements/get-all',
        ];

        const results = await Promise.allSettled(
          endpoints.map(ep => fetch(`${API_BASE_URL}${ep}`).then(r => r.ok ? r.json() : []))
        );

        const [students, teachers, counsellors, courses, fees, enquiries, helpTickets, announcements] =
          results.map(r => r.status === 'fulfilled' ? r.value : []);

        setStats({
          students: students?.length ?? 0,
          teachers: teachers?.length ?? 0,
          counsellors: counsellors?.length ?? 0,
          courses: courses?.length ?? 0,
          fees: fees?.length ?? 0,
          enquiries: enquiries?.length ?? 0,
          helpTickets: helpTickets?.length ?? 0,
          announcements: announcements?.length ?? 0,
        });

        setRecentStudents([...(students || [])].reverse());
        setRecentTeachers([...(teachers || [])].reverse());
        setRecentCounsellors([...(counsellors || [])].reverse());
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statCards = [
    { title: 'Total Students', value: stats.students, icon: <GraduationCap size={22} color="#F5C300" />, color: '#F5C300' },
    { title: 'Active Teachers', value: stats.teachers, icon: <UserCog size={22} color="#B6007D" />, color: '#B6007D' },
    { title: 'Counsellors', value: stats.counsellors, icon: <Briefcase size={22} color="#4ade80" />, color: '#4ade80' },
    { title: 'Active Courses', value: stats.courses, icon: <BookOpen size={22} color="#60a5fa" />, color: '#60a5fa' },
    { title: 'Fee Records', value: stats.fees, icon: <Wallet size={22} color="#f59e0b" />, color: '#f59e0b' },
    { title: 'Enquiries', value: stats.enquiries, icon: <ClipboardList size={22} color="#a78bfa" />, color: '#a78bfa' },
    { title: 'Help Tickets', value: stats.helpTickets, icon: <HelpCircle size={22} color="#f87171" />, color: '#f87171' },
    { title: 'Announcements', value: stats.announcements, icon: <Megaphone size={22} color="#34d399" />, color: '#34d399' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', animation: 'slideUp 0.5s ease' }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', margin: '0 0 8px 0' }}>Dashboard Overview</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
          Welcome back! Here's a live summary of VWings24x7.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', color: '#f87171' }}>
          <AlertCircle size={20} />
          <span>Could not connect to backend. Some stats may be unavailable.</span>
        </div>
      )}

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {statCards.map((card, i) => (
          <StatCard key={card.title} {...card} delay={i * 0.05} loading={loading} />
        ))}
      </div>

      {/* Recent Registrations */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <TrendingUp color="var(--primary-yellow)" size={22} />
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Recent Registrations</h2>
        </div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <RecentCard
            title="Latest Students"
            items={recentStudents}
            icon={<GraduationCap size={18} color="#F5C300" />}
            keyField="student_id"
            nameField="full_name"
            subField="email"
            loading={loading}
          />
          <RecentCard
            title="Latest Teachers"
            items={recentTeachers}
            icon={<UserCog size={18} color="#B6007D" />}
            keyField="teacher_id"
            nameField="full_name"
            subField="email"
            loading={loading}
          />
          <RecentCard
            title="Latest Counsellors"
            items={recentCounsellors}
            icon={<Briefcase size={18} color="#4ade80" />}
            keyField="counsellor_id"
            nameField="full_name"
            subField="email"
            loading={loading}
          />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
