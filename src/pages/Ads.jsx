import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from '../components/DataTable';

const API_BASE_URL = 'http://localhost:8000';

const AdModal = ({ ad, onClose, onSave }) => {
  const [formData, setFormData] = useState(ad || {
    headline: '',
    tagline: '',
    website_link: '',
    active_status: true
  });
  const [adImage, setAdImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, adImage);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: 'var(--background)', overflow: 'hidden' }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{ad ? 'Edit Advertisement' : 'Create Advertisement'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><X size={20}/></button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
          <div style={{ padding: '32px' }}>
            <form id="ad-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
              
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Headline *</label>
                <input name="headline" value={formData.headline} onChange={handleChange} required />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Tagline</label>
                <input name="tagline" value={formData.tagline || ''} onChange={handleChange} />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Website Link URL</label>
                <input type="url" name="website_link" value={formData.website_link || ''} onChange={handleChange} placeholder="https://" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Ad Banner Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setAdImage(e.target.files[0])} style={{ background: 'var(--surface)', padding: '10px' }} />
                  {ad?.ad_image && !adImage && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current image exists. Uploading new will replace it.</span>}
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
          <button type="submit" form="ad-form" className="btn-primary">Save Advertisement</button>
        </div>
      </motion.div>
    </div>
  );
};

const Ads = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [selectedAd, setSelectedAd] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ads/get-all`);
      if (response.ok) {
        setAds(await response.json());
      }
    } catch (err) {
      console.error('Error fetching ads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (data, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('headline', data.headline);
      if (data.tagline) formData.append('tagline', data.tagline);
      if (data.website_link) formData.append('website_link', data.website_link);
      formData.append('active_status', data.active_status);
      if (imageFile) formData.append('ad_image', imageFile);

      if (modalMode === 'create') {
        const response = await fetch(`${API_BASE_URL}/api/ads/create`, {
          method: 'POST',
          body: formData
        });
        if (!response.ok) throw new Error("Failed to create");
      } else if (modalMode === 'edit') {
        const response = await fetch(`${API_BASE_URL}/api/ads/put-by/${data.id}`, {
          method: 'PUT',
          body: formData
        });
        if (!response.ok) throw new Error("Failed to update");
      }
      setModalMode(null);
      setSelectedAd(null);
      fetchData();
    } catch (err) {
      console.error('Error saving ad:', err);
      alert('Failed to save advertisement. Check console.');
    }
  };

  const handleDelete = async (ad) => {
    if (window.confirm(`Are you sure you want to delete "${ad.headline}"?`)) {
      try {
        await fetch(`${API_BASE_URL}/api/ads/delete-by/${ad.id}`, { method: 'DELETE' });
        fetchData();
      } catch (err) {
        console.error('Error deleting ad:', err);
      }
    }
  };

  const columns = [
    { 
      header: 'Advertisement', 
      accessor: 'headline',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {row.ad_image ? (
            <img 
              src={`${API_BASE_URL}/${row.ad_image.replace(/\\\\/g, '/')}`} 
              alt={row.headline} 
              style={{ width: '60px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} 
            />
          ) : (
            <div style={{ width: '60px', height: '40px', borderRadius: '8px', background: 'rgba(245, 195, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ImageIcon size={20} color="var(--primary-yellow)" />
            </div>
          )}
          <div>
            <div style={{ fontWeight: '500' }}>{row.headline}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.tagline || 'No tagline'}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Link', 
      accessor: 'website_link',
      render: (row) => row.website_link ? (
        <a 
          href={row.website_link} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary-yellow)', textDecoration: 'none' }}
        >
          <ExternalLink size={14} /> Visit Link
        </a>
      ) : (
        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>No link</span>
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
      header: 'Created', 
      accessor: 'created_at',
      render: (row) => new Date(row.created_at).toLocaleDateString()
    },
  ];

  if (loading) return <p>Loading advertisements...</p>;

  return (
    <div style={{ animation: 'slideUp 0.5s ease' }}>
      <DataTable 
        title="Advertisements Management" 
        columns={columns} 
        data={ads} 
        onAdd={() => { setSelectedAd(null); setModalMode('create'); }}
        onEdit={(ad) => { setSelectedAd(ad); setModalMode('edit'); }}
        onDelete={handleDelete}
      />
      <AnimatePresence>
        {modalMode && (
          <AdModal 
            ad={selectedAd}
            onClose={() => setModalMode(null)} 
            onSave={handleSave} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ads;
