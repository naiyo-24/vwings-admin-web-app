import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from '../components/DataTable';

const API_BASE_URL = 'http://localhost:8000';

const StudentModal = ({ student, courses, onClose, onSave }) => {
  const toast = useToast();
  const [formData, setFormData] = useState(student || {
    full_name: '',
    email: '',
    phone_no: '',
    address: '',
    guardian_name: '',
    guardian_mobile_no: '',
    course_availing: courses.length > 0 ? courses[0].course_id : '',
    password: '',
    payment_mode: 'online',
    payment_plan: 'full',
    amount_paid: '',
    cheque_no: '',
    dd_no: ''
  });
  const [photoFile, setPhotoFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, photoFile);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: 'var(--background)', overflow: 'hidden' }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{student ? 'Edit Student' : 'Add Student'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
          <div style={{ padding: '32px' }}>
            <form id="student-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="input-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                <label>Full Name *</label>
                <input name="full_name" value={formData.full_name || ''} onChange={handleChange} required />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Email *</label>
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Phone No *</label>
                <input name="phone_no" value={formData.phone_no || ''} onChange={handleChange} required />
              </div>
              <div className="input-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                <label>Address *</label>
                <input name="address" value={formData.address || ''} onChange={handleChange} required />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Guardian Name *</label>
                <input name="guardian_name" value={formData.guardian_name || ''} onChange={handleChange} required />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Guardian Phone *</label>
                <input name="guardian_mobile_no" value={formData.guardian_mobile_no || ''} onChange={handleChange} required />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Select Course *</label>
                <select name="course_availing" value={formData.course_availing} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit' }} required>
                  {courses.map(c => (
                    <option key={c.course_id} value={c.course_id} style={{ background: 'var(--background)' }}>{c.course_name}</option>
                  ))}
                </select>
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Password {!student && '*'}</label>
                <input type="password" name="password" value={formData.password || ''} onChange={handleChange} placeholder={student ? "Leave blank to keep unchanged" : ""} required={!student} />
              </div>

              {/* Onboarding Payment Section - Only show during creation */}
              {!student && (
                <>
                  <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '8px' }}>
                    <h4 style={{ margin: '0 0 16px 0', color: 'var(--primary-yellow)' }}>Initial Onboarding Fee</h4>
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Payment Mode</label>
                    <select name="payment_mode" value={formData.payment_mode} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit' }}>
                      <option value="online">Online (Student will pay later)</option>
                      <option value="cash">Cash (Collect now)</option>
                      <option value="cheque">Cheque (Collect now)</option>
                      <option value="demand_draft">Demand Draft (Collect now)</option>
                    </select>
                  </div>

                  {['cash', 'cheque', 'demand_draft'].includes(formData.payment_mode) && (
                    <>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label>Payment Plan</label>
                        <select name="payment_plan" value={formData.payment_plan} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit' }}>
                          <option value="full">Full Payment</option>
                          <option value="installment">Installment Plan</option>
                        </select>
                      </div>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label>Amount Collected (₹) *</label>
                        <input type="number" name="amount_paid" value={formData.amount_paid} onChange={handleChange} required placeholder="e.g. 50000" />
                      </div>
                    </>
                  )}

                  {formData.payment_mode === 'cheque' && (
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label>Cheque Number *</label>
                      <input type="text" name="cheque_no" value={formData.cheque_no || ''} onChange={handleChange} placeholder="Enter Cheque No" required />
                    </div>
                  )}

                  {formData.payment_mode === 'demand_draft' && (
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label>DD Number *</label>
                      <input type="text" name="dd_no" value={formData.dd_no || ''} onChange={handleChange} placeholder="Enter DD No" required />
                    </div>
                  )}
                </>
              )}

              <div className="input-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                <label>Profile Photo</label>
                <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} style={{ background: 'var(--surface)', padding: '10px' }} />
                {student?.profile_photo && !photoFile && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current photo exists. Uploading new will replace it.</span>}
              </div>
            </form>
          </div>
        </div>

        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" form="student-form" className="btn-primary">Save Student</button>
        </div>
      </motion.div>
    </div>
  );
};

const Students = () => {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchData = async () => {
    try {
      const [resStudents, resCourses] = await Promise.all([
        fetch(`${API_BASE_URL}/api/students/get-all`),
        fetch(`${API_BASE_URL}/api/courses/get-all`)
      ]);
      if (resStudents.ok && resCourses.ok) {
        setStudents(await resStudents.json());
        setCourses(await resCourses.json());
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
      // Fetch all if empty
      try {
        const res = await fetch(`${API_BASE_URL}/api/students/get-all`);
        if (res.ok) setStudents(await res.json());
      } catch (err) { console.error(err); }
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/search/table/students?q=${encodeURIComponent(term)}`);
      if (res.ok) setStudents(await res.json());
    } catch (err) {
      console.error('Error searching students:', err);
    }
  };

  const handleSave = async (data, photoFile) => {
    try {
      const formData = new FormData();
      // Add all standard fields
      ['full_name', 'email', 'phone_no', 'address', 'guardian_name', 'guardian_mobile_no', 'course_availing'].forEach(key => {
        if (data[key]) formData.append(key, data[key]);
      });

      if (data.password) formData.append('password', data.password);
      if (photoFile) formData.append('profile_photo', photoFile);

      if (modalMode === 'create') {
        formData.append('payment_mode', data.payment_mode || 'online');
        formData.append('payment_plan', data.payment_plan || 'full');
        if (['cash', 'cheque', 'demand_draft'].includes(data.payment_mode) && data.amount_paid) {
          formData.append('amount_paid', parseFloat(data.amount_paid));
          if (data.payment_mode === 'cheque' && data.cheque_no) formData.append('cheque_no', data.cheque_no);
          if (data.payment_mode === 'demand_draft' && data.dd_no) formData.append('dd_no', data.dd_no);
        }
        await fetch(`${API_BASE_URL}/api/students/create`, {
          method: 'POST',
          body: formData
        });
      } else if (modalMode === 'edit') {
        await fetch(`${API_BASE_URL}/api/students/put-by/${selectedStudent.student_id}`, {
          method: 'PUT',
          body: formData
        });
      }
      setModalMode(null);
      setSelectedStudent(null);
      fetchData();
    } catch (err) {
      console.error('Error saving student:', err);
      toast.error('Failed to save student. Check console.');
    }
  };

  const handleDelete = async (student) => {
    if (await toast.confirm(`Are you sure you want to delete ${student.full_name}?`)) {
      try {
        await fetch(`${API_BASE_URL}/api/students/delete-by/${student.student_id}`, { method: 'DELETE' });
        fetchData();
      } catch (err) {
        console.error('Error deleting student:', err);
      }
    }
  };

  const columns = [
    { header: 'Student ID', accessor: 'student_id' },
    {
      header: 'Student Profile',
      accessor: 'full_name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {row.profile_photo ? (
            <img
              src={`${API_BASE_URL}/${row.profile_photo.replace(/\\\\/g, '/')}`}
              alt={row.full_name}
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-button)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--deep-navy)', fontWeight: 'bold', fontSize: '14px' }}>
              {row.full_name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontWeight: '500' }}>{row.full_name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.email}</div>
          </div>
        </div>
      )
    },
    { header: 'Course', accessor: 'course_name', render: (row) => row.course_name || 'N/A' },
    { header: 'Phone', accessor: 'phone_no' },
    {
      header: 'Joined Date',
      accessor: 'created_at',
      render: (row) => new Date(row.created_at).toLocaleDateString()
    },
  ];

  if (loading) return <p>Loading students...</p>;

  return (
    <div style={{ animation: 'slideUp 0.5s ease' }}>
      <DataTable
        title="Students Management"
        columns={columns}
        data={students}
        onEdit={(student) => { setSelectedStudent(student); setModalMode('edit'); }}
        onDelete={handleDelete}
        onSearch={handleSearch}
      />
      <AnimatePresence>
        {modalMode && (
          <StudentModal
            student={selectedStudent}
            courses={courses}
            onClose={() => setModalMode(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Students;

