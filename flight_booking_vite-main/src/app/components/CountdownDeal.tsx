// CREATIVE COMPONENT: Countdown Deal Timer - Eye-Friendly Design
// Creates urgency with softer, premium colors

import { Clock, Zap, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CountdownDealProps {
  route: string;
  price: string;
  originalPrice: string;
  initialMinutes?: number;
}

export function CountdownDeal({ route, price, originalPrice, initialMinutes = 15 }: CountdownDealProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          return initialMinutes * 60; // Reset
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialMinutes]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleCall = () => {
    window.location.href = 'tel:+18001234567';
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Top Badge Bar */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-white text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>FLASH DEAL</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
          <Clock className="w-3.5 h-3.5 text-white" />
          <span className="font-mono font-bold text-white text-xs">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900 mb-3">{route}</h3>

        <div className="flex items-end gap-3 mb-3">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Regular Price</p>
            <p className="text-lg text-gray-400 line-through">{originalPrice}</p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-emerald-600 font-semibold mb-0.5">Flash Price</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {price}
            </p>
          </div>
        </div>

        {/* Seats Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-600 font-medium">Only 3 seats left</span>
            <span className="text-amber-600 font-semibold">89% claimed</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500" 
              style={{ width: '89%' }}
            ></div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleCall}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold shadow-md group-hover:shadow-lg"
        >
          <Phone className="w-4 h-4" />
          Book Now - Call to Secure
        </button>
      </div>

      {/* Savings Badge */}
      <div className="absolute top-12 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1 rounded-l-full text-xs font-bold shadow-lg">
        Save ${parseInt(originalPrice.replace(/[^0-9]/g, ''), 10) - parseInt(price.replace(/[^0-9]/g, ''), 10)}
      </div>
    </div>
  );
}