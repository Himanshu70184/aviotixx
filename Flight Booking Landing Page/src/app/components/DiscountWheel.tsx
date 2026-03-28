// COMPACT CREATIVE COMPONENT: Gamified Discount - Minimal Design

import { Phone, Gift, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getContactInfo } from '../services/cmsService';

export function DiscountWheel() {
  const [spinning, setSpinning] = useState(false);
  const [won, setWon] = useState(false);
  const [discount, setDiscount] = useState('');

  const discounts = ['$50', '$100', '$150', '$200', '$300', '$400'];

  const spinWheel = () => {
    setSpinning(true);
    
    setTimeout(() => {
      const wonDiscount = discounts[Math.floor(Math.random() * discounts.length)];
      setDiscount(wonDiscount);
      setSpinning(false);
      setWon(true);
    }, 2000);
  };

  const [contact, setContact] = useState<any>(null);
  useEffect(() => {
    getContactInfo().then(setContact);
  }, []);

  const phoneDisplay = contact?.phoneDisplay || '1-800-123-4567';
  const phoneTel = contact?.phoneTel || '+18001234567';

  const handleCall = () => {
    window.location.href = `tel:${phoneTel}`;
  };

  return (
    <div className="relative bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-6 text-white shadow-lg overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

      <div className="relative z-10">
        {!won ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Spin & Win</h3>
                <p className="text-xs text-purple-100">Extra discount up to $400</p>
              </div>
            </div>

            <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl ${spinning ? 'animate-spin' : ''}`}>
              <span className="text-3xl">🎁</span>
            </div>

            <button
              onClick={spinWheel}
              disabled={spinning}
              className="w-full bg-white text-purple-600 py-2.5 rounded-lg hover:bg-purple-50 transition-all duration-300 text-sm font-bold shadow-md disabled:opacity-50"
            >
              {spinning ? 'Spinning...' : '🎯 SPIN NOW'}
            </button>
          </>
        ) : (
          <>
            <div className="text-center mb-4">
              <p className="text-sm mb-2">🎉 You Won!</p>
              <div className="text-5xl font-bold mb-2">{discount}</div>
              <p className="text-xs text-purple-100">Extra Off Your Booking</p>
            </div>

            <button
              onClick={handleCall}
              className="w-full bg-white text-purple-600 py-2.5 rounded-lg hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-bold shadow-md"
            >
              <Phone className="w-4 h-4" />
              Call to Claim Now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
