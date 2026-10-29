const fs = require('fs');
const path = require('path');
const { enrichVendorReputation } = require('./enrichReputationData.cjs');

const demoVendorsPath = path.join(__dirname, '..', 'data', 'demoVendors.ts');

// 16 New Fictional Vendors to ensure >= 7 in every category for Mumbai and Pune
const additionalVendors = [
  // --- MUMBAI: Furniture and Equipment Rental (+2) ---
  {
    id: 'mum-fur-06',
    businessName: 'Imperial Lounge & Royal Furniture Rentals',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Lower Parel', 'Bandra', 'Dadar', 'Powai'],
    category: 'Furniture and Equipment Rental',
    secondaryCategories: ['Lighting Services'],
    description: 'Luxury chesterfield sofas, mirrored dining consoles, French gold chiavari chairs, and bespoke VIP lounge setups for grand receptions.',
    serviceOfferings: [
      'Bespoke Sofa Lounges',
      'Gold & Acrylic Chiavari Chairs',
      'Mirrored Dining Consoles',
      'Bar Counters & High Tops',
      'Cocktail Cabanas'
    ],
    maximumSimultaneousBookings: 3,
    startingPrice: 95000,
    priceUnit: 'per setup',
    quotationRequired: false,
    availabilityDates: {
      '2026-12-15': 'Available',
      '2026-12-16': 'Available',
      '2026-12-20': 'Tentative',
      '2026-12-25': 'Available'
    },
    completedOrders90Days: 16,
    averageOrderValue90Days: 240000,
    portfolioImages: ['/assets/fur-1.jpg', '/assets/fur-2.jpg'],
    serviceTags: ['VIP Lounge Sets', 'Gold Chiavari', 'Mirrored Consoles', 'Luxury Rental'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-fur-06.demo.wedora.in',
    contactPhone: '+91 98000 0136',
    repeatOrdersArea: { 'Lower Parel': 3, 'Bandra': 3, 'Dadar': 2, 'Powai': 2 },
    referralsArea: { 'Lower Parel': 4, 'Bandra': 3, 'Dadar': 3, 'Powai': 2 },
    repeatOrdersTotal: 10,
    referralsTotal: 12,
    profileCreatedAt: '2026-02-15',
    isActive: true,
    isDemoData: true
  },
  {
    id: 'mum-fur-07',
    businessName: 'Thane StageCraft & Canopy Structures',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Thane', 'Mulund', 'Ghatkopar', 'Navi Mumbai'],
    category: 'Furniture and Equipment Rental',
    secondaryCategories: [],
    description: 'Heavy-duty waterproof German pagoda marquees, octanorm stage platforms, truss risers, and cushioned banquet seating.',
    serviceOfferings: [
      'German Pagoda Tents',
      'Hydraulic Stage Risers',
      'Cushioned Banquet Chairs',
      'Air Coolers & Misting Systems',
      'Carpet Runners'
    ],
    maximumSimultaneousBookings: 2,
    startingPrice: 120000,
    priceUnit: 'per setup',
    quotationRequired: false,
    availabilityDates: {
      '2026-12-15': 'Available',
      '2026-12-17': 'Available',
      '2026-12-22': 'Unavailable'
    },
    completedOrders90Days: 11,
    averageOrderValue90Days: 190000,
    portfolioImages: ['/assets/fur-1.jpg', '/assets/fur-2.jpg'],
    serviceTags: ['Pagoda Tents', 'Stage Rigs', 'AC & Mist Fans', 'Banqueting Chairs'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-fur-07.demo.wedora.in',
    contactPhone: '+91 98000 0137',
    repeatOrdersArea: { 'Thane': 2, 'Mulund': 2, 'Ghatkopar': 2, 'Navi Mumbai': 2 },
    referralsArea: { 'Thane': 3, 'Mulund': 2, 'Ghatkopar': 3, 'Navi Mumbai': 2 },
    repeatOrdersTotal: 8,
    referralsTotal: 10,
    profileCreatedAt: '2026-03-10',
    isActive: true,
    isDemoData: true
  },

  // --- MUMBAI: Hotels and Guest Accommodation (+2) ---
  {
    id: 'mum-hot-06',
    businessName: 'Grand Regalia Suites & Boutique Stay',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Andheri', 'Powai', 'Goregaon'],
    category: 'Hotels and Guest Accommodation',
    secondaryCategories: ['Wedding Lawns and Venues'],
    description: '85 luxury deluxe and royal executive suites right next to international terminal, featuring hospitality concierge and breakfast dining.',
    serviceOfferings: [
      'Bridal Luxury Suites',
      'Deluxe Guest Room Blocks',
      '24/7 Airport Shuttle',
      'Bespoke Room Hampers',
      'Pre-Wedding Breakfast'
    ],
    maximumGuestCapacity: 400,
    maximumSimultaneousBookings: 2,
    startingPrice: 6500,
    priceUnit: 'per room/night',
    quotationRequired: false,
    availabilityDates: {
      '2026-12-15': 'Available',
      '2026-12-18': 'Available',
      '2026-12-25': 'Fully Booked'
    },
    completedOrders90Days: 24,
    averageOrderValue90Days: 320000,
    portfolioImages: ['/assets/hot-1.jpg', '/assets/hot-2.jpg'],
    serviceTags: ['85 Room Block', 'Airport Proximity', 'Executive Suites', 'Hospitality Desk'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-hot-06.demo.wedora.in',
    contactPhone: '+91 98000 0138',
    repeatOrdersArea: { 'Andheri': 4, 'Powai': 3, 'Goregaon': 3 },
    referralsArea: { 'Andheri': 5, 'Powai': 4, 'Goregaon': 4 },
    repeatOrdersTotal: 10,
    referralsTotal: 13,
    profileCreatedAt: '2026-01-20',
    isActive: true,
    isDemoData: true
  },
  {
    id: 'mum-hot-07',
    businessName: 'Seafront Heritage Palm Resort & Lodging',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Bandra', 'Dadar', 'Lower Parel'],
    category: 'Hotels and Guest Accommodation',
    secondaryCategories: ['Wedding Lawns and Venues'],
    description: 'Colonial-style coastal heritage property with 60 sea-facing guest rooms, bridal pampering quarters, and private poolside hospitality lawns.',
    serviceOfferings: [
      'Sea-Facing Deluxe Rooms',
      'Bridal Dressing Suite',
      'Poolside Sundowner Area',
      'Concierge Check-in Desk',
      'Valet Parking'
    ],
    maximumGuestCapacity: 350,
    maximumSimultaneousBookings: 2,
    startingPrice: 8500,
    priceUnit: 'per room/night',
    quotationRequired: false,
    availabilityDates: {
      '2026-12-15': 'Available',
      '2026-12-16': 'Available',
      '2026-12-21': 'Tentative'
    },
    completedOrders90Days: 19,
    averageOrderValue90Days: 450000,
    portfolioImages: ['/assets/hot-1.jpg', '/assets/hot-2.jpg'],
    serviceTags: ['Sea View Rooms', 'Boutique Resort', 'Bandra Coastline', 'Heritage Charm'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-hot-07.demo.wedora.in',
    contactPhone: '+91 98000 0139',
    repeatOrdersArea: { 'Bandra': 3, 'Dadar': 3, 'Lower Parel': 3 },
    referralsArea: { 'Bandra': 4, 'Dadar': 3, 'Lower Parel': 4 },
    repeatOrdersTotal: 9,
    referralsTotal: 11,
    profileCreatedAt: '2026-02-05',
    isActive: true,
    isDemoData: true
  },

  // --- MUMBAI: End-to-End Event Management (+2) ---
  {
    id: 'mum-e2e-06',
    businessName: 'Parampara Turnkey Celebrations & Planners',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Dadar', 'Bandra', 'Lower Parel', 'Chembur'],
    category: 'End-to-End Event Management',
    secondaryCategories: ['Event Organizers / Wedding Planners'],
    description: 'Holistic end-to-end wedding direction covering muhurat pooja logistics, legal registrations, decor execution, artist bookings, and banquet stewardship.',
    serviceOfferings: [
      'Full Wedding Production',
      'Vendor Contracting',
      'Guest Hospitality Flow',
      'Timeline Management',
      'VIP Protocol'
    ],
    maximumGuestCapacity: 1200,
    maximumSimultaneousBookings: 2,
    startingPrice: 750000,
    priceUnit: 'turnkey package',
    quotationRequired: true,
    availabilityDates: {
      '2026-12-15': 'Available',
      '2026-12-16': 'Available',
      '2026-12-24': 'Unavailable'
    },
    completedOrders90Days: 14,
    averageOrderValue90Days: 850000,
    portfolioImages: ['/assets/e2e-1.jpg', '/assets/e2e-2.jpg'],
    serviceTags: ['Turnkey Production', 'Single-Window Management', 'Ceremony Orchestration', 'Concierge Team'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-e2e-06.demo.wedora.in',
    contactPhone: '+91 98000 0140',
    repeatOrdersArea: { 'Dadar': 3, 'Bandra': 2, 'Lower Parel': 3, 'Chembur': 2 },
    referralsArea: { 'Dadar': 3, 'Bandra': 3, 'Lower Parel': 4, 'Chembur': 3 },
    repeatOrdersTotal: 10,
    referralsTotal: 13,
    profileCreatedAt: '2026-01-12',
    isActive: true,
    isDemoData: true
  },
  {
    id: 'mum-e2e-07',
    businessName: 'Nova Spectra Grand Events',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Andheri', 'Powai', 'Borivali', 'Goregaon'],
    category: 'End-to-End Event Management',
    secondaryCategories: ['Event Organizers / Wedding Planners'],
    description: 'High-tech immersive wedding productions integrating sync sound, projection mapping, international dance troupes, and seamless guest hospitality.',
    serviceOfferings: [
      'Complete Event Production',
      'Show Direction',
      'Artist & Celebrity Booking',
      'Logistics Coordination',
      'Security & Crowd Control'
    ],
    maximumGuestCapacity: 2000,
    maximumSimultaneousBookings: 1,
    startingPrice: 900000,
    priceUnit: 'turnkey package',
    quotationRequired: true,
    availabilityDates: {
      '2026-12-15': 'Available',
      '2026-12-19': 'Available',
      '2026-12-26': 'Fully Booked'
    },
    completedOrders90Days: 9,
    averageOrderValue90Days: 950000,
    portfolioImages: ['/assets/e2e-1.jpg', '/assets/e2e-2.jpg'],
    serviceTags: ['High-Tech Staging', 'Celebrity Artists', 'Full-Spectrum Management', 'Mega Banquets'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-e2e-07.demo.wedora.in',
    contactPhone: '+91 98000 0141',
    repeatOrdersArea: { 'Andheri': 2, 'Powai': 2, 'Borivali': 2, 'Goregaon': 2 },
    referralsArea: { 'Andheri': 3, 'Powai': 3, 'Borivali': 2, 'Goregaon': 3 },
    repeatOrdersTotal: 8,
    referralsTotal: 11,
    profileCreatedAt: '2026-03-01',
    isActive: true,
    isDemoData: true
  },

  // --- MUMBAI: Makeup and Mehendi Artists (+2) ---
  {
    id: 'mum-mak-06',
    businessName: 'Glamour & Glow Bridal Studio by Natasha',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Bandra', 'Andheri', 'Lower Parel', 'Goregaon'],
    category: 'Makeup and Mehendi Artists',
    secondaryCategories: [],
    description: 'Celebrity bridal makeup artist specializing in HD airbrush finishes, natural dewy skins, customized saree draping, and intricate bridal mehendi.',
    serviceOfferings: [
      'HD Airbrush Bridal Makeup',
      'Organic Marwari Mehendi',
      'Saree & Dupatta Draping',
      'Mother of Bride Styling',
      'Pre-Bridal Skincare Prep'
    ],
    maximumSimultaneousBookings: 2,
    startingPrice: 35000,
    priceUnit: 'per bridal package',
    quotationRequired: false,
    availabilityDates: {
      '2026-12-15': 'Available',
      '2026-12-16': 'Available',
      '2026-12-20': 'Tentative'
    },
    completedOrders90Days: 28,
    averageOrderValue90Days: 45000,
    portfolioImages: ['/assets/mak-1.jpg', '/assets/mak-2.jpg'],
    serviceTags: ['HD Airbrush', 'Celebrity Stylist', 'Natural Dewy Look', 'Organic Henna'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-mak-06.demo.wedora.in',
    contactPhone: '+91 98000 0142',
    repeatOrdersArea: { 'Bandra': 5, 'Andheri': 4, 'Lower Parel': 4, 'Goregaon': 3 },
    referralsArea: { 'Bandra': 6, 'Andheri': 5, 'Lower Parel': 5, 'Goregaon': 4 },
    repeatOrdersTotal: 16,
    referralsTotal: 20,
    profileCreatedAt: '2026-01-08',
    isActive: true,
    isDemoData: true
  },
  {
    id: 'mum-mak-07',
    businessName: 'Riddhi Siddhi Bridal Mehendi & Artistry',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Ghatkopar', 'Mulund', 'Thane', 'Chembur'],
    category: 'Makeup and Mehendi Artists',
    secondaryCategories: [],
    description: 'Traditional Rajasthani, Arabic, and personalized portrait mehendi designs combined with traditional bridal makeup and hair styling.',
    serviceOfferings: [
      'Bridal Portrait Henna',
      'Rajasthani Traditional Henna',
      'Guest Mehendi Team',
      'Hair Extension Styling',
      'Jewelry Setting'
    ],
    maximumSimultaneousBookings: 3,
    startingPrice: 22000,
    priceUnit: 'per bridal package',
    quotationRequired: false,
    availabilityDates: {
      '2026-12-15': 'Available',
      '2026-12-18': 'Available',
      '2026-12-24': 'Unavailable'
    },
    completedOrders90Days: 0,
    averageOrderValue90Days: 0,
    portfolioImages: ['/assets/mak-1.jpg', '/assets/mak-2.jpg'],
    serviceTags: ['Portrait Mehendi', 'Rajasthani Designs', 'Guest Henna Artists', 'Traditional Hair'],
    isNewToPlatform: true,
    contactEmail: 'contact@mum-mak-07.demo.wedora.in',
    contactPhone: '+91 98000 0143',
    repeatOrdersArea: { 'Ghatkopar': 0, 'Mulund': 0, 'Thane': 0, 'Chembur': 0 },
    referralsArea: { 'Ghatkopar': 0, 'Mulund': 0, 'Thane': 0, 'Chembur': 0 },
    repeatOrdersTotal: 0,
    referralsTotal: 0,
    profileCreatedAt: '2026-10-15',
    isActive: true,
    isDemoData: true
  },

  // --- PUNE: Furniture and Equipment Rental (+2) ---
  {
    id: 'pun-fur-06',
    businessName: 'Deccan Heritage Seating & Tents',
    primaryCity: 'Pune',
    serviceableAreas: ['Kothrud', 'Shivajinagar', 'Aundh', 'Baner'],
    category: 'Furniture and Equipment Rental',
    secondaryCategories: ['Lighting Services'],
    description: 'Authentic wooden carved royal chairs, traditional bajot dining tables, brass samai stands, and vintage shamiana canopies.',
    serviceOfferings: [
      'Traditional Bajot Tables',
      'Carved Wooden Chairs',
      'Vintage Shamianas',
      'Brass Samai Stands',
      'Cushioned Diwans'
    ],
    maximumSimultaneousBookings: 2,
    startingPrice: 70000,
    priceUnit: 'per setup',
    quotationRequired: false,
    availabilityDates: {
      '2026-12-15': 'Available',
      '2026-12-16': 'Available',
      '2026-12-20': 'Available'
    },
    completedOrders90Days: 15,
    averageOrderValue90Days: 175000,
    portfolioImages: ['/assets/fur-1.jpg', '/assets/fur-2.jpg'],
    serviceTags: ['Wooden Carved', 'Traditional Bajot', 'Shamiana Sets', 'Heritage Decor'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-fur-06.demo.wedora.in',
    contactPhone: '+91 98000 0144',
    repeatOrdersArea: { 'Kothrud': 3, 'Shivajinagar': 2, 'Aundh': 2, 'Baner': 2 },
    referralsArea: { 'Kothrud': 3, 'Shivajinagar': 3, 'Aundh': 3, 'Baner': 2 },
    repeatOrdersTotal: 9,
    referralsTotal: 11,
    profileCreatedAt: '2026-02-18',
    isActive: true,
    isDemoData: true
  },
  {
    id: 'pun-fur-07',
    businessName: 'Wakad Event Infra & Audio-Visual Rentals',
    primaryCity: 'Pune',
    serviceableAreas: ['Wakad', 'Hinjewadi', 'Baner', 'Pimpri-Chinchwad'],
    category: 'Furniture and Equipment Rental',
    secondaryCategories: ['DJ and Sound Systems'],
    description: 'Modern banquet inventory with LED backlit bars, high-gloss white dance stages, contemporary barstools, and silent power generators.',
    serviceOfferings: [
      'LED Backlit Bars',
      'White Acrylic Dance Floors',
      'Modern Bar Stools',
      'Silent Diesel Generators',
      'Truss Systems'
    ],
    maximumSimultaneousBookings: 3,
    startingPrice: 85000,
    priceUnit: 'per setup',
    quotationRequired: false,
    availabilityDates: {
      '2026-12-15': 'Available',
      '2026-12-17': 'Available',
      '2026-12-23': 'Fully Booked'
    },
    completedOrders90Days: 18,
    averageOrderValue90Days: 210000,
    portfolioImages: ['/assets/fur-1.jpg', '/assets/fur-2.jpg'],
    serviceTags: ['LED Bars', 'White Dance Floor', 'Modern Stools', 'Silent Genset'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-fur-07.demo.wedora.in',
    contactPhone: '+91 98000 0145',
    repeatOrdersArea: { 'Wakad': 3, 'Hinjewadi': 3, 'Baner': 2, 'Pimpri-Chinchwad': 2 },
    referralsArea: { 'Wakad': 4, 'Hinjewadi': 3, 'Baner': 3, 'Pimpri-Chinchwad': 3 },
    repeatOrdersTotal: 10,
    referralsTotal: 13,
    profileCreatedAt: '2026-01-25',
    isActive: true,
    isDemoData: true
  },

  // --- PUNE: Hotels and Guest Accommodation (+2) ---
  {
    id: 'pun-hot-06',
    businessName: 'Koregaon Park Grand Manor & Suites',
    primaryCity: 'Pune',
    serviceableAreas: ['Koregaon Park', 'Viman Nagar', 'Kharadi'],
    category: 'Hotels and Guest Accommodation',
    secondaryCategories: ['Wedding Lawns and Venues'],
    description: 'Boutique 70-key luxury urban oasis nestled among Koregaon Park banyan trees, featuring serene garden courtyards and gourmet dining.',
    serviceOfferings: [
      'Executive Garden Suites',
      'Dedicated Wedding Wing',
      'Hospitality Desk',
      'Private Breakfast Terrace',
      'Spa Packages'
    ],
    maximumGuestCapacity: 450,
    maximumSimultaneousBookings: 2,
    startingPrice: 5800,
    priceUnit: 'per room/night',
    quotationRequired: false,
    availabilityDates: {
      '2026-12-15': 'Available',
      '2026-12-16': 'Available',
      '2026-12-22': 'Available'
    },
    completedOrders90Days: 21,
    averageOrderValue90Days: 280000,
    portfolioImages: ['/assets/hot-1.jpg', '/assets/hot-2.jpg'],
    serviceTags: ['70 Keys', 'Koregaon Park', 'Garden Courtyard', 'Luxury Stay'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-hot-06.demo.wedora.in',
    contactPhone: '+91 98000 0146',
    repeatOrdersArea: { 'Koregaon Park': 4, 'Viman Nagar': 3, 'Kharadi': 3 },
    referralsArea: { 'Koregaon Park': 5, 'Viman Nagar': 4, 'Kharadi': 4 },
    repeatOrdersTotal: 10,
    referralsTotal: 13,
    profileCreatedAt: '2026-02-10',
    isActive: true,
    isDemoData: true
  },
  {
    id: 'pun-hot-07',
    businessName: 'Hinjewadi Pavilion Regency Hotel',
    primaryCity: 'Pune',
    serviceableAreas: ['Hinjewadi', 'Wakad', 'Baner', 'Pimpri-Chinchwad'],
    category: 'Hotels and Guest Accommodation',
    secondaryCategories: ['Wedding Lawns and Venues'],
    description: 'Contemporary business-and-leisure hotel with 110 spacious rooms, high-speed connectivity, airport shuttles, and banquet catering support.',
    serviceOfferings: [
      '110 Deluxe Rooms',
      'Bridal Dressing Suite',
      'Airport Transit Shuttles',
      'Late Check-out Privilege',
      'Group Buffet Dining'
    ],
    maximumGuestCapacity: 600,
    maximumSimultaneousBookings: 2,
    startingPrice: 4200,
    priceUnit: 'per room/night',
    quotationRequired: false,
    availabilityDates: {
      '2026-12-15': 'Available',
      '2026-12-18': 'Available',
      '2026-12-24': 'Unavailable'
    },
    completedOrders90Days: 0,
    averageOrderValue90Days: 0,
    portfolioImages: ['/assets/hot-1.jpg', '/assets/hot-2.jpg'],
    serviceTags: ['110 Rooms', 'Hinjewadi Hub', 'Large Room Block', 'Buffet Dining'],
    isNewToPlatform: true,
    contactEmail: 'contact@pun-hot-07.demo.wedora.in',
    contactPhone: '+91 98000 0147',
    repeatOrdersArea: { 'Hinjewadi': 0, 'Wakad': 0, 'Baner': 0, 'Pimpri-Chinchwad': 0 },
    referralsArea: { 'Hinjewadi': 0, 'Wakad': 0, 'Baner': 0, 'Pimpri-Chinchwad': 0 },
    repeatOrdersTotal: 0,
    referralsTotal: 0,
    profileCreatedAt: '2026-10-18',
    isActive: true,
    isDemoData: true
  },

  // --- PUNE: End-to-End Event Management (+2) ---
  {
    id: 'pun-e2e-06',
    businessName: 'Saptapadi Comprehensive Wedding Orchestration',
    primaryCity: 'Pune',
    serviceableAreas: ['Kothrud', 'Shivajinagar', 'Aundh', 'Baner'],
    category: 'End-to-End Event Management',
    secondaryCategories: ['Event Organizers / Wedding Planners'],
    description: 'End-to-end wedding production team specializing in authentic Maharashtrian rituals, guest RSVP management, catering supervision, and sangeet choreography.',
    serviceOfferings: [
      'End-to-End Planning',
      'Pooja & Ritual Coordination',
      'Guest Transport Fleet',
      'Artist Management',
      'On-Ground Timeline Control'
    ],
    maximumGuestCapacity: 1000,
    maximumSimultaneousBookings: 2,
    startingPrice: 620000,
    priceUnit: 'turnkey package',
    quotationRequired: true,
    availabilityDates: {
      '2026-12-15': 'Available',
      '2026-12-16': 'Available',
      '2026-12-21': 'Tentative'
    },
    completedOrders90Days: 16,
    averageOrderValue90Days: 680000,
    portfolioImages: ['/assets/e2e-1.jpg', '/assets/e2e-2.jpg'],
    serviceTags: ['Rituals Expert', 'RSVP Desk', 'Timeline Control', 'Turnkey Weddings'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-e2e-06.demo.wedora.in',
    contactPhone: '+91 98000 0148',
    repeatOrdersArea: { 'Kothrud': 3, 'Shivajinagar': 3, 'Aundh': 2, 'Baner': 2 },
    referralsArea: { 'Kothrud': 4, 'Shivajinagar': 3, 'Aundh': 3, 'Baner': 3 },
    repeatOrdersTotal: 10,
    referralsTotal: 13,
    profileCreatedAt: '2026-01-30',
    isActive: true,
    isDemoData: true
  },
  {
    id: 'pun-e2e-07',
    businessName: 'Zenith Elite Events & Productions',
    primaryCity: 'Pune',
    serviceableAreas: ['Viman Nagar', 'Kharadi', 'Koregaon Park', 'Hadapsar', 'Magarpatta'],
    category: 'End-to-End Event Management',
    secondaryCategories: ['Event Organizers / Wedding Planners'],
    description: 'Full-service wedding and gala productions company providing turn-key staging, international artist management, customized food curation, and 360-degree timeline tracking.',
    serviceOfferings: [
      'Turnkey Production',
      'International Artists',
      'Custom Culinary Experience',
      '360-Degree Logistics',
      'VIP Escort Service'
    ],
    maximumGuestCapacity: 1500,
    maximumSimultaneousBookings: 1,
    startingPrice: 880000,
    priceUnit: 'turnkey package',
    quotationRequired: true,
    availabilityDates: {
      '2026-12-15': 'Available',
      '2026-12-17': 'Available',
      '2026-12-25': 'Fully Booked'
    },
    completedOrders90Days: 12,
    averageOrderValue90Days: 920000,
    portfolioImages: ['/assets/e2e-1.jpg', '/assets/e2e-2.jpg'],
    serviceTags: ['Elite Gala', 'Mega Staging', '360-Degree Planning', 'Turnkey Luxury'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-e2e-07.demo.wedora.in',
    contactPhone: '+91 98000 0149',
    repeatOrdersArea: { 'Viman Nagar': 2, 'Kharadi': 2, 'Koregaon Park': 3, 'Hadapsar': 2, 'Magarpatta': 2 },
    referralsArea: { 'Viman Nagar': 3, 'Kharadi': 3, 'Koregaon Park': 4, 'Hadapsar': 2, 'Magarpatta': 2 },
    repeatOrdersTotal: 11,
    referralsTotal: 14,
    profileCreatedAt: '2026-02-22',
    isActive: true,
    isDemoData: true
  },

  // --- PUNE: Makeup and Mehendi Artists (+2) ---
  {
    id: 'pun-mak-06',
    businessName: 'Shringaar Bridal Beauty Lounge by Priya',
    primaryCity: 'Pune',
    serviceableAreas: ['Baner', 'Aundh', 'Wakad', 'Shivajinagar'],
    category: 'Makeup and Mehendi Artists',
    secondaryCategories: [],
    description: 'Signature bridal looks featuring luxury MAC & Bobbi Brown cosmetics, water-resistant airbrush finishes, traditional Nauvari draping, and flower-braid hair styling.',
    serviceOfferings: [
      'Water-Resistant Airbrush Makeup',
      'Nauvari Saree Draping',
      'Floral Hair Venis',
      'Sangeet Glam Party Makeup',
      'Pre-Bridal Glow Facials'
    ],
    maximumSimultaneousBookings: 2,
    startingPrice: 28000,
    priceUnit: 'per bridal package',
    quotationRequired: false,
    availabilityDates: {
      '2026-12-15': 'Available',
      '2026-12-16': 'Available',
      '2026-12-19': 'Available'
    },
    completedOrders90Days: 25,
    averageOrderValue90Days: 38000,
    portfolioImages: ['/assets/mak-1.jpg', '/assets/mak-2.jpg'],
    serviceTags: ['Nauvari Draping', 'Airbrush Makeup', 'Floral Venis', 'Luxury Cosmetics'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-mak-06.demo.wedora.in',
    contactPhone: '+91 98000 0150',
    repeatOrdersArea: { 'Baner': 4, 'Aundh': 4, 'Wakad': 3, 'Shivajinagar': 3 },
    referralsArea: { 'Baner': 5, 'Aundh': 4, 'Wakad': 4, 'Shivajinagar': 4 },
    repeatOrdersTotal: 14,
    referralsTotal: 17,
    profileCreatedAt: '2026-01-15',
    isActive: true,
    isDemoData: true
  },
  {
    id: 'pun-mak-07',
    businessName: 'Mehendi Kala Kendra & Bridal Looks',
    primaryCity: 'Pune',
    serviceableAreas: ['Kothrud', 'Koregaon Park', 'Hadapsar', 'Viman Nagar'],
    category: 'Makeup and Mehendi Artists',
    secondaryCategories: [],
    description: '100% natural organic dark-stain henna cones, intricate figure and lotus mehendi motifs, along with complete bridesmaids styling stations.',
    serviceOfferings: [
      'Organic Dark-Stain Henna',
      'Intricate Lotus & Figure Work',
      'Bridesmaids Mehendi Station',
      'Traditional Hair Braiding',
      'Touch-Up Concierge'
    ],
    maximumSimultaneousBookings: 3,
    startingPrice: 18000,
    priceUnit: 'per bridal package',
    quotationRequired: false,
    availabilityDates: {
      '2026-12-15': 'Available',
      '2026-12-18': 'Available',
      '2026-12-22': 'Tentative'
    },
    completedOrders90Days: 22,
    averageOrderValue90Days: 28000,
    portfolioImages: ['/assets/mak-1.jpg', '/assets/mak-2.jpg'],
    serviceTags: ['Organic Henna', 'Lotus Motifs', 'Bridesmaids Team', 'Traditional Hair'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-mak-07.demo.wedora.in',
    contactPhone: '+91 98000 0151',
    repeatOrdersArea: { 'Kothrud': 3, 'Koregaon Park': 3, 'Hadapsar': 2, 'Viman Nagar': 2 },
    referralsArea: { 'Kothrud': 4, 'Koregaon Park': 4, 'Hadapsar': 3, 'Viman Nagar': 3 },
    repeatOrdersTotal: 10,
    referralsTotal: 14,
    profileCreatedAt: '2026-02-28',
    isActive: true,
    isDemoData: true
  }
];

function seedVendors() {
  console.log('Seeding Demo Vendors into demoVendors.ts...');

  // Read current file
  const fileContent = fs.readFileSync(demoVendorsPath, 'utf8');

  // Extract JSON array
  const eqIdx = fileContent.indexOf('=');
  const jsonStart = fileContent.indexOf('[', eqIdx);
  const jsonEnd = fileContent.lastIndexOf(']');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('Could not find vendor array bounds in demoVendors.ts');
  }

  const existingVendors = JSON.parse(fileContent.slice(jsonStart, jsonEnd + 1));
  console.log(`Current vendor count: ${existingVendors.length}`);

  // Create map by ID
  const vendorMap = new Map();
  for (const v of existingVendors) {
    // Add default fields if missing
    if (v.isActive === undefined) v.isActive = true;
    if (v.isDemoData === undefined) v.isDemoData = true;
    if (!v.profileCreatedAt) v.profileCreatedAt = '2026-01-15';

    // Normalize any non-canonical locality to approved Section 5 canonical localities
    if (v.serviceableAreas) {
      v.serviceableAreas = v.serviceableAreas.map((a) => (a === 'Kalyani Nagar' ? 'Magarpatta' : a));
    }
    if (v.repeatOrdersArea && v.repeatOrdersArea['Kalyani Nagar']) {
      v.repeatOrdersArea['Magarpatta'] = (v.repeatOrdersArea['Magarpatta'] || 0) + v.repeatOrdersArea['Kalyani Nagar'];
      delete v.repeatOrdersArea['Kalyani Nagar'];
    }
    if (v.referralsArea && v.referralsArea['Kalyani Nagar']) {
      v.referralsArea['Magarpatta'] = (v.referralsArea['Magarpatta'] || 0) + v.referralsArea['Kalyani Nagar'];
      delete v.referralsArea['Kalyani Nagar'];
    }

    vendorMap.set(v.id, v);
  }

  // Merge additional vendors (idempotent)
  let addedCount = 0;
  for (const newV of additionalVendors) {
    if (!vendorMap.has(newV.id)) {
      vendorMap.set(newV.id, newV);
      addedCount++;
    } else {
      // Update with full record
      vendorMap.set(newV.id, { ...vendorMap.get(newV.id), ...newV });
    }
  }

  const mergedVendors = Array.from(vendorMap.values()).map(enrichVendorReputation);
  console.log(`Enriched and merged vendor count: ${mergedVendors.length} (+${addedCount} newly added)`);

  // Write back to demoVendors.ts
  const newFileHeader = `import { Vendor } from '../types/vendor';

/**
 * AI Wedding Timeline Orchestrator — Demo Vendor Dataset
 * Comprehensive Fictional Vendor Database with minimum 50 unique vendors per city
 * and guaranteed minimum 7 vendors per canonical category in both Mumbai and Pune.
 * All metrics, phone numbers, and names are fictional demonstration data.
 */

export const DEMO_VENDORS: Vendor[] = ${JSON.stringify(mergedVendors, null, 2)};

export default DEMO_VENDORS;
`;

  fs.writeFileSync(demoVendorsPath, newFileHeader, 'utf8');
  console.log(`Successfully updated ${demoVendorsPath}`);
  return mergedVendors;
}

if (require.main === module) {
  seedVendors();
}

module.exports = { seedVendors, additionalVendors };
