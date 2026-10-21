/**
 * Calculations & Sustainability Metrics Engine for EcoTrack
 */

/**
 * Calculates total electricity consumed in kWh for a dataset of energy records
 */
export function calculateTotalElectricity(energyRecords = []) {
  return energyRecords.reduce((acc, curr) => acc + (Number(curr.consumptionKWh) || 0), 0);
}

/**
 * Calculates total waste and total recycled waste in kg
 */
export function calculateWasteTotals(wasteRecords = []) {
  let totalWasteKg = 0;
  let totalRecycledKg = 0;

  wasteRecords.forEach(r => {
    totalWasteKg += (Number(r.totalWasteKg) || 0);
    totalRecycledKg += (Number(r.recycledKg) || 0);
  });

  const recyclingPercentage = totalWasteKg > 0
    ? Math.min(100, Math.round((totalRecycledKg / totalWasteKg) * 1000) / 10)
    : 0;

  return {
    totalWasteKg: Math.round(totalWasteKg * 10) / 10,
    totalRecycledKg: Math.round(totalRecycledKg * 10) / 10,
    recyclingPercentage
  };
}

/**
 * Calculates estimated carbon emissions in kg CO2e
 * Formula:
 * Electricity Emissions = Electricity (kWh) * emissionFactor (kg CO2e/kWh)
 * Landfill Emissions = (Total Waste - Recycled Waste) * landfillFactor (kg CO2e/kg)
 */
export function calculateEstimatedEmissions(energyRecords = [], wasteRecords = [], factors = {}) {
  const electricityKWh = calculateTotalElectricity(energyRecords);
  const { totalWasteKg, totalRecycledKg } = calculateWasteTotals(wasteRecords);
  const unrecycledWasteKg = Math.max(0, totalWasteKg - totalRecycledKg);

  const electricityFactor = Number(factors.electricityFactor) || 0.82;
  const wasteFactor = Number(factors.wasteLandfillFactor) || 1.25;

  const electricityEmissions = electricityKWh * electricityFactor;
  const wasteEmissions = unrecycledWasteKg * wasteFactor;
  const totalEmissions = electricityEmissions + wasteEmissions;

  return {
    totalEmissionsKg: Math.round(totalEmissions),
    electricityEmissionsKg: Math.round(electricityEmissions),
    wasteEmissionsKg: Math.round(wasteEmissions),
    electricityFactorUsed: electricityFactor,
    wasteFactorUsed: wasteFactor
  };
}

/**
 * Computes the transparent Campus Sustainability Score (0 - 100)
 * 
 * Based on 4 normalized pillars:
 * 1. Electricity Performance (35% weight): Compares recent consumption with baseline target
 * 2. Recycling Rate (30% weight): Actual recycling % relative to 100% or target rate
 * 3. Waste Diversion / Reduction (20% weight): Compares current waste against baseline target
 * 4. Green Initiatives / Student Engagement (15% weight): Challenges completed & active programs
 */
export function calculateSustainabilityScore({
  energyRecords = [],
  wasteRecords = [],
  targets = {},
  challenges = []
}) {
  const currentKWh = calculateTotalElectricity(energyRecords);
  const { totalWasteKg, recyclingPercentage } = calculateWasteTotals(wasteRecords);

  const baselineKWh = Number(targets.baselineElectricityMonthlyKWh) || 45000;
  const baselineWaste = Number(targets.baselineMonthlyWasteKg) || 8500;
  const targetRecycleRate = Number(targets.targetRecyclingRatePct) || 60;

  // 1. Energy Score (0 - 100)
  // If energy <= baseline, score increases. 100 if reduced by targetReductionPct or better
  let energyScore = 50;
  if (baselineKWh > 0 && currentKWh > 0) {
    const diffPct = ((baselineKWh - currentKWh) / baselineKWh) * 100;
    // -20% diff gives 30, 0% diff gives 70, +15% reduction gives 95
    energyScore = Math.min(100, Math.max(10, Math.round(70 + (diffPct * 1.8))));
  }

  // 2. Recycling Score (0 - 100)
  // Proportional to target recycling rate
  let recyclingScore = 0;
  if (targetRecycleRate > 0) {
    recyclingScore = Math.min(100, Math.max(0, Math.round((recyclingPercentage / targetRecycleRate) * 85)));
  }

  // 3. Waste Reduction Score (0 - 100)
  let wasteScore = 50;
  if (baselineWaste > 0 && totalWasteKg > 0) {
    const wasteDiffPct = ((baselineWaste - totalWasteKg) / baselineWaste) * 100;
    wasteScore = Math.min(100, Math.max(10, Math.round(65 + (wasteDiffPct * 1.7))));
  }

  // 4. Community Action Score (0 - 100)
  const activeChallenges = challenges.filter(c => c.status === 'active');
  const totalCompleted = challenges.reduce((acc, c) => acc + (Number(c.currentCount) || 0), 0);
  const communityScore = Math.min(100, Math.round(50 + (activeChallenges.length * 8) + (totalCompleted / 25)));

  // Weighted Combination
  // Weights: Energy 35%, Recycling 30%, Waste 20%, Community 15%
  const compositeScore = Math.round(
    (energyScore * 0.35) +
    (recyclingScore * 0.30) +
    (wasteScore * 0.20) +
    (communityScore * 0.15)
  );

  return {
    score: Math.min(100, Math.max(0, compositeScore)),
    breakdown: {
      energyScore,
      recyclingScore,
      wasteScore,
      communityScore
    },
    weights: {
      energy: 35,
      recycling: 30,
      waste: 20,
      community: 15
    },
    status: compositeScore >= 80 ? 'Exemplary Green Campus' : compositeScore >= 65 ? 'Progressive Sustainability' : 'Needs Optimization'
  };
}

/**
 * Formats numbers into human-readable strings with commas
 */
export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return Number(num).toLocaleString('en-US');
}
