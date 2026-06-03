import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from '../components/DataTable';

const API_BASE_URL = 'https://appbackend.vwings247.me';

const TeacherModal = ({ teacher, courses, onClose, onSave }) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    full_name: teacher?.full_name || '',
    email: teacher?.email || '',
    phone_no: teacher?.phone_no || '',
    alternative_phone_no: teacher?.alternative_phone_no || '',
    address: teacher?.address || '',
    qualification: teacher?.qualification || '',
    experience: teacher?.experience || '',
    courses_assigned: teacher?.courses_assigned ? teacher.courses_assigned.map(c => c.course_id) : [],
    bank_account_no: teacher?.bank_account_no || '',
    bank_account_name: teacher?.bank_account_name || '',
    bank_branch_name: teacher?.bank_branch_name || '',
    ifsc_code: teacher?.ifsc_code || '',
    upiid: teacher?.upiid || '',
    monthly_salary: teacher?.monthly_salary || '',
    password: ''
  });
  const [photoFile, setPhotoFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCourseToggle = (courseId) => {
    const isSelected = formData.courses_assigned.includes(courseId);
    if (isSelected) {
      setFormData({ ...formData, courses_assigned: formData.courses_assigned.filter(id => id !== courseId) });
    } else {
      setFormData({ ...formData, courses_assigned: [...formData.courses_assigned, courseId] });
    }
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
          <h3 style={{ margin: 0 }}>{teacher ? 'Edit Teacher' : 'Add Teacher'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
          <button type="button" onClick={() => setActiveTab('personal')} style={{ padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'personal' ? '2px solid var(--primary-yellow)' : '2px solid transparent', color: activeTab === 'personal' ? 'var(--primary-yellow)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '500' }}>Personal</button>
          <button type="button" onClick={() => setActiveTab('professional')} style={{ padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'professional' ? '2px solid var(--primary-yellow)' : '2px solid transparent', color: activeTab === 'professional' ? 'var(--primary-yellow)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '500' }}>Professional</button>
          <button type="button" onClick={() => setActiveTab('banking')} style={{ padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'banking' ? '2px solid var(--primary-yellow)' : '2px solid transparent', color: activeTab === 'banking' ? 'var(--primary-yellow)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '500' }}>Banking & Salary</button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
          <div style={{ padding: '32px' }}>
            <form id="teacher-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {activeTab === 'personal' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Full Name *</label>
                    <input name="full_name" value={formData.full_name} onChange={handleChange} required />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Phone No *</label>
                    <input name="phone_no" value={formData.phone_no} onChange={handleChange} required />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Alternative Phone</label>
                    <input name="alternative_phone_no" value={formData.alternative_phone_no} onChange={handleChange} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                    <label>Address</label>
                    <input name="address" value={formData.address} onChange={handleChange} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Password {!teacher && '*'}</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={teacher ? "Leave blank to keep unchanged" : ""} required={!teacher} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Profile Photo</label>
                    <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} style={{ background: 'var(--surface)', padding: '10px' }} />
                    {teacher?.profile_photo && !photoFile && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current photo exists. Uploading new will replace it.</span>}
                  </div>
                </div>
              )}

              {activeTab === 'professional' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Qualification</label>
                    <input name="qualification" value={formData.qualification} onChange={handleChange} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Experience</label>
                    <input name="experience" value={formData.experience} onChange={handleChange} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                    <label>Assign Courses</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      {courses.map(course => (
                        <label key={course.course_id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                          <input
                            type="checkbox"
                            checked={formData.courses_assigned.includes(course.course_id)}
                            onChange={() => handleCourseToggle(course.course_id)}
                          />
                          {course.course_name}
                        </label>
                      ))}
                      {courses.length === 0 && <span style={{ color: 'var(--text-muted)' }}>No courses available.</span>}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'banking' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Bank Account Name</label>
                    <input name="bank_account_name" value={formData.bank_account_name} onChange={handleChange} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Bank Account Number</label>
                    <input name="bank_account_no" value={formData.bank_account_no} onChange={handleChange} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Bank Branch Name</label>
                    <input name="bank_branch_name" value={formData.bank_branch_name} onChange={handleChange} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>IFSC Code</label>
                    <input name="ifsc_code" value={formData.ifsc_code} onChange={handleChange} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>UPI ID</label>
                    <input name="upiid" value={formData.upiid} onChange={handleChange} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Monthly Salary (₹)</label>
                    <input type="number" name="monthly_salary" value={formData.monthly_salary} onChange={handleChange} />
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" form="teacher-form" className="btn-primary">Save Teacher</button>
        </div>
      </motion.div>
    </div>
  );
};

const Teachers = () => {
  const toast = useToast();
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const fetchData = async () => {
    try {
      const [resTeachers, resCourses] = await Promise.all([
        fetch(`${API_BASE_URL}/api/teachers/get-all`),
        fetch(`${API_BASE_URL}/api/courses/get-all`)
      ]);
      if (resTeachers.ok && resCourses.ok) {
        setTeachers(await resTeachers.json());
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
      try {
        const res = await fetch(`${API_BASE_URL}/api/teachers/get-all`);
        if (res.ok) setTeachers(await res.json());
      } catch (err) { console.error(err); }
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/search/table/teachers?q=${encodeURIComponent(term)}`);
      if (res.ok) setTeachers(await res.json());
    } catch (err) {
      console.error('Error searching teachers:', err);
    }
  };

  const handleSave = async (data, photoFile) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'courses_assigned') {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== '') {
          formData.append(key, value);
        }
      });

      if (photoFile) {
        formData.append('profile_photo', photoFile);
      }

      if (modalMode === 'create') {
        await fetch(`${API_BASE_URL}/api/teachers/create`, {
          method: 'POST',
          body: formData
        });
      } else if (modalMode === 'edit') {
        await fetch(`${API_BASE_URL}/api/teachers/put-by/${selectedTeacher.teacher_id}`, {
          method: 'PUT',
          body: formData
        });
      }
      setModalMode(null);
      setSelectedTeacher(null);
      fetchData();
    } catch (err) {
      console.error('Error saving teacher:', err);
      toast.error('Failed to save teacher. Check console.');
    }
  };

  const handleDelete = async (teacher) => {
    if (await toast.confirm(`Are you sure you want to delete ${teacher.full_name}?`)) {
      try {
        await fetch(`${API_BASE_URL}/api/teachers/delete-by/${teacher.teacher_id}`, { method: 'DELETE' });
        fetchData();
      } catch (err) {
        console.error('Error deleting teacher:', err);
      }
    }
  };

  const columns = [
    { header: 'Teacher ID', accessor: 'teacher_id' },
    {
      header: 'Teacher Profile',
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
    {
      header: 'Assigned Courses',
      accessor: 'courses_assigned',
      render: (row) => (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {row.courses_assigned && row.courses_assigned.length > 0 ? (
            row.courses_assigned.map((cls, idx) => (
              <span key={idx} style={{ background: 'var(--surface-hover)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                {cls.course_name}
              </span>
            ))
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>None</span>
          )}
        </div>
      )
    },
    { header: 'Experience', accessor: 'experience', render: (row) => row.experience || 'N/A' },
    { header: 'Salary', accessor: 'monthly_salary', render: (row) => row.monthly_salary ? `₹${row.monthly_salary}` : 'N/A' },
  ];

  if (loading) return <p>Loading teachers...</p>;

  return (
    <div style={{ animation: 'slideUp 0.5s ease' }}>
      <DataTable
        title="Teachers Management"
        columns={columns}
        data={teachers}
        onEdit={(teacher) => { setSelectedTeacher(teacher); setModalMode('edit'); }}
        onDelete={handleDelete}
        onSearch={handleSearch}
      />
      <AnimatePresence>
        {modalMode && (
          <TeacherModal
            teacher={selectedTeacher}
            courses={courses}
            onClose={() => setModalMode(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Teachers;

