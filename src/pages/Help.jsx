import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Phone, Mail, FileText, CheckCircle, Clock } from 'lucide-react';
import DataTable from '../components/DataTable';

const API_BASE_URL = 'http://localhost:8000';

const HelpModal = ({ query, onClose, onSave }) => {
  const toast = useToast();
  const [status, setStatus] = useState(query ? query.status : 'open');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query) {
      onSave(query.report_id, status);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card" style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} color="var(--primary-yellow)" /> View Help Query
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Report ID</label>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{query.report_id}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Submitted By</label>
              <div style={{ fontWeight: '500' }}>{query.name || 'Anonymous'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} color="var(--text-muted)" />
              <span>{query.phone_no || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} color="var(--text-muted)" />
              <span>{query.email || 'N/A'}</span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <FileText size={14} /> Problem Description
            </label>
            <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', lineHeight: '1.6', color: 'var(--text-main)' }}>
              {query.problem_description || 'No description provided.'}
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Update Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)' }}>
              <option value="open">Open - Needs Attention</option>
              <option value="in_progress">In Progress - Being Looked At</option>
              <option value="resolved">Resolved - Issue Fixed</option>
            </select>
          </div>

        </div>

        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary">Update Status</button>
        </div>
      </motion.div>
    </div>
  );
};

const Help = () => {
  const toast = useToast();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/helpcenter/get-all`);
      if (res.ok) {
        setQueries(await res.json());
      }
    } catch (err) {
      console.error('Error fetching help queries:', err);
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
        const res = await fetch(`${API_BASE_URL}/api/helpcenter/get-all`);
        if (res.ok) setQueries(await res.json());
      } catch (err) { console.error(err); }
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/search/table/help_center?q=${encodeURIComponent(term)}`);
      if (res.ok) setQueries(await res.json());
    } catch (err) {
      console.error('Error searching help queries:', err);
    }
  };

  const handleSave = async (reportId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/helpcenter/update-status/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setSelectedQuery(null);
        fetchData();
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (query) => {
    if (await toast.confirm(`Are you sure you want to delete report ${query.report_id}?`)) {
      try {
        await fetch(`${API_BASE_URL}/api/helpcenter/delete/${query.report_id}`, { method: 'DELETE' });
        fetchData();
      } catch (err) {
        console.error('Error deleting report:', err);
      }
    }
  };

  const columns = [
    { header: 'Report ID', accessor: 'report_id', render: (row) => <span style={{ fontWeight: '600', color: 'var(--primary-yellow)' }}>#{row.report_id}</span> },
    {
      header: 'User Info',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '500' }}>{row.name || 'Unknown'}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.phone_no || row.email}</div>
        </div>
      )
    },
    {
      header: 'Issue Preview',
      accessor: 'problem_description',
      render: (row) => (
        <span style={{ color: 'var(--text-muted)' }}>
          {row.problem_description ? (row.problem_description.length > 50 ? row.problem_description.substring(0, 50) + '...' : row.problem_description) : 'No description'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        let badgeStyle = { padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '4px' };
        if (row.status === 'resolved') badgeStyle = { ...badgeStyle, background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80' };
        else if (row.status === 'in_progress') badgeStyle = { ...badgeStyle, background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' };
        else badgeStyle = { ...badgeStyle, background: 'rgba(248, 113, 113, 0.2)', color: '#f87171' }; // open

        return (
          <span style={badgeStyle}>
            {row.status === 'resolved' ? <CheckCircle size={12} /> : <Clock size={12} />}
            {row.status.replace('_', ' ').toUpperCase()}
          </span>
        );
      }
    }
  ];

  if (loading) return <p>Loading queries...</p>;

  return (
    <div style={{ animation: 'slideUp 0.5s ease' }}>
      <DataTable
        title="Help Center Queries"
        columns={columns}
        data={queries}
        // We only edit existing queries in the admin panel, users create them.
        onEdit={(query) => setSelectedQuery(query)}
        onDelete={handleDelete}
        onSearch={handleSearch}
      />

      <AnimatePresence>
        {selectedQuery && (
          <HelpModal
            query={selectedQuery}
            onClose={() => setSelectedQuery(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Help;

