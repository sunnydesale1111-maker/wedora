const fs = require('fs');
const path = require('path');

// 13 canonical categories as mandated by Version 4.0 Section 6
const CANONICAL_CATEGORIES = [
  'Catering and Food Services',
  'Decoration Services',
  'Flower Arrangements',
  'Lighting Services',
  'DJ and Sound Systems',
  'Furniture and Equipment Rental',
  'Wedding Lawns and Venues',
  'Hotels and Guest Accommodation',
  'Photography and Videography',
  'Event Organizers / Wedding Planners',
  'End-to-End Event Management',
  'Logistics and Transportation',
  'Makeup and Mehendi Artists',
];

const MUMBAI_LOCALITIES = [
  'Andheri', 'Bandra', 'Borivali', 'Goregaon', 'Malad', 'Powai',
  'Dadar', 'Lower Parel', 'Chembur', 'Ghatkopar', 'Mulund', 'Navi Mumbai', 'Thane'
];

const PUNE_LOCALITIES = [
  'Baner', 'Wakad', 'Hinjewadi', 'Aundh', 'Kothrud', 'Viman Nagar',
  'Kharadi', 'Hadapsar', 'Koregaon Park', 'Shivajinagar', 'Pimpri-Chinchwad', 'Magarpatta'
];

// Helper to generate area metrics
function generateAreaMetrics(serviceableAreas, completedOrders, isNew) {
  if (isNew || completedOrders === 0) {
    const emptyAreaMap = {};
    for (const a of serviceableAreas) {
      emptyAreaMap[a] = 0;
    }
    return {
      repeatOrdersArea: emptyAreaMap,
      referralsArea: emptyAreaMap,
      repeatOrdersTotal: 0,
      referralsTotal: 0,
    };
  }

  const repeatOrdersArea = {};
  const referralsArea = {};
  let repeatTotal = 0;
  let referralsTotal = 0;

  serviceableAreas.forEach((area, idx) => {
    // Generate deterministic area repeat orders (e.g. 2-8 per area, proportional to orders)
    const baseRepeat = Math.max(1, Math.round((completedOrders * (0.35 + (idx % 3) * 0.08)) / serviceableAreas.length));
    const baseReferrals = Math.max(1, Math.round((completedOrders * (0.45 + (idx % 2) * 0.1)) / serviceableAreas.length));

    repeatOrdersArea[area] = baseRepeat;
    referralsArea[area] = baseReferrals;
    repeatTotal += baseRepeat;
    referralsTotal += baseReferrals;
  });

  return {
    repeatOrdersArea,
    referralsArea,
    repeatOrdersTotal: repeatTotal,
    referralsTotal,
  };
}

// Generate default service offerings by category
function generateServiceOfferings(category) {
  switch (category) {
    case 'Catering and Food Services':
      return ['Buffet Catering', 'Live Counters', 'Tasting Sessions', 'Custom Menus', 'Professional Waitstaff'];
    case 'Decoration Services':
    case 'Decoration and Flower Arrangements':
      return ['Theme Decor', 'Mandap Design', 'Stage Backdrop', 'Entrance Installations', 'Lighting Integration'];
    case 'Flower Arrangements':
      return ['Exotic Floral Mandaps', 'Bridal Bouquets', 'Fresh Floral Canopies', 'Varmala Design', 'Floral Centerpieces'];
    case 'Lighting Services':
      return ['Architectural Illumination', 'Intelligent Moving Heads', 'Truss Lighting', 'LED Wall Backgrounds', 'Warm String Fairylights'];
    case 'DJ and Sound Systems':
      return ['Line Array Sound System', 'Celebrity DJ Performances', 'Live Dhol Players', 'Wireless Mic Kits', 'Digital Sound Console'];
    case 'Furniture and Equipment Rental':
      return ['Chiavari & Dior Chairs', 'Royal Sofa Lounges', 'High Cocktail Tables', 'German Pagoda Tents', 'Heavy Gensets'];
    case 'Wedding Lawns and Venues':
      return ['Open-Air Banquet Lawns', 'Air-Conditioned Indoor Halls', 'Bridal Green Rooms', 'Valet Parking Lot', 'In-House Power Backup'];
    case 'Hotels and Guest Accommodation':
    case 'Hotels, Lodging and Guest Accommodation':
      return ['Deluxe Guest Rooms', 'Welcome Hospitality Desk', 'Luggage Assistance', 'Breakfast Buffet Included', 'Airport/Station Transfers'];
    case 'Photography and Videography':
      return ['Cinematic Wedding Films', 'Candid Wedding Photography', 'Drone Aerial 4K Coverage', 'Traditional Albums', 'Same-Day Edit Teasers'];
    case 'Event Organizers / Wedding Planners':
      return ['Vendor Contract Negotiation', 'Day-of Event Management', 'RSVP & Guest Hospitality', 'Budget Monitoring', 'Checklist Execution'];
    case 'End-to-End Event Management':
    case 'End-to-End Event Management Providers':
      return ['Complete Turnkey Wedding Management', 'Hospitality & Logistics', 'Full Vendor Supervision', 'Production & Decor Oversight'];
    case 'Logistics and Transportation':
      return ['Luxury Bridal Fleet', 'AC Coaches for Guests', 'Dedicated Airport Shuttles', 'Chauffeur Coordination', 'Real-Time Dispatch'];
    case 'Makeup and Mehendi Artists':
      return ['Airbrush HD Bridal Makeup', 'Hair Styling & Saree Draping', 'Organic Rajasthani Mehendi', 'Guest Mehendi Artists', 'Pre-Bridal Grooming'];
    default:
      return ['Full Service Consultation', 'On-Site Coordination', 'Quality Assurance'];
  }
}

// Read existing demo vendors
const demoVendorsPath = path.join(__dirname, '../src/data/demoVendors.ts');
const rawContent = fs.readFileSync(demoVendorsPath, 'utf8');

// Parse vendors array using regex extraction
const jsonMatch = rawContent.match(/export const DEMO_VENDORS:\s*Vendor\[\]\s*=\s*(\[[\s\S]*\]);/);
if (!jsonMatch) {
  console.error('Could not find DEMO_VENDORS array in demoVendors.ts');
  process.exit(1);
}

const existingVendors = JSON.parse(jsonMatch[1]);
console.log(`Loaded ${existingVendors.length} existing vendors.`);

// Deduplicate: retain only original baseline vendors (100 vendors)
const baselineVendors = existingVendors.filter(
  (v) =>
    !v.id.includes('-flw-') &&
    !v.id.endsWith('-fur-05') &&
    !v.id.endsWith('-hot-05') &&
    !v.id.endsWith('-log-03') &&
    !v.id.endsWith('-log-04') &&
    !v.id.endsWith('-log-05') &&
    !v.id.endsWith('-mak-03') &&
    !v.id.endsWith('-mak-04') &&
    !v.id.endsWith('-mak-05')
);
console.log(`Retaining ${baselineVendors.length} baseline original vendors.`);

// Update baseline vendors
const updatedVendors = baselineVendors.map((v) => {
  // Normalize category names if applicable
  let cat = v.category;
  if (cat === 'Hotels, Lodging and Guest Accommodation') cat = 'Hotels and Guest Accommodation';
  if (cat === 'End-to-End Event Management Providers') cat = 'End-to-End Event Management';
  if (cat === 'Decoration and Flower Arrangements') cat = 'Decoration Services';

  const secondary = v.secondaryCategories || [];
  // If it's a decorator, add Flower Arrangements as secondary if not present
  if (cat === 'Decoration Services' && !secondary.includes('Flower Arrangements')) {
    secondary.push('Flower Arrangements');
  }

  const isNew = v.isNewToPlatform || v.completedOrders90Days === 0;
  const metrics = generateAreaMetrics(v.serviceableAreas, v.completedOrders90Days, isNew);

  return {
    ...v,
    category: cat,
    secondaryCategories: secondary,
    serviceOfferings: v.serviceOfferings || generateServiceOfferings(cat),
    repeatOrdersArea: metrics.repeatOrdersArea,
    referralsArea: metrics.referralsArea,
    repeatOrdersTotal: metrics.repeatOrdersTotal,
    referralsTotal: metrics.referralsTotal,
    // Keep AOV field internally for data safety but will never be shown in UI
    averageOrderValue90Days: v.averageOrderValue90Days || 0,
  };
});

// Additional Vendors needed to guarantee >= 5 per canonical category in both cities
const additionalVendors = [
  // --- MUMBAI ADDITIONAL VENDORS ---
  // Flower Arrangements (5 distinct vendors for Mumbai)
  {
    id: 'mum-flw-01',
    businessName: 'Orchid Bloom Exotic Floral Stylists',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Bandra', 'Lower Parel', 'Dadar', 'Powai'],
    category: 'Flower Arrangements',
    secondaryCategories: ['Decoration Services'],
    description: 'Bespoke fresh floral decor, imported Dutch orchids, exotic varmala designs, and fragrant jasmine floral tunnels.',
    serviceOfferings: generateServiceOfferings('Flower Arrangements'),
    maximumSimultaneousBookings: 3,
    startingPrice: 65000,
    priceUnit: 'per wedding',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available', '2026-12-20': 'Available' },
    completedOrders90Days: 16,
    ...generateAreaMetrics(['Bandra', 'Lower Parel', 'Dadar', 'Powai'], 16, false),
    portfolioImages: ['/assets/flw-1.jpg', '/assets/flw-2.jpg'],
    serviceTags: ['Exotic Florals', 'Orchid Mandaps', 'Custom Varmalas', 'Fragrant Tunnels'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-flw-01.demo.wedora.in',
    contactPhone: '+91 98000 0051',
  },
  {
    id: 'mum-flw-02',
    businessName: 'Genda Phool Traditional Floral Curators',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Dadar', 'Chembur', 'Ghatkopar', 'Mulund'],
    category: 'Flower Arrangements',
    secondaryCategories: ['Decoration Services'],
    description: 'Heritage marigold, rose petal carpet, traditional South Indian lotus installations, and auspicious pooja floral backdrops.',
    serviceOfferings: generateServiceOfferings('Flower Arrangements'),
    maximumSimultaneousBookings: 4,
    startingPrice: 45000,
    priceUnit: 'per celebration',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-25': 'Available' },
    completedOrders90Days: 22,
    ...generateAreaMetrics(['Dadar', 'Chembur', 'Ghatkopar', 'Mulund'], 22, false),
    portfolioImages: ['/assets/flw-1.jpg'],
    serviceTags: ['Traditional Marigold', 'Lotus Mandap', 'Puja Florals', 'Heritage Styling'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-flw-02.demo.wedora.in',
    contactPhone: '+91 98000 0052',
  },
  {
    id: 'mum-flw-03',
    businessName: 'Petals & Pearls Luxury Floral Couture',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Lower Parel', 'Bandra', 'Andheri'],
    category: 'Flower Arrangements',
    secondaryCategories: ['Decoration Services'],
    description: 'Ultra-luxury floral chandeliers, English garden arches, cascading hydrangea centerpieces, and white lily entrance walkways.',
    serviceOfferings: generateServiceOfferings('Flower Arrangements'),
    maximumSimultaneousBookings: 2,
    startingPrice: 120000,
    priceUnit: 'per setup',
    quotationRequired: true,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available', '2026-12-28': 'Available' },
    completedOrders90Days: 14,
    ...generateAreaMetrics(['Lower Parel', 'Bandra', 'Andheri'], 14, false),
    portfolioImages: ['/assets/flw-2.jpg'],
    serviceTags: ['Hydrangea Arches', 'Floral Chandeliers', 'English Garden', 'Couture Floral'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-flw-03.demo.wedora.in',
    contactPhone: '+91 98000 0053',
  },
  {
    id: 'mum-flw-04',
    businessName: 'Mayura Fresh Botanical Floral Craft',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Borivali', 'Malad', 'Goregaon'],
    category: 'Flower Arrangements',
    secondaryCategories: [],
    description: 'Eco-friendly organic blooms, locally grown Indian blossoms, botanical green walls, and fragrant mogra accessories.',
    serviceOfferings: generateServiceOfferings('Flower Arrangements'),
    maximumSimultaneousBookings: 3,
    startingPrice: 38000,
    priceUnit: 'per event',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-20': 'Available' },
    completedOrders90Days: 11,
    ...generateAreaMetrics(['Borivali', 'Malad', 'Goregaon'], 11, false),
    portfolioImages: ['/assets/flw-1.jpg'],
    serviceTags: ['Eco Florals', 'Mogra Accents', 'Botanical Decor', 'Green Walls'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-flw-04.demo.wedora.in',
    contactPhone: '+91 98000 0054',
  },
  {
    id: 'mum-flw-05',
    businessName: 'Rajlaxmi Floral & Flower Mandaps',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Thane', 'Navi Mumbai', 'Mulund'],
    category: 'Flower Arrangements',
    secondaryCategories: ['Decoration Services'],
    description: 'Grand temple style floral mandaps, carnation pillars, rajnigandha drops, and floral stage canopies.',
    serviceOfferings: generateServiceOfferings('Flower Arrangements'),
    maximumSimultaneousBookings: 3,
    startingPrice: 52000,
    priceUnit: 'per wedding',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available' },
    completedOrders90Days: 17,
    ...generateAreaMetrics(['Thane', 'Navi Mumbai', 'Mulund'], 17, false),
    portfolioImages: ['/assets/flw-2.jpg'],
    serviceTags: ['Temple Mandap', 'Rajnigandha Strings', 'Carnations', 'Grand Floral Canopy'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-flw-05.demo.wedora.in',
    contactPhone: '+91 98000 0055',
  },

  // Lighting Services (Mumbai needs 1 more)
  {
    id: 'mum-lig-05',
    businessName: 'Starlight Intelligent Event Illumination',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Andheri', 'Bandra', 'Goregaon', 'Powai'],
    category: 'Lighting Services',
    secondaryCategories: ['DJ and Sound Systems'],
    description: 'Computer-controlled beam moving heads, warm Edison bulb installations, dynamic architectural wash, and laser lighting shows.',
    serviceOfferings: generateServiceOfferings('Lighting Services'),
    maximumSimultaneousBookings: 3,
    startingPrice: 42000,
    priceUnit: 'per setup',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available', '2026-12-25': 'Available' },
    completedOrders90Days: 20,
    ...generateAreaMetrics(['Andheri', 'Bandra', 'Goregaon', 'Powai'], 20, false),
    portfolioImages: ['/assets/lig-1.jpg'],
    serviceTags: ['Intelligent Lighting', 'Edison Bulbs', 'Architectural Wash', 'Laser Shows'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-lig-05.demo.wedora.in',
    contactPhone: '+91 98000 0056',
  },

  // DJ and Sound Systems (Mumbai needs 1 more)
  {
    id: 'mum-djs-05',
    businessName: 'Bassline Live & Sangeet DJ Consoles',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Lower Parel', 'Dadar', 'Bandra', 'Chembur'],
    category: 'DJ and Sound Systems',
    secondaryCategories: ['Lighting Services'],
    description: 'High-energy Bollywood & Punjabi sangeet DJ setups, JBL VRX concert line arrays, live percussionist integration, and silent disco headphones.',
    serviceOfferings: generateServiceOfferings('DJ and Sound Systems'),
    maximumSimultaneousBookings: 2,
    startingPrice: 48000,
    priceUnit: 'per night',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-20': 'Available' },
    completedOrders90Days: 25,
    ...generateAreaMetrics(['Lower Parel', 'Dadar', 'Bandra', 'Chembur'], 25, false),
    portfolioImages: ['/assets/djs-1.jpg'],
    serviceTags: ['Sangeet DJ', 'JBL Line Array', 'Live Percussion', 'Bollywood & EDM'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-djs-05.demo.wedora.in',
    contactPhone: '+91 98000 0057',
  },

  // Furniture and Equipment Rental (Mumbai needs 1 more)
  {
    id: 'mum-fur-05',
    businessName: 'Imperial Velvet & Chiavari Rentals',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Andheri', 'Bandra', 'Powai', 'Borivali'],
    category: 'Furniture and Equipment Rental',
    secondaryCategories: [],
    description: 'Gold-finish Chiavari chairs, emerald velvet chesterfield lounges, mirror dining tables, bar counter setups, and industrial air coolers.',
    serviceOfferings: generateServiceOfferings('Furniture and Equipment Rental'),
    maximumSimultaneousBookings: 4,
    startingPrice: 32000,
    priceUnit: 'per event rental',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available', '2026-12-25': 'Available' },
    completedOrders90Days: 18,
    ...generateAreaMetrics(['Andheri', 'Bandra', 'Powai', 'Borivali'], 18, false),
    portfolioImages: ['/assets/fur-1.jpg'],
    serviceTags: ['Chiavari Chairs', 'Chesterfield Lounges', 'Mirror Tables', 'Bar Setups'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-fur-05.demo.wedora.in',
    contactPhone: '+91 98000 0058',
  },

  // Hotels and Guest Accommodation (Mumbai needs 1 more)
  {
    id: 'mum-hot-05',
    businessName: 'The Sapphire Bay Waterfront Hotel & Suites',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Bandra', 'Lower Parel'],
    category: 'Hotels and Guest Accommodation',
    secondaryCategories: ['Wedding Lawns and Venues'],
    description: 'Luxury ocean-view rooms for wedding party guests, dedicated hospitality suites, welcome champagne breakfasts, and group concierge.',
    serviceOfferings: generateServiceOfferings('Hotels and Guest Accommodation'),
    maximumGuestCapacity: 450,
    maximumSimultaneousBookings: 2,
    startingPrice: 9500,
    priceUnit: 'per room/night',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available', '2026-12-20': 'Available' },
    completedOrders90Days: 13,
    ...generateAreaMetrics(['Bandra', 'Lower Parel'], 13, false),
    portfolioImages: ['/assets/hot-1.jpg'],
    serviceTags: ['Ocean View Suites', 'Hospitality Floor', 'Wedding Room Blocks', 'Valet'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-hot-05.demo.wedora.in',
    contactPhone: '+91 98000 0059',
  },

  // Photography and Videography (Mumbai needs 1 more)
  {
    id: 'mum-pho-05',
    businessName: 'Lumiere Cinematic Wedding Stories',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Bandra', 'Andheri', 'Lower Parel', 'Dadar'],
    category: 'Photography and Videography',
    secondaryCategories: [],
    description: 'Award-winning wedding photojournalism, Sony FX6 4K cinema cameras, candid emotional captures, and handcrafted leather coffee table albums.',
    serviceOfferings: generateServiceOfferings('Photography and Videography'),
    maximumSimultaneousBookings: 2,
    startingPrice: 110000,
    priceUnit: 'per wedding',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available', '2026-12-25': 'Available' },
    completedOrders90Days: 21,
    ...generateAreaMetrics(['Bandra', 'Andheri', 'Lower Parel', 'Dadar'], 21, false),
    portfolioImages: ['/assets/pho-1.jpg'],
    serviceTags: ['Cinematic Film', 'Candid Photojournalism', 'Handcrafted Albums', 'Drone 4K'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-pho-05.demo.wedora.in',
    contactPhone: '+91 98000 0060',
  },

  // End-to-End Event Management (Mumbai needs 2 more)
  {
    id: 'mum-e2e-04',
    businessName: 'Vows & Beyond Turnkey Wedding Management',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Bandra', 'Lower Parel', 'Powai', 'Dadar'],
    category: 'End-to-End Event Management',
    secondaryCategories: ['Event Organizers / Wedding Planners', 'Decoration Services'],
    description: 'Complete 360-degree wedding production: catering curation, design, celebrity entertainment, bridal hospitality, and on-site timeline director.',
    serviceOfferings: generateServiceOfferings('End-to-End Event Management'),
    maximumGuestCapacity: 1500,
    maximumSimultaneousBookings: 2,
    startingPrice: 350000,
    priceUnit: 'turnkey management fee',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available', '2026-12-20': 'Available' },
    completedOrders90Days: 19,
    ...generateAreaMetrics(['Bandra', 'Lower Parel', 'Powai', 'Dadar'], 19, false),
    portfolioImages: ['/assets/org-1.jpg'],
    serviceTags: ['Turnkey Production', 'Celebrity Talent', '360 Hospitality', 'Timeline Director'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-e2e-04.demo.wedora.in',
    contactPhone: '+91 98000 0061',
  },
  {
    id: 'mum-e2e-05',
    businessName: 'Regal Mumbai Grand Celebrations Turnkey',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Navi Mumbai', 'Thane', 'Ghatkopar', 'Chembur'],
    category: 'End-to-End Event Management',
    secondaryCategories: ['Event Organizers / Wedding Planners'],
    description: 'Comprehensive luxury wedding management, multi-day itinerary execution, vendor negotiation, and seamless family concierge service.',
    serviceOfferings: generateServiceOfferings('End-to-End Event Management'),
    maximumGuestCapacity: 1200,
    maximumSimultaneousBookings: 2,
    startingPrice: 280000,
    priceUnit: 'turnkey management fee',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-25': 'Available' },
    completedOrders90Days: 15,
    ...generateAreaMetrics(['Navi Mumbai', 'Thane', 'Ghatkopar', 'Chembur'], 15, false),
    portfolioImages: ['/assets/org-2.jpg'],
    serviceTags: ['Grand Celebrations', 'Turnkey Accountability', 'Family Concierge', 'Budget Control'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-e2e-05.demo.wedora.in',
    contactPhone: '+91 98000 0062',
  },

  // Logistics and Transportation (Mumbai needs 3 more)
  {
    id: 'mum-log-03',
    businessName: 'Royal Wheels Mumbai Luxury Wedding Chauffeurs',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Bandra', 'Andheri', 'Lower Parel', 'Powai'],
    category: 'Logistics and Transportation',
    secondaryCategories: [],
    description: 'Mercedes Maybach and vintage Rolls Royce bridal entry cars, uniformed chauffeurs, red carpet boarding, and GPS tracked convoy.',
    serviceOfferings: generateServiceOfferings('Logistics and Transportation'),
    maximumSimultaneousBookings: 4,
    startingPrice: 45000,
    priceUnit: 'per bridal car day',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available', '2026-12-20': 'Available' },
    completedOrders90Days: 23,
    ...generateAreaMetrics(['Bandra', 'Andheri', 'Lower Parel', 'Powai'], 23, false),
    portfolioImages: ['/assets/log-1.jpg'],
    serviceTags: ['Vintage Cars', 'Maybach Bridal Entry', 'Uniformed Chauffeurs', 'GPS Convoy'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-log-03.demo.wedora.in',
    contactPhone: '+91 98000 0063',
  },
  {
    id: 'mum-log-04',
    businessName: 'Metro Shuttles & Guest Fleet Mumbai',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Dadar', 'Chembur', 'Ghatkopar', 'Thane', 'Navi Mumbai'],
    category: 'Logistics and Transportation',
    secondaryCategories: [],
    description: 'Fleet of 35-seater luxury AC Volvo coaches, airport arrival meet-and-greet, hotel-to-venue transfers, and real-time dispatcher dispatch.',
    serviceOfferings: generateServiceOfferings('Logistics and Transportation'),
    maximumSimultaneousBookings: 5,
    startingPrice: 28000,
    priceUnit: 'per coach day',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-25': 'Available' },
    completedOrders90Days: 31,
    ...generateAreaMetrics(['Dadar', 'Chembur', 'Ghatkopar', 'Thane', 'Navi Mumbai'], 31, false),
    portfolioImages: ['/assets/log-2.jpg'],
    serviceTags: ['Volvo AC Coaches', 'Airport Meet & Greet', 'Guest Shuttles', 'Dispatcher Desk'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-log-04.demo.wedora.in',
    contactPhone: '+91 98000 0064',
  },
  {
    id: 'mum-log-05',
    businessName: 'Express Wedding Logistics & Luggage Transit',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Borivali', 'Malad', 'Goregaon', 'Andheri'],
    category: 'Logistics and Transportation',
    secondaryCategories: [],
    description: 'Wedding gifts, trousseau hampers, heavy equipment luggage transit vans, and multi-venue courier logistics team.',
    serviceOfferings: generateServiceOfferings('Logistics and Transportation'),
    maximumSimultaneousBookings: 4,
    startingPrice: 18000,
    priceUnit: 'per day service',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available' },
    completedOrders90Days: 17,
    ...generateAreaMetrics(['Borivali', 'Malad', 'Goregaon', 'Andheri'], 17, false),
    portfolioImages: ['/assets/log-1.jpg'],
    serviceTags: ['Trousseau Transit', 'Hamper Delivery', 'Equipment Logistics', 'Multi-Venue Van'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-log-05.demo.wedora.in',
    contactPhone: '+91 98000 0065',
  },

  // Makeup and Mehendi Artists (Mumbai needs 3 more)
  {
    id: 'mum-mak-03',
    businessName: 'Glamour Glow HD Bridal Makeup Studio',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Bandra', 'Lower Parel', 'Andheri'],
    category: 'Makeup and Mehendi Artists',
    secondaryCategories: [],
    description: 'International MAC & Charlotte Tilbury HD bridal makeover, glass skin finish, bespoke hair styling, and saree draping stylist.',
    serviceOfferings: generateServiceOfferings('Makeup and Mehendi Artists'),
    maximumSimultaneousBookings: 2,
    startingPrice: 35000,
    priceUnit: 'per bridal look',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available', '2026-12-20': 'Available' },
    completedOrders90Days: 26,
    ...generateAreaMetrics(['Bandra', 'Lower Parel', 'Andheri'], 26, false),
    portfolioImages: ['/assets/mak-1.jpg'],
    serviceTags: ['HD Bridal Makeup', 'Glass Skin Finish', 'Hair Sculpting', 'Saree Draping'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-mak-03.demo.wedora.in',
    contactPhone: '+91 98000 0066',
  },
  {
    id: 'mum-mak-04',
    businessName: 'Heena Heritage Organic Rajasthani Mehendi',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Dadar', 'Chembur', 'Ghatkopar', 'Mulund'],
    category: 'Makeup and Mehendi Artists',
    secondaryCategories: [],
    description: '100% pure organic chemical-free Rajasthani dark stain sojat henna, intricate couple portraits, figure work, and sangeet guest artists.',
    serviceOfferings: generateServiceOfferings('Makeup and Mehendi Artists'),
    maximumSimultaneousBookings: 3,
    startingPrice: 22000,
    priceUnit: 'per bridal mehndi',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-25': 'Available' },
    completedOrders90Days: 29,
    ...generateAreaMetrics(['Dadar', 'Chembur', 'Ghatkopar', 'Mulund'], 29, false),
    portfolioImages: ['/assets/mak-2.jpg'],
    serviceTags: ['Organic Sojat Henna', 'Portrait Work', 'Dark Stain Guarantee', 'Guest Artists Team'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-mak-04.demo.wedora.in',
    contactPhone: '+91 98000 0067',
  },
  {
    id: 'mum-mak-05',
    businessName: 'Grace & Gold Bridal Beauty Lounge',
    primaryCity: 'Mumbai',
    serviceableAreas: ['Powai', 'Goregaon', 'Malad', 'Borivali'],
    category: 'Makeup and Mehendi Artists',
    secondaryCategories: [],
    description: 'Airbrush bridal artistry, waterproof wedding ceremony makeup, family makeover packages, and floral hair accessories styling.',
    serviceOfferings: generateServiceOfferings('Makeup and Mehendi Artists'),
    maximumSimultaneousBookings: 2,
    startingPrice: 28000,
    priceUnit: 'per bridal package',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available' },
    completedOrders90Days: 21,
    ...generateAreaMetrics(['Powai', 'Goregaon', 'Malad', 'Borivali'], 21, false),
    portfolioImages: ['/assets/mak-1.jpg'],
    serviceTags: ['Airbrush Makeup', 'Waterproof Formula', 'Family Makeover', 'Floral Hairdo'],
    isNewToPlatform: false,
    contactEmail: 'contact@mum-mak-05.demo.wedora.in',
    contactPhone: '+91 98000 0068',
  },

  // --- PUNE ADDITIONAL VENDORS ---
  // Flower Arrangements (5 distinct vendors for Pune)
  {
    id: 'pun-flw-01',
    businessName: 'Shubharambh Fresh Floral Curators Pune',
    primaryCity: 'Pune',
    serviceableAreas: ['Baner', 'Wakad', 'Aundh', 'Hinjewadi'],
    category: 'Flower Arrangements',
    secondaryCategories: ['Decoration Services'],
    description: 'Traditional Maharashtrian zendu phool mandaps, fresh mogra jhumars, rose petal showers, and fragrant varmala sets.',
    serviceOfferings: generateServiceOfferings('Flower Arrangements'),
    maximumSimultaneousBookings: 4,
    startingPrice: 42000,
    priceUnit: 'per wedding',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available', '2026-12-20': 'Available' },
    completedOrders90Days: 18,
    ...generateAreaMetrics(['Baner', 'Wakad', 'Aundh', 'Hinjewadi'], 18, false),
    portfolioImages: ['/assets/flw-1.jpg'],
    serviceTags: ['Zendu Phool', 'Mogra Jhumars', 'Rose Petal Shower', 'Maharashtrian Mandap'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-flw-01.demo.wedora.in',
    contactPhone: '+91 98000 0069',
  },
  {
    id: 'pun-flw-02',
    businessName: 'Flora Couture Pune Exotic Botanical Design',
    primaryCity: 'Pune',
    serviceableAreas: ['Koregaon Park', 'Kalyani Nagar', 'Viman Nagar', 'Kharadi'],
    category: 'Flower Arrangements',
    secondaryCategories: ['Decoration Services'],
    description: 'Imported tulip and hydrangea floral tablescapes, botanical bar installations, rustic foliage arches, and pastel carnation canopies.',
    serviceOfferings: generateServiceOfferings('Flower Arrangements'),
    maximumSimultaneousBookings: 3,
    startingPrice: 75000,
    priceUnit: 'per celebration',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-25': 'Available' },
    completedOrders90Days: 14,
    ...generateAreaMetrics(['Koregaon Park', 'Kalyani Nagar', 'Viman Nagar', 'Kharadi'], 14, false),
    portfolioImages: ['/assets/flw-2.jpg'],
    serviceTags: ['Exotic Botanical', 'Pastel Hydrangeas', 'Rustic Arches', 'Cocktail Floral Bar'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-flw-02.demo.wedora.in',
    contactPhone: '+91 98000 0070',
  },
  {
    id: 'pun-flw-03',
    businessName: 'Kothrud Botanical & Fresh Petals Workshop',
    primaryCity: 'Pune',
    serviceableAreas: ['Kothrud', 'Shivajinagar', 'Pimpri-Chinchwad'],
    category: 'Flower Arrangements',
    secondaryCategories: [],
    description: 'Fresh farm-sourced marigold, tuberose and orchid floral backdrops, pheras floral rangoli, and auspicious floral entrances.',
    serviceOfferings: generateServiceOfferings('Flower Arrangements'),
    maximumSimultaneousBookings: 3,
    startingPrice: 35000,
    priceUnit: 'per event',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available', '2026-12-28': 'Available' },
    completedOrders90Days: 19,
    ...generateAreaMetrics(['Kothrud', 'Shivajinagar', 'Pimpri-Chinchwad'], 19, false),
    portfolioImages: ['/assets/flw-1.jpg'],
    serviceTags: ['Tuberose Strings', 'Floral Rangoli', 'Farm-Sourced', 'Pheras Styling'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-flw-03.demo.wedora.in',
    contactPhone: '+91 98000 0071',
  },
  {
    id: 'pun-flw-04',
    businessName: 'Magarpatta Royal Rose & Lotus Floral Art',
    primaryCity: 'Pune',
    serviceableAreas: ['Hadapsar', 'Magarpatta', 'Kharadi'],
    category: 'Flower Arrangements',
    secondaryCategories: ['Decoration Services'],
    description: 'Royal pink lotus floating ponds, red Dutch rose arches, gold brass urns with jasmine, and bridal palki floral decoration.',
    serviceOfferings: generateServiceOfferings('Flower Arrangements'),
    maximumSimultaneousBookings: 2,
    startingPrice: 55000,
    priceUnit: 'per wedding',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-20': 'Available' },
    completedOrders90Days: 15,
    ...generateAreaMetrics(['Hadapsar', 'Magarpatta', 'Kharadi'], 15, false),
    portfolioImages: ['/assets/flw-2.jpg'],
    serviceTags: ['Floating Lotus', 'Dutch Rose Arches', 'Palki Decor', 'Brass Urns'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-flw-04.demo.wedora.in',
    contactPhone: '+91 98000 0072',
  },
  {
    id: 'pun-flw-05',
    businessName: 'Aundh Floral Artisans & Garland Creators',
    primaryCity: 'Pune',
    serviceableAreas: ['Aundh', 'Baner', 'Shivajinagar'],
    category: 'Flower Arrangements',
    secondaryCategories: [],
    description: 'Artisanal custom wedding garlands, pearl-embedded varmalas, stage flower canopies, and haldi yellow blossom themes.',
    serviceOfferings: generateServiceOfferings('Flower Arrangements'),
    maximumSimultaneousBookings: 3,
    startingPrice: 32000,
    priceUnit: 'per setup',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available' },
    completedOrders90Days: 13,
    ...generateAreaMetrics(['Aundh', 'Baner', 'Shivajinagar'], 13, false),
    portfolioImages: ['/assets/flw-1.jpg'],
    serviceTags: ['Custom Garlands', 'Pearl Varmala', 'Haldi Blossoms', 'Stage Canopy'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-flw-05.demo.wedora.in',
    contactPhone: '+91 98000 0073',
  },

  // Lighting Services (Pune needs 1 more)
  {
    id: 'pun-lig-05',
    businessName: 'Deccan Dynamic Stage & Ambient Lighting Pune',
    primaryCity: 'Pune',
    serviceableAreas: ['Baner', 'Wakad', 'Kothrud', 'Shivajinagar'],
    category: 'Lighting Services',
    secondaryCategories: ['DJ and Sound Systems'],
    description: 'High-power LED pars, fairy light tunnels, outdoor lawn tree uplighting, hazers, and synchronized stage lighting consoles.',
    serviceOfferings: generateServiceOfferings('Lighting Services'),
    maximumSimultaneousBookings: 3,
    startingPrice: 38000,
    priceUnit: 'per event setup',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available', '2026-12-25': 'Available' },
    completedOrders90Days: 24,
    ...generateAreaMetrics(['Baner', 'Wakad', 'Kothrud', 'Shivajinagar'], 24, false),
    portfolioImages: ['/assets/lig-1.jpg'],
    serviceTags: ['Fairy Tunnels', 'Lawn Uplighting', 'Synchronized Consoles', 'Hazers'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-lig-05.demo.wedora.in',
    contactPhone: '+91 98000 0074',
  },

  // DJ and Sound Systems (Pune needs 1 more)
  {
    id: 'pun-djs-05',
    businessName: 'Viman Beat Pro Audio & Wedding DJ System',
    primaryCity: 'Pune',
    serviceableAreas: ['Viman Nagar', 'Koregaon Park', 'Kharadi', 'Hadapsar'],
    category: 'DJ and Sound Systems',
    secondaryCategories: ['Lighting Services'],
    description: 'Pioneer Nexus DJ setups, high-fidelity RCF line array speakers, Punjabi Dhol troupe, and customized bridal entrance tracks.',
    serviceOfferings: generateServiceOfferings('DJ and Sound Systems'),
    maximumSimultaneousBookings: 2,
    startingPrice: 44000,
    priceUnit: 'per evening',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-20': 'Available' },
    completedOrders90Days: 22,
    ...generateAreaMetrics(['Viman Nagar', 'Koregaon Park', 'Kharadi', 'Hadapsar'], 22, false),
    portfolioImages: ['/assets/djs-1.jpg'],
    serviceTags: ['Pioneer Nexus', 'RCF Sound', 'Dhol Troupe', 'Bridal Tracks'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-djs-05.demo.wedora.in',
    contactPhone: '+91 98000 0075',
  },

  // Furniture and Equipment Rental (Pune needs 1 more)
  {
    id: 'pun-fur-05',
    businessName: 'Pinnacle Event Furniture & Gazebos Pune',
    primaryCity: 'Pune',
    serviceableAreas: ['Baner', 'Wakad', 'Hinjewadi', 'Aundh'],
    category: 'Furniture and Equipment Rental',
    secondaryCategories: [],
    description: 'Heavy duty waterproof pagoda tents, royal Diwan seating, wooden dance floors, brass chafing dishes, and silent diesel generators.',
    serviceOfferings: generateServiceOfferings('Furniture and Equipment Rental'),
    maximumSimultaneousBookings: 4,
    startingPrice: 30000,
    priceUnit: 'per package setup',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available', '2026-12-25': 'Available' },
    completedOrders90Days: 19,
    ...generateAreaMetrics(['Baner', 'Wakad', 'Hinjewadi', 'Aundh'], 19, false),
    portfolioImages: ['/assets/fur-1.jpg'],
    serviceTags: ['Pagoda Tents', 'Royal Diwan', 'Dance Floor', 'Silent Genset'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-fur-05.demo.wedora.in',
    contactPhone: '+91 98000 0076',
  },

  // Hotels and Guest Accommodation (Pune needs 1 more)
  {
    id: 'pun-hot-05',
    businessName: 'The West Crest Grand Hotel & Suites Pune',
    primaryCity: 'Pune',
    serviceableAreas: ['Hinjewadi', 'Wakad', 'Baner'],
    category: 'Hotels and Guest Accommodation',
    secondaryCategories: ['Wedding Lawns and Venues'],
    description: '5-star guest room inventory for destination weddings, multi-cuisine breakfast spreads, bridal makeup suites, and expressway connectivity.',
    serviceOfferings: generateServiceOfferings('Hotels and Guest Accommodation'),
    maximumGuestCapacity: 500,
    maximumSimultaneousBookings: 2,
    startingPrice: 6500,
    priceUnit: 'per room/night',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available', '2026-12-20': 'Available' },
    completedOrders90Days: 16,
    ...generateAreaMetrics(['Hinjewadi', 'Wakad', 'Baner'], 16, false),
    portfolioImages: ['/assets/hot-1.jpg'],
    serviceTags: ['5-Star Luxury', 'Wedding Room Blocks', 'Expressway Proximity', 'Bridal Suites'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-hot-05.demo.wedora.in',
    contactPhone: '+91 98000 0077',
  },

  // Photography and Videography (Pune needs 1 more)
  {
    id: 'pun-pho-05',
    businessName: 'The Heritage Lens Candid Photography Pune',
    primaryCity: 'Pune',
    serviceableAreas: ['Kothrud', 'Baner', 'Aundh', 'Shivajinagar'],
    category: 'Photography and Videography',
    secondaryCategories: [],
    description: 'Poetic storytelling photography, natural light wedding portraits, 4K multi-cam cinematic films, and drone coverage of royal baraat.',
    serviceOfferings: generateServiceOfferings('Photography and Videography'),
    maximumSimultaneousBookings: 2,
    startingPrice: 95000,
    priceUnit: 'per wedding',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available', '2026-12-25': 'Available' },
    completedOrders90Days: 20,
    ...generateAreaMetrics(['Kothrud', 'Baner', 'Aundh', 'Shivajinagar'], 20, false),
    portfolioImages: ['/assets/pho-1.jpg'],
    serviceTags: ['Poetic Storytelling', 'Natural Light', '4K Cinema', 'Baraat Drone'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-pho-05.demo.wedora.in',
    contactPhone: '+91 98000 0078',
  },

  // End-to-End Event Management (Pune needs 2 more)
  {
    id: 'pun-e2e-04',
    businessName: 'Maratha Heritage Turnkey Wedding Planners',
    primaryCity: 'Pune',
    serviceableAreas: ['Shivajinagar', 'Kothrud', 'Baner', 'Aundh'],
    category: 'End-to-End Event Management',
    secondaryCategories: ['Event Organizers / Wedding Planners', 'Decoration Services'],
    description: 'Authentic royal Peshwai and modern turnkey wedding orchestration, complete vendor coordination, traditional hospitality, and on-site timeline director.',
    serviceOfferings: generateServiceOfferings('End-to-End Event Management'),
    maximumGuestCapacity: 1400,
    maximumSimultaneousBookings: 2,
    startingPrice: 260000,
    priceUnit: 'turnkey management fee',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available', '2026-12-20': 'Available' },
    completedOrders90Days: 18,
    ...generateAreaMetrics(['Shivajinagar', 'Kothrud', 'Baner', 'Aundh'], 18, false),
    portfolioImages: ['/assets/org-1.jpg'],
    serviceTags: ['Turnkey Orchestration', 'Peshwai Hospitality', 'Timeline Director', 'Vendor Coordination'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-e2e-04.demo.wedora.in',
    contactPhone: '+91 98000 0079',
  },
  {
    id: 'pun-e2e-05',
    businessName: 'Serene Vows Turnkey Event Productions Pune',
    primaryCity: 'Pune',
    serviceableAreas: ['Koregaon Park', 'Kharadi', 'Viman Nagar', 'Hadapsar'],
    category: 'End-to-End Event Management',
    secondaryCategories: ['Event Organizers / Wedding Planners'],
    description: 'Boutique end-to-end luxury wedding management, curated entertainment, milestone tracking, and seamless hospitality from arrival to departure.',
    serviceOfferings: generateServiceOfferings('End-to-End Event Management'),
    maximumGuestCapacity: 900,
    maximumSimultaneousBookings: 2,
    startingPrice: 310000,
    priceUnit: 'turnkey management fee',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-25': 'Available' },
    completedOrders90Days: 14,
    ...generateAreaMetrics(['Koregaon Park', 'Kharadi', 'Viman Nagar', 'Hadapsar'], 14, false),
    portfolioImages: ['/assets/org-2.jpg'],
    serviceTags: ['Boutique Turnkey', 'Curated Entertainment', 'Milestone Tracking', 'Guest Management'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-e2e-05.demo.wedora.in',
    contactPhone: '+91 98000 0080',
  },

  // Logistics and Transportation (Pune needs 3 more)
  {
    id: 'pun-log-03',
    businessName: 'Pune Royal Wheels Wedding Car Hire',
    primaryCity: 'Pune',
    serviceableAreas: ['Baner', 'Wakad', 'Kothrud', 'Aundh'],
    category: 'Logistics and Transportation',
    secondaryCategories: [],
    description: 'Mercedes-Benz E-Class and Audi A6 luxury bridal sedans, floral car decor, professional suited drivers, and punctual guest transport.',
    serviceOfferings: generateServiceOfferings('Logistics and Transportation'),
    maximumSimultaneousBookings: 3,
    startingPrice: 32000,
    priceUnit: 'per bridal sedan day',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available', '2026-12-20': 'Available' },
    completedOrders90Days: 24,
    ...generateAreaMetrics(['Baner', 'Wakad', 'Kothrud', 'Aundh'], 24, false),
    portfolioImages: ['/assets/log-1.jpg'],
    serviceTags: ['Mercedes Bridal Sedan', 'Floral Car Styling', 'Suited Drivers', 'Punctual Dispatch'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-log-03.demo.wedora.in',
    contactPhone: '+91 98000 0081',
  },
  {
    id: 'pun-log-04',
    businessName: 'Sahyadri Tourist Buses & Event Shuttles Pune',
    primaryCity: 'Pune',
    serviceableAreas: ['Hinjewadi', 'Pimpri-Chinchwad', 'Baner', 'Wakad'],
    category: 'Logistics and Transportation',
    secondaryCategories: [],
    description: 'Air-conditioned luxury mini-buses and 45-seater coaches for wedding baaraat, Mumbai-Pune expressway transfers, and luggage vans.',
    serviceOfferings: generateServiceOfferings('Logistics and Transportation'),
    maximumSimultaneousBookings: 5,
    startingPrice: 24000,
    priceUnit: 'per coach day',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-25': 'Available' },
    completedOrders90Days: 28,
    ...generateAreaMetrics(['Hinjewadi', 'Pimpri-Chinchwad', 'Baner', 'Wakad'], 28, false),
    portfolioImages: ['/assets/log-2.jpg'],
    serviceTags: ['AC Volvo Coaches', 'Expressway Transit', 'Baaraat Buses', '24/7 Support'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-log-04.demo.wedora.in',
    contactPhone: '+91 98000 0082',
  },
  {
    id: 'pun-log-05',
    businessName: 'Express Airport & Station Wedding Fleet Pune',
    primaryCity: 'Pune',
    serviceableAreas: ['Viman Nagar', 'Kharadi', 'Hadapsar', 'Koregaon Park'],
    category: 'Logistics and Transportation',
    secondaryCategories: [],
    description: 'Direct airport terminal guest pickups, flight delay monitoring, station meet-and-assist, and luxury Toyota Innova Crysta convoys.',
    serviceOfferings: generateServiceOfferings('Logistics and Transportation'),
    maximumSimultaneousBookings: 4,
    startingPrice: 19000,
    priceUnit: 'per Innova fleet day',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available' },
    completedOrders90Days: 22,
    ...generateAreaMetrics(['Viman Nagar', 'Kharadi', 'Hadapsar', 'Koregaon Park'], 22, false),
    portfolioImages: ['/assets/log-1.jpg'],
    serviceTags: ['Innova Crysta Convoy', 'Flight Tracking', 'Station Meet & Greet', 'Luggage Transit'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-log-05.demo.wedora.in',
    contactPhone: '+91 98000 0083',
  },

  // Makeup and Mehendi Artists (Pune needs 3 more)
  {
    id: 'pun-mak-03',
    businessName: 'Aura Bridal Makeovers & Styling Studio Pune',
    primaryCity: 'Pune',
    serviceableAreas: ['Baner', 'Aundh', 'Kothrud', 'Wakad'],
    category: 'Makeup and Mehendi Artists',
    secondaryCategories: [],
    description: 'Celebrity HD bridal makeover, bespoke hair styling, authentic Nauvari saree draping, and flawless photographic finish.',
    serviceOfferings: generateServiceOfferings('Makeup and Mehendi Artists'),
    maximumSimultaneousBookings: 2,
    startingPrice: 32000,
    priceUnit: 'per bridal look',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available', '2026-12-20': 'Available' },
    completedOrders90Days: 25,
    ...generateAreaMetrics(['Baner', 'Aundh', 'Kothrud', 'Wakad'], 25, false),
    portfolioImages: ['/assets/mak-1.jpg'],
    serviceTags: ['HD Makeover', 'Nauvari Saree Draping', 'Flawless Finish', 'Hair Styling'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-mak-03.demo.wedora.in',
    contactPhone: '+91 98000 0084',
  },
  {
    id: 'pun-mak-04',
    businessName: 'Swastik Organic Marwari & Arabic Mehendi Pune',
    primaryCity: 'Pune',
    serviceableAreas: ['Kothrud', 'Shivajinagar', 'Pimpri-Chinchwad'],
    category: 'Makeup and Mehendi Artists',
    secondaryCategories: [],
    description: 'Specialist in authentic Marwari, Arabic, and figure bridal henna, custom groom name embedding, and fast dark stain cones.',
    serviceOfferings: generateServiceOfferings('Makeup and Mehendi Artists'),
    maximumSimultaneousBookings: 3,
    startingPrice: 18000,
    priceUnit: 'per bridal mehndi',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-25': 'Available' },
    completedOrders90Days: 28,
    ...generateAreaMetrics(['Kothrud', 'Shivajinagar', 'Pimpri-Chinchwad'], 28, false),
    portfolioImages: ['/assets/mak-2.jpg'],
    serviceTags: ['Marwari Henna', 'Arabic Designs', 'Groom Name Embed', 'Dark Stain Cones'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-mak-04.demo.wedora.in',
    contactPhone: '+91 98000 0085',
  },
  {
    id: 'pun-mak-05',
    businessName: 'Lavanya Bridal Beauty & Mehendi Lounge Pune',
    primaryCity: 'Pune',
    serviceableAreas: ['Koregaon Park', 'Viman Nagar', 'Kharadi', 'Hadapsar'],
    category: 'Makeup and Mehendi Artists',
    secondaryCategories: [],
    description: 'Modern airbrush techniques, soft glam sangeet makeup, pre-wedding skin prep consultation, and organic bridal henna.',
    serviceOfferings: generateServiceOfferings('Makeup and Mehendi Artists'),
    maximumSimultaneousBookings: 2,
    startingPrice: 26000,
    priceUnit: 'per package',
    quotationRequired: false,
    availabilityDates: { '2026-12-15': 'Available', '2026-12-18': 'Available' },
    completedOrders90Days: 19,
    ...generateAreaMetrics(['Koregaon Park', 'Viman Nagar', 'Kharadi', 'Hadapsar'], 19, false),
    portfolioImages: ['/assets/mak-1.jpg'],
    serviceTags: ['Airbrush Makeup', 'Soft Glam Sangeet', 'Skin Prep', 'Bridal Henna'],
    isNewToPlatform: false,
    contactEmail: 'contact@pun-mak-05.demo.wedora.in',
    contactPhone: '+91 98000 0086',
  },
];

// Combine updated and additional vendors
const finalVendors = [...updatedVendors, ...additionalVendors].map((v) => ({
  ...v,
  averageOrderValue90Days:
    typeof v.averageOrderValue90Days === 'number'
      ? v.averageOrderValue90Days
      : v.completedOrders90Days > 0
      ? Math.round(v.completedOrders90Days * 15000)
      : 0,
}));

// Sort vendors deterministically by ID
finalVendors.sort((a, b) => a.id.localeCompare(b.id));

console.log(`Final vendor count: ${finalVendors.length}`);

// Validation of Category Coverage (Minimum 5 per category in each city)
const coverage = {};
for (const cat of CANONICAL_CATEGORIES) {
  coverage[cat] = { Mumbai: 0, Pune: 0 };
}

for (const v of finalVendors) {
  const cats = [v.category, ...(v.secondaryCategories || [])];
  for (const c of cats) {
    if (coverage[c]) {
      coverage[c][v.primaryCity]++;
    }
  }
}

console.log('\n--- CATEGORY COVERAGE AUDIT TABLE ---');
console.table(coverage);

let hasDeficit = false;
for (const cat of CANONICAL_CATEGORIES) {
  if (coverage[cat].Mumbai < 5) {
    console.error(`Deficit in Mumbai for category "${cat}": only ${coverage[cat].Mumbai}`);
    hasDeficit = true;
  }
  if (coverage[cat].Pune < 5) {
    console.error(`Deficit in Pune for category "${cat}": only ${coverage[cat].Pune}`);
    hasDeficit = true;
  }
}

if (hasDeficit) {
  console.error('Validation failed: not all categories have >= 5 vendors per city.');
  process.exit(1);
} else {
  console.log('SUCCESS: All 13 categories have at least 5 vendors in Mumbai AND at least 5 vendors in Pune!');
}

// Write back to demoVendors.ts
const outputContent = `import { Vendor } from '../types/vendor';

/**
 * AI Wedding Timeline Orchestrator — Version 4.0 Vendor Dataset
 * Preserves existing vendors and expands dataset to guarantee minimum 5 vendors
 * per category for both Mumbai and Pune across all 13 canonical categories.
 * All metrics, phone numbers, and names are fictional demonstration data.
 */

export const DEMO_VENDORS: Vendor[] = ${JSON.stringify(finalVendors, null, 2)};
`;

fs.writeFileSync(demoVendorsPath, outputContent, 'utf8');
console.log(`Saved ${finalVendors.length} vendors to ${demoVendorsPath}`);
