// Promotional Sidebar Component
import { Phone, Zap, Shield, Award, Gift, Clock, Star, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getContactInfo } from '../services/cmsService';

export function PromotionalSidebar() {
  const [contact, setContact] = useState<any>(null);
  useEffect(() => {
    getContactInfo().then(setContact);
  }, []);

  const phoneDisplay = contact?.phoneDisplay || '1-800-123-4567';
  const phoneTel = contact?.phoneTel || '+18001234567';

  const handleCallNow = () => {
    window.location.href = `tel:${phoneTel}`;
  };

  return (
    <div className="space-y-6 sticky top-24">
      {/* Call Now CTA */}
      <div className="bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <Phone className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h3 className="text-xl font-bold mb-2">
            🔥 Exclusive Phone Deals!
          </h3>
          <p className="text-white/90 text-sm mb-4">
            Call now to unlock hidden prices up to 40% cheaper than online!
          </p>
          <button
            onClick={handleCallNow}
            className="w-full bg-white text-[#FF6B35] py-3 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            {phoneDisplay}
          </button>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2 text-white/90 text-xs">
              <Clock className="w-4 h-4" />
              <span>Available 24/7 - Call Anytime!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Why Book With Us */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#0EA5E9] px-4 py-3">
          <h3 className="font-bold text-white">Why Book With Aviotixx?</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">Best Price Guarantee</h4>
              <p className="text-xs text-gray-600">Find cheaper? We'll match it + 10% off</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">Secure Booking</h4>
              <p className="text-xs text-gray-600">SSL encrypted & PCI compliant</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">Instant Confirmation</h4>
              <p className="text-xs text-gray-600">Get tickets in minutes via email</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">Expert Support</h4>
              <p className="text-xs text-gray-600">15+ years serving USA-India routes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Special Offer Banner */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="p-5 text-white relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wide">Limited Time Offer</span>
          </div>
          <h3 className="text-lg font-bold mb-2">
            Save $200 on Round Trips!
          </h3>
          <p className="text-white/90 text-sm mb-3">
            Book USA to India flights this week
          </p>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg text-center">
            <div className="text-xs text-white/80 mb-1">Use Code:</div>
            <div className="text-xl font-bold text-white">INDIA200</div>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#0EA5E9] px-4 py-3">
          <h3 className="font-bold text-white">Customer Reviews</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-gray-700 mb-2">
              "Saved $400 on my family trip to Delhi! Great service and support."
            </p>
            <p className="text-xs text-gray-500 font-medium">- Priya S., New York</p>
          </div>

          <div className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-gray-700 mb-2">
              "Best prices I've found anywhere! Called and got an even better deal."
            </p>
            <p className="text-xs text-gray-500 font-medium">- Rajesh K., California</p>
          </div>

          <div className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-gray-700 mb-2">
              "24/7 support is amazing. They helped me change my booking at midnight!"
            </p>
            <p className="text-xs text-gray-500 font-medium">- Sarah M., Texas</p>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 text-sm mb-3 text-center">Trusted & Certified</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <Shield className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <div className="text-xs font-semibold text-gray-900">SSL Secure</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <Award className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <div className="text-xs font-semibold text-gray-900">IATA Certified</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
            <div className="text-xs font-semibold text-gray-900">4.8/5 Rating</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <Gift className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <div className="text-xs font-semibold text-gray-900">Best Deals</div>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4">
        <h4 className="font-semibold text-gray-900 text-sm mb-3 text-center">Need Help?</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#1E3A8A]" />
            <span>{phoneDisplay}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1E3A8A]" />
            <span>24/7 Support Available</span>
          </div>
        </div>
        <button
          onClick={handleCallNow}
          className="w-full mt-3 bg-gradient-to-r from-[#1E3A8A] to-[#0EA5E9] text-white py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
        >
          Contact Us Now
        </button>
      </div>
    </div>
  );
}
