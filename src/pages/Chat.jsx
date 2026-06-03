import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { Video, Calendar, Clock, MoreVertical, Edit, Link, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'http://localhost:8000';

const LiveClassCard = ({ liveClass, idx, onEdit }) => {
  const toast = useToast();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: idx * 0.1 }}
      className="glass-card"
      style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,215,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-yellow)' }}>
              <Video size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{liveClass.class_name || 'Unnamed Class'}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                {liveClass.class_description || 'No description'} • By: {liveClass.teacher_details && liveClass.teacher_details.length > 0 ? liveClass.teacher_details[0].full_name : 'No assigned teacher'}
              </p>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <MoreVertical size={20} />
            </button>

            {showMenu && (
              <div style={{
                position: 'absolute', right: 0, top: '24px',
                background: 'rgba(30, 10, 55, 0.95)', border: '1px solid var(--border)',
                backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '8px', padding: '8px', zIndex: 10,
                minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '4px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
              }}>
                <button
                  onClick={() => { setShowMenu(false); onEdit(liveClass); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer', borderRadius: '4px', textAlign: 'left' }}
                  className="menu-item-hover"
                >
                  <Edit size={14} /> Add/Edit Meeting Link
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <Calendar size={16} /> {liveClass.class_date || 'Date TBD'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <Clock size={16} /> {liveClass.class_time || 'Time TBD'}
          </div>

          {liveClass.meet_link ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4285F4', fontSize: '0.9rem', marginTop: '8px', background: 'rgba(66, 133, 244, 0.1)', padding: '8px 12px', borderRadius: '8px', wordBreak: 'break-all' }}>
              <Link size={16} style={{ flexShrink: 0 }} />
              <a href={liveClass.meet_link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                {liveClass.meet_link}
              </a>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-yellow)', fontSize: '0.9rem', marginTop: '8px', background: 'rgba(255, 215, 0, 0.1)', padding: '8px 12px', borderRadius: '8px' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>Meeting link pending. Please add one.</span>
            </div>
          )}
        </div>

        {!liveClass.meet_link && (
          <button
            onClick={() => onEdit(liveClass)}
            className="btn-primary"
            style={{ width: '100%', marginTop: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            <Link size={16} /> Add Meeting Link
          </button>
        )}
      </div>
    </motion.div>
  );
};

const MeetLinkModal = ({ liveClass, onClose, onSave }) => {
  const toast = useToast();
  const [meetLink, setMeetLink] = useState(liveClass.meet_link || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...liveClass, meet_link: meetLink });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card" style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', background: 'var(--background)', overflow: 'hidden' }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Link size={20} color="var(--primary-yellow)" /> Setup Meeting Link</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Read-Only Details */}
          <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Class Title</p>
            <p style={{ margin: 0, fontWeight: '500' }}>{liveClass.class_name}</p>

            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Date</p>
                <p style={{ margin: 0, fontWeight: '500' }}>{liveClass.class_date || 'Not set'}</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Time</p>
                <p style={{ margin: 0, fontWeight: '500' }}>{liveClass.class_time || 'Not set'}</p>
              </div>
            </div>

            <div style={{ marginTop: '8px' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Teacher</p>
              <p style={{ margin: 0, fontWeight: '500' }}>{liveClass.teacher_details && liveClass.teacher_details.length > 0 ? liveClass.teacher_details[0].full_name : 'No assigned teacher'}</p>
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: 0, marginTop: '8px' }}>
            <label>Google Meet Link *</label>
            <input
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Link</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ChatClasses = () => {
  const toast = useToast();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/classrooms/get-all`);
      if (res.ok) {
        const data = await res.json();
        setClasses(data);
      } else {
        setClasses([]);
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSaveLink = async (updatedClass) => {
    try {
      const classId = updatedClass.class_id || updatedClass.id || updatedClass._id;
      const res = await fetch(`${API_BASE_URL}/api/classrooms/update-meet-link/${classId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meet_link: updatedClass.meet_link })
      });

      if (res.ok) {
        fetchClasses(); // Re-fetch to sync with DB
        setSelectedClass(null);
      } else {
        toast.error('Failed to save meeting link. Server responded with an error.');
      }
    } catch (err) {
      console.error('Error saving link:', err);
      toast.error('Failed to save meeting link.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Live Classes & Chat</h1>
          <p>Manage meeting links for classes scheduled by teachers.</p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading live classes...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {classes.map((liveClass, idx) => (
            <LiveClassCard
              key={liveClass.class_id || liveClass.id || liveClass._id || idx}
              liveClass={liveClass}
              idx={idx}
              onEdit={(c) => setSelectedClass(c)}
            />
          ))}
          {classes.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No live classes have been created by teachers yet.</p>}
        </div>
      )}

      <AnimatePresence>
        {selectedClass && (
          <MeetLinkModal
            liveClass={selectedClass}
            onClose={() => setSelectedClass(null)}
            onSave={handleSaveLink}
          />
        )}
      </AnimatePresence>
      <style>{`
        .menu-item-hover:hover {
          var(--surface-hover) !important;
        }
      `}</style>
    </div>
  );
};

export default ChatClasses;

