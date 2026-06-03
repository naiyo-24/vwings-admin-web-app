import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { X, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from '../components/DataTable';

const API_BASE_URL = 'https://appbackend.vwings247.me';

const AnnouncementModal = ({ announcement, onClose, onSave }) => {
  const toast = useToast();
  const [formData, setFormData] = useState(announcement || {
    headline: '',
    description: '',
    role: 'student',
    active_status: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: 'var(--background)', overflow: 'hidden' }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{announcement ? 'Edit Announcement' : 'Create Announcement'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
          <div style={{ padding: '32px' }}>
            <form id="announcement-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Headline *</label>
                <input name="headline" value={formData.headline} onChange={handleChange} required />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Description *</label>
                <textarea
                  name="description" value={formData.description} onChange={handleChange} required
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit', minHeight: '100px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Target Role *</label>
                  <select name="role" value={formData.role} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit' }} required disabled={!!announcement}>
                    <option value="student" style={{ background: 'var(--background)' }}>Student</option>
                    <option value="teacher" style={{ background: 'var(--background)' }}>Teacher</option>
                  </select>
                  {announcement && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Role cannot be changed during edit.</span>}
                </div>
                <div className="input-group" style={{ marginBottom: 0, justifyContent: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '1rem' }}>
                    <input type="checkbox" name="active_status" checked={formData.active_status} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
                    Active (Publish immediately)
                  </label>
                </div>
              </div>

            </form>
          </div>
        </div>

        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" form="announcement-form" className="btn-primary">Save Announcement</button>
        </div>
      </motion.div>
    </div>
  );
};

const Announcements = () => {
  const toast = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements/get-all`);
      if (response.ok) {
        setAnnouncements(await response.json());
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = async (term) => {
    if (!term) {
      try {
        const res = await fetch(`${API_BASE_URL}/announcements/get-all`);
        if (res.ok) setAnnouncements(await res.json());
      } catch (err) { console.error(err); }
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/search/table/announcements?q=${encodeURIComponent(term)}`);
      if (res.ok) setAnnouncements(await res.json());
    } catch (err) {
      console.error('Error searching announcements:', err);
    }
  };

  const handleSave = async (data) => {
    try {
      if (modalMode === 'create') {
        const payload = {
          headline: data.headline,
          description: data.description,
          active_status: data.active_status
        };
        const response = await fetch(`${API_BASE_URL}/announcements/create/role/${data.role}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Failed to create");
      } else if (modalMode === 'edit') {
        const payload = {
          headline: data.headline,
          description: data.description,
          active_status: data.active_status
        };
        const response = await fetch(`${API_BASE_URL}/announcements/update-by/role/${data.role}/${data.announcement_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Failed to update");
      }
      setModalMode(null);
      setSelectedAnnouncement(null);
      fetchData();
    } catch (err) {
      console.error('Error saving announcement:', err);
      toast.error('Failed to save announcement. Check console.');
    }
  };

  const handleDelete = async (ann) => {
    if (await toast.confirm(`Are you sure you want to delete "${ann.headline}"?`)) {
      try {
        await fetch(`${API_BASE_URL}/announcements/delete-by/role/${ann.role}/${ann.announcement_id}`, { method: 'DELETE' });
        fetchData();
      } catch (err) {
        console.error('Error deleting announcement:', err);
      }
    }
  };

  const columns = [
    {
      header: 'Headline',
      accessor: 'headline',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', background: 'rgba(245, 195, 0, 0.2)', borderRadius: '10px' }}>
            <Megaphone size={18} color="var(--primary-yellow)" />
          </div>
          <div>
            <div style={{ fontWeight: '500' }}>{row.headline}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.description.length > 50 ? row.description.substring(0, 50) + '...' : row.description}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Target Role',
      accessor: 'role',
      render: (row) => (
        <span style={{ textTransform: 'capitalize', padding: '4px 12px', background: 'var(--surface-hover)', borderRadius: '12px', fontSize: '12px' }}>
          {row.role}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'active_status',
      render: (row) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          background: row.active_status ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)',
          color: row.active_status ? '#4ade80' : '#f87171'
        }}>
          {row.active_status ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Created On',
      accessor: 'created_at',
      render: (row) => new Date(row.created_at).toLocaleDateString()
    },
  ];

  if (loading) return <p>Loading announcements...</p>;

  return (
    <div style={{ animation: 'slideUp 0.5s ease' }}>
      <DataTable
        title="Announcements Management"
        columns={columns}
        data={announcements}
        onAdd={() => { setSelectedAnnouncement(null); setModalMode('create'); }}
        onEdit={(ann) => { setSelectedAnnouncement(ann); setModalMode('edit'); }}
        onDelete={handleDelete}
        onSearch={handleSearch}
      />
      <AnimatePresence>
        {modalMode && (
          <AnnouncementModal
            announcement={selectedAnnouncement}
            onClose={() => setModalMode(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Announcements;

