# Lovable Frontend Integration Guide
## AI Wedding Timeline Orchestrator (B2B2C SaaS MVP)

This guide documents the technical handoff and step-by-step instructions for integrating the frontend designed in **Lovable** with the **Antigravity Functional Backend**.

---

### Mandatory Design Preservation Rule
> **DO NOT redesign, replace, or substantially modify the Lovable frontend.**
> All layouts, typography, Tailwind styles, and UI components from Lovable must be preserved. The backend is designed as an un-opinionated API that binds directly to the Lovable components via a typed SDK.

---

## 1. Quick Integration Steps (When Lovable Export is Provided)

1. **Extract/Place Lovable Code**:
   - Place the exported Lovable frontend files into `e:\Wedding Timeline Orchestrator\frontend` (or directly in the root directory if preferred).
2. **Copy the API Client SDK**:
   - Copy `e:\Wedding Timeline Orchestrator\client-sdk\api.ts` into your frontend's `src/lib/api.ts` (or `src/api/client.ts`).
3. **Environment Configuration**:
   - Create `.env` in the frontend root:
     ```env
     VITE_API_URL=http://localhost:5001/api
     ```
4. **Vite Proxy (Optional Convenience)**:
   In `vite.config.ts`, you can configure proxy forwarding:
   ```ts
   server: {
     proxy: {
       '/api': {
         target: 'http://localhost:5001',
         changeOrigin: true,
       }
     }
   }
   ```

---

## 2. Component-to-API Binding Map

| Lovable Component | Functional Backend API | Description |
|---|---|---|
| **Login / Signup Dialogs** | `api.auth.login()`, `api.auth.register()` | Role-based onboarding for Vendor, Event Planner, and Customer. JWT token automatically saved in `localStorage`. |
| **AI Discovery Chatbot** | `api.ai.chat({ message, conversationId })` | Natural language event coordinator with multi-turn session memory. Extracts structured parameters and executes factual DB searches. |
| **Vendor Search / Results Grid** | `api.vendors.search(filters)` | Real database filtering (Category, City, Areas, Date, Guests, Budget). Returns verified 90-day activity metrics. |
| **Vendor Performance Card** | `vendor.metrics.metricDisplayText` | Displays **"Completed Orders — Last 90 Days"** and **"Average Order Value — Last 90 Days"** (no star ratings). |
| **Vendor Calendar View** | `api.vendors.getAvailability(id)` | Shows dates marked `AVAILABLE`, `FULLY_BOOKED`, `TENTATIVELY_RESERVED`, or `UNAVAILABLE`. |
| **Request Quotation Modal** | `api.inquiries.create({ eventId, vendorServiceId, requirements })` | Submits structured customer inquiry with guest count and budget. |
| **Vendor Quotation Form** | `api.quotations.create(payload)` | Vendor submits quoted amount, inclusions, additional charges, and payment terms. |
| **Quotation Acceptance** | `api.quotations.respond(id, 'ACCEPT')` | Customer accepts quotation before booking. |
| **Confirm Booking Button** | `api.bookings.confirm(quotationId)` | Validates availability, reserves capacity, prevents double-booking, and creates a linked timeline task. |
| **Simulated Demo Payment** | `api.payments.simulate(payload)` | Simulates payment with balance validation and displays "Simulation — No Real Money Charged". |
| **Event Timeline Board** | `api.events.getTimeline(eventId)`, `api.timeline.*` | Lightweight task tracker with deadlines, assignees, and booking status links. |
| **Vendor Dashboard** | `api.vendors.getDashboard()` | Aggregates inquiries, pending quotations, confirmed bookings, and 90-day activity statistics. |

---

## 3. Seeded Demo Accounts (Ready to Test)

| Role | Email | Password | Details |
|---|---|---|---|
| **Professional Event Planner** | `planner@weddingorchestrator.com` | `Demo@12345` | Has multi-event dashboard and mandatory 15 Dec 2026 test event pre-created. |
| **Individual Customer** | `customer@weddingorchestrator.com` | `Demo@12345` | Has personal event and demo booking history. |
| **Catering Vendor 1** | `vendor1@royalfeast.com` | `Demo@12345` | **Royal Feast Catering** (Baner/Wakad, Pune; Capacity: 1200 guests; 4 completed orders in last 90 days). |
| **Catering Vendor 2** | `vendor2@heritagerasoi.com` | `Demo@12345` | **Heritage Rasoi Caterers** (Baner/Wakad, Pune; Capacity: 800 guests; 3 completed orders in last 90 days). |

---

## 4. Mandatory Test Scenario Verification (PRD Section 17)

To verify the mandatory test scenario:
1. Log in as `planner@weddingorchestrator.com`.
2. In the AI Chatbot, send:
   > *"I am planning a wedding for 500 guests on 15 December 2026 in Pune around Baner and Wakad. Looking for catering."*
3. **Verified Result:**
   - The AI identifies the date (`2026-12-15`), city (`Pune`), areas (`Baner`, `Wakad`), guest count (`500`), and category (`Catering`).
   - The chatbot returns **EXACTLY TWO** eligible catering vendors:
     1. **Royal Feast Catering & Hospitality** (Capacity: 1200)
     2. **Heritage Rasoi Caterers** (Capacity: 800)
4. Send the follow-up message:
   > *"Now find decorators for the same wedding."*
5. **Verified Result (Session Memory):**
   - The AI retains `2026-12-15`, `Pune`, and `500 guests` without asking again.
   - Returns **Elegance Floral & Mandap Decor** (the only available decorator matching the date and area).
