import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader, User, BookOpen, UserCheck, GraduationCap, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://appbackend.vwings247.me';

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Search API Call
  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults(null);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/search/?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (data.success) {
          setResults(data.data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchResults();
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleResultClick = (type, id) => {
    setIsOpen(false);
    setQuery('');
    // Navigate based on type (assuming basic routes)
    if (type === 'student') navigate(`/students`);
    else if (type === 'teacher') navigate(`/teachers`);
    else if (type === 'counsellor') navigate(`/counsellors`);
    else if (type === 'course') navigate(`/courses`);
  };

  const hasResults = results && (
    results.students.length > 0 ||
    results.teachers.length > 0 ||
    results.counsellors.length > 0 ||
    results.courses.length > 0
  );

  return (
    <div className="global-search-container" ref={searchRef}>
      <div className="search-input-wrapper" style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '8px 16px',
        transition: 'all 0.3s ease',
        boxShadow: isOpen ? '0 0 0 2px var(--primary-magenta)' : 'none'
      }}>
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search anything..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value) setIsOpen(false);
          }}
          onFocus={() => { if (query.trim()) setIsOpen(true); }}
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            color: 'var(--text-main)',
            width: '100%',
            marginLeft: '8px',
            fontSize: '0.95rem'
          }}
        />
        {isLoading && <Loader size={16} color="var(--text-muted)" style={{ animation: 'spin 1s linear infinite' }} />}
        {query && !isLoading && (
          <X
            size={16}
            color="var(--text-muted)"
            style={{ cursor: 'pointer' }}
            onClick={() => { setQuery(''); setIsOpen(false); }}
          />
        )}
      </div>

      {isOpen && (query.trim() !== '') && (
        <div className="search-dropdown" style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          right: 0,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.1)',
          maxHeight: '400px',
          overflowY: 'auto',
          zIndex: 1000,
          padding: '12px 0'
        }}>
          {isLoading && !results ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Searching...
            </div>
          ) : !hasResults ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No results found for "{query}"
            </div>
          ) : (
            <>
              {/* Students Section */}
              {results.students.length > 0 && (
                <div className="search-section">
                  <div style={{ padding: '4px 16px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Students
                  </div>
                  {results.students.map(student => (
                    <div
                      key={student.id}
                      onClick={() => handleResultClick('student', student.id)}
                      style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-main)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(96, 165, 250, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {student.photo ? (
                          <img src={student.photo} alt={student.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <GraduationCap size={16} color="#60a5fa" />
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '500' }}>{student.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.id}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Teachers Section */}
              {results.teachers.length > 0 && (
                <div className="search-section" style={{ marginTop: '8px' }}>
                  <div style={{ padding: '4px 16px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Teachers
                  </div>
                  {results.teachers.map(teacher => (
                    <div
                      key={teacher.id}
                      onClick={() => handleResultClick('teacher', teacher.id)}
                      style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-main)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(74, 222, 128, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {teacher.photo ? (
                          <img src={teacher.photo} alt={teacher.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <User size={16} color="#4ade80" />
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '500' }}>{teacher.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{teacher.id}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Counsellors Section */}
              {results.counsellors.length > 0 && (
                <div className="search-section" style={{ marginTop: '8px' }}>
                  <div style={{ padding: '4px 16px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Counsellors
                  </div>
                  {results.counsellors.map(counsellor => (
                    <div
                      key={counsellor.id}
                      onClick={() => handleResultClick('counsellor', counsellor.id)}
                      style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-main)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(250, 204, 21, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {counsellor.photo ? (
                          <img src={counsellor.photo} alt={counsellor.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <UserCheck size={16} color="#facc15" />
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '500' }}>{counsellor.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{counsellor.id}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Courses Section */}
              {results.courses.length > 0 && (
                <div className="search-section" style={{ marginTop: '8px' }}>
                  <div style={{ padding: '4px 16px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Courses
                  </div>
                  {results.courses.map(course => (
                    <div
                      key={course.id}
                      onClick={() => handleResultClick('course', course.id)}
                      style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-main)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(192, 132, 252, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {course.photo ? (
                          <img src={course.photo} alt={course.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <BookOpen size={16} color="#c084fc" />
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '500' }}>{course.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{course.code}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GlobalSearch;
