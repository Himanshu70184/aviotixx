// Main App Entry - Uses React Router
import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return <RouterProvider router={router} />;
}

// ===== LANDING PAGE COMPONENT (Original App) =====
import { Phone, Search, Users, Shield, Star, Award, MapPin, Facebook, Twitter, Instagram, Linkedin, Zap, TrendingUp, Timer, Gift, Eye, Sparkles, TrendingDown, CheckCircle, Headphones, ArrowRight, Calendar, Plane } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { DealCard } from './components/DealCard';
import { RouteCard } from './components/RouteCard';
import { TestimonialCard } from './components/TestimonialCard';
import { BlogCard } from './components/BlogCard';
import { FAQItem } from './components/FAQItem';
import { PriceRevealCard } from './components/PriceRevealCard';
import { LiveBookingFeed } from './components/LiveBookingFeed';
import { DiscountWheel } from './components/DiscountWheel';
import { CountdownDeal } from './components/CountdownDeal';
import { PriceComparisonSlider } from './components/PriceComparisonSlider';
import { FloatingCTA } from './components/FloatingCTA';
import { LivePriceDropAlert } from './components/LivePriceDropAlert';
import { FlightSearchForm } from './components/FlightSearchForm';
import logo from '../assets/400acf417779742a37b81dd5b0157e41ef0c77b2.png';

export function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Advanced Intersection Observer for Scroll Animations
  useEffect(() => {
    const observerOptions = {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
      rootMargin: '-50px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.getAttribute('data-section-id');
        if (sectionId) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            setVisibleSections(prev => new Set(prev).add(sectionId));
          }
        }
      });
    }, observerOptions);

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleCallNow = () => {
    window.location.href = 'tel:+18001234567';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Floating CTA */}
      <FloatingCTA />
      
      {/* Live Price Drop Alerts */}
      <LivePriceDropAlert />

      {/* Top Offer Bar - Apple/Stripe Inspired Clean Design */}
      <div className={`transition-all duration-500 ${
        isScrolled 
          ? 'fixed top-0 left-0 right-0 bg-[#1E3A8A] z-50' 
          : 'absolute top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#1E3A8A]/60 via-[#1E3A8A]/50 to-[#0F2557]/60 backdrop-blur-xl'
      } border-b border-white/10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-center gap-4 text-white">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="font-medium">Exclusive Phone Deals</span>
            </div>
            <span className="text-white/40">|</span>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Save up to</span>
              <span className="font-bold text-emerald-300">$500</span>
            </div>
            <span className="text-white/40">|</span>
            <button 
              onClick={handleCallNow} 
              className="text-sm font-semibold hover:text-emerald-300 transition-colors underline decoration-emerald-300/50 underline-offset-2"
            >
              1-800-123-4567
            </button>
          </div>
        </div>
      </div>

      {/* Header - Sleek Apple/Stripe Style */}
      <header className={`transition-all duration-500 ${
        isScrolled 
          ? 'fixed top-[40px] left-0 right-0 bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-200/80 z-50' 
          : 'absolute top-[40px] left-0 right-0 z-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo & Navigation */}
            <div className="flex items-center gap-10">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <img 
                  src={logo} 
                  alt="Aviotixx" 
                  className={`transition-all duration-500 ${
                    isScrolled 
                      ? 'h-7 brightness-100' 
                      : 'h-8 brightness-0 invert drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]'
                  }`} 
                />
              </div>

              {/* Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                <a 
                  href="#search" 
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-50' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Flights
                </a>
                <a 
                  href="#deals" 
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-50' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Deals
                </a>
                <a 
                  href="#routes" 
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-50' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Routes
                </a>
              </nav>
            </div>
            
            {/* Right: Trust Badge & CTA */}
            <div className="flex items-center gap-6">
              {/* Trust Indicator */}
              <div className={`hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-500 ${
                isScrolled 
                  ? 'bg-gray-50 text-gray-700 border border-gray-200' 
                  : 'bg-white/15 backdrop-blur-md text-white border border-white/20'
              }`}>
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">4.9</span>
                <span className="text-gray-400 dark:text-white/60">·</span>
                <span className="opacity-90">500K+ travelers</span>
              </div>

              {/* CTA Button - Premium Minimal */}
              <button
                onClick={handleCallNow}
                className={`group relative overflow-hidden px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                  isScrolled 
                    ? 'bg-[#FF6B35] text-white hover:bg-[#F7931E] shadow-sm hover:shadow-md' 
                    : 'bg-white text-[#1E3A8A] hover:bg-white/95 shadow-lg hover:shadow-xl'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>1-800-123-4567</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO - Ultra Compact & Clean - Extends to top */}
      <section id="search" className="relative bg-gradient-to-br from-[#0A1628] via-[#1E3A8A] to-[#0F2557] text-white pt-32 pb-8 overflow-hidden">
        {/* Animated Globe Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated Globe Grid Lines */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
              {/* Vertical longitude lines */}
              {[...Array(12)].map((_, i) => (
                <ellipse
                  key={`v-${i}`}
                  cx="500"
                  cy="300"
                  rx={50 + i * 40}
                  ry="280"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                  opacity="0.6"
                  style={{
                    animation: `rotateGlobe ${20 + i * 2}s linear infinite`,
                    transformOrigin: '500px 300px'
                  }}
                />
              ))}
              {/* Horizontal latitude lines */}
              {[...Array(8)].map((_, i) => (
                <ellipse
                  key={`h-${i}`}
                  cx="500"
                  cy="300"
                  rx="450"
                  ry={30 + i * 35}
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                  opacity="0.5"
                />
              ))}
            </svg>
          </div>

          {/* Flight Paths with Animated Planes */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            {/* Flight Path 1: USA to India (NYC to Delhi) */}
            <path
              d="M 150,250 Q 500,100 850,300"
              fill="none"
              stroke="url(#flightGradient1)"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.6"
            >
              <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
            </path>
            
            {/* Flight Path 2: West Coast to India */}
            <path
              d="M 100,350 Q 400,200 800,280"
              fill="none"
              stroke="url(#flightGradient2)"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.6"
            >
              <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1.2s" repeatCount="indefinite" />
            </path>

            {/* Flight Path 3: Central USA to India */}
            <path
              d="M 200,300 Q 550,150 850,250"
              fill="none"
              stroke="url(#flightGradient3)"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.6"
            >
              <animate attributeName="stroke-dashoffset" from="0" to="10" dur="0.8s" repeatCount="indefinite" />
            </path>

            {/* Animated Planes */}
            <g className="animate-flight-1">
              <path d="M -5,-2 L 5,0 L -5,2 L -3,0 Z" fill="#FBBF24" opacity="0.9">
                <animateMotion dur="8s" repeatCount="indefinite" path="M 150,250 Q 500,100 850,300" />
              </path>
            </g>

            <g className="animate-flight-2">
              <path d="M -5,-2 L 5,0 L -5,2 L -3,0 Z" fill="#10B981" opacity="0.9">
                <animateMotion dur="10s" repeatCount="indefinite" path="M 100,350 Q 400,200 800,280" />
              </path>
            </g>

            <g className="animate-flight-3">
              <path d="M -5,-2 L 5,0 L -5,2 L -3,0 Z" fill="#3B82F6" opacity="0.9">
                <animateMotion dur="7s" repeatCount="indefinite" path="M 200,300 Q 550,150 850,250" />
              </path>
            </g>

            {/* City Markers with Pulse */}
            <g className="city-markers">
              {/* NYC */}
              <circle cx="150" cy="250" r="3" fill="#FF6B35">
                <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
              </circle>
              
              {/* SF */}
              <circle cx="100" cy="350" r="3" fill="#FF6B35">
                <animate attributeName="r" values="3;6;3" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.5;1" dur="2.5s" repeatCount="indefinite" />
              </circle>

              {/* Chicago */}
              <circle cx="200" cy="300" r="3" fill="#FF6B35">
                <animate attributeName="r" values="3;6;3" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.5;1" dur="1.8s" repeatCount="indefinite" />
              </circle>

              {/* Delhi */}
              <circle cx="850" cy="300" r="4" fill="#10B981">
                <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
              </circle>
              
              {/* Mumbai */}
              <circle cx="800" cy="280" r="4" fill="#10B981">
                <animate attributeName="r" values="4;8;4" dur="2.3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.5;1" dur="2.3s" repeatCount="indefinite" />
              </circle>

              {/* Bangalore */}
              <circle cx="850" cy="250" r="4" fill="#10B981">
                <animate attributeName="r" values="4;8;4" dur="1.9s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.5;1" dur="1.9s" repeatCount="indefinite" />
              </circle>
            </g>

            {/* Gradients */}
            <defs>
              <linearGradient id="flightGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0 }} />
                <stop offset="50%" style={{ stopColor: '#60A5FA', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#10B981', stopOpacity: 0 }} />
              </linearGradient>
              
              <linearGradient id="flightGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 0 }} />
                <stop offset="50%" style={{ stopColor: '#A78BFA', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#10B981', stopOpacity: 0 }} />
              </linearGradient>

              <linearGradient id="flightGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#F59E0B', stopOpacity: 0 }} />
                <stop offset="50%" style={{ stopColor: '#FBBF24', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#10B981', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
          </svg>

          {/* Futuristic Floating Particles & Data Streams */}
          <div className="absolute inset-0">
            {/* Glowing Particles - Multiple Sizes & Colors */}
            {[...Array(40)].map((_, i) => {
              const size = Math.random() > 0.7 ? 3 : Math.random() > 0.4 ? 2 : 1;
              const colors = ['#60A5FA', '#7DD3FC', '#A78BFA', '#FCD34D', '#34D399', '#FFFFFF'];
              const color = colors[Math.floor(Math.random() * colors.length)];
              const glowColor = color === '#FFFFFF' ? 'rgba(96, 165, 250, 0.5)' : color;
              
              return (
                <div
                  key={`particle-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    boxShadow: `0 0 ${size * 4}px ${glowColor}, 0 0 ${size * 8}px ${glowColor}`,
                    opacity: 0.8,
                    animation: `float ${5 + Math.random() * 10}s ease-in-out infinite, pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                />
              );
            })}
            
            {/* Glowing Orbs / Energy Nodes */}
            {[...Array(6)].map((_, i) => {
              const orbColors = [
                { main: '#3B82F6', glow: 'rgba(59, 130, 246, 0.4)' },
                { main: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.4)' },
                { main: '#10B981', glow: 'rgba(16, 185, 129, 0.4)' },
                { main: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)' }
              ];
              const orb = orbColors[Math.floor(Math.random() * orbColors.length)];
              
              return (
                <div
                  key={`orb-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: '8px',
                    height: '8px',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: `radial-gradient(circle, ${orb.main}, transparent)`,
                    boxShadow: `0 0 20px ${orb.glow}, 0 0 40px ${orb.glow}, 0 0 60px ${orb.glow}`,
                    animation: `orbitFloat ${8 + Math.random() * 12}s ease-in-out infinite, pulseGlow ${2 + Math.random() * 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                />
              );
            })}
            
            {/* Hexagonal Grid Pattern */}
            {[...Array(12)].map((_, i) => (
              <div
                key={`hex-${i}`}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: '20px',
                  height: '20px',
                  border: '1px solid rgba(96, 165, 250, 0.15)',
                  transform: 'rotate(30deg)',
                  animation: `fadeInOut ${4 + Math.random() * 6}s ease-in-out infinite, drift ${10 + Math.random() * 15}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: 0
                }}
              />
            ))}

            {/* CSS Animations for Futuristic Effects */}
            <style>{`
              @keyframes pulse {
                0%, 100% { opacity: 0.6; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.3); }
              }
              
              @keyframes orbitFloat {
                0%, 100% { transform: translate(0, 0); }
                25% { transform: translate(30px, -20px); }
                50% { transform: translate(-20px, -40px); }
                75% { transform: translate(-30px, 20px); }
              }
              
              @keyframes pulseGlow {
                0%, 100% { filter: brightness(1); transform: scale(1); }
                50% { filter: brightness(1.5); transform: scale(1.2); }
              }
              
              @keyframes fadeInOut {
                0%, 100% { opacity: 0; }
                50% { opacity: 0.3; }
              }
              
              @keyframes drift {
                0% { transform: translateX(0) translateY(0) rotate(30deg); }
                100% { transform: translateX(-50px) translateY(50px) rotate(30deg); }
              }
            `}</style>
          </div>

          {/* CSS Animations */}
          <style>{`
            @keyframes rotateGlobe {
              0% { transform: perspective(1000px) rotateY(0deg); }
              100% { transform: perspective(1000px) rotateY(360deg); }
            }
            
            @keyframes float {
              0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
              50% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
            }
          `}</style>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Compact Hero Content */}
          <div className="mb-6">
            <h1 className="text-3xl lg:text-4xl mb-2 font-bold text-center">
              Book Cheap Flights to India
            </h1>
            <p className="text-base text-blue-200 text-center max-w-2xl mx-auto">
              Compare prices, find the best deals. <span className="text-[#FBBF24] font-semibold">Call for exclusive rates!</span>
            </p>
          </div>

          {/* Flight Search Form */}
          <div className="max-w-6xl mx-auto">
            <FlightSearchForm compact />
          </div>

          {/* Quick Info Below Search */}
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                <span>500K+ Travelers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span>4.9 Rating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Ticker - Minimal */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] py-2 overflow-hidden border-b border-blue-600">
        <div className="flex gap-8 animate-marquee whitespace-nowrap text-white text-xs font-medium">
          <span>NYC→Delhi: <strong className="text-[#FBBF24]">$649</strong></span>
          <span>•</span>
          <span>SFO→Mumbai: <strong className="text-[#FBBF24]">$699</strong></span>
          <span>•</span>
          <span>Chicago→Bangalore: <strong className="text-[#FBBF24]">$729</strong></span>
          <span>•</span>
          <span>LA→Chennai: <strong className="text-[#FBBF24]">$689</strong></span>
          <span>•</span>
          <span>Dallas→Hyderabad: <strong className="text-[#FBBF24]">$719</strong></span>
          <span>•</span>
          <span>NYC→Delhi: <strong className="text-[#FBBF24]">$649</strong></span>
        </div>
      </div>

      {/* Why Choose Us - Super Compact */}
      <section 
        ref={el => sectionRefs.current['features'] = el}
        data-section-id="features"
        className={`py-10 bg-white border-b border-gray-100 ${visibleSections.has('features') ? 'visible' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3 magnetic-card" data-animate="slideUp" data-delay="1">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-xl flex items-center justify-center flex-shrink-0 glow-pulse">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Phone-Only Deals</h3>
                <p className="text-xs text-gray-600">Unpublished fares not available online</p>
              </div>
            </div>

            <div className="flex items-start gap-3 magnetic-card" data-animate="slideUp" data-delay="2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center flex-shrink-0 glow-pulse">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Best Price Guarantee</h3>
                <p className="text-xs text-gray-600">We'll match + give you $50 off</p>
              </div>
            </div>

            <div className="flex items-start gap-3 magnetic-card" data-animate="slideUp" data-delay="3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] rounded-xl flex items-center justify-center flex-shrink-0 glow-pulse">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">24/7 Expert Support</h3>
                <p className="text-xs text-gray-600">Real agents ready to help anytime</p>
              </div>
            </div>

            <div className="flex items-start gap-3 magnetic-card" data-animate="slideUp" data-delay="4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center flex-shrink-0 glow-pulse">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Secure & Safe</h3>
                <p className="text-xs text-gray-600">Protected with encryption</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes - Compact */}
      <section 
        id="routes"
        ref={el => sectionRefs.current['routes'] = el}
        data-section-id="routes"
        className={`py-8 bg-gray-50 ${visibleSections.has('routes') ? 'visible' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Popular Routes</h2>
              <p className="text-xs text-gray-600 mt-0.5">Top destinations at unbeatable prices</p>
            </div>
            <button className="text-xs text-[#1E3A8A] font-semibold hover:text-[#FF6B35] transition-colors flex items-center gap-1">
              View All
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
            <RouteCard 
              fromCity="New York" 
              toCity="Delhi" 
              price="$649"
              destinationImage="https://images.unsplash.com/photo-1627738055439-fd6c5aaede8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxoaSUyMGluZGlhJTIwZ2F0ZSUyMG1vbnVtZW50fGVufDF8fHx8MTc3MTQyMTE3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
            />
            <RouteCard 
              fromCity="San Francisco" 
              toCity="Mumbai" 
              price="$699"
              destinationImage="https://images.unsplash.com/photo-1645207825163-4e231ee2d707?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdW1iYWklMjBpbmRpYSUyMHNreWxpbmV8ZW58MXx8fHwxNzcxNDQwNTAwfDA&ixlib=rb-4.1.0&q=80&w=1080"
            />
            <RouteCard 
              fromCity="Chicago" 
              toCity="Bangalore" 
              price="$729"
              destinationImage="https://images.unsplash.com/photo-1573330013103-79abb849927b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5nYWxvcmUlMjBpbmRpYSUyMGNpdHklMjBtb2Rlcm58ZW58MXx8fHwxNzcxNDQyMDU0fDA&ixlib=rb-4.1.0&q=80&w=1080"
            />
            <RouteCard 
              fromCity="Los Angeles" 
              toCity="Chennai" 
              price="$689"
              destinationImage="https://images.unsplash.com/photo-1694496496686-e34f705db8b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVubmFpJTIwaW5kaWElMjBiZWFjaCUyMG1hcmluYXxlbnwxfHx8fDE3NzE0NDIwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
            />
            <RouteCard 
              fromCity="Dallas" 
              toCity="Hyderabad" 
              price="$719"
              destinationImage="https://images.unsplash.com/photo-1706768530935-315546bd701a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoeWRlcmFiYWQlMjBpbmRpYSUyMGNoYXJtaW5hcnxlbnwxfHx8fDE3NzE0NDIwNTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            />
            <RouteCard 
              fromCity="Washington DC" 
              toCity="Ahmedabad" 
              price="$709"
              destinationImage="https://images.unsplash.com/photo-1713123162977-52e225e36fac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaG1lZGFiYWQlMjBpbmRpYSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzE0NDIwNTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            />
          </div>
        </div>
      </section>

      {/* Flash Deals - Compact & Eye-Friendly */}
      <section 
        id="deals"
        ref={el => sectionRefs.current['deals'] = el}
        data-section-id="deals"
        className={`py-8 bg-gradient-to-br from-slate-50 to-blue-50/30 ${visibleSections.has('deals') ? 'visible' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold mb-2">
                ⚡ FLASH SALE
              </div>
              <h2 className="text-xl font-bold text-gray-900">Today's Hot Deals</h2>
              <p className="text-xs text-gray-600 mt-0.5">Limited time offers - Book now!</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <CountdownDeal
              route="NYC → Delhi"
              price="$649"
              originalPrice="$1,099"
              initialMinutes={15}
            />
            <CountdownDeal
              route="SFO → Mumbai"
              price="$699"
              originalPrice="$1,149"
              initialMinutes={12}
            />
            <CountdownDeal
              route="Chicago → Bangalore"
              price="$729"
              originalPrice="$1,199"
              initialMinutes={18}
            />
          </div>
        </div>
      </section>

      {/* Gamification - Compact & Creative */}
      <section id="gamify" className="py-8 bg-gradient-to-br from-violet-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="inline-block bg-gradient-to-r from-violet-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold mb-2">
                🎁 BONUS OFFER
              </div>
              <h2 className="text-xl font-bold text-gray-900">Win Extra Savings</h2>
              <p className="text-xs text-gray-600 mt-0.5">Every caller wins up to $400 off</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <DiscountWheel />
            <LiveBookingFeed />
          </div>
        </div>
      </section>

      {/* Price Comparison - Compact & Creative */}
      <section id="compare" className="py-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Compare & Save Big</h2>
              <p className="text-xs text-gray-600 mt-0.5">See how much you save vs other sites</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">Avg. Savings</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">$487</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <PriceComparisonSlider
                route="NYC → Delhi"
                aviotixxPrice="$649"
                competitors={[
                  { competitor: "Expedia", price: "1,199" },
                  { competitor: "Kayak", price: "1,249" },
                  { competitor: "Google Flights", price: "1,179" },
                ]}
              />
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 shadow-lg text-white flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs opacity-90">Call for</p>
                  <p className="text-sm font-bold">Exclusive Deals</p>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-3xl font-bold mb-1">$487</p>
                <p className="text-xs text-emerald-100">Average savings per ticket</p>
              </div>

              <button
                onClick={handleCallNow}
                className="w-full bg-white text-emerald-600 py-2.5 rounded-lg hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-bold shadow-md"
              >
                <Phone className="w-4 h-4" />
                1-800-123-4567
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Compact */}
      <section 
        ref={el => sectionRefs.current['testimonials'] = el}
        data-section-id="testimonials"
        className={`py-8 bg-gradient-to-br from-blue-50/30 via-white to-orange-50/20 ${visibleSections.has('testimonials') ? 'visible' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Compact Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex -space-x-1">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">12,847+ Verified Bookings</h2>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★★★★★</span>
                <span className="font-semibold">4.9/5.0</span>
              </div>
              <span className="text-gray-300">•</span>
              <span>TrustPilot Excellence Award 2024</span>
            </div>
          </div>

          {/* Compact Testimonial Cards - Horizontal Layout */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1762341120638-b5b9358ef571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHdvbWFufGVufDF8fHx8MTc3MTQxMjM0NXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Priya Sharma"
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm text-gray-900">Priya Sharma</h3>
                    <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span className="text-[10px] font-semibold text-emerald-700">VERIFIED</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-400 text-xs">
                      {'★'.repeat(5)}
                    </div>
                    <span className="text-[10px] text-gray-500">New York, NY</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed mb-2">
                "Saved <span className="font-bold text-emerald-600">$427</span> on family tickets! The phone agent found deals I couldn't find anywhere else online."
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <span className="text-[10px] text-gray-400">NYC → Mumbai</span>
                <span className="text-gray-300">•</span>
                <span className="text-[10px] text-gray-400">Dec 2024</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1598268012815-ae21095df31b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG1hbnxlbnwxfHx8fDE3NzE0MjQzMDF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Rajesh Patel"
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm text-gray-900">Rajesh Patel</h3>
                    <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span className="text-[10px] font-semibold text-emerald-700">VERIFIED</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-400 text-xs">
                      {'★'.repeat(5)}
                    </div>
                    <span className="text-[10px] text-gray-500">San Francisco, CA</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed mb-2">
                "Got a direct flight to Mumbai for <span className="font-bold text-emerald-600">$699</span> when everyone else wanted $1,200+. Phone deals are real!"
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <span className="text-[10px] text-gray-400">SFO → Mumbai</span>
                <span className="text-gray-300">•</span>
                <span className="text-[10px] text-gray-400">Jan 2025</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1650113794972-56031832c0db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHRyYXZlbGVyJTIwYWlycG9ydHxlbnwxfHx8fDE3NzE0NDA1MDF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Sarah Johnson"
                  className="w-12 h-12 rounded-full object-cover border-2 border-orange-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm text-gray-900">Sarah Johnson</h3>
                    <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span className="text-[10px] font-semibold text-emerald-700">VERIFIED</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-400 text-xs">
                      {'★'.repeat(5)}
                    </div>
                    <span className="text-[10px] text-gray-500">Chicago, IL</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed mb-2">
                "Saved over <span className="font-bold text-emerald-600">$500</span> on business class. Agent helped me get better seats. Used them 3 times!"
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <span className="text-[10px] text-gray-400">ORD → Delhi</span>
                <span className="text-gray-300">•</span>
                <span className="text-[10px] text-gray-400">Repeat Customer</span>
              </div>
            </div>
          </div>

          {/* Trust Badges Row */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="font-semibold">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Award className="w-4 h-4 text-orange-600" />
              <span className="font-semibold">IATA Certified</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">BBB A+ Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Blog/Travel Tips - NEW SECTION */}
      <section 
        id="blog"
        ref={el => sectionRefs.current['blog'] = el}
        data-section-id="blog"
        className={`py-8 bg-white ${visibleSections.has('blog') ? 'visible' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Travel Tips & Guides</h2>
              <p className="text-xs text-gray-600 mt-0.5">Expert advice for your India journey</p>
            </div>
            <button className="text-xs text-[#1E3A8A] font-semibold hover:text-[#FF6B35] transition-colors flex items-center gap-1">
              View All Articles
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div data-animate="slideUp" data-delay="1">
              <BlogCard
                image="https://images.unsplash.com/photo-1748951447152-5a9992576e6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMHRhaiUyMG1haGFsJTIwdHJhdmVsfGVufDF8fHx8MTc3MTQ0NzQ0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                title="Best Time to Visit India"
                excerpt="Discover the ideal months to book your flight to India for perfect weather and festivals."
                readTime="5 min read"
              />
            </div>
            <div data-animate="slideUp" data-delay="2">
              <BlogCard
                image="https://images.unsplash.com/photo-1635247055412-6007edbd9af7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMGhvbGklMjBmZXN0aXZhbCUyMGNvbG9yZnVsfGVufDF8fHx8MTc3MTQ0NzQ0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                title="Top 10 Indian Festivals"
                excerpt="Plan your trip around these colorful celebrations for an unforgettable experience."
                readTime="7 min read"
              />
            </div>
            <div data-animate="slideUp" data-delay="3">
              <BlogCard
                image="https://images.unsplash.com/photo-1728364283053-b1e2abe71611?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmb29kJTIwc3RyZWV0JTIwbWFya2V0fGVufDF8fHx8MTc3MTQ0NzQ0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                title="Must-Try Indian Cuisines"
                excerpt="From street food to fine dining - a foodie's guide to culinary adventures in India."
                readTime="6 min read"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - Redesigned Modern & Compact */}
      <section 
        ref={el => sectionRefs.current['faq'] = el}
        data-section-id="faq"
        className={`py-6 bg-gradient-to-br from-slate-50 to-blue-50/20 ${visibleSections.has('faq') ? 'visible' : ''}`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <span>💬</span>
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Got Questions? We've Got Answers</h2>
            <p className="text-xs text-gray-600">Everything you need to know about booking with us</p>
          </div>

          <div className="space-y-2">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <FAQItem
                question="Why are phone prices cheaper?"
                answer="We have exclusive airline contracts giving us access to unpublished consolidator fares only available by phone. Our agents can bundle services and apply multiple discounts that online systems can't process."
              />
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <FAQItem
                question="Is it safe to book over the phone?"
                answer="Absolutely! We use secure payment processing and never store card details. We're BBB A+ accredited, IATA certified, and have 25+ years of trusted experience serving travelers."
              />
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <FAQItem
                question="How quickly can I book?"
                answer="Most calls take just 5-10 minutes! You'll receive your confirmation email immediately after booking, and our agents handle all the details for you."
              />
            </div>
          </div>

          {/* Still have questions CTA */}
          <div className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-center text-white">
            <p className="text-sm font-semibold mb-2">Still have questions? Talk to a travel expert!</p>
            <button
              onClick={handleCallNow}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-all inline-flex items-center gap-2 shadow-md"
            >
              <Phone className="w-4 h-4" />
              Call 1-800-123-4567
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA - Redesigned Premium */}
      <section 
        ref={el => sectionRefs.current['cta'] = el}
        data-section-id="cta"
        className={`relative py-12 bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#1E3A8A] text-white overflow-hidden ${visibleSections.has('cta') ? 'visible' : ''}`}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Exclusive Phone-Only Deals Available Now</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl lg:text-5xl font-bold mb-3 leading-tight" data-animate="slideUp">
              Ready to Save Big on<br />Your Flight to <span className="neon-glow text-yellow-300">India</span>?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join 12,847+ smart travelers who saved an average of <span className="text-yellow-300 font-bold">$487 per ticket</span> by calling us!
            </p>

            {/* CTA Button - Large & Premium */}
            <div className="mb-8" data-animate="scale">
              <button
                onClick={handleCallNow}
                className="group liquid-button bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white px-12 py-5 rounded-2xl hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-4 text-2xl font-bold shadow-xl hover:scale-105"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center parallax-fast">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-medium opacity-90">Call Now</div>
                  <div className="text-shimmer">1-800-123-4567</div>
                </div>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span>24/7 Expert Support</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                <span>4.9/5.0 Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Shield className="w-4 h-4 text-blue-300" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Award className="w-4 h-4 text-orange-300" />
                <span>IATA Certified</span>
              </div>
            </div>

            {/* Urgency Text */}
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-yellow-200">
              <Timer className="w-4 h-4" />
              <span>Limited phone-only deals expire soon - Call today!</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Redesigned Modern & Professional */}
      <footer className="bg-gradient-to-br from-[#0A1628] via-[#0F172A] to-[#1E293B] text-white">
        {/* Main Footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <img src={logo} alt="Aviotixx" className="h-9 mb-4 brightness-0 invert" />
              <p className="text-sm text-gray-400 leading-relaxed mb-4 max-w-sm">
                Your trusted partner for affordable flights to India since 2001. We specialize in finding exclusive phone-only deals that save you hundreds.
              </p>
              
              {/* Trust Badges */}
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold">SSL Secure</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-semibold">IATA</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-semibold">4.9/5</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li><a href="#search" className="hover:text-white transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" /> Search Flights
                </a></li>
                <li><a href="#deals" className="hover:text-white transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" /> Hot Deals
                </a></li>
                <li><a href="#routes" className="hover:text-white transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" /> Popular Routes
                </a></li>
                <li><a href="#blog" className="hover:text-white transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" /> Travel Guides
                </a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-bold mb-4 text-white">Support</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <Phone className="w-3 h-3" /> Contact Us
                </a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <Headphones className="w-3 h-3" /> FAQ
                </a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <Shield className="w-3 h-3" /> Privacy Policy
                </a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" /> Terms & Conditions
                </a></li>
              </ul>
            </div>

            {/* Call Us - Prominent */}
            <div>
              <h4 className="text-sm font-bold mb-4 text-white">Call Us Now</h4>
              <div className="bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-xl p-4 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-5 h-5" />
                  <span className="text-xs font-semibold">24/7 Support</span>
                </div>
                <button
                  onClick={handleCallNow}
                  className="w-full bg-white text-[#FF6B35] py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-300 font-bold text-base shadow-md mb-2"
                >
                  1-800-123-4567
                </button>
                <p className="text-xs opacity-90">Average wait time: 30 seconds</p>
              </div>
              
              {/* Social Icons */}
              <div className="flex items-center gap-2">
                <a href="#" className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors border border-white/10">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors border border-white/10">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors border border-white/10">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-400">
                &copy; 2026 Aviotixx. All rights reserved. 
                <span className="ml-2 text-gray-500">|</span>
                <span className="ml-2">Trusted since 2001</span>
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <span>•</span>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <span>•</span>
                <a href="#" className="hover:text-white transition-colors">Sitemap</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* REVOLUTIONARY ANIMATION SYSTEM - Never Seen Before */}
      <style>{`
        /* ===== MARQUEE ===== */
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        /* ===== MORPHING GRADIENT BACKGROUNDS ===== */
        @keyframes morphGradient {
          0%, 100% {
            background-position: 0% 50%;
            background-size: 200% 200%;
          }
          50% {
            background-position: 100% 50%;
            background-size: 250% 250%;
          }
        }

        /* ===== 3D CARD TILT EFFECT ===== */
        @keyframes cardFloat {
          0%, 100% { 
            transform: translateY(0px) rotateX(0deg);
          }
          50% { 
            transform: translateY(-10px) rotateX(2deg);
          }
        }

        /* ===== REVEAL ANIMATIONS ===== */
        @keyframes slideUpFade {
          0% {
            opacity: 0;
            transform: translateY(60px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideLeftFade {
          0% {
            opacity: 0;
            transform: translateX(-60px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideRightFade {
          0% {
            opacity: 0;
            transform: translateX(60px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes rotateIn {
          0% {
            opacity: 0;
            transform: rotate(-10deg) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
        }

        /* ===== STAGGER ANIMATIONS ===== */
        [data-animate="slideUp"] {
          animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        [data-animate="slideLeft"] {
          animation: slideLeftFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        [data-animate="slideRight"] {
          animation: slideRightFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        [data-animate="scale"] {
          animation: scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        [data-animate="rotate"] {
          animation: rotateIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        /* Stagger delays */
        [data-delay="1"] { animation-delay: 0.1s; }
        [data-delay="2"] { animation-delay: 0.2s; }
        [data-delay="3"] { animation-delay: 0.3s; }
        [data-delay="4"] { animation-delay: 0.4s; }
        [data-delay="5"] { animation-delay: 0.5s; }
        [data-delay="6"] { animation-delay: 0.6s; }

        /* ===== MAGNETIC HOVER EFFECTS ===== */
        .magnetic-card {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
          transform-style: preserve-3d;
        }

        .magnetic-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        /* ===== GLOW EFFECTS ===== */
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.3);
          }
        }

        .glow-pulse {
          animation: pulseGlow 3s ease-in-out infinite;
        }

        /* ===== PARTICLE BURST ===== */
        @keyframes particleBurst {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0);
          }
        }

        /* ===== TEXT SHIMMER ===== */
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .text-shimmer {
          background: linear-gradient(
            90deg,
            currentColor 40%,
            rgba(255, 255, 255, 0.8) 50%,
            currentColor 60%
          );
          background-size: 1000px 100%;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer 3s infinite linear;
        }

        /* ===== BLOB MORPHING ===== */
        @keyframes morphBlob {
          0%, 100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          }
        }

        .morph-blob {
          animation: morphBlob 10s ease-in-out infinite;
        }

        /* ===== GLASSMORPHISM WITH DEPTH ===== */
        .glass-deep {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        /* ===== PARALLAX LAYERS ===== */
        @keyframes parallaxFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .parallax-slow {
          animation: parallaxFloat 6s ease-in-out infinite;
        }

        .parallax-medium {
          animation: parallaxFloat 4s ease-in-out infinite;
        }

        .parallax-fast {
          animation: parallaxFloat 2s ease-in-out infinite;
        }

        /* ===== RIPPLE EFFECT ===== */
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        /* ===== LIQUID BUTTON ===== */
        .liquid-button {
          position: relative;
          overflow: hidden;
        }

        .liquid-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .liquid-button:hover::before {
          width: 300px;
          height: 300px;
        }

        /* ===== PERSPECTIVE CARD FLIP ===== */
        .card-3d {
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        .card-3d:hover {
          transform: rotateY(5deg) rotateX(5deg);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ===== NEON GLOW TEXT ===== */
        .neon-glow {
          text-shadow: 
            0 0 10px currentColor,
            0 0 20px currentColor,
            0 0 40px currentColor,
            0 0 80px currentColor;
          animation: neonPulse 2s ease-in-out infinite alternate;
        }

        @keyframes neonPulse {
          0% { opacity: 0.8; }
          100% { opacity: 1; }
        }

        /* ===== SCROLL PROGRESS INDICATOR ===== */
        @keyframes progressBar {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }

        /* ===== HOLOGRAPHIC EFFECT ===== */
        @keyframes holographic {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .holographic {
          background: linear-gradient(
            45deg,
            #ff6b6b,
            #4ecdc4,
            #45b7d1,
            #96ceb4,
            #ffeaa7,
            #fd79a8
          );
          background-size: 400% 400%;
          animation: holographic 10s ease infinite;
        }

        /* ===== TYPING EFFECT ===== */
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }

        @keyframes blink {
          50% { border-color: transparent; }
        }

        /* ===== BOUNCE IN ===== */
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(100px);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* ===== ELASTIC SCALE ===== */
        @keyframes elasticScale {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        /* ===== WAVE ANIMATION ===== */
        @keyframes wave {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .wave-effect {
          position: relative;
          overflow: hidden;
        }

        .wave-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: wave 2s infinite;
        }

        /* ===== APPLY ANIMATIONS TO SECTIONS ===== */
        section[data-section-id] {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        section[data-section-id].visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ===== MAGNETIC MOUSE FOLLOW ===== */
        .magnetic {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ===== SMOOTH SCROLL ===== */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}