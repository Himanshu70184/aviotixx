// Dynamic Currency Conversion Utility
// Provides real-time INR to USD conversion rates

interface ExchangeRateResponse {
  success: boolean;
  rates: {
    USD: number;
  };
  base: string;
  date: string;
}

// Cache for exchange rates (valid for 1 hour)
let exchangeRateCache: {
  rate: number;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Get current INR to USD exchange rate
 * Uses free exchangerate-api.com with caching
 */
async function getINRtoUSDRate(): Promise<number> {
  // Check cache first
  if (exchangeRateCache && (Date.now() - exchangeRateCache.timestamp) < CACHE_DURATION) {
    return exchangeRateCache.rate;
  }

  try {
    // Fetch current rate from exchangerate-api (free tier)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
    const data: ExchangeRateResponse = await response.json();

    if (data.success && data.rates.USD) {
      const rate = data.rates.USD;
      
      // Cache the rate
      exchangeRateCache = {
        rate,
        timestamp: Date.now()
      };

      console.log(`💱 Updated INR to USD rate: ₹1 = $${rate.toFixed(4)}`);
      return rate;
    }
  } catch (error) {
    console.warn('⚠️ Failed to fetch live exchange rate, using fallback:', error);
  }

  // Fallback rate (updated as of March 2026)
  const fallbackRate = 1 / 83.5; // 1 INR = 0.012 USD (approximately)
  
  // Cache fallback rate for shorter period
  exchangeRateCache = {
    rate: fallbackRate,
    timestamp: Date.now() - (CACHE_DURATION - 5 * 60 * 1000) // Cache for only 5 more minutes
  };

  console.log(`💱 Using fallback INR to USD rate: ₹1 = $${fallbackRate.toFixed(4)}`);
  return fallbackRate;
}

/**
 * Convert INR amount to USD with live exchange rates
 */
export async function convertINRtoUSD(inrAmount: number): Promise<number> {
  const rate = await getINRtoUSDRate();
  const usdAmount = inrAmount * rate;
  return Math.round(usdAmount); // Round to nearest dollar
}

/**
 * Get cached exchange rate synchronously (for display purposes)
 * Falls back to approximate rate if no cache available
 */
export function getExchangeRateSync(): number {
  if (exchangeRateCache) {
    return exchangeRateCache.rate;
  }
  
  // Fallback rate
  return 1 / 83.5; // 1 INR = ~0.012 USD
}

/**
 * Format currency amount with proper symbol and styling
 */
export function formatCurrency(amount: number, currency: 'USD' | 'INR'): string {
  if (currency === 'USD') {
    return `$${amount.toLocaleString()}`;
  } else {
    return `₹${amount.toLocaleString()}`;
  }
}

/**
 * Preload exchange rate (call this when app starts)
 */
export async function preloadExchangeRate(): Promise<void> {
  try {
    await getINRtoUSDRate();
  } catch (error) {
    console.warn('Failed to preload exchange rate:', error);
  }
}