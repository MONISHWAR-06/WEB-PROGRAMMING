import React from 'react';

export default function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendLabel,
  color = 'primary',
  subtext
}) {
  const colorMap = {
    primary: {
      bg: 'var(--primary-50)',
      text: 'var(--primary-700)',
      border: 'var(--primary-200)',
      iconBg: 'rgba(16, 163, 104, 0.15)'
    },
    amber: {
      bg: '#fffbeb',
      text: '#b45309',
      border: '#fde68a',
      iconBg: 'rgba(245, 158, 11, 0.15)'
    },
    blue: {
      bg: '#eff6ff',
      text: '#1d4ed8',
      border: '#bfdbfe',
      iconBg: 'rgba(37, 99, 235, 0.15)'
    },
    emerald: {
      bg: '#ecfdf5',
      text: '#047857',
      border: '#a7f3d0',
      iconBg: 'rgba(16, 185, 129, 0.15)'
    },
    rose: {
      bg: '#fff1f2',
      text: '#be123c',
      border: '#fecdd3',
      iconBg: 'rgba(225, 29, 72, 0.15)'
    }
  };

  const scheme = colorMap[color] || colorMap.primary;

  return (
    <div
      className="card card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {title}
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.25rem' }}>
            <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {value}
            </h3>
            {unit && (
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {unit}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: scheme.iconBg,
              color: scheme.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Icon size={24} />
          </div>
        )}
      </div>

      {(trend || subtext) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
          {trend && (
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: trend.startsWith('-') ? '#16a34a' : '#dc2626',
                backgroundColor: trend.startsWith('-') ? '#dcfce7' : '#fee2e2',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              {trend}
            </span>
          )}
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {trendLabel || subtext}
          </span>
        </div>
      )}
    </div>
  );
}
