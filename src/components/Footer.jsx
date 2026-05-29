import React from 'react';

const Footer = () => {
  return (
    <footer className="glass-card" style={{
      marginTop: '40px',
      padding: '20px',
      textAlign: 'center',
      fontSize: '0.85rem',
      color: 'var(--text-muted)'
    }}>
      <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} VWings24x7. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
