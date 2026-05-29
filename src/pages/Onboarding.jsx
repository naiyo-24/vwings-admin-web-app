import { useState, useEffect } from 'react';
import { UserPlus, BookOpen, Briefcase, GraduationCap, ArrowRight, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'http://localhost:8000';

// Reusable file upload button component
const FileUploadBtn = ({ file, onFileChange, accept = 'image/*', label = 'Choose Photo' }) => (
  <label className="btn-secondary" style={{
    display: 'inline-flex', gap: '8px', cursor: 'pointer', margin: 0,
    background: file ? 'rgba(74, 222, 128, 0.1)' : 'transparent',
    color: file ? '#4ade80' : 'var(--text-main)',
    borderColor: file ? 'rgba(74, 222, 128, 0.3)' : 'var(--border)',
    maxWidth: '100%', overflow: 'hidden'
  }}>
    {file ? <CheckCircle size={18} /> : <Upload size={18} />}
    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {file ? file.name : label}
    </span>
    <input type="file" accept={accept} onChange={onFileChange} style={{ display: 'none' }} />
  </label>
);

const INITIAL_STUDENT = {
  full_name: '', email: '', phone_no: '', address: '',
  guardian_name: '', guardian_mobile_no: '', guardian_email: '',
  course_availing: '', interests: '', hobbies: '', password: ''
};

const INITIAL_TEACHER = {
  full_name: '', email: '', phone_no: '', alternative_phone_no: '', address: '',
  experience: '', qualification: '', bank_account_name: '', bank_account_no: '',
  bank_branch_name: '', ifsc_code: '', upiid: '', monthly_salary: '', password: '',
  courses_assigned: []
};

const INITIAL_COUNSELLOR = {
  full_name: '', email: '', phone_no: '', alternative_phone_no: '', address: '',
  experience: '', qualification: '', bank_account_name: '', bank_account_no: '',
  branch_name: '', ifsc_code: '', upi_id: '', password: '', per_courses_commission: {}
};

const Onboarding = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [courses, setCourses] = useState([]);

  const [studentForm, setStudentForm] = useState(INITIAL_STUDENT);
  const [teacherForm, setTeacherForm] = useState(INITIAL_TEACHER);
  const [counsellorForm, setCounsellorForm] = useState(INITIAL_COUNSELLOR);

  // Separate file state per tab
  const [studentFile, setStudentFile] = useState(null);
  const [teacherFile, setTeacherFile] = useState(null);
  const [counsellorFile, setCounsellorFile] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/courses/get-all`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setCourses(data))
      .catch(() => {});
  }, []);

  // ─── Student Submit ───────────────────────────────────────────────────────
  const handleStudentSubmit = async () => {
    const { full_name, email, phone_no, address, guardian_name, guardian_mobile_no, course_availing, password } = studentForm;
    if (!full_name || !email || !phone_no || !address || !guardian_name || !guardian_mobile_no || !course_availing || !password) {
      alert('Please fill all required (*) fields.');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('full_name', full_name);
      fd.append('email', email);
      fd.append('phone_no', phone_no);
      fd.append('address', address);
      fd.append('guardian_name', guardian_name);
      fd.append('guardian_mobile_no', guardian_mobile_no);
      fd.append('password', password);
      fd.append('course_availing', course_availing);
      if (studentForm.guardian_email) fd.append('guardian_email', studentForm.guardian_email);
      if (studentForm.interests)
        fd.append('interests', JSON.stringify(studentForm.interests.split(',').map(s => s.trim()).filter(Boolean)));
      if (studentForm.hobbies)
        fd.append('hobbies', JSON.stringify(studentForm.hobbies.split(',').map(s => s.trim()).filter(Boolean)));
      if (studentFile) fd.append('profile_photo', studentFile);

      const res = await fetch(`${API_BASE_URL}/api/students/create`, { method: 'POST', body: fd });
      if (res.ok) {
        alert('✅ Student successfully onboarded!');
        setStudentForm(INITIAL_STUDENT);
        setStudentFile(null);
      } else {
        const err = await res.json();
        alert(`❌ Failed: ${err.detail || 'Unknown error'}`);
      }
    } catch {
      alert('❌ Error connecting to backend. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  // ─── Teacher Submit ────────────────────────────────────────────────────────
  const handleTeacherSubmit = async () => {
    const { full_name, email, phone_no, password } = teacherForm;
    if (!full_name || !email || !phone_no || !password) {
      alert('Please fill all required (*) fields.');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('full_name', full_name);
      fd.append('email', email);
      fd.append('phone_no', phone_no);
      fd.append('password', password);
      if (teacherForm.alternative_phone_no) fd.append('alternative_phone_no', teacherForm.alternative_phone_no);
      if (teacherForm.address) fd.append('address', teacherForm.address);
      if (teacherForm.qualification) fd.append('qualification', teacherForm.qualification);
      if (teacherForm.experience) fd.append('experience', teacherForm.experience);
      if (teacherForm.bank_account_name) fd.append('bank_account_name', teacherForm.bank_account_name);
      if (teacherForm.bank_account_no) fd.append('bank_account_no', teacherForm.bank_account_no);
      if (teacherForm.bank_branch_name) fd.append('bank_branch_name', teacherForm.bank_branch_name);
      if (teacherForm.ifsc_code) fd.append('ifsc_code', teacherForm.ifsc_code);
      if (teacherForm.upiid) fd.append('upiid', teacherForm.upiid);
      if (teacherForm.monthly_salary) fd.append('monthly_salary', teacherForm.monthly_salary);
      if (teacherForm.courses_assigned.length > 0)
        fd.append('courses_assigned', JSON.stringify(teacherForm.courses_assigned));
      if (teacherFile) fd.append('profile_photo', teacherFile);

      const res = await fetch(`${API_BASE_URL}/api/teachers/create`, { method: 'POST', body: fd });
      if (res.ok) {
        alert('✅ Teacher successfully onboarded!');
        setTeacherForm(INITIAL_TEACHER);
        setTeacherFile(null);
      } else {
        const err = await res.json();
        alert(`❌ Failed: ${err.detail || 'Unknown error'}`);
      }
    } catch {
      alert('❌ Error connecting to backend. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  // ─── Counsellor Submit ─────────────────────────────────────────────────────
  const handleCounsellorSubmit = async () => {
    const { full_name, email, phone_no, password } = counsellorForm;
    if (!full_name || !email || !phone_no || !password) {
      alert('Please fill all required (*) fields.');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('full_name', full_name);
      fd.append('email', email);
      fd.append('phone_no', phone_no);
      fd.append('password', password);
      if (counsellorForm.alternative_phone_no) fd.append('alternative_phone_no', counsellorForm.alternative_phone_no);
      if (counsellorForm.address) fd.append('address', counsellorForm.address);
      if (counsellorForm.qualification) fd.append('qualification', counsellorForm.qualification);
      if (counsellorForm.experience) fd.append('experience', counsellorForm.experience);
      if (counsellorForm.bank_account_name) fd.append('bank_account_name', counsellorForm.bank_account_name);
      if (counsellorForm.bank_account_no) fd.append('bank_account_no', counsellorForm.bank_account_no);
      if (counsellorForm.branch_name) fd.append('branch_name', counsellorForm.branch_name);
      if (counsellorForm.ifsc_code) fd.append('ifsc_code', counsellorForm.ifsc_code);
      if (counsellorForm.upi_id) fd.append('upi_id', counsellorForm.upi_id);
      if (Object.keys(counsellorForm.per_courses_commission).length > 0)
        fd.append('per_courses_commission', JSON.stringify(counsellorForm.per_courses_commission));
      if (counsellorFile) fd.append('profile_photo', counsellorFile);

      const res = await fetch(`${API_BASE_URL}/api/counsellors/create`, { method: 'POST', body: fd });
      if (res.ok) {
        alert('✅ Counsellor successfully onboarded!');
        setCounsellorForm(INITIAL_COUNSELLOR);
        setCounsellorFile(null);
      } else {
        const err = await res.json();
        alert(`❌ Failed: ${err.detail || 'Unknown error'}`);
      }
    } catch {
      alert('❌ Error connecting to backend. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  // ─── Shared Input helpers ──────────────────────────────────────────────────
  const sf = (key) => ({ value: studentForm[key], onChange: (e) => setStudentForm(p => ({ ...p, [key]: e.target.value })) });
  const tf = (key) => ({ value: teacherForm[key], onChange: (e) => setTeacherForm(p => ({ ...p, [key]: e.target.value })) });
  const cf = (key) => ({ value: counsellorForm[key], onChange: (e) => setCounsellorForm(p => ({ ...p, [key]: e.target.value })) });

  const inputStyle = { marginBottom: 0 };
  const fullRow = { ...inputStyle, gridColumn: '1 / -1' };

  // ─── Tabs ─────────────────────────────────────────────────────────────────
  const tabs = [
    { key: 'student', label: 'Student', icon: <GraduationCap size={22} /> },
    { key: 'teacher', label: 'Teacher', icon: <BookOpen size={22} /> },
    { key: 'counsellor', label: 'Counsellor', icon: <Briefcase size={22} /> },
  ];

  // ─── Course checkbox list for Teacher ────────────────────────────────────
  const CourseCheckboxList = () => (
    <div className="input-group" style={fullRow}>
      <label>Courses Assigned</label>
      <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {courses.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Loading courses...</span>}
        {courses.map(c => (
          <label key={c.course_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
            <span>{c.course_name}</span>
            <input type="checkbox"
              checked={teacherForm.courses_assigned.includes(c.course_id)}
              onChange={() => setTeacherForm(p => ({
                ...p,
                courses_assigned: p.courses_assigned.includes(c.course_id)
                  ? p.courses_assigned.filter(id => id !== c.course_id)
                  : [...p.courses_assigned, c.course_id]
              }))}
              style={{ width: 18, height: 18, cursor: 'pointer' }}
            />
          </label>
        ))}
      </div>
    </div>
  );

  // ─── Commission list for Counsellor ───────────────────────────────────────
  const CommissionList = () => (
    <div className="input-group" style={fullRow}>
      <label style={{ color: 'var(--primary-yellow)', fontWeight: '600', fontSize: '1rem' }}>Assign Courses & Commission %</label>
      <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {courses.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Loading courses...</span>}
        {courses.map(c => {
          const isChecked = Object.prototype.hasOwnProperty.call(counsellorForm.per_courses_commission, c.course_id);
          return (
            <div key={c.course_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}>
                <input type="checkbox" checked={isChecked}
                  onChange={(e) => setCounsellorForm(p => {
                    const updated = { ...p.per_courses_commission };
                    if (e.target.checked) updated[c.course_id] = 0;
                    else delete updated[c.course_id];
                    return { ...p, per_courses_commission: updated };
                  })}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
                <span>{c.course_name}</span>
              </label>
              {isChecked && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>%</span>
                  <input type="number" placeholder="0"
                    value={counsellorForm.per_courses_commission[c.course_id]}
                    onChange={(e) => setCounsellorForm(p => ({
                      ...p,
                      per_courses_commission: { ...p.per_courses_commission, [c.course_id]: parseFloat(e.target.value) || 0 }
                    }))}
                    style={{ width: 80, padding: '6px 10px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ─── Form Panels ───────────────────────────────────────────────────────────
  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' };

  const renderStudentWizard = () => (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <h2 style={{ margin: '0 0 28px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <UserPlus color="var(--primary-yellow)" /> Onboard Student
      </h2>
      <div style={grid}>
        <div className="input-group" style={fullRow}><label>Full name *</label><input type="text" placeholder="John Doe" {...sf('full_name')} /></div>
        <div className="input-group" style={inputStyle}><label>Phone no *</label><input type="text" placeholder="+91 9876543210" {...sf('phone_no')} /></div>
        <div className="input-group" style={inputStyle}><label>Email *</label><input type="email" placeholder="john@example.com" {...sf('email')} /></div>
        <div className="input-group" style={fullRow}><label>Address *</label><input type="text" placeholder="Full Address" {...sf('address')} /></div>
        <div className="input-group" style={inputStyle}><label>Guardian name *</label><input type="text" placeholder="Guardian Name" {...sf('guardian_name')} /></div>
        <div className="input-group" style={inputStyle}><label>Guardian phone *</label><input type="text" placeholder="Guardian Phone" {...sf('guardian_mobile_no')} /></div>
        <div className="input-group" style={fullRow}><label>Guardian email</label><input type="email" placeholder="Guardian Email" {...sf('guardian_email')} /></div>
        <div className="input-group" style={fullRow}>
          <label>Course pursuing *</label>
          <select value={studentForm.course_availing} onChange={e => setStudentForm(p => ({ ...p, course_availing: e.target.value }))}>
            <option value="">Select a course...</option>
            {courses.map(c => (
              <option key={c.course_id} value={c.course_id}>{c.course_name} (₹{c.general_data?.course_fees || 0})</option>
            ))}
          </select>
        </div>
        <div className="input-group" style={inputStyle}><label>Interests (comma separated)</label><input type="text" placeholder="e.g. Reading, Traveling" {...sf('interests')} /></div>
        <div className="input-group" style={inputStyle}><label>Hobbies (comma separated)</label><input type="text" placeholder="e.g. Sports, Music" {...sf('hobbies')} /></div>
        <div className="input-group" style={inputStyle}><label>Password *</label><input type="password" placeholder="Set Account Password" {...sf('password')} /></div>
        <div className="input-group" style={inputStyle}>
          <label>Profile Photo</label>
          <FileUploadBtn file={studentFile} onFileChange={e => setStudentFile(e.target.files?.[0] || null)} />
        </div>
      </div>
      <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-primary" onClick={handleStudentSubmit} disabled={loading}
          style={{ display: 'flex', gap: '8px', alignItems: 'center', opacity: loading ? 0.7 : 1 }}>
          {loading ? <Loader2 size={18} className="spin" /> : <ArrowRight size={18} />} Register Student
        </button>
      </div>
    </div>
  );

  const renderTeacherWizard = () => (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <h2 style={{ margin: '0 0 28px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <UserPlus color="var(--primary-yellow)" /> Onboard Teacher
      </h2>
      <div style={grid}>
        <div className="input-group" style={inputStyle}><label>Full name *</label><input type="text" placeholder="Teacher Name" {...tf('full_name')} /></div>
        <div className="input-group" style={inputStyle}><label>Email *</label><input type="email" placeholder="Email" {...tf('email')} /></div>
        <div className="input-group" style={inputStyle}><label>Phone No *</label><input type="text" placeholder="Phone Number" {...tf('phone_no')} /></div>
        <div className="input-group" style={inputStyle}><label>Alternative Phone</label><input type="text" placeholder="Alt Phone" {...tf('alternative_phone_no')} /></div>
        <div className="input-group" style={fullRow}><label>Address</label><input type="text" placeholder="Address" {...tf('address')} /></div>
        <div className="input-group" style={inputStyle}><label>Qualification</label><input type="text" placeholder="Degrees / Certifications" {...tf('qualification')} /></div>
        <div className="input-group" style={inputStyle}><label>Experience</label><input type="text" placeholder="Years of Experience" {...tf('experience')} /></div>
        <div className="input-group" style={inputStyle}><label>Bank A/C Name</label><input type="text" placeholder="Account Holder Name" {...tf('bank_account_name')} /></div>
        <div className="input-group" style={inputStyle}><label>Bank A/C No</label><input type="text" placeholder="Account Number" {...tf('bank_account_no')} /></div>
        <div className="input-group" style={inputStyle}><label>Bank Branch Name</label><input type="text" placeholder="Branch Name" {...tf('bank_branch_name')} /></div>
        <div className="input-group" style={inputStyle}><label>IFSC Code</label><input type="text" placeholder="IFSC Code" {...tf('ifsc_code')} /></div>
        <div className="input-group" style={inputStyle}><label>UPI ID</label><input type="text" placeholder="UPI ID" {...tf('upiid')} /></div>
        <div className="input-group" style={inputStyle}><label>Monthly Salary</label><input type="number" placeholder="Salary Amount" {...tf('monthly_salary')} /></div>
        <div className="input-group" style={inputStyle}><label>Password *</label><input type="password" placeholder="Account Password" {...tf('password')} /></div>
        <div className="input-group" style={inputStyle}>
          <label>Profile Photo</label>
          <FileUploadBtn file={teacherFile} onFileChange={e => setTeacherFile(e.target.files?.[0] || null)} label="Pick Photo" />
        </div>
        <CourseCheckboxList />
      </div>
      <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-primary" onClick={handleTeacherSubmit} disabled={loading}
          style={{ display: 'flex', gap: '8px', alignItems: 'center', opacity: loading ? 0.7 : 1 }}>
          {loading ? <Loader2 size={18} /> : <ArrowRight size={18} />} Save Teacher
        </button>
      </div>
    </div>
  );

  const renderCounsellorWizard = () => (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <h2 style={{ margin: '0 0 28px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <UserPlus color="var(--primary-yellow)" /> Onboard Counsellor
      </h2>
      <div style={grid}>
        <div className="input-group" style={inputStyle}><label>Full Name *</label><input type="text" placeholder="Full Name" {...cf('full_name')} /></div>
        <div className="input-group" style={inputStyle}><label>Phone Number *</label><input type="text" placeholder="Phone Number" {...cf('phone_no')} /></div>
        <div className="input-group" style={inputStyle}><label>Alternative Phone</label><input type="text" placeholder="Alt Phone" {...cf('alternative_phone_no')} /></div>
        <div className="input-group" style={inputStyle}><label>Email *</label><input type="email" placeholder="Email Address" {...cf('email')} /></div>
        <div className="input-group" style={fullRow}><label>Address</label><input type="text" placeholder="Address" {...cf('address')} /></div>
        <div className="input-group" style={inputStyle}><label>Qualification</label><input type="text" placeholder="Degrees / Certifications" {...cf('qualification')} /></div>
        <div className="input-group" style={inputStyle}><label>Experience</label><input type="text" placeholder="Years of Experience" {...cf('experience')} /></div>
        <CommissionList />
        <div className="input-group" style={inputStyle}><label>Bank A/C Name</label><input type="text" placeholder="Account Holder Name" {...cf('bank_account_name')} /></div>
        <div className="input-group" style={inputStyle}><label>Bank A/C No</label><input type="text" placeholder="Account Number" {...cf('bank_account_no')} /></div>
        <div className="input-group" style={inputStyle}><label>Branch Name</label><input type="text" placeholder="Branch Name" {...cf('branch_name')} /></div>
        <div className="input-group" style={inputStyle}><label>IFSC Code</label><input type="text" placeholder="IFSC Code" {...cf('ifsc_code')} /></div>
        <div className="input-group" style={inputStyle}><label>UPI ID</label><input type="text" placeholder="UPI ID" {...cf('upi_id')} /></div>
        <div className="input-group" style={inputStyle}><label>Password *</label><input type="password" placeholder="Account Password" {...cf('password')} /></div>
        <div className="input-group" style={inputStyle}>
          <label>Profile Photo</label>
          <FileUploadBtn file={counsellorFile} onFileChange={e => setCounsellorFile(e.target.files?.[0] || null)} label="Pick Photo" />
        </div>
      </div>
      <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-primary" onClick={handleCounsellorSubmit} disabled={loading}
          style={{ display: 'flex', gap: '8px', alignItems: 'center', opacity: loading ? 0.7 : 1 }}>
          {loading ? <Loader2 size={18} /> : <ArrowRight size={18} />} Save Counsellor
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ animation: 'slideUp 0.5s ease', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', margin: '0 0 8px 0' }}>User Onboarding</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Select a role below to start the unified registration wizard.</p>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{
              flex: 1, padding: '16px', borderRadius: '16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              border: '1px solid var(--border)', transition: 'all 0.3s', color: 'white',
              background: activeTab === t.key ? 'linear-gradient(135deg, var(--deep-navy), var(--magenta))' : 'rgba(0,0,0,0.2)',
              boxShadow: activeTab === t.key ? '0 4px 20px rgba(182,0,125,0.3)' : 'none',
            }}>
            {t.icon}
            <span style={{ fontSize: '1rem', fontWeight: '600' }}>{t.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.18 }}
        >
          {activeTab === 'student' && renderStudentWizard()}
          {activeTab === 'teacher' && renderTeacherWizard()}
          {activeTab === 'counsellor' && renderCounsellorWizard()}
        </motion.div>
      </AnimatePresence>

      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Onboarding;
