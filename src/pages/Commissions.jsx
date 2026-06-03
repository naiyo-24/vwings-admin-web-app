import React, { useState, useEffect } from 'react';
import { Check, X, FileText, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from '../components/DataTable';

import { useToast } from '../components/ToastContext';

const API_BASE_URL = 'https://appbackend.vwings247.me';

const Commissions = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('ledger');
  const [ledger, setLedger] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [selectedCounsellor, setSelectedCounsellor] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [referenceNo, setReferenceNo] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resLedger, resPayouts, resCounsellors] = await Promise.all([
        fetch(`${API_BASE_URL}/api/commissions/ledger`),
        fetch(`${API_BASE_URL}/api/commissions/payouts`),
        fetch(`${API_BASE_URL}/api/counsellors/get-all`)
      ]);

      if (resCounsellors.ok) setCounsellors(await resCounsellors.json());
      if (resLedger.ok) setLedger(await resLedger.json());
      if (resPayouts.ok) setPayouts(await resPayouts.json());
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (ledgerId, newStatus) => {
    try {
      await fetch(`${API_BASE_URL}/api/commissions/ledger/${ledgerId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGeneratePayout = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/commissions/payouts/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          counsellor_id: selectedCounsellor,
          payment_method: paymentMethod,
          reference_no: referenceNo
        })
      });
      if (res.ok) {
        setPayoutModalOpen(false);
        fetchData();
        toast.success("Payout generated successfully!");
      } else {
        const err = await res.json();
        toast.error(`Failed: ${err.detail}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Error: ${err.message || 'Something went wrong'}`);
    }
  };

  const getCounsellorName = (id) => {
    const c = counsellors.find(c => c.counsellor_id === id);
    return c ? c.full_name : id;
  };

  const ledgerColumns = [
    { header: 'Counsellor', accessor: 'counsellor_id', render: (row) => getCounsellorName(row.counsellor_id) },
    { header: 'Student ID', accessor: 'student_id' },
    { header: 'Amount', accessor: 'commission_amount', render: (row) => <strong style={{ color: 'var(--primary-yellow)' }}>₹{row.commission_amount}</strong> },
    {
      header: 'Status', accessor: 'status', render: (row) => {
        let color = '#ccc';
        if (row.status === 'Approved') color = '#4ade80';
        if (row.status === 'Paid') color = '#60a5fa';
        if (row.status === 'Hold') color = '#fbbf24';
        return <span style={{ color, fontWeight: 'bold' }}>{row.status}</span>;
      }
    },
    {
      header: 'Actions', accessor: 'actions', render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {row.status === 'Pending' && (
            <>
              <button onClick={() => handleUpdateStatus(row.id, 'Approved')} className="btn-primary" style={{ padding: '4px 8px', fontSize: '12px' }}>Approve</button>
              <button onClick={() => handleUpdateStatus(row.id, 'Hold')} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>Hold</button>
            </>
          )}
          {row.status === 'Hold' && (
            <button onClick={() => handleUpdateStatus(row.id, 'Approved')} className="btn-primary" style={{ padding: '4px 8px', fontSize: '12px' }}>Approve</button>
          )}
        </div>
      )
    }
  ];

  const payoutColumns = [
    { header: 'Payout No', accessor: 'payout_no' },
    { header: 'Counsellor', accessor: 'counsellor_id', render: (row) => getCounsellorName(row.counsellor_id) },
    { header: 'Amount', accessor: 'amount', render: (row) => <strong style={{ color: 'var(--primary-yellow)' }}>₹{row.amount}</strong> },
    { header: 'Method', accessor: 'payment_method' },
    { header: 'Reference', accessor: 'reference_no', render: (row) => row.reference_no || '-' },
    { header: 'Date', accessor: 'created_at', render: (row) => new Date(row.created_at).toLocaleDateString() }
  ];

  const selectedCounsellorData = counsellors.find(c => c.counsellor_id === selectedCounsellor);

  return (
    <div style={{ animation: 'slideUp 0.5s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Counsellor Commissions & Payouts</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className={`btn-${activeTab === 'ledger' ? 'primary' : 'secondary'}`} onClick={() => setActiveTab('ledger')}>Commission Ledger</button>
          <button className={`btn-${activeTab === 'payouts' ? 'primary' : 'secondary'}`} onClick={() => setActiveTab('payouts')}>Payouts</button>
        </div>
      </div>

      {activeTab === 'ledger' ? (
        <DataTable
          title="Commission Ledger"
          columns={ledgerColumns}
          data={ledger}
        />
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button className="btn-primary" onClick={() => setPayoutModalOpen(true)}>Generate Payout</button>
          </div>
          <DataTable
            title="Payouts History"
            columns={payoutColumns}
            data={payouts}
          />
        </div>
      )}

      <AnimatePresence>
        {payoutModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card" style={{ width: '100%', maxWidth: '500px', background: 'var(--background)' }}
            >
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Generate Payout</h3>
                <button onClick={() => setPayoutModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div style={{ padding: '32px' }}>
                <form id="payout-form" onSubmit={handleGeneratePayout} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="input-group">
                    <label>Counsellor *</label>
                    <select value={selectedCounsellor} onChange={e => setSelectedCounsellor(e.target.value)} required style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', color: 'var(--text-main)' }}>
                      <option value="">Select Counsellor</option>
                      {counsellors.map(c => (
                        <option key={c.counsellor_id} value={c.counsellor_id}>{c.full_name} ({c.counsellor_id})</option>
                      ))}
                    </select>
                  </div>

                  {selectedCounsellorData && (
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-main)', fontWeight: 'bold' }}>
                        <CreditCard size={16} /> Bank & Payment Details
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div><span style={{ opacity: 0.7 }}>A/C Name:</span> <br />{selectedCounsellorData.bank_account_name || 'N/A'}</div>
                        <div><span style={{ opacity: 0.7 }}>A/C No:</span> <br />{selectedCounsellorData.bank_account_no || 'N/A'}</div>
                        <div><span style={{ opacity: 0.7 }}>Bank & Branch:</span> <br />{selectedCounsellorData.branch_name || 'N/A'}</div>
                        <div><span style={{ opacity: 0.7 }}>IFSC:</span> <br />{selectedCounsellorData.ifsc_code || 'N/A'}</div>
                        <div style={{ gridColumn: '1 / -1' }}><span style={{ opacity: 0.7 }}>UPI ID:</span> <br />{selectedCounsellorData.upi_id || 'N/A'}</div>
                      </div>
                    </div>
                  )}
                  <div className="input-group">
                    <label>Payment Method *</label>
                    <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} required style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', color: 'var(--text-main)' }}>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Reference No (Optional)</label>
                    <input type="text" value={referenceNo} onChange={e => setReferenceNo(e.target.value)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', color: 'var(--text-main)' }} />
                  </div>
                </form>
              </div>
              <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                <button type="button" onClick={() => setPayoutModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" form="payout-form" className="btn-primary">Generate</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Commissions;
