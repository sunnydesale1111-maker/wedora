"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('--- Starting Database Seeding ---');
    // Clean existing data
    await prisma.aIMessage.deleteMany({});
    await prisma.aIConversation.deleteMany({});
    await prisma.timelineTask.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.quotation.deleteMany({});
    await prisma.inquiry.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.vendorAvailability.deleteMany({});
    await prisma.vendorServiceArea.deleteMany({});
    await prisma.vendorService.deleteMany({});
    await prisma.serviceCategory.deleteMany({});
    await prisma.vendor.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('Existing records cleared.');
    const defaultPasswordHash = await bcryptjs_1.default.hash('Demo@12345', 10);
    // 1. Seed Service Categories
    const categoriesData = [
        { categoryName: 'Catering', slug: 'catering', description: 'Gourmet catering, multi-cuisine buffets, and live food counters.' },
        { categoryName: 'Decoration', slug: 'decoration', description: 'Floral stages, theme mandaps, entry tunnels, and floral art.' },
        { categoryName: 'Lighting', slug: 'lighting', description: 'Architectural mood lighting, truss rigs, moving heads, and fairy lights.' },
        { categoryName: 'Photography', slug: 'photography', description: 'Candid photography, traditional videography, and drone coverage.' },
        { categoryName: 'Sound', slug: 'sound', description: 'Line array audio systems, professional DJ equipment, and wireless mics.' },
        { categoryName: 'Furniture Rental', slug: 'furniture-rental', description: 'Banquet chairs, vintage sofas, dining tables, and lounge setups.' },
        { categoryName: 'Event Equipment', slug: 'event-equipment', description: 'Silent diesel generators, AC towers, mist fans, and stage platforms.' },
        { categoryName: 'Logistics', slug: 'logistics', description: 'Luxury bridal cars, guest shuttle vans, and luggage management.' },
    ];
    const categoryMap = new Map();
    for (const cat of categoriesData) {
        const created = await prisma.serviceCategory.create({ data: cat });
        categoryMap.set(cat.slug, created.id);
    }
    console.log(`Created ${categoriesData.length} service categories.`);
    // 2. Create Demo Users: Planner & Customer
    const plannerUser = await prisma.user.create({
        data: {
            name: 'Aditi Sharma',
            email: 'planner@weddingorchestrator.com',
            phone: '+919822011111',
            passwordHash: defaultPasswordHash,
            role: client_1.Role.PLANNER,
        },
    });
    const customerUser = await prisma.user.create({
        data: {
            name: 'Rohan Kulkarni',
            email: 'customer@weddingorchestrator.com',
            phone: '+919822022222',
            passwordHash: defaultPasswordHash,
            role: client_1.Role.CUSTOMER,
        },
    });
    console.log('Created Planner and Customer users.');
    // Target Test Date: 15 December 2026
    const targetTestDate = new Date('2026-12-15T00:00:00.000Z');
    // 3. SEED 50 VENDORS
    // Distribution:
    // - Pune (18 vendors)
    // - Mumbai (12 vendors)
    // - Nashik (8 vendors)
    // - Bengaluru (6 vendors)
    // - Hyderabad (6 vendors)
    const vendorsConfig = [
        // --- EXACT 7 VENDORS AVAILABLE ON 15 DEC 2026 IN PUNE BANER/WAKAD ---
        // [1] ELIGIBLE CATERING 1
        {
            name: 'Royal Feast Catering & Hospitality',
            email: 'vendor1@royalfeast.com',
            city: 'Pune',
            areas: ['Baner', 'Wakad', 'Aundh', 'Hinjewadi'],
            services: [
                { cat: 'catering', desc: 'Luxury multi-course Maharashtrian, North Indian, and Continental catering with live counters.', maxGuests: 1200, price: 450000, maxSim: 2 },
            ],
            availableOnTestDate: true,
            hasRecentOrders: true,
            recentOrderCount: 6,
            orderValues: [480000, 420000, 510000, 460000, 440000, 490000],
        },
        // [2] ELIGIBLE CATERING 2
        {
            name: 'Heritage Rasoi Caterers',
            email: 'vendor2@heritagerasoi.com',
            city: 'Pune',
            areas: ['Wakad', 'Baner', 'Kothrud'],
            services: [
                { cat: 'catering', desc: 'Authentic royal wedding banquets, artisanal desserts, and traditional satvik feast options.', maxGuests: 800, price: 380000, maxSim: 2 },
            ],
            availableOnTestDate: true,
            hasRecentOrders: true,
            recentOrderCount: 4,
            orderValues: [360000, 400000, 390000, 370000],
        },
        // [3] OTHER SERVICE AVAILABLE ON TEST DATE: DECORATION
        {
            name: 'Elegance Floral & Mandap Decor',
            email: 'decor.elegance@pune.test',
            city: 'Pune',
            areas: ['Baner', 'Wakad', 'Aundh'],
            services: [
                { cat: 'decoration', desc: 'Grand floral mandaps, fairy tale aisles, and eco-friendly wedding styling.', maxGuests: 2000, price: 250000, maxSim: 2 },
            ],
            availableOnTestDate: true,
            hasRecentOrders: true,
            recentOrderCount: 5,
            orderValues: [220000, 260000, 240000, 280000, 250000],
        },
        // [4] OTHER SERVICE AVAILABLE ON TEST DATE: LIGHTING
        {
            name: 'Lumina Wedding Illumination',
            email: 'lumina.lights@pune.test',
            city: 'Pune',
            areas: ['Baner', 'Wakad', 'Kothrud'],
            services: [
                { cat: 'lighting', desc: 'Architectural mood lighting, kinetic lights, and laser canopy experiences.', maxGuests: null, price: 150000, maxSim: 2 },
            ],
            availableOnTestDate: true,
            hasRecentOrders: true,
            recentOrderCount: 3,
            orderValues: [140000, 160000, 150000],
        },
        // [5] OTHER SERVICE AVAILABLE ON TEST DATE: PHOTOGRAPHY
        {
            name: 'Candid Moments Studio Pune',
            email: 'candidmoments@pune.test',
            city: 'Pune',
            areas: ['Baner', 'Wakad', 'Viman Nagar'],
            services: [
                { cat: 'photography', desc: 'Cinematic 4K wedding films, drone videography, and timeless fine-art portraits.', maxGuests: null, price: 180000, maxSim: 2 },
            ],
            availableOnTestDate: true,
            hasRecentOrders: false, // New to Platform test
            recentOrderCount: 0,
            orderValues: [],
        },
        // [6] OTHER SERVICE AVAILABLE ON TEST DATE: SOUND
        {
            name: 'BeatPulse Sound & DJ Systems',
            email: 'beatpulse@pune.test',
            city: 'Pune',
            areas: ['Baner', 'Wakad', 'Hinjewadi'],
            services: [
                { cat: 'sound', desc: 'Concert line arrays, JBL VTX rigs, Pioneer CDJ-3000 setups, and wedding party sound.', maxGuests: null, price: 95000, maxSim: 2 },
            ],
            availableOnTestDate: true,
            hasRecentOrders: true,
            recentOrderCount: 4,
            orderValues: [90000, 100000, 95000, 95000],
        },
        // [7] OTHER SERVICE AVAILABLE ON TEST DATE: FURNITURE RENTAL
        {
            name: 'Royal Lounges & Furniture Rentals',
            email: 'royallounges@pune.test',
            city: 'Pune',
            areas: ['Baner', 'Wakad', 'Bavdhan'],
            services: [
                { cat: 'furniture-rental', desc: 'Chiavari gold chairs, royal velvet maharaja sofas, and cocktail bar high tables.', maxGuests: 1500, price: 120000, maxSim: 2 },
            ],
            availableOnTestDate: true,
            hasRecentOrders: true,
            recentOrderCount: 3,
            orderValues: [110000, 130000, 120000],
        },
        // --- NON-ELIGIBLE CATERING ON TEST DATE ---
        // [8] Catering in Baner but FULLY_BOOKED on 15 Dec 2026
        {
            name: 'Saffron Spice Banquets',
            email: 'saffronspice@pune.test',
            city: 'Pune',
            areas: ['Baner', 'Wakad'],
            services: [
                { cat: 'catering', desc: 'Signature gourmet catering and destination wedding menus.', maxGuests: 1000, price: 420000, maxSim: 1 },
            ],
            availableOnTestDate: false, // FULLY BOOKED
            hasRecentOrders: true,
            recentOrderCount: 3,
            orderValues: [400000, 420000, 410000],
        },
        // [9] Catering in Pune but ONLY serving East Pune (Hadapsar, Kharadi) - does NOT serve Baner/Wakad
        {
            name: 'Grand East Pune Caterers',
            email: 'grandeast@pune.test',
            city: 'Pune',
            areas: ['Hadapsar', 'Kharadi', 'Magarpatta'],
            services: [
                { cat: 'catering', desc: 'East Pune premium wedding caterers.', maxGuests: 1000, price: 350000, maxSim: 2 },
            ],
            availableOnTestDate: true, // Available, but area doesn't match Baner/Wakad
            hasRecentOrders: true,
            recentOrderCount: 2,
            orderValues: [340000, 360000],
        },
        // [10] Catering in Baner, but guest capacity is ONLY 200 (less than 500 guests requested)
        {
            name: 'Boutique Bites Private Dining',
            email: 'boutiquebites@pune.test',
            city: 'Pune',
            areas: ['Baner', 'Wakad'],
            services: [
                { cat: 'catering', desc: 'Intimate boutique catering for close family weddings and cocktail parties.', maxGuests: 200, price: 180000, maxSim: 1 },
            ],
            availableOnTestDate: false, // Fully booked on test date
            hasRecentOrders: true,
            recentOrderCount: 2,
            orderValues: [180000, 190000],
        },
        // --- OTHER PUNE VENDORS (11 - 18) ---
        {
            name: 'Maratha Shahi Wedding Decorators',
            email: 'marathashahi@pune.test',
            city: 'Pune',
            areas: ['Kothrud', 'Deccan'],
            services: [{ cat: 'decoration', desc: 'Traditional Peshwai theme weddings and royal entrance gates.', maxGuests: 1000, price: 280000, maxSim: 1 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 2,
            orderValues: [270000, 290000],
        },
        {
            name: 'Apex Event Power & Generators',
            email: 'apexpower@pune.test',
            city: 'Pune',
            areas: ['Baner', 'Hinjewadi'],
            services: [{ cat: 'event-equipment', desc: '125kVA silent Cummins generators and power distribution panels.', maxGuests: null, price: 45000, maxSim: 3 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 3,
            orderValues: [40000, 45000, 50000],
        },
        {
            name: 'Shree Ganesh Wedding Logistics',
            email: 'shreeganesh@pune.test',
            city: 'Pune',
            areas: ['Baner', 'Wakad', 'Shivaji Nagar'],
            services: [{ cat: 'logistics', desc: 'Mercedes and vintage Rolls Royce bridal convoy and guest luxury mini-coaches.', maxGuests: null, price: 110000, maxSim: 2 }],
            availableOnTestDate: false,
            hasRecentOrders: false,
            recentOrderCount: 0,
            orderValues: [],
        },
        {
            name: 'Aundh Sound & Light Crafters',
            email: 'aundhsound@pune.test',
            city: 'Pune',
            areas: ['Aundh', 'Baner'],
            services: [
                { cat: 'sound', desc: 'Digital audio consoles and wireless frequency management.', maxGuests: null, price: 75000, maxSim: 1 },
                { cat: 'lighting', desc: 'Sharpy moving heads and strobe stages.', maxGuests: null, price: 85000, maxSim: 1 },
            ],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 2,
            orderValues: [80000, 85000],
        },
        {
            name: 'Pristine Lens Wedding Cinematics',
            email: 'pristinelens@pune.test',
            city: 'Pune',
            areas: ['Kalyani Nagar', 'Viman Nagar'],
            services: [{ cat: 'photography', desc: 'Sony FX3 cinema line multi-camera wedding films.', maxGuests: null, price: 210000, maxSim: 1 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 3,
            orderValues: [200000, 210000, 220000],
        },
        {
            name: 'Kothrud Mandap & Banquet Furnishings',
            email: 'kothrudmandap@pune.test',
            city: 'Pune',
            areas: ['Kothrud', 'Karve Nagar'],
            services: [{ cat: 'furniture-rental', desc: 'Wooden dining sets, cocktail high tables, and velvet bolsters.', maxGuests: 800, price: 80000, maxSim: 2 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 1,
            orderValues: [80000],
        },
        {
            name: 'Symphony Live Wedding Band',
            email: 'symphonyband@pune.test',
            city: 'Pune',
            areas: ['Baner', 'Koregaon Park'],
            services: [{ cat: 'sound', desc: 'Live acoustic, shehnai, dhol tasha, and fusion orchestra.', maxGuests: null, price: 125000, maxSim: 1 }],
            availableOnTestDate: false,
            hasRecentOrders: false,
            recentOrderCount: 0,
            orderValues: [],
        },
        {
            name: 'Deccan Royal Banquets & Food',
            email: 'deccanroyal@pune.test',
            city: 'Pune',
            areas: ['Deccan', 'Swargate'],
            services: [{ cat: 'catering', desc: 'Central Pune traditional Maharashtrian catering.', maxGuests: 600, price: 320000, maxSim: 1 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 2,
            orderValues: [310000, 330000],
        },
        // --- MUMBAI VENDORS (19 - 30) ---
        {
            name: 'Bandra Royal Gourmet Caterers',
            email: 'bandracaterers@mumbai.test',
            city: 'Mumbai',
            areas: ['Bandra', 'Juhu', 'Andheri'],
            services: [{ cat: 'catering', desc: 'Mumbai high-society multi-cuisine luxury catering.', maxGuests: 1500, price: 650000, maxSim: 2 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 5,
            orderValues: [620000, 680000, 650000, 670000, 640000],
        },
        {
            name: 'Juhu Oceanfront Wedding Decorators',
            email: 'juhudecor@mumbai.test',
            city: 'Mumbai',
            areas: ['Juhu', 'Bandra'],
            services: [{ cat: 'decoration', desc: 'Beachside mandaps, bohemian gazebos, and exotic flowers.', maxGuests: 1200, price: 450000, maxSim: 2 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 4,
            orderValues: [440000, 460000, 450000, 480000],
        },
        {
            name: 'Bollywood Beats Sound & Lights',
            email: 'bollybeats@mumbai.test',
            city: 'Mumbai',
            areas: ['Andheri', 'Bandra', 'Powai'],
            services: [
                { cat: 'sound', desc: 'Celebrity DJ riders and Arena audio setups.', maxGuests: null, price: 180000, maxSim: 2 },
                { cat: 'lighting', desc: 'Pixel mapped LED walls and beam arrays.', maxGuests: null, price: 220000, maxSim: 2 },
            ],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 3,
            orderValues: [190000, 210000, 200000],
        },
        {
            name: 'South Bombay Lensmen',
            email: 'sobophoto@mumbai.test',
            city: 'Mumbai',
            areas: ['Colaba', 'Marine Drive', 'Worli'],
            services: [{ cat: 'photography', desc: 'Editorial bridal spreads and heritage palace wedding films.', maxGuests: null, price: 320000, maxSim: 1 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 2,
            orderValues: [310000, 330000],
        },
        {
            name: 'Thane Elite Banquet Furniture',
            email: 'thanefurniture@mumbai.test',
            city: 'Mumbai',
            areas: ['Thane', 'Mulund'],
            services: [{ cat: 'furniture-rental', desc: 'Modern European wedding chairs and cocktail bar furniture.', maxGuests: 1000, price: 140000, maxSim: 2 }],
            availableOnTestDate: false,
            hasRecentOrders: false,
            recentOrderCount: 0,
            orderValues: [],
        },
        {
            name: 'Navi Mumbai Power Fleet',
            email: 'navipower@mumbai.test',
            city: 'Mumbai',
            areas: ['Vashi', 'Nerul'],
            services: [{ cat: 'event-equipment', desc: 'Heavy duty soundproof gensets and mobile air conditioners.', maxGuests: null, price: 60000, maxSim: 2 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 2,
            orderValues: [58000, 62000],
        },
        {
            name: 'Worli VIP Bridal Escort',
            email: 'worliescort@mumbai.test',
            city: 'Mumbai',
            areas: ['Worli', 'Lower Parel'],
            services: [{ cat: 'logistics', desc: 'Luxury chauffeured fleet including Audi A8, BMW 7-series, and Maybach.', maxGuests: null, price: 175000, maxSim: 2 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 3,
            orderValues: [170000, 180000, 175000],
        },
        {
            name: 'Powai Lakefront Caterers',
            email: 'powai.cater@mumbai.test',
            city: 'Mumbai',
            areas: ['Powai', 'Ghatkopar'],
            services: [{ cat: 'catering', desc: 'Global pan-Asian and fusion vegetarian banquet catering.', maxGuests: 700, price: 420000, maxSim: 1 }],
            availableOnTestDate: false,
            hasRecentOrders: false,
            recentOrderCount: 0,
            orderValues: [],
        },
        {
            name: 'Illuminati Stagecraft Mumbai',
            email: 'illuminati@mumbai.test',
            city: 'Mumbai',
            areas: ['Bandra', 'Goregaon'],
            services: [{ cat: 'lighting', desc: 'Concert grade trussing, stage spotlights, and haze machines.', maxGuests: null, price: 160000, maxSim: 1 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 2,
            orderValues: [155000, 165000],
        },
        {
            name: 'Juhu Starlight Drapes & Florals',
            email: 'starlightdrapes@mumbai.test',
            city: 'Mumbai',
            areas: ['Juhu', 'Santacruz'],
            services: [{ cat: 'decoration', desc: 'Imported Dutch tulip arrangements and mirror aisle pathways.', maxGuests: 1500, price: 520000, maxSim: 1 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 3,
            orderValues: [500000, 520000, 540000],
        },
        {
            name: 'Mumbai Central DJ & Visuals',
            email: 'mumbaicentraldj@mumbai.test',
            city: 'Mumbai',
            areas: ['Dadara', 'Parel'],
            services: [{ cat: 'sound', desc: 'Bass-heavy wedding reception sound with synchronized video mapping.', maxGuests: null, price: 130000, maxSim: 2 }],
            availableOnTestDate: false,
            hasRecentOrders: false,
            recentOrderCount: 0,
            orderValues: [],
        },
        {
            name: 'Heritage Bombay Photoworks',
            email: 'heritagebombay@mumbai.test',
            city: 'Mumbai',
            areas: ['Fort', 'Nariman Point'],
            services: [{ cat: 'photography', desc: 'Vintage black & white medium-format wedding portraiture.', maxGuests: null, price: 280000, maxSim: 1 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 2,
            orderValues: [275000, 285000],
        },
        // --- NASHIK VENDORS (31 - 38) ---
        {
            name: 'Godavari Royal Feasts',
            email: 'godavarifeasts@nashik.test',
            city: 'Nashik',
            areas: ['College Road', 'Gangapur Road', 'Indira Nagar'],
            services: [{ cat: 'catering', desc: 'Authentic Khandeshi, Maharashtrian, and Marwari wedding banquets.', maxGuests: 1000, price: 290000, maxSim: 2 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 4,
            orderValues: [280000, 300000, 290000, 295000],
        },
        {
            name: 'Sula Vineyards Valley Decor',
            email: 'sulavalleydecor@nashik.test',
            city: 'Nashik',
            areas: ['Gangapur Road'],
            services: [{ cat: 'decoration', desc: 'Rustic vineyard weddings, barrel decor, and warm fairy lights.', maxGuests: 800, price: 210000, maxSim: 2 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 3,
            orderValues: [200000, 220000, 210000],
        },
        {
            name: 'Nashik Sonic Sound & Lights',
            email: 'nashiksonic@nashik.test',
            city: 'Nashik',
            areas: ['College Road', 'Panchavati'],
            services: [
                { cat: 'sound', desc: 'JBL VRX sound systems and wireless Sennheiser microphone systems.', maxGuests: null, price: 65000, maxSim: 2 },
                { cat: 'lighting', desc: 'RGB outdoor floodlights and stage parcans.', maxGuests: null, price: 55000, maxSim: 2 },
            ],
            availableOnTestDate: false,
            hasRecentOrders: false,
            recentOrderCount: 0,
            orderValues: [],
        },
        {
            name: 'Trimbak Frames Photography',
            email: 'trimbakframes@nashik.test',
            city: 'Nashik',
            areas: ['College Road', 'Gangapur Road'],
            services: [{ cat: 'photography', desc: 'Soulful documentary wedding stories and traditional wedding reels.', maxGuests: null, price: 140000, maxSim: 1 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 2,
            orderValues: [135000, 145000],
        },
        {
            name: 'Khandesh Furniture & Mandap Mart',
            email: 'khandeshfurniture@nashik.test',
            city: 'Nashik',
            areas: ['Ambad', 'Indira Nagar'],
            services: [{ cat: 'furniture-rental', desc: 'Complete wedding seating, stage riser rentals, and shamiana tents.', maxGuests: 1200, price: 70000, maxSim: 2 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 2,
            orderValues: [68000, 72000],
        },
        {
            name: 'Nashik Reliable Genset & AC',
            email: 'nashikgenset@nashik.test',
            city: 'Nashik',
            areas: ['Satpur', 'Ambad'],
            services: [{ cat: 'event-equipment', desc: 'Diesel generators with uninterrupted power switchover.', maxGuests: null, price: 35000, maxSim: 2 }],
            availableOnTestDate: false,
            hasRecentOrders: false,
            recentOrderCount: 0,
            orderValues: [],
        },
        {
            name: 'Panchavati Shahi Transport',
            email: 'panchavatitransport@nashik.test',
            city: 'Nashik',
            areas: ['Panchavati', 'Dwarka'],
            services: [{ cat: 'logistics', desc: 'Bridal doli, vintage convertible cars, and traveler buses.', maxGuests: null, price: 65000, maxSim: 2 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 2,
            orderValues: [60000, 70000],
        },
        {
            name: 'Dindori Vineyard Catering',
            email: 'dindoricaterers@nashik.test',
            city: 'Nashik',
            areas: ['Gangapur Road', 'Dindori'],
            services: [{ cat: 'catering', desc: 'Farm-to-table organic wedding feasts and barbecue counters.', maxGuests: 500, price: 260000, maxSim: 1 }],
            availableOnTestDate: false,
            hasRecentOrders: false,
            recentOrderCount: 0,
            orderValues: [],
        },
        // --- BENGALURU VENDORS (39 - 44) ---
        {
            name: 'Bengaluru Royal Dakshin Caterers',
            email: 'dakshincaterers@bengaluru.test',
            city: 'Bengaluru',
            areas: ['Indiranagar', 'Koramangala', 'Whitefield'],
            services: [{ cat: 'catering', desc: 'Authentic 28-course traditional banana leaf wedding feasts and Chettinad specialties.', maxGuests: 1500, price: 420000, maxSim: 2 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 5,
            orderValues: [400000, 430000, 410000, 440000, 420000],
        },
        {
            name: 'Botanical Gardens Decor Bengaluru',
            email: 'botanicaldecor@bengaluru.test',
            city: 'Bengaluru',
            areas: ['Whitefield', 'Indiranagar'],
            services: [{ cat: 'decoration', desc: 'Lush greenery, jasmine flower canopies, and temple stone pillars.', maxGuests: 1200, price: 340000, maxSim: 2 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 3,
            orderValues: [330000, 350000, 340000],
        },
        {
            name: 'Silicon City Concert Lighting',
            email: 'siliconlighting@bengaluru.test',
            city: 'Bengaluru',
            areas: ['Koramangala', 'HSR Layout'],
            services: [{ cat: 'lighting', desc: 'Intelligent DMX lighting control, wash fixtures, and pathway illumination.', maxGuests: null, price: 140000, maxSim: 2 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 2,
            orderValues: [135000, 145000],
        },
        {
            name: 'Cubbon Park Wedding Frames',
            email: 'cubbonframes@bengaluru.test',
            city: 'Bengaluru',
            areas: ['Indiranagar', 'MG Road'],
            services: [{ cat: 'photography', desc: 'Natural light outdoor ceremony photography and teaser reels.', maxGuests: null, price: 230000, maxSim: 1 }],
            availableOnTestDate: false,
            hasRecentOrders: false,
            recentOrderCount: 0,
            orderValues: [],
        },
        {
            name: 'South Sound Bengaluru Rigs',
            email: 'southsound@bengaluru.test',
            city: 'Bengaluru',
            areas: ['Whitefield', 'HSR Layout'],
            services: [{ cat: 'sound', desc: 'RCF acoustic line arrays and Indian classical live stage engineering.', maxGuests: null, price: 115000, maxSim: 2 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 3,
            orderValues: [110000, 120000, 115000],
        },
        {
            name: 'Garden City Luxury Chauffeurs',
            email: 'gardencitychauffeurs@bengaluru.test',
            city: 'Bengaluru',
            areas: ['Indiranagar', 'Whitefield'],
            services: [{ cat: 'logistics', desc: 'Airport pick-up fleets for outstation guests and bridal luxury sedans.', maxGuests: null, price: 130000, maxSim: 2 }],
            availableOnTestDate: false,
            hasRecentOrders: false,
            recentOrderCount: 0,
            orderValues: [],
        },
        // --- HYDERABAD VENDORS (45 - 50) ---
        {
            name: 'Nizami Dawat Grand Caterers',
            email: 'nizamidawat@hyderabad.test',
            city: 'Hyderabad',
            areas: ['Banjara Hills', 'Jubilee Hills', 'Gachibowli'],
            services: [{ cat: 'catering', desc: 'Legendary slow-cooked Hyderabadi Dum Biryani, Shahi Tukda, and royal royal dawat banquet.', maxGuests: 2000, price: 580000, maxSim: 2 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 6,
            orderValues: [560000, 600000, 580000, 570000, 590000, 610000],
        },
        {
            name: 'Kohinoor Palace Wedding Decor',
            email: 'kohinoordecor@hyderabad.test',
            city: 'Hyderabad',
            areas: ['Jubilee Hills', 'Banjara Hills'],
            services: [{ cat: 'decoration', desc: 'Mughal arches, Swarovski crystal chandeliers, and royal mirror work mandaps.', maxGuests: 1500, price: 480000, maxSim: 1 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 4,
            orderValues: [460000, 490000, 480000, 470000],
        },
        {
            name: 'Charminar Sound & Illumination',
            email: 'charminarsound@hyderabad.test',
            city: 'Hyderabad',
            areas: ['Secunderabad', 'Banjara Hills'],
            services: [
                { cat: 'sound', desc: 'Massive wedding reception audio systems with multi-zone control.', maxGuests: null, price: 125000, maxSim: 2 },
                { cat: 'lighting', desc: 'Palace facade projection mapping and moving beams.', maxGuests: null, price: 180000, maxSim: 2 },
            ],
            availableOnTestDate: false,
            hasRecentOrders: false,
            recentOrderCount: 0,
            orderValues: [],
        },
        {
            name: 'Golconda Royal Studios',
            email: 'golcondastudios@hyderabad.test',
            city: 'Hyderabad',
            areas: ['Jubilee Hills', 'Madhapur'],
            services: [{ cat: 'photography', desc: 'Regal bridal portraits and master documentary films.', maxGuests: null, price: 290000, maxSim: 1 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 3,
            orderValues: [280000, 300000, 290000],
        },
        {
            name: 'Deccan Velvet Furniture & Rentals',
            email: 'deccanvelvet@hyderabad.test',
            city: 'Hyderabad',
            areas: ['Banjara Hills', 'Gachibowli'],
            services: [{ cat: 'furniture-rental', desc: 'Carved teakwood sofas, ornate diwans, and velvet dining chairs.', maxGuests: 1000, price: 150000, maxSim: 2 }],
            availableOnTestDate: false,
            hasRecentOrders: true,
            recentOrderCount: 2,
            orderValues: [145000, 155000],
        },
        {
            name: 'Nawab Royal Wedding Logistics',
            email: 'nawablogistics@hyderabad.test',
            city: 'Hyderabad',
            areas: ['Jubilee Hills', 'Banjara Hills'],
            services: [{ cat: 'logistics', desc: 'Rolls Royce bridal transfer and vintage car escorts with royal banners.', maxGuests: null, price: 210000, maxSim: 1 }],
            availableOnTestDate: false,
            hasRecentOrders: false,
            recentOrderCount: 0,
            orderValues: [],
        },
    ];
    console.log(`Configuring ${vendorsConfig.length} vendors...`);
    let vendorCounter = 0;
    for (const vConf of vendorsConfig) {
        vendorCounter++;
        // Create Vendor User
        const user = await prisma.user.create({
            data: {
                name: `${vConf.name} Manager`,
                email: vConf.email,
                phone: `+91983300${vendorCounter.toString().padStart(4, '0')}`,
                passwordHash: defaultPasswordHash,
                role: client_1.Role.VENDOR,
            },
        });
        // Create Vendor Profile
        const vendor = await prisma.vendor.create({
            data: {
                userId: user.id,
                businessName: vConf.name,
                businessDescription: `${vConf.name} is a premier event service provider established in ${vConf.city}, dedicated to luxury and seamless weddings.`,
                primaryCity: vConf.city,
                contactPerson: `${vConf.name} Manager`,
                businessAddress: `Premises ${vendorCounter}, Commercial Sector, ${vConf.city}`,
                verificationStatus: 'VERIFIED',
            },
        });
        // Create Service Areas
        for (const area of vConf.areas) {
            await prisma.vendorServiceArea.create({
                data: {
                    vendorId: vendor.id,
                    city: vConf.city,
                    area: area,
                },
            });
        }
        // Create Vendor Services and Calendar Entries
        for (const s of vConf.services) {
            const categoryId = categoryMap.get(s.cat);
            if (!categoryId)
                continue;
            const vendorService = await prisma.vendorService.create({
                data: {
                    vendorId: vendor.id,
                    categoryId,
                    serviceDescription: s.desc,
                    maximumGuestCapacity: s.maxGuests,
                    maximumSimultaneousBookings: s.maxSim,
                    startingPrice: s.price,
                    portfolioImages: [
                        `https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80`,
                        `https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80`,
                    ],
                },
            });
            // Target Date (15 December 2026) Calendar Entry
            await prisma.vendorAvailability.create({
                data: {
                    vendorServiceId: vendorService.id,
                    availabilityDate: targetTestDate,
                    status: vConf.availableOnTestDate ? client_1.AvailabilityStatus.AVAILABLE : client_1.AvailabilityStatus.FULLY_BOOKED,
                    availableCapacity: vConf.availableOnTestDate ? s.maxSim : 0,
                },
            });
            // Add other dates around December 2026 for realistic calendar viewing
            for (let day = 1; day <= 25; day++) {
                if (day === 15)
                    continue; // Already set for test date
                const date = new Date(Date.UTC(2026, 11, day));
                // Random availability pattern for realism
                const isAvail = day % 3 !== 0;
                await prisma.vendorAvailability.create({
                    data: {
                        vendorServiceId: vendorService.id,
                        availabilityDate: date,
                        status: isAvail ? client_1.AvailabilityStatus.AVAILABLE : client_1.AvailabilityStatus.FULLY_BOOKED,
                        availableCapacity: isAvail ? s.maxSim : 0,
                    },
                });
            }
            // Add recent completed orders (within the previous 90 days) to test verified business metrics
            if (vConf.hasRecentOrders && vConf.orderValues.length > 0) {
                for (let i = 0; i < vConf.orderValues.length; i++) {
                    const val = vConf.orderValues[i];
                    const pastEventDate = new Date(Date.now() - (i + 1) * 12 * 24 * 60 * 60 * 1000); // 12, 24, 36... days ago
                    // Create a mock historical event for the completed booking
                    const histEvent = await prisma.event.create({
                        data: {
                            ownerUserId: customerUser.id,
                            eventName: `Past Celebration ${vendorCounter}-${i + 1}`,
                            eventType: 'Wedding',
                            eventDate: pastEventDate,
                            city: vConf.city,
                            area: vConf.areas[0],
                            guestCount: 500,
                            estimatedBudget: val,
                        },
                    });
                    // Mock inquiry
                    const histInquiry = await prisma.inquiry.create({
                        data: {
                            eventId: histEvent.id,
                            vendorServiceId: vendorService.id,
                            requesterId: customerUser.id,
                            status: client_1.InquiryStatus.QUOTED,
                            requirements: 'Historical completed celebration booking',
                            guestCount: 500,
                            eventDate: pastEventDate,
                            budget: val,
                        },
                    });
                    // Mock quotation
                    const histQuotation = await prisma.quotation.create({
                        data: {
                            inquiryId: histInquiry.id,
                            eventId: histEvent.id,
                            vendorId: vendor.id,
                            vendorServiceId: vendorService.id,
                            quotedAmount: val,
                            serviceScope: s.desc,
                            status: client_1.QuotationStatus.ACCEPTED,
                            validUntil: pastEventDate,
                        },
                    });
                    // Mock completed booking
                    const histBooking = await prisma.booking.create({
                        data: {
                            eventId: histEvent.id,
                            quotationId: histQuotation.id,
                            vendorId: vendor.id,
                            vendorServiceId: vendorService.id,
                            customerId: customerUser.id,
                            status: client_1.BookingStatus.COMPLETED,
                            agreedAmount: val,
                            eventDate: pastEventDate,
                            updatedAt: pastEventDate, // within last 90 days
                        },
                    });
                    // Mock completed payment
                    await prisma.payment.create({
                        data: {
                            bookingId: histBooking.id,
                            eventId: histEvent.id,
                            payerId: customerUser.id,
                            payeeId: user.id,
                            amount: val,
                            paymentType: client_1.PaymentType.CUSTOMER_TO_VENDOR,
                            status: client_1.PaymentStatus.PAID,
                            paymentPurpose: 'Historical Completed Order Payment',
                            isSimulated: true,
                            transactionRef: `SEED-HIST-${vendorCounter}-${s.cat}-${i}-${Math.random().toString(36).substring(2, 7)}`,
                            createdAt: pastEventDate,
                        },
                    });
                }
            }
        }
    }
    // 4. Create the Mandatory Test Event for Aditi (Planner)
    const mandatoryTestEvent = await prisma.event.create({
        data: {
            ownerUserId: plannerUser.id,
            eventName: 'Grand Wedding Celebration',
            eventType: 'Wedding',
            eventDate: targetTestDate,
            city: 'Pune',
            area: 'Baner/Wakad',
            guestCount: 500,
            estimatedBudget: 2500000,
            description: 'Mandatory PRD test event: Wedding on 15 Dec 2026 in Pune Baner/Wakad for 500 guests.',
        },
    });
    console.log('Seeded mandatory test event:', mandatoryTestEvent.eventName);
    console.log(`Seeding complete! Seeded ${vendorCounter} vendors.`);
}
main()
    .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
