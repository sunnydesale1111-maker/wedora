"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("../src/config/prisma.js"));
const ai_service_js_1 = require("../src/services/ai.service.js");
const vendor_search_service_js_1 = require("../src/services/vendor-search.service.js");
const booking_service_js_1 = require("../src/services/booking.service.js");
const payment_service_js_1 = require("../src/services/payment.service.js");
const vendor_metrics_service_js_1 = require("../src/services/vendor-metrics.service.js");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function runAcceptanceTests() {
    console.log('========================================================');
    console.log('STARTING AI WEDDING TIMELINE ORCHESTRATOR ACCEPTANCE TESTS');
    console.log('========================================================\n');
    let passed = 0;
    let failed = 0;
    function assert(condition, testName, details) {
        if (condition) {
            console.log(`[PASS] ${testName}`);
            passed++;
        }
        else {
            console.error(`[FAIL] ${testName}${details ? ` -> ${details}` : ''}`);
            failed++;
        }
    }
    try {
        // --- TEST 1: Vendor Registration ---
        console.log('\n--- Running Test 1: Vendor Registration ---');
        const test1Email = `newvendor_${Date.now()}@test.com`;
        const passwordHash = await bcryptjs_1.default.hash('Test@123', 10);
        const cateringCat = await prisma_js_1.default.serviceCategory.findUnique({ where: { slug: 'catering' } });
        const newVendorUser = await prisma_js_1.default.user.create({
            data: {
                name: 'Veda Catering Master',
                email: test1Email,
                phone: '+919876543210',
                passwordHash,
                role: client_1.Role.VENDOR,
            },
        });
        const newVendor = await prisma_js_1.default.vendor.create({
            data: {
                userId: newVendorUser.id,
                businessName: 'Veda Organic Catering',
                businessDescription: 'Farm fresh traditional satvik wedding feasts',
                primaryCity: 'Pune',
                verificationStatus: 'VERIFIED',
            },
        });
        await prisma_js_1.default.vendorServiceArea.create({
            data: {
                vendorId: newVendor.id,
                city: 'Pune',
                area: 'Baner',
            },
        });
        const newService = await prisma_js_1.default.vendorService.create({
            data: {
                vendorId: newVendor.id,
                categoryId: cateringCat.id,
                serviceDescription: 'Organic buffet for grand weddings',
                maximumGuestCapacity: 1000,
                maximumSimultaneousBookings: 2,
                startingPrice: 350000,
            },
        });
        const futureDate = new Date('2027-02-20T00:00:00.000Z');
        await prisma_js_1.default.vendorAvailability.create({
            data: {
                vendorServiceId: newService.id,
                availabilityDate: futureDate,
                status: client_1.AvailabilityStatus.AVAILABLE,
                availableCapacity: 2,
            },
        });
        const test1Search = await vendor_search_service_js_1.VendorSearchService.searchVendors({
            category: 'catering',
            city: 'Pune',
            areas: ['Baner'],
            date: '2027-02-20',
            guestCount: 500,
        });
        const foundNewVendor = test1Search.results.some((r) => r.vendorId === newVendor.id);
        assert(foundNewVendor, 'Test 1 — Vendor Registration: Newly registered vendor appears in eligible search results');
        // --- TEST 2: AI Search & Mandatory Test Scenario (PRD Section 17) ---
        console.log('\n--- Running Test 2: AI Search & Mandatory Test Scenario ---');
        // Scenario:
        // Event: Wedding, Date: 15 December 2026, City: Pune, Area: Baner/Wakad, Guests: 500, Category: Catering
        // Expected: Exactly 2 catering vendors!
        const planner = await prisma_js_1.default.user.findUnique({ where: { email: 'planner@weddingorchestrator.com' } });
        const aiStep1 = await ai_service_js_1.AIService.processMessage({
            userId: planner.id,
            message: 'I am planning a wedding for 500 guests on 15 December 2026 in Pune around Baner and Wakad. Looking for catering.',
        });
        assert(aiStep1.totalMatched === 2, 'Test 2.1 — Mandatory Scenario: AI Search returns EXACTLY 2 eligible catering vendors on 15 Dec 2026 for 500 guests in Pune Baner/Wakad', `Got ${aiStep1.totalMatched} vendors instead of 2`);
        const vendorNames = aiStep1.matchingVendors?.map((v) => v.businessName) || [];
        assert(vendorNames.includes('Royal Feast Catering & Hospitality') && vendorNames.includes('Heritage Rasoi Caterers'), 'Test 2.2 — Returned vendors match the exact configured eligible caterers (Royal Feast and Heritage Rasoi)');
        // Verify all categories across Pune Baner/Wakad on 15 Dec 2026 has exactly 7 available vendors
        const allCategoriesSearch = await vendor_search_service_js_1.VendorSearchService.searchVendors({
            city: 'Pune',
            areas: ['Baner', 'Wakad'],
            date: '2026-12-15',
        });
        assert(allCategoriesSearch.totalMatched === 7, 'Test 2.3 — Mandatory Scenario Verification: Exactly 7 vendors available across all categories in Pune Baner/Wakad on 15 Dec 2026', `Got ${allCategoriesSearch.totalMatched} instead of 7`);
        // --- TEST 3: AI Memory & Context Carryover (PRD Section 7.3) ---
        console.log('\n--- Running Test 3: AI Memory & Multi-turn Session Context ---');
        // Follow-up message: "Now find decorators for the same wedding."
        const aiStep2 = await ai_service_js_1.AIService.processMessage({
            userId: planner.id,
            conversationId: aiStep1.conversationId,
            message: 'Now find decorators for the same wedding.',
        });
        assert(aiStep2.sessionState.city === 'Pune' &&
            aiStep2.sessionState.eventDate === '2026-12-15' &&
            aiStep2.sessionState.guestCount === 500 &&
            aiStep2.sessionState.serviceCategory === 'Decoration', 'Test 3.1 — Session Memory: Date (2026-12-15), City (Pune), and Guest Count (500) successfully retained when switching to decorators');
        assert(aiStep2.totalMatched === 1 && aiStep2.matchingVendors?.[0].businessName === 'Elegance Floral & Mandap Decor', 'Test 3.2 — Recalculated search for decorators on same date returns Elegance Floral & Mandap Decor', `Got ${aiStep2.totalMatched} vendors`);
        // --- TEST 4: Availability Confirmation & Inquiry ---
        console.log('\n--- Running Test 4: Inquiry Workflow ---');
        const testEvent = await prisma_js_1.default.event.findFirst({
            where: { ownerUserId: planner.id },
            orderBy: { createdAt: 'desc' },
        });
        const royalFeast = await prisma_js_1.default.vendor.findFirst({
            where: { businessName: 'Royal Feast Catering & Hospitality' },
            include: { services: true },
        });
        const inquiry = await prisma_js_1.default.inquiry.create({
            data: {
                eventId: testEvent.id,
                vendorServiceId: royalFeast.services[0].id,
                requesterId: planner.id,
                requirements: 'Multi-course lunch and dinner for 500 guests with live chaat counter',
                guestCount: 500,
                eventDate: testEvent.eventDate,
                budget: 450000,
            },
        });
        assert(inquiry.status === 'PENDING', 'Test 4 — Inquiry created with PENDING status attached to event and vendor service');
        // --- TEST 5: Quotation Workflow ---
        console.log('\n--- Running Test 5: Quotation Submission & Customer Acceptance ---');
        const quotation = await prisma_js_1.default.quotation.create({
            data: {
                inquiryId: inquiry.id,
                eventId: testEvent.id,
                vendorId: royalFeast.id,
                vendorServiceId: royalFeast.services[0].id,
                quotedAmount: 450000,
                serviceScope: '500 guests luxury banquet with live counter and dessert spread',
                additionalCharges: 25000, // Service tax & logistics
                validUntil: new Date('2026-12-01'),
                status: client_1.QuotationStatus.SENT,
            },
        });
        // Customer accepts quotation
        const acceptedQuotation = await prisma_js_1.default.quotation.update({
            where: { id: quotation.id },
            data: { status: client_1.QuotationStatus.ACCEPTED },
        });
        assert(acceptedQuotation.status === client_1.QuotationStatus.ACCEPTED, 'Test 5 — Quotation accepted by customer and linked to inquiry and event');
        // --- TEST 6: Booking Confirmation & Capacity Reservation ---
        console.log('\n--- Running Test 6: Booking Confirmation & Double-Booking Prevention ---');
        const booking = await booking_service_js_1.BookingService.confirmBooking({
            quotationId: acceptedQuotation.id,
            userId: planner.id,
        });
        assert(booking.status === client_1.BookingStatus.CONFIRMED && booking.agreedAmount === 475000, 'Test 6.1 — Booking confirmed with agreed total amount (₹4,75,000)');
        // Check calendar remaining capacity after booking
        const calEntryAfterBooking = await prisma_js_1.default.vendorAvailability.findFirst({
            where: {
                vendorServiceId: royalFeast.services[0].id,
                availabilityDate: testEvent.eventDate,
            },
        });
        assert(calEntryAfterBooking?.availableCapacity === 1, 'Test 6.2 — Vendor calendar remaining capacity decremented from 2 to 1');
        // --- TEST 7: Simulated Payment System & Financial Integrity ---
        console.log('\n--- Running Test 7: Simulated Demo Payment & Balances ---');
        const simPayment = await payment_service_js_1.PaymentService.simulatePayment({
            bookingId: booking.id,
            eventId: testEvent.id,
            payerId: planner.id,
            payeeId: royalFeast.userId,
            amount: 200000, // 2 lakhs advance
            paymentType: client_1.PaymentType.PLANNER_TO_VENDOR,
            paymentPurpose: '50% Advance Booking Deposit (Simulated)',
        });
        assert(simPayment.payment.status === client_1.PaymentStatus.PAID &&
            simPayment.payment.isSimulated === true &&
            simPayment.financialSummary.outstandingBalance === 275000, 'Test 7.1 — Simulated payment logged with is_simulated=true and remaining balance calculated as ₹2,75,000');
        // Test financial integrity: attempting to pay more than remaining balance must throw error
        let overpaymentBlocked = false;
        try {
            await payment_service_js_1.PaymentService.simulatePayment({
                bookingId: booking.id,
                eventId: testEvent.id,
                payerId: planner.id,
                payeeId: royalFeast.userId,
                amount: 300000, // Exceeds remaining 275000!
                paymentType: client_1.PaymentType.PLANNER_TO_VENDOR,
                paymentPurpose: 'Overpayment test',
            });
        }
        catch (err) {
            overpaymentBlocked = true;
        }
        assert(overpaymentBlocked, 'Test 7.2 — Financial Integrity: Overpayment exceeding outstanding balance is strictly blocked');
        // --- TEST 8: Vendor Performance Recalculation (90 Days Rolling) ---
        console.log('\n--- Running Test 8: Vendor Performance Recalculation ---');
        const metricsBefore = await vendor_metrics_service_js_1.VendorMetricsService.calculateMetrics(royalFeast.id);
        // Mark the booking as COMPLETED
        await booking_service_js_1.BookingService.completeBooking(booking.id, planner.id);
        const metricsAfter = await vendor_metrics_service_js_1.VendorMetricsService.calculateMetrics(royalFeast.id);
        assert(metricsAfter.completedOrdersCount90Days === metricsBefore.completedOrdersCount90Days + 1, 'Test 8 — 90-Day Performance: Completed-order count increments automatically when booking is marked Completed');
        // --- TEST 9: Strict Data Isolation ---
        console.log('\n--- Running Test 9: Data Isolation & Permissions ---');
        const strangerUser = await prisma_js_1.default.user.create({
            data: {
                name: 'Unauthorized Stranger',
                email: `stranger_${Date.now()}@test.com`,
                phone: '+919999999999',
                passwordHash,
                role: client_1.Role.CUSTOMER,
            },
        });
        let isolationDenied = false;
        try {
            // Stranger attempts to confirm booking for planner's event
            await booking_service_js_1.BookingService.confirmBooking({
                quotationId: acceptedQuotation.id,
                userId: strangerUser.id,
            });
        }
        catch (err) {
            isolationDenied = err.message.includes('Unauthorized') || err.message.includes('not own');
        }
        assert(isolationDenied, 'Test 9 — Data Isolation: Unauthorized user cannot confirm or access another user private booking');
        // --- SUMMARY ---
        console.log('\n========================================================');
        console.log(`ACCEPTANCE TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
        console.log('========================================================\n');
        if (failed > 0) {
            process.exit(1);
        }
    }
    catch (err) {
        console.error('Test execution exception:', err);
        process.exit(1);
    }
    finally {
        await prisma_js_1.default.$disconnect();
    }
}
runAcceptanceTests();
