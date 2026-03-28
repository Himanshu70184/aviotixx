// REVOLUTIONARY COMPONENT: Live Price Drop Notification
// Simulates real-time price drops to create urgency

import { TrendingDown, X, Phone, Plane, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getContactInfo } from '../services/cmsService';

interface PriceDrop {
  id: number;
  route: string;
  oldPrice: string;
  newPrice: string;
  saving: string;
}

const priceDrops: PriceDrop[] = [
  { id: 1, route: "NYC → Delhi", oldPrice: "JM", newPrice: "New York", saving: "2 min ago" },
  { id: 2, route: "SFO → Mumbai", oldPrice: "AS", newPrice: "San Francisco", saving: "5 min ago" },
  { id: 3, route: "Chicago → Bangalore", oldPrice: "RK", newPrice: "Chicago", saving: "8 min ago" },
];

export function LivePriceDropAlert() {
  const [currentDrop, setCurrentDrop] = useState<PriceDrop | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [contact, setContact] = useState<any>(null);
  
  useEffect(() => {
    getContactInfo().then(setContact);
  }, []);
  
  const phoneDisplay = contact?.phoneDisplay || '1-800-123-4567';
  const phoneTel = contact?.phoneTel || '+18001234567';

  useEffect(() => {
    // Check if user has dismissed the popup in this session
    const isDismissed = sessionStorage.getItem('liveBookingAlertDismissed');
    if (isDismissed === 'true') {
      setDismissed(true);
      return;
    }

    let dropIndex = 0;
    
    const showDrop = () => {
      setCurrentDrop(priceDrops[dropIndex]);
      setVisible(true);
      
      setTimeout(() => {
        setVisible(false);
      }, 8000);

      dropIndex = (dropIndex + 1) % priceDrops.length;
    };

    // Show first drop after 5 seconds
    const initialTimeout = setTimeout(showDrop, 5000);
    
    // Then show every 15 seconds
    const interval = setInterval(showDrop, 15000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem('liveBookingAlertDismissed', 'true');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!visible || !currentDrop || dismissed) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-4 max-w-sm w-full relative overflow-hidden border border-gray-100 animate-scale-in">
        {/* Live Indicator Strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 animate-pulse" />
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Live Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-emerald-700">LIVE BOOKING</span>
          </div>
          <span className="text-xs text-gray-500">{currentDrop.saving}</span>
        </div>

        {/* Booking Details */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
            {currentDrop.oldPrice}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 mb-0.5">
              Someone from {currentDrop.newPrice}
            </p>
            <p className="text-xs text-gray-600 mb-1">
              just booked a flight to India
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-700 bg-blue-50 px-2 py-0.5 rounded">
                <Plane className="w-3 h-3 text-blue-600" />
                <span className="font-semibold">{currentDrop.route}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-3" />

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100">
          <p className="text-xs font-semibold text-gray-700 mb-2 text-center">
            🔥 Get exclusive phone-only deals like this!
          </p>
          <button
            onClick={() => window.location.href = `tel:${phoneTel}`}
            className="w-full bg-orange-500 text-white py-2.5 rounded-lg font-bold hover:bg-orange-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-md"
          >
            <Phone className="w-4 h-4" />
            {phoneDisplay}
          </button>
        </div>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-500">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>Verified booking · 247 calls today</span>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}