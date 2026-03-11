// REVOLUTIONARY COMPONENT: Floating CTA that follows scroll
// Ensures CTA is always visible

import { Phone, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500 && !dismissed) {
        setVisible(true);
      } else if (window.scrollY <= 500) {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  const handleCall = () => {
    window.location.href = 'tel:+18001234567';
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className="relative">
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 z-10"
        >
          <X className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleCall}
          className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-4 rounded-full shadow-2xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 flex items-center gap-3 group"
        >
          <div className="relative">
            <Phone className="w-6 h-6 animate-pulse" />
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
          </div>
          <div className="text-left">
            <p className="text-sm opacity-90">Talk to Expert</p>
            <p className="text-lg font-bold">1-800-123-4567</p>
          </div>
        </button>

        {/* Pulsing ring effect */}
        <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20"></div>
      </div>
    </div>
  );
}
