const fs = require('fs');
const path = require('path');

// Target category distribution per city (50 each, 100 total)
const categorySpecs = [
  { category: 'Catering and Food Services', count: 7, short: 'cat', hasCapacity: true, defaultUnit: 'per plate' },
  { category: 'Decoration and Flower Arrangements', count: 6, short: 'dec', hasCapacity: false, defaultUnit: 'per event' },
  { category: 'Lighting Services', count: 4, short: 'lig', hasCapacity: false, defaultUnit: 'per event' },
  { category: 'DJ and Sound Systems', count: 4, short: 'djs', hasCapacity: false, defaultUnit: 'per event' },
  { category: 'Furniture and Equipment Rental', count: 4, short: 'fur', hasCapacity: false, defaultUnit: 'per setup' },
  { category: 'Wedding Lawns and Venues', count: 5, short: 'ven', hasCapacity: true, defaultUnit: 'per day rental' },
  { category: 'Hotels, Lodging and Guest Accommodation', count: 4, short: 'hot', hasCapacity: true, defaultUnit: 'per room/night' },
  { category: 'Photography and Videography', count: 4, short: 'pho', hasCapacity: false, defaultUnit: 'per day' },
  { category: 'Event Organizers / Wedding Planners', count: 5, short: 'org', hasCapacity: true, defaultUnit: 'management fee' },
  { category: 'End-to-End Event Management Providers', count: 3, short: 'e2e', hasCapacity: true, defaultUnit: 'turnkey package' },
  { category: 'Logistics and Transportation', count: 2, short: 'log', hasCapacity: false, defaultUnit: 'per fleet day' },
  { category: 'Makeup and Mehendi Artists', count: 2, short: 'mak', hasCapacity: false, defaultUnit: 'per bridal package' },
];

const mumbaiAreas = [
  'Andheri', 'Bandra', 'Borivali', 'Goregaon', 'Malad', 'Powai',
  'Dadar', 'Lower Parel', 'Chembur', 'Ghatkopar', 'Mulund', 'Navi Mumbai', 'Thane'
];

const puneAreas = [
  'Baner', 'Wakad', 'Hinjewadi', 'Aundh', 'Kothrud', 'Viman Nagar',
  'Kharadi', 'Hadapsar', 'Koregaon Park', 'Shivajinagar', 'Pimpri-Chinchwad', 'Magarpatta'
];

// Curated data for Mumbai (50 vendors)
const mumbaiVendorsData = [
  // 1. Catering and Food Services (7)
  {
    name: 'Maharaja Royal Banquet Caterers',
    areas: ['Bandra', 'Lower Parel', 'Dadar'],
    desc: 'Grand royal wedding banquets featuring authentic North Indian, Gujarati, Marwari and global live culinary stations.',
    cap: 1500, price: 1450, orders: 19, aov: 420000,
    tags: ['Royal Banquets', 'Gujarati/Marwari', 'Live Counters', 'Silver Service'],
    dates: { '2026-12-15': 'Available', '2026-12-16': 'Tentative', '2026-12-20': 'Available' }
  },
  {
    name: 'Saffron Spice Gourmet Catering',
    areas: ['Powai', 'Andheri', 'Goregaon'],
    desc: 'Artisanal fusion catering, farm-to-table wedding spreads, curated cocktail dinners and dessert lounges.',
    cap: 900, price: 1250, orders: 15, aov: 310000,
    tags: ['Fusion Cuisine', 'Farm-to-Table', 'Cocktail Menus', 'Artisanal Desserts'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available', '2026-12-25': 'Fully Booked' }
  },
  {
    name: 'Konkan Coast Seafood & Maharashtrian Feasts',
    areas: ['Dadar', 'Thane', 'Mulund', 'Chembur'],
    desc: 'Heritage authentic Maharashtrian pângat, coastal delicacies, traditional modak counters and wedding thalis.',
    cap: 750, price: 950, orders: 22, aov: 235000,
    tags: ['Traditional Maharashtrian', 'Authentic Pangat', 'Coastal Specialities'],
    dates: { '2026-12-15': 'Available', '2026-12-17': 'Available' }
  },
  {
    name: 'Bayview Signature Banquets & Catering',
    areas: ['Bandra', 'Lower Parel', 'Dadar', 'Andheri'],
    desc: 'High-end plated dinners, European & pan-Asian live wok stations, and bespoke wedding cocktail catering.',
    cap: 1100, price: 1800, orders: 12, aov: 510000,
    tags: ['Luxury Plated Dining', 'Pan-Asian Woks', 'Beverage Catering'],
    dates: { '2026-12-15': 'Available', '2026-12-16': 'Available' }
  },
  {
    name: 'Annapurna Pure Veg Wedding Caterers',
    areas: ['Borivali', 'Malad', 'Goregaon', 'Ghatkopar'],
    desc: '100% pure vegetarian & Jain gourmet wedding feasts with 50+ regional delicacies and elaborate sweet displays.',
    cap: 1200, price: 850, orders: 26, aov: 260000,
    tags: ['Pure Vegetarian', 'Strict Jain Options', 'Sweet Mart Live'],
    dates: { '2026-12-15': 'Available', '2026-12-19': 'Tentative' }
  },
  {
    name: 'Navi Mumbai Gourmet Culinary Co.',
    areas: ['Navi Mumbai', 'Thane', 'Chembur'],
    desc: 'Multi-cuisine catering specializing in grand buffet spreads, chaat bazaars, tandoor nights, and mocktail bars.',
    cap: 800, price: 1100, orders: 11, aov: 275000,
    tags: ['Multi-Cuisine', 'Chaat Bazaars', 'Tandoor Live'],
    dates: { '2026-12-15': 'Available', '2026-12-24': 'Unavailable' }
  },
  {
    name: 'Aroma Artisanal Kitchens',
    areas: ['Andheri', 'Powai', 'Malad'],
    desc: 'Boutique culinary collective serving bespoke wedding brunches, mehendi high teas and reception banquets.',
    cap: 500, price: 1350, orders: 0, aov: 0, isNew: true,
    tags: ['Boutique Catering', 'Mehendi High Tea', 'Artisanal Brunches'],
    dates: { '2026-12-15': 'Available', '2026-12-22': 'Available' }
  },

  // 2. Decoration and Flower Arrangements (6)
  {
    name: 'Pushpa Vatika Floral Creations',
    areas: ['Bandra', 'Lower Parel', 'Dadar', 'Powai'],
    desc: 'Exquisite exotic floral mandaps, fragrant tuberose canopies, imported orchid arches and floral chandeliers.',
    price: 350000, orders: 20, aov: 380000,
    tags: ['Floral Mandaps', 'Exotic Orchids', 'Grand Entryways'],
    dates: { '2026-12-15': 'Available', '2026-12-20': 'Available' }
  },
  {
    name: 'Royal Heritage Decor & Mandap Designers',
    areas: ['Andheri', 'Goregaon', 'Borivali', 'Malad'],
    desc: 'Palatial palace-themed wedding sets, traditional carved wooden mandaps, velvet drapes, and brass temple props.',
    price: 450000, orders: 17, aov: 520000,
    tags: ['Palace Themed', 'Brass Props', 'Velvet Drapes'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available' }
  },
  {
    name: 'Mayur Eco-Floral & Modern Installations',
    areas: ['Powai', 'Chembur', 'Ghatkopar'],
    desc: 'Sustainable eco-conscious floral styling using seasonal marigolds, bamboo structures, and biodegradable elements.',
    price: 220000, orders: 14, aov: 240000,
    tags: ['Eco-Friendly', 'Marigold Styling', 'Minimalist Elegance'],
    dates: { '2026-12-15': 'Available', '2026-12-25': 'Tentative' }
  },
  {
    name: 'Dreamscape Luxury Wedding Decor',
    areas: ['Lower Parel', 'Bandra', 'Dadar'],
    desc: 'Ultra-luxury contemporary wedding decor featuring crystal chandeliers, mirrored ramps, and pastel flower walls.',
    price: 600000, orders: 11, aov: 680000,
    tags: ['Ultra Luxury', 'Mirrored Aisles', 'Pastel Florals'],
    dates: { '2026-12-15': 'Available', '2026-12-19': 'Fully Booked' }
  },
  {
    name: 'Utsav Mandap & Canopy Decorators',
    areas: ['Thane', 'Mulund', 'Ghatkopar', 'Navi Mumbai'],
    desc: 'Vibrant sangeet stage decor, traditional canopy setups, colorful photobooth zones and entrance gates.',
    price: 180000, orders: 24, aov: 210000,
    tags: ['Sangeet Stages', 'Canopy Setups', 'Photobooths'],
    dates: { '2026-12-15': 'Available', '2026-12-16': 'Available' }
  },
  {
    name: 'Celestial Bloom Studios',
    areas: ['Bandra', 'Andheri', 'Powai'],
    desc: 'Modern botanical design studio focusing on bohemian pampas grass installations and romantic fairy light mandaps.',
    price: 280000, orders: 0, aov: 0, isNew: true,
    tags: ['Boho Chic', 'Pampas Grass', 'Botanical Installations'],
    dates: { '2026-12-15': 'Available', '2026-12-21': 'Available' }
  },

  // 3. Lighting Services (4)
  {
    name: 'Lumina Grand Architectural Lighting',
    areas: ['Bandra', 'Lower Parel', 'Dadar', 'Andheri'],
    desc: 'Intelligent beam moving heads, venue facade architectural projection mapping, and computerized sangeet light shows.',
    price: 150000, orders: 18, aov: 195000,
    tags: ['Projection Mapping', 'Moving Heads', 'Facade Uplighting'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available' }
  },
  {
    name: 'Golden Glow Fairy Lights & Ambience',
    areas: ['Powai', 'Goregaon', 'Malad', 'Borivali'],
    desc: 'Warm fairy light tunnels, vintage Edison bulbs, starry night ceilings, and romantic ambient garden illumination.',
    price: 90000, orders: 21, aov: 115000,
    tags: ['Fairy Lights', 'Edison Bulbs', 'Warm Ambience'],
    dates: { '2026-12-15': 'Available', '2026-12-17': 'Available' }
  },
  {
    name: 'Illuminati Wedding Beam & Truss Production',
    areas: ['Thane', 'Navi Mumbai', 'Chembur', 'Mulund'],
    desc: 'Heavy-duty concert aluminum trussing, follow spots, haze/cold pyro FX, and programmable stage LED matrices.',
    price: 180000, orders: 13, aov: 210000,
    tags: ['Aluminum Trusses', 'Stage Lighting', 'Cold Pyro FX'],
    dates: { '2026-12-15': 'Available', '2026-12-22': 'Available' }
  },
  {
    name: 'Radiance Luxe Event Illumination',
    areas: ['Lower Parel', 'Bandra', 'Dadar'],
    desc: 'High-end battery wireless uplighting, pin spots for dining tables, and bespoke crystal chandelier rigging.',
    price: 210000, orders: 8, aov: 245000,
    tags: ['Wireless Uplighting', 'Pinspots', 'Chandelier Rigging'],
    dates: { '2026-12-15': 'Available', '2026-12-23': 'Available' }
  },

  // 4. DJ and Sound Systems (4)
  {
    name: 'DJ Romy & Sonic Beats Sound Production',
    areas: ['Bandra', 'Andheri', 'Lower Parel', 'Powai'],
    desc: 'Celebrity wedding DJ, Line Array sound systems (JBL VTX / L-Acoustics), club-grade subwoofers and live dhol ensemble.',
    price: 120000, orders: 27, aov: 165000,
    tags: ['Celebrity DJ', 'Line Array JBL', 'Live Punjabi Dhol', 'Sangeet Party'],
    dates: { '2026-12-15': 'Available', '2026-12-16': 'Available' }
  },
  {
    name: 'Acoustic Waves Professional Audio',
    areas: ['Dadar', 'Chembur', 'Ghatkopar', 'Thane'],
    desc: 'Crystal-clear acoustic setups for shehnai, classical phera ceremonies, sangeet bands, and digital wireless mic systems.',
    price: 75000, orders: 20, aov: 95000,
    tags: ['Phera Ceremony Audio', 'Digital Mics', 'Live Band Setup'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available' }
  },
  {
    name: 'Electra Groove DJ & Laser Symphony',
    areas: ['Goregaon', 'Malad', 'Borivali', 'Andheri'],
    desc: 'High-energy Bollywood & Punjabi DJ sets, synchronised laser shows, cold spark machines, and LED dancefloors.',
    price: 140000, orders: 16, aov: 180000,
    tags: ['LED Dancefloor', 'Cold Sparks', 'Synchronized Lasers'],
    dates: { '2026-12-15': 'Available', '2026-12-20': 'Available' }
  },
  {
    name: 'Resonance Sound & Backline Gear',
    areas: ['Navi Mumbai', 'Thane', 'Mulund'],
    desc: 'Full backline live sound engineering for celebrity singers, musical pheras, and energetic baraat sound trucks.',
    price: 110000, orders: 12, aov: 140000,
    tags: ['Baraat Sound Truck', 'Musical Pheras', 'Live Sound Engineers'],
    dates: { '2026-12-15': 'Available', '2026-12-19': 'Tentative' }
  },

  // 5. Furniture and Equipment Rental (4)
  {
    name: 'Royal Seating & Banquet Furniture Rentals',
    areas: ['Bandra', 'Lower Parel', 'Andheri', 'Dadar'],
    desc: 'Chiavari gold chairs, velvet Maharaja sofas, dining banquet round tables, luxury linens, and VIP lounge setups.',
    price: 95000, orders: 22, aov: 130000,
    tags: ['Gold Chiavari Chairs', 'Maharaja Thrones', 'VIP Velvet Lounges'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available' }
  },
  {
    name: 'Elite Tentage, German Pagodas & Staging',
    areas: ['Powai', 'Goregaon', 'Malad', 'Borivali'],
    desc: 'Waterproof German hangar pagodas, air-conditioned dining marquees, heavy duty multi-level stage risers.',
    price: 250000, orders: 14, aov: 320000,
    tags: ['German Hangars', 'AC Pagodas', 'Staging Risers'],
    dates: { '2026-12-15': 'Available', '2026-12-21': 'Available' }
  },
  {
    name: 'Vintage Touch Wooden Prop & Lounge Rentals',
    areas: ['Dadar', 'Chembur', 'Ghatkopar', 'Mulund'],
    desc: 'Rustic wooden cabanas, vintage brass trunks, antique diwans, cocktail bar counters, and boho wicker swings.',
    price: 80000, orders: 17, aov: 105000,
    tags: ['Rustic Wooden Cabanas', 'Bar Counters', 'Boho Swings'],
    dates: { '2026-12-15': 'Available', '2026-12-17': 'Available' }
  },
  {
    name: 'ProGear Event Climate & Generator Rentals',
    areas: ['Thane', 'Navi Mumbai', 'Powai'],
    desc: 'Heavy silent diesel generators (125 kVA+), tower air conditioners, outdoor misting fans, and commercial cable trays.',
    price: 70000, orders: 25, aov: 85000,
    tags: ['Silent Generators', 'Tower ACs', 'Outdoor Misting Fans'],
    dates: { '2026-12-15': 'Available', '2026-12-24': 'Available' }
  },

  // 6. Wedding Lawns and Venues (5)
  {
    name: 'Grand Sea Princess Lawns & Banquet',
    areas: ['Bandra', 'Andheri', 'Dadar'],
    desc: 'Iconic open-air oceanfront wedding lawn with palm tree canopy, air-conditioned bride suites, and valet parking for 300 cars.',
    cap: 1200, price: 550000, orders: 16, aov: 620000,
    tags: ['Sea-Facing', 'Open Lawn', 'Valet Parking', 'Bridal Suites'],
    dates: { '2026-12-15': 'Available', '2026-12-25': 'Fully Booked' }
  },
  {
    name: 'The Emerald Greens Wedding Pavilion',
    areas: ['Powai', 'Goregaon', 'Malad'],
    desc: 'Sprawling 45,000 sq ft manicured royal lawn nestled near Powai lake with attached banquet hall and grand amphitheatre mandap.',
    cap: 1000, price: 420000, orders: 19, aov: 490000,
    tags: ['Manicured Lawn', 'Attached Banquet', 'Lake View'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available' }
  },
  {
    name: 'Mayfair Grand Ballroom & Lawns',
    areas: ['Lower Parel', 'Dadar', 'Bandra'],
    desc: 'Ultra-luxurious pillarless high-ceiling ballroom in South-Central Mumbai equipped with pre-function lawn and crystal chandeliers.',
    cap: 750, price: 650000, orders: 13, aov: 720000,
    tags: ['Pillarless Ballroom', 'South Mumbai Luxury', 'Pre-function Lawn'],
    dates: { '2026-12-15': 'Available', '2026-12-19': 'Available' }
  },
  {
    name: 'Palm Meadows Country Club & Lawns',
    areas: ['Thane', 'Mulund', 'Ghatkopar'],
    desc: 'Serene clubhouse lawns with swimming pool deck for cocktail sangeets and lush green wedding grounds.',
    cap: 850, price: 320000, orders: 21, aov: 360000,
    tags: ['Clubhouse Lawn', 'Pool Deck', 'Ample Parking'],
    dates: { '2026-12-15': 'Available', '2026-12-16': 'Available' }
  },
  {
    name: 'Royal Palms Forest Banquets & Arena',
    areas: ['Goregaon', 'Malad', 'Borivali'],
    desc: 'Nestled beside lush greenery, offering expansive wedding ground capacity with dedicated dining courtyard.',
    cap: 700, price: 380000, orders: 0, aov: 0, isNew: true,
    tags: ['Green Surroundings', 'Large Capacity', 'Dining Courtyard'],
    dates: { '2026-12-15': 'Available', '2026-12-22': 'Available' }
  },

  // 7. Hotels, Lodging and Guest Accommodation (4)
  {
    name: 'The Grand Marine Pavilion & Suites',
    areas: ['Bandra', 'Lower Parel', 'Dadar'],
    desc: '5-star luxury boutique hotel offering 120 dedicated guest rooms, sea-facing hospitality suites, and 24/7 wedding concierge.',
    cap: 450, price: 9500, orders: 18, aov: 580000,
    tags: ['5-Star Luxury', 'Guest Room Blocks', 'Wedding Concierge'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available' }
  },
  {
    name: 'Regal Palms Luxury Suites & Banquets',
    areas: ['Powai', 'Andheri'],
    desc: 'Premium business-class hotel with 90 spacious rooms, attached pre-wedding halls, airport shuttles, and breakfast buffets.',
    cap: 350, price: 7200, orders: 22, aov: 410000,
    tags: ['Airport Shuttles', 'Buffet Breakfast Included', 'Spacious Rooms'],
    dates: { '2026-12-15': 'Available', '2026-12-16': 'Available' }
  },
  {
    name: 'Horizon Bay Boutique Residency',
    areas: ['Andheri', 'Malad', 'Goregaon', 'Borivali'],
    desc: 'Comfortable wedding guest residency with 60 family suites, private elevators, and central location for Western suburbs.',
    cap: 250, price: 5500, orders: 15, aov: 290000,
    tags: ['Family Suites', 'Western Suburbs Central', 'Private Elevators'],
    dates: { '2026-12-15': 'Available', '2026-12-21': 'Available' }
  },
  {
    name: 'Thane Creekview Hotel & Guest Lodge',
    areas: ['Thane', 'Mulund', 'Navi Mumbai', 'Chembur'],
    desc: 'Modern hotel with 80 well-appointed rooms, banquet facilities, and seamless highway access for out-of-town wedding guests.',
    cap: 300, price: 4800, orders: 19, aov: 260000,
    tags: ['Highway Accessibility', 'Modern Amenities', 'Banquet Attached'],
    dates: { '2026-12-15': 'Available', '2026-12-20': 'Available' }
  },

  // 8. Photography and Videography (4)
  {
    name: 'Candid Moments & Cinematic Films',
    areas: ['Bandra', 'Lower Parel', 'Powai', 'Andheri'],
    desc: 'Award-winning wedding photography collective specializing in editorial portraits, drone cinematography, and 4K teasers.',
    price: 220000, orders: 25, aov: 285000,
    tags: ['Editorial Portraits', 'Drone Cinematography', 'Same Day Edit'],
    dates: { '2026-12-15': 'Available', '2026-12-17': 'Available' }
  },
  {
    name: 'The Wedding Chronicle Studios',
    areas: ['Dadar', 'Chembur', 'Ghatkopar', 'Thane'],
    desc: 'Timeless traditional wedding coverage, authentic candid storytelling, leather-bound Italian albums, and live YouTube streaming.',
    price: 150000, orders: 28, aov: 190000,
    tags: ['Traditional Photography', 'Leather Albums', 'Live YouTube Stream'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available' }
  },
  {
    name: 'Vivid Frames Luxury Wedding Reels',
    areas: ['Goregaon', 'Malad', 'Borivali', 'Andheri'],
    desc: 'Next-gen wedding filmmakers creating high-fashion Instagram reels, couple pre-wedding films, and documentary style memories.',
    price: 175000, orders: 19, aov: 220000,
    tags: ['Fashion Reels', 'Pre-Wedding Film', 'Documentary'],
    dates: { '2026-12-15': 'Available', '2026-12-19': 'Available' }
  },
  {
    name: 'Lumiere Bridal Photography',
    areas: ['Bandra', 'Powai', 'Lower Parel'],
    desc: 'Bespoke bridal portraits, emotional candid captures, fine-art black & white wedding albums, and intimate family moments.',
    price: 190000, orders: 0, aov: 0, isNew: true,
    tags: ['Fine Art', 'Bridal Portraits', 'Emotional Candids'],
    dates: { '2026-12-15': 'Available', '2026-12-22': 'Available' }
  },

  // 9. Event Organizers / Wedding Planners (5)
  {
    name: 'Symphony Signature Weddings',
    areas: ['Bandra', 'Lower Parel', 'Powai', 'Andheri'],
    desc: 'Premier luxury wedding planning agency managing design, vendor coordination, RSVP management, and flawless day-of execution.',
    cap: 1500, price: 350000, orders: 21, aov: 480000,
    secondary: ['Decoration and Flower Arrangements', 'Lighting Services'],
    tags: ['Full Wedding Planning', 'RSVP Management', 'VIP Hospitality'],
    dates: { '2026-12-15': 'Available', '2026-12-20': 'Available' }
  },
  {
    name: 'Vivah Sutra Wedding & Event Planners',
    areas: ['Dadar', 'Chembur', 'Ghatkopar', 'Thane'],
    desc: 'Specialized in traditional Maharashtrian and North Indian weddings, pandit coordination, rituals timeline, and vendor sync.',
    cap: 1000, price: 220000, orders: 24, aov: 290000,
    secondary: ['Logistics and Transportation', 'Decoration and Flower Arrangements'],
    tags: ['Rituals Specialist', 'Pandit Coordination', 'Timeline Management'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available' }
  },
  {
    name: 'Urban Knots Boutique Event Co.',
    areas: ['Powai', 'Goregaon', 'Malad', 'Bandra'],
    desc: 'Boutique wedding planners focusing on personalized contemporary themes, cocktail soirees, budget tracking, and vendor negotiation.',
    cap: 800, price: 280000, orders: 16, aov: 340000,
    secondary: ['DJ and Sound Systems', 'Photography and Videography'],
    tags: ['Budget Optimization', 'Cocktail Soirees', 'Vendor Negotiation'],
    dates: { '2026-12-15': 'Available', '2026-12-17': 'Available' }
  },
  {
    name: 'Grandeur Celebration Planners',
    areas: ['Thane', 'Navi Mumbai', 'Mulund'],
    desc: 'Experienced planners for large-scale multi-day community weddings with 1,000+ guests, crowd control, and stage execution.',
    cap: 2000, price: 300000, orders: 18, aov: 390000,
    secondary: ['Catering and Food Services', 'Wedding Lawns and Venues'],
    tags: ['Large Scale Weddings', 'Crowd Management', 'Multi-day Coordination'],
    dates: { '2026-12-15': 'Available', '2026-12-23': 'Available' }
  },
  {
    name: 'Elysian Wedding Concepts',
    areas: ['Bandra', 'Lower Parel', 'Andheri'],
    desc: 'Modern luxury wedding designers bringing fresh aesthetic visions, artist management, and bespoke guest experience curation.',
    cap: 700, price: 320000, orders: 0, aov: 0, isNew: true,
    secondary: ['Decoration and Flower Arrangements'],
    tags: ['Artist Management', 'Aesthetic Curation', 'Guest Experience'],
    dates: { '2026-12-15': 'Available', '2026-12-21': 'Available' }
  },

  // 10. End-to-End Event Management Providers (3)
  {
    name: 'Aura Royale End-to-End Event Management',
    areas: ['Bandra', 'Lower Parel', 'Andheri', 'Powai', 'Dadar'],
    desc: 'Turnkey wedding production delivering complete venue management, royal catering, magnificent decor, concert audio/lighting, and guest logistics.',
    cap: 2000, price: 1200000, orders: 15, aov: 1850000,
    secondary: [
      'Catering and Food Services',
      'Decoration and Flower Arrangements',
      'Lighting Services',
      'DJ and Sound Systems',
      'Wedding Lawns and Venues',
      'Hotels, Lodging and Guest Accommodation',
      'Logistics and Transportation'
    ],
    tags: ['End-to-End Event Management', 'Complete Turnkey', 'Master Vendor Coordination', 'Full Production'],
    dates: { '2026-12-15': 'Available', '2026-12-19': 'Available' }
  },
  {
    name: 'Vows & Beyond Full-Service Wedding Productions',
    areas: ['Powai', 'Goregaon', 'Malad', 'Borivali', 'Thane'],
    desc: 'Comprehensive all-inclusive wedding management from roka to reception, coordinating catering, decor, sound, photography, and luxury transport.',
    cap: 1200, price: 950000, orders: 19, aov: 1420000,
    secondary: [
      'Catering and Food Services',
      'Decoration and Flower Arrangements',
      'Photography and Videography',
      'Lighting Services',
      'DJ and Sound Systems'
    ],
    tags: ['End-to-End Event Management', 'All-Inclusive Packages', 'Stress-Free Planning'],
    dates: { '2026-12-15': 'Available', '2026-12-17': 'Available' }
  },
  {
    name: 'Sublime Heritage End-to-End Weddings',
    areas: ['Dadar', 'Chembur', 'Navi Mumbai', 'Thane', 'Ghatkopar'],
    desc: 'Turnkey traditional and fusion wedding masters coordinating authentic banquets, grand mandap decor, guest lodging, and fleet transport.',
    cap: 1000, price: 850000, orders: 12, aov: 1250000,
    secondary: [
      'Catering and Food Services',
      'Decoration and Flower Arrangements',
      'Hotels, Lodging and Guest Accommodation',
      'Logistics and Transportation'
    ],
    tags: ['End-to-End Event Management', 'Heritage Turnkey', 'Hospitality & Logistics'],
    dates: { '2026-12-15': 'Available', '2026-12-22': 'Available' }
  },

  // 11. Logistics and Transportation (2)
  {
    name: 'Royal Chariots Luxury Wedding Fleets',
    areas: ['Bandra', 'Lower Parel', 'Andheri', 'Powai', 'Dadar'],
    desc: 'Vintage luxury bridal cars (Rolls Royce, Mercedes S-Class, open vintage convertibles), baraat buggies, and decorated groom rides.',
    price: 65000, orders: 23, aov: 95000,
    tags: ['Vintage Convertibles', 'Mercedes S-Class', 'Baraat Buggy'],
    dates: { '2026-12-15': 'Available', '2026-12-16': 'Available' }
  },
  {
    name: 'CityLink Guest Coaches & Airport Shuttles',
    areas: ['Thane', 'Navi Mumbai', 'Chembur', 'Borivali', 'Goregaon'],
    desc: 'AC Volvo & luxury mini-bus wedding fleets for guest airport pick-ups, inter-venue shuttles, and luggage transport.',
    price: 50000, orders: 31, aov: 75000,
    tags: ['Volvo AC Coaches', 'Airport Transfers', 'Inter-venue Shuttles'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available' }
  },

  // 12. Makeup and Mehendi Artists (2)
  {
    name: 'Glitz & Glamour Bridal Makeovers',
    areas: ['Bandra', 'Lower Parel', 'Andheri', 'Powai'],
    desc: 'Celebrity bridal makeup artist specializing in HD airbrush makeup, hair styling, saree draping, and pre-wedding skin prep.',
    price: 45000, orders: 34, aov: 65000,
    tags: ['HD Airbrush', 'Bridal Draping', 'Celebrity Stylist'],
    dates: { '2026-12-15': 'Available', '2026-12-17': 'Available' }
  },
  {
    name: 'Rangoli Bridal Mehendi Artists',
    areas: ['Dadar', 'Ghatkopar', 'Borivali', 'Thane', 'Mulund'],
    desc: 'Master Rajasthani and Marwari bridal mehendi, portrait henna art, organic dark stain henna paste, and guest mehendi teams.',
    price: 25000, orders: 40, aov: 38000,
    tags: ['Rajasthani Bridal Mehendi', 'Organic Dark Stain', 'Portrait Henna'],
    dates: { '2026-12-15': 'Available', '2026-12-16': 'Available' }
  }
];

// Curated data for Pune (50 vendors)
const puneVendorsData = [
  // 1. Catering and Food Services (7)
  // Preserving original mandatory scenario vendors: Royal Feast & Heritage Rasoi!
  {
    name: 'Royal Feast Catering & Hospitality',
    areas: ['Baner', 'Wakad', 'Aundh', 'Hinjewadi'],
    desc: 'Premium multi-cuisine wedding banquet specialist featuring royal Maharashtrian, Mughlai, and live continental counters.',
    cap: 1200, price: 1200, orders: 18, aov: 380000,
    tags: ['Royal Banquets', 'Multi-Cuisine', 'Live Counters', 'Baner/Wakad'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available', '2026-12-25': 'Tentative' }
  },
  {
    name: 'Heritage Rasoi Caterers',
    areas: ['Wakad', 'Baner', 'Pimpri-Chinchwad', 'Aundh'],
    desc: 'Renowned wedding caterers offering authentic traditional vegetarian spreads, live chaat, and bespoke dessert buffets.',
    cap: 800, price: 950, orders: 14, aov: 290000,
    tags: ['Traditional Veg Spreads', 'Live Chaat', 'Dessert Buffets', 'Wakad/Baner'],
    dates: { '2026-12-15': 'Available', '2026-12-17': 'Available' }
  },
  {
    name: 'Puneri Pangat Heritage Caterers',
    areas: ['Kothrud', 'Shivajinagar', 'Aundh'],
    desc: 'Authentic Peshwai wedding feast with silver thalis, puran poli, ukadiche modak, and traditional pângat dining.',
    cap: 700, price: 850, orders: 25, aov: 240000,
    tags: ['Peshwai Feast', 'Silver Thali', 'Traditional Pangat'],
    dates: { '2026-12-15': 'Unavailable', '2026-12-18': 'Available' } // Unavailable on 15th to maintain exactly 2 matches for Wakad/Baner 500 guests test
  },
  {
    name: 'Koregaon Park Artisanal Banquets',
    areas: ['Koregaon Park', 'Kharadi', 'Viman Nagar'],
    desc: 'High-end fusion gourmet spreads, grazing tables, European bistro wedding brunches, and wood-fired artisanal stations.',
    cap: 600, price: 1650, orders: 16, aov: 410000,
    tags: ['Grazing Tables', 'Bistro Brunches', 'Wood-fired Stations'],
    dates: { '2026-12-15': 'Fully Booked', '2026-12-20': 'Available' }
  },
  {
    name: 'Shree Ganesh Pure Veg Caterers',
    areas: ['Hadapsar', 'Magarpatta', 'Kharadi'],
    desc: 'Flawless pure veg catering for Marwari, Gujarati, and Jain weddings with over 40 live specialties.',
    cap: 1000, price: 900, orders: 21, aov: 280000,
    tags: ['Pure Vegetarian', 'Jain Specialties', 'Live Counters'],
    dates: { '2026-12-15': 'Available', '2026-12-22': 'Available' }
  },
  {
    name: 'Flavours of Maharashtra Catering Co.',
    areas: ['Pimpri-Chinchwad', 'Hinjewadi', 'Wakad'],
    desc: 'Regional Maharashtrian specialties, Kolhapuri live grills, coastal solkadhi counters, and festive sweets.',
    cap: 650, price: 1050, orders: 12, aov: 250000,
    tags: ['Regional Maharashtrian', 'Live Grills', 'Festive Sweets'],
    dates: { '2026-12-15': 'Fully Booked', '2026-12-19': 'Available' }
  },
  {
    name: 'Saffron & Sage Gourmet Caterers',
    areas: ['Baner', 'Aundh', 'Shivajinagar'],
    desc: 'Contemporary farm-to-table organic wedding banquets, artisanal salads, and interactive cocktail bars.',
    cap: 450, price: 1400, orders: 0, aov: 0, isNew: true,
    tags: ['Organic Farm-to-Table', 'Boutique Spreads', 'Artisanal Salads'],
    dates: { '2026-12-15': 'Available', '2026-12-21': 'Available' }
  },

  // 2. Decoration and Flower Arrangements (6)
  // Preserving original mandatory scenario decorator: Elegance Floral & Mandap Decor!
  {
    name: 'Elegance Floral & Mandap Decor',
    areas: ['Baner', 'Wakad', 'Aundh', 'Hinjewadi'],
    desc: 'Sophisticated botanical and traditional mandap design studio specializing in fresh rose canopies and carved mandaps.',
    price: 240000, orders: 16, aov: 280000,
    tags: ['Botanical Mandaps', 'Rose Canopies', 'Baner/Wakad'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available' }
  },
  {
    name: 'Rajwada Palace Mandap Setups',
    areas: ['Kothrud', 'Shivajinagar', 'Koregaon Park'],
    desc: 'Majestic royal fortress-themed setups, velvet drapes, antique brass lamps, and traditional entrance gates.',
    price: 380000, orders: 19, aov: 420000,
    tags: ['Palace Themed', 'Brass Lamps', 'Fortress Gateways'],
    dates: { '2026-12-15': 'Fully Booked', '2026-12-19': 'Available' }
  },
  {
    name: 'Blossom Symphony Event Stylists',
    areas: ['Koregaon Park', 'Viman Nagar', 'Kharadi'],
    desc: 'Pastel dreamscape weddings, cascading orchid chandeliers, mirrored bridal walkways, and fairy light backdrops.',
    price: 320000, orders: 14, aov: 350000,
    tags: ['Pastel Florals', 'Orchid Chandeliers', 'Mirrored Walkways'],
    dates: { '2026-12-15': 'Unavailable', '2026-12-20': 'Available' }
  },
  {
    name: 'Vedic Flora Traditional Decor',
    areas: ['Hadapsar', 'Magarpatta', 'Kothrud'],
    desc: 'Auspicious temple-style wedding decor featuring fresh marigolds, lotus motifs, brass urli setups, and mango leaves.',
    price: 160000, orders: 28, aov: 190000,
    tags: ['Temple Style', 'Marigold Mandap', 'Brass Urli'],
    dates: { '2026-12-15': 'Fully Booked', '2026-12-17': 'Available' }
  },
  {
    name: 'Modern Grace Stage & Floral Studio',
    areas: ['Pimpri-Chinchwad', 'Hinjewadi', 'Wakad'],
    desc: 'Modern geometric floral arches, LED infinity tunnels, sangeet party stage backdrops, and photobooth styling.',
    price: 210000, orders: 15, aov: 230000,
    tags: ['Geometric Arches', 'LED Infinity Tunnels', 'Sangeet Stages'],
    dates: { '2026-12-15': 'Unavailable', '2026-12-21': 'Available' }
  },
  {
    name: 'Aura Blossoms & Styling',
    areas: ['Baner', 'Aundh', 'Shivajinagar'],
    desc: 'Eco-chic botanical styling with potted plants, dry florals, and sustainable hanging installations.',
    price: 190000, orders: 0, aov: 0, isNew: true,
    tags: ['Eco Chic', 'Potted Plants', 'Dry Florals'],
    dates: { '2026-12-15': 'Available', '2026-12-23': 'Available' }
  },

  // 3. Lighting Services (4)
  {
    name: 'GlowCraft Pune Architectural Lighting',
    areas: ['Baner', 'Wakad', 'Aundh', 'Kothrud'],
    desc: 'Computerized intelligent beam lighting, ambient lawn uplighting, fairy light canopies, and programmed sangeet stages.',
    price: 110000, orders: 22, aov: 145000,
    tags: ['Architectural Uplighting', 'Intelligent Beams', 'Fairy Light Canopies'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available' }
  },
  {
    name: 'Sparkle Night Wedding Illuminations',
    areas: ['Koregaon Park', 'Viman Nagar', 'Kharadi', 'Shivajinagar'],
    desc: 'Warm ambient Edison bulb grids, crystal chandelier tree rigging, and romantic garden wash lights.',
    price: 130000, orders: 17, aov: 160000,
    tags: ['Edison Bulbs', 'Chandelier Rigging', 'Garden Wash Lights'],
    dates: { '2026-12-15': 'Available', '2026-12-20': 'Available' }
  },
  {
    name: 'LazerPulse Stage & Sangeet Lighting',
    areas: ['Hinjewadi', 'Pimpri-Chinchwad', 'Wakad'],
    desc: 'Heavy stage lighting, moving head trusses, low-fog dry ice clouds, and cold sparkulars for grand couple entries.',
    price: 160000, orders: 15, aov: 190000,
    tags: ['Cold Sparks', 'Dry Ice Fog', 'Moving Head Trusses'],
    dates: { '2026-12-15': 'Available', '2026-12-19': 'Available' }
  },
  {
    name: 'Surya Kiran Heritage Lighting',
    areas: ['Hadapsar', 'Magarpatta', 'Kothrud'],
    desc: 'Traditional oil lamp torches, amber floodlights, and festive series lighting for palace and lawn weddings.',
    price: 85000, orders: 20, aov: 105000,
    tags: ['Amber Floods', 'Traditional Torches', 'Series Lighting'],
    dates: { '2026-12-15': 'Available', '2026-12-17': 'Available' }
  },

  // 4. DJ and Sound Systems (4)
  {
    name: 'DJ Tejas & Pulsar Audio Systems',
    areas: ['Baner', 'Wakad', 'Aundh', 'Hinjewadi'],
    desc: 'Top Pune wedding DJ, concert JBL Line Array setups, earth-shaking subwoofers, and energizing Punjabi/Bollywood music.',
    price: 95000, orders: 28, aov: 135000,
    tags: ['Wedding DJ', 'JBL Line Array', 'Baraat Sounds', 'Sangeet Specialist'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available' }
  },
  {
    name: 'SoundVibe Live Acoustic & Stage Audio',
    areas: ['Koregaon Park', 'Viman Nagar', 'Kharadi'],
    desc: 'Pristine sound engineering for musical pheras, live Sufi bands, sangeet performances, and cordless mic setups.',
    price: 80000, orders: 21, aov: 110000,
    tags: ['Live Sound Engineering', 'Musical Pheras', 'Sufi Band Audio'],
    dates: { '2026-12-15': 'Available', '2026-12-16': 'Available' }
  },
  {
    name: 'Bassline DJ & LED Visual Walls',
    areas: ['Kothrud', 'Shivajinagar', 'Pimpri-Chinchwad'],
    desc: 'DJ booth with synchronized P3 LED video backdrops, club laser light shows, and high energy interactive emcees.',
    price: 125000, orders: 18, aov: 155000,
    tags: ['LED Video Walls', 'Laser Show', 'Interactive Emcee'],
    dates: { '2026-12-15': 'Available', '2026-12-22': 'Available' }
  },
  {
    name: 'Dhol Tasha & Traditional Rhythm Ensemble',
    areas: ['Hadapsar', 'Magarpatta', 'Wakad', 'Baner'],
    desc: 'Authentic 21-member Puneri Dhol Tasha pathak, brass band, and shehnai players for grand traditional baraats.',
    price: 65000, orders: 30, aov: 80000,
    tags: ['Puneri Dhol Tasha', 'Grand Baraat', 'Live Shehnai'],
    dates: { '2026-12-15': 'Available', '2026-12-17': 'Available' }
  },

  // 5. Furniture and Equipment Rental (4)
  {
    name: 'Pune Royal Tent & Furniture Rentals',
    areas: ['Baner', 'Wakad', 'Hinjewadi', 'Aundh'],
    desc: 'Golden Tiffany/Chiavari chairs, cushioned sofa sets, buffet banquet tables, and pristine white dining linens.',
    price: 85000, orders: 24, aov: 115000,
    tags: ['Chiavari Chairs', 'Cushioned Sofas', 'Buffet Tables'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available' }
  },
  {
    name: 'Marquee Kraft German Hangars & AC Tents',
    areas: ['Kothrud', 'Shivajinagar', 'Koregaon Park'],
    desc: 'All-weather German dome hangars, transparent glass roof marquees, and heavy industrial tower air conditioning.',
    price: 280000, orders: 13, aov: 340000,
    tags: ['German Hangars', 'Glass Roof Marquees', 'Tower Air Conditioning'],
    dates: { '2026-12-15': 'Available', '2026-12-20': 'Available' }
  },
  {
    name: 'Classic Props & Wooden Cabanas',
    areas: ['Viman Nagar', 'Kharadi', 'Hadapsar', 'Magarpatta'],
    desc: 'Bohemian wooden pergolas, antique swings, ornate photo backdrops, and comfortable low-seating diwan setups.',
    price: 75000, orders: 18, aov: 95000,
    tags: ['Boho Pergolas', 'Antique Swings', 'Low Seating Diwans'],
    dates: { '2026-12-15': 'Available', '2026-12-16': 'Available' }
  },
  {
    name: 'PowerGrid Genset & Climate Support',
    areas: ['Pimpri-Chinchwad', 'Wakad', 'Baner', 'Hinjewadi'],
    desc: 'Eco-friendly silent generator backup (82.5 kVA to 200 kVA), outdoor mist fans, and distribution power panels.',
    price: 60000, orders: 29, aov: 75000,
    tags: ['Silent Gensets', 'Outdoor Misting Fans', 'Power Distribution'],
    dates: { '2026-12-15': 'Available', '2026-12-19': 'Available' }
  },

  // 6. Wedding Lawns and Venues (5)
  // Capable of hosting 600+ guests for Test C: "I need a lawn for 600 guests in Pune"
  {
    name: 'Emerald Meadows Wedding Lawn & Banquets',
    areas: ['Baner', 'Wakad', 'Aundh'],
    desc: 'Spacious 35,000 sq ft verdant lawn surrounded by hills, featuring attached air-conditioned banquet hall and bridal dressing suites.',
    cap: 1000, price: 380000, orders: 20, aov: 440000,
    tags: ['Lawn for 1000 Guests', 'Hillside Backdrop', 'Bridal Dressing Suites'],
    dates: { '2026-12-15': 'Available', '2026-12-20': 'Available' }
  },
  {
    name: 'Oasis Palm Royal Lawns & Resorts',
    areas: ['Hinjewadi', 'Wakad', 'Pimpri-Chinchwad'],
    desc: 'Resort-style open wedding lawn with palm-fringed swimming pool, poolside sangeet arena, and capacity up to 800 guests.',
    cap: 800, price: 340000, orders: 18, aov: 390000,
    tags: ['Lawn for 800 Guests', 'Poolside Sangeet', 'Resort Lawns'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available' }
  },
  {
    name: 'Mayur Hillcrest Grand Lawns',
    areas: ['Kothrud', 'Shivajinagar', 'Aundh'],
    desc: 'Lush green hill-view lawn capable of hosting grand wedding ceremonies for 700 guests with ample valet parking.',
    cap: 700, price: 310000, orders: 16, aov: 360000,
    tags: ['Lawn for 700 Guests', 'Hill View', 'Valet Parking'],
    dates: { '2026-12-15': 'Available', '2026-12-17': 'Available' }
  },
  {
    name: 'Heritage Greens Country Lawn',
    areas: ['Hadapsar', 'Magarpatta', 'Kharadi'],
    desc: 'Scenic open-air lawn surrounded by royal palms, grand stone mandap plinth, and seating capacity for 650 guests.',
    cap: 650, price: 290000, orders: 22, aov: 330000,
    tags: ['Lawn for 650 Guests', 'Stone Mandap Plinth', 'Open Air'],
    dates: { '2026-12-15': 'Available', '2026-12-24': 'Available' }
  },
  {
    name: 'The Orchid Regency Lawns',
    areas: ['Koregaon Park', 'Viman Nagar'],
    desc: 'Intimate boutique garden lawn for 350 guests ideal for sangeet nights, mehendi brunches, and cocktail receptions.',
    cap: 350, price: 220000, orders: 0, aov: 0, isNew: true,
    tags: ['Intimate Lawn', 'Boutique Garden', 'Sangeet Venue'],
    dates: { '2026-12-15': 'Available', '2026-12-21': 'Available' }
  },

  // 7. Hotels, Lodging and Guest Accommodation (4)
  {
    name: 'The Koregaon Luxury Pavilion & Suites',
    areas: ['Koregaon Park', 'Kharadi', 'Viman Nagar'],
    desc: '5-star boutique hospitality featuring 85 rooms, bridal hospitality suites, airport proximity, and all-day dining for guests.',
    cap: 320, price: 8500, orders: 17, aov: 520000,
    tags: ['5-Star Luxury', 'Airport Proximity', 'Bridal Suites'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available' }
  },
  {
    name: 'Pride Gateway Hotel & Banquets',
    areas: ['Shivajinagar', 'Kothrud', 'Aundh'],
    desc: 'Centrally located premium hotel with 75 rooms, complimentary wedding guest breakfast, and convenient railway station connectivity.',
    cap: 280, price: 6200, orders: 23, aov: 380000,
    tags: ['Central Location', 'Breakfast Included', 'Railway Connectivity'],
    dates: { '2026-12-15': 'Available', '2026-12-16': 'Available' }
  },
  {
    name: 'Wakad Express Residency & Guest Rooms',
    areas: ['Wakad', 'Hinjewadi', 'Baner'],
    desc: 'Modern wedding guest hotel along the Mumbai-Pune expressway with 60 clean, spacious rooms and ample family suites.',
    cap: 240, price: 4800, orders: 19, aov: 270000,
    tags: ['Expressway Access', 'Family Rooms', 'Wakad Hub'],
    dates: { '2026-12-15': 'Available', '2026-12-19': 'Available' }
  },
  {
    name: 'Magarpatta Comfort Suites',
    areas: ['Magarpatta', 'Hadapsar', 'Kharadi'],
    desc: 'Comfortable guest lodging with 50 serviced apartments, kitchenette options, and close proximity to eastern Pune wedding venues.',
    cap: 200, price: 4200, orders: 14, aov: 230000,
    tags: ['Serviced Apartments', 'Kitchenette', 'Eastern Pune'],
    dates: { '2026-12-15': 'Available', '2026-12-22': 'Available' }
  },

  // 8. Photography and Videography (4)
  {
    name: 'ShutterShree Candid Wedding Films',
    areas: ['Baner', 'Aundh', 'Shivajinagar', 'Kothrud'],
    desc: 'Passionate team of wedding cinematographers capturing candid laughter, emotional vidai rituals, and 4K aerial drone footage.',
    price: 180000, orders: 26, aov: 235000,
    tags: ['Candid Storytelling', 'Drone Cinematography', 'Same-Day Teaser'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available' }
  },
  {
    name: 'Punekar Wedding Tales',
    areas: ['Kothrud', 'Shivajinagar', 'Hadapsar'],
    desc: 'Traditional Marathi wedding photography, heritage portrait sessions in Shaniwar Wada style, and luxury handcrafted photo albums.',
    price: 130000, orders: 32, aov: 165000,
    tags: ['Traditional Photography', 'Handcrafted Albums', 'Peshwai Portraits'],
    dates: { '2026-12-15': 'Available', '2026-12-17': 'Available' }
  },
  {
    name: 'Vogue Knot Cinematic Productions',
    areas: ['Koregaon Park', 'Kharadi', 'Viman Nagar'],
    desc: 'High-fashion editorial wedding coverage, pre-wedding music videos, and dynamic sangeet afterparty reels.',
    price: 210000, orders: 17, aov: 260000,
    tags: ['High Fashion Editorial', 'Music Videos', 'Trending Reels'],
    dates: { '2026-12-15': 'Available', '2026-12-19': 'Available' }
  },
  {
    name: 'Moments Forever Studio',
    areas: ['Wakad', 'Hinjewadi', 'Pimpri-Chinchwad'],
    desc: 'Fresh and energetic photography crew specializing in expressive couple portraits, ceremony candids, and family group portraits.',
    price: 140000, orders: 0, aov: 0, isNew: true,
    tags: ['Expressive Portraits', 'Family Candids', 'Pre-Wedding'],
    dates: { '2026-12-15': 'Available', '2026-12-23': 'Available' }
  },

  // 9. Event Organizers / Wedding Planners (5)
  {
    name: 'Punya Bhumi Wedding & Event Curators',
    areas: ['Baner', 'Aundh', 'Shivajinagar', 'Kothrud'],
    desc: 'Distinguished wedding management firm delivering bespoke celebrations, decor styling, ritual precision, and seamless hospitality.',
    cap: 1200, price: 290000, orders: 23, aov: 410000,
    secondary: ['Decoration and Flower Arrangements', 'Logistics and Transportation'],
    tags: ['Bespoke Celebrations', 'Hospitality Management', 'Ritual Coordination'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available' }
  },
  {
    name: 'Subh Aarambh Event Planners',
    areas: ['Wakad', 'Hinjewadi', 'Pimpri-Chinchwad', 'Baner'],
    desc: 'Experienced planners for cross-cultural weddings, budgeting, vendor shortlisting, timeline orchestration, and on-ground management.',
    cap: 900, price: 220000, orders: 20, aov: 310000,
    secondary: ['DJ and Sound Systems', 'Photography and Videography'],
    tags: ['Cross-Cultural Weddings', 'Budget Tracking', 'Timeline Orchestration'],
    dates: { '2026-12-15': 'Available', '2026-12-16': 'Available' }
  },
  {
    name: 'The Crown Affair Luxury Planners',
    areas: ['Koregaon Park', 'Viman Nagar', 'Kharadi'],
    desc: 'Elite wedding production house specializing in luxury sangeet galas, celebrity artist booking, and high-touch concierge services.',
    cap: 1500, price: 420000, orders: 15, aov: 590000,
    secondary: ['Lighting Services', 'DJ and Sound Systems'],
    tags: ['Luxury Galas', 'Celebrity Artists', 'VIP Concierge'],
    dates: { '2026-12-15': 'Available', '2026-12-20': 'Available' }
  },
  {
    name: 'Festiva Event Management & Planning',
    areas: ['Hadapsar', 'Magarpatta', 'Kothrud'],
    desc: 'Friendly, detail-oriented wedding planners taking the stress away from families with hands-on vendor coordination and ceremony schedules.',
    cap: 800, price: 180000, orders: 25, aov: 250000,
    secondary: ['Catering and Food Services', 'Decoration and Flower Arrangements'],
    tags: ['Stress-Free Planning', 'Hands-on Coordination', 'Ceremony Schedules'],
    dates: { '2026-12-15': 'Available', '2026-12-17': 'Available' }
  },
  {
    name: 'Aarohan Wedding Studio',
    areas: ['Baner', 'Wakad', 'Aundh'],
    desc: 'Modern wedding planning studio curating sustainable decor, curated food menus, and boutique personalized touches.',
    cap: 600, price: 250000, orders: 0, aov: 0, isNew: true,
    secondary: ['Decoration and Flower Arrangements'],
    tags: ['Sustainable Planning', 'Curated Menus', 'Boutique Touches'],
    dates: { '2026-12-15': 'Available', '2026-12-21': 'Available' }
  },

  // 10. End-to-End Event Management Providers (3)
  {
    name: 'Imperial Knots End-to-End Wedding Management',
    areas: ['Baner', 'Wakad', 'Kothrud', 'Aundh', 'Shivajinagar'],
    desc: 'Comprehensive turnkey event management orchestrating venue booking, royal catering, magnificent stage and mandap decor, DJ/sound, and guest lodging.',
    cap: 1800, price: 1100000, orders: 18, aov: 1650000,
    secondary: [
      'Catering and Food Services',
      'Decoration and Flower Arrangements',
      'Lighting Services',
      'DJ and Sound Systems',
      'Wedding Lawns and Venues',
      'Hotels, Lodging and Guest Accommodation',
      'Logistics and Transportation'
    ],
    tags: ['End-to-End Event Management', 'Full Turnkey Production', 'Master Vendor Coordination'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available' }
  },
  {
    name: 'Pune Grand Heritage End-to-End Productions',
    areas: ['Koregaon Park', 'Kharadi', 'Viman Nagar', 'Hadapsar', 'Magarpatta'],
    desc: 'End-to-end luxury wedding management coordinating all catering, floral sets, cinematography, sound, accommodation, and fleet logistics.',
    cap: 1200, price: 900000, orders: 16, aov: 1350000,
    secondary: [
      'Catering and Food Services',
      'Decoration and Flower Arrangements',
      'Photography and Videography',
      'Lighting Services',
      'DJ and Sound Systems'
    ],
    tags: ['End-to-End Event Management', 'All-Inclusive Packages', 'Complete Wedding Journey'],
    dates: { '2026-12-15': 'Available', '2026-12-19': 'Available' }
  },
  {
    name: 'Sankalp Complete Event Management',
    areas: ['Pimpri-Chinchwad', 'Wakad', 'Hinjewadi', 'Baner'],
    desc: 'Turnkey wedding execution specializing in seamless vendor synchronization, stage production, feast catering, and guest transit.',
    cap: 1000, price: 800000, orders: 14, aov: 1180000,
    secondary: [
      'Catering and Food Services',
      'Decoration and Flower Arrangements',
      'Hotels, Lodging and Guest Accommodation',
      'Logistics and Transportation'
    ],
    tags: ['End-to-End Event Management', 'Seamless Sync', 'Turnkey Execution'],
    dates: { '2026-12-15': 'Available', '2026-12-17': 'Available' }
  },

  // 11. Logistics and Transportation (2)
  {
    name: 'Swarajya Luxury Wedding Cars & Fleets',
    areas: ['Baner', 'Wakad', 'Kothrud', 'Aundh', 'Shivajinagar'],
    desc: 'Decorated luxury bridal sedans, open vintage cars for baraat entries, and Mercedes/BMW rentals with professional chauffeurs.',
    price: 55000, orders: 27, aov: 80000,
    tags: ['Vintage Cars', 'Decorated Bridal Sedans', 'Uniformed Chauffeurs'],
    dates: { '2026-12-15': 'Available', '2026-12-18': 'Available' }
  },
  {
    name: 'Pune Shuttles & Coach Rentals',
    areas: ['Hinjewadi', 'Pimpri-Chinchwad', 'Hadapsar', 'Viman Nagar', 'Kharadi'],
    desc: 'AC mini-buses, tempo travellers, and Volvo luxury coaches for wedding guest airport transfers and inter-city commutes.',
    price: 45000, orders: 35, aov: 68000,
    tags: ['AC Luxury Coaches', 'Airport Transfers', 'Guest Shuttles'],
    dates: { '2026-12-15': 'Available', '2026-12-16': 'Available' }
  },

  // 12. Makeup and Mehendi Artists (2)
  {
    name: 'Roopshree Bridal Makeovers & Hair Studio',
    areas: ['Baner', 'Aundh', 'Shivajinagar', 'Koregaon Park'],
    desc: 'Renowned bridal makeup artist specializing in HD bridal makeovers, airbrush finish, traditional nauvari saree draping, and hair artistry.',
    price: 38000, orders: 38, aov: 55000,
    tags: ['Nauvari Saree Draping', 'HD Airbrush Makeup', 'Bridal Artistry'],
    dates: { '2026-12-15': 'Available', '2026-12-17': 'Available' }
  },
  {
    name: 'Kashish Mehndi Artistry',
    areas: ['Kothrud', 'Wakad', 'Pimpri-Chinchwad', 'Hadapsar'],
    desc: 'Intricate bridal henna, Arabic and portrait mehendi designs, chemical-free organic henna cone preparation, and guest mehendi teams.',
    price: 22000, orders: 42, aov: 32000,
    tags: ['Bridal Henna', 'Organic Cones', 'Portrait Mehendi'],
    dates: { '2026-12-15': 'Available', '2026-12-16': 'Available' }
  }
];

// Helper to assemble full vendor objects
function buildVendors(city, dataList, prefix) {
  let globalIdx = 0;
  const result = [];

  categorySpecs.forEach(spec => {
    for (let i = 0; i < spec.count; i++) {
      const item = dataList[globalIdx];
      if (!item) {
        throw new Error(`Missing vendor data for ${city} - ${spec.category} index ${i}`);
      }

      const id = `${prefix}-${spec.short}-${String(i + 1).padStart(2, '0')}`;
      const vendorObj = {
        id,
        businessName: item.name,
        primaryCity: city,
        serviceableAreas: item.areas,
        category: spec.category,
        secondaryCategories: item.secondary || [],
        description: item.desc,
        maximumGuestCapacity: item.cap || (spec.hasCapacity ? 500 : undefined),
        maximumSimultaneousBookings: 2,
        startingPrice: item.price,
        priceUnit: spec.defaultUnit,
        quotationRequired: !item.price || item.price > 500000,
        availabilityDates: item.dates || { '2026-12-15': 'Available', '2026-12-16': 'Available' },
        completedOrders90Days: item.orders !== undefined ? item.orders : 10,
        averageOrderValue90Days: item.aov !== undefined ? item.aov : 180000,
        portfolioImages: [
          `/assets/${spec.short}-1.jpg`,
          `/assets/${spec.short}-2.jpg`
        ],
        serviceTags: item.tags || [spec.category],
        isNewToPlatform: !!item.isNew,
        contactEmail: `contact@${id}.demo.wedora.in`,
        contactPhone: `+91 98000 ${String(10000 + globalIdx).slice(1)}`
      };

      result.push(vendorObj);
      globalIdx++;
    }
  });

  return result;
}

const mumbaiVendors = buildVendors('Mumbai', mumbaiVendorsData, 'mum');
const puneVendors = buildVendors('Pune', puneVendorsData, 'pun');

const allVendors = [...mumbaiVendors, ...puneVendors];

console.log(`Generated ${mumbaiVendors.length} Mumbai vendors.`);
console.log(`Generated ${puneVendors.length} Pune vendors.`);
console.log(`Total: ${allVendors.length} vendors.`);

// Verify distribution
categorySpecs.forEach(spec => {
  const mumCount = mumbaiVendors.filter(v => v.category === spec.category).length;
  const punCount = puneVendors.filter(v => v.category === spec.category).length;
  console.log(`- ${spec.category}: Mumbai=${mumCount} (req ${spec.count}), Pune=${punCount} (req ${spec.count})`);
  if (mumCount !== spec.count || punCount !== spec.count) {
    throw new Error(`Category distribution mismatch for ${spec.category}!`);
  }
});

const fileHeader = `import { Vendor } from '../types/vendor';

/**
 * AI Wedding Timeline Orchestrator — Demo Vendor Dataset
 * Exactly 100 Unique Fictional Vendors (50 Mumbai, 50 Pune)
 * Adheres strictly to the PRD Section 5.1 Category Distribution Table.
 * All metrics, phone numbers, and names are fictional demonstration data.
 */
`;

const fileContent = `${fileHeader}
export const DEMO_VENDORS: Vendor[] = ${JSON.stringify(allVendors, null, 2)};

export default DEMO_VENDORS;
`;

const outputPath = path.join(__dirname, 'demoVendors.ts');
fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`Successfully written to ${outputPath}`);
