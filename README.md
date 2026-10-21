# EcoTrack — Campus Sustainability Tracker

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Recharts](https://img.shields.io/badge/Recharts-2.12-22c55e)](https://recharts.org/)
[![SDGs](https://img.shields.io/badge/UN%20SDGs-7%20%7C%2011%20%7C%2013-blue)](https://sdgs.un.org/goals)

**EcoTrack** is a full-stack campus sustainability management platform designed to help universities track electricity consumption, divert cafeteria and dormitory solid waste, estimate carbon emissions, engage students in gamified environmental challenges, and generate audit-ready reports.

---

## 🌟 Key Features

1. **Executive Sustainability Dashboard**
   - Live KPI cards: Total Electricity (kWh), Solid Waste Generated (kg), Waste Recycled (kg), Estimated Carbon Emissions (kg CO2e), Recycling Diversion %, and Overall Campus Sustainability Score (0–100).
   - Recharts monthly electricity line chart, stacked recycling vs landfill bar chart, and waste stream donut distribution.
   - Target progress monitoring and recent campus monitoring activity logs.
   - Dynamic filtering by building and date period.

2. **Campus Energy Monitoring (Electricity)**
   - Building-level meter logs (Science Complex, Engineering Block, Library, Cafeteria, Residential Halls).
   - Full CRUD: Add, edit, view, and delete electricity records.
   - Search, building filters, and real CSV report exports.

3. **Waste & Circular Recycling Management**
   - Tracks categories: Plastic, Paper, Organic, Metal, Glass, and Other.
   - Automatic recycling percentage calculation with strict validation (preventing recycled mass from exceeding total generated mass).
   - Real-time diversion rates and CSV export.

4. **Carbon Footprint Calculator (GHG Protocol)**
   - Transparent calculation: $\text{Emissions} = (\text{kWh} \times \text{Factor}) + (\text{Landfill kg} \times \text{Factor}) + (\text{Transport} \times \text{Factor})$.
   - Configurable grid and landfill emission factors.
   - Interactive Scenario Simulator comparing theoretical models against actual campus measurements.

5. **Green Campus Challenges & Gamification**
   - Active quests (e.g., Plastic-Free Sprint, Dorm Energy Saver, Campus Clean-up).
   - Student quest joining, single-claim reward validation, and anti-abuse safeguards.
   - Real-time campus student leaderboard with points and achievement badges.

6. **Student Ideas & Feedback Pipeline**
   - Student green proposal submission with location tagging.
   - Admin status workflow: `Submitted` → `Under Review` → `Approved` → `Implemented`.

7. **Audit Reports & Analytics**
   - Custom reporting period filter (monthly audits or consolidated year).
   - Dedicated clean `@media print` layout for PDF export or paper printing.
   - Real one-click consolidated CSV report generation.

8. **Admin Management Hub**
   - Configurable baseline targets and reduction goals.
   - Editable greenhouse gas emission factors.
   - Factory demo data reset.

---

## 🏛️ UN Sustainable Development Goals (SDGs)

EcoTrack directly implements reporting for:
- **SDG 7 (Affordable & Clean Energy)**: Monitors building electrical energy intensity and efficiency gains.
- **SDG 11 (Sustainable Cities & Communities)**: Per-capita municipal waste diversion and circular composting.
- **SDG 13 (Climate Action)**: Scope 2 & 3 emissions quantification and student community climate education.

---

## 🚀 Quick Start & Local Execution

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### 1. Installation
Clone or open the project folder in terminal:
```bash
cd d:/Documents/ecotrack
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 👥 User Roles & Demo Credentials

EcoTrack features an **Evaluation Mode Switcher** located in the top navigation bar. With a single click, faculty evaluators can alternate between:

| Role | Demo User | Permissions |
|---|---|---|
| **Administrator** | Dr. Evelyn Vance (Facilities Director) | Full CRUD on energy/waste, challenge creation/closure, target setting, emission factor adjustment, suggestion approvals |
| **Student** | Rohan Verma (Student Rep) | Join quests, claim verified points, view personal badges & history, compete on leaderboard, submit proposals |

To reset the database at any point during testing, click **"Reset Demo Data"** in the top navbar.

---

## 🗄️ Database Architecture & Storage

- **Offline Demo Mode (Default)**: Out-of-the-box storage in `localStorage` seeded with 5 months of realistic data across 6 campus facilities.
- **Cloud Firestore Adapter**: Ready for Firestore synchronization. Copy `.env.example` to `.env` and supply Firebase credentials when ready.

---

## 📂 Project Organization

```
ecotrack/
├── index.html
├── vite.config.js
├── package.json
├── .env.example
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── data/
    │   └── initialData.js          # Realistic campus sample data
    ├── services/
    │   └── storageService.js       # Persistent CRUD service
    ├── context/
    │   ├── AuthContext.jsx         # Role-based auth & demo switcher
    │   └── ToastContext.jsx        # Notification toasts
    ├── utils/
    │   └── calculations.js         # Score formula & GHG math engine
    ├── components/
    │   ├── StatCard.jsx            # KPI cards
    │   └── Modal.jsx               # Form dialogs
    ├── layouts/
    │   ├── AppLayout.jsx           # App layout wrapper
    │   ├── Sidebar.jsx             # Collapsible navigation
    │   ├── TopNavbar.jsx           # Role switcher & reset trigger
    │   └── layout.css
    ├── styles/
    │   └── index.css               # Design system tokens & print styles
    └── pages/
        ├── LandingPage.jsx         # Hero, SDGs, preview metrics
        ├── Dashboard.jsx           # Charts, KPIs, score formula
        ├── EnergyMonitoring.jsx    # Electricity logs & CSV export
        ├── WasteManagement.jsx     # Waste streams & diversion
        ├── CarbonCalculator.jsx    # GHG calculator & simulator
        ├── GreenChallenges.jsx     # Quests & student leaderboard
        ├── Suggestions.jsx         # Ideas & admin triage pipeline
        ├── Reports.jsx             # Printable audit & CSV export
        ├── StudentProfile.jsx      # Badges & point history
        └── AdminHub.jsx            # Targets & emission factors
```
