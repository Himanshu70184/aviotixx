# EaseMyTrip API Integration Guide

## Overview
This document describes the complete API integration with EaseMyTrip's flight search service.

## API Credentials
- **API Endpoint**: `https://stagingapi.easemytrip.com/Flight.svc/rest/FlightSearch`
- **Username**: `EMTB2B`
- **Password**: `EMT@uytrFYTREt`
- **Portal ID**: `26`

## Configuration
API credentials are stored in `/src/app/config/api.ts`

```typescript
export const EASEMYTRIP_CONFIG = {
  flightSearchUrl: 'https://stagingapi.easemytrip.com/Flight.svc/rest/FlightSearch',
  authentication: {
    username: 'EMTB2B',
    password: 'EMT@uytrFYTREt',
    portalId: 26,
  },
};
```

## Request Format
The API expects a POST request with the following JSON structure:

```json
{
  "Adults": 2,
  "Authentication": {
    "UserName": "EMTB2B",
    "Password": "EMT@uytrFYTREt",
    "PortalID": 26
  },
  "Cabin": 0,
  "Childs": 1,
  "Infants": 1,
  "TripType": 0,
  "FlightSearchDetails": [
    {
      "BeginDate": "2025-05-07",
      "CurrencyCode": "INR",
      "Origin": "DEL",
      "Destination": "BOM"
    }
  ]
}
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| Adults | number | Number of adult passengers (12+ years) |
| Authentication | object | Contains username, password, and portal ID |
| Cabin | number | 0=Economy, 1=Premium Economy, 2=Business, 3=First |
| Childs | number | Number of children (2-11 years) |
| Infants | number | Number of infants (under 2 years) |
| TripType | number | 0=One Way, 1=Round Trip |
| FlightSearchDetails | array | Array of flight search details |

### FlightSearchDetails

For **One Way** trips:
```json
[
  {
    "BeginDate": "2025-05-07",
    "CurrencyCode": "INR",
    "Origin": "DEL",
    "Destination": "BOM"
  }
]
```

For **Round Trip**:
```json
[
  {
    "BeginDate": "2025-05-07",
    "CurrencyCode": "INR",
    "Origin": "DEL",
    "Destination": "BOM"
  },
  {
    "BeginDate": "2025-05-10",
    "CurrencyCode": "INR",
    "Origin": "BOM",
    "Destination": "DEL"
  }
]
```

## Response Handling

The API service (`/src/app/services/travelportApi.ts`) handles:

1. **Request Building** - Converts form data to API format
2. **API Calls** - Sends POST requests to EaseMyTrip
3. **Response Parsing** - Transforms API response to our internal format
4. **Error Handling** - Falls back to mock data on CORS/network errors

## CORS Considerations

⚠️ **Important**: Direct browser calls to the API may fail due to CORS restrictions.

### Solutions:
1. **Backend Proxy** (Recommended for Production)
   - Set up a Node.js/Express server
   - Proxy API requests through your backend
   - Add proper CORS headers

2. **Development Workaround**
   - The app automatically falls back to mock data
   - This allows UI testing without a backend

## Testing

### With Mock Data (Current Setup)
The application automatically uses mock data when:
- API calls fail due to CORS
- Network errors occur
- API is unavailable

### With Real API
To test with the real API:
1. Set up a backend proxy server
2. Update `EASEMYTRIP_CONFIG.flightSearchUrl` to point to your proxy
3. Ensure CORS headers are properly configured

## Example Usage

```typescript
import { searchFlights } from './services/travelportApi';

const searchParams = {
  from: 'JFK',
  to: 'DEL',
  departDate: '2025-05-07',
  returnDate: '2025-05-14',
  adults: '2',
  children: '1',
  infants: '0',
  tripType: 'roundtrip',
  class: 'economy',
};

const results = await searchFlights(searchParams);
```

## Documentation Reference
Full API documentation: https://stagingapi.easemytrip.com/documentation/FlightAPI/Index.htm

## Security Notes
⚠️ In production:
- Move credentials to environment variables
- Never expose API credentials in client-side code
- Use a secure backend proxy for all API calls
- Implement rate limiting and request validation
