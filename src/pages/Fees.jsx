import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { X, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from '../components/DataTable';

const API_BASE_URL = 'https://appbackend.vwings247.me';

const FeeModal = ({ students, onClose, onSave }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    student_id: students.length > 0 ? students[0].student_id : '',
    payment_type: 'full',
    installment_no: '',
    amount: '',
    payment_mode: 'cash',
    cheque_no: '',
    dd_no: ''
  });
  const [feeFile, setFeeFile] = useState(null);

  const [pendingFee, setPendingFee] = useState(0);

  useEffect(() => {
    if (formData.student_id) {
      fetch(`${API_BASE_URL}/api/fees/profile/${formData.student_id}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch profile');
          return res.json();
        })
        .then(data => {
          const totalPaid = data.total_paid || 0;
          const totalFee = data.total_fee || 0;
          const pending = Math.max(0, totalFee - totalPaid);
          setPendingFee(pending);

          const paidInstallments = data.paid_installments || [];
          const allInstallments = [1, 2, 3, 4];
          const available = allInstallments.filter(i => !paidInstallments.includes(i));

          if (paidInstallments.length === 0) {
            setFormData(prev => ({ ...prev, payment_type: 'full', amount: pending }));
          } else if (available.length > 0) {
            setFormData(prev => ({ ...prev, payment_type: 'installment', installment_no: available[0], amount: '' }));
          } else {
            setFormData(prev => ({ ...prev, payment_type: 'full', amount: pending }));
          }
        })
        .catch(err => {
          console.error(err);
          setPendingFee(0);
        });
    }
  }, [formData.student_id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.payment_mode === 'online' && !feeFile) {
      toast.error("Please upload the fee receipt file for online payment.");
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
          <h3 style={{ margin: 0 }}>Record Fee Payment</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><X size={20} /></button>
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
                <label>Payment Mode *</label>
                <select name="payment_mode" value={formData.payment_mode} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit' }} required>
                  <option value="cash">Cash Payment</option>
                  <option value="cheque">Cheque</option>
                  <option value="demand_draft">Demand Draft</option>
                  <option value="online">Online Receipt Upload</option>
                </select>
              </div>

              {formData.payment_mode === 'cheque' && (
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Cheque Number *</label>
                  <input type="text" name="cheque_no" value={formData.cheque_no} onChange={handleChange} placeholder="e.g. 123456" required />
                </div>
              )}

              {formData.payment_mode === 'demand_draft' && (
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>DD Number *</label>
                  <input type="text" name="dd_no" value={formData.dd_no} onChange={handleChange} placeholder="e.g. 123456" required />
                </div>
              )}

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Payment Type *</label>
                <select name="payment_type" value={formData.payment_type} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit' }} required>
                  <option value="full">Full Payment</option>
                  <option value="installment">Installment</option>
                </select>
              </div>

              {formData.payment_type === 'installment' && (
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Installment Number *</label>
                  <input type="number" name="installment_no" value={formData.installment_no} onChange={handleChange} min="1" max="4" placeholder="e.g., 1, 2, 3, 4" required />
                </div>
              )}

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Amount (₹) *</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} min="0" placeholder="e.g. 50000" required />
                {pendingFee > 0 && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary-yellow)', marginTop: '6px' }}>
                    Remaining Balance: ₹{pendingFee}
                  </div>
                )}
              </div>

              {formData.payment_mode === 'online' && (
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Fee Receipt File (PDF/Image) *</label>
                  <input type="file" onChange={(e) => setFeeFile(e.target.files[0])} style={{ background: 'var(--surface)', padding: '10px' }} required />
                </div>
              )}

            </form>
          </div>
        </div>

        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" form="fee-form" className="btn-primary">Record Payment</button>
        </div>
      </motion.div>
    </div>
  );
};

const ProfileModal = ({ students, onClose, onSave }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    student_id: students.length > 0 ? students[0].student_id : '',
    total_fee: '',
    payment_plan: 'full'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card" style={{ width: '100%', maxWidth: '500px', background: 'var(--background)', overflow: 'hidden' }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Set Fee Profile</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '32px' }}>
          <form id="profile-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Select Student *</label>
              <select name="student_id" value={formData.student_id} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit' }} required>
                {students.map(s => (
                  <option key={s.student_id} value={s.student_id} style={{ background: 'var(--background)' }}>
                    {s.full_name} ({s.student_id})
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Total Fee (₹) *</label>
              <input type="number" name="total_fee" value={formData.total_fee} onChange={handleChange} min="0" placeholder="e.g., 150000" required />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Payment Plan *</label>
              <select name="payment_plan" value={formData.payment_plan} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit' }} required>
                <option value="full">Full Payment</option>
                <option value="installment">Installments</option>
              </select>
            </div>
          </form>
        </div>

        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" form="profile-form" className="btn-primary">Save Profile</button>
        </div>
      </motion.div>
    </div>
  );
};

const EditFeeModal = ({ fee, onClose, onSave }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    amount: fee.amount || 0,
    payment_type: fee.payment_type || 'full',
    installment_no: fee.installment_no || '',
    payment_status: fee.payment_status || 'pending'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(fee.fee_id, formData);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card" style={{ width: '100%', maxWidth: '500px', background: 'var(--background)', overflow: 'hidden' }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Edit Fee Record</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '32px' }}>
          <form id="edit-fee-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Amount (₹) *</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} min="0" required />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Payment Type *</label>
              <select name="payment_type" value={formData.payment_type} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)' }} required>
                <option value="full">Full Payment</option>
                <option value="installment">Installment</option>
              </select>
            </div>

            {formData.payment_type === 'installment' && (
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Installment Number *</label>
                <input type="number" name="installment_no" value={formData.installment_no} onChange={handleChange} min="1" max="4" required />
              </div>
            )}

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Status *</label>
              <select name="payment_status" value={formData.payment_status} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)' }} required>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

          </form>
        </div>

        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" form="edit-fee-form" className="btn-primary">Save Changes</button>
        </div>
      </motion.div>
    </div>
  );
};

const Fees = () => {
  const toast = useToast();
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(false);
  const [profileModalMode, setProfileModalMode] = useState(false);
  const [editingFee, setEditingFee] = useState(null);

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
      if (['cash', 'cheque', 'demand_draft'].includes(data.payment_mode)) {
        const cashRes = await fetch(`${API_BASE_URL}/api/fees/add-cash-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: data.student_id,
            payment_type: data.payment_type,
            installment_no: data.payment_type === 'installment' ? parseInt(data.installment_no) : null,
            amount: parseFloat(data.amount),
            payment_mode: data.payment_mode,
            cheque_no: data.payment_mode === 'cheque' ? data.cheque_no : null,
            dd_no: data.payment_mode === 'demand_draft' ? data.dd_no : null
          })
        });

        if (cashRes.ok) {
          setModalMode(false);
          fetchData();
        } else {
          const errData = await cashRes.json();
          toast.error(`Failed to record cash payment: ${errData.detail}`);
        }
        return;
      }

      // Online receipt upload path
      const orderRes = await fetch(`${API_BASE_URL}/api/fees/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          student_id: data.student_id,
          payment_type: data.payment_type,
          installment_no: data.payment_type === 'installment' ? parseInt(data.installment_no) : null,
          amount: parseFloat(data.amount)
        })
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json();
        toast.error(`Failed to create fee record: ${errData.detail}`);
        return;
      }
      const orderData = await orderRes.json();

      // Now upload receipt
      const formData = new FormData();
      formData.append('fee_id', orderData.fee_id);
      formData.append('file', feeFile);

      const uploadRes = await fetch(`${API_BASE_URL}/api/fees/upload-receipt`, {
        method: 'POST',
        body: formData
      });

      if (uploadRes.ok) {
        setModalMode(false);
        fetchData();
      } else {
        const errData = await uploadRes.json();
        toast.error(`Failed to upload: ${errData.detail}`);
      }
    } catch (err) {
      console.error('Error uploading fee:', err);
      toast.error('Failed to save fee. Check console.');
    }
  };

  const handleSaveProfile = async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/fees/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: data.student_id,
          total_fee: parseFloat(data.total_fee),
          payment_plan: data.payment_plan
        })
      });

      if (response.ok) {
        setProfileModalMode(false);
        toast.error('Fee Profile Updated!');
      } else {
        const errData = await response.json();
        toast.error(`Failed to save profile: ${errData.detail}`);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      toast.error('Failed to save profile. Check console.');
    }
  };

  const handleUpdateFee = async (fee_id, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/fees/update-by/${fee_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          payment_status: formData.payment_status,
          payment_type: formData.payment_type,
          installment_no: formData.payment_type === 'installment' ? parseInt(formData.installment_no) : null
        })
      });

      if (response.ok) {
        setEditingFee(null);
        fetchData();
      } else {
        const errData = await response.json();
        toast.error(`Failed to update fee: ${errData.detail}`);
      }
    } catch (err) {
      console.error('Error updating fee:', err);
      toast.error('Failed to update fee. Check console.');
    }
  };

  const handleDelete = async (fee) => {
    if (await toast.confirm(`Are you sure you want to delete this fee record for ${fee.student_name}?`)) {
      try {
        await fetch(`${API_BASE_URL}/api/fees/delete-by/${fee.fee_id}`, { method: 'DELETE' });
        fetchData();
      } catch (err) {
        console.error('Error deleting fee:', err);
      }
    }
  };

  const handleEdit = (fee) => {
    setEditingFee(fee);
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
      header: 'Payment Type',
      accessor: 'payment_type',
      render: (row) => (
        <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', textTransform: 'capitalize', fontWeight: '500', color: row.payment_type === 'full' ? '#10b981' : '#3b82f6' }}>
          {row.payment_type === 'full' ? 'Full Payment' : `Inst #${row.installment_no}`}
        </span>
      )
    },
    {
      header: 'Mode',
      accessor: 'payment_mode',
      render: (row) => {
        let bgColor = 'rgba(16, 185, 129, 0.1)';
        let textColor = '#10b981';
        if (row.payment_mode === 'cash') { bgColor = 'rgba(245, 158, 11, 0.1)'; textColor = '#f59e0b'; }
        else if (row.payment_mode === 'cheque') { bgColor = 'rgba(59, 130, 246, 0.1)'; textColor = '#3b82f6'; }
        else if (row.payment_mode === 'demand_draft') { bgColor = 'rgba(139, 92, 246, 0.1)'; textColor = '#8b5cf6'; }
        return (
          <span style={{
            padding: '4px 8px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            background: bgColor,
            color: textColor,
            textTransform: 'capitalize'
          }}>
            {row.payment_mode ? row.payment_mode.replace('_', ' ') : 'Online'}
          </span>
        )
      }
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => (
        <span style={{ fontWeight: '500', color: 'var(--primary-yellow)' }}>
          ₹{row.amount || 0}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'payment_status',
      render: (row) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '8px',
          fontSize: '0.8rem',
          background: row.payment_status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          color: row.payment_status === 'completed' ? '#10b981' : '#f59e0b'
        }}>
          {row.payment_status || 'Pending'}
        </span>
      )
    },
    {
      header: 'Transaction ID',
      accessor: 'razorpay_payment_id',
      render: (row) => (
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {row.razorpay_payment_id || 'N/A'}
        </span>
      )
    },
    {
      header: 'Upload Date',
      accessor: 'created_at',
      render: (row) => new Date(row.created_at).toLocaleDateString()
    },
    {
      header: 'Receipt',
      accessor: 'file_path',
      render: (row) => row.file_path ? (
        <a
          href={`${API_BASE_URL}/${row.file_path.replace(/\\\\/g, '/')}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary-yellow)', textDecoration: 'none', background: 'rgba(245, 195, 0, 0.1)', padding: '6px 12px', borderRadius: '8px' }}
        >
          <FileText size={16} /> View
        </a>
      ) : (
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Online</span>
      )
    }
  ];

  if (loading) return <p>Loading fees...</p>;

  return (
    <div style={{ animation: 'slideUp 0.5s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Fees Management</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn-secondary" onClick={() => setProfileModalMode(true)}>
            Set Fee Profile
          </button>
          <button className="btn-primary" onClick={() => setModalMode(true)}>
            Record Payment
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={displayFees}
        onEdit={handleEdit}
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
        {profileModalMode && (
          <ProfileModal
            students={students}
            onClose={() => setProfileModalMode(false)}
            onSave={handleSaveProfile}
          />
        )}
        {editingFee && (
          <EditFeeModal
            fee={editingFee}
            onClose={() => setEditingFee(null)}
            onSave={handleUpdateFee}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Fees;

