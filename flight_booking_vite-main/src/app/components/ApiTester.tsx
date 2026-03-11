import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function ApiTester() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testApiConnection = async () => {
    setTesting(true);
    setResult(null);
    setError(null);

    const testPayload = {
      tripType: 0,
      adults: 1,
      children: 0,
      infants: 0,
      cabin: 0,
      searchDetails: [
        {
          origin: "DEL",
          destination: "BOM",
          departDate: "2026-03-15"
        }
      ],
      travelId: `AVIOTIX_${Date.now()}_${Math.random().toString(36).substring(2, 11).toUpperCase()}`
    };

    try {
      console.log("🚀 Testing API with payload:", testPayload);
      
      const response = await fetch(
        "https://backendhostinger-production.up.railway.app/api/flights/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(testPayload),
        }
      );

      console.log("📡 Response status:", response.status);
      console.log("📡 Response headers:", response.headers);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Response data:", data);
      
      setResult({
        status: response.status,
        statusText: response.statusText,
        data: data,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error("❌ API Test Error:", err);
      setError(err.message || "Unknown error occurred");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-auto">
      <Card className="p-4 bg-white shadow-2xl border-2 border-blue-500">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">🔧 API Connection Tester</h3>
            <Button
              onClick={testApiConnection}
              disabled={testing}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-blue-700"
            >
              {testing ? "Testing..." : "Test API"}
            </Button>
          </div>

          {/* Endpoint Info */}
          <div className="text-xs bg-gray-100 p-2 rounded">
            <div className="font-semibold mb-1">Endpoint:</div>
            <div className="break-all text-blue-600">
              POST /api/flights/search
            </div>
          </div>

          {/* Loading */}
          {testing && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-sm font-medium">
                  Connecting to Railway backend...
                </span>
              </div>
            </div>
          )}

          {/* Success Result */}
          {result && !error && (
            <div className="space-y-2">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                  <span className="text-xl">✅</span>
                  <span>Connection Successful!</span>
                </div>
                <div className="text-xs space-y-1">
                  <div>
                    <span className="font-semibold">Status:</span>{" "}
                    {result.status} {result.statusText}
                  </div>
                  <div>
                    <span className="font-semibold">Timestamp:</span>{" "}
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </div>
                  <div>
                    <span className="font-semibold">Flights Found:</span>{" "}
                    {result.data?.data?.Journeys?.length || 0} journeys
                  </div>
                </div>
              </div>

              {/* Sample Flight Data */}
              {result.data?.data?.Journeys?.[0] && (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-48 overflow-auto">
                  <div className="font-semibold text-xs mb-2">
                    Sample Flight Data:
                  </div>
                  <pre className="text-[10px] overflow-auto">
                    {JSON.stringify(
                      result.data.data.Journeys[0],
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}

              {/* Full Response */}
              <details className="text-xs">
                <summary className="cursor-pointer font-semibold text-blue-600 hover:text-blue-700">
                  View Full Response
                </summary>
                <pre className="mt-2 bg-gray-900 text-green-400 p-2 rounded overflow-auto max-h-64 text-[10px]">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {/* Error Result */}
          {error && (
            <div className="space-y-2">
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                  <span className="text-xl">❌</span>
                  <span>Connection Failed</span>
                </div>
                <div className="text-xs space-y-2">
                  <div>
                    <span className="font-semibold">Error:</span>
                    <div className="mt-1 bg-white p-2 rounded border border-red-300 break-all">
                      {error}
                    </div>
                  </div>

                  {/* CORS Diagnosis */}
                  {error.includes("Failed to fetch") && (
                    <div className="bg-yellow-50 p-2 rounded border border-yellow-300">
                      <div className="font-semibold text-yellow-800 mb-1">
                        🔍 Possible CORS Issue
                      </div>
                      <div className="text-yellow-700">
                        The browser may be blocking the request. Check:
                        <ul className="list-disc ml-4 mt-1">
                          <li>Railway deployment status</li>
                          <li>CORS_ORIGIN environment variable</li>
                          <li>Backend logs in Railway</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Debugging Tips */}
              <details className="text-xs">
                <summary className="cursor-pointer font-semibold text-orange-600 hover:text-orange-700">
                  Debugging Tips
                </summary>
                <div className="mt-2 space-y-2 text-xs">
                  <div className="bg-gray-100 p-2 rounded">
                    <div className="font-semibold mb-1">Check Railway:</div>
                    <ul className="list-disc ml-4 space-y-1">
                      <li>Verify deployment is "Active"</li>
                      <li>Check CORS_ORIGIN variable is set</li>
                      <li>View logs for errors</li>
                    </ul>
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <div className="font-semibold mb-1">Check Console:</div>
                    <div>Open browser DevTools (F12) → Console tab</div>
                  </div>
                </div>
              </details>
            </div>
          )}

          {/* Instructions */}
          {!result && !error && !testing && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-xs">
              <div className="font-semibold mb-1">📋 Test Details:</div>
              <ul className="list-disc ml-4 space-y-1 text-blue-800">
                <li>Tests DEL → BOM flight search</li>
                <li>Verifies CORS configuration</li>
                <li>Shows real API response</li>
                <li>Checks Railway backend status</li>
              </ul>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
