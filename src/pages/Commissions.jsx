import React, { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from '../components/DataTable';

const API_BASE_URL = 'http://localhost:8000';

const months = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' },
  { value: 3, label: 'March' }, { value: 4, label: 'April' },
  { value: 5, label: 'May' }, { value: 6, label: 'June' },
  { value: 7, label: 'July' }, { value: 8, label: 'August' },
  { value: 9, label: 'September' }, { value: 10, label: 'October' },
  { value: 11, label: 'November' }, { value: 12, label: 'December' }
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const CommissionModal = ({ counsellors, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    counsellor_id: counsellors.length > 0 ? counsellors[0].counsellor_id : '',
    month: new Date().getMonth() + 1,
    year: currentYear
  });
  const [slipFile, setSlipFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!slipFile) {
      alert("Please upload the payout slip file.");
      return;
    }
    onSave(formData, slipFile);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: 'var(--background)', overflow: 'hidden' }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Upload Payout Slip</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><X size={20}/></button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
          <div style={{ padding: '32px' }}>
            <form id="commission-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
              
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Select Counsellor *</label>
                <select name="counsellor_id" value={formData.counsellor_id} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit' }} required>
                  {counsellors.map(c => (
                    <option key={c.counsellor_id} value={c.counsellor_id} style={{ background: 'var(--background)' }}>
                      {c.full_name} ({c.counsellor_id})
                    </option>
                  ))}
                  {counsellors.length === 0 && <option value="" disabled>No counsellors found</option>}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Month *</label>
                  <select name="month" value={formData.month} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit' }} required>
                    {months.map(m => (
                      <option key={m.value} value={m.value} style={{ background: 'var(--background)' }}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Year *</label>
                  <select name="year" value={formData.year} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit' }} required>
                    {years.map(y => (
                      <option key={y} value={y} style={{ background: 'var(--background)' }}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Payout Slip (PDF/Image) *</label>
                <input type="file" onChange={(e) => setSlipFile(e.target.files[0])} style={{ background: 'var(--surface)', padding: '10px' }} required />
              </div>

            </form>
          </div>
        </div>

        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" form="commission-form" className="btn-primary">Upload Slip</button>
        </div>
      </motion.div>
    </div>
  );
};

const Commissions = () => {
  const [commissions, setCommissions] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(false);

  const fetchData = async () => {
    try {
      const [resCommissions, resCounsellors] = await Promise.all([
        fetch(`${API_BASE_URL}/api/commissions/get-all`), // Need to verify if get-all exists
        fetch(`${API_BASE_URL}/api/counsellors/get-all`)
      ]);
      if (resCounsellors.ok) {
        setCounsellors(await resCounsellors.json());
      }
      if (resCommissions.ok) {
        setCommissions(await resCommissions.json());
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (data, slipFile) => {
    try {
      const formData = new FormData();
      formData.append('counsellor_id', data.counsellor_id);
      formData.append('month', data.month);
      formData.append('year', data.year);
      formData.append('file', slipFile);

      const response = await fetch(`${API_BASE_URL}/api/commissions/create`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setModalMode(false);
        fetchData();
      } else {
        const errData = await response.json();
        alert(`Failed to upload: ${errData.detail}`);
      }
    } catch (err) {
      console.error('Error uploading payout slip:', err);
      alert('Failed to save payout. Check console.');
    }
  };

  const handleDelete = async (commission) => {
    if (window.confirm(`Are you sure you want to delete the payout slip for ${commission.counsellor_name} (${commission.month}/${commission.year})?`)) {
      try {
        await fetch(`${API_BASE_URL}/api/commissions/delete-by/${commission.commission_id}`, { method: 'DELETE' });
        fetchData();
      } catch (err) {
        console.error('Error deleting payout:', err);
      }
    }
  };

  const getMonthName = (monthNum) => {
    const month = months.find(m => m.value === parseInt(monthNum));
    return month ? month.label : monthNum;
  };

  // Map counsellor names to commissions for display
  const displayCommissions = commissions.map(comm => {
    const counsellor = counsellors.find(c => c.counsellor_id === comm.counsellor_id);
    return {
      ...comm,
      counsellor_name: counsellor ? counsellor.full_name : 'Unknown Counsellor',
      counsellor_email: counsellor ? counsellor.email : 'N/A',
      counsellor_photo: counsellor ? counsellor.profile_photo : null
    };
  });

  const columns = [
    { 
      header: 'Counsellor', 
      accessor: 'counsellor_name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {row.counsellor_photo ? (
            <img 
              src={`${API_BASE_URL}/${row.counsellor_photo.replace(/\\\\/g, '/')}`} 
              alt={row.counsellor_name} 
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
            />
          ) : (
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-button)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--deep-navy)', fontWeight: 'bold', fontSize: '14px' }}>
              {row.counsellor_name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontWeight: '500' }}>{row.counsellor_name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.counsellor_id}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Period', 
      accessor: 'month',
      render: (row) => <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>{getMonthName(row.month)} {row.year}</span>
    },
    { 
      header: 'Upload Date', 
      accessor: 'created_at',
      render: (row) => new Date(row.created_at).toLocaleDateString()
    },
    {
      header: 'Payout Slip',
      accessor: 'file_path',
      render: (row) => (
        <a 
          href={`${API_BASE_URL}/${row.file_path.replace(/\\\\/g, '/')}`} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary-yellow)', textDecoration: 'none', background: 'rgba(245, 195, 0, 0.1)', padding: '6px 12px', borderRadius: '8px' }}
        >
          <FileText size={16} /> View
        </a>
      )
    }
  ];

  if (loading) return <p>Loading payouts...</p>;

  return (
    <div style={{ animation: 'slideUp 0.5s ease' }}>
      <DataTable 
        title="Counsellor Payouts Management" 
        columns={columns} 
        data={displayCommissions} 
        onAdd={() => setModalMode(true)}
        onDelete={handleDelete}
      />
      <AnimatePresence>
        {modalMode && (
          <CommissionModal 
            counsellors={counsellors}
            onClose={() => setModalMode(false)} 
            onSave={handleSave} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Commissions;
