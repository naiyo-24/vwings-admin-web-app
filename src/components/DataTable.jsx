import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const DataTable = ({ title, columns, data, onAdd, onEdit, onDelete, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!onSearch) return;
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const filteredData = onSearch ? data : data.filter(row => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    // Search across all object values
    return Object.values(row).some(val => 
      val && String(val).toLowerCase().includes(term)
    );
  });

  return (
    <div className="glass-panel" style={{ padding: '24px', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{title}</h2>
        <div style={{ display: 'flex', gap: '16px', flex: 1, minWidth: '250px', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder={title ? `Search ${title.toLowerCase()}...` : 'Search...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '10px 16px 10px 40px',
                color: 'var(--text-main)',
                width: '100%'
              }}
            />
          </div>
          {onAdd && (
            <button className="btn-primary" onClick={onAdd} style={{ padding: '10px 20px', borderRadius: '8px' }}>
              <Plus size={18} /> Add New
            </button>
          )}
        </div>
      </div>

      <div className="table-responsive" style={{ flex: 1 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {columns.map((col, idx) => (
                <th key={idx} style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>{col.header}</th>
              ))}
              {(onEdit || onDelete) && (
                <th style={{ padding: '16px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: '500' }}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <motion.tr 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{ borderBottom: '1px solid var(--border)' }}
                className="table-row-hover"
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} style={{ padding: '16px', color: 'var(--text-main)' }}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    {onEdit && (
                      <button onClick={() => onEdit(row)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginRight: '8px' }}>
                        <Edit size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                )}
              </motion.tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <style>
        {`
          .table-row-hover:hover {
            background: rgba(255, 255, 255, 0.03);
          }
        `}
      </style>
    </div>
  );
};

export default DataTable;
