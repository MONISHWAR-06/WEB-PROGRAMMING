import React, { useState, useEffect } from 'react';
import {
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Recycle,
  CheckCircle,
  AlertTriangle,
  Building,
  Calendar
} from 'lucide-react';
import Modal from '../components/Modal';
import { storageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatNumber, calculateWasteTotals } from '../utils/calculations';

const CATEGORIES = [
  { value: 'organic', label: 'Organic / Food Waste' },
  { value: 'paper', label: 'Paper & Cardboard' },
  { value: 'plastic', label: 'Plastic (PET / HDPE)' },
  { value: 'metal', label: 'Metal / Scrap' },
  { value: 'glass', label: 'Glass Containers' },
  { value: 'other', label: 'Other / Non-recyclable' }
];

export default function WasteManagement() {
  const { isAdmin } = useAuth();
  const { addToast } = useToast();

  const [records, setRecords] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterBuilding, setFilterBuilding] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    building: '',
    date: new Date().toISOString().split('T')[0],
    category: 'plastic',
    totalWasteKg: '',
    recycledKg: '',
    disposalMethod: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const wasteData = storageService.getWasteRecords();
    const bldgs = storageService.getBuildings();
    setRecords(wasteData);
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
      category: 'plastic',
      totalWasteKg: '',
      recycledKg: '',
      disposalMethod: 'Materials Recovery Facility (MRF)',
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
      category: rec.category,
      totalWasteKg: rec.totalWasteKg,
      recycledKg: rec.recycledKg,
      disposalMethod: rec.disposalMethod || '',
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
    if (window.confirm('Delete this waste & recycling record?')) {
      const updated = storageService.deleteWasteRecord(id);
      setRecords(updated);
      addToast('Waste entry deleted successfully', 'success');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.building) errors.building = 'Building selection is required';
    if (!formData.date) errors.date = 'Date is required';

    const total = Number(formData.totalWasteKg);
    const recycled = Number(formData.recycledKg);

    if (!formData.totalWasteKg || isNaN(total) || total <= 0) {
      errors.totalWasteKg = 'Valid positive total waste (kg) is required';
    }

    if (formData.recycledKg === '' || isNaN(recycled) || recycled < 0) {
      errors.recycledKg = 'Recycled waste must be 0 or greater';
    } else if (recycled > total) {
      errors.recycledKg = 'Recycled waste cannot exceed total waste generated!';
    }

    if (!formData.disposalMethod.trim()) {
      errors.disposalMethod = 'Disposal / Processing method is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      totalWasteKg: Number(formData.totalWasteKg),
      recycledKg: Number(formData.recycledKg),
      id: editingRecord ? editingRecord.id : undefined,
      recordedBy: isAdmin ? 'Dr. Evelyn Vance (Admin)' : 'Student Representative'
    };

    const updated = storageService.saveWasteRecord(payload);
    setRecords(updated);
    setIsModalOpen(false);
    addToast(editingRecord ? 'Waste record updated!' : 'New waste log saved successfully!', 'success');
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Record ID', 'Building', 'Date', 'Category', 'Total Waste (kg)', 'Recycled (kg)', 'Recycling %', 'Disposal Method', 'Notes'];
    const rows = filteredRecords.map((r) => {
      const pct = r.totalWasteKg > 0 ? Math.round((r.recycledKg / r.totalWasteKg) * 100) : 0;
      return [
        r.id,
        `"${r.building}"`,
        r.date,
        r.category,
        r.totalWasteKg,
        r.recycledKg,
        `${pct}%`,
        `"${r.disposalMethod || ''}"`,
        `"${r.notes || ''}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecotrack_waste_records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Waste records CSV downloaded', 'success');
  };

  // Filter & Search
  const filteredRecords = records.filter((r) => {
    const matchSearch =
      r.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCategory = filterCategory === 'ALL' || r.category === filterCategory;
    const matchBuilding = filterBuilding === 'ALL' || r.building === filterBuilding;
    return matchSearch && matchCategory && matchBuilding;
  });

  const totals = calculateWasteTotals(filteredRecords);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Waste & Recycling Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Track waste generation streams, recycling diversion percentages, and composting initiatives
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
              <span>Record Waste Log</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Band */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Waste Generated
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#dc2626', marginTop: '0.25rem' }}>
            {formatNumber(totals.totalWasteKg)} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kg</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Across active campus collection points</span>
        </div>

        <div className="card" style={{ padding: '1.1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Diverted / Recycled
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-700)', marginTop: '0.25rem' }}>
            {formatNumber(totals.totalRecycledKg)} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kg</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kept out of municipal landfills</span>
        </div>

        <div className="card" style={{ padding: '1.1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Current Diversion Rate
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0d9488', marginTop: '0.25rem' }}>
            {totals.recyclingPercentage}%
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Campus Target: 60.0%</span>
        </div>
      </div>

      {/* Table & Filtering */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px', maxWidth: '360px', background: 'var(--bg-main)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <Search size={16} color="var(--text-subtle)" />
            <input
              type="text"
              placeholder="Search category, facility, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', padding: 0, fontSize: '0.85rem' }}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}
            >
              <option value="ALL">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>

            <select
              value={filterBuilding}
              onChange={(e) => setFilterBuilding(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}
            >
              <option value="ALL">All Facilities</option>
              {buildings.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Waste Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead style={{ backgroundColor: 'var(--bg-subtle)' }}>
              <tr style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                <th style={{ padding: '0.85rem 1rem' }}>Location</th>
                <th style={{ padding: '0.85rem 1rem' }}>Date</th>
                <th style={{ padding: '0.85rem 1rem' }}>Generated</th>
                <th style={{ padding: '0.85rem 1rem' }}>Recycled / Diverted</th>
                <th style={{ padding: '0.85rem 1rem' }}>Diversion %</th>
                <th style={{ padding: '0.85rem 1rem' }}>Processing Facility</th>
                {isAdmin && <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => {
                  const pct = r.totalWasteKg > 0 ? Math.round((r.recycledKg / r.totalWasteKg) * 100) : 0;
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>
                          {r.category}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{r.building}</td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>{r.date}</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#b91c1c' }}>
                        {formatNumber(r.totalWasteKg)} kg
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--primary-700)' }}>
                        {formatNumber(r.recycledKg)} kg
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: pct >= 60 ? '#15803d' : pct >= 30 ? '#b45309' : '#b91c1c'
                          }}
                        >
                          {pct}%
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                        {r.disposalMethod || 'Standard Processing'}
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No waste or recycling records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Waste Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRecord ? 'Edit Waste Record' : 'Record Waste & Recycling Stream'}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                Waste Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Total Waste Generated (kg) *
              </label>
              <input
                type="number"
                placeholder="e.g. 1200"
                step="any"
                value={formData.totalWasteKg}
                onChange={(e) => setFormData({ ...formData, totalWasteKg: e.target.value })}
              />
              {formErrors.totalWasteKg && <p style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '2px' }}>{formErrors.totalWasteKg}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Waste Recycled (kg) *
              </label>
              <input
                type="number"
                placeholder="e.g. 850"
                step="any"
                value={formData.recycledKg}
                onChange={(e) => setFormData({ ...formData, recycledKg: e.target.value })}
              />
              {formErrors.recycledKg && <p style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '2px' }}>{formErrors.recycledKg}</p>}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
              Disposal / Diversion Method *
            </label>
            <input
              type="text"
              placeholder="e.g. Materials Recovery Facility (MRF), Campus Composter"
              value={formData.disposalMethod}
              onChange={(e) => setFormData({ ...formData, disposalMethod: e.target.value })}
            />
            {formErrors.disposalMethod && <p style={{ color: '#dc2626', fontSize: '0.78rem', marginTop: '2px' }}>{formErrors.disposalMethod}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
              Operational Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Verified weighing scale slip attached..."
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
