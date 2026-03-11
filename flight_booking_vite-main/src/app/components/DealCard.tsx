// CMS Component: Deal Card
// Fields: route, price, urgencyBadge, ctaButton

import { ArrowRight } from 'lucide-react';

interface DealCardProps {
  route: string;
  price: string;
  urgencyBadge?: string;
  onCtaClick?: () => void;
}

export function DealCard({ route, price, urgencyBadge, onCtaClick }: DealCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          {urgencyBadge && (
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm mb-3">
              {urgencyBadge}
            </span>
          )}
          <h3 className="text-xl mb-2 text-gray-900">{route}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-gray-600">Starting from</span>
            <span className="text-3xl text-blue-900">{price}</span>
          </div>
        </div>
        <button
          onClick={onCtaClick}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 group-hover:scale-105"
        >
          Book Now
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
