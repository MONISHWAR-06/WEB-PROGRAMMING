import React, { useState, useEffect } from 'react';
import {
  FileBarChart,
  Printer,
  Download,
  Calendar,
  Building,
  CheckCircle,
  TrendingDown,
  Zap,
  Trash2,
  Leaf
} from 'lucide-react';
import { storageService } from '../services/storageService';
import {
  calculateTotalElectricity,
  calculateWasteTotals,
  calculateEstimatedEmissions,
  calculateSustainabilityScore,
  formatNumber
} from '../utils/calculations';
import { useToast } from '../context/ToastContext';

export default function Reports() {
  const { addToast } = useToast();
  const [energyRecords, setEnergyRecords] = useState([]);
  const [wasteRecords, setWasteRecords] = useState([]);
  const [targets, setTargets] = useState({});
  const [factors, setFactors] = useState({});
  const [period, setPeriod] = useState('ALL');

  useEffect(() => {
    setEnergyRecords(storageService.getEnergyRecords());
    setWasteRecords(storageService.getWasteRecords());
    setTargets(storageService.getTargets());
    setFactors(storageService.getEmissionFactors());
  }, []);

  const filteredEnergy = energyRecords.filter((r) => period === 'ALL' || r.date.startsWith(period));
  const filteredWaste = wasteRecords.filter((r) => period === 'ALL' || r.date.startsWith(period));

  const totalElectricity = calculateTotalElectricity(filteredEnergy);
  const wasteTotals = calculateWasteTotals(filteredWaste);
  const emissions = calculateEstimatedEmissions(filteredEnergy, filteredWaste, factors);
  const score = calculateSustainabilityScore({
    energyRecords: filteredEnergy,
    wasteRecords: filteredWaste,
    targets
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportFullCSV = () => {
    const energyRows = filteredEnergy.map((e) => [
      'ENERGY',
      e.id,
      `"${e.building}"`,
      e.date,
      e.consumptionKWh,
      'N/A',
      'N/A',
      `"${e.notes || ''}"`
    ]);

    const wasteRows = filteredWaste.map((w) => [
      'WASTE',
      w.id,
      `"${w.building}"`,
      w.date,
      'N/A',
      w.totalWasteKg,
      w.recycledKg,
      `"${w.category} - ${w.disposalMethod || ''}"`
    ]);

    const headers = ['Record Type', 'ID', 'Building', 'Date', 'Electricity (kWh)', 'Waste Total (kg)', 'Recycled (kg)', 'Notes / Category'];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...energyRows.map((r) => r.join(',')), ...wasteRows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecotrack_comprehensive_report_${period}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Comprehensive Campus Report CSV Exported', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header & Controls */}
      <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Campus Sustainability Audits & Reports</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Official reporting packages, verification audits, and printable campus environmental dossiers
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ width: 'auto', padding: '0.6rem 0.9rem', fontSize: '0.85rem' }}
          >
            <option value="ALL">Entire Academic Year (All Quarters)</option>
            <option value="2026-09">September 2026 Audit</option>
            <option value="2026-08">August 2026 Audit</option>
            <option value="2026-07">July 2026 Audit</option>
            <option value="2026-06">June 2026 Audit</option>
            <option value="2026-05">May 2026 Audit</option>
          </select>

          <button onClick={handleExportFullCSV} className="btn btn-secondary">
            <Download size={16} />
            <span>Export CSV</span>
          </button>

          <button onClick={handlePrint} className="btn btn-primary">
            <Printer size={16} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div
        className="card print-document"
        style={{
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          backgroundColor: '#ffffff'
        }}
      >
        {/* Report Official Header */}
        <div style={{ borderBottom: '2px solid var(--primary-700)', paddingBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Leaf size={18} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                EcoTrack — University Sustainability Audit Report
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Reporting Period: {period === 'ALL' ? 'May 2026 – September 2026 (Consolidated)' : period} | Published: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '4px 10px' }}>
              Audit Score: {score.score} / 100
            </span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
              Status: Verified Campus Data
            </span>
          </div>
        </div>

        {/* Executive Summary Table */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
            1. Executive Performance Indicators
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Electricity</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#b45309', marginTop: '4px' }}>
                {formatNumber(totalElectricity)} kWh
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Meters sampled: {filteredEnergy.length}</span>
            </div>

            <div style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Solid Waste Generated</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
                {formatNumber(wasteTotals.totalWasteKg)} kg
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Streams sampled: {filteredWaste.length}</span>
            </div>

            <div style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Recycling Diversion</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-700)', marginTop: '4px' }}>
                {wasteTotals.recyclingPercentage}%
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatNumber(wasteTotals.totalRecycledKg)} kg diverted</span>
            </div>

            <div style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Estimated Emissions</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>
                {formatNumber(emissions.totalEmissionsKg)} kg CO2e
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Scope 2 & 3 estimate</span>
            </div>
          </div>
        </div>

        {/* Building-wise Energy Audit Summary */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
            2. Electricity Metering Log Highlights
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.5rem' }}>Building</th>
                <th style={{ padding: '0.5rem' }}>Audit Date</th>
                <th style={{ padding: '0.5rem' }}>Consumption</th>
                <th style={{ padding: '0.5rem' }}>Est. Grid Carbon (kg CO2e)</th>
                <th style={{ padding: '0.5rem' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnergy.slice(0, 5).map((e) => (
                <tr key={e.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '0.5rem', fontWeight: 600 }}>{e.building}</td>
                  <td style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>{e.date}</td>
                  <td style={{ padding: '0.5rem', fontWeight: 700 }}>{formatNumber(e.consumptionKWh)} kWh</td>
                  <td style={{ padding: '0.5rem' }}>{formatNumber(Math.round(e.consumptionKWh * factors.electricityFactor))}</td>
                  <td style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>{e.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Waste Diversion Log Highlights */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
            3. Circular Materials & Diversion Logs
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.5rem' }}>Facility</th>
                <th style={{ padding: '0.5rem' }}>Category</th>
                <th style={{ padding: '0.5rem' }}>Generated</th>
                <th style={{ padding: '0.5rem' }}>Recycled</th>
                <th style={{ padding: '0.5rem' }}>Processing Facility</th>
              </tr>
            </thead>
            <tbody>
              {filteredWaste.slice(0, 5).map((w) => (
                <tr key={w.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '0.5rem', fontWeight: 600 }}>{w.building}</td>
                  <td style={{ padding: '0.5rem', textTransform: 'capitalize' }}>{w.category}</td>
                  <td style={{ padding: '0.5rem' }}>{w.totalWasteKg} kg</td>
                  <td style={{ padding: '0.5rem', fontWeight: 700, color: 'var(--primary-700)' }}>{w.recycledKg} kg</td>
                  <td style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>{w.disposalMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SDG Compliance Footer in Report */}
        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <div>
            Aligned with UN SDGs: <strong>Goal 7</strong> (Affordable Clean Energy), <strong>Goal 11</strong> (Sustainable Cities), <strong>Goal 13</strong> (Climate Action).
          </div>
          <div>Certified by Campus Sustainability Office</div>
        </div>
      </div>
    </div>
  );
}
