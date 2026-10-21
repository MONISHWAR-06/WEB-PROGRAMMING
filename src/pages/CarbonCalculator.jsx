import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Zap,
  Trash2,
  Bus,
  Sliders,
  Info,
  CheckCircle,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { storageService } from '../services/storageService';
import {
  calculateTotalElectricity,
  calculateWasteTotals,
  formatNumber
} from '../utils/calculations';

export default function CarbonCalculator() {
  const [factors, setFactors] = useState(storageService.getEmissionFactors());
  const [energyRecords, setEnergyRecords] = useState(storageService.getEnergyRecords());
  const [wasteRecords, setWasteRecords] = useState(storageService.getWasteRecords());

  // Interactive custom simulation inputs
  const [mode, setMode] = useState('campus'); // 'campus' | 'simulator'

  // Measured totals from campus
  const measuredElectricityKWh = calculateTotalElectricity(energyRecords);
  const { totalWasteKg, totalRecycledKg } = calculateWasteTotals(wasteRecords);
  const measuredLandfillKg = Math.max(0, totalWasteKg - totalRecycledKg);

  // Simulator inputs
  const [simKWh, setSimKWh] = useState(30000);
  const [simLandfillKg, setSimLandfillKg] = useState(2500);
  const [simBusKm, setSimBusKm] = useState(8500);
  const [simCarKm, setSimCarKm] = useState(4200);

  // Calculation values
  const activeKWh = mode === 'campus' ? measuredElectricityKWh : simKWh;
  const activeLandfill = mode === 'campus' ? measuredLandfillKg : simLandfillKg;
  const activeBusKm = mode === 'campus' ? 12000 : simBusKm; // Estimated shuttle mileage
  const activeCarKm = mode === 'campus' ? 6500 : simCarKm; // Faculty/commuter carpool

  const electricityEmissions = Math.round(activeKWh * (Number(factors.electricityFactor) || 0.82));
  const wasteEmissions = Math.round(activeLandfill * (Number(factors.wasteLandfillFactor) || 1.25));
  const busEmissions = Math.round(activeBusKm * (Number(factors.transportBusFactor) || 0.089));
  const carEmissions = Math.round(activeCarKm * (Number(factors.transportCarFactor) || 0.171));

  const totalCalculated = electricityEmissions + wasteEmissions + busEmissions + carEmissions;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Campus Carbon Footprint Calculator</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Transparent Scope 1 & Scope 2 greenhouse gas emissions (GHG) estimation engine based on configurable emissions factors
        </p>
      </div>

      {/* Mode Switcher */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={() => setMode('campus')}
          className={`btn ${mode === 'campus' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Zap size={16} />
          <span>Current Measured Campus Data</span>
        </button>
        <button
          onClick={() => setMode('simulator')}
          className={`btn ${mode === 'simulator' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Sliders size={16} />
          <span>Interactive Scenario Simulator</span>
        </button>
      </div>

      {/* Main Calculation Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Left Column: Source Breakdown */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            Emission Sources & Activity Data
          </h3>

          {/* Electricity Source */}
          <div style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <Zap size={18} color="#f59e0b" />
                <span>Purchased Electricity (Scope 2)</span>
              </div>
              <span className="badge badge-warning">{factors.electricityFactor} kg CO2e / kWh</span>
            </div>
            {mode === 'simulator' ? (
              <div style={{ marginTop: '0.75rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Simulated Consumption (kWh):</label>
                <input
                  type="number"
                  value={simKWh}
                  onChange={(e) => setSimKWh(Number(e.target.value))}
                  style={{ marginTop: '4px' }}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Measured Campus Meters:</span>
                <span style={{ fontWeight: 700 }}>{formatNumber(measuredElectricityKWh)} kWh</span>
              </div>
            )}
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-700)', textAlign: 'right' }}>
              = {formatNumber(electricityEmissions)} kg CO2e
            </div>
          </div>

          {/* Solid Waste Source */}
          <div style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <Trash2 size={18} color="#ef4444" />
                <span>Landfill Solid Waste (Scope 3)</span>
              </div>
              <span className="badge badge-warning">{factors.wasteLandfillFactor} kg CO2e / kg</span>
            </div>
            {mode === 'simulator' ? (
              <div style={{ marginTop: '0.75rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Simulated Unrecycled Waste (kg):</label>
                <input
                  type="number"
                  value={simLandfillKg}
                  onChange={(e) => setSimLandfillKg(Number(e.target.value))}
                  style={{ marginTop: '4px' }}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Unrecycled Landfill Residue:</span>
                <span style={{ fontWeight: 700 }}>{formatNumber(measuredLandfillKg)} kg</span>
              </div>
            )}
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-700)', textAlign: 'right' }}>
              = {formatNumber(wasteEmissions)} kg CO2e
            </div>
          </div>

          {/* Commuter Transit Source */}
          <div style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <Bus size={18} color="#3b82f6" />
                <span>Campus Shuttle & Commute</span>
              </div>
              <span className="badge badge-neutral">Transport Mix</span>
            </div>
            {mode === 'simulator' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Shuttle Passenger-km:</label>
                  <input
                    type="number"
                    value={simBusKm}
                    onChange={(e) => setSimBusKm(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Personal Vehicle-km:</label>
                  <input
                    type="number"
                    value={simCarKm}
                    onChange={(e) => setSimCarKm(Number(e.target.value))}
                  />
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Campus Shuttle: 12,000 p-km | Commuter: 6,500 v-km
              </div>
            )}
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-700)', textAlign: 'right' }}>
              = {formatNumber(busEmissions + carEmissions)} kg CO2e
            </div>
          </div>
        </div>

        {/* Right Column: Composite Summary & Formula Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Result Card */}
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, var(--primary-800), var(--primary-900))',
              color: '#fff',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-300)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total Estimated Carbon Emissions
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.75rem' }}>
                <span style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1 }}>
                  {formatNumber(totalCalculated)}
                </span>
                <span style={{ fontSize: '1.1rem', color: 'var(--primary-200)', fontWeight: 600 }}>kg CO2e</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--primary-200)', marginTop: '0.5rem' }}>
                Equivalent to <strong>{(totalCalculated / 1000).toFixed(2)} Metric Tonnes CO2e</strong>
              </p>
            </div>

            {/* Contribution Proportions */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-200)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                Emissions Share by Activity
              </span>
              <div style={{ display: 'flex', height: '10px', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{ width: `${(electricityEmissions / totalCalculated) * 100}%`, backgroundColor: '#f59e0b' }}
                  title="Electricity"
                />
                <div
                  style={{ width: `${(wasteEmissions / totalCalculated) * 100}%`, backgroundColor: '#ef4444' }}
                  title="Landfill Waste"
                />
                <div
                  style={{ width: `${((busEmissions + carEmissions) / totalCalculated) * 100}%`, backgroundColor: '#3b82f6' }}
                  title="Mobility"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--primary-200)', marginTop: '6px' }}>
                <span>⚡ Power {Math.round((electricityEmissions / totalCalculated) * 100)}%</span>
                <span>🗑️ Waste {Math.round((wasteEmissions / totalCalculated) * 100)}%</span>
                <span>🚌 Transit {Math.round(((busEmissions + carEmissions) / totalCalculated) * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Formula Transparency Box */}
          <div className="card">
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={16} color="var(--primary-600)" />
              <span>Standard GHG Accounting Formula</span>
            </h4>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                backgroundColor: 'var(--bg-subtle)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                marginTop: '0.75rem',
                color: 'var(--text-main)',
                lineHeight: 1.6
              }}
            >
              Estimated Emissions (kg CO2e) =<br />
              (Electricity [kWh] × {factors.electricityFactor} kg CO2e/kWh) +<br />
              (Landfill Waste [kg] × {factors.wasteLandfillFactor} kg CO2e/kg) +<br />
              (Campus Shuttle [p-km] × {factors.transportBusFactor} kg CO2e/p-km)
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              <strong>Notice:</strong> Emission factors are configurable assumptions stored in database settings. Grid emission factors reflect regional utility generation blend (updated {factors.lastUpdated}).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
