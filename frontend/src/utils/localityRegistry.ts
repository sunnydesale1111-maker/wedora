export interface LocalityDefinition {
  canonicalName: string;
  city: 'Mumbai' | 'Pune';
  region: string;
  aliases: string[];
  devanagari: string;
}

/**
 * 36 Mandatory Mumbai Metropolitan Region (MMR) Localities
 */
export const MUMBAI_LOCALITY_REGISTRY: LocalityDefinition[] = [
  {
    canonicalName: 'Mumbai City and Mumbai Suburbs',
    city: 'Mumbai',
    region: 'Greater Mumbai',
    aliases: ['mumbai city', 'mumbai suburbs', 'greater mumbai', 'mumbai', 'मुंबई'],
    devanagari: 'मुंबई',
  },
  {
    canonicalName: 'Thane',
    city: 'Mumbai',
    region: 'Thane Region',
    aliases: ['thane west', 'thane east', 'thane city', 'ठाणे'],
    devanagari: 'ठाणे',
  },
  {
    canonicalName: 'Kalyan',
    city: 'Mumbai',
    region: 'Kalyan-Dombivli',
    aliases: ['kalyan west', 'kalyan east', 'kalyan city', 'कल्याण'],
    devanagari: 'कल्याण',
  },
  {
    canonicalName: 'Dombivli',
    city: 'Mumbai',
    region: 'Kalyan-Dombivli',
    aliases: ['dombivali', 'dombivli east', 'dombivli west', 'डोंबिवली'],
    devanagari: 'डोंबिवली',
  },
  {
    canonicalName: 'Navi Mumbai',
    city: 'Mumbai',
    region: 'Navi Mumbai',
    aliases: ['new bombay', 'new mumbai', 'नवी मुंबई'],
    devanagari: 'नवी मुंबई',
  },
  {
    canonicalName: 'Virar',
    city: 'Mumbai',
    region: 'Vasai-Virar',
    aliases: ['virar west', 'virar east', 'विरार'],
    devanagari: 'विरार',
  },
  {
    canonicalName: 'Mira Road',
    city: 'Mumbai',
    region: 'Mira-Bhayandar',
    aliases: ['mira road east', 'mira road west', 'मीरा रोड'],
    devanagari: 'मीरा रोड',
  },
  {
    canonicalName: 'Bhayandar',
    city: 'Mumbai',
    region: 'Mira-Bhayandar',
    aliases: ['bhayander', 'bhayandar west', 'bhayandar east', 'भाईंदर'],
    devanagari: 'भाईंदर',
  },
  {
    canonicalName: 'Vasai',
    city: 'Mumbai',
    region: 'Vasai-Virar',
    aliases: ['vasai west', 'vasai east', 'vasai road', 'वसई'],
    devanagari: 'वसई',
  },
  {
    canonicalName: 'Ulhasnagar',
    city: 'Mumbai',
    region: 'Thane Suburbs',
    aliases: ['ulhas nagar', 'उल्हासनगर'],
    devanagari: 'उल्हासनगर',
  },
  {
    canonicalName: 'Ambernath',
    city: 'Mumbai',
    region: 'Thane Suburbs',
    aliases: ['ambarnath', 'अंबरनाथ'],
    devanagari: 'अंबरनाथ',
  },
  {
    canonicalName: 'Badlapur',
    city: 'Mumbai',
    region: 'Thane Suburbs',
    aliases: ['badlapur east', 'badlapur west', 'बदलापूर'],
    devanagari: 'बदलापूर',
  },
  {
    canonicalName: 'Panvel',
    city: 'Mumbai',
    region: 'Navi Mumbai',
    aliases: ['new panvel', 'old panvel', 'पनवेल'],
    devanagari: 'पनवेल',
  },
  {
    canonicalName: 'Vashi',
    city: 'Mumbai',
    region: 'Navi Mumbai',
    aliases: ['vashi sector', 'वाशी'],
    devanagari: 'वाशी',
  },
  {
    canonicalName: 'Nerul',
    city: 'Mumbai',
    region: 'Navi Mumbai',
    aliases: ['nerul east', 'nerul west', 'नेरूळ', 'नेरुल'],
    devanagari: 'नेरूळ',
  },
  {
    canonicalName: 'Belapur',
    city: 'Mumbai',
    region: 'Navi Mumbai',
    aliases: ['cbd belapur', 'belapur cbd', 'बेलापूर'],
    devanagari: 'बेलापूर',
  },
  {
    canonicalName: 'Airoli',
    city: 'Mumbai',
    region: 'Navi Mumbai',
    aliases: ['airoli sector', 'ऐरोली'],
    devanagari: 'ऐरोली',
  },
  {
    canonicalName: 'Ghansoli',
    city: 'Mumbai',
    region: 'Navi Mumbai',
    aliases: ['ghansoli sector', 'घणसोली'],
    devanagari: 'घणसोली',
  },
  {
    canonicalName: 'Kopar Khairane',
    city: 'Mumbai',
    region: 'Navi Mumbai',
    aliases: ['koparkhairane', 'kopar khairne', 'कोपर खैरणे'],
    devanagari: 'कोपर खैरणे',
  },
  {
    canonicalName: 'Kharghar',
    city: 'Mumbai',
    region: 'Navi Mumbai',
    aliases: ['kharghar sector', 'खारघर'],
    devanagari: 'खारघर',
  },
  {
    canonicalName: 'Kamothe',
    city: 'Mumbai',
    region: 'Navi Mumbai',
    aliases: ['kamothe sector', 'कामोठे'],
    devanagari: 'कामोठे',
  },
  {
    canonicalName: 'Andheri',
    city: 'Mumbai',
    region: 'Western Suburbs',
    aliases: ['andheri west', 'andheri east', 'अंधेरी'],
    devanagari: 'अंधेरी',
  },
  {
    canonicalName: 'Borivali',
    city: 'Mumbai',
    region: 'Western Suburbs',
    aliases: ['borivali west', 'borivali east', 'बोरीवली', 'बोरिवली'],
    devanagari: 'बोरीवली',
  },
  {
    canonicalName: 'Kandivali',
    city: 'Mumbai',
    region: 'Western Suburbs',
    aliases: ['kandivli', 'kandivali west', 'kandivali east', 'कांदिवली'],
    devanagari: 'कांदिवली',
  },
  {
    canonicalName: 'Malad',
    city: 'Mumbai',
    region: 'Western Suburbs',
    aliases: ['malad west', 'malad east', 'मालाड'],
    devanagari: 'मालाड',
  },
  {
    canonicalName: 'Goregaon',
    city: 'Mumbai',
    region: 'Western Suburbs',
    aliases: ['goregaon west', 'goregaon east', 'गोरेगाव'],
    devanagari: 'गोरेगाव',
  },
  {
    canonicalName: 'Powai',
    city: 'Mumbai',
    region: 'Central Suburbs',
    aliases: ['hiranandani powai', 'पवई'],
    devanagari: 'पवई',
  },
  {
    canonicalName: 'Ghatkopar',
    city: 'Mumbai',
    region: 'Central Suburbs',
    aliases: ['ghatkopar east', 'ghatkopar west', 'घाटकोपर'],
    devanagari: 'घाटकोपर',
  },
  {
    canonicalName: 'Mulund',
    city: 'Mumbai',
    region: 'Central Suburbs',
    aliases: ['mulund west', 'mulund east', 'मुलुंड'],
    devanagari: 'मुलुंड',
  },
  {
    canonicalName: 'Bhandup',
    city: 'Mumbai',
    region: 'Central Suburbs',
    aliases: ['bhandup west', 'bhandup east', 'भांडुप'],
    devanagari: 'भांडुप',
  },
  {
    canonicalName: 'Chembur',
    city: 'Mumbai',
    region: 'Central Suburbs',
    aliases: ['chembur east', 'chembur west', 'चेंबूर'],
    devanagari: 'चेंबूर',
  },
  {
    canonicalName: 'Kurla',
    city: 'Mumbai',
    region: 'Central Suburbs',
    aliases: ['kurla west', 'kurla east', 'कुर्ला'],
    devanagari: 'कुर्ला',
  },
  {
    canonicalName: 'Dadar',
    city: 'Mumbai',
    region: 'South Central Mumbai',
    aliases: ['dadar west', 'dadar east', 'दादर'],
    devanagari: 'दादर',
  },
  {
    canonicalName: 'Bandra',
    city: 'Mumbai',
    region: 'Western Suburbs',
    aliases: ['bandra west', 'bandra east', 'bkc', 'वांद्रे', 'बांद्रा'],
    devanagari: 'बांद्रा',
  },
  {
    canonicalName: 'Santacruz',
    city: 'Mumbai',
    region: 'Western Suburbs',
    aliases: ['santa cruz', 'santacruz west', 'santacruz east', 'सांताक्रूझ'],
    devanagari: 'सांताक्रूझ',
  },
  {
    canonicalName: 'Lower Parel',
    city: 'Mumbai',
    region: 'South Central Mumbai',
    aliases: ['lower parel west', 'lower parel east', 'लोअर परळ'],
    devanagari: 'लोअर परळ',
  },
];

/**
 * 40 Mandatory Pune & Pimpri-Chinchwad Localities
 */
export const PUNE_LOCALITY_REGISTRY: LocalityDefinition[] = [
  {
    canonicalName: 'Pune City',
    city: 'Pune',
    region: 'Pune Central',
    aliases: ['pune', 'central pune', 'पुणे'],
    devanagari: 'पुणे',
  },
  {
    canonicalName: 'Pimpri-Chinchwad',
    city: 'Pune',
    region: 'Pimpri-Chinchwad',
    aliases: ['pimpri chinchwad', 'pcmc', 'पिंपरी-चिंचवड', 'पिंपरी चिंचवड'],
    devanagari: 'पिंपरी-चिंचवड',
  },
  {
    canonicalName: 'Pimpri',
    city: 'Pune',
    region: 'Pimpri-Chinchwad',
    aliases: ['pimpri colony', 'पिंपरी'],
    devanagari: 'पिंपरी',
  },
  {
    canonicalName: 'Chinchwad',
    city: 'Pune',
    region: 'Pimpri-Chinchwad',
    aliases: ['chinchwad gaon', 'chinchwad station', 'चिंचवड'],
    devanagari: 'चिंचवड',
  },
  {
    canonicalName: 'Bhosari',
    city: 'Pune',
    region: 'Pimpri-Chinchwad',
    aliases: ['bhosari midc', 'भोसरी'],
    devanagari: 'भोसरी',
  },
  {
    canonicalName: 'Chakan',
    city: 'Pune',
    region: 'North Pune',
    aliases: ['chakan midc', 'चाकण'],
    devanagari: 'चाकण',
  },
  {
    canonicalName: 'Katraj',
    city: 'Pune',
    region: 'South Pune',
    aliases: ['katraj ghat', 'कात्रज'],
    devanagari: 'कात्रज',
  },
  {
    canonicalName: 'Warje',
    city: 'Pune',
    region: 'West Pune',
    aliases: ['warje malwadi', 'वारजे'],
    devanagari: 'वारजे',
  },
  {
    canonicalName: 'Wakad',
    city: 'Pune',
    region: 'West Pune',
    aliases: ['wakad bridge', 'hinjewadi wakad', 'वाकड'],
    devanagari: 'वाकड',
  },
  {
    canonicalName: 'Baner',
    city: 'Pune',
    region: 'West Pune',
    aliases: ['baner road', 'baner pashan', 'बाणेर'],
    devanagari: 'बाणेर',
  },
  {
    canonicalName: 'Balewadi',
    city: 'Pune',
    region: 'West Pune',
    aliases: ['balewadi high street', 'balewadi stadium', 'बालेवाडी'],
    devanagari: 'बालेवाडी',
  },
  {
    canonicalName: 'Shivajinagar',
    city: 'Pune',
    region: 'Central Pune',
    aliases: ['shivaji nagar', 'शिवाजीनगर', 'शिवाजी नगर'],
    devanagari: 'शिवाजीनगर',
  },
  {
    canonicalName: 'Aundh',
    city: 'Pune',
    region: 'West Pune',
    aliases: ['aundh gaon', 'औंध'],
    devanagari: 'औंध',
  },
  {
    canonicalName: 'Pimple Saudagar',
    city: 'Pune',
    region: 'Pimpri-Chinchwad',
    aliases: ['pimpri saudagar', 'pimple saudagar gaon', 'पिंपळे सौदागर', 'पिंपरी सौदागर'],
    devanagari: 'पिंपळे सौदागर',
  },
  {
    canonicalName: 'Pimple Nilakh',
    city: 'Pune',
    region: 'Pimpri-Chinchwad',
    aliases: ['pimple nilakh gaon', 'पिंपळे निलख'],
    devanagari: 'पिंपळे निलख',
  },
  {
    canonicalName: 'Pimple Gurav',
    city: 'Pune',
    region: 'Pimpri-Chinchwad',
    aliases: ['pimple gurav gaon', 'पिंपळे गुरव'],
    devanagari: 'पिंपळे गुरव',
  },
  {
    canonicalName: 'Hinjewadi',
    city: 'Pune',
    region: 'West Pune',
    aliases: ['hinjawadi', 'hinjewadi phase 1', 'hinjewadi phase 2', 'hinjewadi it park', 'हिंजवडी'],
    devanagari: 'हिंजवडी',
  },
  {
    canonicalName: 'Bavdhan',
    city: 'Pune',
    region: 'West Pune',
    aliases: ['bavdhan khurd', 'bavdhan budruk', 'बावधन'],
    devanagari: 'बावधन',
  },
  {
    canonicalName: 'Kothrud',
    city: 'Pune',
    region: 'West Pune',
    aliases: ['kothrud depot', 'paud road', 'कोथरूड', 'कोथरूड डेपो'],
    devanagari: 'कोथरूड',
  },
  {
    canonicalName: 'Karve Nagar',
    city: 'Pune',
    region: 'West Pune',
    aliases: ['karvenagar', 'कार्वे नगर', 'कर्वे नगर'],
    devanagari: 'कर्वे नगर',
  },
  {
    canonicalName: 'Hadapsar',
    city: 'Pune',
    region: 'East Pune',
    aliases: ['hadapsar gaon', 'hadapsar bypass', 'हडपसर'],
    devanagari: 'हडपसर',
  },
  {
    canonicalName: 'Magarpatta',
    city: 'Pune',
    region: 'East Pune',
    aliases: ['magarpatta city', 'मगरपट्टा'],
    devanagari: 'मगरपट्टा',
  },
  {
    canonicalName: 'Kharadi',
    city: 'Pune',
    region: 'East Pune',
    aliases: ['kharadi it park', 'eon kharadi', 'खराडी'],
    devanagari: 'खराडी',
  },
  {
    canonicalName: 'Viman Nagar',
    city: 'Pune',
    region: 'East Pune',
    aliases: ['vimannagar', 'viman nagar central', 'विमान नगर'],
    devanagari: 'विमान नगर',
  },
  {
    canonicalName: 'Yerawada',
    city: 'Pune',
    region: 'East Pune',
    aliases: ['yerwada', 'येरवडा'],
    devanagari: 'येरवडा',
  },
  {
    canonicalName: 'Koregaon Park',
    city: 'Pune',
    region: 'East Pune',
    aliases: ['koregaonpark', 'kp', 'कोरेगाव पार्क'],
    devanagari: 'कोरेगाव पार्क',
  },
  {
    canonicalName: 'Camp',
    city: 'Pune',
    region: 'Central Pune',
    aliases: ['pune camp', 'cantonment', 'कॅम्प'],
    devanagari: 'कॅम्प',
  },
  {
    canonicalName: 'Kondhwa',
    city: 'Pune',
    region: 'South Pune',
    aliases: ['kondhwa budruk', 'kondhwa khurd', 'कोंढवा'],
    devanagari: 'कोंढवा',
  },
  {
    canonicalName: 'Bibwewadi',
    city: 'Pune',
    region: 'South Pune',
    aliases: ['bibvewadi', 'बिबवेवाडी', 'बिबवेवाडी'],
    devanagari: 'बिबवेवाडी',
  },
  {
    canonicalName: 'Dhankawadi',
    city: 'Pune',
    region: 'South Pune',
    aliases: ['dhankawadi gaon', 'धनकवडी'],
    devanagari: 'धनकवडी',
  },
  {
    canonicalName: 'Sinhagad Road',
    city: 'Pune',
    region: 'South Pune',
    aliases: ['sinhgad road', 'sinhgad', 'सिंहगड रोड', 'सिंहगड'],
    devanagari: 'सिंहगड रोड',
  },
  {
    canonicalName: 'Narhe',
    city: 'Pune',
    region: 'South Pune',
    aliases: ['narhe gaon', 'नऱ्हे'],
    devanagari: 'नऱ्हे',
  },
  {
    canonicalName: 'Ambegaon',
    city: 'Pune',
    region: 'South Pune',
    aliases: ['ambegaon budruk', 'ambegaon khurd', 'आंबेगाव'],
    devanagari: 'आंबेगाव',
  },
  {
    canonicalName: 'Wagholi',
    city: 'Pune',
    region: 'East Pune',
    aliases: ['wagholi gaon', 'वाघोली'],
    devanagari: 'वाघोली',
  },
  {
    canonicalName: 'Lohegaon',
    city: 'Pune',
    region: 'North Pune',
    aliases: ['lohegaon airport', 'लोहगाव'],
    devanagari: 'लोहगाव',
  },
  {
    canonicalName: 'Moshi',
    city: 'Pune',
    region: 'Pimpri-Chinchwad',
    aliases: ['moshi toll', 'मोशी'],
    devanagari: 'मोशी',
  },
  {
    canonicalName: 'Ravet',
    city: 'Pune',
    region: 'Pimpri-Chinchwad',
    aliases: ['ravet gaon', 'रावेत'],
    devanagari: 'रावेत',
  },
  {
    canonicalName: 'Tathawade',
    city: 'Pune',
    region: 'Pimpri-Chinchwad',
    aliases: ['tathawade gaon', 'ताथवडे'],
    devanagari: 'ताथवडे',
  },
  {
    canonicalName: 'Talegaon Dabhade',
    city: 'Pune',
    region: 'North-West Pune',
    aliases: ['talegaon', 'तळेगाव दाभाडे', 'तळेगाव'],
    devanagari: 'तळेगाव दाभाडे',
  },
  {
    canonicalName: 'Alandi',
    city: 'Pune',
    region: 'North Pune',
    aliases: ['alandi devachi', 'आळंदी'],
    devanagari: 'आळंदी',
  },
];

export const ALL_LOCALITIES = [...MUMBAI_LOCALITY_REGISTRY, ...PUNE_LOCALITY_REGISTRY];

export const SPECIFIC_LOCALITIES = ALL_LOCALITIES.filter(
  (l) => l.canonicalName !== 'Pune City' && l.canonicalName !== 'Mumbai City and Mumbai Suburbs'
);

export const CITY_LEVEL_LOCALITIES = ALL_LOCALITIES.filter(
  (l) => l.canonicalName === 'Pune City' || l.canonicalName === 'Mumbai City and Mumbai Suburbs'
);

export const CANONICAL_MUMBAI_LOCALITIES = MUMBAI_LOCALITY_REGISTRY.map((l) => l.canonicalName);
export const CANONICAL_PUNE_LOCALITIES = PUNE_LOCALITY_REGISTRY.map((l) => l.canonicalName);

/**
 * Resolves natural language input (English, Hindi, Marathi, spelling variation or alias)
 * to its authoritative canonical locality definition and city.
 * Always prioritizes specific localities (e.g. Baner, Wakad, Kalyan) over generic city-level names.
 */
export function resolveLocality(input: string): LocalityDefinition | null {
  if (!input) return null;
  const clean = input.trim().toLowerCase();

  // 1. Exact match on canonical name (case-insensitive)
  for (const loc of ALL_LOCALITIES) {
    if (loc.canonicalName.toLowerCase() === clean) {
      return loc;
    }
  }

  // 2. Exact match on Devanagari script name
  for (const loc of ALL_LOCALITIES) {
    if (loc.devanagari.toLowerCase() === clean) {
      return loc;
    }
  }

  // 3. Match on exact aliases
  for (const loc of ALL_LOCALITIES) {
    if (loc.aliases.some((alias) => alias.toLowerCase() === clean)) {
      return loc;
    }
  }

  // 4. Substring phrase match on SPECIFIC localities first (e.g. "Baner, Pune" -> Baner)
  // Sort longest names/aliases first to avoid prefix collisions (e.g. "Pimple Saudagar" before "Pimple")
  const sortedSpecific = [...SPECIFIC_LOCALITIES].sort(
    (a, b) => b.canonicalName.length - a.canonicalName.length
  );

  for (const loc of sortedSpecific) {
    const canonLower = loc.canonicalName.toLowerCase();
    const devLower = loc.devanagari.toLowerCase();

    // Check boundary or inclusion
    if (clean.includes(canonLower) || clean.includes(devLower)) {
      return loc;
    }

    for (const alias of loc.aliases) {
      if (clean.includes(alias.toLowerCase())) {
        return loc;
      }
    }
  }

  // 5. Only if no specific locality is mentioned, check generic city-level entities
  for (const loc of CITY_LEVEL_LOCALITIES) {
    const canonLower = loc.canonicalName.toLowerCase();
    if (clean.includes(canonLower)) {
      return loc;
    }
  }

  return null;
}
