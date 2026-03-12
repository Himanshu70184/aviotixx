# 🛫 Airport API Setup Guide

Your flight booking app now uses **real-time airport data** from worldwide APIs instead of hardcoded lists!

## 🌟 Free API Options

### Option 1: AviationStack (Recommended)

**Features:**
- ✅ 1,000 free requests/month
- ✅ 30,000+ airports worldwide  
- ✅ Real-time data
- ✅ Easy setup

**Setup Steps:**
1. Visit [aviationstack.com](https://aviationstack.com)
2. Sign up for free account
3. Get your API key from dashboard
4. Update `src/app/data/airports.ts`:

```typescript
const AIRPORT_API_CONFIG = {
  aviationstack: {
    baseUrl: 'http://api.aviationstack.com/v1/airports',
    apiKey: 'YOUR_API_KEY_HERE', // Replace with actual key
    params: (query: string) => `?access_key=${AIRPORT_API_CONFIG.aviationstack.apiKey}&search=${query}&limit=10`
  }
}
```

### Option 2: RapidAPI Airport Services

**Multiple free services available:**

1. **Airport Info API** (RapidAPI)
   - Visit [rapidapi.com](https://rapidapi.com)
   - Search for "Airport Info" or "Airport Data"
   - Subscribe to free tier
   - Get API key

2. **OpenSky Network** (100% Free)
   - Visit [opensky-network.org](https://opensky-network.org)
   - No registration required for basic usage
   - Flight tracking + airport data

### Option 3: Alternative Free APIs

1. **Travel Payouts** - Free airport database
2. **IATA Codes API** - Airport codes and info
3. **Airport-Data.com** - Simple REST API

## 🚀 Current Implementation

### What's Working Now:

1. **Live Airport Search** - Type any city/airport name globally
2. **Smart Caching** - Results cached for 30 minutes
3. **Fallback System** - Works offline with popular airports
4. **Global Coverage** - All continents and countries
5. **Fast Performance** - Debounced search with loading states

### API Request Flow:

```
User types "london" 
    ↓
Primary API (AviationStack) 
    ↓ (if fails)
Fallback API (RapidAPI)
    ↓ (if fails)  
Local Popular Airports
```

## 🔧 Configuration

### Environment Variables (Optional)

Create `.env` file in project root:

```
VITE_AVIATION_STACK_KEY=your_aviationstack_key
VITE_RAPIDAPI_KEY=your_rapidapi_key
```

Then update `airports.ts`:

```typescript
const AIRPORT_API_CONFIG = {
  aviationstack: {
    apiKey: import.meta.env.VITE_AVIATION_STACK_KEY || 'your-free-api-key',
    // ...
  }
}
```

## 🎯 Benefits vs Hardcoded Lists

| Feature | Hardcoded | API-Based ✅ |
|---------|-----------|--------------|
| Airport Count | ~150 | 30,000+ |
| Data Freshness | Static | Real-time |
| Global Coverage | Limited | Complete |
| Maintenance | Manual updates | Auto-updated |
| Search Quality | Basic | Intelligent |
| User Experience | Limited | Professional |

## 🛠️ Advanced Customization

### Add More API Sources

```typescript
// In airports.ts, add new API source:
async function searchNewAPI(query: string): Promise<any[]> {
  const response = await fetch(`https://your-api.com/search?q=${query}`);
  const data = await response.json();
  return data.airports.map(airport => ({
    code: airport.code,
    city: airport.city,
    name: airport.name,
    country: airport.country
  }));
}

// Then add to search flow:
if (airports.length === 0) {
  airports = await searchNewAPI(query);
}
```

### Custom Regions

```typescript
export function getRegionalAirports(region: string) {
  // Add your custom regional logic
  if (region === 'EUROPE') {
    // Return European airports
  }
}
```

## 📊 API Usage Monitoring

Add usage tracking:

```typescript
let apiCallCount = 0;
const MAX_DAILY_CALLS = 900; // Leave buffer for 1000 limit

async function searchWithLimit(query: string) {
  if (apiCallCount >= MAX_DAILY_CALLS) {
    console.warn('API limit reached, using cache');
    return getCachedResults(query);
  }
  
  apiCallCount++;
  return await searchAviationStack(query);
}
```

## 🚨 Troubleshooting

### API Not Working?

1. **Check API Key**: Ensure key is correctly set
2. **Check Limits**: Verify you haven't exceeded free tier
3. **Network Issues**: Check browser console for errors
4. **CORS Issues**: API should handle cross-origin requests

### Common Issues:

```bash
# CORS Error
Edit vite.config.ts to add proxy:
server: {
  proxy: {
    '/api': 'https://api.aviationstack.com'
  }
}

# Rate Limit
Implement better caching or upgrade API plan

# Network Error  
Fallback to local airports automatically
```

## 🎉 Next Steps

1. **Get API key** from AviationStack (5 minutes)
2. **Update airports.ts** with your key
3. **Test search** - try typing any city name
4. **Monitor usage** in API dashboard
5. **Enjoy global airport coverage!**

---

**Your users can now search ANY airport worldwide! ✈️🌍**