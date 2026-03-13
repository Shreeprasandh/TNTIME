# ⚡ TNTIME
### A hyper-local, real-time situational awareness dashboard for Tamil Nadu.

<p align="center">
  <img src="docs/screenshot.png" alt="TNTIME War Room Dashboard" width="800" />
</p>

> *"Know your state. In real time."*

---

## Overview

**TNTIME** is a cinematic, intelligence-grade dashboard that aggregates, classifies, and visualises live events happening across Tamil Nadu. Built with a **War Room** aesthetic — dark charcoal maps, neon glow markers, monospaced readouts — it transforms raw news and sensor data into an instantly readable situational picture.

---

## Tech Stack

| Layer      | Technology                                        |
|------------|---------------------------------------------------|
| Frontend   | React (Vite), Tailwind CSS, MapLibre GL JS        |
| Backend    | Java 17, Spring Boot 3, Spring WebFlux            |
| Database   | PostgreSQL 15 + PostGIS (via Docker)              |
| Data       | GDELT API (IN25 / Tamil Nadu), TN RSS Feeds       |

---

## Features

- 🗺️ **Spotlight Map** — MapLibre GL JS locked to Tamil Nadu's bounding box with an inverted dark blur mask for neighboring regions
- 🔴 **Neon Event Pins** — Colour-coded, pulsing markers by category (Politics, Accidents, Weather, Crime)
- ⚡ **Live Sidebar Feed** — Real-time scrolling event list with category filters and auto-scroll
- 🕐 **JetBrains Mono Readouts** — Hacker-aesthetic monospaced timestamps and metrics
- 🐳 **Zero-setup backend** — Docker Compose spins up PostGIS automatically

---

## Project Structure

```
tntime/
├── backend/
│   ├── docker-compose.yml          # PostGIS container
│   ├── src/main/java/com/tntime/
│   │   ├── config/                 # CORS & DB config
│   │   ├── controllers/            # REST APIs
│   │   ├── models/                 # GeoEvent entity
│   │   ├── repositories/           # Spatial queries
│   │   └── services/               # GDELT & RSS pollers
│   └── pom.xml
└── frontend/
    ├── public/
    │   └── tn-mask.geojson         # Inverted spotlight mask
    └── src/
        ├── components/
        │   ├── MapCore.jsx
        │   ├── Sidebar.jsx
        │   └── NeonPin.jsx
        ├── hooks/
        │   └── useLiveEvents.js
        └── App.jsx
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- Java 17+
- Docker & Docker Compose

### 1. Start the Database
```bash
cd backend
docker compose up -d
```

### 2. Start the Backend
```bash
cd backend
./mvnw spring-boot:run
# API available at http://localhost:8080/api/events/live
```

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
# Dashboard at http://localhost:5173
```

---

## License

MIT © 2026 Shreeprasandh
