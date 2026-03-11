// API Health Check Component - Tests backend connectivity
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';
import { API_CONFIG } from '../config/api';

interface HealthCheckResult {
  status: 'checking' | 'healthy' | 'unhealthy' | 'error';
  message: string;
  details?: {
    url?: string;
    responseTime?: number;
    error?: string;
    cors?: boolean;
  };
}

export function ApiHealthCheck() {
  const [result, setResult] = useState<HealthCheckResult>({
    status: 'checking',
    message: 'Checking backend connectivity...',
  });

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    const startTime = Date.now();
    
    try {
      console.log('🏥 [HEALTH CHECK] Starting backend health check...');
      console.log('🏥 [HEALTH CHECK] Testing URL:', `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.health}`);
      
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.health}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      const responseTime = Date.now() - startTime;
      console.log(`🏥 [HEALTH CHECK] Response received in ${responseTime}ms`);
      console.log('🏥 [HEALTH CHECK] Status:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('🏥 [HEALTH CHECK] Response data:', data);
        
        setResult({
          status: 'healthy',
          message: '✅ Backend is healthy and accessible',
          details: {
            url: API_CONFIG.baseUrl,
            responseTime,
            cors: true,
          },
        });
      } else {
        setResult({
          status: 'unhealthy',
          message: `⚠️ Backend responded with error: ${response.status} ${response.statusText}`,
          details: {
            url: API_CONFIG.baseUrl,
            responseTime,
            error: `HTTP ${response.status}`,
          },
        });
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error('🏥 [HEALTH CHECK] Failed:', error);
      
      // Detect error type
      let errorMessage = 'Unknown error';
      let isCorsIssue = false;
      
      if (error instanceof TypeError) {
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error - Cannot connect to backend';
          isCorsIssue = true;
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setResult({
        status: 'error',
        message: `❌ Cannot connect to backend server`,
        details: {
          url: API_CONFIG.baseUrl,
          responseTime,
          error: errorMessage,
          cors: isCorsIssue,
        },
      });
    }
  };

  const getStatusIcon = () => {
    switch (result.status) {
      case 'checking':
        return <Loader className="w-6 h-6 text-blue-600 animate-spin" />;
      case 'healthy':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'unhealthy':
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (result.status) {
      case 'checking':
        return 'bg-blue-50 border-blue-200';
      case 'healthy':
        return 'bg-green-50 border-green-200';
      case 'unhealthy':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
    }
  };

  return (
    <div className={`border-2 rounded-xl p-6 ${getStatusColor()}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">{getStatusIcon()}</div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Backend API Health Check
          </h3>
          
          <p className="text-sm text-gray-700 mb-3">{result.message}</p>
          
          {result.details && (
            <div className="space-y-2">
              <div className="bg-white/60 rounded-lg p-3 text-sm font-mono">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-600">API URL:</div>
                  <div className="text-gray-900 break-all">{result.details.url}</div>
                  
                  {result.details.responseTime !== undefined && (
                    <>
                      <div className="text-gray-600">Response Time:</div>
                      <div className="text-gray-900">{result.details.responseTime}ms</div>
                    </>
                  )}
                  
                  {result.details.error && (
                    <>
                      <div className="text-gray-600">Error:</div>
                      <div className="text-red-600">{result.details.error}</div>
                    </>
                  )}
                  
                  {result.details.cors !== undefined && (
                    <>
                      <div className="text-gray-600">CORS:</div>
                      <div className={result.details.cors ? 'text-green-600' : 'text-red-600'}>
                        {result.details.cors ? '✅ Enabled' : '❌ Blocked'}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {result.status === 'error' && result.details.cors && (
                <div className="bg-orange-100 border border-orange-300 rounded-lg p-3">
                  <p className="text-sm text-orange-900 font-semibold mb-2">
                    🚨 CORS / Network Issue Detected
                  </p>
                  <p className="text-xs text-orange-800 mb-2">
                    Your backend server is either:
                  </p>
                  <ul className="text-xs text-orange-800 list-disc list-inside space-y-1">
                    <li>Not running or down</li>
                    <li>Not accessible from this domain (CORS blocking)</li>
                    <li>SSL/HTTPS certificate issue</li>
                    <li>Network/firewall blocking the connection</li>
                  </ul>
                  <p className="text-xs text-orange-800 mt-2">
                    <strong>Solution:</strong> Check your Railway deployment and ensure CORS is enabled for Figma domains.
                  </p>
                </div>
              )}

              {result.status === 'healthy' && (
                <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                  <p className="text-sm text-green-900 font-semibold">
                    ✅ Backend is working correctly!
                  </p>
                  <p className="text-xs text-green-800 mt-1">
                    If flights aren't loading, the issue might be with the EaseMyTrip API integration or search endpoint.
                  </p>
                </div>
              )}
            </div>
          )}
          
          <button
            onClick={checkBackendHealth}
            disabled={result.status === 'checking'}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {result.status === 'checking' ? 'Checking...' : 'Re-check Connection'}
          </button>
        </div>
      </div>
    </div>
  );
}
