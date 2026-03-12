// Premium Flight Search Loading Animation
import { Plane, MapPin, Calendar, Users, Sparkles, Zap, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FlightSearchLoaderProps {
  from: string;
  to: string;
  departDate: string;
  passengers: string;
  tripType: 'roundtrip' | 'oneway';
}

export function FlightSearchLoader({ from, to, departDate, passengers, tripType }: FlightSearchLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [searchStartTime] = useState(Date.now());

  const searchingTips = [
    "🔍 Scanning 500+ airlines worldwide...",
    "💰 Finding exclusive discounts up to 40% off...",
    "✈️ Comparing direct & connecting flights...",
    "⚡ Checking real-time seat availability...",
    "🎯 Filtering best deals for you...",
    "🌟 Almost there! Preparing results...",
  ];

  useEffect(() => {
    // More realistic progress based on typical API response times (8-15 seconds)
    const expectedDuration = 12000; // 12 seconds average
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        
        const elapsed = Date.now() - searchStartTime;
        const targetProgress = Math.min((elapsed / expectedDuration) * 100, 95);
        
        // Smooth progress towards target with some randomness
        const increment = (targetProgress - prev) * 0.3 + Math.random() * 5;
        return Math.min(prev + increment, targetProgress);
      });
    }, 300);

    // Rotate tips based on progress phases
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => {
        const elapsed = Date.now() - searchStartTime;
        const phase = Math.floor((elapsed / 2000) % searchingTips.length);
        return phase;
      });
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, [searchStartTime]);

  return (
    <div className="min-h-[600px] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        {/* Main Card */}
        <div className="bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 md:p-12 relative overflow-hidden">
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-2 h-2 bg-[#0EA5E9] rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
            <div className="absolute top-20 right-20 w-2 h-2 bg-[#FF6B35] rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 left-20 w-2 h-2 bg-[#10B981] rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
            <div className="absolute bottom-10 right-10 w-2 h-2 bg-[#1E3A8A] rounded-full animate-ping" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}></div>
          </div>

          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1E3A8A] to-[#0EA5E9] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
              <Sparkles className="w-4 h-4" />
              Searching for Best Deals
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Finding Your Perfect Flight
            </h2>
            <p className="text-gray-600 text-lg">
              Comparing prices from hundreds of airlines to get you the best deal
            </p>
          </div>

          {/* Flight Route Animation */}
          <div className="relative mb-8">
            {/* Route Line */}
            <div className="flex items-center justify-between relative mb-6">
              {/* Origin */}
              <div className="flex-1 text-left">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl shadow-md border border-gray-200">
                  <MapPin className="w-5 h-5 text-[#1E3A8A]" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{from}</div>
                    <div className="text-xs text-gray-500">Origin</div>
                  </div>
                </div>
              </div>

              {/* Animated Plane */}
              <div className="flex-1 relative h-24">
                {/* Futuristic glowing energy beam */}
                <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#0EA5E9]/20 to-transparent overflow-hidden">
                  {/* Moving energy pulses */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0EA5E9] to-transparent opacity-50" 
                       style={{ animation: 'energyPulse 2s ease-in-out infinite' }}></div>
                </div>
                
                {/* Neon rail line */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#1E3A8A]/30 via-[#0EA5E9]/50 to-[#10B981]/30 -translate-y-1/2 shadow-[0_0_10px_rgba(14,165,233,0.5)]"></div>
                
                {/* Flying plane with glow effect */}
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-1000 ease-linear z-10"
                  style={{
                    left: `${progress}%`,
                  }}
                >
                  <div className="relative">
                    {/* Outer glow ring */}
                    <div className="absolute inset-0 w-12 h-12 -left-2 -top-2 bg-[#FF6B35]/20 rounded-full blur-xl animate-pulse"></div>
                    
                    {/* Plane icon with neon glow */}
                    <div className="relative">
                      <Plane className="w-8 h-8 text-[#FF6B35] transform rotate-45 drop-shadow-[0_0_8px_rgba(255,107,53,0.8)]" 
                             style={{ filter: 'drop-shadow(0 0 12px rgba(255,107,53,0.6))' }} />
                    </div>
                    
                    {/* Particle trail effect */}
                    <div className="absolute top-1/2 right-full w-16 h-1 -translate-y-1/2">
                      {/* Main trail */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF6B35]/60 to-[#FF6B35] blur-sm"></div>
                      {/* Particle dots */}
                      <div className="absolute top-0 right-0 w-1 h-1 bg-[#FF6B35] rounded-full animate-ping" style={{ animationDuration: '1s' }}></div>
                      <div className="absolute top-0 right-4 w-1 h-1 bg-[#FF6B35]/70 rounded-full animate-ping" style={{ animationDuration: '1.2s', animationDelay: '0.2s' }}></div>
                      <div className="absolute top-0 right-8 w-1 h-1 bg-[#FF6B35]/40 rounded-full animate-ping" style={{ animationDuration: '1.4s', animationDelay: '0.4s' }}></div>
                    </div>
                    
                    {/* Forward energy burst */}
                    <div className="absolute top-1/2 left-full w-8 h-0.5 -translate-y-1/2 bg-gradient-to-r from-[#FF6B35] to-transparent opacity-60" 
                         style={{ animation: 'energyBurst 1.5s ease-out infinite' }}></div>
                  </div>
                </div>

                {/* Floating digital particles */}
                <div className="absolute top-0 left-1/4 w-1.5 h-1.5 bg-[#0EA5E9] rounded-full shadow-[0_0_6px_rgba(14,165,233,0.8)]" 
                     style={{ animation: 'digitalFloat 4s ease-in-out infinite' }}></div>
                <div className="absolute top-4 left-1/3 w-1 h-1 bg-[#10B981] rounded-full shadow-[0_0_4px_rgba(16,185,129,0.8)]" 
                     style={{ animation: 'digitalFloat 3.5s ease-in-out infinite', animationDelay: '0.5s' }}></div>
                <div className="absolute top-2 left-1/2 w-1.5 h-1.5 bg-[#FF6B35] rounded-full shadow-[0_0_6px_rgba(255,107,53,0.8)]" 
                     style={{ animation: 'digitalFloat 4.5s ease-in-out infinite', animationDelay: '1s' }}></div>
                <div className="absolute bottom-2 left-2/3 w-1 h-1 bg-[#0EA5E9] rounded-full shadow-[0_0_4px_rgba(14,165,233,0.8)]" 
                     style={{ animation: 'digitalFloat 3.8s ease-in-out infinite', animationDelay: '1.5s' }}></div>
                <div className="absolute bottom-4 right-1/4 w-1.5 h-1.5 bg-[#10B981] rounded-full shadow-[0_0_6px_rgba(16,185,129,0.8)]" 
                     style={{ animation: 'digitalFloat 4.2s ease-in-out infinite', animationDelay: '2s' }}></div>
                
                {/* Scanning lines effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0EA5E9]/40 to-transparent" 
                       style={{ animation: 'scanLine 3s linear infinite' }}></div>
                </div>
              </div>

              {/* Destination */}
              <div className="flex-1 text-right">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl shadow-md border border-gray-200">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{to}</div>
                    <div className="text-xs text-gray-500">Destination</div>
                  </div>
                  <MapPin className="w-5 h-5 text-[#10B981]" />
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-[#1E3A8A] via-[#0EA5E9] to-[#10B981] rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <div className="text-center mt-2 text-sm font-semibold text-gray-700">
                {Math.min(Math.round(progress), 100)}% Complete
              </div>
            </div>
          </div>

          {/* Search Details */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Departure</span>
              </div>
              <div className="text-gray-900 font-semibold">{new Date(departDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <Users className="w-4 h-4" />
                <span className="font-medium">Travelers</span>
              </div>
              <div className="text-gray-900 font-semibold">{passengers} Passenger{parseInt(passengers) > 1 ? 's' : ''}</div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-gray-200 col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <Plane className="w-4 h-4" />
                <span className="font-medium">Trip Type</span>
              </div>
              <div className="text-gray-900 font-semibold capitalize">{tripType === 'roundtrip' ? 'Round Trip' : 'One Way'}</div>
            </div>
          </div>

          {/* Dynamic Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1 transition-all duration-500">
                  {searchingTips[currentTip]}
                </div>
                <div className="text-sm text-gray-600">
                  Our AI is analyzing thousands of flight combinations in real-time
                </div>
              </div>
            </div>
          </div>

          {/* Value Promises */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-white/40 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-[#10B981] mb-1">40%</div>
              <div className="text-xs text-gray-600 font-medium">Avg Savings</div>
            </div>
            <div className="text-center p-3 bg-white/40 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-[#0EA5E9] mb-1">500+</div>
              <div className="text-xs text-gray-600 font-medium">Airlines</div>
            </div>
            <div className="text-center p-3 bg-white/40 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-[#FF6B35] mb-1">24/7</div>
              <div className="text-xs text-gray-600 font-medium">Support</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fly {
          0%, 100% {
            transform: translateY(-4px) rotate(45deg);
          }
          50% {
            transform: translateY(4px) rotate(45deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes energyPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        @keyframes energyBurst {
          0% {
            width: 0;
          }
          100% {
            width: 8px;
          }
        }

        @keyframes digitalFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes scanLine {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(96px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}