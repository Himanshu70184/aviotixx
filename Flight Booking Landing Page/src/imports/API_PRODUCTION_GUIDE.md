# API Production Documentation

Complete API documentation for production environment with example requests and responses.

---

## 🔧 Base URL
```
https://backendhostinger-production.up.railway.app/api
```

---

## 📋 Table of Contents
1. [Health & Debug](#health--debug)
2. [Authentication](#authentication)
3. [Public Content](#public-content)
4. [Flight Search](#flight-search)
5. [Flight Inquiries](#flight-inquiries)
6. [Admin - Blogs](#admin---blogs)
7. [Admin - Testimonials](#admin---testimonials)
8. [Admin - FAQs](#admin---faqs)
9. [Admin - Settings](#admin---settings)
10. [File Upload](#file-upload)

---

## Health & Debug

### GET /health
**Description**: Check if server is running  
**Auth**: Not required  
**Response**: 200 OK

```bash
curl https://backendhostinger-production.up.railway.app/health
```

**Response Example:**
```json
{
  "success": true,
  "message": "CMS server is healthy"
}
```

---

### GET /api/debug
**Description**: View request headers and origin (useful for CORS debugging)  
**Auth**: Not required  
**Response**: 200 OK

```bash
curl https://backendhostinger-production.up.railway.app/api/debug
```

**Response Example:**
```json
{
  "success": true,
  "origin": "https://aviotixx.com",
  "headers": {
    "origin": "https://aviotixx.com",
    "referer": "https://aviotixx.com/",
    "host": "backendhostinger-production.up.railway.app",
    "user-agent": "Mozilla/5.0..."
  }
}
```

---

## Authentication

### POST /api/auth/login
**Description**: Admin login to get JWT token  
**Auth**: Not required  
**Response**: 200 OK | 401 Unauthorized | 400 Bad Request

**Request:**
```bash
curl -X POST https://backendhostinger-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@flightbooking.com",
    "password": "Admin@12345"
  }'
```

**Request Body:**
```json
{
  "email": "admin@flightbooking.com",
  "password": "Admin@12345"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2E4ZjMxMjM0NTY3ODkwYWJjZGVmMDEiLCJlbWFpbCI6ImFkbWluQGZsaWdodGJvb2tpbmcuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzA5MDE2MzAwLCJleHAiOjE3MDkwNTkyMDB9.xyz123",
    "user": {
      "id": "67a8f3123456789abc0def01",
      "email": "admin@flightbooking.com",
      "name": "Super Admin",
      "role": "admin"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### GET /api/auth/me
**Description**: Get current authenticated user info  
**Auth**: Required (Bearer Token)  
**Response**: 200 OK | 401 Unauthorized

**Request:**
```bash
curl https://backendhostinger-production.up.railway.app/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "67a8f3123456789abc0def01",
    "email": "admin@flightbooking.com",
    "name": "Super Admin",
    "role": "admin",
    "isActive": true
  }
}
```

---

## Public Content

### GET /api/public/content
**Description**: Get all public content (blogs, testimonials, FAQs, settings)  
**Auth**: Not required  
**Response**: 200 OK

**Request:**
```bash
curl https://backendhostinger-production.up.railway.app/api/public/content
```

**Response Example (200):**
```json
{
  "success": true,
  "data": {
    "blogs": [
      {
        "_id": "67a8f3123456789abc0def01",
        "title": "Best Time to Visit India",
        "excerpt": "Discover the ideal months to book your flight to India...",
        "image": "https://images.unsplash.com/...",
        "readTime": "5 min read",
        "slug": "best-time-to-visit-india",
        "order": 1,
        "isActive": true,
        "createdAt": "2024-02-28T10:00:00.000Z",
        "updatedAt": "2024-02-28T10:00:00.000Z"
      }
    ],
    "testimonials": [
      {
        "_id": "67a8f3123456789abc0def02",
        "name": "Priya Sharma",
        "location": "New York, NY",
        "review": "Saved $427 on family tickets!",
        "rating": 5,
        "customerPhoto": "https://...",
        "routeLabel": "NYC → Mumbai",
        "badge": "VERIFIED",
        "order": 1,
        "isActive": true
      }
    ],
    "faqs": [
      {
        "_id": "67a8f3123456789abc0def03",
        "question": "Why are phone prices cheaper?",
        "answer": "We have exclusive airline contracts...",
        "order": 1,
        "isActive": true
      }
    ],
    "seo": {
      "title": "Aviotixx - Cheap Flights to India",
      "description": "Book affordable flights to India...",
      "keywords": "flights to india, cheap flights..."
    },
    "contact": {
      "phoneDisplay": "1-800-123-4567",
      "phoneTel": "+18001234567",
      "email": "support@aviotixx.com",
      "address": "New York, USA"
    }
  }
}
```

---

## Flight Search

### POST /api/flights/search
**Description**: Search for flights via EaseMyTrip API  
**Auth**: Not required  
**Response**: 200 OK | 400 Bad Request | 500 Server Error

⚠️ **Important:** Production environment has EASEMYTRIP credentials pre-configured on the server.

**Request:**
```bash
curl -X POST https://backendhostinger-production.up.railway.app/api/flights/search \
  -H "Content-Type: application/json" \
  -d '{
    "tripType": 0,
    "adults": 1,
    "children": 0,
    "infants": 0,
    "cabin": 0,
    "searchDetails": [
      {
        "origin": "DEL",
        "destination": "BOM",
        "departDate": "2026-03-15"
      }
    ]
  }'
```

**Request Body:**
```json
{
  "tripType": 0,
  "adults": 1,
  "children": 0,
  "infants": 0,
  "cabin": 0,
  "searchDetails": [
    {
      "origin": "DEL",
      "destination": "BOM",
      "departDate": "2026-03-15"
    }
  ],
  "traceId": "optional-trace-id"
}
```

**Parameters:**
- `tripType`: 0 = OneWay, 1 = RoundTrip, 2 = MultiCity (required)
- `adults`: 1-9 (required)
- `children`: 0-9 (optional)
- `infants`: 0-2 (optional)
- `cabin`: 0 = Economy, 1 = First, 2 = Business, 4 = PremiumEconomy (required)
- `searchDetails`: Array of search segments (required)
  - `origin`: 3-letter IATA airport code in UPPERCASE (e.g., "DEL", "BOM", "BLR")
  - `destination`: 3-letter IATA airport code in UPPERCASE
  - `departDate`: YYYY-MM-DD format (must be future date)

**Common Airport Codes:**
| Code | City | Country |
|------|------|---------|
| DEL | New Delhi | India |
| BOM | Mumbai | India |
| BLR | Bangalore | India |
| CCU | Kolkata | India |
| MAA | Chennai | India |
| AMD | Ahmedabad | India |
| SFO | San Francisco | USA |
| LHR | London | UK |
| CDG | Paris | France |
| DXB | Dubai | UAE |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "Errors": [],
    "Journeys": [
      {
        "JourneyId": "1",
        "SegmentId": "1",
        "Destination": "BOM",
        "Origin": "DEL",
        "JourneyDetail": "DEL - BOM",
        "Segments": [
          {
            "AddonBundle": 0,
            "AircraftType": "A320",
            "Airline": "AI",
            "AirlineName": "Air India",
            "ArrivalTime": "2026-03-15T11:30:00",
            "DepartureTime": "2026-03-15T08:00:00",
            "Duration": 210,
            "FlightNumber": "AI123",
            "Origin": "DEL",
            "Destination": "BOM",
            "Seats": 45,
            "StopsCount": 0,
            "Price": 4500
          }
        ]
      }
    ],
    "Insurance": null,
    "RestTime": 0,
    "TraceId": "EMTB1772273858734"
  },
  "traceId": "EMTB1772273858734"
}
```

**Common Error Responses:**

| Code | Error | Solution |
|------|-------|----------|
| 803 | "Username is required" | Contact server administrator |
| 897 | "Search details required" | Ensure searchDetails array is provided |
| 805 | "Invalid date format" | Use YYYY-MM-DD format, ensure date is future |
| 802 | "Authentication Object not initialized" | Contact server administrator |

**Error Response (400):**
```json
{
  "success": false,
  "error": "API Error: Username is required"
}
```

---

### POST /api/flights/re-price
**Description**: Recheck pricing for selected flight  
**Auth**: Not required  
**Response**: 200 OK | 400 Bad Request

**Request:**
```bash
curl -X POST https://backendhostinger-production.up.railway.app/api/flights/re-price \
  -H "Content-Type: application/json" \
  -d '{
    "journeyId": "1",
    "segmentId": "1"
  }'
```

**Request Body:**
```json
{
  "journeyId": "1",
  "segmentId": "1"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "JourneyId": "1",
    "SegmentId": "1",
    "Price": 4500,
    "BaseFare": 4000,
    "Taxes": 500,
    "IsAvailable": true
  }
}
```

---

### POST /api/flights/seat-map
**Description**: Get seat map for a flight segment  
**Auth**: Not required  
**Response**: 200 OK | 400 Bad Request

**Request:**
```bash
curl -X POST https://backendhostinger-production.up.railway.app/api/flights/seat-map \
  -H "Content-Type: application/json" \
  -d '{
    "journeyId": "J001",
    "segmentId": "S001"
  }'
```

**Request Body:**
```json
{
  "journeyId": "J001",
  "segmentId": "S001"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "SeatMap": [
      {
        "Row": 1,
        "Seats": [
          {"SeatNumber": "1A", "Status": "Available"},
          {"SeatNumber": "1B", "Status": "Occupied"},
          {"SeatNumber": "1C", "Status": "Available"}
        ]
      }
    ]
  }
}
```

---

### POST /api/flights/ssr
**Description**: Get special service requests availability  
**Auth**: Not required  
**Response**: 200 OK | 400 Bad Request

**Request:**
```bash
curl -X POST https://backendhostinger-production.up.railway.app/api/flights/ssr \
  -H "Content-Type: application/json" \
  -d '{
    "journeyId": "J001",
    "segmentId": "S001"
  }'
```

**Request Body:**
```json
{
  "journeyId": "J001",
  "segmentId": "S001"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "Services": [
      {
        "ServiceCode": "MEAL",
        "ServiceName": "Meal Selection",
        "Price": 500,
        "Available": true
      },
      {
        "ServiceCode": "SEAT",
        "ServiceName": "Seat Selection",
        "Price": 300,
        "Available": true
      }
    ]
  }
}
```

---

## Flight Inquiries

### POST /api/inquiries
**Description**: Create a new flight inquiry  
**Auth**: Not required  
**Response**: 201 Created | 400 Bad Request

**Request:**
```bash
curl -X POST https://backendhostinger-production.up.railway.app/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "tripType": 0,
    "origin": "DEL",
    "destination": "BOM",
    "departDate": "2024-03-15",
    "returnDate": null,
    "adults": 2,
    "children": 1,
    "infants": 0,
    "cabin": 0,
    "passengerName": "John Doe",
    "passengerEmail": "john@example.com",
    "passengerPhone": "+91-9876543210",
    "journeyId": "J001",
    "segmentId": "S001",
    "selectedFlight": {
      "airlineName": "Air India",
      "flightNumber": "AI123",
      "departureTime": "2024-03-15T08:00:00Z",
      "arrivalTime": "2024-03-15T11:30:00Z",
      "price": 4500
    },
    "traceId": "xyz123"
  }'
```

**Request Body:**
```json
{
  "tripType": 0,
  "origin": "DEL",
  "destination": "BOM",
  "departDate": "2024-03-15",
  "returnDate": null,
  "adults": 2,
  "children": 1,
  "infants": 0,
  "cabin": 0,
  "passengerName": "John Doe",
  "passengerEmail": "john@example.com",
  "passengerPhone": "+91-9876543210",
  "journeyId": "J001",
  "segmentId": "S001",
  "selectedFlight": {
    "airlineName": "Air India",
    "flightNumber": "AI123",
    "departureTime": "2024-03-15T08:00:00Z",
    "arrivalTime": "2024-03-15T11:30:00Z",
    "price": 4500
  },
  "traceId": "xyz123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Flight inquiry created successfully",
  "data": {
    "_id": "67a8f3123456789abc0def04",
    "tripType": 0,
    "origin": "DEL",
    "destination": "BOM",
    "departDate": "2024-03-15T00:00:00.000Z",
    "adults": 2,
    "children": 1,
    "infants": 0,
    "cabin": 0,
    "passengerName": "John Doe",
    "passengerEmail": "john@example.com",
    "passengerPhone": "+91-9876543210",
    "status": "pending",
    "createdAt": "2024-02-28T10:30:00.000Z",
    "updatedAt": "2024-02-28T10:30:00.000Z"
  }
}
```

---

### GET /api/inquiries/:id
**Description**: Get specific flight inquiry  
**Auth**: Not required  
**Response**: 200 OK | 404 Not Found

**Request:**
```bash
curl https://backendhostinger-production.up.railway.app/api/inquiries/67a8f3123456789abc0def04
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "67a8f3123456789abc0def04",
    "tripType": 0,
    "origin": "DEL",
    "destination": "BOM",
    "departDate": "2024-03-15T00:00:00.000Z",
    "adults": 2,
    "children": 1,
    "infants": 0,
    "passengerName": "John Doe",
    "passengerEmail": "john@example.com",
    "status": "pending",
    "createdAt": "2024-02-28T10:30:00.000Z"
  }
}
```

---

### GET /api/inquiries
**Description**: Get all flight inquiries (Admin only)  
**Auth**: Required (Bearer Token)  
**Response**: 200 OK | 401 Unauthorized

**Request:**
```bash
curl https://backendhostinger-production.up.railway.app/api/inquiries \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Query Parameters (Optional):**
- `status`: pending | approved | rejected | booked
- `brokerAssigned`: User ID
- `sortBy`: Field to sort by (e.g., -createdAt)
- `limit`: Results per page (default: 50)
- `page`: Page number (default: 1)

**Example with filters:**
```bash
curl "https://backendhostinger-production.up.railway.app/api/inquiries?status=pending&limit=10&page=1" \
  -H "Authorization: Bearer ..."
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "67a8f3123456789abc0def04",
      "origin": "DEL",
      "destination": "BOM",
      "passengerName": "John Doe",
      "passengerEmail": "john@example.com",
      "status": "pending",
      "createdAt": "2024-02-28T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

---

### PUT /api/inquiries/:id
**Description**: Update inquiry status (Admin only)  
**Auth**: Required (Bearer Token)  
**Response**: 200 OK | 404 Not Found

**Request:**
```bash
curl -X PUT https://backendhostinger-production.up.railway.app/api/inquiries/67a8f3123456789abc0def04 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "status": "approved",
    "brokerNotes": "Confirmed with airline. Ready to book.",
    "brokerAssigned": "67a8f3123456789abc0def01"
  }'
```

**Request Body:**
```json
{
  "status": "approved",
  "brokerNotes": "Confirmed with airline",
  "brokerAssigned": "67a8f3123456789abc0def01"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Inquiry updated successfully",
  "data": {
    "_id": "67a8f3123456789abc0def04",
    "status": "approved",
    "brokerNotes": "Confirmed with airline",
    "brokerAssigned": {
      "_id": "67a8f3123456789abc0def01",
      "name": "Super Admin",
      "email": "admin@flightbooking.com"
    }
  }
}
```

---

### DELETE /api/inquiries/:id
**Description**: Soft delete inquiry (Admin only)  
**Auth**: Required (Bearer Token)  
**Response**: 200 OK | 404 Not Found

**Request:**
```bash
curl -X DELETE https://backendhostinger-production.up.railway.app/api/inquiries/67a8f3123456789abc0def04 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Inquiry deleted successfully"
}
```

---

## Admin - Blogs

### GET /api/admin/blogs
**Description**: Get all blogs  
**Auth**: Required (Bearer Token)  
**Response**: 200 OK

**Request:**
```bash
curl https://backendhostinger-production.up.railway.app/api/admin/blogs \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "67a8f3123456789abc0def05",
      "title": "Best Time to Visit India",
      "excerpt": "Discover the ideal months to book your flight...",
      "image": "https://...",
      "readTime": "5 min read",
      "slug": "best-time-to-visit-india",
      "order": 1,
      "isActive": true,
      "createdAt": "2024-02-28T10:00:00.000Z"
    }
  ]
}
```

---

### POST /api/admin/blogs
**Description**: Create a new blog  
**Auth**: Required (Bearer Token)  
**Response**: 201 Created

**Request:**
```bash
curl -X POST https://backendhostinger-production.up.railway.app/api/admin/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "New Travel Tips for India",
    "excerpt": "Essential tips for traveling to India",
    "image": "https://example.com/image.jpg",
    "readTime": "7 min read",
    "slug": "travel-tips-india",
    "order": 4,
    "isActive": true
  }'
```

**Request Body:**
```json
{
  "title": "New Travel Tips for India",
  "excerpt": "Essential tips for traveling to India",
  "image": "https://example.com/image.jpg",
  "readTime": "7 min read",
  "slug": "travel-tips-india",
  "order": 4,
  "isActive": true
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "67a8f3123456789abc0def06",
    "title": "New Travel Tips for India",
    "excerpt": "Essential tips for traveling to India",
    "image": "https://example.com/image.jpg",
    "readTime": "7 min read",
    "slug": "travel-tips-india",
    "order": 4,
    "isActive": true,
    "createdAt": "2024-02-28T10:45:00.000Z"
  }
}
```

---

### PUT /api/admin/blogs/:id
**Description**: Update blog  
**Auth**: Required (Bearer Token)  
**Response**: 200 OK

**Request:**
```bash
curl -X PUT https://backendhostinger-production.up.railway.app/api/admin/blogs/67a8f3123456789abc0def06 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Updated Travel Tips",
    "excerpt": "Updated content here",
    "isActive": false
  }'
```

**Request Body:**
```json
{
  "title": "Updated Travel Tips",
  "excerpt": "Updated content here",
  "isActive": false
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "67a8f3123456789abc0def06",
    "title": "Updated Travel Tips",
    "excerpt": "Updated content here",
    "isActive": false,
    "updatedAt": "2024-02-28T11:00:00.000Z"
  }
}
```

---

### DELETE /api/admin/blogs/:id
**Description**: Delete blog  
**Auth**: Required (Bearer Token)  
**Response**: 200 OK

**Request:**
```bash
curl -X DELETE https://backendhostinger-production.up.railway.app/api/admin/blogs/67a8f3123456789abc0def06 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Deleted successfully"
}
```

---

## Admin - Testimonials

### GET /api/admin/testimonials
**Description**: Get all testimonials  
**Auth**: Required (Bearer Token)  
**Response**: 200 OK

**Request:**
```bash
curl https://backendhostinger-production.up.railway.app/api/admin/testimonials \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "67a8f3123456789abc0def07",
      "name": "Priya Sharma",
      "location": "New York, NY",
      "review": "Saved $427 on family tickets!",
      "rating": 5,
      "customerPhoto": "https://...",
      "routeLabel": "NYC → Mumbai",
      "badge": "VERIFIED",
      "order": 1,
      "isActive": true
    }
  ]
}
```

---

### POST /api/admin/testimonials
**Description**: Create testimonial  
**Auth**: Required (Bearer Token)  
**Response**: 201 Created

**Request:**
```bash
curl -X POST https://backendhostinger-production.up.railway.app/api/admin/testimonials \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Sarah Johnson",
    "location": "Chicago, IL",
    "review": "Best prices I found anywhere!",
    "rating": 5,
    "customerPhoto": "https://example.com/photo.jpg",
    "routeLabel": "ORD → Delhi",
    "badge": "VERIFIED",
    "order": 4,
    "isActive": true
  }'
```

**Request Body:**
```json
{
  "name": "Sarah Johnson",
  "location": "Chicago, IL",
  "review": "Best prices I found anywhere!",
  "rating": 5,
  "customerPhoto": "https://example.com/photo.jpg",
  "routeLabel": "ORD → Delhi",
  "badge": "VERIFIED",
  "order": 4,
  "isActive": true
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "67a8f3123456789abc0def08",
    "name": "Sarah Johnson",
    "location": "Chicago, IL",
    "review": "Best prices I found anywhere!",
    "rating": 5,
    "createdAt": "2024-02-28T10:50:00.000Z"
  }
}
```

---

### PUT /api/admin/testimonials/:id
**Description**: Update testimonial  
**Auth**: Required (Bearer Token)  

**Request:**
```bash
curl -X PUT https://backendhostinger-production.up.railway.app/api/admin/testimonials/67a8f3123456789abc0def08 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ..." \
  -d '{"rating": 4, "review": "Great service"}'
```

---

### DELETE /api/admin/testimonials/:id
**Description**: Delete testimonial  
**Auth**: Required (Bearer Token)  

**Request:**
```bash
curl -X DELETE https://backendhostinger-production.up.railway.app/api/admin/testimonials/67a8f3123456789abc0def08 \
  -H "Authorization: Bearer ..."
```

---

## Admin - FAQs

### GET /api/admin/faqs
**Description**: Get all FAQs  
**Auth**: Required (Bearer Token)  

**Request:**
```bash
curl https://backendhostinger-production.up.railway.app/api/admin/faqs \
  -H "Authorization: Bearer ..."
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "67a8f3123456789abc0def09",
      "question": "Why are phone prices cheaper?",
      "answer": "We have exclusive airline contracts...",
      "order": 1,
      "isActive": true
    }
  ]
}
```

---

### POST /api/admin/faqs
**Description**: Create FAQ  
**Auth**: Required (Bearer Token)  

**Request:**
```bash
curl -X POST https://backendhostinger-production.up.railway.app/api/admin/faqs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ..." \
  -d '{
    "question": "How do I cancel my booking?",
    "answer": "You can cancel within 24 hours...",
    "order": 5,
    "isActive": true
  }'
```

---

### PUT /api/admin/faqs/:id
**Description**: Update FAQ  

---

### DELETE /api/admin/faqs/:id
**Description**: Delete FAQ  

---

## Admin - Settings

### GET /api/admin/settings
**Description**: Get site settings  
**Auth**: Required (Bearer Token)  

**Request:**
```bash
curl https://backendhostinger-production.up.railway.app/api/admin/settings \
  -H "Authorization: Bearer ..."
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "67a8f3123456789abc0def0a",
    "singletonKey": "main",
    "seo": {
      "title": "Aviotixx - Cheap Flights to India",
      "description": "Book affordable flights to India...",
      "keywords": "flights to india, cheap flights..."
    },
    "contact": {
      "phoneDisplay": "1-800-123-4567",
      "phoneTel": "+18001234567",
      "email": "support@aviotixx.com",
      "address": "New York, USA"
    }
  }
}
```

---

### PUT /api/admin/settings
**Description**: Update site settings  
**Auth**: Required (Bearer Token)  

**Request:**
```bash
curl -X PUT https://backendhostinger-production.up.railway.app/api/admin/settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ..." \
  -d '{
    "seo": {
      "title": "Updated Title",
      "description": "Updated description",
      "keywords": "updated, keywords"
    },
    "contact": {
      "phoneDisplay": "1-866-FLY-CHEAP",
      "phoneTel": "+18666359243",
      "email": "support@newsite.com",
      "address": "Los Angeles, USA"
    }
  }'
```

**Request Body:**
```json
{
  "seo": {
    "title": "Updated Title",
    "description": "Updated description",
    "keywords": "updated, keywords"
  },
  "contact": {
    "phoneDisplay": "1-866-FLY-CHEAP",
    "phoneTel": "+18666359243",
    "email": "support@newsite.com",
    "address": "Los Angeles, USA"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "67a8f3123456789abc0def0a",
    "singletonKey": "main",
    "seo": {
      "title": "Updated Title",
      "description": "Updated description"
    },
    "contact": {
      "phoneDisplay": "1-866-FLY-CHEAP",
      "email": "support@newsite.com"
    },
    "updatedAt": "2024-02-28T11:20:00.000Z"
  }
}
```

---

## File Upload

### POST /api/upload
**Description**: Upload image file  
**Auth**: Not required  
**Response**: 200 OK

**Request** (using form data):
```bash
curl -X POST https://backendhostinger-production.up.railway.app/api/upload \
  -F "image=@/path/to/image.jpg"
```

**Postman Setup:**
1. Set method to `POST`
2. URL: `https://backendhostinger-production.up.railway.app/api/upload`
3. Go to "Body" tab
4. Select "form-data"
5. Add key: `image`, value: Select file

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "imageUrl": "/uploads/1709091600000-123456789.webp"
  }
}
```

**Supported Formats:** JPEG, JPG, PNG, GIF, WEBP (Max 5MB)

---

## 🚀 Production Testing Workflow

### 1. **Test Health Endpoint**

```bash
curl https://backendhostinger-production.up.railway.app/health
```

Response:
```json
{ "success": true, "message": "CMS server is healthy" }
```

### 2. **Test Admin Login**

```bash
curl -X POST https://backendhostinger-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@flightbooking.com",
    "password": "Admin@12345"
  }'
```

Save the returned `token` for protected API calls.

### 3. **Test Flight Search**

Using cURL:
```bash
curl -X POST https://backendhostinger-production.up.railway.app/api/flights/search \
  -H "Content-Type: application/json" \
  -d '{
    "tripType": 0,
    "adults": 1,
    "children": 0,
    "infants": 0,
    "cabin": 0,
    "searchDetails": [{
      "origin": "DEL",
      "destination": "BOM",
      "departDate": "2026-03-15"
    }]
  }'
```

Or in **Postman**:
1. Create new POST request
2. URL: `https://backendhostinger-production.up.railway.app/api/flights/search`
3. Headers:
   - `Content-Type: application/json`
4. Body (JSON):
```json
{
  "tripType": 0,
  "adults": 1,
  "children": 0,
  "infants": 0,
  "cabin": 0,
  "searchDetails": [{
    "origin": "DEL",
    "destination": "BOM",
    "departDate": "2026-03-15"
  }]
}
```

### 4. **Get Public Content**

```bash
curl https://backendhostinger-production.up.railway.app/api/public/content
```

---

## 📊 Environment Variables (Production)

| Variable | Purpose | Status |
|----------|---------|--------|
| PORT | Server port | Pre-configured on Railway |
| NODE_ENV | production | Pre-configured |
| MONGODB_URI | MongoDB Atlas connection | Pre-configured |
| JWT_SECRET | JWT token signing | Pre-configured |
| EASEMYTRIP_API_URL | EaseMyTrip API endpoint | Pre-configured |
| EASEMYTRIP_USERNAME | EaseMyTrip B2B username | Pre-configured |
| EASEMYTRIP_PASSWORD | EaseMyTrip B2B password | Pre-configured |
| EASEMYTRIP_IP | Server IP (for whitelisting) | Pre-configured |

---

## 🔐 Authentication Header Format

For all protected endpoints, include:
```
Authorization: Bearer <JWT_TOKEN>
```

Example:
```bash
curl https://backendhostinger-production.up.railway.app/api/admin/blogs \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2E4ZjMxMjM0NTY3ODkwYWJjZGVmMDEiLCJlbWFpbCI6ImFkbWluQGZsaWdodGJvb2tpbmcuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzA5MDE2MzAwLCJleHAiOjE3MDkwNTkyMDB9.xyz123"
```

---

## 📊 Common Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid JWT token |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

## 🧪 Testing with Postman

### Environment Variables in Postman:
```json
{
  "base_url": "https://backendhostinger-production.up.railway.app/api",
  "admin_token": "your-jwt-token-here",
  "email": "admin@flightbooking.com",
  "password": "Admin@12345"
}
```

Use `{{base_url}}` and `{{admin_token}}` in requests

---

## 🚀 Test Flow Example

1. **Health Check**: `GET /health` (no /api prefix)
2. **Login**: `POST /api/auth/login` → Save token
3. **Get Public Content**: `GET /api/public/content`
4. **Search Flights**: `POST /api/flights/search`
5. **Create Inquiry**: `POST /api/inquiries`
6. **Get Inquiries** (Admin): `GET /api/inquiries` (use token)
7. **Create Blog** (Admin): `POST /api/admin/blogs` (use token)
8. **Upload Image**: `POST /api/upload`

---

## 📝 Important Notes

- Base URL: `https://backendhostinger-production.up.railway.app/api`
- All dates should be in **ISO 8601 format** (YYYY-MM-DD or ISO 8601 timestamp)
- Airport codes are **3-letter IATA codes** (DEL, BOM, BLR, etc.)
- JWT tokens expire after **12 hours**
- HTTPS is required for all production requests (no HTTP)
- All requests except login require valid JWT for admin endpoints
- Contact server administrator for any connection issues

---

## 🔒 Security Best Practices

1. **Never expose JWT tokens** in client-side code
2. **Always use HTTPS** for production requests
3. **Validate all inputs** before sending to API
4. **Keep admin credentials secure** (change default password in production)
5. **Monitor API logs** for suspicious activity
6. **Implement rate limiting** in frontend to prevent abuse
7. **Use environment variables** for sensitive configuration

---

**Last Updated**: March 3, 2026  
**API Version**: 1.0.0  
**Environment**: Production  
**Server**: Hostinger Railway
