import React, { useState, useEffect } from 'react';
import { X, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from '../components/DataTable';

const API_BASE_URL = 'http://localhost:8000';

const FeeModal = ({ students, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    student_id: students.length > 0 ? students[0].student_id : '',
    installment_no: ''
  });
  const [feeFile, setFeeFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feeFile) {
      alert("Please upload the fee receipt file.");
      return;
    }
    onSave(formData, feeFile);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: 'var(--background)', overflow: 'hidden' }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Upload Fee Receipt</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><X size={20}/></button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
          <div style={{ padding: '32px' }}>
            <form id="fee-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
              
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Select Student *</label>
                <select name="student_id" value={formData.student_id} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit' }} required>
                  {students.map(s => (
                    <option key={s.student_id} value={s.student_id} style={{ background: 'var(--background)' }}>
                      {s.full_name} ({s.student_id})
                    </option>
                  ))}
                  {students.length === 0 && <option value="" disabled>No students found</option>}
                </select>
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Installment Number *</label>
                <input type="number" name="installment_no" value={formData.installment_no} onChange={handleChange} min="1" placeholder="e.g., 1, 2, 3" required />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Fee Receipt File (PDF/Image) *</label>
                <input type="file" onChange={(e) => setFeeFile(e.target.files[0])} style={{ background: 'var(--surface)', padding: '10px' }} required />
              </div>

            </form>
          </div>
        </div>

        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" form="fee-form" className="btn-primary">Upload Receipt</button>
        </div>
      </motion.div>
    </div>
  );
};

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(false);

  const fetchData = async () => {
    try {
      const [resFees, resStudents] = await Promise.all([
        fetch(`${API_BASE_URL}/api/fees/get-all`),
        fetch(`${API_BASE_URL}/api/students/get-all`)
      ]);
      if (resFees.ok && resStudents.ok) {
        setFees(await resFees.json());
        setStudents(await resStudents.json());
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

  const handleSave = async (data, feeFile) => {
    try {
      const formData = new FormData();
      formData.append('student_id', data.student_id);
      formData.append('installment_no', data.installment_no);
      formData.append('file', feeFile);

      const response = await fetch(`${API_BASE_URL}/api/fees/create`, {
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
      console.error('Error uploading fee:', err);
      alert('Failed to save fee. Check console.');
    }
  };

  const handleDelete = async (fee) => {
    if (window.confirm(`Are you sure you want to delete Installment ${fee.installment_no} for ${fee.student_name}?`)) {
      try {
        await fetch(`${API_BASE_URL}/api/fees/delete-by/${fee.fee_id}`, { method: 'DELETE' });
        fetchData();
      } catch (err) {
        console.error('Error deleting fee:', err);
      }
    }
  };

  // Map student names to fees for display
  const displayFees = fees.map(fee => {
    const student = students.find(s => s.student_id === fee.student_id);
    return {
      ...fee,
      student_name: student ? student.full_name : 'Unknown Student',
      student_email: student ? student.email : 'N/A',
      student_photo: student ? student.profile_photo : null
    };
  });

  const columns = [
    { 
      header: 'Student', 
      accessor: 'student_name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {row.student_photo ? (
            <img 
              src={`${API_BASE_URL}/${row.student_photo.replace(/\\\\/g, '/')}`} 
              alt={row.student_name} 
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
            />
          ) : (
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-button)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--deep-navy)', fontWeight: 'bold', fontSize: '14px' }}>
              {row.student_name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontWeight: '500' }}>{row.student_name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.student_id}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Installment No', 
      accessor: 'installment_no',
      render: (row) => <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>Inst #{row.installment_no}</span>
    },
    { 
      header: 'Upload Date', 
      accessor: 'created_at',
      render: (row) => new Date(row.created_at).toLocaleDateString()
    },
    {
      header: 'Receipt',
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

  if (loading) return <p>Loading fees...</p>;

  return (
    <div style={{ animation: 'slideUp 0.5s ease' }}>
      <DataTable 
        title="Fees Management" 
        columns={columns} 
        data={displayFees} 
        onAdd={() => setModalMode(true)}
        onDelete={handleDelete}
      />
      <AnimatePresence>
        {modalMode && (
          <FeeModal 
            students={students}
            onClose={() => setModalMode(false)} 
            onSave={handleSave} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Fees;
