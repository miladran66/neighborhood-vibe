# 🏙️ VibeCheck — Toronto Neighborhood Explorer

Check the vibe of any Toronto neighborhood with AI-powered insights.

## Features
- 🚶 Walk / Transit / Bike scores
- 🍽️ Nearby restaurants, schools, transit stops
- 🤖 AI-generated neighborhood summary (Claude)
- 📱 API-first design (mobile-ready)

## Tech Stack
- **Backend:** FastAPI + Python
- **AI:** Claude API (Anthropic)
- **Data:** Google Maps API + Walk Score API
- **Frontend:** HTML + CSS + Vanilla JS

---

## Setup

### 1. Get API Keys
- **Google Maps:** https://console.cloud.google.com → Enable: Geocoding API, Places API
- **Walk Score:** https://www.walkscore.com/professional/api.php
- **Anthropic:** https://console.anthropic.com

### 2. Configure Environment
```bash
cd backend
cp .env.example .env
# Edit .env and add your API keys
```

### 3. Run with Docker
```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### 4. Run Locally (no Docker)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## API Endpoints

### `GET /api/neighborhood?address={address}`
Returns full neighborhood vibe data.

**Example:**
```
GET /api/neighborhood?address=401+King+St+W,+Toronto
```

**Response:**
```json
{
  "address": "401 King St W, Toronto",
  "formatted_address": "401 King St W, Toronto, ON M5V 1K1, Canada",
  "lat": 43.6447,
  "lng": -79.3988,
  "transit": {
    "walk_score": 98,
    "walk_description": "Walker's Paradise",
    "transit_score": 100,
    "transit_description": "Rider's Paradise",
    "bike_score": 89
  },
  "nearby_places": [...],
  "ai_summary": "King West is a vibrant urban hub...",
  "vibe_score": 92
}
```

---

## Mobile App (Coming Soon)
The backend is API-first. A React Native or Flutter app can consume the same endpoints.

## Project Structure
```
neighborhood-vibe/
├─ backend/
│  ├─ app/
│  │  ├─ main.py
│  │  ├─ config.py
│  │  ├─ routers/neighborhood.py
│  │  ├─ services/
│  │  │  ├─ maps.py
│  │  │  ├─ walkscore.py
│  │  │  └─ ai_summary.py
│  │  └─ models/neighborhood.py
│  └─ Dockerfile
├─ frontend-web/
│  └─ index.html
└─ docker-compose.yml
```
