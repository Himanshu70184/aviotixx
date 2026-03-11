# Flight Search Debugging Guide

## ✅ Enhanced Debugging Now Active!

I've added comprehensive debugging to help identify exactly what's going wrong with your flight search API calls.

## 🔍 Where to Look for Debug Information

### 1. **Browser Console (Most Important)**
**How to Open:**
- **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- **Firefox**: Press `F12` or `Ctrl+Shift+K`
- **Safari**: Press `Cmd+Option+C`

**What You'll See:**
The console will show detailed logs with emojis for easy scanning:

```
🔍 [DEBUG] Starting flight search...
📍 [DEBUG] API URL: https://backendhostinger-production.up.railway.app/api/flights/search
📦 [DEBUG] Request payload: { ... }
🔍 Searching flights via backend API...
🌐 [DEBUG] Initiating fetch request...
⏱️ [DEBUG] Fetch completed in 1234ms
📡 [DEBUG] Response status: 200 OK
📄 [DEBUG] Response headers: { ... }
📥 [DEBUG] Parsing JSON response...
📊 [DEBUG] Parsed response: { ... }
✅ Flight search successful in 5678ms
```

**If there's an error:**
```
❌ [DEBUG] Flight search failed after 1234ms
❌ [DEBUG] Error type: TypeError
❌ [DEBUG] Error message: Failed to fetch
❌ [DEBUG] Error stack: ...
🚨 [DEBUG] Network error detected - possible CORS or connection issue
```

### 2. **On-Screen Error Display**
When a search fails, you'll now see a prominent **red error box** showing:
- ⚠️ The exact error message
- Instructions to check console
- Buttons to retry or call for help

## 📋 Common Errors and Solutions

### Error: "Failed to fetch" or "Network error"

**Possible Causes:**
1. Backend server at `https://backendhostinger-production.up.railway.app` is down
2. CORS issue (backend not allowing requests from your domain)
3. Network/firewall blocking the request
4. SSL/HTTPS certificate issue

**How to Diagnose:**
1. Open browser console (F12)
2. Look for the error type:
   - `TypeError: Failed to fetch` = Network/CORS issue
   - `HTTP 404` = Endpoint doesn't exist
   - `HTTP 500` = Backend server error
   - `HTTP 403/401` = Authentication issue

**Solutions:**
- Check if backend server is running: Open `https://backendhostinger-production.up.railway.app/health` in browser
- Check backend logs on Railway.app
- Verify CORS headers are set on backend
- Try accessing the backend directly with Postman/curl

### Error: "HTTP 404: Not Found"

**Cause:** The API endpoint doesn't exist on the backend

**Check:**
- Verify endpoint URL in console: Should be `/api/flights/search`
- Check if backend has this route implemented
- Review backend API documentation

**Solution:**
- Verify backend route configuration
- Check Railway deployment logs

### Error: "HTTP 500: Internal Server Error"

**Cause:** Backend encountered an error processing the request

**Check:**
- Look at console logs for backend error message
- Check Railway application logs for stack trace
- Verify EaseMyTrip credentials are correct on backend

**Solution:**
- Review backend error logs
- Test EaseMyTrip API directly
- Check backend environment variables

### Error: "No flights found for the selected criteria"

**Cause:** EaseMyTrip API returned success but with empty results

**Check:**
- Verify airport codes are valid (JFK, DEL, etc.)
- Check if dates are in the future
- Confirm route exists (USA to India)

**Solution:**
- Try different airport codes
- Try different dates
- Check if EaseMyTrip API is working

## 🛠️ Step-by-Step Troubleshooting

### Step 1: Check Backend Health
```bash
# Open in browser or use curl:
curl https://backendhostinger-production.up.railway.app/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is healthy"
}
```

### Step 2: Check Network Tab
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try the search
4. Look for the request to `/api/flights/search`
5. Click on it to see:
   - Request Headers
   - Request Payload
   - Response Headers
   - Response Body

### Step 3: Verify Request Payload
The request should look like this:
```json
{
  "tripType": 1,
  "adults": 1,
  "children": 0,
  "infants": 0,
  "cabin": 0,
  "searchDetails": [
    {
      "origin": "JFK",
      "destination": "DEL",
      "departDate": "2026-03-15"
    }
  ]
}
```

### Step 4: Check CORS Headers
The backend response should include:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept
```

If these are missing, CORS will block the request.

## 📊 Debug Log Reference

| Icon | Meaning |
|------|---------|
| 🔍 | Search operation starting |
| 📍 | API endpoint information |
| 📦 | Request payload |
| 🌐 | Network request initiated |
| ⏱️ | Timing information |
| 📡 | HTTP response status |
| 📄 | Response headers |
| 📥 | Parsing response |
| 📊 | Parsed data |
| ✅ | Success |
| ❌ | Error |
| 🚨 | Critical error (network/CORS) |
| ⚠️ | Warning |

## 🔧 Testing the API Manually

### Using curl (Terminal/Command Prompt):
```bash
curl -X POST https://backendhostinger-production.up.railway.app/api/flights/search \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "tripType": 1,
    "adults": 1,
    "children": 0,
    "infants": 0,
    "cabin": 0,
    "searchDetails": [
      {
        "origin": "JFK",
        "destination": "DEL",
        "departDate": "2026-03-15"
      },
      {
        "origin": "DEL",
        "destination": "JFK",
        "departDate": "2026-03-25"
      }
    ]
  }'
```

### Using Postman:
1. Create new POST request
2. URL: `https://backendhostinger-production.up.railway.app/api/flights/search`
3. Headers:
   - `Content-Type: application/json`
   - `Accept: application/json`
4. Body (raw JSON): See curl example above
5. Send request

## 📞 Next Steps Based on Error

1. **If you see CORS errors:**
   - Backend needs to add CORS headers
   - Check Railway app settings

2. **If you see 404 errors:**
   - Verify backend route exists
   - Check Railway deployment

3. **If you see timeout errors:**
   - Backend might be slow or down
   - Check Railway app status
   - Check EaseMyTrip API status

4. **If you see no errors but no results:**
   - Backend might be returning empty data
   - Check Railway logs
   - Verify EaseMyTrip credentials

## 💡 Quick Fixes to Try

1. **Hard Refresh:** `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)
2. **Clear Cache:** Browser settings → Clear browsing data
3. **Try Different Browser:** Test in Chrome, Firefox, Edge
4. **Check Internet:** Ensure stable connection
5. **Wait & Retry:** Backend might be restarting

## 📝 What to Share When Reporting Issues

When you find the error, please share:
1. ✅ The error message from the console
2. ✅ The full request payload (from `[DEBUG]` logs)
3. ✅ The response status and error (if any)
4. ✅ Screenshot of the error box
5. ✅ Network tab screenshot showing the failed request

This will help quickly identify and fix the issue!

---

**Remember:** All debug logs are now active. Just open your browser console (F12) and try a search - you'll see exactly what's happening at each step! 🚀
