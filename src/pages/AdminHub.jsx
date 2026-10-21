import React, { useState } from 'react';
import {
  Settings,
  Target,
  Sliders,
  RefreshCw,
  Save,
  CheckCircle,
  Database,
  Building2,
  Users
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AdminHub() {
  const { isAdmin } = useAuth();
  const { addToast } = useToast();

  const [targets, setTargets] = useState(storageService.getTargets());
  const [factors, setFactors] = useState(storageService.getEmissionFactors());

  if (!isAdmin) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#dc2626' }}>Access Restricted</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          This hub is restricted to Administrator personnel. Please toggle to "Admin" mode in the top navbar.
        </p>
      </div>
    );
  }

  const handleSaveTargets = (e) => {
    e.preventDefault();
    storageService.saveTargets(targets);
    addToast('Campus sustainability baseline & targets updated!', 'success');
  };

  const handleSaveFactors = (e) => {
    e.preventDefault();
    storageService.saveEmissionFactors(factors);
    addToast('Carbon emission factors saved into database!', 'success');
  };

  const handleFullReset = () => {
    if (window.confirm('Reset all campus database collections to initial sample datasets?')) {
      storageService.resetToSampleData();
      addToast('All database records reset to demo baseline', 'success');
      setTimeout(() => window.location.reload(), 400);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Campus Sustainability Administration Hub</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Configure baseline targets, greenhouse gas emission factors, and manage database stores
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Targets Configuration Form */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Target size={20} color="var(--primary-600)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Campus Baseline & Targets</h3>
          </div>

          <form onSubmit={handleSaveTargets} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Monthly Electricity Baseline (kWh)
              </label>
              <input
                type="number"
                value={targets.baselineElectricityMonthlyKWh}
                onChange={(e) => setTargets({ ...targets, baselineElectricityMonthlyKWh: Number(e.target.value) })}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Historical campus average prior to conservation drives</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Electricity Reduction Goal (%)
              </label>
              <input
                type="number"
                value={targets.targetElectricityReductionPct}
                onChange={(e) => setTargets({ ...targets, targetElectricityReductionPct: Number(e.target.value) })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Campus Recycling Diversion Target (%)
              </label>
              <input
                type="number"
                value={targets.targetRecyclingRatePct}
                onChange={(e) => setTargets({ ...targets, targetRecyclingRatePct: Number(e.target.value) })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Monthly Waste Generation Ceiling (kg)
              </label>
              <input
                type="number"
                value={targets.baselineMonthlyWasteKg}
                onChange={(e) => setTargets({ ...targets, baselineMonthlyWasteKg: Number(e.target.value) })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <Save size={16} />
              <span>Save Campus Targets</span>
            </button>
          </form>
        </div>

        {/* GHG Emission Factor Coefficients */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Sliders size={20} color="#2563eb" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Emission Factor Coefficients</h3>
          </div>

          <form onSubmit={handleSaveFactors} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Grid Electricity Factor (kg CO2e / kWh)
              </label>
              <input
                type="number"
                step="0.001"
                value={factors.electricityFactor}
                onChange={(e) => setFactors({ ...factors, electricityFactor: Number(e.target.value) })}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Regional subgrid utility emissions benchmark</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Landfill Solid Waste Factor (kg CO2e / kg)
              </label>
              <input
                type="number"
                step="0.01"
                value={factors.wasteLandfillFactor}
                onChange={(e) => setFactors({ ...factors, wasteLandfillFactor: Number(e.target.value) })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Campus Bus Factor (kg CO2e / p-km)
              </label>
              <input
                type="number"
                step="0.001"
                value={factors.transportBusFactor}
                onChange={(e) => setFactors({ ...factors, transportBusFactor: Number(e.target.value) })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Coefficient Registry Notes
              </label>
              <input
                type="text"
                value={factors.notes}
                onChange={(e) => setFactors({ ...factors, notes: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <Save size={16} />
              <span>Update Emission Factors</span>
            </button>
          </form>
        </div>
      </div>

      {/* Database State & Maintenance */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} color="var(--primary-600)" />
            <span>Database & Demo Reset</span>
          </h4>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Restore default sample dataset records across energy, waste, challenges, and suggestion modules.
          </p>
        </div>

        <button onClick={handleFullReset} className="btn btn-danger">
          <RefreshCw size={15} />
          <span>Reset Demo Database to Factory Baseline</span>
        </button>
      </div>
    </div>
  );
}
