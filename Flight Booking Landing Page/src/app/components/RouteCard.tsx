// CMS Component: Route Card - Compact Version
// Fields: fromCity, toCity, price, destinationImage

import { ArrowRight } from 'lucide-react';

interface RouteCardProps {
  fromCity: string;
  toCity: string;
  price: string;
  destinationImage?: string;
}

export function RouteCard({ fromCity, toCity, price, destinationImage }: RouteCardProps) {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
      {/* Compact Image */}
      <div className="relative h-32 overflow-hidden">
        {destinationImage ? (
          <img
            src={destinationImage}
            alt={toCity}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
        
        {/* Price Badge - Smaller */}
        <div className="absolute top-2 right-2 bg-white rounded-lg px-2.5 py-1 shadow-md">
          <p className="text-xs text-gray-600">from</p>
          <p className="text-lg font-bold text-[#FF6B35] leading-none">{price}</p>
        </div>
      </div>

      {/* Compact Content */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-1">
            <span className="text-sm font-semibold text-gray-900">{fromCity}</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-900">{toCity}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#1E3A8A] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
}
