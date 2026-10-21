import React, { useState, useEffect } from 'react';
import {
  Zap,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  TrendingDown,
  Building,
  Calendar,
  AlertCircle
} from 'lucide-react';
import Modal from '../components/Modal';
import { storageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatNumber } from '../utils/calculations';

export default function EnergyMonitoring() {
  const { isAdmin } = useAuth();
  const { addToast } = useToast();

  const [records, setRecords] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBuilding, setFilterBuilding] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    building: '',
    date: new Date().toISOString().split('T')[0],
    consumptionKWh: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const energyData = storageService.getEnergyRecords();
    const bldgs = storageService.getBuildings();
    setRecords(energyData);
    setBuildings(bldgs);
    if (bldgs.length > 0 && !formData.building) {
      setFormData((prev) => ({ ...prev, building: bldgs[0] }));
    }
  };

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setFormData({
      building: buildings[0] || '',
      date: new Date().toISOString().split('T')[0],
      consumptionKWh: '',
      notes: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rec) => {
    setEditingRecord(rec);
    setFormData({
      building: rec.building,
      date: rec.date,
      consumptionKWh: rec.consumptionKWh,
      notes: rec.notes || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (!isAdmin) {
      addToast('Administrator privileges required to delete records', 'error');
      return;
    }
    if (window.confirm('Are you sure you want to delete this energy record?')) {
      const updated = storageService.deleteEnergyRecord(id);
      setRecords(updated);
      addToast('Electricity record deleted successfully', 'success');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.building) errors.building = 'Building selection is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.consumptionKWh || isNaN(formData.consumptionKWh) || Number(formData.consumptionKWh) <= 0) {
      errors.consumptionKWh = 'Valid positive electricity value (kWh) is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      consumptionKWh: Number(formData.consumptionKWh),
      id: editingRecord ? editingRecord.id : undefined,
      recordedBy: isAdmin ? 'Dr. Evelyn Vance (Admin)' : 'Student Representative'
    };

    const updated = storageService.saveEnergyRecord(payload);
    setRecords(updated);
    setIsModalOpen(false);
    addToast(editingRecord ? 'Energy record updated!' : 'New energy measurement recorded!', 'success');
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Record ID', 'Building', 'Date', 'Consumption (kWh)', 'Notes', 'Is Sample'];
    const rows = filteredRecords.map((r) => [
      r.id,
      `"${r.building}"`,
      r.date,
      r.consumptionKWh,
      `"${r.notes || ''}"`,
      r.isSample ? 'Yes' : 'No'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecotrack_energy_records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Energy records CSV downloaded', 'success');
  };

  // Filter & Search
  const filteredRecords = records.filter((r) => {
    const matchSearch =
      r.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchBuilding = filterBuilding === 'ALL' || r.building === filterBuilding;
    return matchSearch && matchBuilding;
  });

  const totalFilteredKWh = filteredRecords.reduce((acc, c) => acc + Number(c.consumptionKWh), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Campus Energy Monitoring</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Track building-level electricity consumption (kWh), trends, and metering logs
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={handleExportCSV} className="btn btn-secondary">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          {isAdmin && (
            <button onClick={handleOpenAdd} className="btn btn-primary">
              <Plus size={16} />
              <span>Record Electricity Log</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Band */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Filtered Total Consumption
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#b45309', marginTop: '0.25rem' }}>
            {formatNumber(totalFilteredKWh)} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kWh</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Across {filteredRecords.length} recorded meters</span>
        </div>

        <div className="card" style={{ padding: '1.1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Average Per Record
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-700)', marginTop: '0.25rem' }}>
            {filteredRecords.length > 0 ? formatNumber(Math.round(totalFilteredKWh / filteredRecords.length)) : 0}{' '}
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kWh</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly meter benchmark</span>
        </div>

        <div className="card" style={{ padding: '1.1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Target Alignment
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '0.25rem' }}>
            -12.4%
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Under campus target ceiling</span>
        </div>
      </div>

      {/* Filters & Table Card */}
      <div className="card" style={{ padding: 0 }}>
        {/* Controls Toolbar */}
        <div
          style={{
            padding: '1.25rem',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px', maxWidth: '400px', background: 'var(--bg-main)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <Search size={16} color="var(--text-subtle)" />
            <input
              type="text"
              placeholder="Search by building or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', padding: 0, fontSize: '0.85rem' }}
            />
          </div>

          {/* Building Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              value={filterBuilding}
              onChange={(e) => setFilterBuilding(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}
            >
              <option value="ALL">All Buildings</option>
              {buildings.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead style={{ backgroundColor: 'var(--bg-subtle)' }}>
              <tr style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Building / Facility</th>
                <th style={{ padding: '0.85rem 1rem' }}>Date</th>
                <th style={{ padding: '0.85rem 1rem' }}>Consumption</th>
                <th style={{ padding: '0.85rem 1rem' }}>Logged Notes</th>
                <th style={{ padding: '0.85rem 1rem' }}>Data Origin</th>
                {isAdmin && <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{r.building}</td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>{r.date}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#b45309' }}>
                      {formatNumber(r.consumptionKWh)} kWh
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', maxWidth: '280px' }}>
                      {r.notes || '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge ${r.isSample ? 'badge-neutral' : 'badge-success'}`}>
                        {r.isSample ? 'Sample Data' : 'Live Field Log'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleOpenEdit(r)}
                            className="btn btn-secondary btn-sm"
                            title="Edit Record"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="btn btn-danger btn-sm"
                            title="Delete Record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No electricity consumption records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Energy Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRecord ? 'Edit Energy Record' : 'Record New Electricity Measurement'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
              Building / Facility *
            </label>
            <select
              value={formData.building}
              onChange={(e) => setFormData({ ...formData, building: e.target.value })}
            >
              {buildings.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            {formErrors.building && <p style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '2px' }}>{formErrors.building}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
              Reporting Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            {formErrors.date && <p style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '2px' }}>{formErrors.date}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
              Electricity Consumed (kWh) *
            </label>
            <input
              type="number"
              placeholder="e.g. 6400"
              step="any"
              value={formData.consumptionKWh}
              onChange={(e) => setFormData({ ...formData, consumptionKWh: e.target.value })}
            />
            {formErrors.consumptionKWh && <p style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '2px' }}>{formErrors.consumptionKWh}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
              Operational Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g., Solar supplement operational, HVAC schedule adjusted..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingRecord ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
