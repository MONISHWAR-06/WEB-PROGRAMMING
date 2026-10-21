import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  Trash2,
  Calculator,
  Trophy,
  MessageSquarePlus,
  FileBarChart,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Leaf
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { isAdmin, currentUser } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/energy', label: 'Energy Monitoring', icon: Zap },
    { to: '/waste', label: 'Waste & Recycling', icon: Trash2 },
    { to: '/calculator', label: 'Carbon Calculator', icon: Calculator },
    { to: '/challenges', label: 'Green Challenges', icon: Trophy },
    { to: '/suggestions', label: 'Suggestions & Ideas', icon: MessageSquarePlus },
    { to: '/reports', label: 'Reports & Analytics', icon: FileBarChart },
    { to: '/profile', label: 'My Eco Profile', icon: User },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin Hub', icon: Settings }] : [])
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 998
          }}
        />
      )}

      <aside
        style={{
          width: collapsed ? '80px' : '260px',
          minWidth: collapsed ? '80px' : '260px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width var(--transition-normal)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 999
        }}
        className={`sidebar ${mobileOpen ? 'mobile-visible' : ''}`}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.25rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            borderBottom: '1px solid var(--border-light)',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 10px rgba(13, 105, 69, 0.25)',
                flexShrink: 0
              }}
            >
              <Leaf size={22} />
            </div>
            {!collapsed && (
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: 'var(--primary-800)',
                    display: 'block',
                    lineHeight: 1.1
                  }}
                >
                  EcoTrack
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-subtle)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  Campus Sustainability
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="no-mobile"
            style={{
              padding: '6px',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-light)',
              display: collapsed ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Collapsed re-expand button */}
        {collapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 0' }}>
            <button
              onClick={() => setCollapsed(false)}
              style={{
                padding: '6px',
                borderRadius: '8px',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-light)'
              }}
              title="Expand sidebar"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: collapsed ? '0.75rem' : '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--primary-700)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.9rem',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  transition: 'all var(--transition-fast)'
                })}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={19} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Current User Badge Footer */}
        <div
          style={{
            padding: '1rem 0.75rem',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--primary-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                border: '1px solid var(--primary-300)',
                flexShrink: 0
              }}
            >
              {currentUser?.avatar || '👤'}
            </div>
            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {currentUser?.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className={`badge ${isAdmin ? 'badge-role-admin' : 'badge-role-student'}`} style={{ padding: '1px 6px', fontSize: '0.68rem' }}>
                    {isAdmin ? 'Administrator' : 'Student'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
