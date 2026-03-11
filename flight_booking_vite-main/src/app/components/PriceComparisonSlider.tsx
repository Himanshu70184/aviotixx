// COMPACT CREATIVE COMPONENT: Interactive Price Comparison

import { ArrowRight, TrendingDown } from 'lucide-react';
import { useState } from 'react';

interface ComparisonData {
  competitor: string;
  price: string;
  logo?: string;
}

interface PriceComparisonSliderProps {
  route: string;
  aviotixxPrice: string;
  competitors: ComparisonData[];
}

export function PriceComparisonSlider({ route, aviotixxPrice, competitors }: PriceComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">{route}</h3>
          <p className="text-xs text-blue-100">Drag to compare prices</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-blue-100">You Save</p>
          <p className="text-lg font-bold">$550</p>
        </div>
      </div>

      <div className="p-4">
        {/* Compact Interactive Before/After Comparison */}
        <div className="relative h-32 rounded-lg overflow-hidden mb-4 shadow-md">
          <div className="absolute inset-0 flex">
            {/* Left side - Competitors */}
            <div 
              className="bg-gradient-to-br from-rose-400 to-red-500 text-white flex items-center justify-center"
              style={{ width: `${sliderPosition}%` }}
            >
              <div className="text-center">
                <p className="text-xs opacity-90 mb-1">Others</p>
                <p className="text-2xl font-bold">${competitors[0]?.price || '1,299'}</p>
              </div>
            </div>

            {/* Right side - Aviotixx */}
            <div 
              className="bg-gradient-to-br from-emerald-400 to-green-500 text-white flex items-center justify-center"
              style={{ width: `${100 - sliderPosition}%` }}
            >
              <div className="text-center">
                <p className="text-xs opacity-90 mb-1">Aviotixx</p>
                <p className="text-2xl font-bold">{aviotixxPrice}</p>
              </div>
            </div>
          </div>

          {/* Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize z-10 shadow-lg"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
              <ArrowRight className="w-3 h-3 text-blue-600" />
            </div>
          </div>

          {/* Draggable overlay */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          />
        </div>

        {/* Compact Comparison Grid */}
        <div className="grid grid-cols-2 gap-2">
          {competitors.slice(0, 2).map((comp, index) => (
            <div key={index} className="bg-rose-50 rounded-lg p-2.5 text-center">
              <p className="text-xs text-gray-600 mb-0.5">{comp.competitor}</p>
              <p className="text-base font-bold text-gray-900">${comp.price}</p>
            </div>
          ))}
        </div>

        <div className="mt-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg p-2.5 text-white text-center">
          <p className="text-xs mb-0.5">Aviotixx (Call Only)</p>
          <p className="text-xl font-bold">{aviotixxPrice}</p>
        </div>
      </div>
    </div>
  );
}
