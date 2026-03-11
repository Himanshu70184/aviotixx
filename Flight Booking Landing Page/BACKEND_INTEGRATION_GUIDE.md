# Flight Booking Frontend - Setup & Backend Integration Guide

## Overview
This is the new **Flight Booking Landing Page** frontend built with React, TypeScript, Vite, and Tailwind CSS. It's fully integrated with the Aviotixx backend that proxies flight searches to the EaseMyTrip API.

## ✅ Current Status
- ✅ All backend services integrated (backendApi.ts, cmsService.ts, travelportApi.ts)
- ✅ Production backend URL configured: `https://backendhostinger-production.up.railway.app/api`
- ✅ API configuration using environment variables
- ✅ Error handling implemented for flight searches
- ✅ Advanced marketing UI components (Discount wheel, Price reveal, Live booking feed)
- ✅ Flight search and results filtering

## 📋 Prerequisites
- **Node.js**: 16+ (recommended 18+)
- **npm** or **yarn** package manager
- **Backend running**: https://backendhostinger-production.up.railway.app/api (or local backend at http://localhost:4000/api)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd "Flight Booking Landing Page"
npm install
```

### 2. Configure Environment (Optional)
The frontend is configured to use the production backend by default. To use a different environment:

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# For Local Development (Backend running on localhost:4000)
VITE_API_BASE_URL=http://localhost:4000/api

# For Production (Default)
VITE_API_BASE_URL=https://backendhostinger-production.up.railway.app/api

# Environment
VITE_ENV=production
```

### 3. Run Development Server
```bash
npm run dev
```

The app will start at `http://localhost:5173` (Vite default)

### 4. Build for Production
```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/          # React components
│   │   ├── FlightSearchForm.tsx    # Main search interface
│   │   ├── FlightResults.tsx       # Results display with filters
│   │   ├── FlightFilters.tsx       # Advanced filtering
│   │   ├── CountdownDeal.tsx       # Limited-time offers
│   │   ├── PriceRevealCard.tsx     # Interactive price display
│   │   ├── DiscountWheel.tsx       # Gamified discounts
│   │   ├── LiveBookingFeed.tsx     # Real-time booking animation
│   │   └── ...other marketing components
│   ├── pages/
│   │   ├── SearchResultsPage.tsx   # Flight results page
│   │   └── ...other pages
│   ├── services/
│   │   ├── backendApi.ts           # Core backend integration
│   │   ├── travelportApi.ts        # Legacy API wrapper (uses backendApi)
│   │   ├── cmsService.ts           # Content management service
│   │   └── easemytripTransform.ts  # Response transformation
│   ├── hooks/
│   │   ├── useFlightOperations.ts  # Flight operations hook
│   │   └── useCMSContent.ts        # CMS content hook
│   ├── config/
│   │   └── api.ts                  # API configuration (env-based)
│   ├── utils/
│   │   └── airlineLogos.ts         # Airline logo utilities
│   ├── data/                       # Static data
│   ├── styles/                     # Tailwind CSS
│   ├── routes.tsx                  # React Router configuration
│   └── App.tsx                     # Root component
├── main.tsx                        # Entry point
└── imports/                        # Assets
```

## 🔌 Backend Integration

### API Configuration
The frontend communicates with the backend via:
- **Base URL**: Configured in `src/app/config/api.ts`
- **Environment Variable**: `VITE_API_BASE_URL`
- **Default**: `https://backendhostinger-production.up.railway.app/api`

### Available API Endpoints
All endpoints are proxied through the backend:

1. **Flight Search**
   - `POST /api/flights/search` - Search flights
   - `POST /api/flights/re-price` - Re-price a selected flight
   - `POST /api/flights/seat-map` - Get seat availability
   - `POST /api/flights/ssr` - Get special services

2. **Content Management (Public)**
   - `GET /api/public/content` - Get blogs, testimonials, FAQs, SEO settings

3. **Health Check**
   - `GET /api/health` - Backend health status
   - `GET /api/debug` - Debug information

### Services Layer
The frontend has three main service files:

1. **backendApi.ts** - Core integration
   - `searchFlights()` - Main flight search
   - `rePriceFlight()` - Re-pricing
   - `getSeatMap()` - Seat information
   - `getSSR()` - Special services

2. **cmsService.ts** - Content caching
   - `getCMSContent()` - Cached CMS content
   - 5-minute cache duration

3. **travelportApi.ts** - Legacy wrapper
   - `searchFlights()` - Wrapper around backendApi

### Error Handling
- ✅ Network error handling in SearchResultsPage
- ✅ User-friendly error messages
- ✅ Fallback to demo data if backend unavailable
- ✅ Error boundary components in FlightResults

## 🎨 UI Features

### Search Form (FlightSearchForm.tsx)
- ✨ Trip type selection (One-way, Round-trip, Multi-city)
- 👥 Passenger selection with age categories
- 📅 Date pickers with validation
- ✈️ Airport autocomplete
- 🎯 Cabin class selection

### Results Page (SearchResultsPage.tsx)
- 🔍 Advanced filtering (price, airline, stops, time)
- 📊 Sorting options (price, duration, recommended)
- 💰 Live price updates
- 📱 Responsive design
- 🎬 Marketing animations

### Premium Components
- **CountdownDeal** - Limited-time flight offers with timer
- **DiscountWheel** - Gamified discount offers
- **PriceRevealCard** - Interactive price reveal animation
- **LiveBookingFeed** - Real-time booking notifications
- **LivePriceDropAlert** - Price change alerts

## 🔧 Development

### Hot Module Replacement (HMR)
Enabled by default with Vite - changes reflect instantly in browser

### TypeScript
Full TypeScript support with strict mode

### Styling
- Tailwind CSS for utility-first styling
- PostCSS with Tailwind plugin
- Custom theme in `styles/theme.css`

### Component Patterns
- React hooks for state management
- Custom hooks for reusable logic
- React Router for navigation
- Radix UI for accessible components

## 📦 Dependencies
Key dependencies included:
- **React 18** - UI library
- **React Router** - Navigation
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - UI components
- **Lucide Icons** - Icon set
- **Vite** - Build tool

## 🐛 Troubleshooting

### Backend Not Responding
1. Check backend is running at configured URL
2. Verify `VITE_API_BASE_URL` in `.env`
3. Check browser console for CORS errors
4. Try using CORS proxy if needed

### Flights Not Loading
1. Check API response in Network tab
2. Verify search parameters in URL
3. Check FlightResults console for errors
4. Backend may be returning demo data (check `isMockData` flag)

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear Vite cache
rm -rf dist
npm run build
```

### Environment Variables Not Loading
- Ensure `.env` file is in project root
- Variables must start with `VITE_`
- Restart dev server after changing `.env`
- Check browser console to verify values loaded

## 📝 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 🚀 Deployment

### To Production
1. Build the project: `npm run build`
2. Output in `dist/` directory
3. Deploy `dist/` folder to any static hosting (Vercel, Netlify, Railway, etc.)

### Environment for Production
Ensure `VITE_API_BASE_URL` points to production backend:
```env
VITE_API_BASE_URL=https://backendhostinger-production.up.railway.app/api
```

## 📞 Support
For backend integration issues, check:
- Backend logs at https://backendhostinger-production.up.railway.app/api/debug
- Browser console for client-side errors
- Network tab for API responses

## 🔄 Migration from Old Frontend
The new frontend has all backend integration services from the old `flight_booking_vite-main/` but with:
- ✨ Enhanced marketing UI
- 🎨 Better visual components
- 📈 Improved animations
- 🎯 Same backend integration

## ✨ Next Steps
1. ✅ Set up environment variables
2. ✅ Test flight search locally
3. ✅ Verify all API endpoints working
4. 🔄 Customize marketing components
5. 🚀 Deploy to production
