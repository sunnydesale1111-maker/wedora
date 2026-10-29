const fs = require('fs');
const path = require('path');

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

const demoVendorsPath = path.join(__dirname, '../src/data/demoVendors.ts');
const rawContent = fs.readFileSync(demoVendorsPath, 'utf8');

const jsonMatch = rawContent.match(/export const DEMO_VENDORS:\s*Vendor\[\]\s*=\s*(\[[\s\S]*\]);/);
if (!jsonMatch) {
  console.error('ERROR: Could not parse DEMO_VENDORS array.');
  process.exit(1);
}

const vendors = JSON.parse(jsonMatch[1]);
console.log(`Auditing ${vendors.length} vendors for Version 4.0 validation requirements...\n`);

let errors = [];

// 1. Unique IDs
const idSet = new Set();
vendors.forEach((v) => {
  if (!v.id) {
    errors.push(`Vendor "${v.businessName}" missing ID.`);
  } else if (idSet.has(v.id)) {
    errors.push(`Duplicate vendor ID found: ${v.id}`);
  } else {
    idSet.add(v.id);
  }
});

// 2. Complete Profile & Serviceable Areas
vendors.forEach((v) => {
  if (!v.businessName || typeof v.businessName !== 'string') {
    errors.push(`Vendor ${v.id} missing businessName.`);
  }
  if (!v.primaryCity || !['Mumbai', 'Pune'].includes(v.primaryCity)) {
    errors.push(`Vendor ${v.id} has invalid primaryCity: ${v.primaryCity}`);
  }
  if (!Array.isArray(v.serviceableAreas) || v.serviceableAreas.length === 0) {
    errors.push(`Vendor ${v.id} has no serviceableAreas.`);
  }
  if (!v.description || v.description.length < 15) {
    errors.push(`Vendor ${v.id} description too short or missing.`);
  }
  if (!Array.isArray(v.serviceOfferings) || v.serviceOfferings.length === 0) {
    errors.push(`Vendor ${v.id} missing serviceOfferings.`);
  }
  if (!v.availabilityDates || typeof v.availabilityDates !== 'object') {
    errors.push(`Vendor ${v.id} has invalid availabilityDates.`);
  }

  // Non-negative counts
  if (typeof v.completedOrders90Days !== 'number' || v.completedOrders90Days < 0) {
    errors.push(`Vendor ${v.id} completedOrders90Days must be non-negative number.`);
  }
  if (v.repeatOrdersArea) {
    for (const [area, cnt] of Object.entries(v.repeatOrdersArea)) {
      if (typeof cnt !== 'number' || cnt < 0) {
        errors.push(`Vendor ${v.id} repeatOrdersArea for ${area} is negative.`);
      }
    }
  }
  if (v.referralsArea) {
    for (const [area, cnt] of Object.entries(v.referralsArea)) {
      if (typeof cnt !== 'number' || cnt < 0) {
        errors.push(`Vendor ${v.id} referralsArea for ${area} is negative.`);
      }
    }
  }
});

// 3. Category Coverage Report (Minimum 5 per category in each city)
const coverage = {};
for (const cat of CANONICAL_CATEGORIES) {
  coverage[cat] = { Mumbai: 0, Pune: 0 };
}

for (const v of vendors) {
  const cats = [v.category, ...(v.secondaryCategories || [])];
  for (const c of cats) {
    if (coverage[c]) {
      coverage[c][v.primaryCity]++;
    }
  }
}

console.log('========================================================================');
console.log('AI Wedding Timeline Orchestrator — Category-by-City Coverage Report:');
console.log('========================================================================');
console.table(coverage);

for (const cat of CANONICAL_CATEGORIES) {
  if (coverage[cat].Mumbai < 5) {
    errors.push(`Category "${cat}" in Mumbai has only ${coverage[cat].Mumbai} vendors (< 5 minimum).`);
  }
  if (coverage[cat].Pune < 5) {
    errors.push(`Category "${cat}" in Pune has only ${coverage[cat].Pune} vendors (< 5 minimum).`);
  }
}

if (errors.length > 0) {
  console.error('\nDATASET VALIDATION FAILED WITH THE FOLLOWING ERRORS:');
  errors.forEach((e) => console.error(` - ${e}`));
  process.exit(1);
} else {
  console.log('\n========================================================================');
  console.log('ALL DATASET VALIDATION CHECKS PASSED SUCCESSFULLY (Exit Code: 0)');
  console.log(`- Verified: Unique IDs across all ${vendors.length} vendors`);
  console.log('- Verified: Complete individual profiles with service offerings');
  console.log('- Verified: Valid availability data on every record');
  console.log('- Verified: Completed orders, repeat orders, and referrals are non-negative');
  console.log('- Verified: All 13 categories have at least 5 vendors in Mumbai AND Pune');
  console.log('========================================================================\n');
}
