// REVOLUTIONARY COMPONENT: Price Reveal with Blur Effect
// Creates massive curiosity and phone call urgency

import { Phone, Eye } from 'lucide-react';
import { useState } from 'react';

interface PriceRevealCardProps {
  route: string;
  displayPrice: string;
  hiddenPrice: string;
  savings: string;
  onCallClick: () => void;
}

export function PriceRevealCard({ route, displayPrice, hiddenPrice, savings, onCallClick }: PriceRevealCardProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="relative bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-white shadow-2xl overflow-hidden group">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 animate-pulse"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl mb-2">{route}</h3>
            <p className="text-orange-100">Round Trip</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold animate-pulse">
            🔥 PHONE ONLY
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-orange-100 mb-2">Online Price</p>
            <p className="text-3xl line-through opacity-75">{displayPrice}</p>
          </div>
          <div className="relative">
            <p className="text-orange-100 mb-2">Phone-Only Price</p>
            {!revealed ? (
              <div className="relative">
                <p className="text-4xl filter blur-lg select-none">{hiddenPrice}</p>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Eye className="w-8 h-8 animate-pulse" />
                </div>
              </div>
            ) : (
              <p className="text-4xl font-bold animate-bounce">{hiddenPrice}</p>
            )}
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6">
          <p className="text-center text-xl">
            💰 Save <span className="font-bold text-2xl">{savings}</span> by calling!
          </p>
        </div>

        <button
          onClick={() => {
            setRevealed(true);
            setTimeout(onCallClick, 1000);
          }}
          className="w-full bg-white text-orange-600 py-4 rounded-xl hover:bg-orange-50 transition-all duration-300 flex items-center justify-center gap-3 text-xl shadow-2xl group/btn"
        >
          <Phone className="w-6 h-6 group-hover/btn:animate-pulse" />
          {!revealed ? 'Call Now to Reveal Price' : 'Calling...'}
        </button>
      </div>
    </div>
  );
}
