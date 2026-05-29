import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCog, BookOpen, 
  CreditCard, Wallet, Megaphone, MonitorPlay, 
  MessageSquareMore, HelpCircle, GraduationCap, 
  Sparkles, Rocket, LogOut, Video
} from 'lucide-react';

const Sidebar = ({ onLogout }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Students', icon: <Users size={20} />, path: '/students' },
    { name: 'Teachers', icon: <UserCog size={20} />, path: '/teachers' },
    { name: 'Courses', icon: <BookOpen size={20} />, path: '/courses' },
    { name: 'Live Classes & Chat', icon: <Video size={20} />, path: '/chat' },
    { name: 'Fees', icon: <CreditCard size={20} />, path: '/fees' },
    { name: 'Teacher Salaries', icon: <Wallet size={20} />, path: '/salaries' },
    { name: 'Counsellor Payouts', icon: <Wallet size={20} />, path: '/commissions' },
    { name: 'Announcements', icon: <Megaphone size={20} />, path: '/announcements' },
    { name: 'Ads', icon: <MonitorPlay size={20} />, path: '/ads' },
    { name: 'Enquiries', icon: <MessageSquareMore size={20} />, path: '/enquiries' },
    { name: 'Counsellors', icon: <GraduationCap size={20} />, path: '/counsellors' },
    { name: 'Generation', icon: <Sparkles size={20} />, path: '/generation' },
    { name: 'Help Center', icon: <HelpCircle size={20} />, path: '/help' },
    { name: 'Onboarding', icon: <Rocket size={20} />, path: '/onboarding' },
    { name: 'About Us', icon: <HelpCircle size={20} />, path: '/about' },
    { name: 'IT Support', icon: <HelpCircle size={20} />, path: '/support' },
  ];

  return (
    <div className="sidebar">
      <div className="brand" style={{ marginBottom: '20px' }}>
        <img src="/assets/V-Wings_Logo_nobg.png" alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        <span style={{ color: 'var(--primary-yellow)' }}>Admin Panel</span>
      </div>

      <div className="nav-links" style={{ overflowY: 'auto', paddingRight: '10px' }}>
        {menuItems.map((item, index) => (
          <NavLink 
            key={index} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
        <button 
          onClick={onLogout}
          className="nav-item" 
          style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
