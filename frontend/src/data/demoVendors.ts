import { Vendor } from '../types/vendor';

/**
 * AI Wedding Timeline Orchestrator — Demo Vendor Dataset
 * Comprehensive Fictional Vendor Database with minimum 50 unique vendors per city
 * and guaranteed minimum 7 vendors per canonical category in both Mumbai and Pune.
 * All metrics, phone numbers, and names are fictional demonstration data.
 */

export const DEMO_VENDORS: Vendor[] = [
  {
    "id": "mum-cat-01",
    "businessName": "Maharaja Royal Banquet Caterers",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Lower Parel",
      "Dadar"
    ],
    "category": "Catering and Food Services",
    "secondaryCategories": [],
    "description": "Grand royal wedding banquets featuring authentic North Indian, Gujarati, Marwari and global live culinary stations.",
    "maximumGuestCapacity": 1500,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 1450,
    "priceUnit": "per plate",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Tentative",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 27,
    "averageOrderValue90Days": 420000,
    "portfolioImages": [
      "/assets/cat-1.jpg",
      "/assets/cat-2.jpg"
    ],
    "serviceTags": [
      "Royal Banquets",
      "Gujarati/Marwari",
      "Live Counters",
      "Silver Service"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-cat-01.demo.wedora.in",
    "contactPhone": "+91 98000 0000",
    "serviceOfferings": [
      "Buffet Catering",
      "Live Counters",
      "Tasting Sessions",
      "Custom Menus",
      "Professional Waitstaff"
    ],
    "repeatOrdersArea": {
      "Bandra": 6,
      "Lower Parel": 6,
      "Dadar": 5
    },
    "referralsArea": {
      "Bandra": 9,
      "Lower Parel": 10,
      "Dadar": 9
    },
    "repeatOrdersTotal": 17,
    "referralsTotal": 28,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 122,
    "successfulReferralBookings": 28,
    "repeatCustomerBookings": 17,
    "onTimeDeliveryPercent": 94,
    "verifiedCustomerFeedbackCount": 54,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Bandra": 31,
      "Lower Parel": 30,
      "Dadar": 43
    },
    "customerFeedback": [
      {
        "id": "fb-mum-cat-01-1",
        "customerName": "A. Banerjee",
        "eventType": "Mehendi Celebration",
        "location": "Bandra, Mumbai",
        "comment": "Food quality and live chaat counters were exceptional. Our guests especially loved the hot appetizers and traditional dessert spread. Beverage refills at the far dining section had a brief delay during peak dinner rush, but the floor manager resolved it quickly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-cat-01-2",
        "customerName": "S. Kulkarni",
        "eventType": "Mehendi Celebration",
        "location": "Lower Parel, Mumbai",
        "comment": "Professional service staff, spotless buffet presentation, and authentic regional flavours. The tasting session matched the wedding spread exactly. Setup started an hour earlier than scheduled which helped avoid any last-minute rush.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "mum-cat-02",
    "businessName": "Saffron Spice Gourmet Catering",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Powai",
      "Andheri",
      "Goregaon"
    ],
    "category": "Catering and Food Services",
    "secondaryCategories": [],
    "description": "Artisanal fusion catering, farm-to-table wedding spreads, curated cocktail dinners and dessert lounges.",
    "maximumGuestCapacity": 900,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 1250,
    "priceUnit": "per plate",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-25": "Fully Booked"
    },
    "completedOrders90Days": 24,
    "averageOrderValue90Days": 310000,
    "portfolioImages": [
      "/assets/cat-1.jpg",
      "/assets/cat-2.jpg"
    ],
    "serviceTags": [
      "Fusion Cuisine",
      "Farm-to-Table",
      "Cocktail Menus",
      "Artisanal Desserts"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-cat-02.demo.wedora.in",
    "contactPhone": "+91 98000 0001",
    "serviceOfferings": [
      "Buffet Catering",
      "Live Counters",
      "Tasting Sessions",
      "Custom Menus",
      "Professional Waitstaff"
    ],
    "repeatOrdersArea": {
      "Powai": 5,
      "Andheri": 5,
      "Goregaon": 4
    },
    "referralsArea": {
      "Powai": 8,
      "Andheri": 8,
      "Goregaon": 8
    },
    "repeatOrdersTotal": 14,
    "referralsTotal": 24,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 109,
    "successfulReferralBookings": 24,
    "repeatCustomerBookings": 14,
    "onTimeDeliveryPercent": 93,
    "verifiedCustomerFeedbackCount": 47,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Powai": 27,
      "Andheri": 28,
      "Goregaon": 38
    },
    "customerFeedback": [
      {
        "id": "fb-mum-cat-02-1",
        "customerName": "C. Gaikwad",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Powai, Mumbai",
        "comment": "The fusion menu and mocktail bar kept all our guests thrilled. Portions were generous with zero food wastage. Live pasta station line moved slightly slow during peak hours due to customized orders.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-mum-cat-02-2",
        "customerName": "A. Patil",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Andheri, Mumbai",
        "comment": "Food quality and live chaat counters were exceptional. Our guests especially loved the hot appetizers and traditional dessert spread. Beverage refills at the far dining section had a brief delay during peak dinner rush, but the floor manager resolved it quickly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-cat-02-3",
        "customerName": "D. Shinde",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Goregaon, Mumbai",
        "comment": "Professional service staff, spotless buffet presentation, and authentic regional flavours. The tasting session matched the wedding spread exactly. Setup started an hour earlier than scheduled which helped avoid any last-minute rush.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "mum-cat-03",
    "businessName": "Konkan Coast Seafood & Maharashtrian Feasts",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Dadar",
      "Thane",
      "Mulund",
      "Chembur"
    ],
    "category": "Catering and Food Services",
    "secondaryCategories": [],
    "description": "Heritage authentic Maharashtrian pângat, coastal delicacies, traditional modak counters and wedding thalis.",
    "maximumGuestCapacity": 750,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 950,
    "priceUnit": "per plate",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-17": "Available"
    },
    "completedOrders90Days": 29,
    "averageOrderValue90Days": 235000,
    "portfolioImages": [
      "/assets/cat-1.jpg",
      "/assets/cat-2.jpg"
    ],
    "serviceTags": [
      "Traditional Maharashtrian",
      "Authentic Pangat",
      "Coastal Specialities"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-cat-03.demo.wedora.in",
    "contactPhone": "+91 98000 0002",
    "serviceOfferings": [
      "Buffet Catering",
      "Live Counters",
      "Tasting Sessions",
      "Custom Menus",
      "Professional Waitstaff"
    ],
    "repeatOrdersArea": {
      "Dadar": 4,
      "Thane": 4,
      "Mulund": 4,
      "Chembur": 4
    },
    "referralsArea": {
      "Dadar": 11,
      "Thane": 10,
      "Mulund": 11,
      "Chembur": 10
    },
    "repeatOrdersTotal": 16,
    "referralsTotal": 42,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 132,
    "successfulReferralBookings": 42,
    "repeatCustomerBookings": 16,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 55,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Dadar": 25,
      "Thane": 26,
      "Mulund": 25,
      "Chembur": 36
    },
    "customerFeedback": [
      {
        "id": "fb-mum-cat-03-1",
        "customerName": "G. Bhosale",
        "eventType": "Wedding Ceremony",
        "location": "Dadar, Mumbai",
        "comment": "Professional service staff, spotless buffet presentation, and authentic regional flavours. The tasting session matched the wedding spread exactly. Setup started an hour earlier than scheduled which helped avoid any last-minute rush.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-cat-03-2",
        "customerName": "M. Parekh",
        "eventType": "Wedding Ceremony",
        "location": "Thane, Mumbai",
        "comment": "The fusion menu and mocktail bar kept all our guests thrilled. Portions were generous with zero food wastage. Live pasta station line moved slightly slow during peak hours due to customized orders.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "mum-cat-04",
    "businessName": "Bayview Signature Banquets & Catering",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Lower Parel",
      "Dadar",
      "Andheri"
    ],
    "category": "Catering and Food Services",
    "secondaryCategories": [],
    "description": "High-end plated dinners, European & pan-Asian live wok stations, and bespoke wedding cocktail catering.",
    "maximumGuestCapacity": 1100,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 1800,
    "priceUnit": "per plate",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available"
    },
    "completedOrders90Days": 21,
    "averageOrderValue90Days": 510000,
    "portfolioImages": [
      "/assets/cat-1.jpg",
      "/assets/cat-2.jpg"
    ],
    "serviceTags": [
      "Luxury Plated Dining",
      "Pan-Asian Woks",
      "Beverage Catering"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-cat-04.demo.wedora.in",
    "contactPhone": "+91 98000 0003",
    "serviceOfferings": [
      "Buffet Catering",
      "Live Counters",
      "Tasting Sessions",
      "Custom Menus",
      "Professional Waitstaff"
    ],
    "repeatOrdersArea": {
      "Bandra": 5,
      "Lower Parel": 5,
      "Dadar": 5,
      "Andheri": 5
    },
    "referralsArea": {
      "Bandra": 7,
      "Lower Parel": 7,
      "Dadar": 8,
      "Andheri": 7
    },
    "repeatOrdersTotal": 20,
    "referralsTotal": 29,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 95,
    "successfulReferralBookings": 29,
    "repeatCustomerBookings": 20,
    "onTimeDeliveryPercent": 98,
    "verifiedCustomerFeedbackCount": 39,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Bandra": 18,
      "Lower Parel": 19,
      "Dadar": 18,
      "Andheri": 26
    },
    "customerFeedback": [
      {
        "id": "fb-mum-cat-04-1",
        "customerName": "D. Shinde",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Bandra, Mumbai",
        "comment": "Food quality and live chaat counters were exceptional. Our guests especially loved the hot appetizers and traditional dessert spread. Beverage refills at the far dining section had a brief delay during peak dinner rush, but the floor manager resolved it quickly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-cat-04-2",
        "customerName": "S. Singhania",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Lower Parel, Mumbai",
        "comment": "Professional service staff, spotless buffet presentation, and authentic regional flavours. The tasting session matched the wedding spread exactly. Setup started an hour earlier than scheduled which helped avoid any last-minute rush.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-cat-04-3",
        "customerName": "R. Shah",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Dadar, Mumbai",
        "comment": "The fusion menu and mocktail bar kept all our guests thrilled. Portions were generous with zero food wastage. Live pasta station line moved slightly slow during peak hours due to customized orders.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "mum-cat-05",
    "businessName": "Annapurna Pure Veg Wedding Caterers",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Borivali",
      "Malad",
      "Goregaon",
      "Ghatkopar"
    ],
    "category": "Catering and Food Services",
    "secondaryCategories": [],
    "description": "100% pure vegetarian & Jain gourmet wedding feasts with 50+ regional delicacies and elaborate sweet displays.",
    "maximumGuestCapacity": 1200,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 850,
    "priceUnit": "per plate",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-19": "Tentative"
    },
    "completedOrders90Days": 31,
    "averageOrderValue90Days": 260000,
    "portfolioImages": [
      "/assets/cat-1.jpg",
      "/assets/cat-2.jpg"
    ],
    "serviceTags": [
      "Pure Vegetarian",
      "Strict Jain Options",
      "Sweet Mart Live"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-cat-05.demo.wedora.in",
    "contactPhone": "+91 98000 0004",
    "serviceOfferings": [
      "Buffet Catering",
      "Live Counters",
      "Tasting Sessions",
      "Custom Menus",
      "Professional Waitstaff"
    ],
    "repeatOrdersArea": {
      "Borivali": 7,
      "Malad": 7,
      "Goregaon": 7,
      "Ghatkopar": 7
    },
    "referralsArea": {
      "Borivali": 11,
      "Malad": 11,
      "Goregaon": 11,
      "Ghatkopar": 10
    },
    "repeatOrdersTotal": 28,
    "referralsTotal": 43,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 142,
    "successfulReferralBookings": 43,
    "repeatCustomerBookings": 28,
    "onTimeDeliveryPercent": 97,
    "verifiedCustomerFeedbackCount": 57,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Borivali": 27,
      "Malad": 28,
      "Goregaon": 28,
      "Ghatkopar": 38
    },
    "customerFeedback": [
      {
        "id": "fb-mum-cat-05-1",
        "customerName": "M. Joshi",
        "eventType": "Grand Reception",
        "location": "Borivali, Mumbai",
        "comment": "The fusion menu and mocktail bar kept all our guests thrilled. Portions were generous with zero food wastage. Live pasta station line moved slightly slow during peak hours due to customized orders.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-mum-cat-05-2",
        "customerName": "H. Trivedi",
        "eventType": "Grand Reception",
        "location": "Malad, Mumbai",
        "comment": "Food quality and live chaat counters were exceptional. Our guests especially loved the hot appetizers and traditional dessert spread. Beverage refills at the far dining section had a brief delay during peak dinner rush, but the floor manager resolved it quickly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "mum-cat-06",
    "businessName": "Navi Mumbai Gourmet Culinary Co.",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Navi Mumbai",
      "Thane",
      "Chembur"
    ],
    "category": "Catering and Food Services",
    "secondaryCategories": [],
    "description": "Multi-cuisine catering specializing in grand buffet spreads, chaat bazaars, tandoor nights, and mocktail bars.",
    "maximumGuestCapacity": 800,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 1100,
    "priceUnit": "per plate",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-24": "Unavailable"
    },
    "completedOrders90Days": 20,
    "averageOrderValue90Days": 275000,
    "portfolioImages": [
      "/assets/cat-1.jpg",
      "/assets/cat-2.jpg"
    ],
    "serviceTags": [
      "Multi-Cuisine",
      "Chaat Bazaars",
      "Tandoor Live"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-cat-06.demo.wedora.in",
    "contactPhone": "+91 98000 0005",
    "serviceOfferings": [
      "Buffet Catering",
      "Live Counters",
      "Tasting Sessions",
      "Custom Menus",
      "Professional Waitstaff"
    ],
    "repeatOrdersArea": {
      "Navi Mumbai": 6,
      "Thane": 6,
      "Chembur": 5
    },
    "referralsArea": {
      "Navi Mumbai": 9,
      "Thane": 9,
      "Chembur": 8
    },
    "repeatOrdersTotal": 17,
    "referralsTotal": 26,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 89,
    "successfulReferralBookings": 26,
    "repeatCustomerBookings": 17,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 35,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Navi Mumbai": 22,
      "Thane": 23,
      "Chembur": 31
    },
    "customerFeedback": [
      {
        "id": "fb-mum-cat-06-1",
        "customerName": "R. Shah",
        "eventType": "Mehendi Celebration",
        "location": "Navi Mumbai, Mumbai",
        "comment": "Professional service staff, spotless buffet presentation, and authentic regional flavours. The tasting session matched the wedding spread exactly. Setup started an hour earlier than scheduled which helped avoid any last-minute rush.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-cat-06-2",
        "customerName": "T. Agarwal",
        "eventType": "Mehendi Celebration",
        "location": "Thane, Mumbai",
        "comment": "The fusion menu and mocktail bar kept all our guests thrilled. Portions were generous with zero food wastage. Live pasta station line moved slightly slow during peak hours due to customized orders.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-cat-06-3",
        "customerName": "R. Tendulkar",
        "eventType": "Mehendi Celebration",
        "location": "Chembur, Mumbai",
        "comment": "Food quality and live chaat counters were exceptional. Our guests especially loved the hot appetizers and traditional dessert spread. Beverage refills at the far dining section had a brief delay during peak dinner rush, but the floor manager resolved it quickly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "mum-cat-07",
    "businessName": "Aroma Artisanal Kitchens",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Andheri",
      "Powai",
      "Malad"
    ],
    "category": "Catering and Food Services",
    "secondaryCategories": [],
    "description": "Boutique culinary collective serving bespoke wedding brunches, mehendi high teas and reception banquets.",
    "maximumGuestCapacity": 500,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 1350,
    "priceUnit": "per plate",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-22": "Available"
    },
    "completedOrders90Days": 0,
    "averageOrderValue90Days": 0,
    "portfolioImages": [
      "/assets/cat-1.jpg",
      "/assets/cat-2.jpg"
    ],
    "serviceTags": [
      "Boutique Catering",
      "Mehendi High Tea",
      "Artisanal Brunches"
    ],
    "isNewToPlatform": true,
    "contactEmail": "contact@mum-cat-07.demo.wedora.in",
    "contactPhone": "+91 98000 0006",
    "serviceOfferings": [
      "Buffet Catering",
      "Live Counters",
      "Tasting Sessions",
      "Custom Menus",
      "Professional Waitstaff"
    ],
    "repeatOrdersArea": {},
    "referralsArea": {},
    "repeatOrdersTotal": 0,
    "referralsTotal": 0,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 0,
    "successfulReferralBookings": 0,
    "repeatCustomerBookings": 0,
    "onTimeDeliveryPercent": 100,
    "verifiedCustomerFeedbackCount": 0,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 100,
    "completedOrdersArea": {},
    "customerFeedback": []
  },
  {
    "id": "mum-dec-01",
    "businessName": "Pushpa Vatika Floral Creations",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Lower Parel",
      "Dadar",
      "Powai"
    ],
    "category": "Decoration Services",
    "secondaryCategories": [
      "Flower Arrangements"
    ],
    "description": "Exquisite exotic floral mandaps, fragrant tuberose canopies, imported orchid arches and floral chandeliers.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 350000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 29,
    "averageOrderValue90Days": 380000,
    "portfolioImages": [
      "/assets/dec-1.jpg",
      "/assets/dec-2.jpg"
    ],
    "serviceTags": [
      "Floral Mandaps",
      "Exotic Orchids",
      "Grand Entryways"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-dec-01.demo.wedora.in",
    "contactPhone": "+91 98000 0007",
    "serviceOfferings": [
      "Theme Decor",
      "Mandap Design",
      "Stage Backdrop",
      "Entrance Installations",
      "Lighting Integration"
    ],
    "repeatOrdersArea": {
      "Bandra": 5,
      "Lower Parel": 5,
      "Dadar": 6,
      "Powai": 5
    },
    "referralsArea": {
      "Bandra": 11,
      "Lower Parel": 10,
      "Dadar": 11,
      "Powai": 10
    },
    "repeatOrdersTotal": 21,
    "referralsTotal": 42,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 134,
    "successfulReferralBookings": 42,
    "repeatCustomerBookings": 21,
    "onTimeDeliveryPercent": 98,
    "verifiedCustomerFeedbackCount": 51,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Bandra": 26,
      "Lower Parel": 26,
      "Dadar": 26,
      "Powai": 36
    },
    "customerFeedback": [
      {
        "id": "fb-mum-dec-01-1",
        "customerName": "B. Chavan",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Bandra, Mumbai",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-dec-01-2",
        "customerName": "S. More",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Lower Parel, Mumbai",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "mum-dec-02",
    "businessName": "Royal Heritage Decor & Mandap Designers",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Andheri",
      "Goregaon",
      "Borivali",
      "Malad"
    ],
    "category": "Decoration Services",
    "secondaryCategories": [
      "Flower Arrangements"
    ],
    "description": "Palatial palace-themed wedding sets, traditional carved wooden mandaps, velvet drapes, and brass temple props.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 450000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 27,
    "averageOrderValue90Days": 520000,
    "portfolioImages": [
      "/assets/dec-1.jpg",
      "/assets/dec-2.jpg"
    ],
    "serviceTags": [
      "Palace Themed",
      "Brass Props",
      "Velvet Drapes"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-dec-02.demo.wedora.in",
    "contactPhone": "+91 98000 0008",
    "serviceOfferings": [
      "Theme Decor",
      "Mandap Design",
      "Stage Backdrop",
      "Entrance Installations",
      "Lighting Integration"
    ],
    "repeatOrdersArea": {
      "Andheri": 5,
      "Goregaon": 4,
      "Borivali": 5,
      "Malad": 4
    },
    "referralsArea": {
      "Andheri": 9,
      "Goregaon": 9,
      "Borivali": 9,
      "Malad": 9
    },
    "repeatOrdersTotal": 18,
    "referralsTotal": 36,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 121,
    "successfulReferralBookings": 36,
    "repeatCustomerBookings": 18,
    "onTimeDeliveryPercent": 97,
    "verifiedCustomerFeedbackCount": 45,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Andheri": 23,
      "Goregaon": 24,
      "Borivali": 23,
      "Malad": 33
    },
    "customerFeedback": [
      {
        "id": "fb-mum-dec-02-1",
        "customerName": "K. Iyer",
        "eventType": "Grand Reception",
        "location": "Andheri, Mumbai",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-mum-dec-02-2",
        "customerName": "A. Banerjee",
        "eventType": "Grand Reception",
        "location": "Goregaon, Mumbai",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-mum-dec-02-3",
        "customerName": "S. Kulkarni",
        "eventType": "Grand Reception",
        "location": "Borivali, Mumbai",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "mum-dec-03",
    "businessName": "Mayur Eco-Floral & Modern Installations",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Powai",
      "Chembur",
      "Ghatkopar"
    ],
    "category": "Decoration Services",
    "secondaryCategories": [
      "Flower Arrangements"
    ],
    "description": "Sustainable eco-conscious floral styling using seasonal marigolds, bamboo structures, and biodegradable elements.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 220000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-25": "Tentative"
    },
    "completedOrders90Days": 24,
    "averageOrderValue90Days": 240000,
    "portfolioImages": [
      "/assets/dec-1.jpg",
      "/assets/dec-2.jpg"
    ],
    "serviceTags": [
      "Eco-Friendly",
      "Marigold Styling",
      "Minimalist Elegance"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-dec-03.demo.wedora.in",
    "contactPhone": "+91 98000 0009",
    "serviceOfferings": [
      "Theme Decor",
      "Mandap Design",
      "Stage Backdrop",
      "Entrance Installations",
      "Lighting Integration"
    ],
    "repeatOrdersArea": {
      "Powai": 5,
      "Chembur": 5,
      "Ghatkopar": 5
    },
    "referralsArea": {
      "Powai": 10,
      "Chembur": 11,
      "Ghatkopar": 10
    },
    "repeatOrdersTotal": 15,
    "referralsTotal": 31,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 108,
    "successfulReferralBookings": 31,
    "repeatCustomerBookings": 15,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 39,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Powai": 27,
      "Chembur": 27,
      "Ghatkopar": 38
    },
    "customerFeedback": [
      {
        "id": "fb-mum-dec-03-1",
        "customerName": "V. Mehta",
        "eventType": "Mehendi Celebration",
        "location": "Powai, Mumbai",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-dec-03-2",
        "customerName": "C. Gaikwad",
        "eventType": "Mehendi Celebration",
        "location": "Chembur, Mumbai",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "mum-dec-04",
    "businessName": "Dreamscape Luxury Wedding Decor",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Lower Parel",
      "Bandra",
      "Dadar"
    ],
    "category": "Decoration Services",
    "secondaryCategories": [
      "Flower Arrangements"
    ],
    "description": "Ultra-luxury contemporary wedding decor featuring crystal chandeliers, mirrored ramps, and pastel flower walls.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 600000,
    "priceUnit": "per event",
    "quotationRequired": true,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-19": "Fully Booked"
    },
    "completedOrders90Days": 22,
    "averageOrderValue90Days": 680000,
    "portfolioImages": [
      "/assets/dec-1.jpg",
      "/assets/dec-2.jpg"
    ],
    "serviceTags": [
      "Ultra Luxury",
      "Mirrored Aisles",
      "Pastel Florals"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-dec-04.demo.wedora.in",
    "contactPhone": "+91 98000 0010",
    "serviceOfferings": [
      "Theme Decor",
      "Mandap Design",
      "Stage Backdrop",
      "Entrance Installations",
      "Lighting Integration"
    ],
    "repeatOrdersArea": {
      "Lower Parel": 4,
      "Bandra": 5,
      "Dadar": 4
    },
    "referralsArea": {
      "Lower Parel": 9,
      "Bandra": 10,
      "Dadar": 9
    },
    "repeatOrdersTotal": 13,
    "referralsTotal": 28,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 99,
    "successfulReferralBookings": 28,
    "repeatCustomerBookings": 13,
    "onTimeDeliveryPercent": 95,
    "verifiedCustomerFeedbackCount": 35,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Lower Parel": 25,
      "Bandra": 25,
      "Dadar": 34
    },
    "customerFeedback": [
      {
        "id": "fb-mum-dec-04-1",
        "customerName": "S. Kulkarni",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Lower Parel, Mumbai",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-mum-dec-04-2",
        "customerName": "G. Bhosale",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Bandra, Mumbai",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-dec-04-3",
        "customerName": "M. Parekh",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Dadar, Mumbai",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "mum-dec-05",
    "businessName": "Utsav Mandap & Canopy Decorators",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Thane",
      "Mulund",
      "Ghatkopar",
      "Navi Mumbai"
    ],
    "category": "Decoration Services",
    "secondaryCategories": [
      "Flower Arrangements"
    ],
    "description": "Vibrant sangeet stage decor, traditional canopy setups, colorful photobooth zones and entrance gates.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 180000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available"
    },
    "completedOrders90Days": 31,
    "averageOrderValue90Days": 210000,
    "portfolioImages": [
      "/assets/dec-1.jpg",
      "/assets/dec-2.jpg"
    ],
    "serviceTags": [
      "Sangeet Stages",
      "Canopy Setups",
      "Photobooths"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-dec-05.demo.wedora.in",
    "contactPhone": "+91 98000 0011",
    "serviceOfferings": [
      "Theme Decor",
      "Mandap Design",
      "Stage Backdrop",
      "Entrance Installations",
      "Lighting Integration"
    ],
    "repeatOrdersArea": {
      "Thane": 4,
      "Mulund": 4,
      "Ghatkopar": 5,
      "Navi Mumbai": 4
    },
    "referralsArea": {
      "Thane": 10,
      "Mulund": 9,
      "Ghatkopar": 10,
      "Navi Mumbai": 9
    },
    "repeatOrdersTotal": 17,
    "referralsTotal": 38,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 142,
    "successfulReferralBookings": 38,
    "repeatCustomerBookings": 17,
    "onTimeDeliveryPercent": 94,
    "verifiedCustomerFeedbackCount": 48,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 96,
    "completedOrdersArea": {
      "Thane": 27,
      "Mulund": 28,
      "Ghatkopar": 28,
      "Navi Mumbai": 38
    },
    "customerFeedback": [
      {
        "id": "fb-mum-dec-05-1",
        "customerName": "A. Patil",
        "eventType": "Wedding Ceremony",
        "location": "Thane, Mumbai",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-dec-05-2",
        "customerName": "D. Shinde",
        "eventType": "Wedding Ceremony",
        "location": "Mulund, Mumbai",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "mum-dec-06",
    "businessName": "Celestial Bloom Studios",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Andheri",
      "Powai"
    ],
    "category": "Decoration Services",
    "secondaryCategories": [
      "Flower Arrangements"
    ],
    "description": "Modern botanical design studio focusing on bohemian pampas grass installations and romantic fairy light mandaps.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 280000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-21": "Available"
    },
    "completedOrders90Days": 0,
    "averageOrderValue90Days": 0,
    "portfolioImages": [
      "/assets/dec-1.jpg",
      "/assets/dec-2.jpg"
    ],
    "serviceTags": [
      "Boho Chic",
      "Pampas Grass",
      "Botanical Installations"
    ],
    "isNewToPlatform": true,
    "contactEmail": "contact@mum-dec-06.demo.wedora.in",
    "contactPhone": "+91 98000 0012",
    "serviceOfferings": [
      "Theme Decor",
      "Mandap Design",
      "Stage Backdrop",
      "Entrance Installations",
      "Lighting Integration"
    ],
    "repeatOrdersArea": {},
    "referralsArea": {},
    "repeatOrdersTotal": 0,
    "referralsTotal": 0,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 0,
    "successfulReferralBookings": 0,
    "repeatCustomerBookings": 0,
    "onTimeDeliveryPercent": 100,
    "verifiedCustomerFeedbackCount": 0,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 100,
    "completedOrdersArea": {},
    "customerFeedback": []
  },
  {
    "id": "mum-djs-01",
    "businessName": "DJ Romy & Sonic Beats Sound Production",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Andheri",
      "Lower Parel",
      "Powai"
    ],
    "category": "DJ and Sound Systems",
    "secondaryCategories": [],
    "description": "Celebrity wedding DJ, Line Array sound systems (JBL VTX / L-Acoustics), club-grade subwoofers and live dhol ensemble.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 120000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available"
    },
    "completedOrders90Days": 27,
    "averageOrderValue90Days": 165000,
    "portfolioImages": [
      "/assets/djs-1.jpg",
      "/assets/djs-2.jpg"
    ],
    "serviceTags": [
      "Celebrity DJ",
      "Line Array JBL",
      "Live Punjabi Dhol",
      "Sangeet Party"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-djs-01.demo.wedora.in",
    "contactPhone": "+91 98000 0017",
    "serviceOfferings": [
      "Line Array Sound System",
      "Celebrity DJ Performances",
      "Live Dhol Players",
      "Wireless Mic Kits",
      "Digital Sound Console"
    ],
    "repeatOrdersArea": {
      "Bandra": 5,
      "Andheri": 4,
      "Lower Parel": 5,
      "Powai": 4
    },
    "referralsArea": {
      "Bandra": 8,
      "Andheri": 7,
      "Lower Parel": 8,
      "Powai": 7
    },
    "repeatOrdersTotal": 18,
    "referralsTotal": 30,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 123,
    "successfulReferralBookings": 30,
    "repeatCustomerBookings": 18,
    "onTimeDeliveryPercent": 94,
    "verifiedCustomerFeedbackCount": 58,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Bandra": 24,
      "Andheri": 24,
      "Lower Parel": 24,
      "Powai": 33
    },
    "customerFeedback": [
      {
        "id": "fb-mum-djs-01-1",
        "customerName": "K. Iyer",
        "eventType": "Grand Reception",
        "location": "Bandra, Mumbai",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-mum-djs-01-2",
        "customerName": "A. Banerjee",
        "eventType": "Grand Reception",
        "location": "Andheri, Mumbai",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-mum-djs-01-3",
        "customerName": "S. Kulkarni",
        "eventType": "Grand Reception",
        "location": "Lower Parel, Mumbai",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "mum-djs-02",
    "businessName": "Acoustic Waves Professional Audio",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Dadar",
      "Chembur",
      "Ghatkopar",
      "Thane"
    ],
    "category": "DJ and Sound Systems",
    "secondaryCategories": [],
    "description": "Crystal-clear acoustic setups for shehnai, classical phera ceremonies, sangeet bands, and digital wireless mic systems.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 75000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 22,
    "averageOrderValue90Days": 95000,
    "portfolioImages": [
      "/assets/djs-1.jpg",
      "/assets/djs-2.jpg"
    ],
    "serviceTags": [
      "Phera Ceremony Audio",
      "Digital Mics",
      "Live Band Setup"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-djs-02.demo.wedora.in",
    "contactPhone": "+91 98000 0018",
    "serviceOfferings": [
      "Line Array Sound System",
      "Celebrity DJ Performances",
      "Live Dhol Players",
      "Wireless Mic Kits",
      "Digital Sound Console"
    ],
    "repeatOrdersArea": {
      "Dadar": 4,
      "Chembur": 3,
      "Ghatkopar": 4,
      "Thane": 3
    },
    "referralsArea": {
      "Dadar": 6,
      "Chembur": 6,
      "Ghatkopar": 6,
      "Thane": 5
    },
    "repeatOrdersTotal": 14,
    "referralsTotal": 23,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 98,
    "successfulReferralBookings": 23,
    "repeatCustomerBookings": 14,
    "onTimeDeliveryPercent": 93,
    "verifiedCustomerFeedbackCount": 45,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Dadar": 19,
      "Chembur": 19,
      "Ghatkopar": 19,
      "Thane": 26
    },
    "customerFeedback": [
      {
        "id": "fb-mum-djs-02-1",
        "customerName": "V. Mehta",
        "eventType": "Mehendi Celebration",
        "location": "Dadar, Mumbai",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-djs-02-2",
        "customerName": "C. Gaikwad",
        "eventType": "Mehendi Celebration",
        "location": "Chembur, Mumbai",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "mum-djs-03",
    "businessName": "Electra Groove DJ & Laser Symphony",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Goregaon",
      "Malad",
      "Borivali",
      "Andheri"
    ],
    "category": "DJ and Sound Systems",
    "secondaryCategories": [],
    "description": "High-energy Bollywood & Punjabi DJ sets, synchronised laser shows, cold spark machines, and LED dancefloors.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 140000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 18,
    "averageOrderValue90Days": 180000,
    "portfolioImages": [
      "/assets/djs-1.jpg",
      "/assets/djs-2.jpg"
    ],
    "serviceTags": [
      "LED Dancefloor",
      "Cold Sparks",
      "Synchronized Lasers"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-djs-03.demo.wedora.in",
    "contactPhone": "+91 98000 0019",
    "serviceOfferings": [
      "Line Array Sound System",
      "Celebrity DJ Performances",
      "Live Dhol Players",
      "Wireless Mic Kits",
      "Digital Sound Console"
    ],
    "repeatOrdersArea": {
      "Goregaon": 3,
      "Malad": 3,
      "Borivali": 3,
      "Andheri": 2
    },
    "referralsArea": {
      "Goregaon": 5,
      "Malad": 4,
      "Borivali": 5,
      "Andheri": 4
    },
    "repeatOrdersTotal": 11,
    "referralsTotal": 18,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 81,
    "successfulReferralBookings": 18,
    "repeatCustomerBookings": 11,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 36,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Goregaon": 16,
      "Malad": 16,
      "Borivali": 15,
      "Andheri": 22
    },
    "customerFeedback": [
      {
        "id": "fb-mum-djs-03-1",
        "customerName": "S. Kulkarni",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Goregaon, Mumbai",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-mum-djs-03-2",
        "customerName": "G. Bhosale",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Malad, Mumbai",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-djs-03-3",
        "customerName": "M. Parekh",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Borivali, Mumbai",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "mum-djs-04",
    "businessName": "Resonance Sound & Backline Gear",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Navi Mumbai",
      "Thane",
      "Mulund"
    ],
    "category": "DJ and Sound Systems",
    "secondaryCategories": [],
    "description": "Full backline live sound engineering for celebrity singers, musical pheras, and energetic baraat sound trucks.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 110000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-19": "Tentative"
    },
    "completedOrders90Days": 14,
    "averageOrderValue90Days": 140000,
    "portfolioImages": [
      "/assets/djs-1.jpg",
      "/assets/djs-2.jpg"
    ],
    "serviceTags": [
      "Baraat Sound Truck",
      "Musical Pheras",
      "Live Sound Engineers"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-djs-04.demo.wedora.in",
    "contactPhone": "+91 98000 0020",
    "serviceOfferings": [
      "Line Array Sound System",
      "Celebrity DJ Performances",
      "Live Dhol Players",
      "Wireless Mic Kits",
      "Digital Sound Console"
    ],
    "repeatOrdersArea": {
      "Navi Mumbai": 3,
      "Thane": 3,
      "Mulund": 2
    },
    "referralsArea": {
      "Navi Mumbai": 7,
      "Thane": 7,
      "Mulund": 6
    },
    "repeatOrdersTotal": 8,
    "referralsTotal": 20,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 64,
    "successfulReferralBookings": 20,
    "repeatCustomerBookings": 8,
    "onTimeDeliveryPercent": 98,
    "verifiedCustomerFeedbackCount": 28,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Navi Mumbai": 16,
      "Thane": 16,
      "Mulund": 22
    },
    "customerFeedback": [
      {
        "id": "fb-mum-djs-04-1",
        "customerName": "A. Patil",
        "eventType": "Wedding Ceremony",
        "location": "Navi Mumbai, Mumbai",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-djs-04-2",
        "customerName": "D. Shinde",
        "eventType": "Wedding Ceremony",
        "location": "Thane, Mumbai",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "mum-djs-05",
    "businessName": "Bassline Live & Sangeet DJ Consoles",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Lower Parel",
      "Dadar",
      "Bandra",
      "Chembur"
    ],
    "category": "DJ and Sound Systems",
    "secondaryCategories": [
      "Lighting Services"
    ],
    "description": "High-energy Bollywood & Punjabi sangeet DJ setups, JBL VRX concert line arrays, live percussionist integration, and silent disco headphones.",
    "serviceOfferings": [
      "Line Array Sound System",
      "Celebrity DJ Performances",
      "Live Dhol Players",
      "Wireless Mic Kits",
      "Digital Sound Console"
    ],
    "maximumSimultaneousBookings": 2,
    "startingPrice": 48000,
    "priceUnit": "per night",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 24,
    "repeatOrdersArea": {
      "Lower Parel": 6,
      "Dadar": 5,
      "Bandra": 6,
      "Chembur": 5
    },
    "referralsArea": {
      "Lower Parel": 8,
      "Dadar": 8,
      "Bandra": 9,
      "Chembur": 8
    },
    "repeatOrdersTotal": 22,
    "referralsTotal": 33,
    "portfolioImages": [
      "/assets/djs-1.jpg"
    ],
    "serviceTags": [
      "Sangeet DJ",
      "JBL Line Array",
      "Live Percussion",
      "Bollywood & EDM"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-djs-05.demo.wedora.in",
    "contactPhone": "+91 98000 0057",
    "averageOrderValue90Days": 375000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 107,
    "successfulReferralBookings": 33,
    "repeatCustomerBookings": 22,
    "onTimeDeliveryPercent": 97,
    "verifiedCustomerFeedbackCount": 46,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Lower Parel": 21,
      "Dadar": 21,
      "Bandra": 20,
      "Chembur": 29
    },
    "customerFeedback": [
      {
        "id": "fb-mum-djs-05-1",
        "customerName": "M. Parekh",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Lower Parel, Mumbai",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-djs-05-2",
        "customerName": "M. Joshi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Dadar, Mumbai",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-djs-05-3",
        "customerName": "H. Trivedi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Bandra, Mumbai",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "mum-e2e-01",
    "businessName": "Aura Royale End-to-End Event Management",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Lower Parel",
      "Andheri",
      "Powai",
      "Dadar"
    ],
    "category": "End-to-End Event Management",
    "secondaryCategories": [
      "Catering and Food Services",
      "Decoration and Flower Arrangements",
      "Lighting Services",
      "DJ and Sound Systems",
      "Wedding Lawns and Venues",
      "Hotels, Lodging and Guest Accommodation",
      "Logistics and Transportation"
    ],
    "description": "Turnkey wedding production delivering complete venue management, royal catering, magnificent decor, concert audio/lighting, and guest logistics.",
    "maximumGuestCapacity": 2000,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 1200000,
    "priceUnit": "turnkey package",
    "quotationRequired": true,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-19": "Available"
    },
    "completedOrders90Days": 21,
    "averageOrderValue90Days": 1850000,
    "portfolioImages": [
      "/assets/e2e-1.jpg",
      "/assets/e2e-2.jpg"
    ],
    "serviceTags": [
      "End-to-End Event Management",
      "Complete Turnkey",
      "Master Vendor Coordination",
      "Full Production"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-e2e-01.demo.wedora.in",
    "contactPhone": "+91 98000 0043",
    "serviceOfferings": [
      "Complete Turnkey Wedding Management",
      "Hospitality & Logistics",
      "Full Vendor Supervision",
      "Production & Decor Oversight"
    ],
    "repeatOrdersArea": {
      "Bandra": 3,
      "Lower Parel": 3,
      "Andheri": 2,
      "Powai": 3,
      "Dadar": 2
    },
    "referralsArea": {
      "Bandra": 5,
      "Lower Parel": 5,
      "Andheri": 5,
      "Powai": 5,
      "Dadar": 5
    },
    "repeatOrdersTotal": 13,
    "referralsTotal": 25,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 96,
    "successfulReferralBookings": 25,
    "repeatCustomerBookings": 13,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 42,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Bandra": 15,
      "Lower Parel": 15,
      "Andheri": 15,
      "Powai": 15,
      "Dadar": 22
    },
    "customerFeedback": [
      {
        "id": "fb-mum-e2e-01-1",
        "customerName": "V. Mehta",
        "eventType": "Mehendi Celebration",
        "location": "Bandra, Mumbai",
        "comment": "Flawless end-to-end orchestration! They kept the pandit, caterers, and sound engineers perfectly in sync throughout. Varmala stage entry timing was pushed back by 15 minutes due to guest arrival traffic.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-e2e-01-2",
        "customerName": "C. Gaikwad",
        "eventType": "Mehendi Celebration",
        "location": "Lower Parel, Mumbai",
        "comment": "Reduced our family stress to zero. Budget tracker and daily checklists were transparent and meticulously maintained. Bride side car coordination had minor confusion that was rectified promptly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "mum-e2e-02",
    "businessName": "Vows & Beyond Full-Service Wedding Productions",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Powai",
      "Goregaon",
      "Malad",
      "Borivali",
      "Thane"
    ],
    "category": "End-to-End Event Management",
    "secondaryCategories": [
      "Catering and Food Services",
      "Decoration and Flower Arrangements",
      "Photography and Videography",
      "Lighting Services",
      "DJ and Sound Systems"
    ],
    "description": "Comprehensive all-inclusive wedding management from roka to reception, coordinating catering, decor, sound, photography, and luxury transport.",
    "maximumGuestCapacity": 1200,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 950000,
    "priceUnit": "turnkey package",
    "quotationRequired": true,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-17": "Available"
    },
    "completedOrders90Days": 24,
    "averageOrderValue90Days": 1420000,
    "portfolioImages": [
      "/assets/e2e-1.jpg",
      "/assets/e2e-2.jpg"
    ],
    "serviceTags": [
      "End-to-End Event Management",
      "All-Inclusive Packages",
      "Stress-Free Planning"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-e2e-02.demo.wedora.in",
    "contactPhone": "+91 98000 0044",
    "serviceOfferings": [
      "Complete Turnkey Wedding Management",
      "Hospitality & Logistics",
      "Full Vendor Supervision",
      "Production & Decor Oversight"
    ],
    "repeatOrdersArea": {
      "Powai": 3,
      "Goregaon": 3,
      "Malad": 3,
      "Borivali": 3,
      "Thane": 2
    },
    "referralsArea": {
      "Powai": 6,
      "Goregaon": 6,
      "Malad": 5,
      "Borivali": 6,
      "Thane": 5
    },
    "repeatOrdersTotal": 14,
    "referralsTotal": 28,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 111,
    "successfulReferralBookings": 28,
    "repeatCustomerBookings": 14,
    "onTimeDeliveryPercent": 95,
    "verifiedCustomerFeedbackCount": 48,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Powai": 17,
      "Goregaon": 18,
      "Malad": 17,
      "Borivali": 18,
      "Thane": 24
    },
    "customerFeedback": [
      {
        "id": "fb-mum-e2e-02-1",
        "customerName": "S. Kulkarni",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Powai, Mumbai",
        "comment": "Masterful crowd control and welcoming hospitality for our 800+ guests. Every vendor delivered on time under their watch. Pre-wedding rehearsal was brief, but the main day execution went smoothly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-mum-e2e-02-2",
        "customerName": "G. Bhosale",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Goregaon, Mumbai",
        "comment": "Flawless end-to-end orchestration! They kept the pandit, caterers, and sound engineers perfectly in sync throughout. Varmala stage entry timing was pushed back by 15 minutes due to guest arrival traffic.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-e2e-02-3",
        "customerName": "M. Parekh",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Malad, Mumbai",
        "comment": "Reduced our family stress to zero. Budget tracker and daily checklists were transparent and meticulously maintained. Bride side car coordination had minor confusion that was rectified promptly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "mum-e2e-03",
    "businessName": "Sublime Heritage End-to-End Weddings",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Dadar",
      "Chembur",
      "Navi Mumbai",
      "Thane",
      "Ghatkopar"
    ],
    "category": "End-to-End Event Management",
    "secondaryCategories": [
      "Catering and Food Services",
      "Decoration and Flower Arrangements",
      "Hotels, Lodging and Guest Accommodation",
      "Logistics and Transportation"
    ],
    "description": "Turnkey traditional and fusion wedding masters coordinating authentic banquets, grand mandap decor, guest lodging, and fleet transport.",
    "maximumGuestCapacity": 1000,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 850000,
    "priceUnit": "turnkey package",
    "quotationRequired": true,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-22": "Available"
    },
    "completedOrders90Days": 18,
    "averageOrderValue90Days": 1250000,
    "portfolioImages": [
      "/assets/e2e-1.jpg",
      "/assets/e2e-2.jpg"
    ],
    "serviceTags": [
      "End-to-End Event Management",
      "Heritage Turnkey",
      "Hospitality & Logistics"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-e2e-03.demo.wedora.in",
    "contactPhone": "+91 98000 0045",
    "serviceOfferings": [
      "Complete Turnkey Wedding Management",
      "Hospitality & Logistics",
      "Full Vendor Supervision",
      "Production & Decor Oversight"
    ],
    "repeatOrdersArea": {
      "Dadar": 2,
      "Chembur": 2,
      "Navi Mumbai": 2,
      "Thane": 2,
      "Ghatkopar": 2
    },
    "referralsArea": {
      "Dadar": 4,
      "Chembur": 4,
      "Navi Mumbai": 4,
      "Thane": 4,
      "Ghatkopar": 4
    },
    "repeatOrdersTotal": 10,
    "referralsTotal": 20,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 82,
    "successfulReferralBookings": 20,
    "repeatCustomerBookings": 10,
    "onTimeDeliveryPercent": 94,
    "verifiedCustomerFeedbackCount": 34,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 96,
    "completedOrdersArea": {
      "Dadar": 13,
      "Chembur": 13,
      "Navi Mumbai": 13,
      "Thane": 13,
      "Ghatkopar": 18
    },
    "customerFeedback": [
      {
        "id": "fb-mum-e2e-03-1",
        "customerName": "A. Patil",
        "eventType": "Wedding Ceremony",
        "location": "Dadar, Mumbai",
        "comment": "Reduced our family stress to zero. Budget tracker and daily checklists were transparent and meticulously maintained. Bride side car coordination had minor confusion that was rectified promptly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-e2e-03-2",
        "customerName": "D. Shinde",
        "eventType": "Wedding Ceremony",
        "location": "Chembur, Mumbai",
        "comment": "Masterful crowd control and welcoming hospitality for our 800+ guests. Every vendor delivered on time under their watch. Pre-wedding rehearsal was brief, but the main day execution went smoothly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "mum-e2e-04",
    "businessName": "Vows & Beyond Turnkey Wedding Management",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Lower Parel",
      "Powai",
      "Dadar"
    ],
    "category": "End-to-End Event Management",
    "secondaryCategories": [
      "Event Organizers / Wedding Planners",
      "Decoration Services"
    ],
    "description": "Complete 360-degree wedding production: catering curation, design, celebrity entertainment, bridal hospitality, and on-site timeline director.",
    "serviceOfferings": [
      "Complete Turnkey Wedding Management",
      "Hospitality & Logistics",
      "Full Vendor Supervision",
      "Production & Decor Oversight"
    ],
    "maximumGuestCapacity": 1500,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 350000,
    "priceUnit": "turnkey management fee",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 23,
    "repeatOrdersArea": {
      "Bandra": 6,
      "Lower Parel": 5,
      "Powai": 6,
      "Dadar": 5
    },
    "referralsArea": {
      "Bandra": 6,
      "Lower Parel": 6,
      "Powai": 6,
      "Dadar": 6
    },
    "repeatOrdersTotal": 22,
    "referralsTotal": 24,
    "portfolioImages": [
      "/assets/org-1.jpg"
    ],
    "serviceTags": [
      "Turnkey Production",
      "Celebrity Talent",
      "360 Hospitality",
      "Timeline Director"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-e2e-04.demo.wedora.in",
    "contactPhone": "+91 98000 0061",
    "averageOrderValue90Days": 285000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 105,
    "successfulReferralBookings": 24,
    "repeatCustomerBookings": 22,
    "onTimeDeliveryPercent": 93,
    "verifiedCustomerFeedbackCount": 43,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Bandra": 20,
      "Lower Parel": 20,
      "Powai": 20,
      "Dadar": 29
    },
    "customerFeedback": [
      {
        "id": "fb-mum-e2e-04-1",
        "customerName": "M. Parekh",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Bandra, Mumbai",
        "comment": "Flawless end-to-end orchestration! They kept the pandit, caterers, and sound engineers perfectly in sync throughout. Varmala stage entry timing was pushed back by 15 minutes due to guest arrival traffic.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-e2e-04-2",
        "customerName": "M. Joshi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Lower Parel, Mumbai",
        "comment": "Reduced our family stress to zero. Budget tracker and daily checklists were transparent and meticulously maintained. Bride side car coordination had minor confusion that was rectified promptly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-e2e-04-3",
        "customerName": "H. Trivedi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Powai, Mumbai",
        "comment": "Masterful crowd control and welcoming hospitality for our 800+ guests. Every vendor delivered on time under their watch. Pre-wedding rehearsal was brief, but the main day execution went smoothly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "mum-e2e-05",
    "businessName": "Regal Mumbai Grand Celebrations Turnkey",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Navi Mumbai",
      "Thane",
      "Ghatkopar",
      "Chembur"
    ],
    "category": "End-to-End Event Management",
    "secondaryCategories": [
      "Event Organizers / Wedding Planners"
    ],
    "description": "Comprehensive luxury wedding management, multi-day itinerary execution, vendor negotiation, and seamless family concierge service.",
    "serviceOfferings": [
      "Complete Turnkey Wedding Management",
      "Hospitality & Logistics",
      "Full Vendor Supervision",
      "Production & Decor Oversight"
    ],
    "maximumGuestCapacity": 1200,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 280000,
    "priceUnit": "turnkey management fee",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-25": "Available"
    },
    "completedOrders90Days": 20,
    "repeatOrdersArea": {
      "Navi Mumbai": 5,
      "Thane": 4,
      "Ghatkopar": 5,
      "Chembur": 4
    },
    "referralsArea": {
      "Navi Mumbai": 5,
      "Thane": 5,
      "Ghatkopar": 5,
      "Chembur": 5
    },
    "repeatOrdersTotal": 18,
    "referralsTotal": 20,
    "portfolioImages": [
      "/assets/org-2.jpg"
    ],
    "serviceTags": [
      "Grand Celebrations",
      "Turnkey Accountability",
      "Family Concierge",
      "Budget Control"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-e2e-05.demo.wedora.in",
    "contactPhone": "+91 98000 0062",
    "averageOrderValue90Days": 225000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 92,
    "successfulReferralBookings": 20,
    "repeatCustomerBookings": 18,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 37,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Navi Mumbai": 18,
      "Thane": 18,
      "Ghatkopar": 18,
      "Chembur": 24
    },
    "customerFeedback": [
      {
        "id": "fb-mum-e2e-05-1",
        "customerName": "S. Singhania",
        "eventType": "Grand Reception",
        "location": "Navi Mumbai, Mumbai",
        "comment": "Masterful crowd control and welcoming hospitality for our 800+ guests. Every vendor delivered on time under their watch. Pre-wedding rehearsal was brief, but the main day execution went smoothly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-mum-e2e-05-2",
        "customerName": "R. Shah",
        "eventType": "Grand Reception",
        "location": "Thane, Mumbai",
        "comment": "Flawless end-to-end orchestration! They kept the pandit, caterers, and sound engineers perfectly in sync throughout. Varmala stage entry timing was pushed back by 15 minutes due to guest arrival traffic.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "mum-flw-01",
    "businessName": "Orchid Bloom Exotic Floral Stylists",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Lower Parel",
      "Dadar",
      "Powai"
    ],
    "category": "Flower Arrangements",
    "secondaryCategories": [
      "Decoration Services"
    ],
    "description": "Bespoke fresh floral decor, imported Dutch orchids, exotic varmala designs, and fragrant jasmine floral tunnels.",
    "serviceOfferings": [
      "Exotic Floral Mandaps",
      "Bridal Bouquets",
      "Fresh Floral Canopies",
      "Varmala Design",
      "Floral Centerpieces"
    ],
    "maximumSimultaneousBookings": 3,
    "startingPrice": 65000,
    "priceUnit": "per wedding",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 17,
    "repeatOrdersArea": {
      "Bandra": 3,
      "Lower Parel": 3,
      "Dadar": 4,
      "Powai": 3
    },
    "referralsArea": {
      "Bandra": 4,
      "Lower Parel": 4,
      "Dadar": 5,
      "Powai": 4
    },
    "repeatOrdersTotal": 13,
    "referralsTotal": 17,
    "portfolioImages": [
      "/assets/flw-1.jpg",
      "/assets/flw-2.jpg"
    ],
    "serviceTags": [
      "Exotic Florals",
      "Orchid Mandaps",
      "Custom Varmalas",
      "Fragrant Tunnels"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-flw-01.demo.wedora.in",
    "contactPhone": "+91 98000 0051",
    "averageOrderValue90Days": 240000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 79,
    "successfulReferralBookings": 17,
    "repeatCustomerBookings": 13,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 34,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Bandra": 15,
      "Lower Parel": 15,
      "Dadar": 15,
      "Powai": 22
    },
    "customerFeedback": [
      {
        "id": "fb-mum-flw-01-1",
        "customerName": "R. Tendulkar",
        "eventType": "Wedding Ceremony",
        "location": "Bandra, Mumbai",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-flw-01-2",
        "customerName": "P. Deshmukh",
        "eventType": "Wedding Ceremony",
        "location": "Lower Parel, Mumbai",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-mum-flw-01-3",
        "customerName": "K. Iyer",
        "eventType": "Wedding Ceremony",
        "location": "Dadar, Mumbai",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "mum-flw-02",
    "businessName": "Genda Phool Traditional Floral Curators",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Dadar",
      "Chembur",
      "Ghatkopar",
      "Mulund"
    ],
    "category": "Flower Arrangements",
    "secondaryCategories": [
      "Decoration Services"
    ],
    "description": "Heritage marigold, rose petal carpet, traditional South Indian lotus installations, and auspicious pooja floral backdrops.",
    "serviceOfferings": [
      "Exotic Floral Mandaps",
      "Bridal Bouquets",
      "Fresh Floral Canopies",
      "Varmala Design",
      "Floral Centerpieces"
    ],
    "maximumSimultaneousBookings": 4,
    "startingPrice": 45000,
    "priceUnit": "per celebration",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-25": "Available"
    },
    "completedOrders90Days": 22,
    "repeatOrdersArea": {
      "Dadar": 5,
      "Chembur": 4,
      "Ghatkopar": 5,
      "Mulund": 4
    },
    "referralsArea": {
      "Dadar": 6,
      "Chembur": 6,
      "Ghatkopar": 6,
      "Mulund": 5
    },
    "repeatOrdersTotal": 18,
    "referralsTotal": 23,
    "portfolioImages": [
      "/assets/flw-1.jpg"
    ],
    "serviceTags": [
      "Traditional Marigold",
      "Lotus Mandap",
      "Puja Florals",
      "Heritage Styling"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-flw-02.demo.wedora.in",
    "contactPhone": "+91 98000 0052",
    "averageOrderValue90Days": 330000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 100,
    "successfulReferralBookings": 23,
    "repeatCustomerBookings": 18,
    "onTimeDeliveryPercent": 93,
    "verifiedCustomerFeedbackCount": 44,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Dadar": 19,
      "Chembur": 19,
      "Ghatkopar": 20,
      "Mulund": 27
    },
    "customerFeedback": [
      {
        "id": "fb-mum-flw-02-1",
        "customerName": "V. Kadam",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Dadar, Mumbai",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-mum-flw-02-2",
        "customerName": "N. Nair",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Chembur, Mumbai",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "mum-flw-03",
    "businessName": "Petals & Pearls Luxury Floral Couture",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Lower Parel",
      "Bandra",
      "Andheri"
    ],
    "category": "Flower Arrangements",
    "secondaryCategories": [
      "Decoration Services"
    ],
    "description": "Ultra-luxury floral chandeliers, English garden arches, cascading hydrangea centerpieces, and white lily entrance walkways.",
    "serviceOfferings": [
      "Exotic Floral Mandaps",
      "Bridal Bouquets",
      "Fresh Floral Canopies",
      "Varmala Design",
      "Floral Centerpieces"
    ],
    "maximumSimultaneousBookings": 2,
    "startingPrice": 120000,
    "priceUnit": "per setup",
    "quotationRequired": true,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-28": "Available"
    },
    "completedOrders90Days": 16,
    "repeatOrdersArea": {
      "Lower Parel": 5,
      "Bandra": 5,
      "Andheri": 4
    },
    "referralsArea": {
      "Lower Parel": 6,
      "Bandra": 6,
      "Andheri": 6
    },
    "repeatOrdersTotal": 14,
    "referralsTotal": 18,
    "portfolioImages": [
      "/assets/flw-2.jpg"
    ],
    "serviceTags": [
      "Hydrangea Arches",
      "Floral Chandeliers",
      "English Garden",
      "Couture Floral"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-flw-03.demo.wedora.in",
    "contactPhone": "+91 98000 0053",
    "averageOrderValue90Days": 210000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 73,
    "successfulReferralBookings": 18,
    "repeatCustomerBookings": 14,
    "onTimeDeliveryPercent": 94,
    "verifiedCustomerFeedbackCount": 33,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Lower Parel": 18,
      "Bandra": 18,
      "Andheri": 26
    },
    "customerFeedback": [
      {
        "id": "fb-mum-flw-03-1",
        "customerName": "R. Shah",
        "eventType": "Mehendi Celebration",
        "location": "Lower Parel, Mumbai",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-flw-03-2",
        "customerName": "T. Agarwal",
        "eventType": "Mehendi Celebration",
        "location": "Bandra, Mumbai",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-flw-03-3",
        "customerName": "R. Tendulkar",
        "eventType": "Mehendi Celebration",
        "location": "Andheri, Mumbai",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "mum-flw-04",
    "businessName": "Mayura Fresh Botanical Floral Craft",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Borivali",
      "Malad",
      "Goregaon"
    ],
    "category": "Flower Arrangements",
    "secondaryCategories": [],
    "description": "Eco-friendly organic blooms, locally grown Indian blossoms, botanical green walls, and fragrant mogra accessories.",
    "serviceOfferings": [
      "Exotic Floral Mandaps",
      "Bridal Bouquets",
      "Fresh Floral Canopies",
      "Varmala Design",
      "Floral Centerpieces"
    ],
    "maximumSimultaneousBookings": 3,
    "startingPrice": 38000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 15,
    "repeatOrdersArea": {
      "Borivali": 5,
      "Malad": 5,
      "Goregaon": 4
    },
    "referralsArea": {
      "Borivali": 6,
      "Malad": 6,
      "Goregaon": 6
    },
    "repeatOrdersTotal": 14,
    "referralsTotal": 18,
    "portfolioImages": [
      "/assets/flw-1.jpg"
    ],
    "serviceTags": [
      "Eco Florals",
      "Mogra Accents",
      "Botanical Decor",
      "Green Walls"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-flw-04.demo.wedora.in",
    "contactPhone": "+91 98000 0054",
    "averageOrderValue90Days": 165000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 70,
    "successfulReferralBookings": 18,
    "repeatCustomerBookings": 14,
    "onTimeDeliveryPercent": 95,
    "verifiedCustomerFeedbackCount": 32,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Borivali": 18,
      "Malad": 18,
      "Goregaon": 24
    },
    "customerFeedback": [
      {
        "id": "fb-mum-flw-04-1",
        "customerName": "M. Joshi",
        "eventType": "Grand Reception",
        "location": "Borivali, Mumbai",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-mum-flw-04-2",
        "customerName": "H. Trivedi",
        "eventType": "Grand Reception",
        "location": "Malad, Mumbai",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "mum-flw-05",
    "businessName": "Rajlaxmi Floral & Flower Mandaps",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Thane",
      "Navi Mumbai",
      "Mulund"
    ],
    "category": "Flower Arrangements",
    "secondaryCategories": [
      "Decoration Services"
    ],
    "description": "Grand temple style floral mandaps, carnation pillars, rajnigandha drops, and floral stage canopies.",
    "serviceOfferings": [
      "Exotic Floral Mandaps",
      "Bridal Bouquets",
      "Fresh Floral Canopies",
      "Varmala Design",
      "Floral Centerpieces"
    ],
    "maximumSimultaneousBookings": 3,
    "startingPrice": 52000,
    "priceUnit": "per wedding",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 19,
    "repeatOrdersArea": {
      "Thane": 6,
      "Navi Mumbai": 6,
      "Mulund": 6
    },
    "referralsArea": {
      "Thane": 8,
      "Navi Mumbai": 8,
      "Mulund": 7
    },
    "repeatOrdersTotal": 18,
    "referralsTotal": 23,
    "portfolioImages": [
      "/assets/flw-2.jpg"
    ],
    "serviceTags": [
      "Temple Mandap",
      "Rajnigandha Strings",
      "Carnations",
      "Grand Floral Canopy"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-flw-05.demo.wedora.in",
    "contactPhone": "+91 98000 0055",
    "averageOrderValue90Days": 255000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 87,
    "successfulReferralBookings": 23,
    "repeatCustomerBookings": 18,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 41,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Thane": 22,
      "Navi Mumbai": 22,
      "Mulund": 30
    },
    "customerFeedback": [
      {
        "id": "fb-mum-flw-05-1",
        "customerName": "D. Shinde",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Thane, Mumbai",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-flw-05-2",
        "customerName": "S. Singhania",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Navi Mumbai, Mumbai",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-flw-05-3",
        "customerName": "R. Shah",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Mulund, Mumbai",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "mum-fur-01",
    "businessName": "Royal Seating & Banquet Furniture Rentals",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Lower Parel",
      "Andheri",
      "Dadar"
    ],
    "category": "Furniture and Equipment Rental",
    "secondaryCategories": [],
    "description": "Chiavari gold chairs, velvet Maharaja sofas, dining banquet round tables, luxury linens, and VIP lounge setups.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 95000,
    "priceUnit": "per setup",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 18,
    "averageOrderValue90Days": 130000,
    "portfolioImages": [
      "/assets/fur-1.jpg",
      "/assets/fur-2.jpg"
    ],
    "serviceTags": [
      "Gold Chiavari Chairs",
      "Maharaja Thrones",
      "VIP Velvet Lounges"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-fur-01.demo.wedora.in",
    "contactPhone": "+91 98000 0021",
    "serviceOfferings": [
      "Chiavari & Dior Chairs",
      "Royal Sofa Lounges",
      "High Cocktail Tables",
      "German Pagoda Tents",
      "Heavy Gensets"
    ],
    "repeatOrdersArea": {
      "Bandra": 4,
      "Lower Parel": 4,
      "Andheri": 5,
      "Dadar": 4
    },
    "referralsArea": {
      "Bandra": 6,
      "Lower Parel": 6,
      "Andheri": 7,
      "Dadar": 6
    },
    "repeatOrdersTotal": 17,
    "referralsTotal": 25,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 83,
    "successfulReferralBookings": 25,
    "repeatCustomerBookings": 17,
    "onTimeDeliveryPercent": 98,
    "verifiedCustomerFeedbackCount": 39,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Bandra": 16,
      "Lower Parel": 16,
      "Andheri": 16,
      "Dadar": 23
    },
    "customerFeedback": [
      {
        "id": "fb-mum-fur-01-1",
        "customerName": "M. Parekh",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Bandra, Mumbai",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-fur-01-2",
        "customerName": "M. Joshi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Lower Parel, Mumbai",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-fur-01-3",
        "customerName": "H. Trivedi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Andheri, Mumbai",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "mum-fur-02",
    "businessName": "Elite Tentage, German Pagodas & Staging",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Powai",
      "Goregaon",
      "Malad",
      "Borivali"
    ],
    "category": "Furniture and Equipment Rental",
    "secondaryCategories": [],
    "description": "Waterproof German hangar pagodas, air-conditioned dining marquees, heavy duty multi-level stage risers.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 250000,
    "priceUnit": "per setup",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-21": "Available"
    },
    "completedOrders90Days": 12,
    "averageOrderValue90Days": 320000,
    "portfolioImages": [
      "/assets/fur-1.jpg",
      "/assets/fur-2.jpg"
    ],
    "serviceTags": [
      "German Hangars",
      "AC Pagodas",
      "Staging Risers"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-fur-02.demo.wedora.in",
    "contactPhone": "+91 98000 0022",
    "serviceOfferings": [
      "Chiavari & Dior Chairs",
      "Royal Sofa Lounges",
      "High Cocktail Tables",
      "German Pagoda Tents",
      "Heavy Gensets"
    ],
    "repeatOrdersArea": {
      "Powai": 2,
      "Goregaon": 2,
      "Malad": 2,
      "Borivali": 1
    },
    "referralsArea": {
      "Powai": 4,
      "Goregaon": 4,
      "Malad": 5,
      "Borivali": 4
    },
    "repeatOrdersTotal": 7,
    "referralsTotal": 17,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 56,
    "successfulReferralBookings": 17,
    "repeatCustomerBookings": 7,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 27,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Powai": 11,
      "Goregaon": 11,
      "Malad": 11,
      "Borivali": 15
    },
    "customerFeedback": [
      {
        "id": "fb-mum-fur-02-1",
        "customerName": "A. Patil",
        "eventType": "Wedding Ceremony",
        "location": "Powai, Mumbai",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-fur-02-2",
        "customerName": "D. Shinde",
        "eventType": "Wedding Ceremony",
        "location": "Goregaon, Mumbai",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "mum-fur-03",
    "businessName": "Vintage Touch Wooden Prop & Lounge Rentals",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Dadar",
      "Chembur",
      "Ghatkopar",
      "Mulund"
    ],
    "category": "Furniture and Equipment Rental",
    "secondaryCategories": [],
    "description": "Rustic wooden cabanas, vintage brass trunks, antique diwans, cocktail bar counters, and boho wicker swings.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 80000,
    "priceUnit": "per setup",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-17": "Available"
    },
    "completedOrders90Days": 15,
    "averageOrderValue90Days": 105000,
    "portfolioImages": [
      "/assets/fur-1.jpg",
      "/assets/fur-2.jpg"
    ],
    "serviceTags": [
      "Rustic Wooden Cabanas",
      "Bar Counters",
      "Boho Swings"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-fur-03.demo.wedora.in",
    "contactPhone": "+91 98000 0023",
    "serviceOfferings": [
      "Chiavari & Dior Chairs",
      "Royal Sofa Lounges",
      "High Cocktail Tables",
      "German Pagoda Tents",
      "Heavy Gensets"
    ],
    "repeatOrdersArea": {
      "Dadar": 2,
      "Chembur": 2,
      "Ghatkopar": 3,
      "Mulund": 2
    },
    "referralsArea": {
      "Dadar": 6,
      "Chembur": 5,
      "Ghatkopar": 6,
      "Mulund": 5
    },
    "repeatOrdersTotal": 9,
    "referralsTotal": 22,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 69,
    "successfulReferralBookings": 22,
    "repeatCustomerBookings": 9,
    "onTimeDeliveryPercent": 93,
    "verifiedCustomerFeedbackCount": 34,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Dadar": 13,
      "Chembur": 14,
      "Ghatkopar": 13,
      "Mulund": 19
    },
    "customerFeedback": [
      {
        "id": "fb-mum-fur-03-1",
        "customerName": "S. Kulkarni",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Dadar, Mumbai",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-mum-fur-03-2",
        "customerName": "G. Bhosale",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Chembur, Mumbai",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-fur-03-3",
        "customerName": "M. Parekh",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Ghatkopar, Mumbai",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "mum-fur-04",
    "businessName": "ProGear Event Climate & Generator Rentals",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Thane",
      "Navi Mumbai",
      "Powai"
    ],
    "category": "Furniture and Equipment Rental",
    "secondaryCategories": [],
    "description": "Heavy silent diesel generators (125 kVA+), tower air conditioners, outdoor misting fans, and commercial cable trays.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 70000,
    "priceUnit": "per setup",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-24": "Available"
    },
    "completedOrders90Days": 22,
    "averageOrderValue90Days": 85000,
    "portfolioImages": [
      "/assets/fur-1.jpg",
      "/assets/fur-2.jpg"
    ],
    "serviceTags": [
      "Silent Generators",
      "Tower ACs",
      "Outdoor Misting Fans"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-fur-04.demo.wedora.in",
    "contactPhone": "+91 98000 0024",
    "serviceOfferings": [
      "Chiavari & Dior Chairs",
      "Royal Sofa Lounges",
      "High Cocktail Tables",
      "German Pagoda Tents",
      "Heavy Gensets"
    ],
    "repeatOrdersArea": {
      "Thane": 5,
      "Navi Mumbai": 5,
      "Powai": 4
    },
    "referralsArea": {
      "Thane": 7,
      "Navi Mumbai": 8,
      "Powai": 7
    },
    "repeatOrdersTotal": 14,
    "referralsTotal": 22,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 98,
    "successfulReferralBookings": 22,
    "repeatCustomerBookings": 14,
    "onTimeDeliveryPercent": 94,
    "verifiedCustomerFeedbackCount": 31,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Thane": 24,
      "Navi Mumbai": 25,
      "Powai": 34
    },
    "customerFeedback": [
      {
        "id": "fb-mum-fur-04-1",
        "customerName": "V. Mehta",
        "eventType": "Mehendi Celebration",
        "location": "Thane, Mumbai",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-fur-04-2",
        "customerName": "C. Gaikwad",
        "eventType": "Mehendi Celebration",
        "location": "Navi Mumbai, Mumbai",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "mum-fur-05",
    "businessName": "Imperial Velvet & Chiavari Rentals",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Andheri",
      "Bandra",
      "Powai",
      "Borivali"
    ],
    "category": "Furniture and Equipment Rental",
    "secondaryCategories": [],
    "description": "Gold-finish Chiavari chairs, emerald velvet chesterfield lounges, mirror dining tables, bar counter setups, and industrial air coolers.",
    "serviceOfferings": [
      "Chiavari & Dior Chairs",
      "Royal Sofa Lounges",
      "High Cocktail Tables",
      "German Pagoda Tents",
      "Heavy Gensets"
    ],
    "maximumSimultaneousBookings": 4,
    "startingPrice": 32000,
    "priceUnit": "per event rental",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-25": "Available"
    },
    "completedOrders90Days": 17,
    "repeatOrdersArea": {
      "Andheri": 3,
      "Bandra": 3,
      "Powai": 3,
      "Borivali": 2
    },
    "referralsArea": {
      "Andheri": 4,
      "Bandra": 4,
      "Powai": 5,
      "Borivali": 4
    },
    "repeatOrdersTotal": 11,
    "referralsTotal": 17,
    "portfolioImages": [
      "/assets/fur-1.jpg"
    ],
    "serviceTags": [
      "Chiavari Chairs",
      "Chesterfield Lounges",
      "Mirror Tables",
      "Bar Setups"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-fur-05.demo.wedora.in",
    "contactPhone": "+91 98000 0058",
    "averageOrderValue90Days": 270000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 75,
    "successfulReferralBookings": 17,
    "repeatCustomerBookings": 11,
    "onTimeDeliveryPercent": 95,
    "verifiedCustomerFeedbackCount": 25,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Andheri": 15,
      "Bandra": 14,
      "Powai": 15,
      "Borivali": 20
    },
    "customerFeedback": [
      {
        "id": "fb-mum-fur-05-1",
        "customerName": "K. Iyer",
        "eventType": "Grand Reception",
        "location": "Andheri, Mumbai",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-mum-fur-05-2",
        "customerName": "A. Banerjee",
        "eventType": "Grand Reception",
        "location": "Bandra, Mumbai",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-mum-fur-05-3",
        "customerName": "S. Kulkarni",
        "eventType": "Grand Reception",
        "location": "Powai, Mumbai",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "mum-hot-01",
    "businessName": "The Grand Marine Pavilion & Suites",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Lower Parel",
      "Dadar"
    ],
    "category": "Hotels and Guest Accommodation",
    "secondaryCategories": [],
    "description": "5-star luxury boutique hotel offering 120 dedicated guest rooms, sea-facing hospitality suites, and 24/7 wedding concierge.",
    "maximumGuestCapacity": 450,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 9500,
    "priceUnit": "per room/night",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 20,
    "averageOrderValue90Days": 580000,
    "portfolioImages": [
      "/assets/hot-1.jpg",
      "/assets/hot-2.jpg"
    ],
    "serviceTags": [
      "5-Star Luxury",
      "Guest Room Blocks",
      "Wedding Concierge"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-hot-01.demo.wedora.in",
    "contactPhone": "+91 98000 0030",
    "serviceOfferings": [
      "Deluxe Guest Rooms",
      "Welcome Hospitality Desk",
      "Luggage Assistance",
      "Breakfast Buffet Included",
      "Airport/Station Transfers"
    ],
    "repeatOrdersArea": {
      "Bandra": 6,
      "Lower Parel": 6,
      "Dadar": 5
    },
    "referralsArea": {
      "Bandra": 9,
      "Lower Parel": 9,
      "Dadar": 9
    },
    "repeatOrdersTotal": 17,
    "referralsTotal": 27,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 89,
    "successfulReferralBookings": 27,
    "repeatCustomerBookings": 17,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 35,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Bandra": 22,
      "Lower Parel": 23,
      "Dadar": 31
    },
    "customerFeedback": [
      {
        "id": "fb-mum-hot-01-1",
        "customerName": "H. Trivedi",
        "eventType": "Mehendi Celebration",
        "location": "Bandra, Mumbai",
        "comment": "Stunning banquet hall with high ceilings and regal chandeliers. Guest parking and security staff were well organized. Restroom checks needed an extra reminder halfway through the reception.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-hot-01-2",
        "customerName": "V. Kadam",
        "eventType": "Mehendi Celebration",
        "location": "Lower Parel, Mumbai",
        "comment": "Wonderful venue ambiance with convenient proximity to the highway. Accommodated our vendors for setup effortlessly. Service entrance was busy during overlapping vendor load-ins.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-hot-01-3",
        "customerName": "N. Nair",
        "eventType": "Mehendi Celebration",
        "location": "Dadar, Mumbai",
        "comment": "Expansive lush green lawn, pristine air-conditioned bridal suites, and seamless valet management for 600+ guests. Acoustic sound restrictions required lowering music volume slightly past 10 PM in the open section.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "mum-hot-02",
    "businessName": "Regal Palms Luxury Suites & Banquets",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Powai",
      "Andheri"
    ],
    "category": "Hotels and Guest Accommodation",
    "secondaryCategories": [],
    "description": "Premium business-class hotel with 90 spacious rooms, attached pre-wedding halls, airport shuttles, and breakfast buffets.",
    "maximumGuestCapacity": 350,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 7200,
    "priceUnit": "per room/night",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available"
    },
    "completedOrders90Days": 22,
    "averageOrderValue90Days": 410000,
    "portfolioImages": [
      "/assets/hot-1.jpg",
      "/assets/hot-2.jpg"
    ],
    "serviceTags": [
      "Airport Shuttles",
      "Buffet Breakfast Included",
      "Spacious Rooms"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-hot-02.demo.wedora.in",
    "contactPhone": "+91 98000 0031",
    "serviceOfferings": [
      "Deluxe Guest Rooms",
      "Welcome Hospitality Desk",
      "Luggage Assistance",
      "Breakfast Buffet Included",
      "Airport/Station Transfers"
    ],
    "repeatOrdersArea": {
      "Powai": 10,
      "Andheri": 10
    },
    "referralsArea": {
      "Powai": 16,
      "Andheri": 16
    },
    "repeatOrdersTotal": 20,
    "referralsTotal": 32,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 102,
    "successfulReferralBookings": 32,
    "repeatCustomerBookings": 20,
    "onTimeDeliveryPercent": 97,
    "verifiedCustomerFeedbackCount": 41,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Powai": 36,
      "Andheri": 51
    },
    "customerFeedback": [
      {
        "id": "fb-mum-hot-02-1",
        "customerName": "S. Singhania",
        "eventType": "Grand Reception",
        "location": "Powai, Mumbai",
        "comment": "Wonderful venue ambiance with convenient proximity to the highway. Accommodated our vendors for setup effortlessly. Service entrance was busy during overlapping vendor load-ins.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-mum-hot-02-2",
        "customerName": "R. Shah",
        "eventType": "Grand Reception",
        "location": "Andheri, Mumbai",
        "comment": "Expansive lush green lawn, pristine air-conditioned bridal suites, and seamless valet management for 600+ guests. Acoustic sound restrictions required lowering music volume slightly past 10 PM in the open section.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "mum-hot-03",
    "businessName": "Horizon Bay Boutique Residency",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Andheri",
      "Malad",
      "Goregaon",
      "Borivali"
    ],
    "category": "Hotels and Guest Accommodation",
    "secondaryCategories": [],
    "description": "Comfortable wedding guest residency with 60 family suites, private elevators, and central location for Western suburbs.",
    "maximumGuestCapacity": 250,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 5500,
    "priceUnit": "per room/night",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-21": "Available"
    },
    "completedOrders90Days": 18,
    "averageOrderValue90Days": 290000,
    "portfolioImages": [
      "/assets/hot-1.jpg",
      "/assets/hot-2.jpg"
    ],
    "serviceTags": [
      "Family Suites",
      "Western Suburbs Central",
      "Private Elevators"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-hot-03.demo.wedora.in",
    "contactPhone": "+91 98000 0032",
    "serviceOfferings": [
      "Deluxe Guest Rooms",
      "Welcome Hospitality Desk",
      "Luggage Assistance",
      "Breakfast Buffet Included",
      "Airport/Station Transfers"
    ],
    "repeatOrdersArea": {
      "Andheri": 4,
      "Malad": 4,
      "Goregaon": 5,
      "Borivali": 4
    },
    "referralsArea": {
      "Andheri": 7,
      "Malad": 7,
      "Goregaon": 7,
      "Borivali": 6
    },
    "repeatOrdersTotal": 17,
    "referralsTotal": 27,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 83,
    "successfulReferralBookings": 27,
    "repeatCustomerBookings": 17,
    "onTimeDeliveryPercent": 98,
    "verifiedCustomerFeedbackCount": 34,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Andheri": 16,
      "Malad": 16,
      "Goregaon": 16,
      "Borivali": 23
    },
    "customerFeedback": [
      {
        "id": "fb-mum-hot-03-1",
        "customerName": "M. Parekh",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Andheri, Mumbai",
        "comment": "Expansive lush green lawn, pristine air-conditioned bridal suites, and seamless valet management for 600+ guests. Acoustic sound restrictions required lowering music volume slightly past 10 PM in the open section.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-hot-03-2",
        "customerName": "M. Joshi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Malad, Mumbai",
        "comment": "Stunning banquet hall with high ceilings and regal chandeliers. Guest parking and security staff were well organized. Restroom checks needed an extra reminder halfway through the reception.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-hot-03-3",
        "customerName": "H. Trivedi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Goregaon, Mumbai",
        "comment": "Wonderful venue ambiance with convenient proximity to the highway. Accommodated our vendors for setup effortlessly. Service entrance was busy during overlapping vendor load-ins.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "mum-hot-04",
    "businessName": "Thane Creekview Hotel & Guest Lodge",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Thane",
      "Mulund",
      "Navi Mumbai",
      "Chembur"
    ],
    "category": "Hotels and Guest Accommodation",
    "secondaryCategories": [],
    "description": "Modern hotel with 80 well-appointed rooms, banquet facilities, and seamless highway access for out-of-town wedding guests.",
    "maximumGuestCapacity": 300,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 4800,
    "priceUnit": "per room/night",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 21,
    "averageOrderValue90Days": 260000,
    "portfolioImages": [
      "/assets/hot-1.jpg",
      "/assets/hot-2.jpg"
    ],
    "serviceTags": [
      "Highway Accessibility",
      "Modern Amenities",
      "Banquet Attached"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-hot-04.demo.wedora.in",
    "contactPhone": "+91 98000 0033",
    "serviceOfferings": [
      "Deluxe Guest Rooms",
      "Welcome Hospitality Desk",
      "Luggage Assistance",
      "Breakfast Buffet Included",
      "Airport/Station Transfers"
    ],
    "repeatOrdersArea": {
      "Thane": 3,
      "Mulund": 3,
      "Navi Mumbai": 3,
      "Chembur": 3
    },
    "referralsArea": {
      "Thane": 5,
      "Mulund": 5,
      "Navi Mumbai": 6,
      "Chembur": 5
    },
    "repeatOrdersTotal": 12,
    "referralsTotal": 21,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 96,
    "successfulReferralBookings": 21,
    "repeatCustomerBookings": 12,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 40,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Thane": 19,
      "Mulund": 19,
      "Navi Mumbai": 18,
      "Chembur": 26
    },
    "customerFeedback": [
      {
        "id": "fb-mum-hot-04-1",
        "customerName": "A. Patil",
        "eventType": "Wedding Ceremony",
        "location": "Thane, Mumbai",
        "comment": "Stunning banquet hall with high ceilings and regal chandeliers. Guest parking and security staff were well organized. Restroom checks needed an extra reminder halfway through the reception.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-hot-04-2",
        "customerName": "D. Shinde",
        "eventType": "Wedding Ceremony",
        "location": "Mulund, Mumbai",
        "comment": "Wonderful venue ambiance with convenient proximity to the highway. Accommodated our vendors for setup effortlessly. Service entrance was busy during overlapping vendor load-ins.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "mum-hot-05",
    "businessName": "The Sapphire Bay Waterfront Hotel & Suites",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Lower Parel"
    ],
    "category": "Hotels and Guest Accommodation",
    "secondaryCategories": [
      "Wedding Lawns and Venues"
    ],
    "description": "Luxury ocean-view rooms for wedding party guests, dedicated hospitality suites, welcome champagne breakfasts, and group concierge.",
    "serviceOfferings": [
      "Deluxe Guest Rooms",
      "Welcome Hospitality Desk",
      "Luggage Assistance",
      "Breakfast Buffet Included",
      "Airport/Station Transfers"
    ],
    "maximumGuestCapacity": 450,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 9500,
    "priceUnit": "per room/night",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 17,
    "repeatOrdersArea": {
      "Bandra": 5,
      "Lower Parel": 5
    },
    "referralsArea": {
      "Bandra": 9,
      "Lower Parel": 9
    },
    "repeatOrdersTotal": 10,
    "referralsTotal": 18,
    "portfolioImages": [
      "/assets/hot-1.jpg"
    ],
    "serviceTags": [
      "Ocean View Suites",
      "Hospitality Floor",
      "Wedding Room Blocks",
      "Valet"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-hot-05.demo.wedora.in",
    "contactPhone": "+91 98000 0059",
    "averageOrderValue90Days": 195000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 77,
    "successfulReferralBookings": 18,
    "repeatCustomerBookings": 10,
    "onTimeDeliveryPercent": 93,
    "verifiedCustomerFeedbackCount": 33,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Bandra": 27,
      "Lower Parel": 38
    },
    "customerFeedback": [
      {
        "id": "fb-mum-hot-05-1",
        "customerName": "S. Kulkarni",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Bandra, Mumbai",
        "comment": "Wonderful venue ambiance with convenient proximity to the highway. Accommodated our vendors for setup effortlessly. Service entrance was busy during overlapping vendor load-ins.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-mum-hot-05-2",
        "customerName": "G. Bhosale",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Lower Parel, Mumbai",
        "comment": "Expansive lush green lawn, pristine air-conditioned bridal suites, and seamless valet management for 600+ guests. Acoustic sound restrictions required lowering music volume slightly past 10 PM in the open section.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-hot-05-3",
        "customerName": "M. Parekh",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Bandra, Mumbai",
        "comment": "Stunning banquet hall with high ceilings and regal chandeliers. Guest parking and security staff were well organized. Restroom checks needed an extra reminder halfway through the reception.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "mum-lig-01",
    "businessName": "Lumina Grand Architectural Lighting",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Lower Parel",
      "Dadar",
      "Andheri"
    ],
    "category": "Lighting Services",
    "secondaryCategories": [],
    "description": "Intelligent beam moving heads, venue facade architectural projection mapping, and computerized sangeet light shows.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 150000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 20,
    "averageOrderValue90Days": 195000,
    "portfolioImages": [
      "/assets/lig-1.jpg",
      "/assets/lig-2.jpg"
    ],
    "serviceTags": [
      "Projection Mapping",
      "Moving Heads",
      "Facade Uplighting"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-lig-01.demo.wedora.in",
    "contactPhone": "+91 98000 0013",
    "serviceOfferings": [
      "Architectural Illumination",
      "Intelligent Moving Heads",
      "Truss Lighting",
      "LED Wall Backgrounds",
      "Warm String Fairylights"
    ],
    "repeatOrdersArea": {
      "Bandra": 3,
      "Lower Parel": 3,
      "Dadar": 4,
      "Andheri": 3
    },
    "referralsArea": {
      "Bandra": 7,
      "Lower Parel": 7,
      "Dadar": 8,
      "Andheri": 7
    },
    "repeatOrdersTotal": 13,
    "referralsTotal": 29,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 92,
    "successfulReferralBookings": 29,
    "repeatCustomerBookings": 13,
    "onTimeDeliveryPercent": 98,
    "verifiedCustomerFeedbackCount": 44,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Bandra": 18,
      "Lower Parel": 18,
      "Dadar": 18,
      "Andheri": 24
    },
    "customerFeedback": [
      {
        "id": "fb-mum-lig-01-1",
        "customerName": "A. Banerjee",
        "eventType": "Mehendi Celebration",
        "location": "Bandra, Mumbai",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-lig-01-2",
        "customerName": "S. Kulkarni",
        "eventType": "Mehendi Celebration",
        "location": "Lower Parel, Mumbai",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "mum-lig-02",
    "businessName": "Golden Glow Fairy Lights & Ambience",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Powai",
      "Goregaon",
      "Malad",
      "Borivali"
    ],
    "category": "Lighting Services",
    "secondaryCategories": [],
    "description": "Warm fairy light tunnels, vintage Edison bulbs, starry night ceilings, and romantic ambient garden illumination.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 90000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-17": "Available"
    },
    "completedOrders90Days": 23,
    "averageOrderValue90Days": 115000,
    "portfolioImages": [
      "/assets/lig-1.jpg",
      "/assets/lig-2.jpg"
    ],
    "serviceTags": [
      "Fairy Lights",
      "Edison Bulbs",
      "Warm Ambience"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-lig-02.demo.wedora.in",
    "contactPhone": "+91 98000 0014",
    "serviceOfferings": [
      "Architectural Illumination",
      "Intelligent Moving Heads",
      "Truss Lighting",
      "LED Wall Backgrounds",
      "Warm String Fairylights"
    ],
    "repeatOrdersArea": {
      "Powai": 4,
      "Goregaon": 4,
      "Malad": 4,
      "Borivali": 4
    },
    "referralsArea": {
      "Powai": 9,
      "Goregaon": 8,
      "Malad": 9,
      "Borivali": 8
    },
    "repeatOrdersTotal": 16,
    "referralsTotal": 34,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 105,
    "successfulReferralBookings": 34,
    "repeatCustomerBookings": 16,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 51,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Powai": 20,
      "Goregaon": 20,
      "Malad": 20,
      "Borivali": 29
    },
    "customerFeedback": [
      {
        "id": "fb-mum-lig-02-1",
        "customerName": "S. More",
        "eventType": "Grand Reception",
        "location": "Powai, Mumbai",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-mum-lig-02-2",
        "customerName": "V. Mehta",
        "eventType": "Grand Reception",
        "location": "Goregaon, Mumbai",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-mum-lig-02-3",
        "customerName": "C. Gaikwad",
        "eventType": "Grand Reception",
        "location": "Malad, Mumbai",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "mum-lig-03",
    "businessName": "Illuminati Wedding Beam & Truss Production",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Thane",
      "Navi Mumbai",
      "Chembur",
      "Mulund"
    ],
    "category": "Lighting Services",
    "secondaryCategories": [],
    "description": "Heavy-duty concert aluminum trussing, follow spots, haze/cold pyro FX, and programmable stage LED matrices.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 180000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-22": "Available"
    },
    "completedOrders90Days": 17,
    "averageOrderValue90Days": 210000,
    "portfolioImages": [
      "/assets/lig-1.jpg",
      "/assets/lig-2.jpg"
    ],
    "serviceTags": [
      "Aluminum Trusses",
      "Stage Lighting",
      "Cold Pyro FX"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-lig-03.demo.wedora.in",
    "contactPhone": "+91 98000 0015",
    "serviceOfferings": [
      "Architectural Illumination",
      "Intelligent Moving Heads",
      "Truss Lighting",
      "LED Wall Backgrounds",
      "Warm String Fairylights"
    ],
    "repeatOrdersArea": {
      "Thane": 3,
      "Navi Mumbai": 3,
      "Chembur": 3,
      "Mulund": 3
    },
    "referralsArea": {
      "Thane": 4,
      "Navi Mumbai": 4,
      "Chembur": 5,
      "Mulund": 4
    },
    "repeatOrdersTotal": 12,
    "referralsTotal": 17,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 78,
    "successfulReferralBookings": 17,
    "repeatCustomerBookings": 12,
    "onTimeDeliveryPercent": 93,
    "verifiedCustomerFeedbackCount": 25,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Thane": 15,
      "Navi Mumbai": 15,
      "Chembur": 15,
      "Mulund": 21
    },
    "customerFeedback": [
      {
        "id": "fb-mum-lig-03-1",
        "customerName": "P. Deshmukh",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Thane, Mumbai",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-lig-03-2",
        "customerName": "K. Iyer",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Navi Mumbai, Mumbai",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "mum-lig-04",
    "businessName": "Radiance Luxe Event Illumination",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Lower Parel",
      "Bandra",
      "Dadar"
    ],
    "category": "Lighting Services",
    "secondaryCategories": [],
    "description": "High-end battery wireless uplighting, pin spots for dining tables, and bespoke crystal chandelier rigging.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 210000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-23": "Available"
    },
    "completedOrders90Days": 17,
    "averageOrderValue90Days": 245000,
    "portfolioImages": [
      "/assets/lig-1.jpg",
      "/assets/lig-2.jpg"
    ],
    "serviceTags": [
      "Wireless Uplighting",
      "Pinspots",
      "Chandelier Rigging"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-lig-04.demo.wedora.in",
    "contactPhone": "+91 98000 0016",
    "serviceOfferings": [
      "Architectural Illumination",
      "Intelligent Moving Heads",
      "Truss Lighting",
      "LED Wall Backgrounds",
      "Warm String Fairylights"
    ],
    "repeatOrdersArea": {
      "Lower Parel": 4,
      "Bandra": 5,
      "Dadar": 4
    },
    "referralsArea": {
      "Lower Parel": 6,
      "Bandra": 6,
      "Dadar": 6
    },
    "repeatOrdersTotal": 13,
    "referralsTotal": 18,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 79,
    "successfulReferralBookings": 18,
    "repeatCustomerBookings": 13,
    "onTimeDeliveryPercent": 94,
    "verifiedCustomerFeedbackCount": 26,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 96,
    "completedOrdersArea": {
      "Lower Parel": 20,
      "Bandra": 20,
      "Dadar": 27
    },
    "customerFeedback": [
      {
        "id": "fb-mum-lig-04-1",
        "customerName": "N. Nair",
        "eventType": "Wedding Ceremony",
        "location": "Lower Parel, Mumbai",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-lig-04-2",
        "customerName": "B. Chavan",
        "eventType": "Wedding Ceremony",
        "location": "Bandra, Mumbai",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-mum-lig-04-3",
        "customerName": "S. More",
        "eventType": "Wedding Ceremony",
        "location": "Dadar, Mumbai",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "mum-lig-05",
    "businessName": "Starlight Intelligent Event Illumination",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Andheri",
      "Bandra",
      "Goregaon",
      "Powai"
    ],
    "category": "Lighting Services",
    "secondaryCategories": [
      "DJ and Sound Systems"
    ],
    "description": "Computer-controlled beam moving heads, warm Edison bulb installations, dynamic architectural wash, and laser lighting shows.",
    "serviceOfferings": [
      "Architectural Illumination",
      "Intelligent Moving Heads",
      "Truss Lighting",
      "LED Wall Backgrounds",
      "Warm String Fairylights"
    ],
    "maximumSimultaneousBookings": 3,
    "startingPrice": 42000,
    "priceUnit": "per setup",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-25": "Available"
    },
    "completedOrders90Days": 24,
    "repeatOrdersArea": {
      "Andheri": 5,
      "Bandra": 5,
      "Goregaon": 5,
      "Powai": 4
    },
    "referralsArea": {
      "Andheri": 7,
      "Bandra": 6,
      "Goregaon": 7,
      "Powai": 6
    },
    "repeatOrdersTotal": 19,
    "referralsTotal": 26,
    "portfolioImages": [
      "/assets/lig-1.jpg"
    ],
    "serviceTags": [
      "Intelligent Lighting",
      "Edison Bulbs",
      "Architectural Wash",
      "Laser Shows"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-lig-05.demo.wedora.in",
    "contactPhone": "+91 98000 0056",
    "averageOrderValue90Days": 300000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 108,
    "successfulReferralBookings": 26,
    "repeatCustomerBookings": 19,
    "onTimeDeliveryPercent": 95,
    "verifiedCustomerFeedbackCount": 37,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Andheri": 21,
      "Bandra": 21,
      "Goregaon": 21,
      "Powai": 29
    },
    "customerFeedback": [
      {
        "id": "fb-mum-lig-05-1",
        "customerName": "T. Agarwal",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Andheri, Mumbai",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-mum-lig-05-2",
        "customerName": "R. Tendulkar",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Bandra, Mumbai",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "mum-log-01",
    "businessName": "Royal Chariots Luxury Wedding Fleets",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Lower Parel",
      "Andheri",
      "Powai",
      "Dadar"
    ],
    "category": "Logistics and Transportation",
    "secondaryCategories": [],
    "description": "Vintage luxury bridal cars (Rolls Royce, Mercedes S-Class, open vintage convertibles), baraat buggies, and decorated groom rides.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 65000,
    "priceUnit": "per fleet day",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available"
    },
    "completedOrders90Days": 26,
    "averageOrderValue90Days": 95000,
    "portfolioImages": [
      "/assets/log-1.jpg",
      "/assets/log-2.jpg"
    ],
    "serviceTags": [
      "Vintage Convertibles",
      "Mercedes S-Class",
      "Baraat Buggy"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-log-01.demo.wedora.in",
    "contactPhone": "+91 98000 0046",
    "serviceOfferings": [
      "Luxury Bridal Fleet",
      "AC Coaches for Guests",
      "Dedicated Airport Shuttles",
      "Chauffeur Coordination",
      "Real-Time Dispatch"
    ],
    "repeatOrdersArea": {
      "Bandra": 5,
      "Lower Parel": 5,
      "Andheri": 5,
      "Powai": 5,
      "Dadar": 4
    },
    "referralsArea": {
      "Bandra": 7,
      "Lower Parel": 7,
      "Andheri": 7,
      "Powai": 7,
      "Dadar": 6
    },
    "repeatOrdersTotal": 24,
    "referralsTotal": 34,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 120,
    "successfulReferralBookings": 34,
    "repeatCustomerBookings": 24,
    "onTimeDeliveryPercent": 94,
    "verifiedCustomerFeedbackCount": 43,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Bandra": 19,
      "Lower Parel": 19,
      "Andheri": 19,
      "Powai": 19,
      "Dadar": 26
    },
    "customerFeedback": [
      {
        "id": "fb-mum-log-01-1",
        "customerName": "S. Singhania",
        "eventType": "Grand Reception",
        "location": "Bandra, Mumbai",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-mum-log-01-2",
        "customerName": "R. Shah",
        "eventType": "Grand Reception",
        "location": "Lower Parel, Mumbai",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "mum-log-02",
    "businessName": "CityLink Guest Coaches & Airport Shuttles",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Thane",
      "Navi Mumbai",
      "Chembur",
      "Borivali",
      "Goregaon"
    ],
    "category": "Logistics and Transportation",
    "secondaryCategories": [],
    "description": "AC Volvo & luxury mini-bus wedding fleets for guest airport pick-ups, inter-venue shuttles, and luggage transport.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 50000,
    "priceUnit": "per fleet day",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 33,
    "averageOrderValue90Days": 75000,
    "portfolioImages": [
      "/assets/log-1.jpg",
      "/assets/log-2.jpg"
    ],
    "serviceTags": [
      "Volvo AC Coaches",
      "Airport Transfers",
      "Inter-venue Shuttles"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-log-02.demo.wedora.in",
    "contactPhone": "+91 98000 0047",
    "serviceOfferings": [
      "Luxury Bridal Fleet",
      "AC Coaches for Guests",
      "Dedicated Airport Shuttles",
      "Chauffeur Coordination",
      "Real-Time Dispatch"
    ],
    "repeatOrdersArea": {
      "Thane": 6,
      "Navi Mumbai": 6,
      "Chembur": 6,
      "Borivali": 7,
      "Goregaon": 6
    },
    "referralsArea": {
      "Thane": 9,
      "Navi Mumbai": 9,
      "Chembur": 8,
      "Borivali": 9,
      "Goregaon": 8
    },
    "repeatOrdersTotal": 31,
    "referralsTotal": 43,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 149,
    "successfulReferralBookings": 43,
    "repeatCustomerBookings": 31,
    "onTimeDeliveryPercent": 95,
    "verifiedCustomerFeedbackCount": 55,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Thane": 24,
      "Navi Mumbai": 23,
      "Chembur": 24,
      "Borivali": 23,
      "Goregaon": 33
    },
    "customerFeedback": [
      {
        "id": "fb-mum-log-02-1",
        "customerName": "M. Parekh",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Thane, Mumbai",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-log-02-2",
        "customerName": "M. Joshi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Navi Mumbai, Mumbai",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-log-02-3",
        "customerName": "H. Trivedi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Chembur, Mumbai",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "mum-log-03",
    "businessName": "Royal Wheels Mumbai Luxury Wedding Chauffeurs",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Andheri",
      "Lower Parel",
      "Powai"
    ],
    "category": "Logistics and Transportation",
    "secondaryCategories": [],
    "description": "Mercedes Maybach and vintage Rolls Royce bridal entry cars, uniformed chauffeurs, red carpet boarding, and GPS tracked convoy.",
    "serviceOfferings": [
      "Luxury Bridal Fleet",
      "AC Coaches for Guests",
      "Dedicated Airport Shuttles",
      "Chauffeur Coordination",
      "Real-Time Dispatch"
    ],
    "maximumSimultaneousBookings": 4,
    "startingPrice": 45000,
    "priceUnit": "per bridal car day",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 27,
    "repeatOrdersArea": {
      "Bandra": 4,
      "Andheri": 4,
      "Lower Parel": 4,
      "Powai": 3
    },
    "referralsArea": {
      "Bandra": 9,
      "Andheri": 9,
      "Lower Parel": 10,
      "Powai": 9
    },
    "repeatOrdersTotal": 15,
    "referralsTotal": 37,
    "portfolioImages": [
      "/assets/log-1.jpg"
    ],
    "serviceTags": [
      "Vintage Cars",
      "Maybach Bridal Entry",
      "Uniformed Chauffeurs",
      "GPS Convoy"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-log-03.demo.wedora.in",
    "contactPhone": "+91 98000 0063",
    "averageOrderValue90Days": 345000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 122,
    "successfulReferralBookings": 37,
    "repeatCustomerBookings": 15,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 46,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Bandra": 24,
      "Andheri": 24,
      "Lower Parel": 23,
      "Powai": 33
    },
    "customerFeedback": [
      {
        "id": "fb-mum-log-03-1",
        "customerName": "A. Patil",
        "eventType": "Wedding Ceremony",
        "location": "Bandra, Mumbai",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-log-03-2",
        "customerName": "D. Shinde",
        "eventType": "Wedding Ceremony",
        "location": "Andheri, Mumbai",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "mum-log-04",
    "businessName": "Metro Shuttles & Guest Fleet Mumbai",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Dadar",
      "Chembur",
      "Ghatkopar",
      "Thane",
      "Navi Mumbai"
    ],
    "category": "Logistics and Transportation",
    "secondaryCategories": [],
    "description": "Fleet of 35-seater luxury AC Volvo coaches, airport arrival meet-and-greet, hotel-to-venue transfers, and real-time dispatcher dispatch.",
    "serviceOfferings": [
      "Luxury Bridal Fleet",
      "AC Coaches for Guests",
      "Dedicated Airport Shuttles",
      "Chauffeur Coordination",
      "Real-Time Dispatch"
    ],
    "maximumSimultaneousBookings": 5,
    "startingPrice": 28000,
    "priceUnit": "per coach day",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-25": "Available"
    },
    "completedOrders90Days": 33,
    "repeatOrdersArea": {
      "Dadar": 4,
      "Chembur": 4,
      "Ghatkopar": 4,
      "Thane": 4,
      "Navi Mumbai": 4
    },
    "referralsArea": {
      "Dadar": 9,
      "Chembur": 10,
      "Ghatkopar": 9,
      "Thane": 10,
      "Navi Mumbai": 9
    },
    "repeatOrdersTotal": 20,
    "referralsTotal": 47,
    "portfolioImages": [
      "/assets/log-2.jpg"
    ],
    "serviceTags": [
      "Volvo AC Coaches",
      "Airport Meet & Greet",
      "Guest Shuttles",
      "Dispatcher Desk"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-log-04.demo.wedora.in",
    "contactPhone": "+91 98000 0064",
    "averageOrderValue90Days": 465000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 151,
    "successfulReferralBookings": 47,
    "repeatCustomerBookings": 20,
    "onTimeDeliveryPercent": 97,
    "verifiedCustomerFeedbackCount": 59,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Dadar": 24,
      "Chembur": 24,
      "Ghatkopar": 24,
      "Thane": 23,
      "Navi Mumbai": 33
    },
    "customerFeedback": [
      {
        "id": "fb-mum-log-04-1",
        "customerName": "S. Kulkarni",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Dadar, Mumbai",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-mum-log-04-2",
        "customerName": "G. Bhosale",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Chembur, Mumbai",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-log-04-3",
        "customerName": "M. Parekh",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Ghatkopar, Mumbai",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "mum-log-05",
    "businessName": "Express Wedding Logistics & Luggage Transit",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Borivali",
      "Malad",
      "Goregaon",
      "Andheri"
    ],
    "category": "Logistics and Transportation",
    "secondaryCategories": [],
    "description": "Wedding gifts, trousseau hampers, heavy equipment luggage transit vans, and multi-venue courier logistics team.",
    "serviceOfferings": [
      "Luxury Bridal Fleet",
      "AC Coaches for Guests",
      "Dedicated Airport Shuttles",
      "Chauffeur Coordination",
      "Real-Time Dispatch"
    ],
    "maximumSimultaneousBookings": 4,
    "startingPrice": 18000,
    "priceUnit": "per day service",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 23,
    "repeatOrdersArea": {
      "Borivali": 4,
      "Malad": 4,
      "Goregaon": 4,
      "Andheri": 3
    },
    "referralsArea": {
      "Borivali": 8,
      "Malad": 8,
      "Goregaon": 9,
      "Andheri": 8
    },
    "repeatOrdersTotal": 15,
    "referralsTotal": 33,
    "portfolioImages": [
      "/assets/log-1.jpg"
    ],
    "serviceTags": [
      "Trousseau Transit",
      "Hamper Delivery",
      "Equipment Logistics",
      "Multi-Venue Van"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-log-05.demo.wedora.in",
    "contactPhone": "+91 98000 0065",
    "averageOrderValue90Days": 255000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 104,
    "successfulReferralBookings": 33,
    "repeatCustomerBookings": 15,
    "onTimeDeliveryPercent": 98,
    "verifiedCustomerFeedbackCount": 42,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Borivali": 20,
      "Malad": 20,
      "Goregaon": 20,
      "Andheri": 28
    },
    "customerFeedback": [
      {
        "id": "fb-mum-log-05-1",
        "customerName": "V. Mehta",
        "eventType": "Mehendi Celebration",
        "location": "Borivali, Mumbai",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-log-05-2",
        "customerName": "C. Gaikwad",
        "eventType": "Mehendi Celebration",
        "location": "Malad, Mumbai",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "mum-mak-01",
    "businessName": "Glitz & Glamour Bridal Makeovers",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Lower Parel",
      "Andheri",
      "Powai"
    ],
    "category": "Makeup and Mehendi Artists",
    "secondaryCategories": [],
    "description": "Celebrity bridal makeup artist specializing in HD airbrush makeup, hair styling, saree draping, and pre-wedding skin prep.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 45000,
    "priceUnit": "per bridal package",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-17": "Available"
    },
    "completedOrders90Days": 35,
    "averageOrderValue90Days": 65000,
    "portfolioImages": [
      "/assets/mak-1.jpg",
      "/assets/mak-2.jpg"
    ],
    "serviceTags": [
      "HD Airbrush",
      "Bridal Draping",
      "Celebrity Stylist"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-mak-01.demo.wedora.in",
    "contactPhone": "+91 98000 0048",
    "serviceOfferings": [
      "Airbrush HD Bridal Makeup",
      "Hair Styling & Saree Draping",
      "Organic Rajasthani Mehendi",
      "Guest Mehendi Artists",
      "Pre-Bridal Grooming"
    ],
    "repeatOrdersArea": {
      "Bandra": 9,
      "Lower Parel": 8,
      "Andheri": 9,
      "Powai": 8
    },
    "referralsArea": {
      "Bandra": 11,
      "Lower Parel": 10,
      "Andheri": 11,
      "Powai": 10
    },
    "repeatOrdersTotal": 34,
    "referralsTotal": 42,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 161,
    "successfulReferralBookings": 42,
    "repeatCustomerBookings": 34,
    "onTimeDeliveryPercent": 95,
    "verifiedCustomerFeedbackCount": 72,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Bandra": 31,
      "Lower Parel": 31,
      "Andheri": 31,
      "Powai": 44
    },
    "customerFeedback": [
      {
        "id": "fb-mum-mak-01-1",
        "customerName": "M. Parekh",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Bandra, Mumbai",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-mak-01-2",
        "customerName": "M. Joshi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Lower Parel, Mumbai",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-mak-01-3",
        "customerName": "H. Trivedi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Andheri, Mumbai",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "mum-mak-02",
    "businessName": "Rangoli Bridal Mehendi Artists",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Dadar",
      "Ghatkopar",
      "Borivali",
      "Thane",
      "Mulund"
    ],
    "category": "Makeup and Mehendi Artists",
    "secondaryCategories": [],
    "description": "Master Rajasthani and Marwari bridal mehendi, portrait henna art, organic dark stain henna paste, and guest mehendi teams.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 25000,
    "priceUnit": "per bridal package",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available"
    },
    "completedOrders90Days": 40,
    "averageOrderValue90Days": 38000,
    "portfolioImages": [
      "/assets/mak-1.jpg",
      "/assets/mak-2.jpg"
    ],
    "serviceTags": [
      "Rajasthani Bridal Mehendi",
      "Organic Dark Stain",
      "Portrait Henna"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-mak-02.demo.wedora.in",
    "contactPhone": "+91 98000 0049",
    "serviceOfferings": [
      "Airbrush HD Bridal Makeup",
      "Hair Styling & Saree Draping",
      "Organic Rajasthani Mehendi",
      "Guest Mehendi Artists",
      "Pre-Bridal Grooming"
    ],
    "repeatOrdersArea": {
      "Dadar": 4,
      "Ghatkopar": 5,
      "Borivali": 4,
      "Thane": 5,
      "Mulund": 4
    },
    "referralsArea": {
      "Dadar": 10,
      "Ghatkopar": 10,
      "Borivali": 10,
      "Thane": 10,
      "Mulund": 9
    },
    "repeatOrdersTotal": 22,
    "referralsTotal": 49,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 182,
    "successfulReferralBookings": 49,
    "repeatCustomerBookings": 22,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 84,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Dadar": 29,
      "Ghatkopar": 29,
      "Borivali": 29,
      "Thane": 28,
      "Mulund": 40
    },
    "customerFeedback": [
      {
        "id": "fb-mum-mak-02-1",
        "customerName": "A. Patil",
        "eventType": "Wedding Ceremony",
        "location": "Dadar, Mumbai",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-mak-02-2",
        "customerName": "D. Shinde",
        "eventType": "Wedding Ceremony",
        "location": "Ghatkopar, Mumbai",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "mum-mak-03",
    "businessName": "Glamour Glow HD Bridal Makeup Studio",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Lower Parel",
      "Andheri"
    ],
    "category": "Makeup and Mehendi Artists",
    "secondaryCategories": [],
    "description": "International MAC & Charlotte Tilbury HD bridal makeover, glass skin finish, bespoke hair styling, and saree draping stylist.",
    "serviceOfferings": [
      "Airbrush HD Bridal Makeup",
      "Hair Styling & Saree Draping",
      "Organic Rajasthani Mehendi",
      "Guest Mehendi Artists",
      "Pre-Bridal Grooming"
    ],
    "maximumSimultaneousBookings": 2,
    "startingPrice": 35000,
    "priceUnit": "per bridal look",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 30,
    "repeatOrdersArea": {
      "Bandra": 6,
      "Lower Parel": 6,
      "Andheri": 6
    },
    "referralsArea": {
      "Bandra": 13,
      "Lower Parel": 13,
      "Andheri": 12
    },
    "repeatOrdersTotal": 18,
    "referralsTotal": 38,
    "portfolioImages": [
      "/assets/mak-1.jpg"
    ],
    "serviceTags": [
      "HD Bridal Makeup",
      "Glass Skin Finish",
      "Hair Sculpting",
      "Saree Draping"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-mak-03.demo.wedora.in",
    "contactPhone": "+91 98000 0066",
    "averageOrderValue90Days": 390000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 135,
    "successfulReferralBookings": 38,
    "repeatCustomerBookings": 18,
    "onTimeDeliveryPercent": 97,
    "verifiedCustomerFeedbackCount": 63,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Bandra": 34,
      "Lower Parel": 34,
      "Andheri": 47
    },
    "customerFeedback": [
      {
        "id": "fb-mum-mak-03-1",
        "customerName": "S. Kulkarni",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Bandra, Mumbai",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-mum-mak-03-2",
        "customerName": "G. Bhosale",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Lower Parel, Mumbai",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-mak-03-3",
        "customerName": "M. Parekh",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Andheri, Mumbai",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "mum-mak-04",
    "businessName": "Heena Heritage Organic Rajasthani Mehendi",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Dadar",
      "Chembur",
      "Ghatkopar",
      "Mulund"
    ],
    "category": "Makeup and Mehendi Artists",
    "secondaryCategories": [],
    "description": "100% pure organic chemical-free Rajasthani dark stain sojat henna, intricate couple portraits, figure work, and sangeet guest artists.",
    "serviceOfferings": [
      "Airbrush HD Bridal Makeup",
      "Hair Styling & Saree Draping",
      "Organic Rajasthani Mehendi",
      "Guest Mehendi Artists",
      "Pre-Bridal Grooming"
    ],
    "maximumSimultaneousBookings": 3,
    "startingPrice": 22000,
    "priceUnit": "per bridal mehndi",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-25": "Available"
    },
    "completedOrders90Days": 33,
    "repeatOrdersArea": {
      "Dadar": 5,
      "Chembur": 5,
      "Ghatkopar": 6,
      "Mulund": 5
    },
    "referralsArea": {
      "Dadar": 11,
      "Chembur": 11,
      "Ghatkopar": 11,
      "Mulund": 10
    },
    "repeatOrdersTotal": 21,
    "referralsTotal": 43,
    "portfolioImages": [
      "/assets/mak-2.jpg"
    ],
    "serviceTags": [
      "Organic Sojat Henna",
      "Portrait Work",
      "Dark Stain Guarantee",
      "Guest Artists Team"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-mak-04.demo.wedora.in",
    "contactPhone": "+91 98000 0067",
    "averageOrderValue90Days": 435000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 148,
    "successfulReferralBookings": 43,
    "repeatCustomerBookings": 21,
    "onTimeDeliveryPercent": 98,
    "verifiedCustomerFeedbackCount": 71,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Dadar": 29,
      "Chembur": 29,
      "Ghatkopar": 28,
      "Mulund": 40
    },
    "customerFeedback": [
      {
        "id": "fb-mum-mak-04-1",
        "customerName": "V. Mehta",
        "eventType": "Mehendi Celebration",
        "location": "Dadar, Mumbai",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-mak-04-2",
        "customerName": "C. Gaikwad",
        "eventType": "Mehendi Celebration",
        "location": "Chembur, Mumbai",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "mum-mak-05",
    "businessName": "Grace & Gold Bridal Beauty Lounge",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Powai",
      "Goregaon",
      "Malad",
      "Borivali"
    ],
    "category": "Makeup and Mehendi Artists",
    "secondaryCategories": [],
    "description": "Airbrush bridal artistry, waterproof wedding ceremony makeup, family makeover packages, and floral hair accessories styling.",
    "serviceOfferings": [
      "Airbrush HD Bridal Makeup",
      "Hair Styling & Saree Draping",
      "Organic Rajasthani Mehendi",
      "Guest Mehendi Artists",
      "Pre-Bridal Grooming"
    ],
    "maximumSimultaneousBookings": 2,
    "startingPrice": 28000,
    "priceUnit": "per bridal package",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 27,
    "repeatOrdersArea": {
      "Powai": 5,
      "Goregaon": 4,
      "Malad": 5,
      "Borivali": 4
    },
    "referralsArea": {
      "Powai": 9,
      "Goregaon": 9,
      "Malad": 9,
      "Borivali": 9
    },
    "repeatOrdersTotal": 18,
    "referralsTotal": 36,
    "portfolioImages": [
      "/assets/mak-1.jpg"
    ],
    "serviceTags": [
      "Airbrush Makeup",
      "Waterproof Formula",
      "Family Makeover",
      "Floral Hairdo"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-mak-05.demo.wedora.in",
    "contactPhone": "+91 98000 0068",
    "averageOrderValue90Days": 315000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 121,
    "successfulReferralBookings": 36,
    "repeatCustomerBookings": 18,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 59,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Powai": 23,
      "Goregaon": 24,
      "Malad": 23,
      "Borivali": 33
    },
    "customerFeedback": [
      {
        "id": "fb-mum-mak-05-1",
        "customerName": "K. Iyer",
        "eventType": "Grand Reception",
        "location": "Powai, Mumbai",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-mum-mak-05-2",
        "customerName": "A. Banerjee",
        "eventType": "Grand Reception",
        "location": "Goregaon, Mumbai",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-mum-mak-05-3",
        "customerName": "S. Kulkarni",
        "eventType": "Grand Reception",
        "location": "Malad, Mumbai",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "mum-org-01",
    "businessName": "Symphony Signature Weddings",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Lower Parel",
      "Powai",
      "Andheri"
    ],
    "category": "Event Organizers / Wedding Planners",
    "secondaryCategories": [
      "Decoration and Flower Arrangements",
      "Lighting Services"
    ],
    "description": "Premier luxury wedding planning agency managing design, vendor coordination, RSVP management, and flawless day-of execution.",
    "maximumGuestCapacity": 1500,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 350000,
    "priceUnit": "management fee",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 19,
    "averageOrderValue90Days": 480000,
    "portfolioImages": [
      "/assets/org-1.jpg",
      "/assets/org-2.jpg"
    ],
    "serviceTags": [
      "Full Wedding Planning",
      "RSVP Management",
      "VIP Hospitality"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-org-01.demo.wedora.in",
    "contactPhone": "+91 98000 0038",
    "serviceOfferings": [
      "Vendor Contract Negotiation",
      "Day-of Event Management",
      "RSVP & Guest Hospitality",
      "Budget Monitoring",
      "Checklist Execution"
    ],
    "repeatOrdersArea": {
      "Bandra": 4,
      "Lower Parel": 3,
      "Powai": 4,
      "Andheri": 3
    },
    "referralsArea": {
      "Bandra": 5,
      "Lower Parel": 5,
      "Powai": 6,
      "Andheri": 5
    },
    "repeatOrdersTotal": 14,
    "referralsTotal": 21,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 88,
    "successfulReferralBookings": 21,
    "repeatCustomerBookings": 14,
    "onTimeDeliveryPercent": 93,
    "verifiedCustomerFeedbackCount": 37,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Bandra": 17,
      "Lower Parel": 17,
      "Powai": 17,
      "Andheri": 24
    },
    "customerFeedback": [
      {
        "id": "fb-mum-org-01-1",
        "customerName": "P. Deshmukh",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Bandra, Mumbai",
        "comment": "Reduced our family stress to zero. Budget tracker and daily checklists were transparent and meticulously maintained. Bride side car coordination had minor confusion that was rectified promptly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-org-01-2",
        "customerName": "K. Iyer",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Lower Parel, Mumbai",
        "comment": "Masterful crowd control and welcoming hospitality for our 800+ guests. Every vendor delivered on time under their watch. Pre-wedding rehearsal was brief, but the main day execution went smoothly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "mum-org-02",
    "businessName": "Vivah Sutra Wedding & Event Planners",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Dadar",
      "Chembur",
      "Ghatkopar",
      "Thane"
    ],
    "category": "Event Organizers / Wedding Planners",
    "secondaryCategories": [
      "Logistics and Transportation",
      "Decoration and Flower Arrangements"
    ],
    "description": "Specialized in traditional Maharashtrian and North Indian weddings, pandit coordination, rituals timeline, and vendor sync.",
    "maximumGuestCapacity": 1000,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 220000,
    "priceUnit": "management fee",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 22,
    "averageOrderValue90Days": 290000,
    "portfolioImages": [
      "/assets/org-1.jpg",
      "/assets/org-2.jpg"
    ],
    "serviceTags": [
      "Rituals Specialist",
      "Pandit Coordination",
      "Timeline Management"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-org-02.demo.wedora.in",
    "contactPhone": "+91 98000 0039",
    "serviceOfferings": [
      "Vendor Contract Negotiation",
      "Day-of Event Management",
      "RSVP & Guest Hospitality",
      "Budget Monitoring",
      "Checklist Execution"
    ],
    "repeatOrdersArea": {
      "Dadar": 4,
      "Chembur": 4,
      "Ghatkopar": 5,
      "Thane": 4
    },
    "referralsArea": {
      "Dadar": 6,
      "Chembur": 6,
      "Ghatkopar": 7,
      "Thane": 6
    },
    "repeatOrdersTotal": 17,
    "referralsTotal": 25,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 101,
    "successfulReferralBookings": 25,
    "repeatCustomerBookings": 17,
    "onTimeDeliveryPercent": 94,
    "verifiedCustomerFeedbackCount": 43,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 96,
    "completedOrdersArea": {
      "Dadar": 20,
      "Chembur": 19,
      "Ghatkopar": 20,
      "Thane": 27
    },
    "customerFeedback": [
      {
        "id": "fb-mum-org-02-1",
        "customerName": "N. Nair",
        "eventType": "Wedding Ceremony",
        "location": "Dadar, Mumbai",
        "comment": "Masterful crowd control and welcoming hospitality for our 800+ guests. Every vendor delivered on time under their watch. Pre-wedding rehearsal was brief, but the main day execution went smoothly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-org-02-2",
        "customerName": "B. Chavan",
        "eventType": "Wedding Ceremony",
        "location": "Chembur, Mumbai",
        "comment": "Flawless end-to-end orchestration! They kept the pandit, caterers, and sound engineers perfectly in sync throughout. Varmala stage entry timing was pushed back by 15 minutes due to guest arrival traffic.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-mum-org-02-3",
        "customerName": "S. More",
        "eventType": "Wedding Ceremony",
        "location": "Ghatkopar, Mumbai",
        "comment": "Reduced our family stress to zero. Budget tracker and daily checklists were transparent and meticulously maintained. Bride side car coordination had minor confusion that was rectified promptly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "mum-org-03",
    "businessName": "Urban Knots Boutique Event Co.",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Powai",
      "Goregaon",
      "Malad",
      "Bandra"
    ],
    "category": "Event Organizers / Wedding Planners",
    "secondaryCategories": [
      "DJ and Sound Systems",
      "Photography and Videography"
    ],
    "description": "Boutique wedding planners focusing on personalized contemporary themes, cocktail soirees, budget tracking, and vendor negotiation.",
    "maximumGuestCapacity": 800,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 280000,
    "priceUnit": "management fee",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-17": "Available"
    },
    "completedOrders90Days": 16,
    "averageOrderValue90Days": 340000,
    "portfolioImages": [
      "/assets/org-1.jpg",
      "/assets/org-2.jpg"
    ],
    "serviceTags": [
      "Budget Optimization",
      "Cocktail Soirees",
      "Vendor Negotiation"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-org-03.demo.wedora.in",
    "contactPhone": "+91 98000 0040",
    "serviceOfferings": [
      "Vendor Contract Negotiation",
      "Day-of Event Management",
      "RSVP & Guest Hospitality",
      "Budget Monitoring",
      "Checklist Execution"
    ],
    "repeatOrdersArea": {
      "Powai": 3,
      "Goregaon": 3,
      "Malad": 4,
      "Bandra": 3
    },
    "referralsArea": {
      "Powai": 5,
      "Goregaon": 5,
      "Malad": 5,
      "Bandra": 4
    },
    "repeatOrdersTotal": 13,
    "referralsTotal": 19,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 74,
    "successfulReferralBookings": 19,
    "repeatCustomerBookings": 13,
    "onTimeDeliveryPercent": 95,
    "verifiedCustomerFeedbackCount": 33,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Powai": 14,
      "Goregaon": 14,
      "Malad": 15,
      "Bandra": 20
    },
    "customerFeedback": [
      {
        "id": "fb-mum-org-03-1",
        "customerName": "T. Agarwal",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Powai, Mumbai",
        "comment": "Flawless end-to-end orchestration! They kept the pandit, caterers, and sound engineers perfectly in sync throughout. Varmala stage entry timing was pushed back by 15 minutes due to guest arrival traffic.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-mum-org-03-2",
        "customerName": "R. Tendulkar",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Goregaon, Mumbai",
        "comment": "Reduced our family stress to zero. Budget tracker and daily checklists were transparent and meticulously maintained. Bride side car coordination had minor confusion that was rectified promptly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "mum-org-04",
    "businessName": "Grandeur Celebration Planners",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Thane",
      "Navi Mumbai",
      "Mulund"
    ],
    "category": "Event Organizers / Wedding Planners",
    "secondaryCategories": [
      "Catering and Food Services",
      "Wedding Lawns and Venues"
    ],
    "description": "Experienced planners for large-scale multi-day community weddings with 1,000+ guests, crowd control, and stage execution.",
    "maximumGuestCapacity": 2000,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 300000,
    "priceUnit": "management fee",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-23": "Available"
    },
    "completedOrders90Days": 18,
    "averageOrderValue90Days": 390000,
    "portfolioImages": [
      "/assets/org-1.jpg",
      "/assets/org-2.jpg"
    ],
    "serviceTags": [
      "Large Scale Weddings",
      "Crowd Management",
      "Multi-day Coordination"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-org-04.demo.wedora.in",
    "contactPhone": "+91 98000 0041",
    "serviceOfferings": [
      "Vendor Contract Negotiation",
      "Day-of Event Management",
      "RSVP & Guest Hospitality",
      "Budget Monitoring",
      "Checklist Execution"
    ],
    "repeatOrdersArea": {
      "Thane": 5,
      "Navi Mumbai": 6,
      "Mulund": 5
    },
    "referralsArea": {
      "Thane": 7,
      "Navi Mumbai": 8,
      "Mulund": 7
    },
    "repeatOrdersTotal": 16,
    "referralsTotal": 22,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 83,
    "successfulReferralBookings": 22,
    "repeatCustomerBookings": 16,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 37,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Thane": 21,
      "Navi Mumbai": 21,
      "Mulund": 29
    },
    "customerFeedback": [
      {
        "id": "fb-mum-org-04-1",
        "customerName": "H. Trivedi",
        "eventType": "Mehendi Celebration",
        "location": "Thane, Mumbai",
        "comment": "Reduced our family stress to zero. Budget tracker and daily checklists were transparent and meticulously maintained. Bride side car coordination had minor confusion that was rectified promptly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-org-04-2",
        "customerName": "V. Kadam",
        "eventType": "Mehendi Celebration",
        "location": "Navi Mumbai, Mumbai",
        "comment": "Masterful crowd control and welcoming hospitality for our 800+ guests. Every vendor delivered on time under their watch. Pre-wedding rehearsal was brief, but the main day execution went smoothly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-org-04-3",
        "customerName": "N. Nair",
        "eventType": "Mehendi Celebration",
        "location": "Mulund, Mumbai",
        "comment": "Flawless end-to-end orchestration! They kept the pandit, caterers, and sound engineers perfectly in sync throughout. Varmala stage entry timing was pushed back by 15 minutes due to guest arrival traffic.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "mum-org-05",
    "businessName": "Elysian Wedding Concepts",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Lower Parel",
      "Andheri"
    ],
    "category": "Event Organizers / Wedding Planners",
    "secondaryCategories": [
      "Decoration and Flower Arrangements"
    ],
    "description": "Modern luxury wedding designers bringing fresh aesthetic visions, artist management, and bespoke guest experience curation.",
    "maximumGuestCapacity": 700,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 320000,
    "priceUnit": "management fee",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-21": "Available"
    },
    "completedOrders90Days": 2,
    "averageOrderValue90Days": 0,
    "portfolioImages": [
      "/assets/org-1.jpg",
      "/assets/org-2.jpg"
    ],
    "serviceTags": [
      "Artist Management",
      "Aesthetic Curation",
      "Guest Experience"
    ],
    "isNewToPlatform": true,
    "contactEmail": "contact@mum-org-05.demo.wedora.in",
    "contactPhone": "+91 98000 0042",
    "serviceOfferings": [
      "Vendor Contract Negotiation",
      "Day-of Event Management",
      "RSVP & Guest Hospitality",
      "Budget Monitoring",
      "Checklist Execution"
    ],
    "repeatOrdersArea": {
      "Bandra": 0
    },
    "referralsArea": {
      "Bandra": 1
    },
    "repeatOrdersTotal": 0,
    "referralsTotal": 1,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 2,
    "successfulReferralBookings": 1,
    "repeatCustomerBookings": 0,
    "onTimeDeliveryPercent": 100,
    "verifiedCustomerFeedbackCount": 1,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 100,
    "completedOrdersArea": {
      "Bandra": 2
    },
    "customerFeedback": [
      {
        "id": "fb-mum-org-05-1",
        "customerName": "A. Patil",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Bandra, Mumbai",
        "comment": "A very promising new team on Wedora! They communicated with high enthusiasm and delivered our engagement setup flawlessly on time.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "mum-pho-01",
    "businessName": "Candid Moments & Cinematic Films",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Lower Parel",
      "Powai",
      "Andheri"
    ],
    "category": "Photography and Videography",
    "secondaryCategories": [],
    "description": "Award-winning wedding photography collective specializing in editorial portraits, drone cinematography, and 4K teasers.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 220000,
    "priceUnit": "per day",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-17": "Available"
    },
    "completedOrders90Days": 33,
    "averageOrderValue90Days": 285000,
    "portfolioImages": [
      "/assets/pho-1.jpg",
      "/assets/pho-2.jpg"
    ],
    "serviceTags": [
      "Editorial Portraits",
      "Drone Cinematography",
      "Same Day Edit"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-pho-01.demo.wedora.in",
    "contactPhone": "+91 98000 0034",
    "serviceOfferings": [
      "Cinematic Wedding Films",
      "Candid Wedding Photography",
      "Drone Aerial 4K Coverage",
      "Traditional Albums",
      "Same-Day Edit Teasers"
    ],
    "repeatOrdersArea": {
      "Bandra": 6,
      "Lower Parel": 5,
      "Powai": 6,
      "Andheri": 5
    },
    "referralsArea": {
      "Bandra": 12,
      "Lower Parel": 12,
      "Powai": 12,
      "Andheri": 12
    },
    "repeatOrdersTotal": 22,
    "referralsTotal": 48,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 149,
    "successfulReferralBookings": 48,
    "repeatCustomerBookings": 22,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 52,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Bandra": 29,
      "Lower Parel": 29,
      "Powai": 29,
      "Andheri": 40
    },
    "customerFeedback": [
      {
        "id": "fb-mum-pho-01-1",
        "customerName": "K. Iyer",
        "eventType": "Grand Reception",
        "location": "Bandra, Mumbai",
        "comment": "Remarkable candid shots capturing genuine family emotions and smiles. Team was polite, unobtrusive, and punctual. Initial digital proof preview took a couple of extra days, but the final color grading was worth the wait.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-mum-pho-01-2",
        "customerName": "A. Banerjee",
        "eventType": "Grand Reception",
        "location": "Lower Parel, Mumbai",
        "comment": "Drone coverage and cinematic trailer were breathtaking. Handled our large guest gatherings with patience and ease. We had to remind them about our specific family group photo list during the crowded stage session.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-mum-pho-01-3",
        "customerName": "S. Kulkarni",
        "eventType": "Grand Reception",
        "location": "Powai, Mumbai",
        "comment": "Creative framing and gorgeous couple portraits in natural light. Teaser video delivered within 48 hours! Traditional stage portraits took slightly longer than budgeted in the schedule.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "mum-pho-02",
    "businessName": "The Wedding Chronicle Studios",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Dadar",
      "Chembur",
      "Ghatkopar",
      "Thane"
    ],
    "category": "Photography and Videography",
    "secondaryCategories": [],
    "description": "Timeless traditional wedding coverage, authentic candid storytelling, leather-bound Italian albums, and live YouTube streaming.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 150000,
    "priceUnit": "per day",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 36,
    "averageOrderValue90Days": 190000,
    "portfolioImages": [
      "/assets/pho-1.jpg",
      "/assets/pho-2.jpg"
    ],
    "serviceTags": [
      "Traditional Photography",
      "Leather Albums",
      "Live YouTube Stream"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-pho-02.demo.wedora.in",
    "contactPhone": "+91 98000 0035",
    "serviceOfferings": [
      "Cinematic Wedding Films",
      "Candid Wedding Photography",
      "Drone Aerial 4K Coverage",
      "Traditional Albums",
      "Same-Day Edit Teasers"
    ],
    "repeatOrdersArea": {
      "Dadar": 7,
      "Chembur": 6,
      "Ghatkopar": 7,
      "Thane": 6
    },
    "referralsArea": {
      "Dadar": 9,
      "Chembur": 9,
      "Ghatkopar": 9,
      "Thane": 9
    },
    "repeatOrdersTotal": 26,
    "referralsTotal": 36,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 162,
    "successfulReferralBookings": 36,
    "repeatCustomerBookings": 26,
    "onTimeDeliveryPercent": 93,
    "verifiedCustomerFeedbackCount": 58,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Dadar": 31,
      "Chembur": 31,
      "Ghatkopar": 32,
      "Thane": 44
    },
    "customerFeedback": [
      {
        "id": "fb-mum-pho-02-1",
        "customerName": "B. Chavan",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Dadar, Mumbai",
        "comment": "Drone coverage and cinematic trailer were breathtaking. Handled our large guest gatherings with patience and ease. We had to remind them about our specific family group photo list during the crowded stage session.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-pho-02-2",
        "customerName": "S. More",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Chembur, Mumbai",
        "comment": "Creative framing and gorgeous couple portraits in natural light. Teaser video delivered within 48 hours! Traditional stage portraits took slightly longer than budgeted in the schedule.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "mum-pho-03",
    "businessName": "Vivid Frames Luxury Wedding Reels",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Goregaon",
      "Malad",
      "Borivali",
      "Andheri"
    ],
    "category": "Photography and Videography",
    "secondaryCategories": [],
    "description": "Next-gen wedding filmmakers creating high-fashion Instagram reels, couple pre-wedding films, and documentary style memories.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 175000,
    "priceUnit": "per day",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-19": "Available"
    },
    "completedOrders90Days": 29,
    "averageOrderValue90Days": 220000,
    "portfolioImages": [
      "/assets/pho-1.jpg",
      "/assets/pho-2.jpg"
    ],
    "serviceTags": [
      "Fashion Reels",
      "Pre-Wedding Film",
      "Documentary"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-pho-03.demo.wedora.in",
    "contactPhone": "+91 98000 0036",
    "serviceOfferings": [
      "Cinematic Wedding Films",
      "Candid Wedding Photography",
      "Drone Aerial 4K Coverage",
      "Traditional Albums",
      "Same-Day Edit Teasers"
    ],
    "repeatOrdersArea": {
      "Goregaon": 6,
      "Malad": 5,
      "Borivali": 6,
      "Andheri": 5
    },
    "referralsArea": {
      "Goregaon": 8,
      "Malad": 7,
      "Borivali": 8,
      "Andheri": 7
    },
    "repeatOrdersTotal": 22,
    "referralsTotal": 30,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 131,
    "successfulReferralBookings": 30,
    "repeatCustomerBookings": 22,
    "onTimeDeliveryPercent": 94,
    "verifiedCustomerFeedbackCount": 48,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 96,
    "completedOrdersArea": {
      "Goregaon": 25,
      "Malad": 25,
      "Borivali": 25,
      "Andheri": 36
    },
    "customerFeedback": [
      {
        "id": "fb-mum-pho-03-1",
        "customerName": "R. Tendulkar",
        "eventType": "Wedding Ceremony",
        "location": "Goregaon, Mumbai",
        "comment": "Creative framing and gorgeous couple portraits in natural light. Teaser video delivered within 48 hours! Traditional stage portraits took slightly longer than budgeted in the schedule.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-pho-03-2",
        "customerName": "P. Deshmukh",
        "eventType": "Wedding Ceremony",
        "location": "Malad, Mumbai",
        "comment": "Remarkable candid shots capturing genuine family emotions and smiles. Team was polite, unobtrusive, and punctual. Initial digital proof preview took a couple of extra days, but the final color grading was worth the wait.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-mum-pho-03-3",
        "customerName": "K. Iyer",
        "eventType": "Wedding Ceremony",
        "location": "Borivali, Mumbai",
        "comment": "Drone coverage and cinematic trailer were breathtaking. Handled our large guest gatherings with patience and ease. We had to remind them about our specific family group photo list during the crowded stage session.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "mum-pho-04",
    "businessName": "Lumiere Bridal Photography",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Powai",
      "Lower Parel"
    ],
    "category": "Photography and Videography",
    "secondaryCategories": [],
    "description": "Bespoke bridal portraits, emotional candid captures, fine-art black & white wedding albums, and intimate family moments.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 190000,
    "priceUnit": "per day",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-22": "Available"
    },
    "completedOrders90Days": 0,
    "averageOrderValue90Days": 0,
    "portfolioImages": [
      "/assets/pho-1.jpg",
      "/assets/pho-2.jpg"
    ],
    "serviceTags": [
      "Fine Art",
      "Bridal Portraits",
      "Emotional Candids"
    ],
    "isNewToPlatform": true,
    "contactEmail": "contact@mum-pho-04.demo.wedora.in",
    "contactPhone": "+91 98000 0037",
    "serviceOfferings": [
      "Cinematic Wedding Films",
      "Candid Wedding Photography",
      "Drone Aerial 4K Coverage",
      "Traditional Albums",
      "Same-Day Edit Teasers"
    ],
    "repeatOrdersArea": {},
    "referralsArea": {},
    "repeatOrdersTotal": 0,
    "referralsTotal": 0,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 0,
    "successfulReferralBookings": 0,
    "repeatCustomerBookings": 0,
    "onTimeDeliveryPercent": 100,
    "verifiedCustomerFeedbackCount": 0,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 100,
    "completedOrdersArea": {},
    "customerFeedback": []
  },
  {
    "id": "mum-pho-05",
    "businessName": "Lumiere Cinematic Wedding Stories",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Andheri",
      "Lower Parel",
      "Dadar"
    ],
    "category": "Photography and Videography",
    "secondaryCategories": [],
    "description": "Award-winning wedding photojournalism, Sony FX6 4K cinema cameras, candid emotional captures, and handcrafted leather coffee table albums.",
    "serviceOfferings": [
      "Cinematic Wedding Films",
      "Candid Wedding Photography",
      "Drone Aerial 4K Coverage",
      "Traditional Albums",
      "Same-Day Edit Teasers"
    ],
    "maximumSimultaneousBookings": 2,
    "startingPrice": 110000,
    "priceUnit": "per wedding",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-25": "Available"
    },
    "completedOrders90Days": 32,
    "repeatOrdersArea": {
      "Bandra": 7,
      "Andheri": 7,
      "Lower Parel": 7,
      "Dadar": 7
    },
    "referralsArea": {
      "Bandra": 9,
      "Andheri": 9,
      "Lower Parel": 9,
      "Dadar": 9
    },
    "repeatOrdersTotal": 28,
    "referralsTotal": 36,
    "portfolioImages": [
      "/assets/pho-1.jpg"
    ],
    "serviceTags": [
      "Cinematic Film",
      "Candid Photojournalism",
      "Handcrafted Albums",
      "Drone 4K"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-pho-05.demo.wedora.in",
    "contactPhone": "+91 98000 0060",
    "averageOrderValue90Days": 315000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 145,
    "successfulReferralBookings": 36,
    "repeatCustomerBookings": 28,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 57,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Bandra": 28,
      "Andheri": 28,
      "Lower Parel": 28,
      "Dadar": 39
    },
    "customerFeedback": [
      {
        "id": "fb-mum-pho-05-1",
        "customerName": "R. Shah",
        "eventType": "Mehendi Celebration",
        "location": "Bandra, Mumbai",
        "comment": "Drone coverage and cinematic trailer were breathtaking. Handled our large guest gatherings with patience and ease. We had to remind them about our specific family group photo list during the crowded stage session.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-pho-05-2",
        "customerName": "T. Agarwal",
        "eventType": "Mehendi Celebration",
        "location": "Andheri, Mumbai",
        "comment": "Creative framing and gorgeous couple portraits in natural light. Teaser video delivered within 48 hours! Traditional stage portraits took slightly longer than budgeted in the schedule.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-pho-05-3",
        "customerName": "R. Tendulkar",
        "eventType": "Mehendi Celebration",
        "location": "Lower Parel, Mumbai",
        "comment": "Remarkable candid shots capturing genuine family emotions and smiles. Team was polite, unobtrusive, and punctual. Initial digital proof preview took a couple of extra days, but the final color grading was worth the wait.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "mum-ven-01",
    "businessName": "Grand Sea Princess Lawns & Banquet",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Andheri",
      "Dadar"
    ],
    "category": "Wedding Lawns and Venues",
    "secondaryCategories": [],
    "description": "Iconic open-air oceanfront wedding lawn with palm tree canopy, air-conditioned bride suites, and valet parking for 300 cars.",
    "maximumGuestCapacity": 1200,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 550000,
    "priceUnit": "per day rental",
    "quotationRequired": true,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-25": "Fully Booked"
    },
    "completedOrders90Days": 22,
    "averageOrderValue90Days": 620000,
    "portfolioImages": [
      "/assets/ven-1.jpg",
      "/assets/ven-2.jpg"
    ],
    "serviceTags": [
      "Sea-Facing",
      "Open Lawn",
      "Valet Parking",
      "Bridal Suites"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-ven-01.demo.wedora.in",
    "contactPhone": "+91 98000 0025",
    "serviceOfferings": [
      "Open-Air Banquet Lawns",
      "Air-Conditioned Indoor Halls",
      "Bridal Green Rooms",
      "Valet Parking Lot",
      "In-House Power Backup"
    ],
    "repeatOrdersArea": {
      "Bandra": 6,
      "Andheri": 6,
      "Dadar": 5
    },
    "referralsArea": {
      "Bandra": 10,
      "Andheri": 11,
      "Dadar": 10
    },
    "repeatOrdersTotal": 17,
    "referralsTotal": 31,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 99,
    "successfulReferralBookings": 31,
    "repeatCustomerBookings": 17,
    "onTimeDeliveryPercent": 97,
    "verifiedCustomerFeedbackCount": 37,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Bandra": 25,
      "Andheri": 25,
      "Dadar": 34
    },
    "customerFeedback": [
      {
        "id": "fb-mum-ven-01-1",
        "customerName": "N. Nair",
        "eventType": "Wedding Ceremony",
        "location": "Bandra, Mumbai",
        "comment": "Wonderful venue ambiance with convenient proximity to the highway. Accommodated our vendors for setup effortlessly. Service entrance was busy during overlapping vendor load-ins.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-ven-01-2",
        "customerName": "B. Chavan",
        "eventType": "Wedding Ceremony",
        "location": "Andheri, Mumbai",
        "comment": "Expansive lush green lawn, pristine air-conditioned bridal suites, and seamless valet management for 600+ guests. Acoustic sound restrictions required lowering music volume slightly past 10 PM in the open section.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-mum-ven-01-3",
        "customerName": "S. More",
        "eventType": "Wedding Ceremony",
        "location": "Dadar, Mumbai",
        "comment": "Stunning banquet hall with high ceilings and regal chandeliers. Guest parking and security staff were well organized. Restroom checks needed an extra reminder halfway through the reception.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "mum-ven-02",
    "businessName": "The Emerald Greens Wedding Pavilion",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Powai",
      "Goregaon",
      "Malad"
    ],
    "category": "Wedding Lawns and Venues",
    "secondaryCategories": [],
    "description": "Sprawling 45,000 sq ft manicured royal lawn nestled near Powai lake with attached banquet hall and grand amphitheatre mandap.",
    "maximumGuestCapacity": 1000,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 420000,
    "priceUnit": "per day rental",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 25,
    "averageOrderValue90Days": 490000,
    "portfolioImages": [
      "/assets/ven-1.jpg",
      "/assets/ven-2.jpg"
    ],
    "serviceTags": [
      "Manicured Lawn",
      "Attached Banquet",
      "Lake View"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-ven-02.demo.wedora.in",
    "contactPhone": "+91 98000 0026",
    "serviceOfferings": [
      "Open-Air Banquet Lawns",
      "Air-Conditioned Indoor Halls",
      "Bridal Green Rooms",
      "Valet Parking Lot",
      "In-House Power Backup"
    ],
    "repeatOrdersArea": {
      "Powai": 7,
      "Goregaon": 7,
      "Malad": 6
    },
    "referralsArea": {
      "Powai": 12,
      "Goregaon": 12,
      "Malad": 12
    },
    "repeatOrdersTotal": 20,
    "referralsTotal": 36,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 112,
    "successfulReferralBookings": 36,
    "repeatCustomerBookings": 20,
    "onTimeDeliveryPercent": 98,
    "verifiedCustomerFeedbackCount": 43,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Powai": 28,
      "Goregaon": 28,
      "Malad": 39
    },
    "customerFeedback": [
      {
        "id": "fb-mum-ven-02-1",
        "customerName": "T. Agarwal",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Powai, Mumbai",
        "comment": "Expansive lush green lawn, pristine air-conditioned bridal suites, and seamless valet management for 600+ guests. Acoustic sound restrictions required lowering music volume slightly past 10 PM in the open section.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-mum-ven-02-2",
        "customerName": "R. Tendulkar",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Goregaon, Mumbai",
        "comment": "Stunning banquet hall with high ceilings and regal chandeliers. Guest parking and security staff were well organized. Restroom checks needed an extra reminder halfway through the reception.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "mum-ven-03",
    "businessName": "Mayfair Grand Ballroom & Lawns",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Lower Parel",
      "Dadar",
      "Bandra"
    ],
    "category": "Wedding Lawns and Venues",
    "secondaryCategories": [],
    "description": "Ultra-luxurious pillarless high-ceiling ballroom in South-Central Mumbai equipped with pre-function lawn and crystal chandeliers.",
    "maximumGuestCapacity": 750,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 650000,
    "priceUnit": "per day rental",
    "quotationRequired": true,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-19": "Available"
    },
    "completedOrders90Days": 20,
    "averageOrderValue90Days": 720000,
    "portfolioImages": [
      "/assets/ven-1.jpg",
      "/assets/ven-2.jpg"
    ],
    "serviceTags": [
      "Pillarless Ballroom",
      "South Mumbai Luxury",
      "Pre-function Lawn"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-ven-03.demo.wedora.in",
    "contactPhone": "+91 98000 0027",
    "serviceOfferings": [
      "Open-Air Banquet Lawns",
      "Air-Conditioned Indoor Halls",
      "Bridal Green Rooms",
      "Valet Parking Lot",
      "In-House Power Backup"
    ],
    "repeatOrdersArea": {
      "Lower Parel": 6,
      "Dadar": 6,
      "Bandra": 6
    },
    "referralsArea": {
      "Lower Parel": 7,
      "Dadar": 7,
      "Bandra": 6
    },
    "repeatOrdersTotal": 18,
    "referralsTotal": 20,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 93,
    "successfulReferralBookings": 20,
    "repeatCustomerBookings": 18,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 36,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Lower Parel": 23,
      "Dadar": 23,
      "Bandra": 33
    },
    "customerFeedback": [
      {
        "id": "fb-mum-ven-03-1",
        "customerName": "H. Trivedi",
        "eventType": "Mehendi Celebration",
        "location": "Lower Parel, Mumbai",
        "comment": "Stunning banquet hall with high ceilings and regal chandeliers. Guest parking and security staff were well organized. Restroom checks needed an extra reminder halfway through the reception.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-ven-03-2",
        "customerName": "V. Kadam",
        "eventType": "Mehendi Celebration",
        "location": "Dadar, Mumbai",
        "comment": "Wonderful venue ambiance with convenient proximity to the highway. Accommodated our vendors for setup effortlessly. Service entrance was busy during overlapping vendor load-ins.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-ven-03-3",
        "customerName": "N. Nair",
        "eventType": "Mehendi Celebration",
        "location": "Bandra, Mumbai",
        "comment": "Expansive lush green lawn, pristine air-conditioned bridal suites, and seamless valet management for 600+ guests. Acoustic sound restrictions required lowering music volume slightly past 10 PM in the open section.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "mum-ven-04",
    "businessName": "Palm Meadows Country Club & Lawns",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Thane",
      "Mulund",
      "Ghatkopar"
    ],
    "category": "Wedding Lawns and Venues",
    "secondaryCategories": [],
    "description": "Serene clubhouse lawns with swimming pool deck for cocktail sangeets and lush green wedding grounds.",
    "maximumGuestCapacity": 850,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 320000,
    "priceUnit": "per day rental",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available"
    },
    "completedOrders90Days": 27,
    "averageOrderValue90Days": 360000,
    "portfolioImages": [
      "/assets/ven-1.jpg",
      "/assets/ven-2.jpg"
    ],
    "serviceTags": [
      "Clubhouse Lawn",
      "Pool Deck",
      "Ample Parking"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-ven-04.demo.wedora.in",
    "contactPhone": "+91 98000 0028",
    "serviceOfferings": [
      "Open-Air Banquet Lawns",
      "Air-Conditioned Indoor Halls",
      "Bridal Green Rooms",
      "Valet Parking Lot",
      "In-House Power Backup"
    ],
    "repeatOrdersArea": {
      "Thane": 8,
      "Mulund": 8,
      "Ghatkopar": 8
    },
    "referralsArea": {
      "Thane": 9,
      "Mulund": 10,
      "Ghatkopar": 9
    },
    "repeatOrdersTotal": 24,
    "referralsTotal": 28,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 122,
    "successfulReferralBookings": 28,
    "repeatCustomerBookings": 24,
    "onTimeDeliveryPercent": 93,
    "verifiedCustomerFeedbackCount": 49,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Thane": 31,
      "Mulund": 30,
      "Ghatkopar": 43
    },
    "customerFeedback": [
      {
        "id": "fb-mum-ven-04-1",
        "customerName": "S. Singhania",
        "eventType": "Grand Reception",
        "location": "Thane, Mumbai",
        "comment": "Wonderful venue ambiance with convenient proximity to the highway. Accommodated our vendors for setup effortlessly. Service entrance was busy during overlapping vendor load-ins.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-mum-ven-04-2",
        "customerName": "R. Shah",
        "eventType": "Grand Reception",
        "location": "Mulund, Mumbai",
        "comment": "Expansive lush green lawn, pristine air-conditioned bridal suites, and seamless valet management for 600+ guests. Acoustic sound restrictions required lowering music volume slightly past 10 PM in the open section.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "mum-ven-05",
    "businessName": "Royal Palms Forest Banquets & Arena",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Goregaon",
      "Malad",
      "Borivali"
    ],
    "category": "Wedding Lawns and Venues",
    "secondaryCategories": [],
    "description": "Nestled beside lush greenery, offering expansive wedding ground capacity with dedicated dining courtyard.",
    "maximumGuestCapacity": 700,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 380000,
    "priceUnit": "per day rental",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-22": "Available"
    },
    "completedOrders90Days": 0,
    "averageOrderValue90Days": 0,
    "portfolioImages": [
      "/assets/ven-1.jpg",
      "/assets/ven-2.jpg"
    ],
    "serviceTags": [
      "Green Surroundings",
      "Large Capacity",
      "Dining Courtyard"
    ],
    "isNewToPlatform": true,
    "contactEmail": "contact@mum-ven-05.demo.wedora.in",
    "contactPhone": "+91 98000 0029",
    "serviceOfferings": [
      "Open-Air Banquet Lawns",
      "Air-Conditioned Indoor Halls",
      "Bridal Green Rooms",
      "Valet Parking Lot",
      "In-House Power Backup"
    ],
    "repeatOrdersArea": {},
    "referralsArea": {},
    "repeatOrdersTotal": 0,
    "referralsTotal": 0,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 0,
    "successfulReferralBookings": 0,
    "repeatCustomerBookings": 0,
    "onTimeDeliveryPercent": 100,
    "verifiedCustomerFeedbackCount": 0,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 100,
    "completedOrdersArea": {},
    "customerFeedback": []
  },
  {
    "id": "pun-cat-01",
    "businessName": "Royal Feast Catering & Hospitality",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Baner",
      "Wakad",
      "Aundh",
      "Hinjewadi"
    ],
    "category": "Catering and Food Services",
    "secondaryCategories": [],
    "description": "Premium multi-cuisine wedding banquet specialist featuring royal Maharashtrian, Mughlai, and live continental counters.",
    "maximumGuestCapacity": 1200,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 1200,
    "priceUnit": "per plate",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-25": "Tentative"
    },
    "completedOrders90Days": 14,
    "averageOrderValue90Days": 380000,
    "portfolioImages": [
      "/assets/cat-1.jpg",
      "/assets/cat-2.jpg"
    ],
    "serviceTags": [
      "Royal Banquets",
      "Multi-Cuisine",
      "Live Counters",
      "Baner/Wakad"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-cat-01.demo.wedora.in",
    "contactPhone": "+91 98000 0000",
    "serviceOfferings": [
      "Buffet Catering",
      "Live Counters",
      "Tasting Sessions",
      "Custom Menus",
      "Professional Waitstaff"
    ],
    "repeatOrdersArea": {
      "Baner": 3,
      "Wakad": 3,
      "Aundh": 4,
      "Hinjewadi": 3
    },
    "referralsArea": {
      "Baner": 5,
      "Wakad": 5,
      "Aundh": 5,
      "Hinjewadi": 5
    },
    "repeatOrdersTotal": 13,
    "referralsTotal": 20,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 64,
    "successfulReferralBookings": 20,
    "repeatCustomerBookings": 13,
    "onTimeDeliveryPercent": 95,
    "verifiedCustomerFeedbackCount": 31,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Baner": 12,
      "Wakad": 12,
      "Aundh": 13,
      "Hinjewadi": 17
    },
    "customerFeedback": [
      {
        "id": "fb-pun-cat-01-1",
        "customerName": "M. Joshi",
        "eventType": "Grand Reception",
        "location": "Baner, Pune",
        "comment": "Professional service staff, spotless buffet presentation, and authentic regional flavours. The tasting session matched the wedding spread exactly. Setup started an hour earlier than scheduled which helped avoid any last-minute rush.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-cat-01-2",
        "customerName": "H. Trivedi",
        "eventType": "Grand Reception",
        "location": "Wakad, Pune",
        "comment": "The fusion menu and mocktail bar kept all our guests thrilled. Portions were generous with zero food wastage. Live pasta station line moved slightly slow during peak hours due to customized orders.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "pun-cat-02",
    "businessName": "Heritage Rasoi Caterers",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Wakad",
      "Baner",
      "Pimpri-Chinchwad",
      "Aundh"
    ],
    "category": "Catering and Food Services",
    "secondaryCategories": [],
    "description": "Renowned wedding caterers offering authentic traditional vegetarian spreads, live chaat, and bespoke dessert buffets.",
    "maximumGuestCapacity": 800,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 950,
    "priceUnit": "per plate",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-17": "Available"
    },
    "completedOrders90Days": 12,
    "averageOrderValue90Days": 290000,
    "portfolioImages": [
      "/assets/cat-1.jpg",
      "/assets/cat-2.jpg"
    ],
    "serviceTags": [
      "Traditional Veg Spreads",
      "Live Chaat",
      "Dessert Buffets",
      "Wakad/Baner"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-cat-02.demo.wedora.in",
    "contactPhone": "+91 98000 0001",
    "serviceOfferings": [
      "Buffet Catering",
      "Live Counters",
      "Tasting Sessions",
      "Custom Menus",
      "Professional Waitstaff"
    ],
    "repeatOrdersArea": {
      "Wakad": 3,
      "Baner": 3,
      "Pimpri-Chinchwad": 3,
      "Aundh": 2
    },
    "referralsArea": {
      "Wakad": 4,
      "Baner": 4,
      "Pimpri-Chinchwad": 5,
      "Aundh": 4
    },
    "repeatOrdersTotal": 11,
    "referralsTotal": 17,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 53,
    "successfulReferralBookings": 17,
    "repeatCustomerBookings": 11,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 26,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Wakad": 10,
      "Baner": 10,
      "Pimpri-Chinchwad": 10,
      "Aundh": 15
    },
    "customerFeedback": [
      {
        "id": "fb-pun-cat-02-1",
        "customerName": "D. Shinde",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Wakad, Pune",
        "comment": "The fusion menu and mocktail bar kept all our guests thrilled. Portions were generous with zero food wastage. Live pasta station line moved slightly slow during peak hours due to customized orders.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-cat-02-2",
        "customerName": "S. Singhania",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Baner, Pune",
        "comment": "Food quality and live chaat counters were exceptional. Our guests especially loved the hot appetizers and traditional dessert spread. Beverage refills at the far dining section had a brief delay during peak dinner rush, but the floor manager resolved it quickly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-cat-02-3",
        "customerName": "R. Shah",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Pimpri-Chinchwad, Pune",
        "comment": "Professional service staff, spotless buffet presentation, and authentic regional flavours. The tasting session matched the wedding spread exactly. Setup started an hour earlier than scheduled which helped avoid any last-minute rush.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "pun-cat-03",
    "businessName": "Puneri Pangat Heritage Caterers",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Kothrud",
      "Shivajinagar",
      "Aundh"
    ],
    "category": "Catering and Food Services",
    "secondaryCategories": [],
    "description": "Authentic Peshwai wedding feast with silver thalis, puran poli, ukadiche modak, and traditional pângat dining.",
    "maximumGuestCapacity": 700,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 850,
    "priceUnit": "per plate",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Unavailable",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 20,
    "averageOrderValue90Days": 240000,
    "portfolioImages": [
      "/assets/cat-1.jpg",
      "/assets/cat-2.jpg"
    ],
    "serviceTags": [
      "Peshwai Feast",
      "Silver Thali",
      "Traditional Pangat"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-cat-03.demo.wedora.in",
    "contactPhone": "+91 98000 0002",
    "serviceOfferings": [
      "Buffet Catering",
      "Live Counters",
      "Tasting Sessions",
      "Custom Menus",
      "Professional Waitstaff"
    ],
    "repeatOrdersArea": {
      "Kothrud": 4,
      "Shivajinagar": 4,
      "Aundh": 3
    },
    "referralsArea": {
      "Kothrud": 7,
      "Shivajinagar": 7,
      "Aundh": 6
    },
    "repeatOrdersTotal": 11,
    "referralsTotal": 20,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 90,
    "successfulReferralBookings": 20,
    "repeatCustomerBookings": 11,
    "onTimeDeliveryPercent": 97,
    "verifiedCustomerFeedbackCount": 29,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Kothrud": 23,
      "Shivajinagar": 23,
      "Aundh": 31
    },
    "customerFeedback": [
      {
        "id": "fb-pun-cat-03-1",
        "customerName": "G. Bhosale",
        "eventType": "Wedding Ceremony",
        "location": "Kothrud, Pune",
        "comment": "Food quality and live chaat counters were exceptional. Our guests especially loved the hot appetizers and traditional dessert spread. Beverage refills at the far dining section had a brief delay during peak dinner rush, but the floor manager resolved it quickly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-cat-03-2",
        "customerName": "M. Parekh",
        "eventType": "Wedding Ceremony",
        "location": "Shivajinagar, Pune",
        "comment": "Professional service staff, spotless buffet presentation, and authentic regional flavours. The tasting session matched the wedding spread exactly. Setup started an hour earlier than scheduled which helped avoid any last-minute rush.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "pun-cat-04",
    "businessName": "Koregaon Park Artisanal Banquets",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Koregaon Park",
      "Kharadi",
      "Viman Nagar"
    ],
    "category": "Catering and Food Services",
    "secondaryCategories": [],
    "description": "High-end fusion gourmet spreads, grazing tables, European bistro wedding brunches, and wood-fired artisanal stations.",
    "maximumGuestCapacity": 600,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 1650,
    "priceUnit": "per plate",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Fully Booked",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 14,
    "averageOrderValue90Days": 410000,
    "portfolioImages": [
      "/assets/cat-1.jpg",
      "/assets/cat-2.jpg"
    ],
    "serviceTags": [
      "Grazing Tables",
      "Bistro Brunches",
      "Wood-fired Stations"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-cat-04.demo.wedora.in",
    "contactPhone": "+91 98000 0003",
    "serviceOfferings": [
      "Buffet Catering",
      "Live Counters",
      "Tasting Sessions",
      "Custom Menus",
      "Professional Waitstaff"
    ],
    "repeatOrdersArea": {
      "Koregaon Park": 3,
      "Kharadi": 3,
      "Viman Nagar": 2
    },
    "referralsArea": {
      "Koregaon Park": 5,
      "Kharadi": 5,
      "Viman Nagar": 4
    },
    "repeatOrdersTotal": 8,
    "referralsTotal": 14,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 63,
    "successfulReferralBookings": 14,
    "repeatCustomerBookings": 8,
    "onTimeDeliveryPercent": 98,
    "verifiedCustomerFeedbackCount": 21,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Koregaon Park": 16,
      "Kharadi": 16,
      "Viman Nagar": 22
    },
    "customerFeedback": [
      {
        "id": "fb-pun-cat-04-1",
        "customerName": "C. Gaikwad",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Koregaon Park, Pune",
        "comment": "Professional service staff, spotless buffet presentation, and authentic regional flavours. The tasting session matched the wedding spread exactly. Setup started an hour earlier than scheduled which helped avoid any last-minute rush.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-pun-cat-04-2",
        "customerName": "A. Patil",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Kharadi, Pune",
        "comment": "The fusion menu and mocktail bar kept all our guests thrilled. Portions were generous with zero food wastage. Live pasta station line moved slightly slow during peak hours due to customized orders.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-cat-04-3",
        "customerName": "D. Shinde",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Viman Nagar, Pune",
        "comment": "Food quality and live chaat counters were exceptional. Our guests especially loved the hot appetizers and traditional dessert spread. Beverage refills at the far dining section had a brief delay during peak dinner rush, but the floor manager resolved it quickly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "pun-cat-05",
    "businessName": "Shree Ganesh Pure Veg Caterers",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Hadapsar",
      "Magarpatta",
      "Kharadi"
    ],
    "category": "Catering and Food Services",
    "secondaryCategories": [],
    "description": "Flawless pure veg catering for Marwari, Gujarati, and Jain weddings with over 40 live specialties.",
    "maximumGuestCapacity": 1000,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 900,
    "priceUnit": "per plate",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-22": "Available"
    },
    "completedOrders90Days": 18,
    "averageOrderValue90Days": 280000,
    "portfolioImages": [
      "/assets/cat-1.jpg",
      "/assets/cat-2.jpg"
    ],
    "serviceTags": [
      "Pure Vegetarian",
      "Jain Specialties",
      "Live Counters"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-cat-05.demo.wedora.in",
    "contactPhone": "+91 98000 0004",
    "serviceOfferings": [
      "Buffet Catering",
      "Live Counters",
      "Tasting Sessions",
      "Custom Menus",
      "Professional Waitstaff"
    ],
    "repeatOrdersArea": {
      "Hadapsar": 4,
      "Magarpatta": 4,
      "Kharadi": 3
    },
    "referralsArea": {
      "Hadapsar": 6,
      "Magarpatta": 7,
      "Kharadi": 6
    },
    "repeatOrdersTotal": 11,
    "referralsTotal": 19,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 80,
    "successfulReferralBookings": 19,
    "repeatCustomerBookings": 11,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 27,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Hadapsar": 20,
      "Magarpatta": 20,
      "Kharadi": 28
    },
    "customerFeedback": [
      {
        "id": "fb-pun-cat-05-1",
        "customerName": "A. Banerjee",
        "eventType": "Mehendi Celebration",
        "location": "Hadapsar, Pune",
        "comment": "The fusion menu and mocktail bar kept all our guests thrilled. Portions were generous with zero food wastage. Live pasta station line moved slightly slow during peak hours due to customized orders.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-cat-05-2",
        "customerName": "S. Kulkarni",
        "eventType": "Mehendi Celebration",
        "location": "Magarpatta, Pune",
        "comment": "Food quality and live chaat counters were exceptional. Our guests especially loved the hot appetizers and traditional dessert spread. Beverage refills at the far dining section had a brief delay during peak dinner rush, but the floor manager resolved it quickly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "pun-cat-06",
    "businessName": "Flavours of Maharashtra Catering Co.",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Pimpri-Chinchwad",
      "Hinjewadi",
      "Wakad"
    ],
    "category": "Catering and Food Services",
    "secondaryCategories": [],
    "description": "Regional Maharashtrian specialties, Kolhapuri live grills, coastal solkadhi counters, and festive sweets.",
    "maximumGuestCapacity": 650,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 1050,
    "priceUnit": "per plate",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Fully Booked",
      "2026-12-19": "Available"
    },
    "completedOrders90Days": 12,
    "averageOrderValue90Days": 250000,
    "portfolioImages": [
      "/assets/cat-1.jpg",
      "/assets/cat-2.jpg"
    ],
    "serviceTags": [
      "Regional Maharashtrian",
      "Live Grills",
      "Festive Sweets"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-cat-06.demo.wedora.in",
    "contactPhone": "+91 98000 0005",
    "serviceOfferings": [
      "Buffet Catering",
      "Live Counters",
      "Tasting Sessions",
      "Custom Menus",
      "Professional Waitstaff"
    ],
    "repeatOrdersArea": {
      "Pimpri-Chinchwad": 3,
      "Hinjewadi": 3,
      "Wakad": 2
    },
    "referralsArea": {
      "Pimpri-Chinchwad": 4,
      "Hinjewadi": 5,
      "Wakad": 4
    },
    "repeatOrdersTotal": 8,
    "referralsTotal": 13,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 53,
    "successfulReferralBookings": 13,
    "repeatCustomerBookings": 8,
    "onTimeDeliveryPercent": 93,
    "verifiedCustomerFeedbackCount": 19,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Pimpri-Chinchwad": 13,
      "Hinjewadi": 13,
      "Wakad": 19
    },
    "customerFeedback": [
      {
        "id": "fb-pun-cat-06-1",
        "customerName": "S. More",
        "eventType": "Grand Reception",
        "location": "Pimpri-Chinchwad, Pune",
        "comment": "Food quality and live chaat counters were exceptional. Our guests especially loved the hot appetizers and traditional dessert spread. Beverage refills at the far dining section had a brief delay during peak dinner rush, but the floor manager resolved it quickly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-cat-06-2",
        "customerName": "V. Mehta",
        "eventType": "Grand Reception",
        "location": "Hinjewadi, Pune",
        "comment": "Professional service staff, spotless buffet presentation, and authentic regional flavours. The tasting session matched the wedding spread exactly. Setup started an hour earlier than scheduled which helped avoid any last-minute rush.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-pun-cat-06-3",
        "customerName": "C. Gaikwad",
        "eventType": "Grand Reception",
        "location": "Wakad, Pune",
        "comment": "The fusion menu and mocktail bar kept all our guests thrilled. Portions were generous with zero food wastage. Live pasta station line moved slightly slow during peak hours due to customized orders.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "pun-cat-07",
    "businessName": "Saffron & Sage Gourmet Caterers",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Baner",
      "Aundh",
      "Shivajinagar"
    ],
    "category": "Catering and Food Services",
    "secondaryCategories": [],
    "description": "Contemporary farm-to-table organic wedding banquets, artisanal salads, and interactive cocktail bars.",
    "maximumGuestCapacity": 450,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 1400,
    "priceUnit": "per plate",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-21": "Available"
    },
    "completedOrders90Days": 0,
    "averageOrderValue90Days": 0,
    "portfolioImages": [
      "/assets/cat-1.jpg",
      "/assets/cat-2.jpg"
    ],
    "serviceTags": [
      "Organic Farm-to-Table",
      "Boutique Spreads",
      "Artisanal Salads"
    ],
    "isNewToPlatform": true,
    "contactEmail": "contact@pun-cat-07.demo.wedora.in",
    "contactPhone": "+91 98000 0006",
    "serviceOfferings": [
      "Buffet Catering",
      "Live Counters",
      "Tasting Sessions",
      "Custom Menus",
      "Professional Waitstaff"
    ],
    "repeatOrdersArea": {},
    "referralsArea": {},
    "repeatOrdersTotal": 0,
    "referralsTotal": 0,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 0,
    "successfulReferralBookings": 0,
    "repeatCustomerBookings": 0,
    "onTimeDeliveryPercent": 100,
    "verifiedCustomerFeedbackCount": 0,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 100,
    "completedOrdersArea": {},
    "customerFeedback": []
  },
  {
    "id": "pun-dec-01",
    "businessName": "Elegance Floral & Mandap Decor",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Baner",
      "Wakad",
      "Aundh",
      "Hinjewadi"
    ],
    "category": "Decoration Services",
    "secondaryCategories": [
      "Flower Arrangements"
    ],
    "description": "Sophisticated botanical and traditional mandap design studio specializing in fresh rose canopies and carved mandaps.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 240000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 27,
    "averageOrderValue90Days": 280000,
    "portfolioImages": [
      "/assets/dec-1.jpg",
      "/assets/dec-2.jpg"
    ],
    "serviceTags": [
      "Botanical Mandaps",
      "Rose Canopies",
      "Baner/Wakad"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-dec-01.demo.wedora.in",
    "contactPhone": "+91 98000 0007",
    "serviceOfferings": [
      "Theme Decor",
      "Mandap Design",
      "Stage Backdrop",
      "Entrance Installations",
      "Lighting Integration"
    ],
    "repeatOrdersArea": {
      "Baner": 6,
      "Wakad": 5,
      "Aundh": 6,
      "Hinjewadi": 5
    },
    "referralsArea": {
      "Baner": 7,
      "Wakad": 7,
      "Aundh": 7,
      "Hinjewadi": 7
    },
    "repeatOrdersTotal": 22,
    "referralsTotal": 28,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 122,
    "successfulReferralBookings": 28,
    "repeatCustomerBookings": 22,
    "onTimeDeliveryPercent": 98,
    "verifiedCustomerFeedbackCount": 44,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Baner": 24,
      "Wakad": 24,
      "Aundh": 23,
      "Hinjewadi": 33
    },
    "customerFeedback": [
      {
        "id": "fb-pun-dec-01-1",
        "customerName": "T. Agarwal",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Baner, Pune",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-pun-dec-01-2",
        "customerName": "R. Tendulkar",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Wakad, Pune",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "pun-dec-02",
    "businessName": "Rajwada Palace Mandap Setups",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Kothrud",
      "Shivajinagar",
      "Koregaon Park"
    ],
    "category": "Decoration Services",
    "secondaryCategories": [
      "Flower Arrangements"
    ],
    "description": "Majestic royal fortress-themed setups, velvet drapes, antique brass lamps, and traditional entrance gates.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 380000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Fully Booked",
      "2026-12-19": "Available"
    },
    "completedOrders90Days": 29,
    "averageOrderValue90Days": 420000,
    "portfolioImages": [
      "/assets/dec-1.jpg",
      "/assets/dec-2.jpg"
    ],
    "serviceTags": [
      "Palace Themed",
      "Brass Lamps",
      "Fortress Gateways"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-dec-02.demo.wedora.in",
    "contactPhone": "+91 98000 0008",
    "serviceOfferings": [
      "Theme Decor",
      "Mandap Design",
      "Stage Backdrop",
      "Entrance Installations",
      "Lighting Integration"
    ],
    "repeatOrdersArea": {
      "Kothrud": 8,
      "Shivajinagar": 9,
      "Koregaon Park": 8
    },
    "referralsArea": {
      "Kothrud": 10,
      "Shivajinagar": 11,
      "Koregaon Park": 10
    },
    "repeatOrdersTotal": 25,
    "referralsTotal": 31,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 131,
    "successfulReferralBookings": 31,
    "repeatCustomerBookings": 25,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 48,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Kothrud": 33,
      "Shivajinagar": 33,
      "Koregaon Park": 45
    },
    "customerFeedback": [
      {
        "id": "fb-pun-dec-02-1",
        "customerName": "H. Trivedi",
        "eventType": "Mehendi Celebration",
        "location": "Kothrud, Pune",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-dec-02-2",
        "customerName": "V. Kadam",
        "eventType": "Mehendi Celebration",
        "location": "Shivajinagar, Pune",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-dec-02-3",
        "customerName": "N. Nair",
        "eventType": "Mehendi Celebration",
        "location": "Koregaon Park, Pune",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "pun-dec-03",
    "businessName": "Blossom Symphony Event Stylists",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Koregaon Park",
      "Viman Nagar",
      "Kharadi"
    ],
    "category": "Decoration Services",
    "secondaryCategories": [
      "Flower Arrangements"
    ],
    "description": "Pastel dreamscape weddings, cascading orchid chandeliers, mirrored bridal walkways, and fairy light backdrops.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 320000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Unavailable",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 26,
    "averageOrderValue90Days": 350000,
    "portfolioImages": [
      "/assets/dec-1.jpg",
      "/assets/dec-2.jpg"
    ],
    "serviceTags": [
      "Pastel Florals",
      "Orchid Chandeliers",
      "Mirrored Walkways"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-dec-03.demo.wedora.in",
    "contactPhone": "+91 98000 0009",
    "serviceOfferings": [
      "Theme Decor",
      "Mandap Design",
      "Stage Backdrop",
      "Entrance Installations",
      "Lighting Integration"
    ],
    "repeatOrdersArea": {
      "Koregaon Park": 8,
      "Viman Nagar": 8,
      "Kharadi": 7
    },
    "referralsArea": {
      "Koregaon Park": 10,
      "Viman Nagar": 10,
      "Kharadi": 9
    },
    "repeatOrdersTotal": 23,
    "referralsTotal": 29,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 116,
    "successfulReferralBookings": 29,
    "repeatCustomerBookings": 23,
    "onTimeDeliveryPercent": 93,
    "verifiedCustomerFeedbackCount": 44,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Koregaon Park": 29,
      "Viman Nagar": 29,
      "Kharadi": 41
    },
    "customerFeedback": [
      {
        "id": "fb-pun-dec-03-1",
        "customerName": "S. Singhania",
        "eventType": "Grand Reception",
        "location": "Koregaon Park, Pune",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-dec-03-2",
        "customerName": "R. Shah",
        "eventType": "Grand Reception",
        "location": "Viman Nagar, Pune",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "pun-dec-04",
    "businessName": "Vedic Flora Traditional Decor",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Hadapsar",
      "Magarpatta",
      "Kothrud"
    ],
    "category": "Decoration Services",
    "secondaryCategories": [
      "Flower Arrangements"
    ],
    "description": "Auspicious temple-style wedding decor featuring fresh marigolds, lotus motifs, brass urli setups, and mango leaves.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 160000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Fully Booked",
      "2026-12-17": "Available"
    },
    "completedOrders90Days": 37,
    "averageOrderValue90Days": 190000,
    "portfolioImages": [
      "/assets/dec-1.jpg",
      "/assets/dec-2.jpg"
    ],
    "serviceTags": [
      "Temple Style",
      "Marigold Mandap",
      "Brass Urli"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-dec-04.demo.wedora.in",
    "contactPhone": "+91 98000 0010",
    "serviceOfferings": [
      "Theme Decor",
      "Mandap Design",
      "Stage Backdrop",
      "Entrance Installations",
      "Lighting Integration"
    ],
    "repeatOrdersArea": {
      "Hadapsar": 12,
      "Magarpatta": 12,
      "Kothrud": 11
    },
    "referralsArea": {
      "Hadapsar": 15,
      "Magarpatta": 15,
      "Kothrud": 14
    },
    "repeatOrdersTotal": 35,
    "referralsTotal": 44,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 169,
    "successfulReferralBookings": 44,
    "repeatCustomerBookings": 35,
    "onTimeDeliveryPercent": 94,
    "verifiedCustomerFeedbackCount": 66,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Hadapsar": 42,
      "Magarpatta": 43,
      "Kothrud": 59
    },
    "customerFeedback": [
      {
        "id": "fb-pun-dec-04-1",
        "customerName": "M. Parekh",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Hadapsar, Pune",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-dec-04-2",
        "customerName": "M. Joshi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Magarpatta, Pune",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-dec-04-3",
        "customerName": "H. Trivedi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Kothrud, Pune",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "pun-dec-05",
    "businessName": "Modern Grace Stage & Floral Studio",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Pimpri-Chinchwad",
      "Hinjewadi",
      "Wakad"
    ],
    "category": "Decoration Services",
    "secondaryCategories": [
      "Flower Arrangements"
    ],
    "description": "Modern geometric floral arches, LED infinity tunnels, sangeet party stage backdrops, and photobooth styling.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 210000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Unavailable",
      "2026-12-21": "Available"
    },
    "completedOrders90Days": 11,
    "averageOrderValue90Days": 230000,
    "portfolioImages": [
      "/assets/dec-1.jpg",
      "/assets/dec-2.jpg"
    ],
    "serviceTags": [
      "Geometric Arches",
      "LED Infinity Tunnels",
      "Sangeet Stages"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-dec-05.demo.wedora.in",
    "contactPhone": "+91 98000 0011",
    "serviceOfferings": [
      "Theme Decor",
      "Mandap Design",
      "Stage Backdrop",
      "Entrance Installations",
      "Lighting Integration"
    ],
    "repeatOrdersArea": {
      "Pimpri-Chinchwad": 2,
      "Hinjewadi": 2,
      "Wakad": 2
    },
    "referralsArea": {
      "Pimpri-Chinchwad": 5,
      "Hinjewadi": 5,
      "Wakad": 4
    },
    "repeatOrdersTotal": 6,
    "referralsTotal": 14,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 52,
    "successfulReferralBookings": 14,
    "repeatCustomerBookings": 6,
    "onTimeDeliveryPercent": 95,
    "verifiedCustomerFeedbackCount": 21,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 96,
    "completedOrdersArea": {
      "Pimpri-Chinchwad": 13,
      "Hinjewadi": 13,
      "Wakad": 18
    },
    "customerFeedback": [
      {
        "id": "fb-pun-dec-05-1",
        "customerName": "A. Patil",
        "eventType": "Wedding Ceremony",
        "location": "Pimpri-Chinchwad, Pune",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-dec-05-2",
        "customerName": "D. Shinde",
        "eventType": "Wedding Ceremony",
        "location": "Hinjewadi, Pune",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "pun-dec-06",
    "businessName": "Aura Blossoms & Styling",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Baner",
      "Aundh",
      "Shivajinagar"
    ],
    "category": "Decoration Services",
    "secondaryCategories": [
      "Flower Arrangements"
    ],
    "description": "Eco-chic botanical styling with potted plants, dry florals, and sustainable hanging installations.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 190000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-23": "Available"
    },
    "completedOrders90Days": 2,
    "averageOrderValue90Days": 0,
    "portfolioImages": [
      "/assets/dec-1.jpg",
      "/assets/dec-2.jpg"
    ],
    "serviceTags": [
      "Eco Chic",
      "Potted Plants",
      "Dry Florals"
    ],
    "isNewToPlatform": true,
    "contactEmail": "contact@pun-dec-06.demo.wedora.in",
    "contactPhone": "+91 98000 0012",
    "serviceOfferings": [
      "Theme Decor",
      "Mandap Design",
      "Stage Backdrop",
      "Entrance Installations",
      "Lighting Integration"
    ],
    "repeatOrdersArea": {
      "Baner": 0
    },
    "referralsArea": {
      "Baner": 1
    },
    "repeatOrdersTotal": 0,
    "referralsTotal": 1,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 2,
    "successfulReferralBookings": 1,
    "repeatCustomerBookings": 0,
    "onTimeDeliveryPercent": 100,
    "verifiedCustomerFeedbackCount": 1,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 100,
    "completedOrdersArea": {
      "Baner": 2
    },
    "customerFeedback": [
      {
        "id": "fb-pun-dec-06-1",
        "customerName": "A. Patil",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Baner, Pune",
        "comment": "A very promising new team on Wedora! They communicated with high enthusiasm and delivered our engagement setup flawlessly on time.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "pun-djs-01",
    "businessName": "DJ Tejas & Pulsar Audio Systems",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Baner",
      "Wakad",
      "Aundh",
      "Hinjewadi"
    ],
    "category": "DJ and Sound Systems",
    "secondaryCategories": [],
    "description": "Top Pune wedding DJ, concert JBL Line Array setups, earth-shaking subwoofers, and energizing Punjabi/Bollywood music.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 95000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 28,
    "averageOrderValue90Days": 135000,
    "portfolioImages": [
      "/assets/djs-1.jpg",
      "/assets/djs-2.jpg"
    ],
    "serviceTags": [
      "Wedding DJ",
      "JBL Line Array",
      "Baraat Sounds",
      "Sangeet Specialist"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-djs-01.demo.wedora.in",
    "contactPhone": "+91 98000 0017",
    "serviceOfferings": [
      "Line Array Sound System",
      "Celebrity DJ Performances",
      "Live Dhol Players",
      "Wireless Mic Kits",
      "Digital Sound Console"
    ],
    "repeatOrdersArea": {
      "Baner": 6,
      "Wakad": 6,
      "Aundh": 6,
      "Hinjewadi": 6
    },
    "referralsArea": {
      "Baner": 10,
      "Wakad": 9,
      "Aundh": 10,
      "Hinjewadi": 9
    },
    "repeatOrdersTotal": 24,
    "referralsTotal": 38,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 127,
    "successfulReferralBookings": 38,
    "repeatCustomerBookings": 24,
    "onTimeDeliveryPercent": 95,
    "verifiedCustomerFeedbackCount": 57,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Baner": 25,
      "Wakad": 24,
      "Aundh": 25,
      "Hinjewadi": 34
    },
    "customerFeedback": [
      {
        "id": "fb-pun-djs-01-1",
        "customerName": "H. Trivedi",
        "eventType": "Mehendi Celebration",
        "location": "Baner, Pune",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-djs-01-2",
        "customerName": "V. Kadam",
        "eventType": "Mehendi Celebration",
        "location": "Wakad, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-djs-01-3",
        "customerName": "N. Nair",
        "eventType": "Mehendi Celebration",
        "location": "Aundh, Pune",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "pun-djs-02",
    "businessName": "SoundVibe Live Acoustic & Stage Audio",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Koregaon Park",
      "Viman Nagar",
      "Kharadi"
    ],
    "category": "DJ and Sound Systems",
    "secondaryCategories": [],
    "description": "Pristine sound engineering for musical pheras, live Sufi bands, sangeet performances, and cordless mic setups.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 80000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available"
    },
    "completedOrders90Days": 23,
    "averageOrderValue90Days": 110000,
    "portfolioImages": [
      "/assets/djs-1.jpg",
      "/assets/djs-2.jpg"
    ],
    "serviceTags": [
      "Live Sound Engineering",
      "Musical Pheras",
      "Sufi Band Audio"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-djs-02.demo.wedora.in",
    "contactPhone": "+91 98000 0018",
    "serviceOfferings": [
      "Line Array Sound System",
      "Celebrity DJ Performances",
      "Live Dhol Players",
      "Wireless Mic Kits",
      "Digital Sound Console"
    ],
    "repeatOrdersArea": {
      "Koregaon Park": 7,
      "Viman Nagar": 7,
      "Kharadi": 7
    },
    "referralsArea": {
      "Koregaon Park": 11,
      "Viman Nagar": 11,
      "Kharadi": 10
    },
    "repeatOrdersTotal": 21,
    "referralsTotal": 32,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 104,
    "successfulReferralBookings": 32,
    "repeatCustomerBookings": 21,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 48,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Koregaon Park": 26,
      "Viman Nagar": 26,
      "Kharadi": 36
    },
    "customerFeedback": [
      {
        "id": "fb-pun-djs-02-1",
        "customerName": "S. Singhania",
        "eventType": "Grand Reception",
        "location": "Koregaon Park, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-djs-02-2",
        "customerName": "R. Shah",
        "eventType": "Grand Reception",
        "location": "Viman Nagar, Pune",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "pun-djs-03",
    "businessName": "Bassline DJ & LED Visual Walls",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Kothrud",
      "Shivajinagar",
      "Pimpri-Chinchwad"
    ],
    "category": "DJ and Sound Systems",
    "secondaryCategories": [],
    "description": "DJ booth with synchronized P3 LED video backdrops, club laser light shows, and high energy interactive emcees.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 125000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-22": "Available"
    },
    "completedOrders90Days": 21,
    "averageOrderValue90Days": 155000,
    "portfolioImages": [
      "/assets/djs-1.jpg",
      "/assets/djs-2.jpg"
    ],
    "serviceTags": [
      "LED Video Walls",
      "Laser Show",
      "Interactive Emcee"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-djs-03.demo.wedora.in",
    "contactPhone": "+91 98000 0019",
    "serviceOfferings": [
      "Line Array Sound System",
      "Celebrity DJ Performances",
      "Live Dhol Players",
      "Wireless Mic Kits",
      "Digital Sound Console"
    ],
    "repeatOrdersArea": {
      "Kothrud": 7,
      "Shivajinagar": 7,
      "Pimpri-Chinchwad": 6
    },
    "referralsArea": {
      "Kothrud": 10,
      "Shivajinagar": 11,
      "Pimpri-Chinchwad": 10
    },
    "repeatOrdersTotal": 20,
    "referralsTotal": 31,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 97,
    "successfulReferralBookings": 31,
    "repeatCustomerBookings": 20,
    "onTimeDeliveryPercent": 97,
    "verifiedCustomerFeedbackCount": 46,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Kothrud": 24,
      "Shivajinagar": 24,
      "Pimpri-Chinchwad": 34
    },
    "customerFeedback": [
      {
        "id": "fb-pun-djs-03-1",
        "customerName": "M. Parekh",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Kothrud, Pune",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-djs-03-2",
        "customerName": "M. Joshi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Shivajinagar, Pune",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-djs-03-3",
        "customerName": "H. Trivedi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Pimpri-Chinchwad, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "pun-djs-04",
    "businessName": "Dhol Tasha & Traditional Rhythm Ensemble",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Hadapsar",
      "Magarpatta",
      "Wakad",
      "Baner"
    ],
    "category": "DJ and Sound Systems",
    "secondaryCategories": [],
    "description": "Authentic 21-member Puneri Dhol Tasha pathak, brass band, and shehnai players for grand traditional baraats.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 65000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-17": "Available"
    },
    "completedOrders90Days": 30,
    "averageOrderValue90Days": 80000,
    "portfolioImages": [
      "/assets/djs-1.jpg",
      "/assets/djs-2.jpg"
    ],
    "serviceTags": [
      "Puneri Dhol Tasha",
      "Grand Baraat",
      "Live Shehnai"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-djs-04.demo.wedora.in",
    "contactPhone": "+91 98000 0020",
    "serviceOfferings": [
      "Line Array Sound System",
      "Celebrity DJ Performances",
      "Live Dhol Players",
      "Wireless Mic Kits",
      "Digital Sound Console"
    ],
    "repeatOrdersArea": {
      "Hadapsar": 4,
      "Magarpatta": 4,
      "Wakad": 5,
      "Baner": 4
    },
    "referralsArea": {
      "Hadapsar": 8,
      "Magarpatta": 7,
      "Wakad": 8,
      "Baner": 7
    },
    "repeatOrdersTotal": 17,
    "referralsTotal": 30,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 138,
    "successfulReferralBookings": 30,
    "repeatCustomerBookings": 17,
    "onTimeDeliveryPercent": 98,
    "verifiedCustomerFeedbackCount": 66,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Hadapsar": 27,
      "Magarpatta": 26,
      "Wakad": 27,
      "Baner": 37
    },
    "customerFeedback": [
      {
        "id": "fb-pun-djs-04-1",
        "customerName": "A. Patil",
        "eventType": "Wedding Ceremony",
        "location": "Hadapsar, Pune",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-djs-04-2",
        "customerName": "D. Shinde",
        "eventType": "Wedding Ceremony",
        "location": "Magarpatta, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "pun-djs-05",
    "businessName": "Viman Beat Pro Audio & Wedding DJ System",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Viman Nagar",
      "Koregaon Park",
      "Kharadi",
      "Hadapsar"
    ],
    "category": "DJ and Sound Systems",
    "secondaryCategories": [
      "Lighting Services"
    ],
    "description": "Pioneer Nexus DJ setups, high-fidelity RCF line array speakers, Punjabi Dhol troupe, and customized bridal entrance tracks.",
    "serviceOfferings": [
      "Line Array Sound System",
      "Celebrity DJ Performances",
      "Live Dhol Players",
      "Wireless Mic Kits",
      "Digital Sound Console"
    ],
    "maximumSimultaneousBookings": 2,
    "startingPrice": 44000,
    "priceUnit": "per evening",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 25,
    "repeatOrdersArea": {
      "Viman Nagar": 4,
      "Koregaon Park": 4,
      "Kharadi": 4,
      "Hadapsar": 3
    },
    "referralsArea": {
      "Viman Nagar": 7,
      "Koregaon Park": 6,
      "Kharadi": 7,
      "Hadapsar": 6
    },
    "repeatOrdersTotal": 15,
    "referralsTotal": 26,
    "portfolioImages": [
      "/assets/djs-1.jpg"
    ],
    "serviceTags": [
      "Pioneer Nexus",
      "RCF Sound",
      "Dhol Troupe",
      "Bridal Tracks"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-djs-05.demo.wedora.in",
    "contactPhone": "+91 98000 0075",
    "averageOrderValue90Days": 330000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 115,
    "successfulReferralBookings": 26,
    "repeatCustomerBookings": 15,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 56,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Viman Nagar": 22,
      "Koregaon Park": 22,
      "Kharadi": 23,
      "Hadapsar": 31
    },
    "customerFeedback": [
      {
        "id": "fb-pun-djs-05-1",
        "customerName": "S. Kulkarni",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Viman Nagar, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-pun-djs-05-2",
        "customerName": "G. Bhosale",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Koregaon Park, Pune",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-djs-05-3",
        "customerName": "M. Parekh",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Kharadi, Pune",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "pun-e2e-01",
    "businessName": "Imperial Knots End-to-End Wedding Management",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Baner",
      "Wakad",
      "Kothrud",
      "Aundh",
      "Shivajinagar"
    ],
    "category": "End-to-End Event Management",
    "secondaryCategories": [
      "Catering and Food Services",
      "Decoration and Flower Arrangements",
      "Lighting Services",
      "DJ and Sound Systems",
      "Wedding Lawns and Venues",
      "Hotels, Lodging and Guest Accommodation",
      "Logistics and Transportation"
    ],
    "description": "Comprehensive turnkey event management orchestrating venue booking, royal catering, magnificent stage and mandap decor, DJ/sound, and guest lodging.",
    "maximumGuestCapacity": 1800,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 1100000,
    "priceUnit": "turnkey package",
    "quotationRequired": true,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 16,
    "averageOrderValue90Days": 1650000,
    "portfolioImages": [
      "/assets/e2e-1.jpg",
      "/assets/e2e-2.jpg"
    ],
    "serviceTags": [
      "End-to-End Event Management",
      "Full Turnkey Production",
      "Master Vendor Coordination"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-e2e-01.demo.wedora.in",
    "contactPhone": "+91 98000 0043",
    "serviceOfferings": [
      "Complete Turnkey Wedding Management",
      "Hospitality & Logistics",
      "Full Vendor Supervision",
      "Production & Decor Oversight"
    ],
    "repeatOrdersArea": {
      "Baner": 3,
      "Wakad": 3,
      "Kothrud": 3,
      "Aundh": 3,
      "Shivajinagar": 3
    },
    "referralsArea": {
      "Baner": 4,
      "Wakad": 4,
      "Kothrud": 4,
      "Aundh": 5,
      "Shivajinagar": 4
    },
    "repeatOrdersTotal": 15,
    "referralsTotal": 21,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 74,
    "successfulReferralBookings": 21,
    "repeatCustomerBookings": 15,
    "onTimeDeliveryPercent": 93,
    "verifiedCustomerFeedbackCount": 36,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Baner": 12,
      "Wakad": 12,
      "Kothrud": 11,
      "Aundh": 12,
      "Shivajinagar": 16
    },
    "customerFeedback": [
      {
        "id": "fb-pun-e2e-01-1",
        "customerName": "S. Singhania",
        "eventType": "Grand Reception",
        "location": "Baner, Pune",
        "comment": "Reduced our family stress to zero. Budget tracker and daily checklists were transparent and meticulously maintained. Bride side car coordination had minor confusion that was rectified promptly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-e2e-01-2",
        "customerName": "R. Shah",
        "eventType": "Grand Reception",
        "location": "Wakad, Pune",
        "comment": "Masterful crowd control and welcoming hospitality for our 800+ guests. Every vendor delivered on time under their watch. Pre-wedding rehearsal was brief, but the main day execution went smoothly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "pun-e2e-02",
    "businessName": "Pune Grand Heritage End-to-End Productions",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Koregaon Park",
      "Kharadi",
      "Viman Nagar",
      "Hadapsar",
      "Magarpatta"
    ],
    "category": "End-to-End Event Management",
    "secondaryCategories": [
      "Catering and Food Services",
      "Decoration and Flower Arrangements",
      "Photography and Videography",
      "Lighting Services",
      "DJ and Sound Systems"
    ],
    "description": "End-to-end luxury wedding management coordinating all catering, floral sets, cinematography, sound, accommodation, and fleet logistics.",
    "maximumGuestCapacity": 1200,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 900000,
    "priceUnit": "turnkey package",
    "quotationRequired": true,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-19": "Available"
    },
    "completedOrders90Days": 16,
    "averageOrderValue90Days": 1350000,
    "portfolioImages": [
      "/assets/e2e-1.jpg",
      "/assets/e2e-2.jpg"
    ],
    "serviceTags": [
      "End-to-End Event Management",
      "All-Inclusive Packages",
      "Complete Wedding Journey"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-e2e-02.demo.wedora.in",
    "contactPhone": "+91 98000 0044",
    "serviceOfferings": [
      "Complete Turnkey Wedding Management",
      "Hospitality & Logistics",
      "Full Vendor Supervision",
      "Production & Decor Oversight"
    ],
    "repeatOrdersArea": {
      "Koregaon Park": 3,
      "Kharadi": 3,
      "Viman Nagar": 3,
      "Hadapsar": 3,
      "Magarpatta": 3
    },
    "referralsArea": {
      "Koregaon Park": 4,
      "Kharadi": 4,
      "Viman Nagar": 4,
      "Hadapsar": 5,
      "Magarpatta": 4
    },
    "repeatOrdersTotal": 15,
    "referralsTotal": 21,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 71,
    "successfulReferralBookings": 21,
    "repeatCustomerBookings": 15,
    "onTimeDeliveryPercent": 94,
    "verifiedCustomerFeedbackCount": 35,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Koregaon Park": 11,
      "Kharadi": 11,
      "Viman Nagar": 11,
      "Hadapsar": 11,
      "Magarpatta": 16
    },
    "customerFeedback": [
      {
        "id": "fb-pun-e2e-02-1",
        "customerName": "M. Parekh",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Koregaon Park, Pune",
        "comment": "Masterful crowd control and welcoming hospitality for our 800+ guests. Every vendor delivered on time under their watch. Pre-wedding rehearsal was brief, but the main day execution went smoothly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-e2e-02-2",
        "customerName": "M. Joshi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Kharadi, Pune",
        "comment": "Flawless end-to-end orchestration! They kept the pandit, caterers, and sound engineers perfectly in sync throughout. Varmala stage entry timing was pushed back by 15 minutes due to guest arrival traffic.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-e2e-02-3",
        "customerName": "H. Trivedi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Viman Nagar, Pune",
        "comment": "Reduced our family stress to zero. Budget tracker and daily checklists were transparent and meticulously maintained. Bride side car coordination had minor confusion that was rectified promptly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "pun-e2e-03",
    "businessName": "Sankalp Complete Event Management",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Pimpri-Chinchwad",
      "Wakad",
      "Hinjewadi",
      "Baner"
    ],
    "category": "End-to-End Event Management",
    "secondaryCategories": [
      "Catering and Food Services",
      "Decoration and Flower Arrangements",
      "Hotels, Lodging and Guest Accommodation",
      "Logistics and Transportation"
    ],
    "description": "Turnkey wedding execution specializing in seamless vendor synchronization, stage production, feast catering, and guest transit.",
    "maximumGuestCapacity": 1000,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 800000,
    "priceUnit": "turnkey package",
    "quotationRequired": true,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-17": "Available"
    },
    "completedOrders90Days": 14,
    "averageOrderValue90Days": 1180000,
    "portfolioImages": [
      "/assets/e2e-1.jpg",
      "/assets/e2e-2.jpg"
    ],
    "serviceTags": [
      "End-to-End Event Management",
      "Seamless Sync",
      "Turnkey Execution"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-e2e-03.demo.wedora.in",
    "contactPhone": "+91 98000 0045",
    "serviceOfferings": [
      "Complete Turnkey Wedding Management",
      "Hospitality & Logistics",
      "Full Vendor Supervision",
      "Production & Decor Oversight"
    ],
    "repeatOrdersArea": {
      "Pimpri-Chinchwad": 2,
      "Wakad": 2,
      "Hinjewadi": 2,
      "Baner": 2
    },
    "referralsArea": {
      "Pimpri-Chinchwad": 5,
      "Wakad": 5,
      "Hinjewadi": 5,
      "Baner": 4
    },
    "repeatOrdersTotal": 8,
    "referralsTotal": 19,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 64,
    "successfulReferralBookings": 19,
    "repeatCustomerBookings": 8,
    "onTimeDeliveryPercent": 95,
    "verifiedCustomerFeedbackCount": 20,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 96,
    "completedOrdersArea": {
      "Pimpri-Chinchwad": 12,
      "Wakad": 12,
      "Hinjewadi": 13,
      "Baner": 17
    },
    "customerFeedback": [
      {
        "id": "fb-pun-e2e-03-1",
        "customerName": "A. Patil",
        "eventType": "Wedding Ceremony",
        "location": "Pimpri-Chinchwad, Pune",
        "comment": "Flawless end-to-end orchestration! They kept the pandit, caterers, and sound engineers perfectly in sync throughout. Varmala stage entry timing was pushed back by 15 minutes due to guest arrival traffic.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-e2e-03-2",
        "customerName": "D. Shinde",
        "eventType": "Wedding Ceremony",
        "location": "Wakad, Pune",
        "comment": "Reduced our family stress to zero. Budget tracker and daily checklists were transparent and meticulously maintained. Bride side car coordination had minor confusion that was rectified promptly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "pun-e2e-04",
    "businessName": "Maratha Heritage Turnkey Wedding Planners",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Shivajinagar",
      "Kothrud",
      "Baner",
      "Aundh"
    ],
    "category": "End-to-End Event Management",
    "secondaryCategories": [
      "Event Organizers / Wedding Planners",
      "Decoration Services"
    ],
    "description": "Authentic royal Peshwai and modern turnkey wedding orchestration, complete vendor coordination, traditional hospitality, and on-site timeline director.",
    "serviceOfferings": [
      "Complete Turnkey Wedding Management",
      "Hospitality & Logistics",
      "Full Vendor Supervision",
      "Production & Decor Oversight"
    ],
    "maximumGuestCapacity": 1400,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 260000,
    "priceUnit": "turnkey management fee",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 18,
    "repeatOrdersArea": {
      "Shivajinagar": 3,
      "Kothrud": 3,
      "Baner": 3,
      "Aundh": 2
    },
    "referralsArea": {
      "Shivajinagar": 6,
      "Kothrud": 6,
      "Baner": 7,
      "Aundh": 6
    },
    "repeatOrdersTotal": 11,
    "referralsTotal": 25,
    "portfolioImages": [
      "/assets/org-1.jpg"
    ],
    "serviceTags": [
      "Turnkey Orchestration",
      "Peshwai Hospitality",
      "Timeline Director",
      "Vendor Coordination"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-e2e-04.demo.wedora.in",
    "contactPhone": "+91 98000 0079",
    "averageOrderValue90Days": 270000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 81,
    "successfulReferralBookings": 25,
    "repeatCustomerBookings": 11,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 27,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Shivajinagar": 16,
      "Kothrud": 16,
      "Baner": 15,
      "Aundh": 22
    },
    "customerFeedback": [
      {
        "id": "fb-pun-e2e-04-1",
        "customerName": "S. Kulkarni",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Shivajinagar, Pune",
        "comment": "Reduced our family stress to zero. Budget tracker and daily checklists were transparent and meticulously maintained. Bride side car coordination had minor confusion that was rectified promptly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-pun-e2e-04-2",
        "customerName": "G. Bhosale",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Kothrud, Pune",
        "comment": "Masterful crowd control and welcoming hospitality for our 800+ guests. Every vendor delivered on time under their watch. Pre-wedding rehearsal was brief, but the main day execution went smoothly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-e2e-04-3",
        "customerName": "M. Parekh",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Baner, Pune",
        "comment": "Flawless end-to-end orchestration! They kept the pandit, caterers, and sound engineers perfectly in sync throughout. Varmala stage entry timing was pushed back by 15 minutes due to guest arrival traffic.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "pun-e2e-05",
    "businessName": "Serene Vows Turnkey Event Productions Pune",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Koregaon Park",
      "Kharadi",
      "Viman Nagar",
      "Hadapsar"
    ],
    "category": "End-to-End Event Management",
    "secondaryCategories": [
      "Event Organizers / Wedding Planners"
    ],
    "description": "Boutique end-to-end luxury wedding management, curated entertainment, milestone tracking, and seamless hospitality from arrival to departure.",
    "serviceOfferings": [
      "Complete Turnkey Wedding Management",
      "Hospitality & Logistics",
      "Full Vendor Supervision",
      "Production & Decor Oversight"
    ],
    "maximumGuestCapacity": 900,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 310000,
    "priceUnit": "turnkey management fee",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-25": "Available"
    },
    "completedOrders90Days": 15,
    "repeatOrdersArea": {
      "Koregaon Park": 3,
      "Kharadi": 2,
      "Viman Nagar": 3,
      "Hadapsar": 2
    },
    "referralsArea": {
      "Koregaon Park": 6,
      "Kharadi": 5,
      "Viman Nagar": 6,
      "Hadapsar": 5
    },
    "repeatOrdersTotal": 10,
    "referralsTotal": 22,
    "portfolioImages": [
      "/assets/org-2.jpg"
    ],
    "serviceTags": [
      "Boutique Turnkey",
      "Curated Entertainment",
      "Milestone Tracking",
      "Guest Management"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-e2e-05.demo.wedora.in",
    "contactPhone": "+91 98000 0080",
    "averageOrderValue90Days": 210000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 70,
    "successfulReferralBookings": 22,
    "repeatCustomerBookings": 10,
    "onTimeDeliveryPercent": 97,
    "verifiedCustomerFeedbackCount": 24,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Koregaon Park": 14,
      "Kharadi": 14,
      "Viman Nagar": 13,
      "Hadapsar": 19
    },
    "customerFeedback": [
      {
        "id": "fb-pun-e2e-05-1",
        "customerName": "V. Mehta",
        "eventType": "Mehendi Celebration",
        "location": "Koregaon Park, Pune",
        "comment": "Masterful crowd control and welcoming hospitality for our 800+ guests. Every vendor delivered on time under their watch. Pre-wedding rehearsal was brief, but the main day execution went smoothly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-e2e-05-2",
        "customerName": "C. Gaikwad",
        "eventType": "Mehendi Celebration",
        "location": "Kharadi, Pune",
        "comment": "Flawless end-to-end orchestration! They kept the pandit, caterers, and sound engineers perfectly in sync throughout. Varmala stage entry timing was pushed back by 15 minutes due to guest arrival traffic.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "pun-flw-01",
    "businessName": "Shubharambh Fresh Floral Curators Pune",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Baner",
      "Wakad",
      "Aundh",
      "Hinjewadi"
    ],
    "category": "Flower Arrangements",
    "secondaryCategories": [
      "Decoration Services"
    ],
    "description": "Traditional Maharashtrian zendu phool mandaps, fresh mogra jhumars, rose petal showers, and fragrant varmala sets.",
    "serviceOfferings": [
      "Exotic Floral Mandaps",
      "Bridal Bouquets",
      "Fresh Floral Canopies",
      "Varmala Design",
      "Floral Centerpieces"
    ],
    "maximumSimultaneousBookings": 4,
    "startingPrice": 42000,
    "priceUnit": "per wedding",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 16,
    "repeatOrdersArea": {
      "Baner": 3,
      "Wakad": 3,
      "Aundh": 3,
      "Hinjewadi": 3
    },
    "referralsArea": {
      "Baner": 6,
      "Wakad": 6,
      "Aundh": 6,
      "Hinjewadi": 5
    },
    "repeatOrdersTotal": 12,
    "referralsTotal": 23,
    "portfolioImages": [
      "/assets/flw-1.jpg"
    ],
    "serviceTags": [
      "Zendu Phool",
      "Mogra Jhumars",
      "Rose Petal Shower",
      "Maharashtrian Mandap"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-flw-01.demo.wedora.in",
    "contactPhone": "+91 98000 0069",
    "averageOrderValue90Days": 270000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 71,
    "successfulReferralBookings": 23,
    "repeatCustomerBookings": 12,
    "onTimeDeliveryPercent": 95,
    "verifiedCustomerFeedbackCount": 25,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 96,
    "completedOrdersArea": {
      "Baner": 14,
      "Wakad": 14,
      "Aundh": 13,
      "Hinjewadi": 19
    },
    "customerFeedback": [
      {
        "id": "fb-pun-flw-01-1",
        "customerName": "R. Tendulkar",
        "eventType": "Wedding Ceremony",
        "location": "Baner, Pune",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-flw-01-2",
        "customerName": "P. Deshmukh",
        "eventType": "Wedding Ceremony",
        "location": "Wakad, Pune",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-flw-01-3",
        "customerName": "K. Iyer",
        "eventType": "Wedding Ceremony",
        "location": "Aundh, Pune",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "pun-flw-02",
    "businessName": "Flora Couture Pune Exotic Botanical Design",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Koregaon Park",
      "Magarpatta",
      "Viman Nagar",
      "Kharadi"
    ],
    "category": "Flower Arrangements",
    "secondaryCategories": [
      "Decoration Services"
    ],
    "description": "Imported tulip and hydrangea floral tablescapes, botanical bar installations, rustic foliage arches, and pastel carnation canopies.",
    "serviceOfferings": [
      "Exotic Floral Mandaps",
      "Bridal Bouquets",
      "Fresh Floral Canopies",
      "Varmala Design",
      "Floral Centerpieces"
    ],
    "maximumSimultaneousBookings": 3,
    "startingPrice": 75000,
    "priceUnit": "per celebration",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-25": "Available"
    },
    "completedOrders90Days": 12,
    "repeatOrdersArea": {
      "Koregaon Park": 3,
      "Magarpatta": 2,
      "Viman Nagar": 3,
      "Kharadi": 2
    },
    "referralsArea": {
      "Koregaon Park": 3,
      "Magarpatta": 3,
      "Viman Nagar": 3,
      "Kharadi": 3
    },
    "repeatOrdersTotal": 10,
    "referralsTotal": 12,
    "portfolioImages": [
      "/assets/flw-2.jpg"
    ],
    "serviceTags": [
      "Exotic Botanical",
      "Pastel Hydrangeas",
      "Rustic Arches",
      "Cocktail Floral Bar"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-flw-02.demo.wedora.in",
    "contactPhone": "+91 98000 0070",
    "averageOrderValue90Days": 210000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 56,
    "successfulReferralBookings": 12,
    "repeatCustomerBookings": 10,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 20,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Koregaon Park": 11,
      "Magarpatta": 11,
      "Viman Nagar": 11,
      "Kharadi": 15
    },
    "customerFeedback": [
      {
        "id": "fb-pun-flw-02-1",
        "customerName": "V. Kadam",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Koregaon Park, Pune",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-pun-flw-02-2",
        "customerName": "N. Nair",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Magarpatta, Pune",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "pun-flw-03",
    "businessName": "Kothrud Botanical & Fresh Petals Workshop",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Kothrud",
      "Shivajinagar",
      "Pimpri-Chinchwad"
    ],
    "category": "Flower Arrangements",
    "secondaryCategories": [],
    "description": "Fresh farm-sourced marigold, tuberose and orchid floral backdrops, pheras floral rangoli, and auspicious floral entrances.",
    "serviceOfferings": [
      "Exotic Floral Mandaps",
      "Bridal Bouquets",
      "Fresh Floral Canopies",
      "Varmala Design",
      "Floral Centerpieces"
    ],
    "maximumSimultaneousBookings": 3,
    "startingPrice": 35000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-28": "Available"
    },
    "completedOrders90Days": 17,
    "repeatOrdersArea": {
      "Kothrud": 5,
      "Shivajinagar": 5,
      "Pimpri-Chinchwad": 5
    },
    "referralsArea": {
      "Kothrud": 6,
      "Shivajinagar": 6,
      "Pimpri-Chinchwad": 6
    },
    "repeatOrdersTotal": 15,
    "referralsTotal": 18,
    "portfolioImages": [
      "/assets/flw-1.jpg"
    ],
    "serviceTags": [
      "Tuberose Strings",
      "Floral Rangoli",
      "Farm-Sourced",
      "Pheras Styling"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-flw-03.demo.wedora.in",
    "contactPhone": "+91 98000 0071",
    "averageOrderValue90Days": 285000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 77,
    "successfulReferralBookings": 18,
    "repeatCustomerBookings": 15,
    "onTimeDeliveryPercent": 97,
    "verifiedCustomerFeedbackCount": 28,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Kothrud": 19,
      "Shivajinagar": 19,
      "Pimpri-Chinchwad": 27
    },
    "customerFeedback": [
      {
        "id": "fb-pun-flw-03-1",
        "customerName": "R. Shah",
        "eventType": "Mehendi Celebration",
        "location": "Kothrud, Pune",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-flw-03-2",
        "customerName": "T. Agarwal",
        "eventType": "Mehendi Celebration",
        "location": "Shivajinagar, Pune",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-flw-03-3",
        "customerName": "R. Tendulkar",
        "eventType": "Mehendi Celebration",
        "location": "Pimpri-Chinchwad, Pune",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "pun-flw-04",
    "businessName": "Magarpatta Royal Rose & Lotus Floral Art",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Hadapsar",
      "Magarpatta",
      "Kharadi"
    ],
    "category": "Flower Arrangements",
    "secondaryCategories": [
      "Decoration Services"
    ],
    "description": "Royal pink lotus floating ponds, red Dutch rose arches, gold brass urns with jasmine, and bridal palki floral decoration.",
    "serviceOfferings": [
      "Exotic Floral Mandaps",
      "Bridal Bouquets",
      "Fresh Floral Canopies",
      "Varmala Design",
      "Floral Centerpieces"
    ],
    "maximumSimultaneousBookings": 2,
    "startingPrice": 55000,
    "priceUnit": "per wedding",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 15,
    "repeatOrdersArea": {
      "Hadapsar": 4,
      "Magarpatta": 5,
      "Kharadi": 4
    },
    "referralsArea": {
      "Hadapsar": 5,
      "Magarpatta": 6,
      "Kharadi": 5
    },
    "repeatOrdersTotal": 13,
    "referralsTotal": 16,
    "portfolioImages": [
      "/assets/flw-2.jpg"
    ],
    "serviceTags": [
      "Floating Lotus",
      "Dutch Rose Arches",
      "Palki Decor",
      "Brass Urns"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-flw-04.demo.wedora.in",
    "contactPhone": "+91 98000 0072",
    "averageOrderValue90Days": 225000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 66,
    "successfulReferralBookings": 16,
    "repeatCustomerBookings": 13,
    "onTimeDeliveryPercent": 98,
    "verifiedCustomerFeedbackCount": 25,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Hadapsar": 16,
      "Magarpatta": 17,
      "Kharadi": 23
    },
    "customerFeedback": [
      {
        "id": "fb-pun-flw-04-1",
        "customerName": "M. Joshi",
        "eventType": "Grand Reception",
        "location": "Hadapsar, Pune",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-flw-04-2",
        "customerName": "H. Trivedi",
        "eventType": "Grand Reception",
        "location": "Magarpatta, Pune",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "pun-flw-05",
    "businessName": "Aundh Floral Artisans & Garland Creators",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Aundh",
      "Baner",
      "Shivajinagar"
    ],
    "category": "Flower Arrangements",
    "secondaryCategories": [],
    "description": "Artisanal custom wedding garlands, pearl-embedded varmalas, stage flower canopies, and haldi yellow blossom themes.",
    "serviceOfferings": [
      "Exotic Floral Mandaps",
      "Bridal Bouquets",
      "Fresh Floral Canopies",
      "Varmala Design",
      "Floral Centerpieces"
    ],
    "maximumSimultaneousBookings": 3,
    "startingPrice": 32000,
    "priceUnit": "per setup",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 13,
    "repeatOrdersArea": {
      "Aundh": 4,
      "Baner": 4,
      "Shivajinagar": 4
    },
    "referralsArea": {
      "Aundh": 5,
      "Baner": 5,
      "Shivajinagar": 5
    },
    "repeatOrdersTotal": 12,
    "referralsTotal": 15,
    "portfolioImages": [
      "/assets/flw-1.jpg"
    ],
    "serviceTags": [
      "Custom Garlands",
      "Pearl Varmala",
      "Haldi Blossoms",
      "Stage Canopy"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-flw-05.demo.wedora.in",
    "contactPhone": "+91 98000 0073",
    "averageOrderValue90Days": 195000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 59,
    "successfulReferralBookings": 15,
    "repeatCustomerBookings": 12,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 23,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Aundh": 15,
      "Baner": 15,
      "Shivajinagar": 20
    },
    "customerFeedback": [
      {
        "id": "fb-pun-flw-05-1",
        "customerName": "D. Shinde",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Aundh, Pune",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-flw-05-2",
        "customerName": "S. Singhania",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Baner, Pune",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-flw-05-3",
        "customerName": "R. Shah",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Shivajinagar, Pune",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "pun-fur-01",
    "businessName": "Pune Royal Tent & Furniture Rentals",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Baner",
      "Wakad",
      "Hinjewadi",
      "Aundh"
    ],
    "category": "Furniture and Equipment Rental",
    "secondaryCategories": [],
    "description": "Golden Tiffany/Chiavari chairs, cushioned sofa sets, buffet banquet tables, and pristine white dining linens.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 85000,
    "priceUnit": "per setup",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 32,
    "averageOrderValue90Days": 115000,
    "portfolioImages": [
      "/assets/fur-1.jpg",
      "/assets/fur-2.jpg"
    ],
    "serviceTags": [
      "Chiavari Chairs",
      "Cushioned Sofas",
      "Buffet Tables"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-fur-01.demo.wedora.in",
    "contactPhone": "+91 98000 0021",
    "serviceOfferings": [
      "Chiavari & Dior Chairs",
      "Royal Sofa Lounges",
      "High Cocktail Tables",
      "German Pagoda Tents",
      "Heavy Gensets"
    ],
    "repeatOrdersArea": {
      "Baner": 8,
      "Wakad": 7,
      "Hinjewadi": 8,
      "Aundh": 7
    },
    "referralsArea": {
      "Baner": 11,
      "Wakad": 10,
      "Hinjewadi": 11,
      "Aundh": 10
    },
    "repeatOrdersTotal": 30,
    "referralsTotal": 42,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 145,
    "successfulReferralBookings": 42,
    "repeatCustomerBookings": 30,
    "onTimeDeliveryPercent": 94,
    "verifiedCustomerFeedbackCount": 57,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Baner": 28,
      "Wakad": 28,
      "Hinjewadi": 28,
      "Aundh": 39
    },
    "customerFeedback": [
      {
        "id": "fb-pun-fur-01-1",
        "customerName": "M. Parekh",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Baner, Pune",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-fur-01-2",
        "customerName": "M. Joshi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Wakad, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-fur-01-3",
        "customerName": "H. Trivedi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Hinjewadi, Pune",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "pun-fur-02",
    "businessName": "Marquee Kraft German Hangars & AC Tents",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Kothrud",
      "Shivajinagar",
      "Koregaon Park"
    ],
    "category": "Furniture and Equipment Rental",
    "secondaryCategories": [],
    "description": "All-weather German dome hangars, transparent glass roof marquees, and heavy industrial tower air conditioning.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 280000,
    "priceUnit": "per setup",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 24,
    "averageOrderValue90Days": 340000,
    "portfolioImages": [
      "/assets/fur-1.jpg",
      "/assets/fur-2.jpg"
    ],
    "serviceTags": [
      "German Hangars",
      "Glass Roof Marquees",
      "Tower Air Conditioning"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-fur-02.demo.wedora.in",
    "contactPhone": "+91 98000 0022",
    "serviceOfferings": [
      "Chiavari & Dior Chairs",
      "Royal Sofa Lounges",
      "High Cocktail Tables",
      "German Pagoda Tents",
      "Heavy Gensets"
    ],
    "repeatOrdersArea": {
      "Kothrud": 4,
      "Shivajinagar": 5,
      "Koregaon Park": 4
    },
    "referralsArea": {
      "Kothrud": 11,
      "Shivajinagar": 11,
      "Koregaon Park": 11
    },
    "repeatOrdersTotal": 13,
    "referralsTotal": 33,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 110,
    "successfulReferralBookings": 33,
    "repeatCustomerBookings": 13,
    "onTimeDeliveryPercent": 95,
    "verifiedCustomerFeedbackCount": 44,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 96,
    "completedOrdersArea": {
      "Kothrud": 28,
      "Shivajinagar": 28,
      "Koregaon Park": 38
    },
    "customerFeedback": [
      {
        "id": "fb-pun-fur-02-1",
        "customerName": "A. Patil",
        "eventType": "Wedding Ceremony",
        "location": "Kothrud, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-fur-02-2",
        "customerName": "D. Shinde",
        "eventType": "Wedding Ceremony",
        "location": "Shivajinagar, Pune",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "pun-fur-03",
    "businessName": "Classic Props & Wooden Cabanas",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Viman Nagar",
      "Kharadi",
      "Hadapsar",
      "Magarpatta"
    ],
    "category": "Furniture and Equipment Rental",
    "secondaryCategories": [],
    "description": "Bohemian wooden pergolas, antique swings, ornate photo backdrops, and comfortable low-seating diwan setups.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 75000,
    "priceUnit": "per setup",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available"
    },
    "completedOrders90Days": 29,
    "averageOrderValue90Days": 95000,
    "portfolioImages": [
      "/assets/fur-1.jpg",
      "/assets/fur-2.jpg"
    ],
    "serviceTags": [
      "Boho Pergolas",
      "Antique Swings",
      "Low Seating Diwans"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-fur-03.demo.wedora.in",
    "contactPhone": "+91 98000 0023",
    "serviceOfferings": [
      "Chiavari & Dior Chairs",
      "Royal Sofa Lounges",
      "High Cocktail Tables",
      "German Pagoda Tents",
      "Heavy Gensets"
    ],
    "repeatOrdersArea": {
      "Viman Nagar": 4,
      "Kharadi": 4,
      "Hadapsar": 5,
      "Magarpatta": 4
    },
    "referralsArea": {
      "Viman Nagar": 10,
      "Kharadi": 10,
      "Hadapsar": 11,
      "Magarpatta": 10
    },
    "repeatOrdersTotal": 17,
    "referralsTotal": 41,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 131,
    "successfulReferralBookings": 41,
    "repeatCustomerBookings": 17,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 54,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Viman Nagar": 25,
      "Kharadi": 25,
      "Hadapsar": 25,
      "Magarpatta": 36
    },
    "customerFeedback": [
      {
        "id": "fb-pun-fur-03-1",
        "customerName": "S. Kulkarni",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Viman Nagar, Pune",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-pun-fur-03-2",
        "customerName": "G. Bhosale",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Kharadi, Pune",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-fur-03-3",
        "customerName": "M. Parekh",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Hadapsar, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "pun-fur-04",
    "businessName": "PowerGrid Genset & Climate Support",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Pimpri-Chinchwad",
      "Wakad",
      "Baner",
      "Hinjewadi"
    ],
    "category": "Furniture and Equipment Rental",
    "secondaryCategories": [],
    "description": "Eco-friendly silent generator backup (82.5 kVA to 200 kVA), outdoor mist fans, and distribution power panels.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 60000,
    "priceUnit": "per setup",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-19": "Available"
    },
    "completedOrders90Days": 37,
    "averageOrderValue90Days": 75000,
    "portfolioImages": [
      "/assets/fur-1.jpg",
      "/assets/fur-2.jpg"
    ],
    "serviceTags": [
      "Silent Gensets",
      "Outdoor Misting Fans",
      "Power Distribution"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-fur-04.demo.wedora.in",
    "contactPhone": "+91 98000 0024",
    "serviceOfferings": [
      "Chiavari & Dior Chairs",
      "Royal Sofa Lounges",
      "High Cocktail Tables",
      "German Pagoda Tents",
      "Heavy Gensets"
    ],
    "repeatOrdersArea": {
      "Pimpri-Chinchwad": 6,
      "Wakad": 6,
      "Baner": 6,
      "Hinjewadi": 6
    },
    "referralsArea": {
      "Pimpri-Chinchwad": 14,
      "Wakad": 13,
      "Baner": 14,
      "Hinjewadi": 13
    },
    "repeatOrdersTotal": 24,
    "referralsTotal": 54,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 168,
    "successfulReferralBookings": 54,
    "repeatCustomerBookings": 24,
    "onTimeDeliveryPercent": 97,
    "verifiedCustomerFeedbackCount": 71,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Pimpri-Chinchwad": 33,
      "Wakad": 32,
      "Baner": 33,
      "Hinjewadi": 45
    },
    "customerFeedback": [
      {
        "id": "fb-pun-fur-04-1",
        "customerName": "V. Mehta",
        "eventType": "Mehendi Celebration",
        "location": "Pimpri-Chinchwad, Pune",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-fur-04-2",
        "customerName": "C. Gaikwad",
        "eventType": "Mehendi Celebration",
        "location": "Wakad, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "pun-fur-05",
    "businessName": "Pinnacle Event Furniture & Gazebos Pune",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Baner",
      "Wakad",
      "Hinjewadi",
      "Aundh"
    ],
    "category": "Furniture and Equipment Rental",
    "secondaryCategories": [],
    "description": "Heavy duty waterproof pagoda tents, royal Diwan seating, wooden dance floors, brass chafing dishes, and silent diesel generators.",
    "serviceOfferings": [
      "Chiavari & Dior Chairs",
      "Royal Sofa Lounges",
      "High Cocktail Tables",
      "German Pagoda Tents",
      "Heavy Gensets"
    ],
    "maximumSimultaneousBookings": 4,
    "startingPrice": 30000,
    "priceUnit": "per package setup",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-25": "Available"
    },
    "completedOrders90Days": 30,
    "repeatOrdersArea": {
      "Baner": 5,
      "Wakad": 5,
      "Hinjewadi": 6,
      "Aundh": 5
    },
    "referralsArea": {
      "Baner": 8,
      "Wakad": 7,
      "Hinjewadi": 8,
      "Aundh": 7
    },
    "repeatOrdersTotal": 21,
    "referralsTotal": 30,
    "portfolioImages": [
      "/assets/fur-1.jpg"
    ],
    "serviceTags": [
      "Pagoda Tents",
      "Royal Diwan",
      "Dance Floor",
      "Silent Genset"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-fur-05.demo.wedora.in",
    "contactPhone": "+91 98000 0076",
    "averageOrderValue90Days": 285000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 137,
    "successfulReferralBookings": 30,
    "repeatCustomerBookings": 21,
    "onTimeDeliveryPercent": 98,
    "verifiedCustomerFeedbackCount": 59,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Baner": 26,
      "Wakad": 26,
      "Hinjewadi": 27,
      "Aundh": 37
    },
    "customerFeedback": [
      {
        "id": "fb-pun-fur-05-1",
        "customerName": "K. Iyer",
        "eventType": "Grand Reception",
        "location": "Baner, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-fur-05-2",
        "customerName": "A. Banerjee",
        "eventType": "Grand Reception",
        "location": "Wakad, Pune",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-pun-fur-05-3",
        "customerName": "S. Kulkarni",
        "eventType": "Grand Reception",
        "location": "Hinjewadi, Pune",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "pun-hot-01",
    "businessName": "The Koregaon Luxury Pavilion & Suites",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Koregaon Park",
      "Kharadi",
      "Viman Nagar"
    ],
    "category": "Hotels and Guest Accommodation",
    "secondaryCategories": [],
    "description": "5-star boutique hospitality featuring 85 rooms, bridal hospitality suites, airport proximity, and all-day dining for guests.",
    "maximumGuestCapacity": 320,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 8500,
    "priceUnit": "per room/night",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 15,
    "averageOrderValue90Days": 520000,
    "portfolioImages": [
      "/assets/hot-1.jpg",
      "/assets/hot-2.jpg"
    ],
    "serviceTags": [
      "5-Star Luxury",
      "Airport Proximity",
      "Bridal Suites"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-hot-01.demo.wedora.in",
    "contactPhone": "+91 98000 0030",
    "serviceOfferings": [
      "Deluxe Guest Rooms",
      "Welcome Hospitality Desk",
      "Luggage Assistance",
      "Breakfast Buffet Included",
      "Airport/Station Transfers"
    ],
    "repeatOrdersArea": {
      "Koregaon Park": 4,
      "Kharadi": 5,
      "Viman Nagar": 4
    },
    "referralsArea": {
      "Koregaon Park": 7,
      "Kharadi": 7,
      "Viman Nagar": 6
    },
    "repeatOrdersTotal": 13,
    "referralsTotal": 20,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 69,
    "successfulReferralBookings": 20,
    "repeatCustomerBookings": 13,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 34,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Koregaon Park": 17,
      "Kharadi": 18,
      "Viman Nagar": 24
    },
    "customerFeedback": [
      {
        "id": "fb-pun-hot-01-1",
        "customerName": "H. Trivedi",
        "eventType": "Mehendi Celebration",
        "location": "Koregaon Park, Pune",
        "comment": "Wonderful venue ambiance with convenient proximity to the highway. Accommodated our vendors for setup effortlessly. Service entrance was busy during overlapping vendor load-ins.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-hot-01-2",
        "customerName": "V. Kadam",
        "eventType": "Mehendi Celebration",
        "location": "Kharadi, Pune",
        "comment": "Expansive lush green lawn, pristine air-conditioned bridal suites, and seamless valet management for 600+ guests. Acoustic sound restrictions required lowering music volume slightly past 10 PM in the open section.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-hot-01-3",
        "customerName": "N. Nair",
        "eventType": "Mehendi Celebration",
        "location": "Viman Nagar, Pune",
        "comment": "Stunning banquet hall with high ceilings and regal chandeliers. Guest parking and security staff were well organized. Restroom checks needed an extra reminder halfway through the reception.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "pun-hot-02",
    "businessName": "Pride Gateway Hotel & Banquets",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Shivajinagar",
      "Kothrud",
      "Aundh"
    ],
    "category": "Hotels and Guest Accommodation",
    "secondaryCategories": [],
    "description": "Centrally located premium hotel with 75 rooms, complimentary wedding guest breakfast, and convenient railway station connectivity.",
    "maximumGuestCapacity": 280,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 6200,
    "priceUnit": "per room/night",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available"
    },
    "completedOrders90Days": 21,
    "averageOrderValue90Days": 380000,
    "portfolioImages": [
      "/assets/hot-1.jpg",
      "/assets/hot-2.jpg"
    ],
    "serviceTags": [
      "Central Location",
      "Breakfast Included",
      "Railway Connectivity"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-hot-02.demo.wedora.in",
    "contactPhone": "+91 98000 0031",
    "serviceOfferings": [
      "Deluxe Guest Rooms",
      "Welcome Hospitality Desk",
      "Luggage Assistance",
      "Breakfast Buffet Included",
      "Airport/Station Transfers"
    ],
    "repeatOrdersArea": {
      "Shivajinagar": 6,
      "Kothrud": 7,
      "Aundh": 6
    },
    "referralsArea": {
      "Shivajinagar": 9,
      "Kothrud": 10,
      "Aundh": 9
    },
    "repeatOrdersTotal": 19,
    "referralsTotal": 28,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 94,
    "successfulReferralBookings": 28,
    "repeatCustomerBookings": 19,
    "onTimeDeliveryPercent": 93,
    "verifiedCustomerFeedbackCount": 30,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Shivajinagar": 24,
      "Kothrud": 23,
      "Aundh": 33
    },
    "customerFeedback": [
      {
        "id": "fb-pun-hot-02-1",
        "customerName": "S. Singhania",
        "eventType": "Grand Reception",
        "location": "Shivajinagar, Pune",
        "comment": "Expansive lush green lawn, pristine air-conditioned bridal suites, and seamless valet management for 600+ guests. Acoustic sound restrictions required lowering music volume slightly past 10 PM in the open section.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-hot-02-2",
        "customerName": "R. Shah",
        "eventType": "Grand Reception",
        "location": "Kothrud, Pune",
        "comment": "Stunning banquet hall with high ceilings and regal chandeliers. Guest parking and security staff were well organized. Restroom checks needed an extra reminder halfway through the reception.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "pun-hot-03",
    "businessName": "Wakad Express Residency & Guest Rooms",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Wakad",
      "Hinjewadi",
      "Baner"
    ],
    "category": "Hotels and Guest Accommodation",
    "secondaryCategories": [],
    "description": "Modern wedding guest hotel along the Mumbai-Pune expressway with 60 clean, spacious rooms and ample family suites.",
    "maximumGuestCapacity": 240,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 4800,
    "priceUnit": "per room/night",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-19": "Available"
    },
    "completedOrders90Days": 17,
    "averageOrderValue90Days": 270000,
    "portfolioImages": [
      "/assets/hot-1.jpg",
      "/assets/hot-2.jpg"
    ],
    "serviceTags": [
      "Expressway Access",
      "Family Rooms",
      "Wakad Hub"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-hot-03.demo.wedora.in",
    "contactPhone": "+91 98000 0032",
    "serviceOfferings": [
      "Deluxe Guest Rooms",
      "Welcome Hospitality Desk",
      "Luggage Assistance",
      "Breakfast Buffet Included",
      "Airport/Station Transfers"
    ],
    "repeatOrdersArea": {
      "Wakad": 6,
      "Hinjewadi": 6,
      "Baner": 5
    },
    "referralsArea": {
      "Wakad": 8,
      "Hinjewadi": 8,
      "Baner": 8
    },
    "repeatOrdersTotal": 17,
    "referralsTotal": 24,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 79,
    "successfulReferralBookings": 24,
    "repeatCustomerBookings": 17,
    "onTimeDeliveryPercent": 94,
    "verifiedCustomerFeedbackCount": 26,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Wakad": 20,
      "Hinjewadi": 20,
      "Baner": 27
    },
    "customerFeedback": [
      {
        "id": "fb-pun-hot-03-1",
        "customerName": "M. Parekh",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Wakad, Pune",
        "comment": "Stunning banquet hall with high ceilings and regal chandeliers. Guest parking and security staff were well organized. Restroom checks needed an extra reminder halfway through the reception.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-hot-03-2",
        "customerName": "M. Joshi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Hinjewadi, Pune",
        "comment": "Wonderful venue ambiance with convenient proximity to the highway. Accommodated our vendors for setup effortlessly. Service entrance was busy during overlapping vendor load-ins.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-hot-03-3",
        "customerName": "H. Trivedi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Baner, Pune",
        "comment": "Expansive lush green lawn, pristine air-conditioned bridal suites, and seamless valet management for 600+ guests. Acoustic sound restrictions required lowering music volume slightly past 10 PM in the open section.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "pun-hot-04",
    "businessName": "Magarpatta Comfort Suites",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Magarpatta",
      "Hadapsar",
      "Kharadi"
    ],
    "category": "Hotels and Guest Accommodation",
    "secondaryCategories": [],
    "description": "Comfortable guest lodging with 50 serviced apartments, kitchenette options, and close proximity to eastern Pune wedding venues.",
    "maximumGuestCapacity": 200,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 4200,
    "priceUnit": "per room/night",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-22": "Available"
    },
    "completedOrders90Days": 14,
    "averageOrderValue90Days": 230000,
    "portfolioImages": [
      "/assets/hot-1.jpg",
      "/assets/hot-2.jpg"
    ],
    "serviceTags": [
      "Serviced Apartments",
      "Kitchenette",
      "Eastern Pune"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-hot-04.demo.wedora.in",
    "contactPhone": "+91 98000 0033",
    "serviceOfferings": [
      "Deluxe Guest Rooms",
      "Welcome Hospitality Desk",
      "Luggage Assistance",
      "Breakfast Buffet Included",
      "Airport/Station Transfers"
    ],
    "repeatOrdersArea": {
      "Magarpatta": 3,
      "Hadapsar": 3,
      "Kharadi": 2
    },
    "referralsArea": {
      "Magarpatta": 7,
      "Hadapsar": 7,
      "Kharadi": 6
    },
    "repeatOrdersTotal": 8,
    "referralsTotal": 20,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 64,
    "successfulReferralBookings": 20,
    "repeatCustomerBookings": 8,
    "onTimeDeliveryPercent": 95,
    "verifiedCustomerFeedbackCount": 22,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 96,
    "completedOrdersArea": {
      "Magarpatta": 16,
      "Hadapsar": 16,
      "Kharadi": 22
    },
    "customerFeedback": [
      {
        "id": "fb-pun-hot-04-1",
        "customerName": "A. Patil",
        "eventType": "Wedding Ceremony",
        "location": "Magarpatta, Pune",
        "comment": "Wonderful venue ambiance with convenient proximity to the highway. Accommodated our vendors for setup effortlessly. Service entrance was busy during overlapping vendor load-ins.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-hot-04-2",
        "customerName": "D. Shinde",
        "eventType": "Wedding Ceremony",
        "location": "Hadapsar, Pune",
        "comment": "Expansive lush green lawn, pristine air-conditioned bridal suites, and seamless valet management for 600+ guests. Acoustic sound restrictions required lowering music volume slightly past 10 PM in the open section.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "pun-hot-05",
    "businessName": "The West Crest Grand Hotel & Suites Pune",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Hinjewadi",
      "Wakad",
      "Baner"
    ],
    "category": "Hotels and Guest Accommodation",
    "secondaryCategories": [
      "Wedding Lawns and Venues"
    ],
    "description": "5-star guest room inventory for destination weddings, multi-cuisine breakfast spreads, bridal makeup suites, and expressway connectivity.",
    "serviceOfferings": [
      "Deluxe Guest Rooms",
      "Welcome Hospitality Desk",
      "Luggage Assistance",
      "Breakfast Buffet Included",
      "Airport/Station Transfers"
    ],
    "maximumGuestCapacity": 500,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 6500,
    "priceUnit": "per room/night",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 16,
    "repeatOrdersArea": {
      "Hinjewadi": 3,
      "Wakad": 3,
      "Baner": 3
    },
    "referralsArea": {
      "Hinjewadi": 5,
      "Wakad": 6,
      "Baner": 5
    },
    "repeatOrdersTotal": 9,
    "referralsTotal": 16,
    "portfolioImages": [
      "/assets/hot-1.jpg"
    ],
    "serviceTags": [
      "5-Star Luxury",
      "Wedding Room Blocks",
      "Expressway Proximity",
      "Bridal Suites"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-hot-05.demo.wedora.in",
    "contactPhone": "+91 98000 0077",
    "averageOrderValue90Days": 240000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 73,
    "successfulReferralBookings": 16,
    "repeatCustomerBookings": 9,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 26,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Hinjewadi": 18,
      "Wakad": 18,
      "Baner": 26
    },
    "customerFeedback": [
      {
        "id": "fb-pun-hot-05-1",
        "customerName": "S. Kulkarni",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Hinjewadi, Pune",
        "comment": "Expansive lush green lawn, pristine air-conditioned bridal suites, and seamless valet management for 600+ guests. Acoustic sound restrictions required lowering music volume slightly past 10 PM in the open section.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-pun-hot-05-2",
        "customerName": "G. Bhosale",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Wakad, Pune",
        "comment": "Stunning banquet hall with high ceilings and regal chandeliers. Guest parking and security staff were well organized. Restroom checks needed an extra reminder halfway through the reception.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-hot-05-3",
        "customerName": "M. Parekh",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Baner, Pune",
        "comment": "Wonderful venue ambiance with convenient proximity to the highway. Accommodated our vendors for setup effortlessly. Service entrance was busy during overlapping vendor load-ins.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "pun-lig-01",
    "businessName": "GlowCraft Pune Architectural Lighting",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Baner",
      "Wakad",
      "Aundh",
      "Kothrud"
    ],
    "category": "Lighting Services",
    "secondaryCategories": [],
    "description": "Computerized intelligent beam lighting, ambient lawn uplighting, fairy light canopies, and programmed sangeet stages.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 110000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 20,
    "averageOrderValue90Days": 145000,
    "portfolioImages": [
      "/assets/lig-1.jpg",
      "/assets/lig-2.jpg"
    ],
    "serviceTags": [
      "Architectural Uplighting",
      "Intelligent Beams",
      "Fairy Light Canopies"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-lig-01.demo.wedora.in",
    "contactPhone": "+91 98000 0013",
    "serviceOfferings": [
      "Architectural Illumination",
      "Intelligent Moving Heads",
      "Truss Lighting",
      "LED Wall Backgrounds",
      "Warm String Fairylights"
    ],
    "repeatOrdersArea": {
      "Baner": 3,
      "Wakad": 3,
      "Aundh": 4,
      "Kothrud": 3
    },
    "referralsArea": {
      "Baner": 7,
      "Wakad": 7,
      "Aundh": 7,
      "Kothrud": 7
    },
    "repeatOrdersTotal": 13,
    "referralsTotal": 28,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 92,
    "successfulReferralBookings": 28,
    "repeatCustomerBookings": 13,
    "onTimeDeliveryPercent": 94,
    "verifiedCustomerFeedbackCount": 37,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Baner": 18,
      "Wakad": 18,
      "Aundh": 18,
      "Kothrud": 24
    },
    "customerFeedback": [
      {
        "id": "fb-pun-lig-01-1",
        "customerName": "A. Banerjee",
        "eventType": "Mehendi Celebration",
        "location": "Baner, Pune",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-lig-01-2",
        "customerName": "S. Kulkarni",
        "eventType": "Mehendi Celebration",
        "location": "Wakad, Pune",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "pun-lig-02",
    "businessName": "Sparkle Night Wedding Illuminations",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Koregaon Park",
      "Viman Nagar",
      "Kharadi",
      "Shivajinagar"
    ],
    "category": "Lighting Services",
    "secondaryCategories": [],
    "description": "Warm ambient Edison bulb grids, crystal chandelier tree rigging, and romantic garden wash lights.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 130000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 17,
    "averageOrderValue90Days": 160000,
    "portfolioImages": [
      "/assets/lig-1.jpg",
      "/assets/lig-2.jpg"
    ],
    "serviceTags": [
      "Edison Bulbs",
      "Chandelier Rigging",
      "Garden Wash Lights"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-lig-02.demo.wedora.in",
    "contactPhone": "+91 98000 0014",
    "serviceOfferings": [
      "Architectural Illumination",
      "Intelligent Moving Heads",
      "Truss Lighting",
      "LED Wall Backgrounds",
      "Warm String Fairylights"
    ],
    "repeatOrdersArea": {
      "Koregaon Park": 3,
      "Viman Nagar": 3,
      "Kharadi": 3,
      "Shivajinagar": 3
    },
    "referralsArea": {
      "Koregaon Park": 6,
      "Viman Nagar": 6,
      "Kharadi": 6,
      "Shivajinagar": 6
    },
    "repeatOrdersTotal": 12,
    "referralsTotal": 24,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 77,
    "successfulReferralBookings": 24,
    "repeatCustomerBookings": 12,
    "onTimeDeliveryPercent": 95,
    "verifiedCustomerFeedbackCount": 32,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Koregaon Park": 15,
      "Viman Nagar": 15,
      "Kharadi": 15,
      "Shivajinagar": 20
    },
    "customerFeedback": [
      {
        "id": "fb-pun-lig-02-1",
        "customerName": "S. More",
        "eventType": "Grand Reception",
        "location": "Koregaon Park, Pune",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-lig-02-2",
        "customerName": "V. Mehta",
        "eventType": "Grand Reception",
        "location": "Viman Nagar, Pune",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-pun-lig-02-3",
        "customerName": "C. Gaikwad",
        "eventType": "Grand Reception",
        "location": "Kharadi, Pune",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "pun-lig-03",
    "businessName": "LazerPulse Stage & Sangeet Lighting",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Hinjewadi",
      "Pimpri-Chinchwad",
      "Wakad"
    ],
    "category": "Lighting Services",
    "secondaryCategories": [],
    "description": "Heavy stage lighting, moving head trusses, low-fog dry ice clouds, and cold sparkulars for grand couple entries.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 160000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-19": "Available"
    },
    "completedOrders90Days": 15,
    "averageOrderValue90Days": 190000,
    "portfolioImages": [
      "/assets/lig-1.jpg",
      "/assets/lig-2.jpg"
    ],
    "serviceTags": [
      "Cold Sparks",
      "Dry Ice Fog",
      "Moving Head Trusses"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-lig-03.demo.wedora.in",
    "contactPhone": "+91 98000 0015",
    "serviceOfferings": [
      "Architectural Illumination",
      "Intelligent Moving Heads",
      "Truss Lighting",
      "LED Wall Backgrounds",
      "Warm String Fairylights"
    ],
    "repeatOrdersArea": {
      "Hinjewadi": 4,
      "Pimpri-Chinchwad": 4,
      "Wakad": 3
    },
    "referralsArea": {
      "Hinjewadi": 7,
      "Pimpri-Chinchwad": 8,
      "Wakad": 7
    },
    "repeatOrdersTotal": 11,
    "referralsTotal": 22,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 70,
    "successfulReferralBookings": 22,
    "repeatCustomerBookings": 11,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 29,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Hinjewadi": 18,
      "Pimpri-Chinchwad": 18,
      "Wakad": 24
    },
    "customerFeedback": [
      {
        "id": "fb-pun-lig-03-1",
        "customerName": "P. Deshmukh",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Hinjewadi, Pune",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-lig-03-2",
        "customerName": "K. Iyer",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Pimpri-Chinchwad, Pune",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "pun-lig-04",
    "businessName": "Surya Kiran Heritage Lighting",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Hadapsar",
      "Magarpatta",
      "Kothrud"
    ],
    "category": "Lighting Services",
    "secondaryCategories": [],
    "description": "Traditional oil lamp torches, amber floodlights, and festive series lighting for palace and lawn weddings.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 85000,
    "priceUnit": "per event",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-17": "Available"
    },
    "completedOrders90Days": 20,
    "averageOrderValue90Days": 105000,
    "portfolioImages": [
      "/assets/lig-1.jpg",
      "/assets/lig-2.jpg"
    ],
    "serviceTags": [
      "Amber Floods",
      "Traditional Torches",
      "Series Lighting"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-lig-04.demo.wedora.in",
    "contactPhone": "+91 98000 0016",
    "serviceOfferings": [
      "Architectural Illumination",
      "Intelligent Moving Heads",
      "Truss Lighting",
      "LED Wall Backgrounds",
      "Warm String Fairylights"
    ],
    "repeatOrdersArea": {
      "Hadapsar": 5,
      "Magarpatta": 5,
      "Kothrud": 5
    },
    "referralsArea": {
      "Hadapsar": 7,
      "Magarpatta": 7,
      "Kothrud": 6
    },
    "repeatOrdersTotal": 15,
    "referralsTotal": 20,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 91,
    "successfulReferralBookings": 20,
    "repeatCustomerBookings": 15,
    "onTimeDeliveryPercent": 97,
    "verifiedCustomerFeedbackCount": 39,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Hadapsar": 23,
      "Magarpatta": 23,
      "Kothrud": 31
    },
    "customerFeedback": [
      {
        "id": "fb-pun-lig-04-1",
        "customerName": "N. Nair",
        "eventType": "Wedding Ceremony",
        "location": "Hadapsar, Pune",
        "comment": "Gorgeous stage backdrop and clean mandap pillars. Delivered beyond our expectations for the sangeet night. Dismantling crew arrived promptly after the event ended to clear the premises cleanly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-lig-04-2",
        "customerName": "B. Chavan",
        "eventType": "Wedding Ceremony",
        "location": "Magarpatta, Pune",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-lig-04-3",
        "customerName": "S. More",
        "eventType": "Wedding Ceremony",
        "location": "Kothrud, Pune",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "pun-lig-05",
    "businessName": "Deccan Dynamic Stage & Ambient Lighting Pune",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Baner",
      "Wakad",
      "Kothrud",
      "Shivajinagar"
    ],
    "category": "Lighting Services",
    "secondaryCategories": [
      "DJ and Sound Systems"
    ],
    "description": "High-power LED pars, fairy light tunnels, outdoor lawn tree uplighting, hazers, and synchronized stage lighting consoles.",
    "serviceOfferings": [
      "Architectural Illumination",
      "Intelligent Moving Heads",
      "Truss Lighting",
      "LED Wall Backgrounds",
      "Warm String Fairylights"
    ],
    "maximumSimultaneousBookings": 3,
    "startingPrice": 38000,
    "priceUnit": "per event setup",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-25": "Available"
    },
    "completedOrders90Days": 24,
    "repeatOrdersArea": {
      "Baner": 5,
      "Wakad": 5,
      "Kothrud": 5,
      "Shivajinagar": 4
    },
    "referralsArea": {
      "Baner": 6,
      "Wakad": 6,
      "Kothrud": 7,
      "Shivajinagar": 6
    },
    "repeatOrdersTotal": 19,
    "referralsTotal": 25,
    "portfolioImages": [
      "/assets/lig-1.jpg"
    ],
    "serviceTags": [
      "Fairy Tunnels",
      "Lawn Uplighting",
      "Synchronized Consoles",
      "Hazers"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-lig-05.demo.wedora.in",
    "contactPhone": "+91 98000 0074",
    "averageOrderValue90Days": 360000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 108,
    "successfulReferralBookings": 25,
    "repeatCustomerBookings": 19,
    "onTimeDeliveryPercent": 98,
    "verifiedCustomerFeedbackCount": 48,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Baner": 21,
      "Wakad": 21,
      "Kothrud": 21,
      "Shivajinagar": 29
    },
    "customerFeedback": [
      {
        "id": "fb-pun-lig-05-1",
        "customerName": "T. Agarwal",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Baner, Pune",
        "comment": "The floral mandap and stage arch looked straight out of a royal magazine. Fresh flower fragrances throughout the evening. Entryway floral walkway took slightly longer to finalize than planned, but was fully ready before the baraat arrived.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-pun-lig-05-2",
        "customerName": "R. Tendulkar",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Wakad, Pune",
        "comment": "Impeccable thematic color coordination, elegant drapes, and tasteful warm ambient lighting. Understood our mood board perfectly. Some extra stage spotlighting had to be requested on the spot for family photos.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "pun-log-01",
    "businessName": "Swarajya Luxury Wedding Cars & Fleets",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Baner",
      "Wakad",
      "Kothrud",
      "Aundh",
      "Shivajinagar"
    ],
    "category": "Logistics and Transportation",
    "secondaryCategories": [],
    "description": "Decorated luxury bridal sedans, open vintage cars for baraat entries, and Mercedes/BMW rentals with professional chauffeurs.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 55000,
    "priceUnit": "per fleet day",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 26,
    "averageOrderValue90Days": 80000,
    "portfolioImages": [
      "/assets/log-1.jpg",
      "/assets/log-2.jpg"
    ],
    "serviceTags": [
      "Vintage Cars",
      "Decorated Bridal Sedans",
      "Uniformed Chauffeurs"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-log-01.demo.wedora.in",
    "contactPhone": "+91 98000 0046",
    "serviceOfferings": [
      "Luxury Bridal Fleet",
      "AC Coaches for Guests",
      "Dedicated Airport Shuttles",
      "Chauffeur Coordination",
      "Real-Time Dispatch"
    ],
    "repeatOrdersArea": {
      "Baner": 5,
      "Wakad": 5,
      "Kothrud": 4,
      "Aundh": 5,
      "Shivajinagar": 4
    },
    "referralsArea": {
      "Baner": 6,
      "Wakad": 6,
      "Kothrud": 6,
      "Aundh": 7,
      "Shivajinagar": 6
    },
    "repeatOrdersTotal": 23,
    "referralsTotal": 31,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 116,
    "successfulReferralBookings": 31,
    "repeatCustomerBookings": 23,
    "onTimeDeliveryPercent": 97,
    "verifiedCustomerFeedbackCount": 53,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Baner": 18,
      "Wakad": 18,
      "Kothrud": 19,
      "Aundh": 18,
      "Shivajinagar": 26
    },
    "customerFeedback": [
      {
        "id": "fb-pun-log-01-1",
        "customerName": "S. Singhania",
        "eventType": "Grand Reception",
        "location": "Baner, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-log-01-2",
        "customerName": "R. Shah",
        "eventType": "Grand Reception",
        "location": "Wakad, Pune",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "pun-log-02",
    "businessName": "Pune Shuttles & Coach Rentals",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Hinjewadi",
      "Pimpri-Chinchwad",
      "Hadapsar",
      "Viman Nagar",
      "Kharadi"
    ],
    "category": "Logistics and Transportation",
    "secondaryCategories": [],
    "description": "AC mini-buses, tempo travellers, and Volvo luxury coaches for wedding guest airport transfers and inter-city commutes.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 45000,
    "priceUnit": "per fleet day",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available"
    },
    "completedOrders90Days": 33,
    "averageOrderValue90Days": 68000,
    "portfolioImages": [
      "/assets/log-1.jpg",
      "/assets/log-2.jpg"
    ],
    "serviceTags": [
      "AC Luxury Coaches",
      "Airport Transfers",
      "Guest Shuttles"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-log-02.demo.wedora.in",
    "contactPhone": "+91 98000 0047",
    "serviceOfferings": [
      "Luxury Bridal Fleet",
      "AC Coaches for Guests",
      "Dedicated Airport Shuttles",
      "Chauffeur Coordination",
      "Real-Time Dispatch"
    ],
    "repeatOrdersArea": {
      "Hinjewadi": 6,
      "Pimpri-Chinchwad": 6,
      "Hadapsar": 6,
      "Viman Nagar": 7,
      "Kharadi": 6
    },
    "referralsArea": {
      "Hinjewadi": 8,
      "Pimpri-Chinchwad": 9,
      "Hadapsar": 8,
      "Viman Nagar": 9,
      "Kharadi": 8
    },
    "repeatOrdersTotal": 31,
    "referralsTotal": 42,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 149,
    "successfulReferralBookings": 42,
    "repeatCustomerBookings": 31,
    "onTimeDeliveryPercent": 98,
    "verifiedCustomerFeedbackCount": 70,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Hinjewadi": 24,
      "Pimpri-Chinchwad": 23,
      "Hadapsar": 24,
      "Viman Nagar": 23,
      "Kharadi": 33
    },
    "customerFeedback": [
      {
        "id": "fb-pun-log-02-1",
        "customerName": "M. Parekh",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Hinjewadi, Pune",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-log-02-2",
        "customerName": "M. Joshi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Pimpri-Chinchwad, Pune",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-log-02-3",
        "customerName": "H. Trivedi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Hadapsar, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "pun-log-03",
    "businessName": "Pune Royal Wheels Wedding Car Hire",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Baner",
      "Wakad",
      "Kothrud",
      "Aundh"
    ],
    "category": "Logistics and Transportation",
    "secondaryCategories": [],
    "description": "Mercedes-Benz E-Class and Audi A6 luxury bridal sedans, floral car decor, professional suited drivers, and punctual guest transport.",
    "serviceOfferings": [
      "Luxury Bridal Fleet",
      "AC Coaches for Guests",
      "Dedicated Airport Shuttles",
      "Chauffeur Coordination",
      "Real-Time Dispatch"
    ],
    "maximumSimultaneousBookings": 3,
    "startingPrice": 32000,
    "priceUnit": "per bridal sedan day",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 24,
    "repeatOrdersArea": {
      "Baner": 3,
      "Wakad": 3,
      "Kothrud": 4,
      "Aundh": 3
    },
    "referralsArea": {
      "Baner": 8,
      "Wakad": 8,
      "Kothrud": 8,
      "Aundh": 8
    },
    "repeatOrdersTotal": 13,
    "referralsTotal": 32,
    "portfolioImages": [
      "/assets/log-1.jpg"
    ],
    "serviceTags": [
      "Mercedes Bridal Sedan",
      "Floral Car Styling",
      "Suited Drivers",
      "Punctual Dispatch"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-log-03.demo.wedora.in",
    "contactPhone": "+91 98000 0081",
    "averageOrderValue90Days": 360000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 110,
    "successfulReferralBookings": 32,
    "repeatCustomerBookings": 13,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 53,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Baner": 21,
      "Wakad": 21,
      "Kothrud": 22,
      "Aundh": 30
    },
    "customerFeedback": [
      {
        "id": "fb-pun-log-03-1",
        "customerName": "A. Patil",
        "eventType": "Wedding Ceremony",
        "location": "Baner, Pune",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-log-03-2",
        "customerName": "D. Shinde",
        "eventType": "Wedding Ceremony",
        "location": "Wakad, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "pun-log-04",
    "businessName": "Sahyadri Tourist Buses & Event Shuttles Pune",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Hinjewadi",
      "Pimpri-Chinchwad",
      "Baner",
      "Wakad"
    ],
    "category": "Logistics and Transportation",
    "secondaryCategories": [],
    "description": "Air-conditioned luxury mini-buses and 45-seater coaches for wedding baaraat, Mumbai-Pune expressway transfers, and luggage vans.",
    "serviceOfferings": [
      "Luxury Bridal Fleet",
      "AC Coaches for Guests",
      "Dedicated Airport Shuttles",
      "Chauffeur Coordination",
      "Real-Time Dispatch"
    ],
    "maximumSimultaneousBookings": 5,
    "startingPrice": 24000,
    "priceUnit": "per coach day",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-25": "Available"
    },
    "completedOrders90Days": 28,
    "repeatOrdersArea": {
      "Hinjewadi": 4,
      "Pimpri-Chinchwad": 4,
      "Baner": 5,
      "Wakad": 4
    },
    "referralsArea": {
      "Hinjewadi": 10,
      "Pimpri-Chinchwad": 9,
      "Baner": 10,
      "Wakad": 9
    },
    "repeatOrdersTotal": 17,
    "referralsTotal": 38,
    "portfolioImages": [
      "/assets/log-2.jpg"
    ],
    "serviceTags": [
      "AC Volvo Coaches",
      "Expressway Transit",
      "Baaraat Buses",
      "24/7 Support"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-log-04.demo.wedora.in",
    "contactPhone": "+91 98000 0082",
    "averageOrderValue90Days": 420000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 127,
    "successfulReferralBookings": 38,
    "repeatCustomerBookings": 17,
    "onTimeDeliveryPercent": 93,
    "verifiedCustomerFeedbackCount": 62,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Hinjewadi": 25,
      "Pimpri-Chinchwad": 24,
      "Baner": 25,
      "Wakad": 34
    },
    "customerFeedback": [
      {
        "id": "fb-pun-log-04-1",
        "customerName": "S. Kulkarni",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Hinjewadi, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-pun-log-04-2",
        "customerName": "G. Bhosale",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Pimpri-Chinchwad, Pune",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-log-04-3",
        "customerName": "M. Parekh",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Baner, Pune",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "pun-log-05",
    "businessName": "Express Airport & Station Wedding Fleet Pune",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Viman Nagar",
      "Kharadi",
      "Hadapsar",
      "Koregaon Park"
    ],
    "category": "Logistics and Transportation",
    "secondaryCategories": [],
    "description": "Direct airport terminal guest pickups, flight delay monitoring, station meet-and-assist, and luxury Toyota Innova Crysta convoys.",
    "serviceOfferings": [
      "Luxury Bridal Fleet",
      "AC Coaches for Guests",
      "Dedicated Airport Shuttles",
      "Chauffeur Coordination",
      "Real-Time Dispatch"
    ],
    "maximumSimultaneousBookings": 4,
    "startingPrice": 19000,
    "priceUnit": "per Innova fleet day",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 24,
    "repeatOrdersArea": {
      "Viman Nagar": 4,
      "Kharadi": 4,
      "Hadapsar": 4,
      "Koregaon Park": 3
    },
    "referralsArea": {
      "Viman Nagar": 8,
      "Kharadi": 8,
      "Hadapsar": 9,
      "Koregaon Park": 8
    },
    "repeatOrdersTotal": 15,
    "referralsTotal": 33,
    "portfolioImages": [
      "/assets/log-1.jpg"
    ],
    "serviceTags": [
      "Innova Crysta Convoy",
      "Flight Tracking",
      "Station Meet & Greet",
      "Luggage Transit"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-log-05.demo.wedora.in",
    "contactPhone": "+91 98000 0083",
    "averageOrderValue90Days": 330000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 108,
    "successfulReferralBookings": 33,
    "repeatCustomerBookings": 15,
    "onTimeDeliveryPercent": 94,
    "verifiedCustomerFeedbackCount": 35,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Viman Nagar": 21,
      "Kharadi": 21,
      "Hadapsar": 21,
      "Koregaon Park": 29
    },
    "customerFeedback": [
      {
        "id": "fb-pun-log-05-1",
        "customerName": "V. Mehta",
        "eventType": "Mehendi Celebration",
        "location": "Viman Nagar, Pune",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-log-05-2",
        "customerName": "C. Gaikwad",
        "eventType": "Mehendi Celebration",
        "location": "Kharadi, Pune",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "pun-mak-01",
    "businessName": "Roopshree Bridal Makeovers & Hair Studio",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Baner",
      "Aundh",
      "Shivajinagar",
      "Koregaon Park"
    ],
    "category": "Makeup and Mehendi Artists",
    "secondaryCategories": [],
    "description": "Renowned bridal makeup artist specializing in HD bridal makeovers, airbrush finish, traditional nauvari saree draping, and hair artistry.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 38000,
    "priceUnit": "per bridal package",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-17": "Available"
    },
    "completedOrders90Days": 35,
    "averageOrderValue90Days": 55000,
    "portfolioImages": [
      "/assets/mak-1.jpg",
      "/assets/mak-2.jpg"
    ],
    "serviceTags": [
      "Nauvari Saree Draping",
      "HD Airbrush Makeup",
      "Bridal Artistry"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-mak-01.demo.wedora.in",
    "contactPhone": "+91 98000 0048",
    "serviceOfferings": [
      "Airbrush HD Bridal Makeup",
      "Hair Styling & Saree Draping",
      "Organic Rajasthani Mehendi",
      "Guest Mehendi Artists",
      "Pre-Bridal Grooming"
    ],
    "repeatOrdersArea": {
      "Baner": 8,
      "Aundh": 8,
      "Shivajinagar": 9,
      "Koregaon Park": 8
    },
    "referralsArea": {
      "Baner": 10,
      "Aundh": 10,
      "Shivajinagar": 10,
      "Koregaon Park": 9
    },
    "repeatOrdersTotal": 33,
    "referralsTotal": 39,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 157,
    "successfulReferralBookings": 39,
    "repeatCustomerBookings": 33,
    "onTimeDeliveryPercent": 98,
    "verifiedCustomerFeedbackCount": 58,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Baner": 30,
      "Aundh": 30,
      "Shivajinagar": 30,
      "Koregaon Park": 43
    },
    "customerFeedback": [
      {
        "id": "fb-pun-mak-01-1",
        "customerName": "M. Parekh",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Baner, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-mak-01-2",
        "customerName": "M. Joshi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Aundh, Pune",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-mak-01-3",
        "customerName": "H. Trivedi",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Shivajinagar, Pune",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "pun-mak-02",
    "businessName": "Kashish Mehndi Artistry",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Kothrud",
      "Wakad",
      "Pimpri-Chinchwad",
      "Hadapsar"
    ],
    "category": "Makeup and Mehendi Artists",
    "secondaryCategories": [],
    "description": "Intricate bridal henna, Arabic and portrait mehendi designs, chemical-free organic henna cone preparation, and guest mehendi teams.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 22000,
    "priceUnit": "per bridal package",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available"
    },
    "completedOrders90Days": 38,
    "averageOrderValue90Days": 32000,
    "portfolioImages": [
      "/assets/mak-1.jpg",
      "/assets/mak-2.jpg"
    ],
    "serviceTags": [
      "Bridal Henna",
      "Organic Cones",
      "Portrait Mehendi"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-mak-02.demo.wedora.in",
    "contactPhone": "+91 98000 0049",
    "serviceOfferings": [
      "Airbrush HD Bridal Makeup",
      "Hair Styling & Saree Draping",
      "Organic Rajasthani Mehendi",
      "Guest Mehendi Artists",
      "Pre-Bridal Grooming"
    ],
    "repeatOrdersArea": {
      "Kothrud": 5,
      "Wakad": 5,
      "Pimpri-Chinchwad": 6,
      "Hadapsar": 5
    },
    "referralsArea": {
      "Kothrud": 11,
      "Wakad": 11,
      "Pimpri-Chinchwad": 12,
      "Hadapsar": 11
    },
    "repeatOrdersTotal": 21,
    "referralsTotal": 45,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 174,
    "successfulReferralBookings": 45,
    "repeatCustomerBookings": 21,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 66,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Kothrud": 34,
      "Wakad": 34,
      "Pimpri-Chinchwad": 33,
      "Hadapsar": 47
    },
    "customerFeedback": [
      {
        "id": "fb-pun-mak-02-1",
        "customerName": "A. Patil",
        "eventType": "Wedding Ceremony",
        "location": "Kothrud, Pune",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-mak-02-2",
        "customerName": "D. Shinde",
        "eventType": "Wedding Ceremony",
        "location": "Wakad, Pune",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "pun-mak-03",
    "businessName": "Aura Bridal Makeovers & Styling Studio Pune",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Baner",
      "Aundh",
      "Kothrud",
      "Wakad"
    ],
    "category": "Makeup and Mehendi Artists",
    "secondaryCategories": [],
    "description": "Celebrity HD bridal makeover, bespoke hair styling, authentic Nauvari saree draping, and flawless photographic finish.",
    "serviceOfferings": [
      "Airbrush HD Bridal Makeup",
      "Hair Styling & Saree Draping",
      "Organic Rajasthani Mehendi",
      "Guest Mehendi Artists",
      "Pre-Bridal Grooming"
    ],
    "maximumSimultaneousBookings": 2,
    "startingPrice": 32000,
    "priceUnit": "per bridal look",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 25,
    "repeatOrdersArea": {
      "Baner": 4,
      "Aundh": 4,
      "Kothrud": 4,
      "Wakad": 3
    },
    "referralsArea": {
      "Baner": 8,
      "Aundh": 8,
      "Kothrud": 8,
      "Wakad": 7
    },
    "repeatOrdersTotal": 15,
    "referralsTotal": 31,
    "portfolioImages": [
      "/assets/mak-1.jpg"
    ],
    "serviceTags": [
      "HD Makeover",
      "Nauvari Saree Draping",
      "Flawless Finish",
      "Hair Styling"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-mak-03.demo.wedora.in",
    "contactPhone": "+91 98000 0084",
    "averageOrderValue90Days": 375000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 115,
    "successfulReferralBookings": 31,
    "repeatCustomerBookings": 15,
    "onTimeDeliveryPercent": 93,
    "verifiedCustomerFeedbackCount": 45,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Baner": 22,
      "Aundh": 22,
      "Kothrud": 23,
      "Wakad": 31
    },
    "customerFeedback": [
      {
        "id": "fb-pun-mak-03-1",
        "customerName": "S. Kulkarni",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Baner, Pune",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-pun-mak-03-2",
        "customerName": "G. Bhosale",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Aundh, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-mak-03-3",
        "customerName": "M. Parekh",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Kothrud, Pune",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "pun-mak-04",
    "businessName": "Swastik Organic Marwari & Arabic Mehendi Pune",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Kothrud",
      "Shivajinagar",
      "Pimpri-Chinchwad"
    ],
    "category": "Makeup and Mehendi Artists",
    "secondaryCategories": [],
    "description": "Specialist in authentic Marwari, Arabic, and figure bridal henna, custom groom name embedding, and fast dark stain cones.",
    "serviceOfferings": [
      "Airbrush HD Bridal Makeup",
      "Hair Styling & Saree Draping",
      "Organic Rajasthani Mehendi",
      "Guest Mehendi Artists",
      "Pre-Bridal Grooming"
    ],
    "maximumSimultaneousBookings": 3,
    "startingPrice": 18000,
    "priceUnit": "per bridal mehndi",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-25": "Available"
    },
    "completedOrders90Days": 28,
    "repeatOrdersArea": {
      "Kothrud": 6,
      "Shivajinagar": 6,
      "Pimpri-Chinchwad": 6
    },
    "referralsArea": {
      "Kothrud": 12,
      "Shivajinagar": 12,
      "Pimpri-Chinchwad": 12
    },
    "repeatOrdersTotal": 18,
    "referralsTotal": 36,
    "portfolioImages": [
      "/assets/mak-2.jpg"
    ],
    "serviceTags": [
      "Marwari Henna",
      "Arabic Designs",
      "Groom Name Embed",
      "Dark Stain Cones"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-mak-04.demo.wedora.in",
    "contactPhone": "+91 98000 0085",
    "averageOrderValue90Days": 420000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 128,
    "successfulReferralBookings": 36,
    "repeatCustomerBookings": 18,
    "onTimeDeliveryPercent": 94,
    "verifiedCustomerFeedbackCount": 51,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Kothrud": 32,
      "Shivajinagar": 32,
      "Pimpri-Chinchwad": 45
    },
    "customerFeedback": [
      {
        "id": "fb-pun-mak-04-1",
        "customerName": "V. Mehta",
        "eventType": "Mehendi Celebration",
        "location": "Kothrud, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-mak-04-2",
        "customerName": "C. Gaikwad",
        "eventType": "Mehendi Celebration",
        "location": "Shivajinagar, Pune",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "pun-mak-05",
    "businessName": "Lavanya Bridal Beauty & Mehendi Lounge Pune",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Koregaon Park",
      "Viman Nagar",
      "Kharadi",
      "Hadapsar"
    ],
    "category": "Makeup and Mehendi Artists",
    "secondaryCategories": [],
    "description": "Modern airbrush techniques, soft glam sangeet makeup, pre-wedding skin prep consultation, and organic bridal henna.",
    "serviceOfferings": [
      "Airbrush HD Bridal Makeup",
      "Hair Styling & Saree Draping",
      "Organic Rajasthani Mehendi",
      "Guest Mehendi Artists",
      "Pre-Bridal Grooming"
    ],
    "maximumSimultaneousBookings": 2,
    "startingPrice": 26000,
    "priceUnit": "per package",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 21,
    "repeatOrdersArea": {
      "Koregaon Park": 4,
      "Viman Nagar": 4,
      "Kharadi": 4,
      "Hadapsar": 3
    },
    "referralsArea": {
      "Koregaon Park": 7,
      "Viman Nagar": 7,
      "Kharadi": 7,
      "Hadapsar": 7
    },
    "repeatOrdersTotal": 15,
    "referralsTotal": 28,
    "portfolioImages": [
      "/assets/mak-1.jpg"
    ],
    "serviceTags": [
      "Airbrush Makeup",
      "Soft Glam Sangeet",
      "Skin Prep",
      "Bridal Henna"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-mak-05.demo.wedora.in",
    "contactPhone": "+91 98000 0086",
    "averageOrderValue90Days": 285000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 97,
    "successfulReferralBookings": 28,
    "repeatCustomerBookings": 15,
    "onTimeDeliveryPercent": 95,
    "verifiedCustomerFeedbackCount": 40,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Koregaon Park": 19,
      "Viman Nagar": 19,
      "Kharadi": 18,
      "Hadapsar": 26
    },
    "customerFeedback": [
      {
        "id": "fb-pun-mak-05-1",
        "customerName": "K. Iyer",
        "eventType": "Grand Reception",
        "location": "Koregaon Park, Pune",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-mak-05-2",
        "customerName": "A. Banerjee",
        "eventType": "Grand Reception",
        "location": "Viman Nagar, Pune",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-pun-mak-05-3",
        "customerName": "S. Kulkarni",
        "eventType": "Grand Reception",
        "location": "Kharadi, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "pun-org-01",
    "businessName": "Punya Bhumi Wedding & Event Curators",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Baner",
      "Aundh",
      "Shivajinagar",
      "Kothrud"
    ],
    "category": "Event Organizers / Wedding Planners",
    "secondaryCategories": [
      "Decoration and Flower Arrangements",
      "Logistics and Transportation"
    ],
    "description": "Distinguished wedding management firm delivering bespoke celebrations, decor styling, ritual precision, and seamless hospitality.",
    "maximumGuestCapacity": 1200,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 290000,
    "priceUnit": "management fee",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 18,
    "averageOrderValue90Days": 410000,
    "portfolioImages": [
      "/assets/org-1.jpg",
      "/assets/org-2.jpg"
    ],
    "serviceTags": [
      "Bespoke Celebrations",
      "Hospitality Management",
      "Ritual Coordination"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-org-01.demo.wedora.in",
    "contactPhone": "+91 98000 0038",
    "serviceOfferings": [
      "Vendor Contract Negotiation",
      "Day-of Event Management",
      "RSVP & Guest Hospitality",
      "Budget Monitoring",
      "Checklist Execution"
    ],
    "repeatOrdersArea": {
      "Baner": 3,
      "Aundh": 3,
      "Shivajinagar": 4,
      "Kothrud": 3
    },
    "referralsArea": {
      "Baner": 5,
      "Aundh": 4,
      "Shivajinagar": 5,
      "Kothrud": 4
    },
    "repeatOrdersTotal": 13,
    "referralsTotal": 18,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 80,
    "successfulReferralBookings": 18,
    "repeatCustomerBookings": 13,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 27,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Baner": 15,
      "Aundh": 16,
      "Shivajinagar": 15,
      "Kothrud": 22
    },
    "customerFeedback": [
      {
        "id": "fb-pun-org-01-1",
        "customerName": "P. Deshmukh",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Baner, Pune",
        "comment": "Masterful crowd control and welcoming hospitality for our 800+ guests. Every vendor delivered on time under their watch. Pre-wedding rehearsal was brief, but the main day execution went smoothly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-org-01-2",
        "customerName": "K. Iyer",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Aundh, Pune",
        "comment": "Flawless end-to-end orchestration! They kept the pandit, caterers, and sound engineers perfectly in sync throughout. Varmala stage entry timing was pushed back by 15 minutes due to guest arrival traffic.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "pun-org-02",
    "businessName": "Subh Aarambh Event Planners",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Wakad",
      "Hinjewadi",
      "Pimpri-Chinchwad",
      "Baner"
    ],
    "category": "Event Organizers / Wedding Planners",
    "secondaryCategories": [
      "DJ and Sound Systems",
      "Photography and Videography"
    ],
    "description": "Experienced planners for cross-cultural weddings, budgeting, vendor shortlisting, timeline orchestration, and on-ground management.",
    "maximumGuestCapacity": 900,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 220000,
    "priceUnit": "management fee",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available"
    },
    "completedOrders90Days": 16,
    "averageOrderValue90Days": 310000,
    "portfolioImages": [
      "/assets/org-1.jpg",
      "/assets/org-2.jpg"
    ],
    "serviceTags": [
      "Cross-Cultural Weddings",
      "Budget Tracking",
      "Timeline Orchestration"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-org-02.demo.wedora.in",
    "contactPhone": "+91 98000 0039",
    "serviceOfferings": [
      "Vendor Contract Negotiation",
      "Day-of Event Management",
      "RSVP & Guest Hospitality",
      "Budget Monitoring",
      "Checklist Execution"
    ],
    "repeatOrdersArea": {
      "Wakad": 3,
      "Hinjewadi": 3,
      "Pimpri-Chinchwad": 3,
      "Baner": 3
    },
    "referralsArea": {
      "Wakad": 5,
      "Hinjewadi": 4,
      "Pimpri-Chinchwad": 5,
      "Baner": 4
    },
    "repeatOrdersTotal": 12,
    "referralsTotal": 18,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 73,
    "successfulReferralBookings": 18,
    "repeatCustomerBookings": 12,
    "onTimeDeliveryPercent": 97,
    "verifiedCustomerFeedbackCount": 26,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Wakad": 14,
      "Hinjewadi": 14,
      "Pimpri-Chinchwad": 14,
      "Baner": 20
    },
    "customerFeedback": [
      {
        "id": "fb-pun-org-02-1",
        "customerName": "N. Nair",
        "eventType": "Wedding Ceremony",
        "location": "Wakad, Pune",
        "comment": "Flawless end-to-end orchestration! They kept the pandit, caterers, and sound engineers perfectly in sync throughout. Varmala stage entry timing was pushed back by 15 minutes due to guest arrival traffic.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-org-02-2",
        "customerName": "B. Chavan",
        "eventType": "Wedding Ceremony",
        "location": "Hinjewadi, Pune",
        "comment": "Reduced our family stress to zero. Budget tracker and daily checklists were transparent and meticulously maintained. Bride side car coordination had minor confusion that was rectified promptly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-org-02-3",
        "customerName": "S. More",
        "eventType": "Wedding Ceremony",
        "location": "Pimpri-Chinchwad, Pune",
        "comment": "Masterful crowd control and welcoming hospitality for our 800+ guests. Every vendor delivered on time under their watch. Pre-wedding rehearsal was brief, but the main day execution went smoothly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "pun-org-03",
    "businessName": "The Crown Affair Luxury Planners",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Koregaon Park",
      "Viman Nagar",
      "Kharadi"
    ],
    "category": "Event Organizers / Wedding Planners",
    "secondaryCategories": [
      "Lighting Services",
      "DJ and Sound Systems"
    ],
    "description": "Elite wedding production house specializing in luxury sangeet galas, celebrity artist booking, and high-touch concierge services.",
    "maximumGuestCapacity": 1500,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 420000,
    "priceUnit": "management fee",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 13,
    "averageOrderValue90Days": 590000,
    "portfolioImages": [
      "/assets/org-1.jpg",
      "/assets/org-2.jpg"
    ],
    "serviceTags": [
      "Luxury Galas",
      "Celebrity Artists",
      "VIP Concierge"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-org-03.demo.wedora.in",
    "contactPhone": "+91 98000 0040",
    "serviceOfferings": [
      "Vendor Contract Negotiation",
      "Day-of Event Management",
      "RSVP & Guest Hospitality",
      "Budget Monitoring",
      "Checklist Execution"
    ],
    "repeatOrdersArea": {
      "Koregaon Park": 3,
      "Viman Nagar": 4,
      "Kharadi": 3
    },
    "referralsArea": {
      "Koregaon Park": 5,
      "Viman Nagar": 5,
      "Kharadi": 5
    },
    "repeatOrdersTotal": 10,
    "referralsTotal": 15,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 58,
    "successfulReferralBookings": 15,
    "repeatCustomerBookings": 10,
    "onTimeDeliveryPercent": 98,
    "verifiedCustomerFeedbackCount": 21,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Koregaon Park": 14,
      "Viman Nagar": 15,
      "Kharadi": 20
    },
    "customerFeedback": [
      {
        "id": "fb-pun-org-03-1",
        "customerName": "T. Agarwal",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Koregaon Park, Pune",
        "comment": "Reduced our family stress to zero. Budget tracker and daily checklists were transparent and meticulously maintained. Bride side car coordination had minor confusion that was rectified promptly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-pun-org-03-2",
        "customerName": "R. Tendulkar",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Viman Nagar, Pune",
        "comment": "Masterful crowd control and welcoming hospitality for our 800+ guests. Every vendor delivered on time under their watch. Pre-wedding rehearsal was brief, but the main day execution went smoothly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "pun-org-04",
    "businessName": "Festiva Event Management & Planning",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Hadapsar",
      "Magarpatta",
      "Kothrud"
    ],
    "category": "Event Organizers / Wedding Planners",
    "secondaryCategories": [
      "Catering and Food Services",
      "Decoration and Flower Arrangements"
    ],
    "description": "Friendly, detail-oriented wedding planners taking the stress away from families with hands-on vendor coordination and ceremony schedules.",
    "maximumGuestCapacity": 800,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 180000,
    "priceUnit": "management fee",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-17": "Available"
    },
    "completedOrders90Days": 21,
    "averageOrderValue90Days": 250000,
    "portfolioImages": [
      "/assets/org-1.jpg",
      "/assets/org-2.jpg"
    ],
    "serviceTags": [
      "Stress-Free Planning",
      "Hands-on Coordination",
      "Ceremony Schedules"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-org-04.demo.wedora.in",
    "contactPhone": "+91 98000 0041",
    "serviceOfferings": [
      "Vendor Contract Negotiation",
      "Day-of Event Management",
      "RSVP & Guest Hospitality",
      "Budget Monitoring",
      "Checklist Execution"
    ],
    "repeatOrdersArea": {
      "Hadapsar": 6,
      "Magarpatta": 6,
      "Kothrud": 6
    },
    "referralsArea": {
      "Hadapsar": 8,
      "Magarpatta": 9,
      "Kothrud": 8
    },
    "repeatOrdersTotal": 18,
    "referralsTotal": 25,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 95,
    "successfulReferralBookings": 25,
    "repeatCustomerBookings": 18,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 35,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Hadapsar": 24,
      "Magarpatta": 24,
      "Kothrud": 33
    },
    "customerFeedback": [
      {
        "id": "fb-pun-org-04-1",
        "customerName": "H. Trivedi",
        "eventType": "Mehendi Celebration",
        "location": "Hadapsar, Pune",
        "comment": "Masterful crowd control and welcoming hospitality for our 800+ guests. Every vendor delivered on time under their watch. Pre-wedding rehearsal was brief, but the main day execution went smoothly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-org-04-2",
        "customerName": "V. Kadam",
        "eventType": "Mehendi Celebration",
        "location": "Magarpatta, Pune",
        "comment": "Flawless end-to-end orchestration! They kept the pandit, caterers, and sound engineers perfectly in sync throughout. Varmala stage entry timing was pushed back by 15 minutes due to guest arrival traffic.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-org-04-3",
        "customerName": "N. Nair",
        "eventType": "Mehendi Celebration",
        "location": "Kothrud, Pune",
        "comment": "Reduced our family stress to zero. Budget tracker and daily checklists were transparent and meticulously maintained. Bride side car coordination had minor confusion that was rectified promptly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "pun-org-05",
    "businessName": "Aarohan Wedding Studio",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Baner",
      "Wakad",
      "Aundh"
    ],
    "category": "Event Organizers / Wedding Planners",
    "secondaryCategories": [
      "Decoration and Flower Arrangements"
    ],
    "description": "Modern wedding planning studio curating sustainable decor, curated food menus, and boutique personalized touches.",
    "maximumGuestCapacity": 600,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 250000,
    "priceUnit": "management fee",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-21": "Available"
    },
    "completedOrders90Days": 0,
    "averageOrderValue90Days": 0,
    "portfolioImages": [
      "/assets/org-1.jpg",
      "/assets/org-2.jpg"
    ],
    "serviceTags": [
      "Sustainable Planning",
      "Curated Menus",
      "Boutique Touches"
    ],
    "isNewToPlatform": true,
    "contactEmail": "contact@pun-org-05.demo.wedora.in",
    "contactPhone": "+91 98000 0042",
    "serviceOfferings": [
      "Vendor Contract Negotiation",
      "Day-of Event Management",
      "RSVP & Guest Hospitality",
      "Budget Monitoring",
      "Checklist Execution"
    ],
    "repeatOrdersArea": {},
    "referralsArea": {},
    "repeatOrdersTotal": 0,
    "referralsTotal": 0,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 0,
    "successfulReferralBookings": 0,
    "repeatCustomerBookings": 0,
    "onTimeDeliveryPercent": 100,
    "verifiedCustomerFeedbackCount": 0,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 100,
    "completedOrdersArea": {},
    "customerFeedback": []
  },
  {
    "id": "pun-pho-01",
    "businessName": "ShutterShree Candid Wedding Films",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Baner",
      "Aundh",
      "Shivajinagar",
      "Kothrud"
    ],
    "category": "Photography and Videography",
    "secondaryCategories": [],
    "description": "Passionate team of wedding cinematographers capturing candid laughter, emotional vidai rituals, and 4K aerial drone footage.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 180000,
    "priceUnit": "per day",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 30,
    "averageOrderValue90Days": 235000,
    "portfolioImages": [
      "/assets/pho-1.jpg",
      "/assets/pho-2.jpg"
    ],
    "serviceTags": [
      "Candid Storytelling",
      "Drone Cinematography",
      "Same-Day Teaser"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-pho-01.demo.wedora.in",
    "contactPhone": "+91 98000 0034",
    "serviceOfferings": [
      "Cinematic Wedding Films",
      "Candid Wedding Photography",
      "Drone Aerial 4K Coverage",
      "Traditional Albums",
      "Same-Day Edit Teasers"
    ],
    "repeatOrdersArea": {
      "Baner": 5,
      "Aundh": 5,
      "Shivajinagar": 6,
      "Kothrud": 5
    },
    "referralsArea": {
      "Baner": 11,
      "Aundh": 10,
      "Shivajinagar": 11,
      "Kothrud": 10
    },
    "repeatOrdersTotal": 21,
    "referralsTotal": 42,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 137,
    "successfulReferralBookings": 42,
    "repeatCustomerBookings": 21,
    "onTimeDeliveryPercent": 95,
    "verifiedCustomerFeedbackCount": 62,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Baner": 26,
      "Aundh": 26,
      "Shivajinagar": 27,
      "Kothrud": 37
    },
    "customerFeedback": [
      {
        "id": "fb-pun-pho-01-1",
        "customerName": "K. Iyer",
        "eventType": "Grand Reception",
        "location": "Baner, Pune",
        "comment": "Drone coverage and cinematic trailer were breathtaking. Handled our large guest gatherings with patience and ease. We had to remind them about our specific family group photo list during the crowded stage session.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-pho-01-2",
        "customerName": "A. Banerjee",
        "eventType": "Grand Reception",
        "location": "Aundh, Pune",
        "comment": "Creative framing and gorgeous couple portraits in natural light. Teaser video delivered within 48 hours! Traditional stage portraits took slightly longer than budgeted in the schedule.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-pun-pho-01-3",
        "customerName": "S. Kulkarni",
        "eventType": "Grand Reception",
        "location": "Shivajinagar, Pune",
        "comment": "Remarkable candid shots capturing genuine family emotions and smiles. Team was polite, unobtrusive, and punctual. Initial digital proof preview took a couple of extra days, but the final color grading was worth the wait.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "pun-pho-02",
    "businessName": "Punekar Wedding Tales",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Kothrud",
      "Shivajinagar",
      "Hadapsar"
    ],
    "category": "Photography and Videography",
    "secondaryCategories": [],
    "description": "Traditional Marathi wedding photography, heritage portrait sessions in Shaniwar Wada style, and luxury handcrafted photo albums.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 130000,
    "priceUnit": "per day",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-17": "Available"
    },
    "completedOrders90Days": 36,
    "averageOrderValue90Days": 165000,
    "portfolioImages": [
      "/assets/pho-1.jpg",
      "/assets/pho-2.jpg"
    ],
    "serviceTags": [
      "Traditional Photography",
      "Handcrafted Albums",
      "Peshwai Portraits"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-pho-02.demo.wedora.in",
    "contactPhone": "+91 98000 0035",
    "serviceOfferings": [
      "Cinematic Wedding Films",
      "Candid Wedding Photography",
      "Drone Aerial 4K Coverage",
      "Traditional Albums",
      "Same-Day Edit Teasers"
    ],
    "repeatOrdersArea": {
      "Kothrud": 9,
      "Shivajinagar": 9,
      "Hadapsar": 8
    },
    "referralsArea": {
      "Kothrud": 17,
      "Shivajinagar": 18,
      "Hadapsar": 17
    },
    "repeatOrdersTotal": 26,
    "referralsTotal": 52,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 162,
    "successfulReferralBookings": 52,
    "repeatCustomerBookings": 26,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 75,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Kothrud": 41,
      "Shivajinagar": 40,
      "Hadapsar": 57
    },
    "customerFeedback": [
      {
        "id": "fb-pun-pho-02-1",
        "customerName": "B. Chavan",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Kothrud, Pune",
        "comment": "Creative framing and gorgeous couple portraits in natural light. Teaser video delivered within 48 hours! Traditional stage portraits took slightly longer than budgeted in the schedule.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-pho-02-2",
        "customerName": "S. More",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Shivajinagar, Pune",
        "comment": "Remarkable candid shots capturing genuine family emotions and smiles. Team was polite, unobtrusive, and punctual. Initial digital proof preview took a couple of extra days, but the final color grading was worth the wait.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "pun-pho-03",
    "businessName": "Vogue Knot Cinematic Productions",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Koregaon Park",
      "Kharadi",
      "Viman Nagar"
    ],
    "category": "Photography and Videography",
    "secondaryCategories": [],
    "description": "High-fashion editorial wedding coverage, pre-wedding music videos, and dynamic sangeet afterparty reels.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 210000,
    "priceUnit": "per day",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-19": "Available"
    },
    "completedOrders90Days": 24,
    "averageOrderValue90Days": 260000,
    "portfolioImages": [
      "/assets/pho-1.jpg",
      "/assets/pho-2.jpg"
    ],
    "serviceTags": [
      "High Fashion Editorial",
      "Music Videos",
      "Trending Reels"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-pho-03.demo.wedora.in",
    "contactPhone": "+91 98000 0036",
    "serviceOfferings": [
      "Cinematic Wedding Films",
      "Candid Wedding Photography",
      "Drone Aerial 4K Coverage",
      "Traditional Albums",
      "Same-Day Edit Teasers"
    ],
    "repeatOrdersArea": {
      "Koregaon Park": 6,
      "Kharadi": 7,
      "Viman Nagar": 6
    },
    "referralsArea": {
      "Koregaon Park": 8,
      "Kharadi": 8,
      "Viman Nagar": 8
    },
    "repeatOrdersTotal": 19,
    "referralsTotal": 24,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 111,
    "successfulReferralBookings": 24,
    "repeatCustomerBookings": 19,
    "onTimeDeliveryPercent": 97,
    "verifiedCustomerFeedbackCount": 52,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Koregaon Park": 28,
      "Kharadi": 28,
      "Viman Nagar": 38
    },
    "customerFeedback": [
      {
        "id": "fb-pun-pho-03-1",
        "customerName": "R. Tendulkar",
        "eventType": "Wedding Ceremony",
        "location": "Koregaon Park, Pune",
        "comment": "Remarkable candid shots capturing genuine family emotions and smiles. Team was polite, unobtrusive, and punctual. Initial digital proof preview took a couple of extra days, but the final color grading was worth the wait.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-pho-03-2",
        "customerName": "P. Deshmukh",
        "eventType": "Wedding Ceremony",
        "location": "Kharadi, Pune",
        "comment": "Drone coverage and cinematic trailer were breathtaking. Handled our large guest gatherings with patience and ease. We had to remind them about our specific family group photo list during the crowded stage session.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-pho-03-3",
        "customerName": "K. Iyer",
        "eventType": "Wedding Ceremony",
        "location": "Viman Nagar, Pune",
        "comment": "Creative framing and gorgeous couple portraits in natural light. Teaser video delivered within 48 hours! Traditional stage portraits took slightly longer than budgeted in the schedule.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "pun-pho-04",
    "businessName": "Moments Forever Studio",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Wakad",
      "Hinjewadi",
      "Pimpri-Chinchwad"
    ],
    "category": "Photography and Videography",
    "secondaryCategories": [],
    "description": "Fresh and energetic photography crew specializing in expressive couple portraits, ceremony candids, and family group portraits.",
    "maximumSimultaneousBookings": 2,
    "startingPrice": 140000,
    "priceUnit": "per day",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-23": "Available"
    },
    "completedOrders90Days": 0,
    "averageOrderValue90Days": 0,
    "portfolioImages": [
      "/assets/pho-1.jpg",
      "/assets/pho-2.jpg"
    ],
    "serviceTags": [
      "Expressive Portraits",
      "Family Candids",
      "Pre-Wedding"
    ],
    "isNewToPlatform": true,
    "contactEmail": "contact@pun-pho-04.demo.wedora.in",
    "contactPhone": "+91 98000 0037",
    "serviceOfferings": [
      "Cinematic Wedding Films",
      "Candid Wedding Photography",
      "Drone Aerial 4K Coverage",
      "Traditional Albums",
      "Same-Day Edit Teasers"
    ],
    "repeatOrdersArea": {},
    "referralsArea": {},
    "repeatOrdersTotal": 0,
    "referralsTotal": 0,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 0,
    "successfulReferralBookings": 0,
    "repeatCustomerBookings": 0,
    "onTimeDeliveryPercent": 100,
    "verifiedCustomerFeedbackCount": 0,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 100,
    "completedOrdersArea": {},
    "customerFeedback": []
  },
  {
    "id": "pun-pho-05",
    "businessName": "The Heritage Lens Candid Photography Pune",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Kothrud",
      "Baner",
      "Aundh",
      "Shivajinagar"
    ],
    "category": "Photography and Videography",
    "secondaryCategories": [],
    "description": "Poetic storytelling photography, natural light wedding portraits, 4K multi-cam cinematic films, and drone coverage of royal baraat.",
    "serviceOfferings": [
      "Cinematic Wedding Films",
      "Candid Wedding Photography",
      "Drone Aerial 4K Coverage",
      "Traditional Albums",
      "Same-Day Edit Teasers"
    ],
    "maximumSimultaneousBookings": 2,
    "startingPrice": 95000,
    "priceUnit": "per wedding",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-25": "Available"
    },
    "completedOrders90Days": 28,
    "repeatOrdersArea": {
      "Kothrud": 6,
      "Baner": 6,
      "Aundh": 6,
      "Shivajinagar": 6
    },
    "referralsArea": {
      "Kothrud": 8,
      "Baner": 7,
      "Aundh": 8,
      "Shivajinagar": 7
    },
    "repeatOrdersTotal": 24,
    "referralsTotal": 30,
    "portfolioImages": [
      "/assets/pho-1.jpg"
    ],
    "serviceTags": [
      "Poetic Storytelling",
      "Natural Light",
      "4K Cinema",
      "Baraat Drone"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-pho-05.demo.wedora.in",
    "contactPhone": "+91 98000 0078",
    "averageOrderValue90Days": 300000,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 125,
    "successfulReferralBookings": 30,
    "repeatCustomerBookings": 24,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 61,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Kothrud": 24,
      "Baner": 24,
      "Aundh": 24,
      "Shivajinagar": 34
    },
    "customerFeedback": [
      {
        "id": "fb-pun-pho-05-1",
        "customerName": "R. Shah",
        "eventType": "Mehendi Celebration",
        "location": "Kothrud, Pune",
        "comment": "Creative framing and gorgeous couple portraits in natural light. Teaser video delivered within 48 hours! Traditional stage portraits took slightly longer than budgeted in the schedule.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-pho-05-2",
        "customerName": "T. Agarwal",
        "eventType": "Mehendi Celebration",
        "location": "Baner, Pune",
        "comment": "Remarkable candid shots capturing genuine family emotions and smiles. Team was polite, unobtrusive, and punctual. Initial digital proof preview took a couple of extra days, but the final color grading was worth the wait.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-pho-05-3",
        "customerName": "R. Tendulkar",
        "eventType": "Mehendi Celebration",
        "location": "Aundh, Pune",
        "comment": "Drone coverage and cinematic trailer were breathtaking. Handled our large guest gatherings with patience and ease. We had to remind them about our specific family group photo list during the crowded stage session.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "pun-ven-01",
    "businessName": "Emerald Meadows Wedding Lawn & Banquets",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Baner",
      "Wakad",
      "Aundh"
    ],
    "category": "Wedding Lawns and Venues",
    "secondaryCategories": [],
    "description": "Spacious 35,000 sq ft verdant lawn surrounded by hills, featuring attached air-conditioned banquet hall and bridal dressing suites.",
    "maximumGuestCapacity": 1000,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 380000,
    "priceUnit": "per day rental",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 22,
    "averageOrderValue90Days": 440000,
    "portfolioImages": [
      "/assets/ven-1.jpg",
      "/assets/ven-2.jpg"
    ],
    "serviceTags": [
      "Lawn for 1000 Guests",
      "Hillside Backdrop",
      "Bridal Dressing Suites"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-ven-01.demo.wedora.in",
    "contactPhone": "+91 98000 0025",
    "serviceOfferings": [
      "Open-Air Banquet Lawns",
      "Air-Conditioned Indoor Halls",
      "Bridal Green Rooms",
      "Valet Parking Lot",
      "In-House Power Backup"
    ],
    "repeatOrdersArea": {
      "Baner": 6,
      "Wakad": 6,
      "Aundh": 5
    },
    "referralsArea": {
      "Baner": 10,
      "Wakad": 10,
      "Aundh": 10
    },
    "repeatOrdersTotal": 17,
    "referralsTotal": 30,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 99,
    "successfulReferralBookings": 30,
    "repeatCustomerBookings": 17,
    "onTimeDeliveryPercent": 93,
    "verifiedCustomerFeedbackCount": 47,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 96,
    "completedOrdersArea": {
      "Baner": 25,
      "Wakad": 25,
      "Aundh": 34
    },
    "customerFeedback": [
      {
        "id": "fb-pun-ven-01-1",
        "customerName": "N. Nair",
        "eventType": "Wedding Ceremony",
        "location": "Baner, Pune",
        "comment": "Expansive lush green lawn, pristine air-conditioned bridal suites, and seamless valet management for 600+ guests. Acoustic sound restrictions required lowering music volume slightly past 10 PM in the open section.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-ven-01-2",
        "customerName": "B. Chavan",
        "eventType": "Wedding Ceremony",
        "location": "Wakad, Pune",
        "comment": "Stunning banquet hall with high ceilings and regal chandeliers. Guest parking and security staff were well organized. Restroom checks needed an extra reminder halfway through the reception.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-ven-01-3",
        "customerName": "S. More",
        "eventType": "Wedding Ceremony",
        "location": "Aundh, Pune",
        "comment": "Wonderful venue ambiance with convenient proximity to the highway. Accommodated our vendors for setup effortlessly. Service entrance was busy during overlapping vendor load-ins.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "pun-ven-02",
    "businessName": "Oasis Palm Royal Lawns & Resorts",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Hinjewadi",
      "Wakad",
      "Pimpri-Chinchwad"
    ],
    "category": "Wedding Lawns and Venues",
    "secondaryCategories": [],
    "description": "Resort-style open wedding lawn with palm-fringed swimming pool, poolside sangeet arena, and capacity up to 800 guests.",
    "maximumGuestCapacity": 800,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 340000,
    "priceUnit": "per day rental",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available"
    },
    "completedOrders90Days": 20,
    "averageOrderValue90Days": 390000,
    "portfolioImages": [
      "/assets/ven-1.jpg",
      "/assets/ven-2.jpg"
    ],
    "serviceTags": [
      "Lawn for 800 Guests",
      "Poolside Sangeet",
      "Resort Lawns"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-ven-02.demo.wedora.in",
    "contactPhone": "+91 98000 0026",
    "serviceOfferings": [
      "Open-Air Banquet Lawns",
      "Air-Conditioned Indoor Halls",
      "Bridal Green Rooms",
      "Valet Parking Lot",
      "In-House Power Backup"
    ],
    "repeatOrdersArea": {
      "Hinjewadi": 6,
      "Wakad": 6,
      "Pimpri-Chinchwad": 5
    },
    "referralsArea": {
      "Hinjewadi": 10,
      "Wakad": 10,
      "Pimpri-Chinchwad": 9
    },
    "repeatOrdersTotal": 17,
    "referralsTotal": 29,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 92,
    "successfulReferralBookings": 29,
    "repeatCustomerBookings": 17,
    "onTimeDeliveryPercent": 94,
    "verifiedCustomerFeedbackCount": 44,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Hinjewadi": 23,
      "Wakad": 23,
      "Pimpri-Chinchwad": 32
    },
    "customerFeedback": [
      {
        "id": "fb-pun-ven-02-1",
        "customerName": "T. Agarwal",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Hinjewadi, Pune",
        "comment": "Stunning banquet hall with high ceilings and regal chandeliers. Guest parking and security staff were well organized. Restroom checks needed an extra reminder halfway through the reception.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-pun-ven-02-2",
        "customerName": "R. Tendulkar",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Wakad, Pune",
        "comment": "Wonderful venue ambiance with convenient proximity to the highway. Accommodated our vendors for setup effortlessly. Service entrance was busy during overlapping vendor load-ins.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "pun-ven-03",
    "businessName": "Mayur Hillcrest Grand Lawns",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Kothrud",
      "Shivajinagar",
      "Aundh"
    ],
    "category": "Wedding Lawns and Venues",
    "secondaryCategories": [],
    "description": "Lush green hill-view lawn capable of hosting grand wedding ceremonies for 700 guests with ample valet parking.",
    "maximumGuestCapacity": 700,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 310000,
    "priceUnit": "per day rental",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-17": "Available"
    },
    "completedOrders90Days": 20,
    "averageOrderValue90Days": 360000,
    "portfolioImages": [
      "/assets/ven-1.jpg",
      "/assets/ven-2.jpg"
    ],
    "serviceTags": [
      "Lawn for 700 Guests",
      "Hill View",
      "Valet Parking"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-ven-03.demo.wedora.in",
    "contactPhone": "+91 98000 0027",
    "serviceOfferings": [
      "Open-Air Banquet Lawns",
      "Air-Conditioned Indoor Halls",
      "Bridal Green Rooms",
      "Valet Parking Lot",
      "In-House Power Backup"
    ],
    "repeatOrdersArea": {
      "Kothrud": 6,
      "Shivajinagar": 6,
      "Aundh": 5
    },
    "referralsArea": {
      "Kothrud": 9,
      "Shivajinagar": 10,
      "Aundh": 9
    },
    "repeatOrdersTotal": 17,
    "referralsTotal": 28,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 89,
    "successfulReferralBookings": 28,
    "repeatCustomerBookings": 17,
    "onTimeDeliveryPercent": 95,
    "verifiedCustomerFeedbackCount": 44,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Kothrud": 22,
      "Shivajinagar": 23,
      "Aundh": 31
    },
    "customerFeedback": [
      {
        "id": "fb-pun-ven-03-1",
        "customerName": "H. Trivedi",
        "eventType": "Mehendi Celebration",
        "location": "Kothrud, Pune",
        "comment": "Wonderful venue ambiance with convenient proximity to the highway. Accommodated our vendors for setup effortlessly. Service entrance was busy during overlapping vendor load-ins.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-ven-03-2",
        "customerName": "V. Kadam",
        "eventType": "Mehendi Celebration",
        "location": "Shivajinagar, Pune",
        "comment": "Expansive lush green lawn, pristine air-conditioned bridal suites, and seamless valet management for 600+ guests. Acoustic sound restrictions required lowering music volume slightly past 10 PM in the open section.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-ven-03-3",
        "customerName": "N. Nair",
        "eventType": "Mehendi Celebration",
        "location": "Aundh, Pune",
        "comment": "Stunning banquet hall with high ceilings and regal chandeliers. Guest parking and security staff were well organized. Restroom checks needed an extra reminder halfway through the reception.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "pun-ven-04",
    "businessName": "Heritage Greens Country Lawn",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Hadapsar",
      "Magarpatta",
      "Kharadi"
    ],
    "category": "Wedding Lawns and Venues",
    "secondaryCategories": [],
    "description": "Scenic open-air lawn surrounded by royal palms, grand stone mandap plinth, and seating capacity for 650 guests.",
    "maximumGuestCapacity": 650,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 290000,
    "priceUnit": "per day rental",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-24": "Available"
    },
    "completedOrders90Days": 24,
    "averageOrderValue90Days": 330000,
    "portfolioImages": [
      "/assets/ven-1.jpg",
      "/assets/ven-2.jpg"
    ],
    "serviceTags": [
      "Lawn for 650 Guests",
      "Stone Mandap Plinth",
      "Open Air"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-ven-04.demo.wedora.in",
    "contactPhone": "+91 98000 0028",
    "serviceOfferings": [
      "Open-Air Banquet Lawns",
      "Air-Conditioned Indoor Halls",
      "Bridal Green Rooms",
      "Valet Parking Lot",
      "In-House Power Backup"
    ],
    "repeatOrdersArea": {
      "Hadapsar": 7,
      "Magarpatta": 8,
      "Kharadi": 7
    },
    "referralsArea": {
      "Hadapsar": 8,
      "Magarpatta": 8,
      "Kharadi": 8
    },
    "repeatOrdersTotal": 22,
    "referralsTotal": 24,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 110,
    "successfulReferralBookings": 24,
    "repeatCustomerBookings": 22,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 35,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Hadapsar": 28,
      "Magarpatta": 28,
      "Kharadi": 38
    },
    "customerFeedback": [
      {
        "id": "fb-pun-ven-04-1",
        "customerName": "S. Singhania",
        "eventType": "Grand Reception",
        "location": "Hadapsar, Pune",
        "comment": "Expansive lush green lawn, pristine air-conditioned bridal suites, and seamless valet management for 600+ guests. Acoustic sound restrictions required lowering music volume slightly past 10 PM in the open section.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-ven-04-2",
        "customerName": "R. Shah",
        "eventType": "Grand Reception",
        "location": "Magarpatta, Pune",
        "comment": "Stunning banquet hall with high ceilings and regal chandeliers. Guest parking and security staff were well organized. Restroom checks needed an extra reminder halfway through the reception.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "pun-ven-05",
    "businessName": "The Orchid Regency Lawns",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Koregaon Park",
      "Viman Nagar"
    ],
    "category": "Wedding Lawns and Venues",
    "secondaryCategories": [],
    "description": "Intimate boutique garden lawn for 350 guests ideal for sangeet nights, mehendi brunches, and cocktail receptions.",
    "maximumGuestCapacity": 350,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 220000,
    "priceUnit": "per day rental",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-21": "Available"
    },
    "completedOrders90Days": 0,
    "averageOrderValue90Days": 0,
    "portfolioImages": [
      "/assets/ven-1.jpg",
      "/assets/ven-2.jpg"
    ],
    "serviceTags": [
      "Intimate Lawn",
      "Boutique Garden",
      "Sangeet Venue"
    ],
    "isNewToPlatform": true,
    "contactEmail": "contact@pun-ven-05.demo.wedora.in",
    "contactPhone": "+91 98000 0029",
    "serviceOfferings": [
      "Open-Air Banquet Lawns",
      "Air-Conditioned Indoor Halls",
      "Bridal Green Rooms",
      "Valet Parking Lot",
      "In-House Power Backup"
    ],
    "repeatOrdersArea": {},
    "referralsArea": {},
    "repeatOrdersTotal": 0,
    "referralsTotal": 0,
    "isActive": true,
    "isDemoData": true,
    "profileCreatedAt": "2026-01-15",
    "completedOrders": 0,
    "successfulReferralBookings": 0,
    "repeatCustomerBookings": 0,
    "onTimeDeliveryPercent": 100,
    "verifiedCustomerFeedbackCount": 0,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 100,
    "completedOrdersArea": {},
    "customerFeedback": []
  },
  {
    "id": "mum-fur-06",
    "businessName": "Imperial Lounge & Royal Furniture Rentals",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Lower Parel",
      "Bandra",
      "Dadar",
      "Powai"
    ],
    "category": "Furniture and Equipment Rental",
    "secondaryCategories": [
      "Lighting Services"
    ],
    "description": "Luxury chesterfield sofas, mirrored dining consoles, French gold chiavari chairs, and bespoke VIP lounge setups for grand receptions.",
    "serviceOfferings": [
      "Bespoke Sofa Lounges",
      "Gold & Acrylic Chiavari Chairs",
      "Mirrored Dining Consoles",
      "Bar Counters & High Tops",
      "Cocktail Cabanas"
    ],
    "maximumSimultaneousBookings": 3,
    "startingPrice": 95000,
    "priceUnit": "per setup",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available",
      "2026-12-20": "Tentative",
      "2026-12-25": "Available"
    },
    "completedOrders90Days": 16,
    "averageOrderValue90Days": 240000,
    "portfolioImages": [
      "/assets/fur-1.jpg",
      "/assets/fur-2.jpg"
    ],
    "serviceTags": [
      "VIP Lounge Sets",
      "Gold Chiavari",
      "Mirrored Consoles",
      "Luxury Rental"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-fur-06.demo.wedora.in",
    "contactPhone": "+91 98000 0136",
    "repeatOrdersArea": {
      "Lower Parel": 3,
      "Bandra": 3,
      "Dadar": 3,
      "Powai": 3
    },
    "referralsArea": {
      "Lower Parel": 4,
      "Bandra": 4,
      "Dadar": 5,
      "Powai": 4
    },
    "repeatOrdersTotal": 12,
    "referralsTotal": 17,
    "profileCreatedAt": "2026-02-15",
    "isActive": true,
    "isDemoData": true,
    "completedOrders": 72,
    "successfulReferralBookings": 17,
    "repeatCustomerBookings": 12,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 24,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Lower Parel": 14,
      "Bandra": 14,
      "Dadar": 14,
      "Powai": 19
    },
    "customerFeedback": [
      {
        "id": "fb-mum-fur-06-1",
        "customerName": "B. Chavan",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Lower Parel, Mumbai",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-fur-06-2",
        "customerName": "S. More",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Bandra, Mumbai",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "mum-fur-07",
    "businessName": "Thane StageCraft & Canopy Structures",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Thane",
      "Mulund",
      "Ghatkopar",
      "Navi Mumbai"
    ],
    "category": "Furniture and Equipment Rental",
    "secondaryCategories": [],
    "description": "Heavy-duty waterproof German pagoda marquees, octanorm stage platforms, truss risers, and cushioned banquet seating.",
    "serviceOfferings": [
      "German Pagoda Tents",
      "Hydraulic Stage Risers",
      "Cushioned Banquet Chairs",
      "Air Coolers & Misting Systems",
      "Carpet Runners"
    ],
    "maximumSimultaneousBookings": 2,
    "startingPrice": 120000,
    "priceUnit": "per setup",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-17": "Available",
      "2026-12-22": "Unavailable"
    },
    "completedOrders90Days": 13,
    "averageOrderValue90Days": 190000,
    "portfolioImages": [
      "/assets/fur-1.jpg",
      "/assets/fur-2.jpg"
    ],
    "serviceTags": [
      "Pagoda Tents",
      "Stage Rigs",
      "AC & Mist Fans",
      "Banqueting Chairs"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-fur-07.demo.wedora.in",
    "contactPhone": "+91 98000 0137",
    "repeatOrdersArea": {
      "Thane": 3,
      "Mulund": 2,
      "Ghatkopar": 3,
      "Navi Mumbai": 2
    },
    "referralsArea": {
      "Thane": 4,
      "Mulund": 3,
      "Ghatkopar": 4,
      "Navi Mumbai": 3
    },
    "repeatOrdersTotal": 10,
    "referralsTotal": 14,
    "profileCreatedAt": "2026-03-10",
    "isActive": true,
    "isDemoData": true,
    "completedOrders": 57,
    "successfulReferralBookings": 14,
    "repeatCustomerBookings": 10,
    "onTimeDeliveryPercent": 97,
    "verifiedCustomerFeedbackCount": 20,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Thane": 11,
      "Mulund": 11,
      "Ghatkopar": 11,
      "Navi Mumbai": 15
    },
    "customerFeedback": [
      {
        "id": "fb-mum-fur-07-1",
        "customerName": "R. Tendulkar",
        "eventType": "Wedding Ceremony",
        "location": "Thane, Mumbai",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-fur-07-2",
        "customerName": "P. Deshmukh",
        "eventType": "Wedding Ceremony",
        "location": "Mulund, Mumbai",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-mum-fur-07-3",
        "customerName": "K. Iyer",
        "eventType": "Wedding Ceremony",
        "location": "Ghatkopar, Mumbai",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "mum-hot-06",
    "businessName": "Grand Regalia Suites & Boutique Stay",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Andheri",
      "Powai",
      "Goregaon"
    ],
    "category": "Hotels and Guest Accommodation",
    "secondaryCategories": [
      "Wedding Lawns and Venues"
    ],
    "description": "85 luxury deluxe and royal executive suites right next to international terminal, featuring hospitality concierge and breakfast dining.",
    "serviceOfferings": [
      "Bridal Luxury Suites",
      "Deluxe Guest Room Blocks",
      "24/7 Airport Shuttle",
      "Bespoke Room Hampers",
      "Pre-Wedding Breakfast"
    ],
    "maximumGuestCapacity": 400,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 6500,
    "priceUnit": "per room/night",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-25": "Fully Booked"
    },
    "completedOrders90Days": 25,
    "averageOrderValue90Days": 320000,
    "portfolioImages": [
      "/assets/hot-1.jpg",
      "/assets/hot-2.jpg"
    ],
    "serviceTags": [
      "85 Room Block",
      "Airport Proximity",
      "Executive Suites",
      "Hospitality Desk"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-hot-06.demo.wedora.in",
    "contactPhone": "+91 98000 0138",
    "repeatOrdersArea": {
      "Andheri": 5,
      "Powai": 6,
      "Goregaon": 5
    },
    "referralsArea": {
      "Andheri": 9,
      "Powai": 9,
      "Goregaon": 9
    },
    "repeatOrdersTotal": 16,
    "referralsTotal": 27,
    "profileCreatedAt": "2026-01-20",
    "isActive": true,
    "isDemoData": true,
    "completedOrders": 114,
    "successfulReferralBookings": 27,
    "repeatCustomerBookings": 16,
    "onTimeDeliveryPercent": 94,
    "verifiedCustomerFeedbackCount": 50,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Andheri": 29,
      "Powai": 28,
      "Goregaon": 40
    },
    "customerFeedback": [
      {
        "id": "fb-mum-hot-06-1",
        "customerName": "V. Mehta",
        "eventType": "Mehendi Celebration",
        "location": "Andheri, Mumbai",
        "comment": "Expansive lush green lawn, pristine air-conditioned bridal suites, and seamless valet management for 600+ guests. Acoustic sound restrictions required lowering music volume slightly past 10 PM in the open section.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-hot-06-2",
        "customerName": "C. Gaikwad",
        "eventType": "Mehendi Celebration",
        "location": "Powai, Mumbai",
        "comment": "Stunning banquet hall with high ceilings and regal chandeliers. Guest parking and security staff were well organized. Restroom checks needed an extra reminder halfway through the reception.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "mum-hot-07",
    "businessName": "Seafront Heritage Palm Resort & Lodging",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Dadar",
      "Lower Parel"
    ],
    "category": "Hotels and Guest Accommodation",
    "secondaryCategories": [
      "Wedding Lawns and Venues"
    ],
    "description": "Colonial-style coastal heritage property with 60 sea-facing guest rooms, bridal pampering quarters, and private poolside hospitality lawns.",
    "serviceOfferings": [
      "Sea-Facing Deluxe Rooms",
      "Bridal Dressing Suite",
      "Poolside Sundowner Area",
      "Concierge Check-in Desk",
      "Valet Parking"
    ],
    "maximumGuestCapacity": 350,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 8500,
    "priceUnit": "per room/night",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available",
      "2026-12-21": "Tentative"
    },
    "completedOrders90Days": 21,
    "averageOrderValue90Days": 450000,
    "portfolioImages": [
      "/assets/hot-1.jpg",
      "/assets/hot-2.jpg"
    ],
    "serviceTags": [
      "Sea View Rooms",
      "Boutique Resort",
      "Bandra Coastline",
      "Heritage Charm"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-hot-07.demo.wedora.in",
    "contactPhone": "+91 98000 0139",
    "repeatOrdersArea": {
      "Bandra": 5,
      "Dadar": 5,
      "Lower Parel": 4
    },
    "referralsArea": {
      "Bandra": 8,
      "Dadar": 8,
      "Lower Parel": 8
    },
    "repeatOrdersTotal": 14,
    "referralsTotal": 24,
    "profileCreatedAt": "2026-02-05",
    "isActive": true,
    "isDemoData": true,
    "completedOrders": 95,
    "successfulReferralBookings": 24,
    "repeatCustomerBookings": 14,
    "onTimeDeliveryPercent": 95,
    "verifiedCustomerFeedbackCount": 43,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Bandra": 24,
      "Dadar": 24,
      "Lower Parel": 33
    },
    "customerFeedback": [
      {
        "id": "fb-mum-hot-07-1",
        "customerName": "K. Iyer",
        "eventType": "Grand Reception",
        "location": "Bandra, Mumbai",
        "comment": "Stunning banquet hall with high ceilings and regal chandeliers. Guest parking and security staff were well organized. Restroom checks needed an extra reminder halfway through the reception.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-mum-hot-07-2",
        "customerName": "A. Banerjee",
        "eventType": "Grand Reception",
        "location": "Dadar, Mumbai",
        "comment": "Wonderful venue ambiance with convenient proximity to the highway. Accommodated our vendors for setup effortlessly. Service entrance was busy during overlapping vendor load-ins.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-mum-hot-07-3",
        "customerName": "S. Kulkarni",
        "eventType": "Grand Reception",
        "location": "Lower Parel, Mumbai",
        "comment": "Expansive lush green lawn, pristine air-conditioned bridal suites, and seamless valet management for 600+ guests. Acoustic sound restrictions required lowering music volume slightly past 10 PM in the open section.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "mum-e2e-06",
    "businessName": "Parampara Turnkey Celebrations & Planners",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Dadar",
      "Bandra",
      "Lower Parel",
      "Chembur"
    ],
    "category": "End-to-End Event Management",
    "secondaryCategories": [
      "Event Organizers / Wedding Planners"
    ],
    "description": "Holistic end-to-end wedding direction covering muhurat pooja logistics, legal registrations, decor execution, artist bookings, and banquet stewardship.",
    "serviceOfferings": [
      "Full Wedding Production",
      "Vendor Contracting",
      "Guest Hospitality Flow",
      "Timeline Management",
      "VIP Protocol"
    ],
    "maximumGuestCapacity": 1200,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 750000,
    "priceUnit": "turnkey package",
    "quotationRequired": true,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available",
      "2026-12-24": "Unavailable"
    },
    "completedOrders90Days": 17,
    "averageOrderValue90Days": 850000,
    "portfolioImages": [
      "/assets/e2e-1.jpg",
      "/assets/e2e-2.jpg"
    ],
    "serviceTags": [
      "Turnkey Production",
      "Single-Window Management",
      "Ceremony Orchestration",
      "Concierge Team"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-e2e-06.demo.wedora.in",
    "contactPhone": "+91 98000 0140",
    "repeatOrdersArea": {
      "Dadar": 4,
      "Bandra": 3,
      "Lower Parel": 4,
      "Chembur": 3
    },
    "referralsArea": {
      "Dadar": 6,
      "Bandra": 6,
      "Lower Parel": 6,
      "Chembur": 6
    },
    "repeatOrdersTotal": 14,
    "referralsTotal": 24,
    "profileCreatedAt": "2026-01-12",
    "isActive": true,
    "isDemoData": true,
    "completedOrders": 75,
    "successfulReferralBookings": 24,
    "repeatCustomerBookings": 14,
    "onTimeDeliveryPercent": 98,
    "verifiedCustomerFeedbackCount": 29,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Dadar": 15,
      "Bandra": 14,
      "Lower Parel": 15,
      "Chembur": 20
    },
    "customerFeedback": [
      {
        "id": "fb-mum-e2e-06-1",
        "customerName": "H. Trivedi",
        "eventType": "Mehendi Celebration",
        "location": "Dadar, Mumbai",
        "comment": "Reduced our family stress to zero. Budget tracker and daily checklists were transparent and meticulously maintained. Bride side car coordination had minor confusion that was rectified promptly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-mum-e2e-06-2",
        "customerName": "V. Kadam",
        "eventType": "Mehendi Celebration",
        "location": "Bandra, Mumbai",
        "comment": "Masterful crowd control and welcoming hospitality for our 800+ guests. Every vendor delivered on time under their watch. Pre-wedding rehearsal was brief, but the main day execution went smoothly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-mum-e2e-06-3",
        "customerName": "N. Nair",
        "eventType": "Mehendi Celebration",
        "location": "Lower Parel, Mumbai",
        "comment": "Flawless end-to-end orchestration! They kept the pandit, caterers, and sound engineers perfectly in sync throughout. Varmala stage entry timing was pushed back by 15 minutes due to guest arrival traffic.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      }
    ]
  },
  {
    "id": "mum-e2e-07",
    "businessName": "Nova Spectra Grand Events",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Andheri",
      "Powai",
      "Borivali",
      "Goregaon"
    ],
    "category": "End-to-End Event Management",
    "secondaryCategories": [
      "Event Organizers / Wedding Planners"
    ],
    "description": "High-tech immersive wedding productions integrating sync sound, projection mapping, international dance troupes, and seamless guest hospitality.",
    "serviceOfferings": [
      "Complete Event Production",
      "Show Direction",
      "Artist & Celebrity Booking",
      "Logistics Coordination",
      "Security & Crowd Control"
    ],
    "maximumGuestCapacity": 2000,
    "maximumSimultaneousBookings": 1,
    "startingPrice": 900000,
    "priceUnit": "turnkey package",
    "quotationRequired": true,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-19": "Available",
      "2026-12-26": "Fully Booked"
    },
    "completedOrders90Days": 15,
    "averageOrderValue90Days": 950000,
    "portfolioImages": [
      "/assets/e2e-1.jpg",
      "/assets/e2e-2.jpg"
    ],
    "serviceTags": [
      "High-Tech Staging",
      "Celebrity Artists",
      "Full-Spectrum Management",
      "Mega Banquets"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-e2e-07.demo.wedora.in",
    "contactPhone": "+91 98000 0141",
    "repeatOrdersArea": {
      "Andheri": 3,
      "Powai": 3,
      "Borivali": 3,
      "Goregaon": 3
    },
    "referralsArea": {
      "Andheri": 5,
      "Powai": 5,
      "Borivali": 5,
      "Goregaon": 5
    },
    "repeatOrdersTotal": 12,
    "referralsTotal": 20,
    "profileCreatedAt": "2026-03-01",
    "isActive": true,
    "isDemoData": true,
    "completedOrders": 66,
    "successfulReferralBookings": 20,
    "repeatCustomerBookings": 12,
    "onTimeDeliveryPercent": 97,
    "verifiedCustomerFeedbackCount": 25,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Andheri": 13,
      "Powai": 13,
      "Borivali": 13,
      "Goregaon": 17
    },
    "customerFeedback": [
      {
        "id": "fb-mum-e2e-07-1",
        "customerName": "T. Agarwal",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Andheri, Mumbai",
        "comment": "Flawless end-to-end orchestration! They kept the pandit, caterers, and sound engineers perfectly in sync throughout. Varmala stage entry timing was pushed back by 15 minutes due to guest arrival traffic.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-mum-e2e-07-2",
        "customerName": "R. Tendulkar",
        "eventType": "Ring Ceremony & Engagement",
        "location": "Powai, Mumbai",
        "comment": "Reduced our family stress to zero. Budget tracker and daily checklists were transparent and meticulously maintained. Bride side car coordination had minor confusion that was rectified promptly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "mum-mak-06",
    "businessName": "Glamour & Glow Bridal Studio by Natasha",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Bandra",
      "Andheri",
      "Lower Parel",
      "Goregaon"
    ],
    "category": "Makeup and Mehendi Artists",
    "secondaryCategories": [],
    "description": "Celebrity bridal makeup artist specializing in HD airbrush finishes, natural dewy skins, customized saree draping, and intricate bridal mehendi.",
    "serviceOfferings": [
      "HD Airbrush Bridal Makeup",
      "Organic Marwari Mehendi",
      "Saree & Dupatta Draping",
      "Mother of Bride Styling",
      "Pre-Bridal Skincare Prep"
    ],
    "maximumSimultaneousBookings": 2,
    "startingPrice": 35000,
    "priceUnit": "per bridal package",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available",
      "2026-12-20": "Tentative"
    },
    "completedOrders90Days": 30,
    "averageOrderValue90Days": 45000,
    "portfolioImages": [
      "/assets/mak-1.jpg",
      "/assets/mak-2.jpg"
    ],
    "serviceTags": [
      "HD Airbrush",
      "Celebrity Stylist",
      "Natural Dewy Look",
      "Organic Henna"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@mum-mak-06.demo.wedora.in",
    "contactPhone": "+91 98000 0142",
    "repeatOrdersArea": {
      "Bandra": 6,
      "Andheri": 5,
      "Lower Parel": 6,
      "Goregaon": 5
    },
    "referralsArea": {
      "Bandra": 11,
      "Andheri": 11,
      "Lower Parel": 11,
      "Goregaon": 10
    },
    "repeatOrdersTotal": 22,
    "referralsTotal": 43,
    "profileCreatedAt": "2026-01-08",
    "isActive": true,
    "isDemoData": true,
    "completedOrders": 138,
    "successfulReferralBookings": 43,
    "repeatCustomerBookings": 22,
    "onTimeDeliveryPercent": 93,
    "verifiedCustomerFeedbackCount": 44,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Bandra": 27,
      "Andheri": 26,
      "Lower Parel": 27,
      "Goregaon": 37
    },
    "customerFeedback": [
      {
        "id": "fb-mum-mak-06-1",
        "customerName": "B. Chavan",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Bandra, Mumbai",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-mum-mak-06-2",
        "customerName": "S. More",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Andheri, Mumbai",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "mum-mak-07",
    "businessName": "Riddhi Siddhi Bridal Mehendi & Artistry",
    "primaryCity": "Mumbai",
    "serviceableAreas": [
      "Ghatkopar",
      "Mulund",
      "Thane",
      "Chembur"
    ],
    "category": "Makeup and Mehendi Artists",
    "secondaryCategories": [],
    "description": "Traditional Rajasthani, Arabic, and personalized portrait mehendi designs combined with traditional bridal makeup and hair styling.",
    "serviceOfferings": [
      "Bridal Portrait Henna",
      "Rajasthani Traditional Henna",
      "Guest Mehendi Team",
      "Hair Extension Styling",
      "Jewelry Setting"
    ],
    "maximumSimultaneousBookings": 3,
    "startingPrice": 22000,
    "priceUnit": "per bridal package",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-24": "Unavailable"
    },
    "completedOrders90Days": 0,
    "averageOrderValue90Days": 0,
    "portfolioImages": [
      "/assets/mak-1.jpg",
      "/assets/mak-2.jpg"
    ],
    "serviceTags": [
      "Portrait Mehendi",
      "Rajasthani Designs",
      "Guest Henna Artists",
      "Traditional Hair"
    ],
    "isNewToPlatform": true,
    "contactEmail": "contact@mum-mak-07.demo.wedora.in",
    "contactPhone": "+91 98000 0143",
    "repeatOrdersArea": {},
    "referralsArea": {},
    "repeatOrdersTotal": 0,
    "referralsTotal": 0,
    "profileCreatedAt": "2026-10-15",
    "isActive": true,
    "isDemoData": true,
    "completedOrders": 0,
    "successfulReferralBookings": 0,
    "repeatCustomerBookings": 0,
    "onTimeDeliveryPercent": 100,
    "verifiedCustomerFeedbackCount": 0,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 100,
    "completedOrdersArea": {},
    "customerFeedback": []
  },
  {
    "id": "pun-fur-06",
    "businessName": "Deccan Heritage Seating & Tents",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Kothrud",
      "Shivajinagar",
      "Aundh",
      "Baner"
    ],
    "category": "Furniture and Equipment Rental",
    "secondaryCategories": [
      "Lighting Services"
    ],
    "description": "Authentic wooden carved royal chairs, traditional bajot dining tables, brass samai stands, and vintage shamiana canopies.",
    "serviceOfferings": [
      "Traditional Bajot Tables",
      "Carved Wooden Chairs",
      "Vintage Shamianas",
      "Brass Samai Stands",
      "Cushioned Diwans"
    ],
    "maximumSimultaneousBookings": 2,
    "startingPrice": 70000,
    "priceUnit": "per setup",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available",
      "2026-12-20": "Available"
    },
    "completedOrders90Days": 13,
    "averageOrderValue90Days": 175000,
    "portfolioImages": [
      "/assets/fur-1.jpg",
      "/assets/fur-2.jpg"
    ],
    "serviceTags": [
      "Wooden Carved",
      "Traditional Bajot",
      "Shamiana Sets",
      "Heritage Decor"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-fur-06.demo.wedora.in",
    "contactPhone": "+91 98000 0144",
    "repeatOrdersArea": {
      "Kothrud": 3,
      "Shivajinagar": 2,
      "Aundh": 3,
      "Baner": 2
    },
    "referralsArea": {
      "Kothrud": 4,
      "Shivajinagar": 3,
      "Aundh": 4,
      "Baner": 3
    },
    "repeatOrdersTotal": 10,
    "referralsTotal": 14,
    "profileCreatedAt": "2026-02-18",
    "isActive": true,
    "isDemoData": true,
    "completedOrders": 60,
    "successfulReferralBookings": 14,
    "repeatCustomerBookings": 10,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 26,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Kothrud": 12,
      "Shivajinagar": 11,
      "Aundh": 12,
      "Baner": 16
    },
    "customerFeedback": [
      {
        "id": "fb-pun-fur-06-1",
        "customerName": "B. Chavan",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Kothrud, Pune",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-fur-06-2",
        "customerName": "S. More",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Shivajinagar, Pune",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "pun-fur-07",
    "businessName": "Wakad Event Infra & Audio-Visual Rentals",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Wakad",
      "Hinjewadi",
      "Baner",
      "Pimpri-Chinchwad"
    ],
    "category": "Furniture and Equipment Rental",
    "secondaryCategories": [
      "DJ and Sound Systems"
    ],
    "description": "Modern banquet inventory with LED backlit bars, high-gloss white dance stages, contemporary barstools, and silent power generators.",
    "serviceOfferings": [
      "LED Backlit Bars",
      "White Acrylic Dance Floors",
      "Modern Bar Stools",
      "Silent Diesel Generators",
      "Truss Systems"
    ],
    "maximumSimultaneousBookings": 3,
    "startingPrice": 85000,
    "priceUnit": "per setup",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-17": "Available",
      "2026-12-23": "Fully Booked"
    },
    "completedOrders90Days": 16,
    "averageOrderValue90Days": 210000,
    "portfolioImages": [
      "/assets/fur-1.jpg",
      "/assets/fur-2.jpg"
    ],
    "serviceTags": [
      "LED Bars",
      "White Dance Floor",
      "Modern Stools",
      "Silent Genset"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-fur-07.demo.wedora.in",
    "contactPhone": "+91 98000 0145",
    "repeatOrdersArea": {
      "Wakad": 3,
      "Hinjewadi": 3,
      "Baner": 3,
      "Pimpri-Chinchwad": 3
    },
    "referralsArea": {
      "Wakad": 5,
      "Hinjewadi": 4,
      "Baner": 5,
      "Pimpri-Chinchwad": 4
    },
    "repeatOrdersTotal": 12,
    "referralsTotal": 18,
    "profileCreatedAt": "2026-01-25",
    "isActive": true,
    "isDemoData": true,
    "completedOrders": 73,
    "successfulReferralBookings": 18,
    "repeatCustomerBookings": 12,
    "onTimeDeliveryPercent": 93,
    "verifiedCustomerFeedbackCount": 33,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 96,
    "completedOrdersArea": {
      "Wakad": 14,
      "Hinjewadi": 14,
      "Baner": 14,
      "Pimpri-Chinchwad": 20
    },
    "customerFeedback": [
      {
        "id": "fb-pun-fur-07-1",
        "customerName": "R. Tendulkar",
        "eventType": "Wedding Ceremony",
        "location": "Wakad, Pune",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-fur-07-2",
        "customerName": "P. Deshmukh",
        "eventType": "Wedding Ceremony",
        "location": "Hinjewadi, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-fur-07-3",
        "customerName": "K. Iyer",
        "eventType": "Wedding Ceremony",
        "location": "Baner, Pune",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  },
  {
    "id": "pun-hot-06",
    "businessName": "Koregaon Park Grand Manor & Suites",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Koregaon Park",
      "Viman Nagar",
      "Kharadi"
    ],
    "category": "Hotels and Guest Accommodation",
    "secondaryCategories": [
      "Wedding Lawns and Venues"
    ],
    "description": "Boutique 70-key luxury urban oasis nestled among Koregaon Park banyan trees, featuring serene garden courtyards and gourmet dining.",
    "serviceOfferings": [
      "Executive Garden Suites",
      "Dedicated Wedding Wing",
      "Hospitality Desk",
      "Private Breakfast Terrace",
      "Spa Packages"
    ],
    "maximumGuestCapacity": 450,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 5800,
    "priceUnit": "per room/night",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available",
      "2026-12-22": "Available"
    },
    "completedOrders90Days": 21,
    "averageOrderValue90Days": 280000,
    "portfolioImages": [
      "/assets/hot-1.jpg",
      "/assets/hot-2.jpg"
    ],
    "serviceTags": [
      "70 Keys",
      "Koregaon Park",
      "Garden Courtyard",
      "Luxury Stay"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-hot-06.demo.wedora.in",
    "contactPhone": "+91 98000 0146",
    "repeatOrdersArea": {
      "Koregaon Park": 4,
      "Viman Nagar": 5,
      "Kharadi": 4
    },
    "referralsArea": {
      "Koregaon Park": 7,
      "Viman Nagar": 8,
      "Kharadi": 7
    },
    "repeatOrdersTotal": 13,
    "referralsTotal": 22,
    "profileCreatedAt": "2026-02-10",
    "isActive": true,
    "isDemoData": true,
    "completedOrders": 94,
    "successfulReferralBookings": 22,
    "repeatCustomerBookings": 13,
    "onTimeDeliveryPercent": 97,
    "verifiedCustomerFeedbackCount": 34,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Koregaon Park": 24,
      "Viman Nagar": 23,
      "Kharadi": 33
    },
    "customerFeedback": [
      {
        "id": "fb-pun-hot-06-1",
        "customerName": "V. Mehta",
        "eventType": "Mehendi Celebration",
        "location": "Koregaon Park, Pune",
        "comment": "Stunning banquet hall with high ceilings and regal chandeliers. Guest parking and security staff were well organized. Restroom checks needed an extra reminder halfway through the reception.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      },
      {
        "id": "fb-pun-hot-06-2",
        "customerName": "C. Gaikwad",
        "eventType": "Mehendi Celebration",
        "location": "Viman Nagar, Pune",
        "comment": "Wonderful venue ambiance with convenient proximity to the highway. Accommodated our vendors for setup effortlessly. Service entrance was busy during overlapping vendor load-ins.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      }
    ]
  },
  {
    "id": "pun-hot-07",
    "businessName": "Hinjewadi Pavilion Regency Hotel",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Hinjewadi",
      "Wakad",
      "Baner",
      "Pimpri-Chinchwad"
    ],
    "category": "Hotels and Guest Accommodation",
    "secondaryCategories": [
      "Wedding Lawns and Venues"
    ],
    "description": "Contemporary business-and-leisure hotel with 110 spacious rooms, high-speed connectivity, airport shuttles, and banquet catering support.",
    "serviceOfferings": [
      "110 Deluxe Rooms",
      "Bridal Dressing Suite",
      "Airport Transit Shuttles",
      "Late Check-out Privilege",
      "Group Buffet Dining"
    ],
    "maximumGuestCapacity": 600,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 4200,
    "priceUnit": "per room/night",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-24": "Unavailable"
    },
    "completedOrders90Days": 0,
    "averageOrderValue90Days": 0,
    "portfolioImages": [
      "/assets/hot-1.jpg",
      "/assets/hot-2.jpg"
    ],
    "serviceTags": [
      "110 Rooms",
      "Hinjewadi Hub",
      "Large Room Block",
      "Buffet Dining"
    ],
    "isNewToPlatform": true,
    "contactEmail": "contact@pun-hot-07.demo.wedora.in",
    "contactPhone": "+91 98000 0147",
    "repeatOrdersArea": {},
    "referralsArea": {},
    "repeatOrdersTotal": 0,
    "referralsTotal": 0,
    "profileCreatedAt": "2026-10-18",
    "isActive": true,
    "isDemoData": true,
    "completedOrders": 0,
    "successfulReferralBookings": 0,
    "repeatCustomerBookings": 0,
    "onTimeDeliveryPercent": 100,
    "verifiedCustomerFeedbackCount": 0,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 100,
    "completedOrdersArea": {},
    "customerFeedback": []
  },
  {
    "id": "pun-e2e-06",
    "businessName": "Saptapadi Comprehensive Wedding Orchestration",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Kothrud",
      "Shivajinagar",
      "Aundh",
      "Baner"
    ],
    "category": "End-to-End Event Management",
    "secondaryCategories": [
      "Event Organizers / Wedding Planners"
    ],
    "description": "End-to-end wedding production team specializing in authentic Maharashtrian rituals, guest RSVP management, catering supervision, and sangeet choreography.",
    "serviceOfferings": [
      "End-to-End Planning",
      "Pooja & Ritual Coordination",
      "Guest Transport Fleet",
      "Artist Management",
      "On-Ground Timeline Control"
    ],
    "maximumGuestCapacity": 1000,
    "maximumSimultaneousBookings": 2,
    "startingPrice": 620000,
    "priceUnit": "turnkey package",
    "quotationRequired": true,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available",
      "2026-12-21": "Tentative"
    },
    "completedOrders90Days": 17,
    "averageOrderValue90Days": 680000,
    "portfolioImages": [
      "/assets/e2e-1.jpg",
      "/assets/e2e-2.jpg"
    ],
    "serviceTags": [
      "Rituals Expert",
      "RSVP Desk",
      "Timeline Control",
      "Turnkey Weddings"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-e2e-06.demo.wedora.in",
    "contactPhone": "+91 98000 0148",
    "repeatOrdersArea": {
      "Kothrud": 3,
      "Shivajinagar": 3,
      "Aundh": 3,
      "Baner": 2
    },
    "referralsArea": {
      "Kothrud": 4,
      "Shivajinagar": 4,
      "Aundh": 5,
      "Baner": 4
    },
    "repeatOrdersTotal": 11,
    "referralsTotal": 17,
    "profileCreatedAt": "2026-01-30",
    "isActive": true,
    "isDemoData": true,
    "completedOrders": 75,
    "successfulReferralBookings": 17,
    "repeatCustomerBookings": 11,
    "onTimeDeliveryPercent": 98,
    "verifiedCustomerFeedbackCount": 26,
    "vendorCausedCancellations": 0,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Kothrud": 15,
      "Shivajinagar": 14,
      "Aundh": 15,
      "Baner": 20
    },
    "customerFeedback": [
      {
        "id": "fb-pun-e2e-06-1",
        "customerName": "K. Iyer",
        "eventType": "Grand Reception",
        "location": "Kothrud, Pune",
        "comment": "Flawless end-to-end orchestration! They kept the pandit, caterers, and sound engineers perfectly in sync throughout. Varmala stage entry timing was pushed back by 15 minutes due to guest arrival traffic.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-e2e-06-2",
        "customerName": "A. Banerjee",
        "eventType": "Grand Reception",
        "location": "Shivajinagar, Pune",
        "comment": "Reduced our family stress to zero. Budget tracker and daily checklists were transparent and meticulously maintained. Bride side car coordination had minor confusion that was rectified promptly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      },
      {
        "id": "fb-pun-e2e-06-3",
        "customerName": "S. Kulkarni",
        "eventType": "Grand Reception",
        "location": "Aundh, Pune",
        "comment": "Masterful crowd control and welcoming hospitality for our 800+ guests. Every vendor delivered on time under their watch. Pre-wedding rehearsal was brief, but the main day execution went smoothly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      }
    ]
  },
  {
    "id": "pun-e2e-07",
    "businessName": "Zenith Elite Events & Productions",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Viman Nagar",
      "Kharadi",
      "Koregaon Park",
      "Hadapsar",
      "Magarpatta"
    ],
    "category": "End-to-End Event Management",
    "secondaryCategories": [
      "Event Organizers / Wedding Planners"
    ],
    "description": "Full-service wedding and gala productions company providing turn-key staging, international artist management, customized food curation, and 360-degree timeline tracking.",
    "serviceOfferings": [
      "Turnkey Production",
      "International Artists",
      "Custom Culinary Experience",
      "360-Degree Logistics",
      "VIP Escort Service"
    ],
    "maximumGuestCapacity": 1500,
    "maximumSimultaneousBookings": 1,
    "startingPrice": 880000,
    "priceUnit": "turnkey package",
    "quotationRequired": true,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-17": "Available",
      "2026-12-25": "Fully Booked"
    },
    "completedOrders90Days": 13,
    "averageOrderValue90Days": 920000,
    "portfolioImages": [
      "/assets/e2e-1.jpg",
      "/assets/e2e-2.jpg"
    ],
    "serviceTags": [
      "Elite Gala",
      "Mega Staging",
      "360-Degree Planning",
      "Turnkey Luxury"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-e2e-07.demo.wedora.in",
    "contactPhone": "+91 98000 0149",
    "repeatOrdersArea": {
      "Viman Nagar": 2,
      "Kharadi": 2,
      "Koregaon Park": 2,
      "Hadapsar": 2,
      "Magarpatta": 2
    },
    "referralsArea": {
      "Viman Nagar": 3,
      "Kharadi": 3,
      "Koregaon Park": 3,
      "Hadapsar": 3,
      "Magarpatta": 2
    },
    "repeatOrdersTotal": 10,
    "referralsTotal": 14,
    "profileCreatedAt": "2026-02-22",
    "isActive": true,
    "isDemoData": true,
    "completedOrders": 60,
    "successfulReferralBookings": 14,
    "repeatCustomerBookings": 10,
    "onTimeDeliveryPercent": 99,
    "verifiedCustomerFeedbackCount": 22,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 99,
    "completedOrdersArea": {
      "Viman Nagar": 9,
      "Kharadi": 10,
      "Koregaon Park": 9,
      "Hadapsar": 10,
      "Magarpatta": 13
    },
    "customerFeedback": [
      {
        "id": "fb-pun-e2e-07-1",
        "customerName": "B. Chavan",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Viman Nagar, Pune",
        "comment": "Reduced our family stress to zero. Budget tracker and daily checklists were transparent and meticulously maintained. Bride side car coordination had minor confusion that was rectified promptly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-e2e-07-2",
        "customerName": "S. More",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Kharadi, Pune",
        "comment": "Masterful crowd control and welcoming hospitality for our 800+ guests. Every vendor delivered on time under their watch. Pre-wedding rehearsal was brief, but the main day execution went smoothly.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "pun-mak-06",
    "businessName": "Shringaar Bridal Beauty Lounge by Priya",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Baner",
      "Aundh",
      "Wakad",
      "Shivajinagar"
    ],
    "category": "Makeup and Mehendi Artists",
    "secondaryCategories": [],
    "description": "Signature bridal looks featuring luxury MAC & Bobbi Brown cosmetics, water-resistant airbrush finishes, traditional Nauvari draping, and flower-braid hair styling.",
    "serviceOfferings": [
      "Water-Resistant Airbrush Makeup",
      "Nauvari Saree Draping",
      "Floral Hair Venis",
      "Sangeet Glam Party Makeup",
      "Pre-Bridal Glow Facials"
    ],
    "maximumSimultaneousBookings": 2,
    "startingPrice": 28000,
    "priceUnit": "per bridal package",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-16": "Available",
      "2026-12-19": "Available"
    },
    "completedOrders90Days": 26,
    "averageOrderValue90Days": 38000,
    "portfolioImages": [
      "/assets/mak-1.jpg",
      "/assets/mak-2.jpg"
    ],
    "serviceTags": [
      "Nauvari Draping",
      "Airbrush Makeup",
      "Floral Venis",
      "Luxury Cosmetics"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-mak-06.demo.wedora.in",
    "contactPhone": "+91 98000 0150",
    "repeatOrdersArea": {
      "Baner": 5,
      "Aundh": 5,
      "Wakad": 5,
      "Shivajinagar": 4
    },
    "referralsArea": {
      "Baner": 9,
      "Aundh": 9,
      "Wakad": 9,
      "Shivajinagar": 8
    },
    "repeatOrdersTotal": 19,
    "referralsTotal": 35,
    "profileCreatedAt": "2026-01-15",
    "isActive": true,
    "isDemoData": true,
    "completedOrders": 118,
    "successfulReferralBookings": 35,
    "repeatCustomerBookings": 19,
    "onTimeDeliveryPercent": 96,
    "verifiedCustomerFeedbackCount": 50,
    "vendorCausedCancellations": 1,
    "serviceCommitmentsMetPercent": 98,
    "completedOrdersArea": {
      "Baner": 23,
      "Aundh": 23,
      "Wakad": 23,
      "Shivajinagar": 31
    },
    "customerFeedback": [
      {
        "id": "fb-pun-mak-06-1",
        "customerName": "B. Chavan",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Baner, Pune",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "October 2025"
      },
      {
        "id": "fb-pun-mak-06-2",
        "customerName": "S. More",
        "eventType": "Sangeet & Cocktail Night",
        "location": "Aundh, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "February 2026"
      }
    ]
  },
  {
    "id": "pun-mak-07",
    "businessName": "Mehendi Kala Kendra & Bridal Looks",
    "primaryCity": "Pune",
    "serviceableAreas": [
      "Kothrud",
      "Koregaon Park",
      "Hadapsar",
      "Viman Nagar"
    ],
    "category": "Makeup and Mehendi Artists",
    "secondaryCategories": [],
    "description": "100% natural organic dark-stain henna cones, intricate figure and lotus mehendi motifs, along with complete bridesmaids styling stations.",
    "serviceOfferings": [
      "Organic Dark-Stain Henna",
      "Intricate Lotus & Figure Work",
      "Bridesmaids Mehendi Station",
      "Traditional Hair Braiding",
      "Touch-Up Concierge"
    ],
    "maximumSimultaneousBookings": 3,
    "startingPrice": 18000,
    "priceUnit": "per bridal package",
    "quotationRequired": false,
    "availabilityDates": {
      "2026-12-15": "Available",
      "2026-12-18": "Available",
      "2026-12-22": "Tentative"
    },
    "completedOrders90Days": 24,
    "averageOrderValue90Days": 28000,
    "portfolioImages": [
      "/assets/mak-1.jpg",
      "/assets/mak-2.jpg"
    ],
    "serviceTags": [
      "Organic Henna",
      "Lotus Motifs",
      "Bridesmaids Team",
      "Traditional Hair"
    ],
    "isNewToPlatform": false,
    "contactEmail": "contact@pun-mak-07.demo.wedora.in",
    "contactPhone": "+91 98000 0151",
    "repeatOrdersArea": {
      "Kothrud": 5,
      "Koregaon Park": 4,
      "Hadapsar": 5,
      "Viman Nagar": 4
    },
    "referralsArea": {
      "Kothrud": 8,
      "Koregaon Park": 8,
      "Hadapsar": 9,
      "Viman Nagar": 8
    },
    "repeatOrdersTotal": 18,
    "referralsTotal": 33,
    "profileCreatedAt": "2026-02-28",
    "isActive": true,
    "isDemoData": true,
    "completedOrders": 107,
    "successfulReferralBookings": 33,
    "repeatCustomerBookings": 18,
    "onTimeDeliveryPercent": 97,
    "verifiedCustomerFeedbackCount": 46,
    "vendorCausedCancellations": 2,
    "serviceCommitmentsMetPercent": 97,
    "completedOrdersArea": {
      "Kothrud": 21,
      "Koregaon Park": 21,
      "Hadapsar": 20,
      "Viman Nagar": 29
    },
    "customerFeedback": [
      {
        "id": "fb-pun-mak-07-1",
        "customerName": "R. Tendulkar",
        "eventType": "Wedding Ceremony",
        "location": "Kothrud, Pune",
        "comment": "Coordinated seamlessly with our event planner and delivered exactly as agreed in the formal quotation. Minor wrap-up delay at midnight due to heavy packing load.",
        "isVerifiedBooking": true,
        "eventMonthYear": "December 2025"
      },
      {
        "id": "fb-pun-mak-07-2",
        "customerName": "P. Deshmukh",
        "eventType": "Wedding Ceremony",
        "location": "Koregaon Park, Pune",
        "comment": "Top-tier service delivery, clear communication throughout, and high professional standards. Exactly what we needed. Initial briefing call was rescheduled once, but the actual execution on event day was spotless.",
        "isVerifiedBooking": true,
        "eventMonthYear": "November 2025"
      },
      {
        "id": "fb-pun-mak-07-3",
        "customerName": "K. Iyer",
        "eventType": "Wedding Ceremony",
        "location": "Hadapsar, Pune",
        "comment": "Extremely dependable team with great attention to detail. Arrived on time and delivered with high precision. Additional equipment required a brief spot verification before kickoff.",
        "isVerifiedBooking": true,
        "eventMonthYear": "January 2026"
      }
    ]
  }
];

export default DEMO_VENDORS;
