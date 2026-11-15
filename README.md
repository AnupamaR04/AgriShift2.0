# AgriShift (അഗ്രിഷിഫ്റ്റ്)

> **Growing Smarter. Farming Stronger.**  
> Dedicated Agricultural Intelligence Platform for Kerala, India.

---

## Overview
AgriShift integrates genuine NASA Earth observations, hyper-local meteorological forecasts, Kerala Agricultural University (KAU) agronomic intelligence, and official Kerala & Central government schemes (AIMS Kerala, Subhiksha Keralam, PM-KISAN, PMFBY) into a unified platform for Kerala's farmers and agricultural landowners.

---

## Project Structure
```text
AgriShift2.0/
├── frontend/             # React + Vite + Tailwind CSS + Leaflet frontend
│   ├── public/           # Static assets, favicon, icons
│   ├── src/
│   │   ├── assets/       # Visual media & branding assets
│   │   ├── components/   # Reusable UI components
│   │   ├── layouts/      # App layout wrappers (Landing, Dashboard)
│   │   ├── pages/        # Route pages (Home, Auth, Profile, Dashboard, etc.)
│   │   ├── services/     # API & Supabase service clients
│   │   ├── hooks/        # Custom React hooks
│   │   ├── context/      # Auth & Application context providers
│   │   └── utils/        # Geospatial, date & calculation utilities
│   ├── index.html        # HTML entry point with Kerala styling & Leaflet
│   ├── vite.config.js    # Vite configuration
│   ├── tailwind.config.js# Custom Kerala agricultural color palette
│   └── package.json      # Frontend dependencies
├── backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── core/         # App settings & security configurations
│   │   ├── models/       # Pydantic schemas & validation
│   │   ├── services/     # NASA Earthdata, Open-Meteo & KAU services
│   │   ├── routers/      # API endpoints (farms, satellite, weather, crops)
│   │   └── main.py       # FastAPI application entry
│   ├── requirements.txt  # Python backend dependencies
│   └── .env.example      # Environment variables template
├── supabase/             # Supabase schema & migrations
│   └── migrations/       # Safe, incremental PostgreSQL migrations
├── .gitignore            # Git exclusion rules
└── README.md             # Project documentation & instructions
```

---

## Development Roadmap
- [x] **Stage 1:** Create project folders and install dependencies.
- [ ] **Stage 2:** Build AgriShift's brand identity, landing page, and reusable design components.
- [ ] **Stage 3:** Implement Supabase authentication and automatic redirection.
- [ ] **Stage 4:** Build the Kerala farmer profile and district selection.
- [ ] **Stage 5:** Build the interactive farm location map.
- [ ] **Stage 6:** Connect farm profiles to the existing Supabase database.
- [ ] **Stage 7:** Build the complete dashboard.
- [ ] **Stage 8:** Implement genuine NASA satellite data integration.
- [ ] **Stage 9:** Implement weather and Kerala seasonal intelligence.
- [ ] **Stage 10:** Implement crop recommendations and crop calendars.
- [ ] **Stage 11:** Implement government schemes and agricultural support.
- [ ] **Stage 12:** Implement crop rotation and reports.
- [ ] **Stage 13:** Test the complete application.
- [ ] **Stage 14:** Deploy the frontend and backend.
