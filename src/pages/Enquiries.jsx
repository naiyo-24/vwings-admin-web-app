import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { X, UserPlus, Phone, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from '../components/DataTable';

const API_BASE_URL = 'https://appbackend.vwings247.me';

const EnquiryModal = ({ enquiry, courses, counsellors, onClose, onSave }) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState(enquiry || {
    student_name: '',
    student_phn_no: '',
    student_alternative_phn_no: '',
    student_email: '',
    student_address: '',
    guardian_name: '',
    guardian_phn_no: '',
    course_id: courses.length > 0 ? courses[0].course_id : '',
    course_category: 'general',
    counsellor_id: counsellors.length > 0 ? counsellors[0].counsellor_id : '',
    admission_code: '',
    fit_medically: false,
    meets_height_requirements: false,
    meets_weight_requirements: false,
    meets_vision_standards: false,
    status: 'pending'
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
        className="glass-card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: 'var(--background)', overflow: 'hidden' }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{enquiry ? 'Edit Admission Enquiry' : 'New Admission Enquiry'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
          <button type="button" onClick={() => setActiveTab('personal')} style={{ padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'personal' ? '2px solid var(--primary-yellow)' : '2px solid transparent', color: activeTab === 'personal' ? 'var(--primary-yellow)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '500' }}>Personal Details</button>
          <button type="button" onClick={() => setActiveTab('course')} style={{ padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'course' ? '2px solid var(--primary-yellow)' : '2px solid transparent', color: activeTab === 'course' ? 'var(--primary-yellow)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '500' }}>Course & Counsellor</button>
          <button type="button" onClick={() => setActiveTab('medical')} style={{ padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'medical' ? '2px solid var(--primary-yellow)' : '2px solid transparent', color: activeTab === 'medical' ? 'var(--primary-yellow)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '500' }}>Medical</button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
          <div style={{ padding: '32px' }}>
            <form id="enquiry-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {activeTab === 'personal' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Student Name *</label>
                    <input name="student_name" value={formData.student_name} onChange={handleChange} required />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Phone Number *</label>
                    <input name="student_phn_no" value={formData.student_phn_no} onChange={handleChange} required />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Alternative Phone</label>
                    <input name="student_alternative_phn_no" value={formData.student_alternative_phn_no || ''} onChange={handleChange} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Email Address</label>
                    <input type="email" name="student_email" value={formData.student_email || ''} onChange={handleChange} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                    <label>Home Address</label>
                    <input name="student_address" value={formData.student_address || ''} onChange={handleChange} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Guardian Name</label>
                    <input name="guardian_name" value={formData.guardian_name || ''} onChange={handleChange} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Guardian Phone No</label>
                    <input name="guardian_phn_no" value={formData.guardian_phn_no || ''} onChange={handleChange} />
                  </div>
                </div>
              )}

              {activeTab === 'course' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Interested Course *</label>
                    <select name="course_id" value={formData.course_id} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit' }} required>
                      {courses.map(c => <option key={c.course_id} value={c.course_id} style={{ background: 'var(--background)' }}>{c.course_name}</option>)}
                      {courses.length === 0 && <option value="" disabled>No courses available</option>}
                    </select>
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Course Category</label>
                    <select name="course_category" value={formData.course_category} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit' }}>
                      <option value="general" style={{ background: 'var(--background)' }}>General</option>
                      <option value="premium" style={{ background: 'var(--background)' }}>Premium</option>
                    </select>
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Assigned Counsellor *</label>
                    <select name="counsellor_id" value={formData.counsellor_id} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit' }} required>
                      {counsellors.map(c => <option key={c.counsellor_id} value={c.counsellor_id} style={{ background: 'var(--background)' }}>{c.full_name}</option>)}
                      {counsellors.length === 0 && <option value="" disabled>No counsellors available</option>}
                    </select>
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Admission Code *</label>
                    <input name="admission_code" value={formData.admission_code} onChange={handleChange} placeholder="Required code from Counsellor" required />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                    <label>Enquiry Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit' }}>
                      <option value="pending" style={{ background: 'var(--background)' }}>Pending</option>
                      <option value="contacted" style={{ background: 'var(--background)' }}>Contacted</option>
                      <option value="converted" style={{ background: 'var(--background)' }}>Converted (Admitted)</option>
                      <option value="cancelled" style={{ background: 'var(--background)' }}>Cancelled</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'medical' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" name="fit_medically" checked={formData.fit_medically} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
                      Medically Fit
                    </label>
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" name="meets_height_requirements" checked={formData.meets_height_requirements} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
                      Meets Height Requirements
                    </label>
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" name="meets_weight_requirements" checked={formData.meets_weight_requirements} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
                      Meets Weight Requirements
                    </label>
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" name="meets_vision_standards" checked={formData.meets_vision_standards} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
                      Meets Vision Standards
                    </label>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" form="enquiry-form" className="btn-primary">Save Enquiry</button>
        </div>
      </motion.div>
    </div>
  );
};

const Enquiries = () => {
  const toast = useToast();
  const [enquiries, setEnquiries] = useState([]);
  const [courses, setCourses] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const fetchData = async () => {
    try {
      const [resEnquiries, resCourses, resCounsellors] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admission-enquiries/get-all`),
        fetch(`${API_BASE_URL}/api/courses/get-all`),
        fetch(`${API_BASE_URL}/api/counsellors/get-all`)
      ]);
      if (resEnquiries.ok && resCourses.ok && resCounsellors.ok) {
        setEnquiries(await resEnquiries.json());
        setCourses(await resCourses.json());
        setCounsellors(await resCounsellors.json());
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

  const handleSave = async (data) => {
    try {
      if (modalMode === 'create') {
        const response = await fetch(`${API_BASE_URL}/api/admission-enquiries/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || "Failed to create");
        }
      } else if (modalMode === 'edit') {
        const response = await fetch(`${API_BASE_URL}/api/admission-enquiries/put-by/${data.enquiry_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || "Failed to update");
        }
      }
      setModalMode(null);
      setSelectedEnquiry(null);
      fetchData();
    } catch (err) {
      console.error('Error saving enquiry:', err);
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (enquiry) => {
    if (await toast.confirm(`Are you sure you want to delete the enquiry for ${enquiry.student_name}?`)) {
      try {
        await fetch(`${API_BASE_URL}/api/admission-enquiries/delete-by/${enquiry.enquiry_id}`, { method: 'DELETE' });
        fetchData();
      } catch (err) {
        console.error('Error deleting enquiry:', err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return { bg: 'rgba(245, 195, 0, 0.2)', text: '#F5C300' };
      case 'contacted': return { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' };
      case 'converted': return { bg: 'rgba(74, 222, 128, 0.2)', text: '#4ade80' };
      case 'cancelled': return { bg: 'rgba(248, 113, 113, 0.2)', text: '#f87171' };
      default: return { bg: 'rgba(255, 255, 255, 0.1)', text: 'var(--text-main)' };
    }
  };

  const columns = [
    {
      header: 'Student Info',
      accessor: 'student_name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-button)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--deep-navy)', fontWeight: 'bold' }}>
            {row.student_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: '500' }}>{row.student_name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={10} /> {row.student_phn_no}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Course',
      accessor: 'course_name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '500' }}>{row.course_name || 'N/A'}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{row.course_category}</div>
        </div>
      )
    },
    {
      header: 'Counsellor',
      accessor: 'counsellor_name',
      render: (row) => row.counsellor_name || 'N/A'
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const colors = getStatusColor(row.status);
        return (
          <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', background: colors.bg, color: colors.text, textTransform: 'capitalize' }}>
            {row.status}
          </span>
        );
      }
    },
    {
      header: 'Enquiry Date',
      accessor: 'created_at',
      render: (row) => new Date(row.created_at).toLocaleDateString()
    },
  ];

  if (loading) return <p>Loading enquiries...</p>;

  return (
    <div style={{ animation: 'slideUp 0.5s ease' }}>
      <DataTable
        title="Admission Enquiries"
        columns={columns}
        data={enquiries}
        onEdit={(enquiry) => { setSelectedEnquiry(enquiry); setModalMode('edit'); }}
        onDelete={handleDelete}
      />
      <AnimatePresence>
        {modalMode && (
          <EnquiryModal
            enquiry={selectedEnquiry}
            courses={courses}
            counsellors={counsellors}
            onClose={() => setModalMode(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Enquiries;

