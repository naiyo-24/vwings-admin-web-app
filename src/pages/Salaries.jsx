import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
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

const SalaryModal = ({ teachers, onClose, onSave }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    teacher_id: teachers.length > 0 ? teachers[0].teacher_id : '',
    month: new Date().getMonth() + 1,
    year: currentYear,
    fixed_salary: teachers.length > 0 ? (teachers[0].monthly_salary || 0) : 0,
    commission_per_student: 0,
    referrals_admitted: 0,
    transaction_id: ''
  });

  useEffect(() => {
    const selectedTeacher = teachers.find(t => t.teacher_id === formData.teacher_id);
    if (selectedTeacher) {
      setFormData(prev => ({ ...prev, fixed_salary: selectedTeacher.monthly_salary || 0 }));
    }
  }, [formData.teacher_id, teachers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'teacher_id' || name === 'transaction_id' ? value : Number(value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.transaction_id) {
      toast.error("Please enter Transaction ID.");
      return;
    }
    onSave(formData);
  };

  const totalSalary = formData.fixed_salary + (formData.commission_per_student * formData.referrals_admitted);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: 'var(--background)', overflow: 'hidden' }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Upload Salary Slip</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
          <div style={{ padding: '32px' }}>
            <form id="salary-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Select Teacher *</label>
                <select name="teacher_id" value={formData.teacher_id} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit' }} required>
                  {teachers.map(t => (
                    <option key={t.teacher_id} value={t.teacher_id} style={{ background: 'var(--background)' }}>
                      {t.full_name} ({t.teacher_id})
                    </option>
                  ))}
                  {teachers.length === 0 && <option value="" disabled>No teachers found</option>}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Fixed Salary (Rs.) *</label>
                  <input type="number" name="fixed_salary" value={formData.fixed_salary} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)' }} required min="0" />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Commission per Admitted Student (Rs.) *</label>
                  <input type="number" name="commission_per_student" value={formData.commission_per_student} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)' }} required min="0" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>No. of Admitted Referrals *</label>
                  <input type="number" name="referrals_admitted" value={formData.referrals_admitted} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)' }} required min="0" />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>NEFT Transaction ID *</label>
                  <input type="text" name="transaction_id" value={formData.transaction_id} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)' }} required />
                </div>
              </div>

              <div style={{ padding: '16px', background: 'var(--surface-hover)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Total Commission:</span>
                  <span>Rs. {(formData.commission_per_student * formData.referrals_admitted).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', color: 'var(--primary)' }}>
                  <span>Total Salary:</span>
                  <span>Rs. {totalSalary.toFixed(2)}</span>
                </div>
              </div>

            </form>
          </div>
        </div>

        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" form="salary-form" className="btn-primary">Calculate & Pay</button>
        </div>
      </motion.div>
    </div>
  );
};

const Salaries = () => {
  const toast = useToast();
  const [salaries, setSalaries] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(false);

  const fetchData = async () => {
    try {
      const [resSalaries, resTeachers] = await Promise.all([
        fetch(`${API_BASE_URL}/api/salaries/get-all`),
        fetch(`${API_BASE_URL}/api/teachers/get-all`)
      ]);
      if (resSalaries.ok && resTeachers.ok) {
        setSalaries(await resSalaries.json());
        setTeachers(await resTeachers.json());
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

  const handleSearch = async (term) => {
    if (!term) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/salaries/get-all`);
        if (res.ok) setSalaries(await res.json());
      } catch (err) { console.error(err); }
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/search/table/salaries?q=${encodeURIComponent(term)}`);
      if (res.ok) setSalaries(await res.json());
    } catch (err) {
      console.error('Error searching salaries:', err);
    }
  };

  const handleSave = async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/salaries/calculate-and-pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setModalMode(false);
        fetchData();
      } else {
        const errData = await response.json();
        toast.error(`Failed to process: ${errData.detail}`);
      }
    } catch (err) {
      console.error('Error processing salary:', err);
      toast.error('Failed to save salary. Check console.');
    }
  };

  const handleDelete = async (salary) => {
    if (await toast.confirm(`Are you sure you want to delete the salary slip for ${salary.teacher_name} (${salary.month}/${salary.year})?`)) {
      try {
        await fetch(`${API_BASE_URL}/api/salaries/delete-by/${salary.salary_id}`, { method: 'DELETE' });
        fetchData();
      } catch (err) {
        console.error('Error deleting salary:', err);
      }
    }
  };

  const getMonthName = (monthNum) => {
    const month = months.find(m => m.value === parseInt(monthNum));
    return month ? month.label : monthNum;
  };

  // Map teacher names to salaries for display
  const displaySalaries = salaries.map(salary => {
    const teacher = teachers.find(t => t.teacher_id === salary.teacher_id);
    return {
      ...salary,
      teacher_name: teacher ? teacher.full_name : 'Unknown Teacher',
      teacher_email: teacher ? teacher.email : 'N/A',
      teacher_photo: teacher ? teacher.profile_photo : null
    };
  });

  const columns = [
    {
      header: 'Teacher',
      accessor: 'teacher_name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {row.teacher_photo ? (
            <img
              src={`${API_BASE_URL}/${row.teacher_photo.replace(/\\\\/g, '/')}`}
              alt={row.teacher_name}
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-button)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--deep-navy)', fontWeight: 'bold', fontSize: '14px' }}>
              {row.teacher_name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontWeight: '500' }}>{row.teacher_name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.teacher_id}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Period',
      accessor: 'month',
      render: (row) => <span style={{ padding: '4px 12px', background: 'var(--surface-hover)', borderRadius: '12px' }}>{getMonthName(row.month)} {row.year}</span>
    },
    {
      header: 'Referrals (Admitted)',
      accessor: 'referrals_admitted',
      render: (row) => row.referrals_admitted || 0
    },
    {
      header: 'Total Salary',
      accessor: 'total_salary',
      render: (row) => <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Rs. {(row.total_salary || 0).toFixed(2)}</span>
    },
    {
      header: 'Txn ID',
      accessor: 'transaction_id',
      render: (row) => row.transaction_id || 'N/A'
    },
    {
      header: 'Upload Date',
      accessor: 'created_at',
      render: (row) => new Date(row.created_at).toLocaleDateString()
    },
    {
      header: 'Salary Slip',
      accessor: 'file_path',
      render: (row) => (
        <a
          href={`${API_BASE_URL}/${row.file_path ? row.file_path.replace(/\\\\/g, '/') : ''}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', textDecoration: 'none', background: 'rgba(123, 7, 113, 0.1)', padding: '6px 12px', borderRadius: '8px', fontWeight: '500' }}
        >
          <FileText size={16} /> View
        </a>
      )
    }
  ];

  if (loading) return <p>Loading salaries...</p>;

  return (
    <div style={{ animation: 'slideUp 0.5s ease' }}>
      <DataTable
        title="Salaries Management"
        columns={columns}
        data={displaySalaries}
        onAdd={() => setModalMode(true)}
        onDelete={handleDelete}
        onSearch={handleSearch}
      />
      <AnimatePresence>
        {modalMode && (
          <SalaryModal
            teachers={teachers}
            onClose={() => setModalMode(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Salaries;

