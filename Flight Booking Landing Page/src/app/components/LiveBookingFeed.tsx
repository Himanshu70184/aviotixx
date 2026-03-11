// COMPACT COMPONENT: Live Booking Feed - Minimal Design

import { CheckCircle, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Booking {
  id: number;
  name: string;
  route: string;
  saved: string;
  time: string;
}

const mockBookings: Booking[] = [
  { id: 1, name: "Amit P.", route: "NYC → Delhi", saved: "$427", time: "2 min ago" },
  { id: 2, name: "Sarah K.", route: "SFO → Mumbai", saved: "$385", time: "5 min ago" },
  { id: 3, name: "Raj M.", route: "Chicago → Bangalore", saved: "$512", time: "8 min ago" },
  { id: 4, name: "Lisa W.", route: "LA → Hyderabad", saved: "$398", time: "12 min ago" },
];

export function LiveBookingFeed() {
  const [bookings, setBookings] = useState(mockBookings.slice(0, 3));
  const [currentIndex, setCurrentIndex] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockBookings.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newBooking = mockBookings[currentIndex];
    setBookings((prev) => [newBooking, ...prev.slice(0, 2)]);
  }, [currentIndex]);

  return (
    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <h3 className="text-white text-base font-bold">Live Bookings</h3>
      </div>

      <div className="space-y-2.5">
        {bookings.map((booking, index) => (
          <div
            key={`${booking.id}-${index}`}
            className={`bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white transition-all duration-500 ${
              index === 0 ? 'scale-100 opacity-100' : 'scale-95 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <CheckCircle className="w-4 h-4 text-emerald-200 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{booking.name}</p>
                  <p className="text-xs text-emerald-100">{booking.route}</p>
                </div>
              </div>
              <div className="text-right ml-2">
                <p className="font-bold text-sm flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  {booking.saved}
                </p>
                <p className="text-xs text-emerald-100">{booking.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-white text-xs font-semibold">147 bookings today</p>
      </div>
    </div>
  );
}
