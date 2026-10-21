import React from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  Zap,
  Trash2,
  TrendingDown,
  Trophy,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  BarChart3,
  Globe2,
  Sun,
  Flame,
  Award
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      {/* Top Header Navigation */}
      <header
        style={{
          borderBottom: '1px solid var(--border-light)',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          zIndex: 100
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <Leaf size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-800)', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
              EcoTrack
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Campus Sustainability Tracker
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/dashboard" className="btn btn-secondary">
            View Live Stats
          </Link>
          <Link to="/dashboard" className="btn btn-primary">
            <span>Access Dashboard</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: '5rem 2rem 4rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}
      >
        <div className="badge badge-success" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
          🌿 Higher Education Circular Campus Platform
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--primary-950)',
            maxWidth: '900px',
            lineHeight: 1.15
          }}
        >
          Build a Greener Campus Through Real Data & Climate Action
        </h1>

        <p
          style={{
            fontSize: '1.2rem',
            color: 'var(--text-muted)',
            maxWidth: '750px',
            lineHeight: 1.6
          }}
        >
          EcoTrack empowers universities to monitor building-level electricity, divert cafeteria waste into organic compost, quantify scope emissions, and mobilize thousands of students through gamified green challenges.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
          <Link to="/dashboard" className="btn btn-primary btn-lg">
            <span>Explore Campus Dashboard</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/challenges" className="btn btn-secondary btn-lg">
            <span>Join Student Quests</span>
          </Link>
        </div>

        {/* Live Metrics Showcase Banner */}
        <div
          className="card"
          style={{
            marginTop: '3.5rem',
            width: '100%',
            padding: '2rem',
            backgroundColor: 'var(--primary-50)',
            border: '1.5px solid var(--primary-200)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            textAlign: 'left'
          }}
        >
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-800)', fontWeight: 700, textTransform: 'uppercase' }}>
              Campus Energy
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-900)', marginTop: '4px' }}>
              31,150 <span style={{ fontSize: '1rem', fontWeight: 600 }}>kWh/mo</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-700)' }}>12.4% reduction achieved</span>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-800)', fontWeight: 700, textTransform: 'uppercase' }}>
              Waste Diversion Rate
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-900)', marginTop: '4px' }}>
              69.8%
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-700)' }}>Target 60% surpassed!</span>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-800)', fontWeight: 700, textTransform: 'uppercase' }}>
              Estimated Carbon
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-900)', marginTop: '4px' }}>
              27.8 <span style={{ fontSize: '1rem', fontWeight: 600 }}>tCO2e</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-700)' }}>Scope 2 & 3 baseline</span>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-800)', fontWeight: 700, textTransform: 'uppercase' }}>
              Active Student Pledges
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-900)', marginTop: '4px' }}>
              1,340+
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-700)' }}>Across 5 dormitories</span>
          </div>
        </div>
      </section>

      {/* Core Features Breakdown */}
      <section style={{ backgroundColor: 'var(--bg-main)', padding: '5rem 2rem', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Comprehensive Campus Sustainability Infrastructure
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
              Everything needed to measure, optimize, and celebrate environmental stewardship
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className="card card-hover">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Electricity Monitoring</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Track monthly consumption across science complexes, libraries, engineering labs, and dorms with interactive trends.
              </p>
            </div>

            <div className="card card-hover">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Trash2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Waste & Recycling Streams</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Category-specific logs for organic compost, paper, plastics, and metals. Prevents accounting errors with automatic diversion calculations.
              </p>
            </div>

            <div className="card card-hover">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.15)', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <BarChart3 size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>GHG Footprint Simulator</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Standardized GHG protocol calculator with configurable utility grid factors. Distinguishes actual measurements from models.
              </p>
            </div>

            <div className="card card-hover">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(225, 29, 72, 0.15)', color: '#be123c', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Trophy size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Student Green Gamification</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Turn sustainability pledges into points, badges, and healthy dorm rivalries with verified anti-abuse reward mechanics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Development Goals (SDG) Alignment Section */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Global Agenda</div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Aligned with UN Sustainable Development Goals</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>
            EcoTrack directly maps university operations to international United Nations 2030 targets
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ borderLeft: '5px solid #f59e0b' }}>
            <span className="badge badge-warning" style={{ fontSize: '0.8rem' }}>SDG 7</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.75rem' }}>Affordable & Clean Energy</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              Target 7.3: Double the global rate of improvement in energy efficiency. EcoTrack monitors facility energy intensity and tracks rooftop solar contribution across all campus buildings.
            </p>
          </div>

          <div className="card" style={{ borderLeft: '5px solid #0d9488' }}>
            <span className="badge badge-info" style={{ fontSize: '0.8rem' }}>SDG 11</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.75rem' }}>Sustainable Cities & Communities</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              Target 11.6: Reduce adverse per-capita environmental impact through municipal solid waste management, vermicomposting cafeteria food waste, and green shuttle transit.
            </p>
          </div>

          <div className="card" style={{ borderLeft: '5px solid #10b981' }}>
            <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>SDG 13</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.75rem' }}>Climate Action</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              Target 13.3: Improve education, awareness, and institutional capacity on climate mitigation. The platform empowers students through behavioral change challenges and transparent emissions calculators.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--primary-950)', color: '#fff', padding: '3.5rem 2rem 2rem 2rem', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Leaf size={24} color="var(--primary-400)" />
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>EcoTrack</span>
              </div>
              <p style={{ color: 'var(--primary-200)', fontSize: '0.875rem', marginTop: '0.75rem', maxWidth: '380px', lineHeight: 1.6 }}>
                Campus Sustainability Management Platform. Built for universities pursuing Net-Zero carbon neutrality and zero-waste status.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-400)', textTransform: 'uppercase' }}>Modules</span>
                <ul style={{ listStyle: 'none', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--primary-100)' }}>
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li><Link to="/energy">Energy Metering</Link></li>
                  <li><Link to="/waste">Waste Diversion</Link></li>
                  <li><Link to="/calculator">Carbon Calculator</Link></li>
                </ul>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-400)', textTransform: 'uppercase' }}>Community</span>
                <ul style={{ listStyle: 'none', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--primary-100)' }}>
                  <li><Link to="/challenges">Green Challenges</Link></li>
                  <li><Link to="/suggestions">Ideas & Feedback</Link></li>
                  <li><Link to="/reports">Audits & Reports</Link></li>
                  <li><Link to="/profile">Student Profile</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--primary-300)', flexWrap: 'wrap', gap: '1rem' }}>
            <span>© 2026 EcoTrack Campus Sustainability. Open source educational edition.</span>
            <span>Supporting SDG 7, 11 & 13 Climate Alignment.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
