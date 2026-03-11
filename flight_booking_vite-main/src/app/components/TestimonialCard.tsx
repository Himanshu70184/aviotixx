// CMS Component: Testimonial Card
// Fields: customerPhoto, name, review, rating, location

import { Star } from 'lucide-react';

interface TestimonialCardProps {
  customerPhoto: string;
  name: string;
  review: string;
  rating: number;
  location: string;
}

export function TestimonialCard({ customerPhoto, name, review, rating, location }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 h-full flex flex-col">
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      
      <p className="text-gray-700 mb-6 flex-grow leading-relaxed">"{review}"</p>
      
      <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
        <img
          src={customerPhoto}
          alt={name}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div>
          <p className="text-gray-900 mb-1">{name}</p>
          <p className="text-sm text-gray-500">{location}</p>
        </div>
      </div>
    </div>
  );
}
