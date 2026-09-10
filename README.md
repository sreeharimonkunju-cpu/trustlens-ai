# TrustLens AI

A polished React + TypeScript hackathon MVP for **AI-based fake identity and document screening**.

## 1. Install Node.js
Install Node.js 20+ from https://nodejs.org/

## 2. Open the project
Extract this ZIP, then open the `trustlens-ai` folder in VS Code.

## 3. Install dependencies
Open VS Code Terminal:

```bash
npm install
```

## 4. Start the app

```bash
npm run dev
```

Open the localhost URL Vite prints, usually `http://localhost:5173`.

## 5. Judge demo flow
1. Landing page → **Try Demo**
2. Select **Demo Case 2 — Altered Document**
3. Click **Start Verification**
4. Let the animated pipeline complete
5. Open **Why?**
6. Open **Document Analysis**
7. Go to **Risk Reports**
8. Go to **History**
9. Try **Settings → Theme / Notifications / Risk Thresholds**

## Architecture

- `src/services/mockAI.ts` — deterministic mock AI engine
- `src/config.ts` — risk thresholds and scoring weights
- `src/context.tsx` — session state + localStorage
- `src/components/` — reusable UI
- `src/App.tsx` — routes and page composition

### Real AI integration later

Replace functions in `src/services/mockAI.ts` with API calls to FastAPI, Tesseract/OpenCV, face-embedding verification, or another approved service.

Suggested API contracts:

- `POST /api/analyze-document`
- `POST /api/verify-face`
- `POST /api/identity-consistency`
- `POST /api/calculate-risk`

## Important
This is a **screening prototype**, not a government-grade identity verification system. Use synthetic/demo documents only. The Trust Score represents risk-screening signals and should not be presented as definitive proof of identity or document authenticity.
