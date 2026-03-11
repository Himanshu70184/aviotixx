// CMS Component: Blog Card - Redesigned Compact & Modern
// Fields: image, title, excerpt, readTime

import { Clock, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  image: string;
  title: string;
  excerpt: string;
  readTime: string;
  onCtaClick?: () => void;
}

export function BlogCard({ image, title, excerpt, readTime, onCtaClick }: BlogCardProps) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer card-3d magnetic-card">
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1E3A8A] transition-colors">
          {title}
        </h3>
        
        <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">{excerpt}</p>
        
        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{readTime}</span>
          </div>
          
          <button
            onClick={onCtaClick}
            className="text-xs text-[#1E3A8A] hover:text-[#FF6B35] font-semibold transition-colors flex items-center gap-1 group/btn"
          >
            Read
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
