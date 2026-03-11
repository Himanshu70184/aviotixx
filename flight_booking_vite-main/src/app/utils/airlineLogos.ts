// Airline Logo Utility - Maps airline names to their logo URLs

export interface AirlineInfo {
  name: string;
  code: string;
  logoUrl: string;
}

// Map of airline names/codes to their logo URLs (using reliable CDN sources)
const AIRLINE_LOGOS: Record<string, AirlineInfo> = {
  // Air India
  'AI': { name: 'Air India', code: 'AI', logoUrl: 'https://images.kiwi.com/airlines/64/AI.png' },
  'Air India': { name: 'Air India', code: 'AI', logoUrl: 'https://images.kiwi.com/airlines/64/AI.png' },
  
  // United Airlines
  'UA': { name: 'United Airlines', code: 'UA', logoUrl: 'https://images.kiwi.com/airlines/64/UA.png' },
  'United Airlines': { name: 'United Airlines', code: 'UA', logoUrl: 'https://images.kiwi.com/airlines/64/UA.png' },
  
  // Emirates
  'EK': { name: 'Emirates', code: 'EK', logoUrl: 'https://images.kiwi.com/airlines/64/EK.png' },
  'Emirates': { name: 'Emirates', code: 'EK', logoUrl: 'https://images.kiwi.com/airlines/64/EK.png' },
  
  // Qatar Airways
  'QR': { name: 'Qatar Airways', code: 'QR', logoUrl: 'https://images.kiwi.com/airlines/64/QR.png' },
  'Qatar Airways': { name: 'Qatar Airways', code: 'QR', logoUrl: 'https://images.kiwi.com/airlines/64/QR.png' },
  
  // Lufthansa
  'LH': { name: 'Lufthansa', code: 'LH', logoUrl: 'https://images.kiwi.com/airlines/64/LH.png' },
  'Lufthansa': { name: 'Lufthansa', code: 'LH', logoUrl: 'https://images.kiwi.com/airlines/64/LH.png' },
  
  // British Airways
  'BA': { name: 'British Airways', code: 'BA', logoUrl: 'https://images.kiwi.com/airlines/64/BA.png' },
  'British Airways': { name: 'British Airways', code: 'BA', logoUrl: 'https://images.kiwi.com/airlines/64/BA.png' },
  
  // American Airlines
  'AA': { name: 'American Airlines', code: 'AA', logoUrl: 'https://images.kiwi.com/airlines/64/AA.png' },
  'American Airlines': { name: 'American Airlines', code: 'AA', logoUrl: 'https://images.kiwi.com/airlines/64/AA.png' },
  
  // Delta Air Lines
  'DL': { name: 'Delta Air Lines', code: 'DL', logoUrl: 'https://images.kiwi.com/airlines/64/DL.png' },
  'Delta Air Lines': { name: 'Delta Air Lines', code: 'DL', logoUrl: 'https://images.kiwi.com/airlines/64/DL.png' },
  'Delta': { name: 'Delta Air Lines', code: 'DL', logoUrl: 'https://images.kiwi.com/airlines/64/DL.png' },
  
  // Turkish Airlines
  'TK': { name: 'Turkish Airlines', code: 'TK', logoUrl: 'https://images.kiwi.com/airlines/64/TK.png' },
  'Turkish Airlines': { name: 'Turkish Airlines', code: 'TK', logoUrl: 'https://images.kiwi.com/airlines/64/TK.png' },
  
  // Etihad Airways
  'EY': { name: 'Etihad Airways', code: 'EY', logoUrl: 'https://images.kiwi.com/airlines/64/EY.png' },
  'Etihad Airways': { name: 'Etihad Airways', code: 'EY', logoUrl: 'https://images.kiwi.com/airlines/64/EY.png' },
  
  // Singapore Airlines
  'SQ': { name: 'Singapore Airlines', code: 'SQ', logoUrl: 'https://images.kiwi.com/airlines/64/SQ.png' },
  'Singapore Airlines': { name: 'Singapore Airlines', code: 'SQ', logoUrl: 'https://images.kiwi.com/airlines/64/SQ.png' },
  
  // Air France
  'AF': { name: 'Air France', code: 'AF', logoUrl: 'https://images.kiwi.com/airlines/64/AF.png' },
  'Air France': { name: 'Air France', code: 'AF', logoUrl: 'https://images.kiwi.com/airlines/64/AF.png' },
  
  // KLM
  'KL': { name: 'KLM', code: 'KL', logoUrl: 'https://images.kiwi.com/airlines/64/KL.png' },
  'KLM Royal Dutch Airlines': { name: 'KLM', code: 'KL', logoUrl: 'https://images.kiwi.com/airlines/64/KL.png' },
  'KLM': { name: 'KLM', code: 'KL', logoUrl: 'https://images.kiwi.com/airlines/64/KL.png' },
  
  // Cathay Pacific
  'CX': { name: 'Cathay Pacific', code: 'CX', logoUrl: 'https://images.kiwi.com/airlines/64/CX.png' },
  'Cathay Pacific': { name: 'Cathay Pacific', code: 'CX', logoUrl: 'https://images.kiwi.com/airlines/64/CX.png' },
  
  // Vistara
  'UK': { name: 'Vistara', code: 'UK', logoUrl: 'https://images.kiwi.com/airlines/64/UK.png' },
  'Vistara': { name: 'Vistara', code: 'UK', logoUrl: 'https://images.kiwi.com/airlines/64/UK.png' },
  
  // IndiGo
  '6E': { name: 'IndiGo', code: '6E', logoUrl: 'https://images.kiwi.com/airlines/64/6E.png' },
  'IndiGo': { name: 'IndiGo', code: '6E', logoUrl: 'https://images.kiwi.com/airlines/64/6E.png' },
  
  // SpiceJet
  'SG': { name: 'SpiceJet', code: 'SG', logoUrl: 'https://images.kiwi.com/airlines/64/SG.png' },
  'SpiceJet': { name: 'SpiceJet', code: 'SG', logoUrl: 'https://images.kiwi.com/airlines/64/SG.png' },
  
  // GoAir
  'G8': { name: 'GoAir', code: 'G8', logoUrl: 'https://images.kiwi.com/airlines/64/G8.png' },
  'GoAir': { name: 'GoAir', code: 'G8', logoUrl: 'https://images.kiwi.com/airlines/64/G8.png' },
};

/**
 * Get airline logo URL and info by airline name or code
 */
export function getAirlineLogo(airlineNameOrCode: string): AirlineInfo {
  // Try direct lookup
  const airline = AIRLINE_LOGOS[airlineNameOrCode];
  if (airline) return airline;
  
  // Try case-insensitive lookup
  const lowerSearch = airlineNameOrCode.toLowerCase();
  const found = Object.values(AIRLINE_LOGOS).find(
    a => a.name.toLowerCase() === lowerSearch || a.code.toLowerCase() === lowerSearch
  );
  
  if (found) return found;
  
  // Extract airline code from flight number if present (e.g., "AI 123" -> "AI")
  const codeMatch = airlineNameOrCode.match(/^([A-Z0-9]{2})/);
  if (codeMatch) {
    const code = codeMatch[1];
    const byCode = AIRLINE_LOGOS[code];
    if (byCode) return byCode;
  }
  
  // Return default/fallback
  return {
    name: airlineNameOrCode,
    code: airlineNameOrCode.substring(0, 2).toUpperCase(),
    logoUrl: `https://via.placeholder.com/64/1E3A8A/FFFFFF?text=${airlineNameOrCode.substring(0, 2).toUpperCase()}`,
  };
}

/**
 * Preload airline logos for better performance
 */
export function preloadAirlineLogos(airlines: string[]) {
  airlines.forEach(airline => {
    const info = getAirlineLogo(airline);
    const img = new Image();
    img.src = info.logoUrl;
  });
}
