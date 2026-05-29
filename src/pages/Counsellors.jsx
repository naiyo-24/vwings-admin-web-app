import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from '../components/DataTable';

const API_BASE_URL = 'http://localhost:8000';

const CounsellorModal = ({ counsellor, courses, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('personal');
  
  // Initialize commission map from existing data
  const initialCommissions = {};
  if (counsellor && counsellor.per_courses_commission) {
    Object.keys(counsellor.per_courses_commission).forEach(courseId => {
      initialCommissions[courseId] = counsellor.per_courses_commission[courseId].commission || 0;
    });
  }

  const [formData, setFormData] = useState({
    full_name: counsellor?.full_name || '',
    phone_no: counsellor?.phone_no || '',
    alternative_phone_no: counsellor?.alternative_phone_no || '',
    email: counsellor?.email || '',
    address: counsellor?.address || '',
    qualification: counsellor?.qualification || '',
    experience: counsellor?.experience || '',
    bank_account_no: counsellor?.bank_account_no || '',
    bank_account_name: counsellor?.bank_account_name || '',
    branch_name: counsellor?.branch_name || '',
    ifsc_code: counsellor?.ifsc_code || '',
    upi_id: counsellor?.upi_id || '',
    password: ''
  });

  const [commissions, setCommissions] = useState(initialCommissions);
  const [photoFile, setPhotoFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCommissionToggle = (courseId, isChecked) => {
    const newCommissions = { ...commissions };
    if (isChecked) {
      newCommissions[courseId] = 0; // default 0%
    } else {
      delete newCommissions[courseId];
    }
    setCommissions(newCommissions);
  };

  const handleCommissionValueChange = (courseId, value) => {
    setCommissions({ ...commissions, [courseId]: parseFloat(value) || 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, commissions, photoFile);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: 'var(--background)', overflow: 'hidden' }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{counsellor ? 'Edit Counsellor' : 'Add Counsellor'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><X size={20}/></button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
          <button type="button" onClick={() => setActiveTab('personal')} style={{ padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'personal' ? '2px solid var(--primary-yellow)' : '2px solid transparent', color: activeTab === 'personal' ? 'var(--primary-yellow)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '500' }}>Personal Details</button>
          <button type="button" onClick={() => setActiveTab('professional')} style={{ padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'professional' ? '2px solid var(--primary-yellow)' : '2px solid transparent', color: activeTab === 'professional' ? 'var(--primary-yellow)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '500' }}>Professional & Commission</button>
          <button type="button" onClick={() => setActiveTab('banking')} style={{ padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'banking' ? '2px solid var(--primary-yellow)' : '2px solid transparent', color: activeTab === 'banking' ? 'var(--primary-yellow)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '500' }}>Banking & Accounts</button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
          <div style={{ padding: '32px' }}>
            <form id="counsellor-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
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
                    <label>Password {!counsellor && '*'}</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={counsellor ? "Leave blank to keep unchanged" : ""} required={!counsellor} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Profile Photo</label>
                    <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} style={{ background: 'var(--surface)', padding: '10px' }} />
                    {counsellor?.profile_photo && !photoFile && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current photo exists. Uploading new will replace it.</span>}
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
                    <label>Course Commission Matrix (%)</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      {courses.map(course => (
                        <div key={course.course_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1, fontSize: '0.9rem' }}>
                            <input 
                              type="checkbox" 
                              checked={Object.prototype.hasOwnProperty.call(commissions, )} 
                              onChange={(e) => handleCommissionToggle(course.course_id, e.target.checked)} 
                            />
                            {course.course_name}
                          </label>
                          {Object.prototype.hasOwnProperty.call(commissions, ) && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input 
                                type="number" 
                                min="0" max="100" step="0.1"
                                value={commissions[course.course_id]} 
                                onChange={(e) => handleCommissionValueChange(course.course_id, e.target.value)} 
                                style={{ width: '80px', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                              />
                              <span style={{ color: 'var(--text-muted)' }}>%</span>
                            </div>
                          )}
                        </div>
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
                    <input name="branch_name" value={formData.branch_name} onChange={handleChange} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>IFSC Code</label>
                    <input name="ifsc_code" value={formData.ifsc_code} onChange={handleChange} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>UPI ID</label>
                    <input name="upi_id" value={formData.upi_id} onChange={handleChange} />
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" form="counsellor-form" className="btn-primary">Save Counsellor</button>
        </div>
      </motion.div>
    </div>
  );
};

const Counsellors = () => {
  const [counsellors, setCounsellors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);

  const fetchData = async () => {
    try {
      const [resCounsellors, resCourses] = await Promise.all([
        fetch(`${API_BASE_URL}/api/counsellors/get-all`),
        fetch(`${API_BASE_URL}/api/courses/get-all`)
      ]);
      if (resCounsellors.ok && resCourses.ok) {
        setCounsellors(await resCounsellors.json());
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

  const handleSave = async (data, commissions, photoFile) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formData.append(key, value);
        }
      });
      
      if (Object.keys(commissions).length > 0) {
        formData.append('per_courses_commission', JSON.stringify(commissions));
      }
      
      if (photoFile) {
        formData.append('profile_photo', photoFile);
      }

      if (modalMode === 'create') {
        const response = await fetch(`${API_BASE_URL}/api/counsellors/create`, {
          method: 'POST',
          body: formData
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || "Failed to create");
        }
      } else if (modalMode === 'edit') {
        const response = await fetch(`${API_BASE_URL}/api/counsellors/put-by/${selectedCounsellor.counsellor_id}`, {
          method: 'PUT',
          body: formData
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || "Failed to update");
        }
      }
      setModalMode(null);
      setSelectedCounsellor(null);
      fetchData();
    } catch (err) {
      console.error('Error saving counsellor:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (counsellor) => {
    if (window.confirm(`Are you sure you want to delete ${counsellor.full_name}? This may affect linked enquiries.`)) {
      try {
        await fetch(`${API_BASE_URL}/api/counsellors/delete-by/${counsellor.counsellor_id}`, { method: 'DELETE' });
        fetchData();
      } catch (err) {
        console.error('Error deleting counsellor:', err);
      }
    }
  };

  const columns = [
    { 
      header: 'Counsellor Profile', 
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
      header: 'Phone Number', 
      accessor: 'phone_no'
    },
    { 
      header: 'Active Commissions', 
      accessor: 'per_courses_commission',
      render: (row) => (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {row.per_courses_commission && Object.keys(row.per_courses_commission).length > 0 ? (
            Object.values(row.per_courses_commission).map((commData, idx) => (
              <span key={idx} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {commData.course_name}: <strong style={{ color: 'var(--primary-yellow)' }}>{commData.commission}%</strong>
              </span>
            ))
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>None</span>
          )}
        </div>
      )
    },
    { header: 'Experience', accessor: 'experience', render: (row) => row.experience || 'N/A' },
  ];

  if (loading) return <p>Loading counsellors...</p>;

  return (
    <div style={{ animation: 'slideUp 0.5s ease' }}>
      <DataTable 
        title="Admission Counsellors" 
        columns={columns} 
        data={counsellors} 
        onEdit={(counsellor) => { setSelectedCounsellor(counsellor); setModalMode('edit'); }}
        onDelete={handleDelete}
      />
      <AnimatePresence>
        {modalMode && (
          <CounsellorModal 
            counsellor={selectedCounsellor}
            courses={courses}
            onClose={() => setModalMode(null)} 
            onSave={handleSave} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Counsellors;
