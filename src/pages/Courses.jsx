import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { Plus, BookOpen, Clock, Users, MoreVertical, Edit, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'http://localhost:8000';

const CourseCard = ({ course, idx, onEdit, onDelete }) => {
  const toast = useToast();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: idx * 0.1 }}
      className="glass-card" 
      style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative', overflow: 'hidden' }}
    >
      {course.course_photo ? (
        <img 
          src={`${API_BASE_URL}/${course.course_photo.replace(/\\/g, '/')}`} 
          alt={course.course_name} 
          style={{ width: '100%', height: '160px', objectFit: 'cover' }}
        />
      ) : (
        <div style={{ width: '100%', height: '160px', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookOpen size={48} color="var(--primary-yellow)" style={{ opacity: 0.5 }} />
        </div>
      )}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ position: 'relative', marginLeft: 'auto' }}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <MoreVertical size={20} />
          </button>
          
          {showMenu && (
            <div style={{
              position: 'absolute', right: 0, top: '24px', 
              background: 'rgba(30, 10, 55, 0.95)', border: '1px solid var(--border)',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '8px', padding: '8px', zIndex: 10,
              minWidth: '120px', display: 'flex', flexDirection: 'column', gap: '4px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
            }}>
              <button 
                onClick={() => { setShowMenu(false); onEdit(course); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer', borderRadius: '4px', textAlign: 'left' }}
                className="menu-item-hover"
              >
                <Edit size={14} /> Edit
              </button>
              <button 
                onClick={() => { setShowMenu(false); onDelete(course); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', borderRadius: '4px', textAlign: 'left' }}
                className="menu-item-hover"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{course.course_name}</h3>
        <p style={{ fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {course.course_description || 'No description provided.'}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <BookOpen size={14} /> Code: {course.course_code}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>
          ₹{course.general_data?.course_fees || 0}
        </div>
      </div>
      </div>
    </motion.div>
  );
};

const CourseModal = ({ course, onClose, onSave }) => {
  const toast = useToast();
  const [formData, setFormData] = useState(course || {
    course_name: '',
    course_description: '',
    course_code: '',
    weight_requirements: '',
    height_requirements: '',
    vision_standards: '',
    medical_requirements: '',
    min_educational_qualification: '',
    age_criteria: '',
    internship_included: false,
    installment_available: false,
    installment_policy: '',
    general_data: {
      job_roles_offered: '',
      placement_assistance: false,
      placement_type: 'Assisted',
      placement_rate: 0,
      advantages_highlights: '',
      course_fees: 0
    }
  });

  const [activeTab, setActiveTab] = useState('basic'); // basic, requirements, general
  const [photoFile, setPhotoFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleNestedChange = (e, section) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [section]: {
        ...(formData[section] || {}),
        [name]: type === 'checkbox' ? checked : value
      }
    });
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
          <h3 style={{ margin: 0 }}>{course ? 'Edit Course' : 'Create Course'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><X size={20}/></button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
          <button onClick={() => setActiveTab('basic')} style={{ padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'basic' ? '2px solid var(--primary-yellow)' : '2px solid transparent', color: activeTab === 'basic' ? 'var(--primary-yellow)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '500' }}>Basic Details</button>
          <button onClick={() => setActiveTab('requirements')} style={{ padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'requirements' ? '2px solid var(--primary-yellow)' : '2px solid transparent', color: activeTab === 'requirements' ? 'var(--primary-yellow)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '500' }}>Requirements</button>
          <button onClick={() => setActiveTab('general')} style={{ padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'general' ? '2px solid var(--primary-yellow)' : '2px solid transparent', color: activeTab === 'general' ? 'var(--primary-yellow)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: '500' }}>Data & Fees</button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
          <div style={{ padding: '32px' }}>
            <form id="course-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {activeTab === 'basic' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                  <label>Course Name *</label>
                  <input name="course_name" value={formData.course_name || ''} onChange={handleChange} required />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Course Code *</label>
                  <input name="course_code" value={formData.course_code || ''} onChange={handleChange} required />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Installment Policy</label>
                  <input name="installment_policy" value={formData.installment_policy || ''} onChange={handleChange} />
                </div>
                <div className="input-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                  <label>Description</label>
                  <textarea 
                    name="course_description" value={formData.course_description || ''} onChange={handleChange} 
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit', minHeight: '80px', resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '16px', gridColumn: '1 / -1' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" name="internship_included" checked={formData.internship_included || false} onChange={handleChange} />
                    Internship Included
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" name="installment_available" checked={formData.installment_available || false} onChange={handleChange} />
                    Installment Available
                  </label>
                </div>
                <div className="input-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                  <label>Course Photo</label>
                  <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} style={{ background: 'var(--surface)', padding: '10px' }} />
                  {course?.course_photo && !photoFile && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current photo exists. Uploading new will replace it.</span>}
                </div>
              </div>
            )}

            {activeTab === 'requirements' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Weight Requirements</label>
                  <input name="weight_requirements" value={formData.weight_requirements || ''} onChange={handleChange} />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Height Requirements</label>
                  <input name="height_requirements" value={formData.height_requirements || ''} onChange={handleChange} />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Vision Standards</label>
                  <input name="vision_standards" value={formData.vision_standards || ''} onChange={handleChange} />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Medical Requirements</label>
                  <input name="medical_requirements" value={formData.medical_requirements || ''} onChange={handleChange} />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Min Educational Qualification</label>
                  <input name="min_educational_qualification" value={formData.min_educational_qualification || ''} onChange={handleChange} />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Age Criteria</label>
                  <input name="age_criteria" value={formData.age_criteria || ''} onChange={handleChange} />
                </div>
              </div>
            )}

            {activeTab === 'general' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Course Fees</label>
                  <input type="number" name="course_fees" value={formData.general_data?.course_fees || 0} onChange={(e) => handleNestedChange(e, 'general_data')} />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Placement Rate (%)</label>
                  <input type="number" name="placement_rate" value={formData.general_data?.placement_rate || 0} onChange={(e) => handleNestedChange(e, 'general_data')} />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Placement Type</label>
                  <select 
                    name="placement_type" value={formData.general_data?.placement_type || 'Assisted'} onChange={(e) => handleNestedChange(e, 'general_data')}
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit' }}
                  >
                    <option value="Assisted" style={{ background: 'var(--background)' }}>Assisted</option>
                    <option value="Guaranteed" style={{ background: 'var(--background)' }}>Guaranteed</option>
                  </select>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Job Roles Offered</label>
                  <input name="job_roles_offered" value={formData.general_data?.job_roles_offered || ''} onChange={(e) => handleNestedChange(e, 'general_data')} />
                </div>
                <div className="input-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                  <label>Advantages / Highlights</label>
                  <textarea 
                    name="advantages_highlights" value={formData.general_data?.advantages_highlights || ''} onChange={(e) => handleNestedChange(e, 'general_data')}
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', color: 'var(--text-main)', fontFamily: 'Outfit', minHeight: '60px', resize: 'vertical' }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" name="placement_assistance" checked={formData.general_data?.placement_assistance || false} onChange={(e) => handleNestedChange(e, 'general_data')} />
                    Placement Assistance Available
                  </label>
                </div>
              </div>
            )}
            </form>
          </div>
        </div>
        
        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" form="course-form" className="btn-primary">Save Course</button>
        </div>
      </motion.div>
    </div>
  );
};

const Courses = () => {
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/courses/get-all`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSave = async (data, photoFile) => {
    try {
      const formData = new FormData();
      formData.append('course_data', JSON.stringify(data));
      if (photoFile) {
        formData.append('course_photo', photoFile);
      }

      if (modalMode === 'create') {
        await fetch(`${API_BASE_URL}/api/courses/create`, {
          method: 'POST',
          body: formData
        });
      } else if (modalMode === 'edit') {
        await fetch(`${API_BASE_URL}/api/courses/put-by/${selectedCourse.course_id}`, {
          method: 'PUT',
          body: formData
        });
      }
      setModalMode(null);
      setSelectedCourse(null);
      fetchCourses();
    } catch (err) {
      console.error('Error saving course:', err);
      toast.error('Failed to save course. Check console.');
    }
  };

  const handleDelete = async (course) => {
    if (await toast.confirm(`Are you sure you want to delete "${course.course_name}"?`)) {
      try {
        await fetch(`${API_BASE_URL}/api/courses/delete-by/${course.course_id}`, { method: 'DELETE' });
        fetchCourses();
      } catch (err) {
        console.error('Error deleting course:', err);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Course Management</h1>
          <p>Create and organize aviation courses.</p>
        </div>
        <button className="btn-primary" onClick={() => { setSelectedCourse(null); setModalMode('create'); }}>
          <Plus size={18} /> Create Course
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading courses...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {courses.map((course, idx) => (
            <CourseCard 
              key={course.course_id} 
              course={course} 
              idx={idx} 
              onEdit={(c) => { setSelectedCourse(c); setModalMode('edit'); }}
              onDelete={handleDelete}
            />
          ))}
          {courses.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No courses found. Create one!</p>}
        </div>
      )}

      <AnimatePresence>
        {modalMode && (
          <CourseModal 
            course={selectedCourse} 
            onClose={() => setModalMode(null)} 
            onSave={handleSave} 
          />
        )}
      </AnimatePresence>
      <style>{`
        .menu-item-hover:hover {
          var(--surface-hover) !important;
        }
      `}</style>
    </div>
  );
};

export default Courses;

