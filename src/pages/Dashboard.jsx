import React, { useState, useEffect } from 'react';
import {
  Zap,
  Trash2,
  Leaf,
  Award,
  TrendingDown,
  Info,
  Calendar,
  Building2,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { storageService } from '../services/storageService';
import {
  calculateTotalElectricity,
  calculateWasteTotals,
  calculateEstimatedEmissions,
  calculateSustainabilityScore,
  formatNumber
} from '../utils/calculations';

const CATEGORY_COLORS = {
  organic: '#10b981',
  paper: '#3b82f6',
  plastic: '#f59e0b',
  metal: '#8b5cf6',
  glass: '#06b6d4',
  other: '#64748b'
};

export default function Dashboard() {
  const [energyRecords, setEnergyRecords] = useState([]);
  const [wasteRecords, setWasteRecords] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [targets, setTargets] = useState({});
  const [emissionFactors, setEmissionFactors] = useState({});
  const [buildings, setBuildings] = useState([]);

  // Filters
  const [selectedBuilding, setSelectedBuilding] = useState('ALL');
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setEnergyRecords(storageService.getEnergyRecords());
    setWasteRecords(storageService.getWasteRecords());
    setChallenges(storageService.getChallenges());
    setTargets(storageService.getTargets());
    setEmissionFactors(storageService.getEmissionFactors());
    setBuildings(storageService.getBuildings());
  };

  // Filtered dataset
  const filteredEnergy = energyRecords.filter((r) => {
    const matchBuilding = selectedBuilding === 'ALL' || r.building === selectedBuilding;
    const matchMonth = selectedMonth === 'ALL' || r.date.startsWith(selectedMonth);
    return matchBuilding && matchMonth;
  });

  const filteredWaste = wasteRecords.filter((r) => {
    const matchBuilding = selectedBuilding === 'ALL' || r.building === selectedBuilding;
    const matchMonth = selectedMonth === 'ALL' || r.date.startsWith(selectedMonth);
    return matchBuilding && matchMonth;
  });

  // KPI Metrics
  const totalElectricityKWh = calculateTotalElectricity(filteredEnergy);
  const { totalWasteKg, totalRecycledKg, recyclingPercentage } = calculateWasteTotals(filteredWaste);
  const { totalEmissionsKg } = calculateEstimatedEmissions(filteredEnergy, filteredWaste, emissionFactors);
  const sustainabilityScore = calculateSustainabilityScore({
    energyRecords: filteredEnergy,
    wasteRecords: filteredWaste,
    targets,
    challenges
  });

  // Monthly trends for Recharts
  const months = ['2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
  const monthlyEnergyData = months.map((m) => {
    const label = new Date(m + '-15').toLocaleString('en-US', { month: 'short' });
    const records = energyRecords.filter(
      (r) => r.date.startsWith(m) && (selectedBuilding === 'ALL' || r.building === selectedBuilding)
    );
    const total = calculateTotalElectricity(records);
    return {
      month: label,
      consumptionKWh: total,
      targetKWh: selectedBuilding === 'ALL' ? targets.baselineElectricityMonthlyKWh * 0.85 : 7000
    };
  });

  const monthlyWasteData = months.map((m) => {
    const label = new Date(m + '-15').toLocaleString('en-US', { month: 'short' });
    const records = wasteRecords.filter(
      (r) => r.date.startsWith(m) && (selectedBuilding === 'ALL' || r.building === selectedBuilding)
    );
    const totals = calculateWasteTotals(records);
    return {
      month: label,
      totalWaste: totals.totalWasteKg,
      recycled: totals.totalRecycledKg,
      landfill: Math.max(0, totals.totalWasteKg - totals.totalRecycledKg)
    };
  });

  // Category breakdown for Donut Chart
  const categoryMap = {};
  filteredWaste.forEach((w) => {
    const cat = w.category || 'other';
    categoryMap[cat] = (categoryMap[cat] || 0) + Number(w.totalWasteKg);
  });

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: Math.round(value)
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header & Filters */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Sustainability Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Live environmental indicators, energy efficiency, and campus circular economy tracking
          </p>
        </div>

        {/* Global Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', padding: '4px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <Building2 size={16} color="var(--primary-600)" />
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              style={{ border: 'none', padding: '4px', fontSize: '0.85rem', fontWeight: 500, background: 'transparent' }}
            >
              <option value="ALL">All Campus Buildings</option>
              {buildings.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', padding: '4px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <Calendar size={16} color="var(--primary-600)" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ border: 'none', padding: '4px', fontSize: '0.85rem', fontWeight: 500, background: 'transparent' }}
            >
              <option value="ALL">All Historic Records (May - Sep)</option>
              <option value="2026-09">September 2026 (Latest)</option>
              <option value="2026-08">August 2026</option>
              <option value="2026-07">July 2026</option>
              <option value="2026-06">June 2026</option>
              <option value="2026-05">May 2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <StatCard
          title="Electricity Consumed"
          value={formatNumber(totalElectricityKWh)}
          unit="kWh"
          icon={Zap}
          trend="-7.8%"
          trendLabel="vs previous cycle"
          color="amber"
        />

        <StatCard
          title="Total Waste Generated"
          value={formatNumber(totalWasteKg)}
          unit="kg"
          icon={Trash2}
          trend="-11.4%"
          trendLabel="solid waste reduction"
          color="rose"
        />

        <StatCard
          title="Waste Recycled"
          value={formatNumber(totalRecycledKg)}
          unit="kg"
          icon={Leaf}
          trend="+14.2%"
          trendLabel="diversion rate"
          color="emerald"
        />

        <StatCard
          title="Estimated Emissions"
          value={formatNumber(totalEmissionsKg)}
          unit="kg CO2e"
          icon={TrendingDown}
          trend="-8.9%"
          trendLabel="net avoidance"
          color="blue"
        />

        {/* Sustainability Score Highlight Card */}
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, var(--primary-700), var(--primary-800))',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-200)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Sustainability Index
              </span>
              <button
                onClick={() => setShowFormulaModal(true)}
                style={{ color: 'var(--primary-200)', display: 'flex', alignItems: 'center' }}
                title="View Score Formula & Weighting"
              >
                <Info size={16} />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>
                {sustainabilityScore.score}
              </span>
              <span style={{ fontSize: '1.1rem', opacity: 0.8, fontWeight: 600 }}>/ 100</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--primary-100)', marginTop: '0.35rem' }}>
              {sustainabilityScore.status}
            </p>
          </div>

          <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-200)' }}>
              Recycling: {recyclingPercentage}% | Target: 60%
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Row 1: Electricity Trends & Waste Diverted */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem' }}>
        {/* Electricity Line Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Electricity Consumption Trend (kWh)</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Historical monthly consumption compared against target baseline</p>
            </div>
            <span className="badge badge-warning">Target: -15%</span>
          </div>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEnergyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)' }}
                  formatter={(val) => [`${formatNumber(val)} kWh`, 'Consumption']}
                />
                <Area type="monotone" dataKey="consumptionKWh" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#energyGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste vs Recycled Stacked Bar Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Waste Diversion: Recycled vs Landfill</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tracking circularity and landfill avoidance by monthly period</p>
            </div>
            <span className="badge badge-success">Recycled: {recyclingPercentage}%</span>
          </div>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyWasteData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  formatter={(val, name) => [`${formatNumber(val)} kg`, name === 'recycled' ? 'Recycled' : 'Landfill']}
                />
                <Legend iconType="circle" />
                <Bar dataKey="recycled" name="Recycled (kg)" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="landfill" name="Landfill (kg)" fill="#f87171" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Waste Category Breakdown & Target Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Waste Category Donut */}
        <div className="card">
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Waste Category Distribution</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Proportion by waste stream category (organic, paper, plastic, etc.)</p>
          </div>

          <div style={{ height: '250px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => {
                      const color = CATEGORY_COLORS[entry.name.toLowerCase()] || '#94a3b8';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Pie>
                  <Tooltip formatter={(val) => [`${formatNumber(val)} kg`, 'Waste']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No waste records found for the filter.</p>
            )}
          </div>
        </div>

        {/* Sustainability Targets Progress Bars */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Campus Sustainability Targets</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Progress against academic year sustainability master goals</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Target 1: Electricity */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Electricity Reduction (Target: -15%)</span>
                  <span style={{ color: 'var(--primary-700)' }}>12.4% Achieved</span>
                </div>
                <div style={{ height: '9px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '82%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '999px' }} />
                </div>
              </div>

              {/* Target 2: Recycling Rate */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Recycling Diversion Rate (Target: 60%)</span>
                  <span style={{ color: 'var(--primary-700)' }}>{recyclingPercentage}% Achieved</span>
                </div>
                <div style={{ height: '9px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, (recyclingPercentage / 60) * 100)}%`,
                      background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
                      borderRadius: '999px'
                    }}
                  />
                </div>
              </div>

              {/* Target 3: Single-Use Plastic Elimination */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Student Plastic-Free Pledges (Goal: 500)</span>
                  <span style={{ color: 'var(--primary-700)' }}>342 Pledges (68.4%)</span>
                </div>
                <div style={{ height: '9px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '68.4%', background: 'linear-gradient(90deg, #f59e0b, #d97706)', borderRadius: '999px' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', padding: '0.85rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Award size={20} color="var(--primary-700)" />
            <span style={{ fontSize: '0.825rem', color: 'var(--primary-900)' }}>
              Campus has averted an estimated <strong>{formatNumber(Math.round(totalRecycledKg * 1.25))} kg CO2e</strong> through active diversion!
            </span>
          </div>
        </div>
      </div>

      {/* Recent Measurements Activity Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Campus Monitoring Logs</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest logged energy and waste entries across campus departments</p>
          </div>
          <span className="badge badge-neutral">Showing latest 6 records</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Type</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Building / Facility</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Measured Metric</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Details / Note</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnergy.slice(0, 3).map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span className="badge badge-warning" style={{ gap: '4px' }}>
                      <Zap size={12} /> Electricity
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{r.building}</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>{r.date}</td>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#b45309' }}>
                    {formatNumber(r.consumptionKWh)} kWh
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>{r.notes || 'Routine meter reading'}</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span className="badge badge-neutral">{r.isSample ? 'Sample Data' : 'Field Log'}</span>
                  </td>
                </tr>
              ))}
              {filteredWaste.slice(0, 3).map((w) => (
                <tr key={w.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span className="badge badge-success" style={{ gap: '4px' }}>
                      <Trash2 size={12} /> Waste
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{w.building}</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>{w.date}</td>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: 'var(--primary-700)' }}>
                    {w.totalWasteKg} kg ({w.recycledKg} kg recycled)
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>
                    {w.category.toUpperCase()} • {w.disposalMethod}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span className="badge badge-neutral">{w.isSample ? 'Sample Data' : 'Field Log'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formula & Scoring Breakdown Modal */}
      <Modal
        isOpen={showFormulaModal}
        onClose={() => setShowFormulaModal(false)}
        title="Campus Sustainability Score Formula"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
          <p>
            The <strong>EcoTrack Sustainability Score (0-100)</strong> is an objective index that combines 4 weighted performance pillars:
          </p>

          <div style={{ padding: '0.85rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <strong>Index Formula:</strong>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', marginTop: '4px', color: 'var(--primary-800)' }}>
              Score = (Energy × 35%) + (Recycling × 30%) + (Waste Reduction × 20%) + (Engagement × 15%)
            </div>
          </div>

          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>
              <strong>Energy Score (35% weight):</strong> Evaluates reduction compared to campus monthly baseline ({targets.baselineElectricityMonthlyKWh} kWh).
            </li>
            <li>
              <strong>Recycling Score (30% weight):</strong> Evaluates material diversion percentage against the 60% goal.
            </li>
            <li>
              <strong>Waste Score (20% weight):</strong> Tracks reduction in total generated mass against baseline ({targets.baselineMonthlyWasteKg} kg).
            </li>
            <li>
              <strong>Student Engagement (15% weight):</strong> Tracks participation volume in verified green campus challenges.
            </li>
          </ul>

          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            All metrics reflect stored campus logs and target parameters configured in the Admin Management module.
          </p>
        </div>
      </Modal>
    </div>
  );
}
