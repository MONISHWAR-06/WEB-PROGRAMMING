// Realistic Initial Sample Dataset for EcoTrack - Campus Sustainability Tracker

export const INITIAL_BUILDINGS = [
  'Science & Technology Complex',
  'Engineering Block A',
  'Central Library & Media Center',
  'Student Activity Center & Cafeteria',
  'North Campus Residential Halls',
  'Administrative Headquarters'
];

export const INITIAL_EMISSION_FACTORS = {
  electricityFactor: 0.82, // kg CO2e per kWh (Regional grid mix average)
  wasteLandfillFactor: 1.25, // kg CO2e per kg unrecycled landfill waste
  transportBusFactor: 0.089, // kg CO2e per passenger-km (campus shuttle)
  transportCarFactor: 0.171, // kg CO2e per vehicle-km
  lastUpdated: '2026-09-15',
  notes: 'Grid emission factors benchmarked against regional utility emissions registry.'
};

export const INITIAL_TARGETS = {
  baselineElectricityMonthlyKWh: 45000,
  targetElectricityReductionPct: 15, // target 15% reduction
  targetRecyclingRatePct: 60, // target 60% recycling
  baselineMonthlyWasteKg: 8500,
  targetWasteReductionPct: 20 // target 20% waste reduction
};

export const INITIAL_ENERGY_RECORDS = [
  {
    id: 'en-101',
    building: 'Science & Technology Complex',
    date: '2026-05-31',
    consumptionKWh: 8900,
    recordedBy: 'Admin (System)',
    notes: 'HVAC operation optimized after exam period',
    isSample: true
  },
  {
    id: 'en-102',
    building: 'Engineering Block A',
    date: '2026-05-31',
    consumptionKWh: 7650,
    recordedBy: 'Admin (System)',
    notes: 'Machine workshops running summer research',
    isSample: true
  },
  {
    id: 'en-103',
    building: 'Central Library & Media Center',
    date: '2026-05-31',
    consumptionKWh: 5400,
    recordedBy: 'Admin (System)',
    notes: 'LED retrofit completed in reading halls',
    isSample: true
  },
  {
    id: 'en-104',
    building: 'Student Activity Center & Cafeteria',
    date: '2026-05-31',
    consumptionKWh: 6100,
    recordedBy: 'Admin (System)',
    notes: 'Refrigeration compressors serviced',
    isSample: true
  },
  {
    id: 'en-105',
    building: 'North Campus Residential Halls',
    date: '2026-05-31',
    consumptionKWh: 9800,
    recordedBy: 'Admin (System)',
    notes: 'Summer occupancy rate at 75%',
    isSample: true
  },
  // June
  {
    id: 'en-106',
    building: 'Science & Technology Complex',
    date: '2026-06-30',
    consumptionKWh: 8400,
    recordedBy: 'Admin (System)',
    notes: 'Solar arrays generated 1,200 kWh supplementary',
    isSample: true
  },
  {
    id: 'en-107',
    building: 'Engineering Block A',
    date: '2026-06-30',
    consumptionKWh: 7200,
    recordedBy: 'Admin (System)',
    notes: 'Robotics lab scheduled power down nights',
    isSample: true
  },
  {
    id: 'en-108',
    building: 'Central Library & Media Center',
    date: '2026-06-30',
    consumptionKWh: 5100,
    recordedBy: 'Admin (System)',
    notes: 'Automated daylight harvesting sensors active',
    isSample: true
  },
  {
    id: 'en-109',
    building: 'Student Activity Center & Cafeteria',
    date: '2026-06-30',
    consumptionKWh: 5800,
    recordedBy: 'Admin (System)',
    notes: 'Energy efficient kitchen appliances installed',
    isSample: true
  },
  {
    id: 'en-110',
    building: 'North Campus Residential Halls',
    date: '2026-06-30',
    consumptionKWh: 9200,
    recordedBy: 'Admin (System)',
    notes: 'Smart thermostats in common corridors',
    isSample: true
  },
  // July
  {
    id: 'en-111',
    building: 'Science & Technology Complex',
    date: '2026-07-31',
    consumptionKWh: 8100,
    recordedBy: 'Admin (System)',
    notes: 'Chiller plant tuning',
    isSample: true
  },
  {
    id: 'en-112',
    building: 'Engineering Block A',
    date: '2026-07-31',
    consumptionKWh: 6950,
    recordedBy: 'Admin (System)',
    notes: 'Reduced lighting schedules',
    isSample: true
  },
  {
    id: 'en-113',
    building: 'Central Library & Media Center',
    date: '2026-07-31',
    consumptionKWh: 4850,
    recordedBy: 'Admin (System)',
    notes: 'Smart lighting in study rooms',
    isSample: true
  },
  {
    id: 'en-114',
    building: 'Student Activity Center & Cafeteria',
    date: '2026-07-31',
    consumptionKWh: 5450,
    recordedBy: 'Admin (System)',
    notes: 'Ventilation timers installed',
    isSample: true
  },
  {
    id: 'en-115',
    building: 'North Campus Residential Halls',
    date: '2026-07-31',
    consumptionKWh: 8700,
    recordedBy: 'Admin (System)',
    notes: 'Resident hall energy conservation drive',
    isSample: true
  },
  // August
  {
    id: 'en-116',
    building: 'Science & Technology Complex',
    date: '2026-08-31',
    consumptionKWh: 7900,
    recordedBy: 'Admin (System)',
    notes: 'High efficiency lab ventilation activated',
    isSample: true
  },
  {
    id: 'en-117',
    building: 'Engineering Block A',
    date: '2026-08-31',
    consumptionKWh: 6700,
    recordedBy: 'Admin (System)',
    notes: 'Smart timers on lab computers and server racks',
    isSample: true
  },
  {
    id: 'en-118',
    building: 'Central Library & Media Center',
    date: '2026-08-31',
    consumptionKWh: 4600,
    recordedBy: 'Admin (System)',
    notes: 'Energy audit adjustments applied',
    isSample: true
  },
  {
    id: 'en-119',
    building: 'Student Activity Center & Cafeteria',
    date: '2026-08-31',
    consumptionKWh: 5200,
    recordedBy: 'Admin (System)',
    notes: 'Eco-cooktops implementation',
    isSample: true
  },
  {
    id: 'en-120',
    building: 'North Campus Residential Halls',
    date: '2026-08-31',
    consumptionKWh: 8300,
    recordedBy: 'Admin (System)',
    notes: 'Student orientation green dorm badge program',
    isSample: true
  },
  // September (Current Reporting Month)
  {
    id: 'en-121',
    building: 'Science & Technology Complex',
    date: '2026-09-28',
    consumptionKWh: 7500,
    recordedBy: 'Admin (System)',
    notes: 'Rooftop solar expansion connected to subgrid',
    isSample: true
  },
  {
    id: 'en-122',
    building: 'Engineering Block A',
    date: '2026-09-28',
    consumptionKWh: 6400,
    recordedBy: 'Admin (System)',
    notes: 'Efficient capacitor banks energized',
    isSample: true
  },
  {
    id: 'en-123',
    building: 'Central Library & Media Center',
    date: '2026-09-28',
    consumptionKWh: 4350,
    recordedBy: 'Admin (System)',
    notes: 'Low-power workstation defaults across all floors',
    isSample: true
  },
  {
    id: 'en-124',
    building: 'Student Activity Center & Cafeteria',
    date: '2026-09-28',
    consumptionKWh: 4950,
    recordedBy: 'Admin (System)',
    notes: 'LED displays auto-dim during non-peak hours',
    isSample: true
  },
  {
    id: 'en-125',
    building: 'North Campus Residential Halls',
    date: '2026-09-28',
    consumptionKWh: 7950,
    recordedBy: 'Admin (System)',
    notes: 'Inter-dorm energy challenge winner reduction',
    isSample: true
  }
];

export const INITIAL_WASTE_RECORDS = [
  // May
  {
    id: 'ws-201',
    building: 'Student Activity Center & Cafeteria',
    date: '2026-05-30',
    category: 'organic',
    totalWasteKg: 1850,
    recycledKg: 1200,
    disposalMethod: 'Campus Composting Center',
    notes: 'Pre-consumer food scrap segregation',
    recordedBy: 'Admin (System)',
    isSample: true
  },
  {
    id: 'ws-202',
    building: 'Central Library & Media Center',
    date: '2026-05-30',
    category: 'paper',
    totalWasteKg: 950,
    recycledKg: 820,
    disposalMethod: 'Certified Pulp Recycler',
    notes: 'End of term exams and print archives',
    recordedBy: 'Admin (System)',
    isSample: true
  },
  {
    id: 'ws-203',
    building: 'North Campus Residential Halls',
    date: '2026-05-30',
    category: 'plastic',
    totalWasteKg: 1100,
    recycledKg: 580,
    disposalMethod: 'Materials Recovery Facility (MRF)',
    notes: 'Sorted bottles and containers',
    recordedBy: 'Admin (System)',
    isSample: true
  },
  // June
  {
    id: 'ws-204',
    building: 'Student Activity Center & Cafeteria',
    date: '2026-06-28',
    category: 'organic',
    totalWasteKg: 1720,
    recycledKg: 1280,
    disposalMethod: 'Campus Composting Center',
    notes: 'Bio-digester intake augmented',
    recordedBy: 'Admin (System)',
    isSample: true
  },
  {
    id: 'ws-205',
    building: 'Central Library & Media Center',
    date: '2026-06-28',
    category: 'paper',
    totalWasteKg: 780,
    recycledKg: 710,
    disposalMethod: 'Certified Pulp Recycler',
    notes: 'Paperless course catalog campaign',
    recordedBy: 'Admin (System)',
    isSample: true
  },
  {
    id: 'ws-206',
    building: 'Science & Technology Complex',
    date: '2026-06-28',
    category: 'glass',
    totalWasteKg: 420,
    recycledKg: 350,
    disposalMethod: 'Specialized Cullet Recycling',
    notes: 'Uncontaminated lab glassware',
    recordedBy: 'Admin (System)',
    isSample: true
  },
  {
    id: 'ws-207',
    building: 'Engineering Block A',
    date: '2026-06-28',
    category: 'metal',
    totalWasteKg: 650,
    recycledKg: 590,
    disposalMethod: 'Local Scrap Foundry',
    notes: 'Prototyping aluminium offcuts',
    recordedBy: 'Admin (System)',
    isSample: true
  },
  // July
  {
    id: 'ws-208',
    building: 'Student Activity Center & Cafeteria',
    date: '2026-07-29',
    category: 'organic',
    totalWasteKg: 1640,
    recycledKg: 1320,
    disposalMethod: 'Campus Composting Center',
    notes: 'Campus farm vermicomposting batch',
    recordedBy: 'Admin (System)',
    isSample: true
  },
  {
    id: 'ws-209',
    building: 'North Campus Residential Halls',
    date: '2026-07-29',
    category: 'plastic',
    totalWasteKg: 940,
    recycledKg: 620,
    disposalMethod: 'Materials Recovery Facility (MRF)',
    notes: 'Reverse vending machine deployment in lobby',
    recordedBy: 'Admin (System)',
    isSample: true
  },
  {
    id: 'ws-210',
    building: 'Science & Technology Complex',
    date: '2026-07-29',
    category: 'other',
    totalWasteKg: 520,
    recycledKg: 190,
    disposalMethod: 'Municipal Regulated Disposal',
    notes: 'Composite materials and non-recyclable filters',
    recordedBy: 'Admin (System)',
    isSample: true
  },
  // August
  {
    id: 'ws-211',
    building: 'Student Activity Center & Cafeteria',
    date: '2026-08-28',
    category: 'organic',
    totalWasteKg: 1580,
    recycledKg: 1350,
    disposalMethod: 'Campus Composting Center',
    notes: 'Zero Food Waste Wednesdays initiative',
    recordedBy: 'Admin (System)',
    isSample: true
  },
  {
    id: 'ws-212',
    building: 'Central Library & Media Center',
    date: '2026-08-28',
    category: 'paper',
    totalWasteKg: 690,
    recycledKg: 650,
    disposalMethod: 'Certified Pulp Recycler',
    notes: 'Double-sided printing default policy',
    recordedBy: 'Admin (System)',
    isSample: true
  },
  {
    id: 'ws-213',
    building: 'North Campus Residential Halls',
    date: '2026-08-28',
    category: 'plastic',
    totalWasteKg: 850,
    recycledKg: 630,
    disposalMethod: 'Materials Recovery Facility (MRF)',
    notes: 'Bottle refill stations saved 12,000 single-use bottles',
    recordedBy: 'Admin (System)',
    isSample: true
  },
  // September (Current Reporting Month)
  {
    id: 'ws-214',
    building: 'Student Activity Center & Cafeteria',
    date: '2026-09-27',
    category: 'organic',
    totalWasteKg: 1490,
    recycledKg: 1330,
    disposalMethod: 'Campus Composting Center',
    notes: 'Food waste down 20% compared to baseline',
    recordedBy: 'Admin (System)',
    isSample: true
  },
  {
    id: 'ws-215',
    building: 'Central Library & Media Center',
    date: '2026-09-27',
    category: 'paper',
    totalWasteKg: 620,
    recycledKg: 590,
    disposalMethod: 'Certified Pulp Recycler',
    notes: 'Recycled pulp converted into student notebooks',
    recordedBy: 'Admin (System)',
    isSample: true
  },
  {
    id: 'ws-216',
    building: 'North Campus Residential Halls',
    date: '2026-09-27',
    category: 'plastic',
    totalWasteKg: 780,
    recycledKg: 640,
    disposalMethod: 'Materials Recovery Facility (MRF)',
    notes: 'Green move-in kit banned styrofoam packaging',
    recordedBy: 'Admin (System)',
    isSample: true
  },
  {
    id: 'ws-217',
    building: 'Engineering Block A',
    date: '2026-09-27',
    category: 'metal',
    totalWasteKg: 510,
    recycledKg: 480,
    disposalMethod: 'Local Scrap Foundry',
    notes: 'Student fabrication scrap sorted in colored bins',
    recordedBy: 'Admin (System)',
    isSample: true
  },
  {
    id: 'ws-218',
    building: 'Science & Technology Complex',
    date: '2026-09-27',
    category: 'glass',
    totalWasteKg: 340,
    recycledKg: 310,
    disposalMethod: 'Specialized Cullet Recycling',
    notes: 'Neutral chemistry glassware reprocessed',
    recordedBy: 'Admin (System)',
    isSample: true
  }
];

export const INITIAL_CHALLENGES = [
  {
    id: 'ch-01',
    title: 'Zero Single-Use Plastic Sprint',
    description: 'Commit to carrying your own reusable bottle and reusable bag across all campus cafeterias for 14 straight days.',
    category: 'Waste Reduction',
    points: 150,
    targetCount: 500,
    currentCount: 342,
    deadline: '2026-11-15',
    status: 'active',
    badgeName: 'Plastic Free Hero',
    badgeIcon: 'ShieldCheck',
    createdDate: '2026-09-01'
  },
  {
    id: 'ch-02',
    title: 'Dorm Energy Saver Challenge',
    description: 'Switch off all standby devices, unplug chargers when idle, and keep dorm AC at 24°C or above for 21 days.',
    category: 'Energy Conservation',
    points: 200,
    targetCount: 300,
    currentCount: 218,
    deadline: '2026-11-30',
    status: 'active',
    badgeName: 'Kilowatt Master',
    badgeIcon: 'Zap',
    createdDate: '2026-09-05'
  },
  {
    id: 'ch-03',
    title: 'Campus Lake & Trail Clean-Up Drive',
    description: 'Join the weekend student volunteer crew to segregate and clean plastic and litter along the university biological trail.',
    category: 'Community Action',
    points: 250,
    targetCount: 150,
    currentCount: 145,
    deadline: '2026-10-25',
    status: 'active',
    badgeName: 'Eco Steward',
    badgeIcon: 'Trees',
    createdDate: '2026-09-10'
  },
  {
    id: 'ch-04',
    title: 'Paperless Semester Movement',
    description: 'Submit all assignments and class project drafts digitally without printing unnecessary single-use handouts.',
    category: 'Resource Efficiency',
    points: 120,
    targetCount: 400,
    currentCount: 388,
    deadline: '2026-12-10',
    status: 'active',
    badgeName: 'Digital Scholar',
    badgeIcon: 'FileCheck',
    createdDate: '2026-09-12'
  },
  {
    id: 'ch-05',
    title: 'Green Commute 50-Kilometer Pledge',
    description: 'Walk, cycle, or use the electric campus shuttle for campus transit instead of personal fuel cars or motorbikes.',
    category: 'Mobility & Carbon',
    points: 180,
    targetCount: 250,
    currentCount: 250,
    deadline: '2026-09-30',
    status: 'closed',
    badgeName: 'Pedal Pioneer',
    badgeIcon: 'Bike',
    createdDate: '2026-08-01'
  }
];

export const INITIAL_LEADERBOARD = [
  { id: 'usr-01', name: 'Aarav Sharma', studentId: 'CS-2024-042', points: 720, challengesCompleted: 5, avatar: '👨‍🎓', department: 'Computer Science' },
  { id: 'usr-02', name: 'Sophia Chen', studentId: 'EN-2023-118', points: 640, challengesCompleted: 4, avatar: '👩‍🔬', department: 'Environmental Eng.' },
  { id: 'usr-03', name: 'Marcus Taylor', studentId: 'ME-2024-089', points: 580, challengesCompleted: 4, avatar: '👨‍💻', department: 'Mechanical Eng.' },
  { id: 'usr-04', name: 'Priya Patel', studentId: 'BT-2025-015', points: 510, challengesCompleted: 3, avatar: '🌱', department: 'Biotechnology' },
  { id: 'usr-student', name: 'Rohan Verma (You)', studentId: 'EC-2024-099', points: 420, challengesCompleted: 3, avatar: '🌿', department: 'Electronics' },
  { id: 'usr-06', name: 'Liam Davies', studentId: 'AR-2023-044', points: 390, challengesCompleted: 2, avatar: '🏛️', department: 'Architecture' },
  { id: 'usr-07', name: 'Ananya Roy', studentId: 'CH-2025-072', points: 340, challengesCompleted: 2, avatar: '🧪', department: 'Chemistry' }
];

export const INITIAL_SUGGESTIONS = [
  {
    id: 'sg-301',
    title: 'Install Rainwater Harvesting at Central Library Roof',
    category: 'Water & Facilities',
    description: 'The library has over 1,500 sq meters of flat roof that could funnel rain runoff into the botanical garden irrigation tanks during monsoon season.',
    location: 'Central Library & Media Center',
    submittedBy: 'Sophia Chen (Student)',
    submittedDate: '2026-09-18',
    status: 'Approved',
    adminNotes: 'Facilities board has reviewed and slated this for capital budget Q1 2027.'
  },
  {
    id: 'sg-302',
    title: 'Introduce Reusable Stainless Steel Cutlery at Student Canteen',
    category: 'Waste Reduction',
    description: 'Eliminate single-use plastic forks and spoons during lunch hour by introducing a tokenized wash & reuse cutlery station.',
    location: 'Student Activity Center & Cafeteria',
    submittedBy: 'Rohan Verma (Student)',
    submittedDate: '2026-09-22',
    status: 'Under Review',
    adminNotes: 'Testing dishwasher capacity with catering contractor.'
  },
  {
    id: 'sg-303',
    title: 'Solar Phone Charging Benches across Walkways',
    category: 'Clean Energy',
    description: 'Install 4 weatherproof outdoor benches with integrated mini solar canopies and USB charging ports along the main campus quad.',
    location: 'North Campus Residential Halls',
    submittedBy: 'Marcus Taylor (Student)',
    submittedDate: '2026-09-25',
    status: 'Submitted',
    adminNotes: 'Awaiting sustainability committee review.'
  },
  {
    id: 'sg-304',
    title: 'Campus Food Surplus Redistribution to Community Shelter',
    category: 'Social Impact',
    description: 'Partner with local youth shelter to donate untouched, packaged cafeteria dinners every evening.',
    location: 'Student Activity Center & Cafeteria',
    submittedBy: 'Aarav Sharma (Student)',
    submittedDate: '2026-09-10',
    status: 'Implemented',
    adminNotes: 'Program operational since Sept 20! Rescued 180kg food this week.'
  }
];

export const INITIAL_USER_PARTICIPATION = {
  joinedChallengeIds: ['ch-01', 'ch-02', 'ch-03'],
  completedChallengeIds: ['ch-01', 'ch-03'],
  claimedRewardChallengeIds: ['ch-01', 'ch-03'],
  badges: [
    { id: 'b-01', title: 'Plastic Free Hero', icon: 'ShieldCheck', date: '2026-09-20' },
    { id: 'b-02', title: 'Eco Steward', icon: 'Trees', date: '2026-09-26' },
    { id: 'b-03', title: 'Early Adopter', icon: 'Sparkles', date: '2026-09-01' }
  ],
  activityHistory: [
    { id: 'act-01', action: 'Completed Campus Lake & Trail Clean-Up Drive', points: 250, date: '2026-09-26' },
    { id: 'act-02', action: 'Submitted Green Suggestion #sg-302', points: 20, date: '2026-09-22' },
    { id: 'act-03', action: 'Completed Zero Single-Use Plastic Sprint', points: 150, date: '2026-09-20' },
    { id: 'act-04', action: 'Joined Dorm Energy Saver Challenge', points: 0, date: '2026-09-06' }
  ]
};
