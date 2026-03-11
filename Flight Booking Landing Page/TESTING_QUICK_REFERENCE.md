# 🧪 Quick Testing Reference - Travelport API Integration

## ✅ Test the Integration NOW

### **Step 1: Fill the Search Form**

Use these common airport codes:

**USA Airports:**
- `JFK` - New York (John F. Kennedy)
- `EWR` - Newark
- `ORD` - Chicago O'Hare
- `LAX` - Los Angeles
- `SFO` - San Francisco
- `IAD` - Washington DC (Dulles)
- `DFW` - Dallas/Fort Worth
- `ATL` - Atlanta
- `BOS` - Boston

**India Airports:**
- `DEL` - New Delhi
- `BOM` - Mumbai
- `BLR` - Bangalore
- `MAA` - Chennai
- `HYD` - Hyderabad
- `CCU` - Kolkata
- `AMD` - Ahmedabad
- `GOI` - Goa

---

### **Step 2: Example Search**

Try this search:
- **From:** JFK
- **To:** DEL
- **Depart:** March 15, 2026
- **Return:** March 30, 2026
- **Passengers:** 1 Adult
- **Trip Type:** Round Trip

Click **Search** → Wait for results

---

### **Step 3: Check Browser Console**

Press **F12** to open Developer Tools, then:

1. **Console Tab** - Look for:
   ```
   Sending flight search request: {...}
   Flight search response: {...}
   ```

2. **Network Tab** - Find the request to:
   ```
   serviceapi-flightixtravels.easemytrip.com/Flight.svc/json/FlightSearch
   ```

3. **Response** - Click on the request to see:
   - Request payload (what we sent)
   - Response data (what we got back)

---

## 🔍 What to Check

### **✅ Success Indicators:**

1. **Request sent** with correct data:
   ```json
   {
     "Username": "FlightixTravels",
     "Origin": "JFK",
     "Destination": "DEL",
     "DepartureDate": "15-03-2026",
     ...
   }
   ```

2. **Response received** with flight data:
   ```json
   {
     "Status": true,
     "FlightResults": [...],
     ...
   }
   ```

3. **Flight cards displayed** below the search form

---

### **❌ Error Indicators:**

1. **CORS Error** (in console):
   ```
   Access to fetch blocked by CORS policy
   ```
   **Fix:** Need backend proxy or API CORS configuration

2. **401/403 Error:**
   ```
   Unauthorized or Forbidden
   ```
   **Fix:** Check API credentials in `/src/app/config/api.ts`

3. **No flights showing:**
   - Check if API returned empty results
   - Verify date format is correct
   - Try different airport codes

4. **"No Flights Found"** message:
   - API might not have results for that route/date
   - Try popular routes (JFK→DEL, SFO→BOM)
   - Check if dates are in the future

---

## 🛠️ Troubleshooting Steps

### **Issue: CORS Error**

**Problem:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Quick Test:** Use mock data temporarily

In `/src/app/services/travelportApi.ts`:
```typescript
export async function searchFlights(params: FlightSearchParams) {
  // Comment out the real API call
  // return await realAPICall(...);
  
  // Use mock data instead
  return getMockFlights(params);
}
```

This will show you how the UI looks with data, while you fix CORS.

**Long-term Fix:** Set up backend proxy

---

### **Issue: Wrong Field Names**

**Problem:** Flights show but data is incorrect (prices $0, airlines "Unknown")

**Diagnosis:**
1. Open console
2. Find: `Flight search response: {...}`
3. Expand the object to see actual field names

**Fix:** Update field mappings in `/src/app/services/travelportApi.ts`:

```typescript
// In parseFlightResponse function
const flights: FlightResult[] = flightResults.map((flight: any) => ({
  // Update these field names based on actual API response:
  airline: flight.AirlineName || flight.Carrier || flight.Airline,
  price: parseFloat(flight.TotalFare || flight.Price || flight.Cost || 0),
  // ... etc
}));
```

---

### **Issue: Date Format Error**

**Problem:** API returns error about invalid date

**Try different formats** in `/src/app/services/travelportApi.ts`:

```typescript
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  // Try these formats one at a time:
  return `${day}-${month}-${year}`;    // DD-MM-YYYY
  // return `${year}-${month}-${day}`;  // YYYY-MM-DD
  // return `${month}/${day}/${year}`;  // MM/DD/YYYY
}
```

---

## 📝 Common API Response Formats

### **Expected Response Structure:**

The API might return something like this:

```json
{
  "Status": true,
  "Message": "Success",
  "TraceId": "abc-123",
  "FlightResults": [
    {
      "ResultId": "result-1",
      "Airline": "Air India",
      "AirlineName": "Air India",
      "FlightNumber": "AI 191",
      "TotalFare": 899.00,
      "Currency": "USD",
      "OutBound": {
        "Origin": "JFK",
        "Destination": "DEL",
        "DepartureTime": "10:30",
        "ArrivalTime": "14:45",
        "Duration": "15h 15m",
        "Stops": 1
      },
      "InBound": {
        "Origin": "DEL",
        "Destination": "JFK",
        "DepartureTime": "02:20",
        "ArrivalTime": "08:50",
        "Duration": "16h 30m",
        "Stops": 0
      }
    }
  ]
}
```

**Action:** Once you see the actual response, update the `parseFlightResponse()` function to match.

---

## 🎯 Next Steps After Testing

### **1. API Works ✅**
- Update field mappings if needed
- Add more features (filters, sorting)
- Implement booking flow

### **2. CORS Issues 🚫**
- Set up backend proxy
- Or use Travelport's CORS-enabled endpoint (if available)
- Contact Travelport support for CORS configuration

### **3. Mock Data for Now 🎨**
- Use `getMockFlights()` temporarily
- Perfect the UI/UX
- Integrate real API when CORS is resolved

---

## 📞 Support Checklist

If you need help from Travelport, have this ready:

- [ ] API endpoint URL
- [ ] Your credentials (Username, PortalId)
- [ ] Example request body you're sending
- [ ] Error message or response you're getting
- [ ] Are you testing from localhost or production domain?
- [ ] Do they have CORS enabled for your domain?

---

## 🚀 Quick Commands

**See raw API response:**
```javascript
// Paste in browser console after search
console.log(window.lastAPIResponse);
```

**Test with specific data:**
```javascript
// Open console and run:
searchFlights({
  from: 'JFK',
  to: 'DEL',
  departDate: '2026-03-15',
  returnDate: '2026-03-30',
  passengers: '1',
  tripType: 'roundtrip',
  class: 'economy'
});
```

---

## 📊 Success Metrics

Your integration is working if you see:

✅ Search form submits without errors  
✅ Loading spinner appears  
✅ API request visible in Network tab  
✅ Response received (status 200)  
✅ Flight cards displayed  
✅ Prices, airlines, times showing correctly  
✅ Sort/filter buttons work  
✅ "Call to Book" buttons work  

---

**Happy Testing! 🎉**

Need help? Check the main guide: `/FLIGHT_API_INTEGRATION_GUIDE.md`
