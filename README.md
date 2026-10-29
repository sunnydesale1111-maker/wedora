# AI Wedding Timeline Orchestrator (Backend MVP)
**Coordinating the Entire Planning Journey**

B2B2C SaaS Platform for Wedding and Event Planning, Vendor Availability Orchestration, and Verified Business Activity Metrics.

---

## Architecture Overview

```
                      +-----------------------------------+
                      |         Lovable Frontend          |
                      |   (React + Vite + Tailwind CSS)   |
                      +-----------------+-----------------+
                                        |  HTTP / REST
                                        v
                      +-----------------+-----------------+
                      |     Express.js API Server         |
                      |          (Port 5001)              |
                      +-----------------+-----------------+
                                        |
       +--------------------------------+--------------------------------+
       |                                |                                |
       v                                v                                v
+--------------+               +------------------+             +-----------------+
| Auth & RBAC  |               | AI Discovery     |             | Booking &       |
| (JWT Tokens) |               | Engine (Gemini / |             | Simulated       |
|              |               | Multi-turn NLP)  |             | Payments        |
+--------------+               +------------------+             +-----------------+
       |                                |                                |
       +--------------------------------+--------------------------------+
                                        |
                                        v
                      +-----------------+-----------------+
                      |     Prisma ORM & PostgreSQL       |
                      |    (DB: wedding_orchestrator)     |
                      +-----------------------------------+
```

---

## Key Features Implemented

1. **Mandatory Design Preservation Rule**:
   - Zero hardcoded design assumptions. Backend is completely decoupled, providing a fully typed client SDK (`client-sdk/api.ts`) ready for Lovable frontend integration.
2. **Three Distinct User Roles & Strict Data Isolation**:
   - `VENDOR`: Registration, multi-service listings, calendar availability, inquiries, quotations, order tracking, and vendor dashboard.
   - `PLANNER`: Multi-client and multi-event management, AI vendor discovery, shortlisting, simulated demo payments, and timeline tracking.
   - `CUSTOMER`: Personal event creation, AI discovery, booking, payments, and timeline management.
3. **Verified Business Activity Metrics (No Traditional Star Ratings)**:
   - Rolling 90-day completed order count.
   - Rolling 90-day Average Order Value (AOV).
   - "New to Platform — No verified transaction history yet" indicator for new vendors.
   - Automated server-side calculation; vendors cannot manually tamper with performance metrics.
4. **AI-Powered Vendor Discovery Engine**:
   - Natural language coordinator extracting: `eventType`, `eventDate`, `city`, `areas`, `serviceCategory`, `guestCount`, and `budget`.
   - **Multi-turn Session Memory**: Retains event context across conversation turns (e.g., date, city, and guest count are preserved when switching services).
   - **Factual Execution**: Parameterized database queries prevent hallucinated vendor availability or pricing.
   - Dual-engine: Configured for Google Gemini with a deterministic rule-based NLP fallback.
5. **Mandatory Test Scenario Verified (PRD Section 17)**:
   - 50 fictional vendors seeded across Pune, Mumbai, Nashik, Bengaluru, and Hyderabad.
   - On **15 December 2026** in **Pune (Baner/Wakad)**: exactly **7 vendors** are available across all categories, and **EXACTLY 2 are eligible catering vendors** for 500 guests (`Royal Feast Catering` and `Heritage Rasoi Caterers`).
6. **Booking & Capacity Management**:
   - Validates calendar availability and capacity upon final confirmation.
   - Double-booking prevention: Automatically reserves capacity or marks calendar `FULLY_BOOKED` when slots are filled.
7. **Simulated Payment System (Section 12)**:
   - Clear disclaimer: `is_simulated = true` ("Simulation — No Real Money Will Be Charged").
   - Financial integrity checks: Overpayments and duplicate submissions are blocked.
8. **Event Timeline Tracker (Section 13)**:
   - Tasks linked to bookings, deadlines, and assigned users.

---

## Local Setup & Development

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+) running on `localhost:5432`

### Backend Setup
1. Navigate to `server/`:
   ```bash
   cd server
   ```
2. Ensure `.env` is configured:
   ```env
   PORT=5001
   DATABASE_URL="postgresql://postgres:password@localhost:5432/wedding_orchestrator?schema=public"
   JWT_SECRET="super_secret_wedding_timeline_orchestrator_jwt_key_2026"
   NODE_ENV="development"
   GEMINI_API_KEY="" # Optional
   ```
3. Push database schema & generate Prisma client:
   ```bash
   npx prisma db push
   ```
4. Seed demo data (50 vendors, categories, and test accounts):
   ```bash
   npm run prisma:seed
   ```
5. Run the automated acceptance test suite:
   ```bash
   npm run test:acceptance
   ```
6. Start the development server:
   ```bash
   npm run dev
   # or npm run build && npm start
   ```

---

## Automated Acceptance Test Results

All 14 test scenarios specified in the PRD passed:
- `Test 1` — Vendor Registration & Profile Publishing: **PASS**
- `Test 2.1` — Mandatory Scenario: Exactly 2 catering vendors on 15 Dec 2026 for 500 guests in Pune Baner/Wakad: **PASS**
- `Test 2.2` — Returned vendors match Royal Feast and Heritage Rasoi: **PASS**
- `Test 2.3` — Exactly 7 available vendors across all categories on 15 Dec 2026 in Pune Baner/Wakad: **PASS**
- `Test 3.1` — Multi-turn Session Memory (carries over date, city, guests): **PASS**
- `Test 3.2` — Recalculates decorators for the same wedding context: **PASS**
- `Test 4` — Customer inquiry submission: **PASS**
- `Test 5` — Vendor quotation submission and customer acceptance: **PASS**
- `Test 6.1` — Booking confirmation with agreed amount: **PASS**
- `Test 6.2` — Vendor calendar capacity decremented: **PASS**
- `Test 7.1` — Simulated demo payment logged with balance calculations: **PASS**
- `Test 7.2` — Financial Integrity: Overpayments strictly blocked: **PASS**
- `Test 8` — 90-Day rolling activity metrics recalculated upon completion: **PASS**
- `Test 9` — Strict data isolation across unauthorized users: **PASS**
