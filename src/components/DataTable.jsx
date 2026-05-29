import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const DataTable = ({ title, columns, data, onAdd, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="glass-panel" style={{ padding: '24px', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{title}</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '10px 16px 10px 40px',
                color: 'var(--text-main)',
                width: '300px'
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

      <div style={{ overflowX: 'auto', flex: 1 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {columns.map((col, idx) => (
                <th key={idx} style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>{col.header}</th>
              ))}
              <th style={{ padding: '16px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: '500' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <motion.tr 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                className="table-row-hover"
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} style={{ padding: '16px', color: 'var(--text-main)' }}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button onClick={() => onEdit && onEdit(row)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginRight: '8px' }}>
                    <Edit size={16} />
                  </button>
                  <button onClick={() => onDelete && onDelete(row)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </motion.tr>
            ))}
            {data.length === 0 && (
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
