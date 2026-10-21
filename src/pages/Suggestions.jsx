import React, { useState, useEffect } from 'react';
import {
  MessageSquarePlus,
  Plus,
  Clock,
  MapPin,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Send,
  Filter
} from 'lucide-react';
import Modal from '../components/Modal';
import { storageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const STATUS_COLORS = {
  Submitted: 'badge-neutral',
  'Under Review': 'badge-warning',
  Approved: 'badge-info',
  Implemented: 'badge-success'
};

export default function Suggestions() {
  const { isAdmin, currentUser } = useAuth();
  const { addToast } = useToast();

  const [suggestions, setSuggestions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Suggestion Form
  const [formData, setFormData] = useState({
    title: '',
    category: 'Waste Reduction',
    location: '',
    description: ''
  });

  // Admin Review Modal
  const [reviewingItem, setReviewingItem] = useState(null);
  const [adminStatus, setAdminStatus] = useState('Under Review');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSuggestions(storageService.getSuggestions());
  };

  const handleSubmitSuggestion = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      addToast('Title and description are required', 'error');
      return;
    }

    const payload = {
      ...formData,
      submittedBy: `${currentUser.name} (${isAdmin ? 'Admin' : 'Student'})`
    };

    const updated = storageService.saveSuggestion(payload);
    setSuggestions(updated);
    setIsModalOpen(false);
    setFormData({
      title: '',
      category: 'Waste Reduction',
      location: '',
      description: ''
    });
    addToast('Your sustainability proposal has been submitted to campus administration!', 'success');
  };

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (!reviewingItem) return;

    const updatedItem = {
      ...reviewingItem,
      status: adminStatus,
      adminNotes: adminNotes
    };

    const updated = storageService.saveSuggestion(updatedItem);
    setSuggestions(updated);
    setReviewingItem(null);
    addToast(`Proposal updated to status: ${adminStatus}`, 'success');
  };

  const filtered = suggestions.filter((s) => {
    return filterStatus === 'ALL' || s.status === filterStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Campus Green Suggestions & Ideas</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Empowering students and faculty to propose campus environmental improvements and circular initiatives
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Submit Green Proposal</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
        {['ALL', 'Submitted', 'Under Review', 'Approved', 'Implemented'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: filterStatus === status ? 'var(--primary-700)' : 'var(--bg-card)',
              color: filterStatus === status ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border-light)',
              transition: 'all var(--transition-fast)'
            }}
          >
            {status === 'ALL' ? 'All Proposals' : status}
          </button>
        ))}
      </div>

      {/* Suggestions List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            className="card card-hover"
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span className={`badge ${STATUS_COLORS[item.status] || 'badge-neutral'}`}>
                  {item.status}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                  {item.submittedDate}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.75rem' }}>
                {item.title}
              </h3>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                <span className="badge badge-neutral" style={{ padding: '2px 6px' }}>{item.category}</span>
                {item.location && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <MapPin size={13} /> {item.location}
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.75rem', lineHeight: 1.5 }}>
                {item.description}
              </p>

              {item.adminNotes && (
                <div style={{ marginTop: '0.85rem', padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--primary-600)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-800)', display: 'block', textTransform: 'uppercase' }}>
                    Sustainability Committee Note:
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '2px' }}>
                    {item.adminNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Footer with Submitter & Admin Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                By: {item.submittedBy}
              </span>

              {isAdmin && (
                <button
                  onClick={() => {
                    setReviewingItem(item);
                    setAdminStatus(item.status);
                    setAdminNotes(item.adminNotes || '');
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.78rem' }}
                >
                  Manage Status
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Submit Suggestion */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Campus Sustainability Suggestion"
      >
        <form onSubmit={handleSubmitSuggestion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
              Suggestion Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Add compost caddies to dormitory kitchenettes"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Waste Reduction">Waste Reduction</option>
                <option value="Energy Conservation">Energy Conservation</option>
                <option value="Water & Facilities">Water & Facilities</option>
                <option value="Clean Energy">Clean Energy</option>
                <option value="Biodiversity & Greenery">Biodiversity & Greenery</option>
                <option value="Social Impact">Social Impact</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Campus Location (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Science Quad, Cafeteria"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
              Detailed Description & Impact *
            </label>
            <textarea
              rows={4}
              placeholder="Explain how this initiative will reduce footprint, save energy, or improve student awareness..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Send size={15} />
              <span>Submit Proposal</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Admin Manage Status */}
      <Modal
        isOpen={Boolean(reviewingItem)}
        onClose={() => setReviewingItem(null)}
        title="Review & Update Proposal Status"
      >
        <form onSubmit={handleUpdateStatus} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
              Proposal Status
            </label>
            <select
              value={adminStatus}
              onChange={(e) => setAdminStatus(e.target.value)}
            >
              <option value="Submitted">Submitted (Under initial triage)</option>
              <option value="Under Review">Under Review (Committee evaluating)</option>
              <option value="Approved">Approved (Slated for execution)</option>
              <option value="Implemented">Implemented (Operational on campus)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
              Administrative Feedback / Notes
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Budget approved for Q1 2027 rollout..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setReviewingItem(null)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Decision
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
