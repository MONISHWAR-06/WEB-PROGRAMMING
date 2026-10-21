import React from 'react';
import { Menu, ShieldAlert, UserCheck, RefreshCw, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { storageService } from '../services/storageService';

export default function TopNavbar({ setMobileOpen, onDataMutated }) {
  const { currentUser, isAdmin, switchRole } = useAuth();
  const { addToast } = useToast();

  const handleResetData = () => {
    if (window.confirm('Reset all campus sustainability data to default realistic demo records?')) {
      storageService.resetToSampleData();
      addToast('Campus data restored to original demo baseline', 'success');
      if (onDataMutated) onDataMutated();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <header
      className="navbar-top"
      style={{
        height: '68px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-light)',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 900
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            display: 'none',
            padding: '8px',
            borderRadius: '8px',
            color: 'var(--text-main)',
            border: '1px solid var(--border-light)'
          }}
          className="mobile-hamburger"
          title="Open menu"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Academic Year 2026-2027
          </span>
          <span className="badge badge-success">Live Session</span>
        </div>
      </div>

      {/* Role Switcher & Evaluation Demo Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Role Toggle Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)'
          }}
        >
          <button
            onClick={() => {
              switchRole('admin');
              addToast('Switched to Administrator view (Full access)', 'info');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 600,
              backgroundColor: isAdmin ? '#ffffff' : 'transparent',
              color: isAdmin ? '#9d174d' : 'var(--text-muted)',
              boxShadow: isAdmin ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <ShieldAlert size={14} />
            <span>Admin</span>
          </button>

          <button
            onClick={() => {
              switchRole('student');
              addToast('Switched to Student view (Participation & Challenges)', 'info');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 600,
              backgroundColor: !isAdmin ? '#ffffff' : 'transparent',
              color: !isAdmin ? 'var(--primary-700)' : 'var(--text-muted)',
              boxShadow: !isAdmin ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <UserCheck size={14} />
            <span>Student</span>
          </button>
        </div>

        {/* Reset Demo Data Button */}
        <button
          onClick={handleResetData}
          className="btn btn-secondary btn-sm"
          title="Reset sample data"
          style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
        >
          <RefreshCw size={13} />
          <span className="hide-on-mobile">Reset Demo Data</span>
        </button>
      </div>
    </header>
  );
}
