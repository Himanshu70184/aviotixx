// Flight Inquiry Page - Professional inquiry form with dynamic passenger fields
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Plane, 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  CreditCard, 
  ChevronDown, 
  ChevronUp,
  MapPin,
  Clock,
  Star,
  Info
} from 'lucide-react';
import { FlightResult } from '../services/travelportApi';
import { getAirlineLogo } from '../utils/airlineLogos';

import { getAirportCity, getAirportName } from '../data/airports';
import { API_CONFIG } from '../config/api';

interface PassengerInfo {
  id: number;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  passportNumber: string;
  redressNumber: string;
  mealPreference: string;
  seatPreference: string;
  // Expandable fields
  frequentFlyerNumber: string;
  wheelchairAssistance: boolean;
  specialMeals: string;
  seatType: string;
  additionalServices: string[];
}

interface ContactInfo {
  email: string;
  phoneNumber: string;
  countryCode: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
  billingPhone: string;
  billingAddress: string;
  postalCode: string;
  country: string;
  state: string;
  city: string;
}

export function InquiryPage() {
  const navigate = useNavigate();
  const [flightData, setFlightData] = useState<FlightResult | null>(null);
  const [passengers, setPassengers] = useState<PassengerInfo[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phoneNumber: '',
    countryCode: '+1'
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
    billingPhone: '',
    billingAddress: '',
    postalCode: '',
    country: '',
    state: '',
    city: ''
  });
  const [expandedPassengers, setExpandedPassengers] = useState<{[key: number]: boolean}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Get flight data from sessionStorage
    const storedData = sessionStorage.getItem('inquiryFlightData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setFlightData(data.flight);
      
      // Get passenger counts from URL params or stored data or defaults
      const urlParams = new URLSearchParams(window.location.search);
      const passengerCounts = {
        adults: parseInt(urlParams.get('adults') || data.adults || '1'),
        children: parseInt(urlParams.get('children') || data.children || '0'),
        infants: parseInt(urlParams.get('infants') || data.infants || '0')
      };
      
      const totalPax = passengerCounts.adults + passengerCounts.children + passengerCounts.infants;
      
      const initialPassengers: PassengerInfo[] = [];
      
      // Create passengers for adults
      for (let i = 0; i < passengerCounts.adults; i++) {
        initialPassengers.push({
          id: i + 1,
          title: '',
          firstName: '',
          middleName: '',
          lastName: '',
          gender: 'Male',
          dateOfBirth: { day: '', month: '', year: '' },
          passportNumber: '',
          redressNumber: '',
          mealPreference: '',
          seatPreference: '',
          frequentFlyerNumber: '',
          wheelchairAssistance: false,
          specialMeals: '',
          seatType: '',
          additionalServices: []
        });
      }
      
      // Create passengers for children
      for (let i = 0; i < passengerCounts.children; i++) {
        initialPassengers.push({
          id: passengerCounts.adults + i + 1,
          title: '',
          firstName: '',
          middleName: '',
          lastName: '',
          gender: 'Male',
          dateOfBirth: { day: '', month: '', year: '' },
          passportNumber: '',
          redressNumber: '',
          mealPreference: '',
          seatPreference: '',
          frequentFlyerNumber: '',
          wheelchairAssistance: false,
          specialMeals: '',
          seatType: '',
          additionalServices: []
        });
      }
      
      // Create passengers for infants
      for (let i = 0; i < passengerCounts.infants; i++) {
        initialPassengers.push({
          id: passengerCounts.adults + passengerCounts.children + i + 1,
          title: '',
          firstName: '',
          middleName: '',
          lastName: '',
          gender: 'Male',
          dateOfBirth: { day: '', month: '', year: '' },
          passportNumber: '',
          redressNumber: '',
          mealPreference: '',
          seatPreference: '',
          frequentFlyerNumber: '',
          wheelchairAssistance: false,
          specialMeals: '',
          seatType: '',
          additionalServices: []
        });
      }
      
      setPassengers(initialPassengers);
    } else {
      // No flight data, redirect back
      navigate('/search-results');
    }
  }, [navigate]);

  const togglePassengerExpansion = (passengerId: number) => {
    setExpandedPassengers(prev => ({
      ...prev,
      [passengerId]: !prev[passengerId]
    }));
  };

  const updatePassenger = (id: number, field: keyof PassengerInfo, value: any) => {
    setPassengers(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const updateContactInfo = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const updatePaymentInfo = (field: keyof PaymentInfo, value: string) => {
    let formattedValue = value;
    
    // Format card number with spaces
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    }
    
    // Format expiry date with slash
    if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{1,2})/, '$1/$2');
    }
    
    // Limit CVV to numbers only
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
    }
    
    setPaymentInfo(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get stored search data for tripType and other details
      const storedData = sessionStorage.getItem('inquiryFlightData');
      const searchData = storedData ? JSON.parse(storedData) : {};
      
      // Get passenger counts from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const passengerCounts = {
        adults: parseInt(urlParams.get('adults') || searchData.adults || '1'),
        children: parseInt(urlParams.get('children') || searchData.children || '0'),
        infants: parseInt(urlParams.get('infants') || searchData.infants || '0')
      };
      
      // Prepare inquiry data for backend
      const inquiryData = {
        // Flight details
        tripType: searchData.tripType || 0,
        origin: flightData?.outbound[0]?.departure.airport || '',
        destination: flightData?.outbound[flightData?.outbound.length - 1]?.arrival.airport || '',
        departDate: flightData?.outbound[0]?.departure.date || '',
        returnDate: flightData?.inbound?.[0]?.departure.date || null,
        adults: passengerCounts.adults,
        children: passengerCounts.children,
        infants: passengerCounts.infants,
        cabin: 0, // Economy default

        // Passenger details (required by backend)
        passengers: passengers,
        contactInfo: {
          email: contactInfo.email,
          phoneNumber: contactInfo.phoneNumber,
          countryCode: contactInfo.countryCode
        },
        paymentInfo: paymentInfo,

        // Legacy fields for backward compatibility
        passengerName: `${passengers[0]?.firstName || 'Unknown'} ${passengers[0]?.lastName || 'Passenger'}`,
        passengerEmail: contactInfo.email,
        passengerPhone: contactInfo.phoneNumber,

        // Flight selection
        selectedFlight: {
          airlineName: getAirlineLogo(flightData?.airline || '').name,
          flightNumber: flightData?.outbound[0]?.flightNumber || '',
          price: flightData?.price || 0,
          duration: flightData?.totalDuration || '',
          stops: flightData?.stops || 0,
          cabinClass: flightData?.cabinClass || 'Economy'
        },

        // Status and additional fields
        status: 'pending',
        source: 'website'
      };

      // Submit to backend
      const backendUrl = API_CONFIG.baseUrl;
      const response = await fetch(`${backendUrl}/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Inquiry submitted successfully:', result);
        // Clear sessionStorage
        sessionStorage.removeItem('inquiryFlightData');
        // Redirect to success page or show success message
        alert('Inquiry submitted successfully! We will contact you soon.');
        navigate('/');
      } else {
        // Get error details from response
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Submission failed:', response.status, errorData);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('Inquiry submission error:', error);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!flightData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Loading flight details...</h2>
          <p className="text-gray-600">Please wait while we prepare your inquiry form</p>
        </div>
      </div>
    );
  }

  const airlineInfo = getAirlineLogo(flightData.airline);
  const originCode = flightData.outbound[0]?.departure.airport || '';
  const destCode = flightData.outbound[flightData.outbound.length - 1]?.arrival.airport || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Search Results
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Flight Inquiry</h1>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Aviotix" className="h-8" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <span className="text-lg font-bold text-[#1E3A8A]">AVIOTIX</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Flight Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Selected Flight
              </h3>

              {/* Flight Details Card */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border">
                    <img 
                      src={airlineInfo.logoUrl} 
                      alt={airlineInfo.name}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<svg class="w-6 h-6 text-[#1E3A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"></path></svg>';
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{airlineInfo.name}</h4>
                    <p className="text-sm text-gray-600">{flightData.cabinClass}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold text-gray-900">
                        {flightData.outbound[0]?.departure.time}
                      </div>
                      <div className="text-sm font-semibold text-gray-700">{originCode}</div>
                      <div className="text-xs text-gray-500">{getAirportCity(originCode)}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {flightData.totalDuration}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {flightData.stops === 0 ? 'Nonstop' : `${flightData.stops} Stop${flightData.stops > 1 ? 's' : ''}`}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        {flightData.outbound[flightData.outbound.length - 1]?.arrival.time}
                      </div>
                      <div className="text-sm font-semibold text-gray-700">{destCode}</div>
                      <div className="text-xs text-gray-500">{getAirportCity(destCode)}</div>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Total Price</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-700">
                        ${flightData.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">Tax included</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Inquiry Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Passenger Information */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-6 h-6 text-[#1E3A8A]" />
                  <h2 className="text-xl font-bold text-gray-900">Passenger Information</h2>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      Passenger names must match passport for international travel or government-issued photo ID for US domestic travel.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {passengers.map((passenger, index) => {
                    // Determine passenger type based on index and counts from URL
                    const urlParams = new URLSearchParams(window.location.search);
                    const adults = parseInt(urlParams.get('adults') || '1');
                    const children = parseInt(urlParams.get('children') || '0');
                    
                    let passengerType = 'Adult';
                    if (index >= adults && index < adults + children) {
                      passengerType = 'Child';
                    } else if (index >= adults + children) {
                      passengerType = 'Infant';
                    }
                    
                    return (
                    <div key={passenger.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-gray-900">
                            Passenger {passenger.id}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            passengerType === 'Adult' ? 'bg-blue-100 text-blue-800' :
                            passengerType === 'Child' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {passengerType}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => togglePassengerExpansion(passenger.id)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <span className="text-sm font-semibold">Frequent flyer number, seat, meal and more</span>
                          {expandedPassengers[passenger.id] ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                          }
                        </button>
                      </div>

                      {/* Gender Selection */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`gender-${passenger.id}`}
                            value="Male"
                            checked={passenger.gender === 'Male'}
                            onChange={(e) => updatePassenger(passenger.id, 'gender', e.target.value as 'Male' | 'Female')}
                            className="text-blue-600"
                          />
                          <span>Male</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`gender-${passenger.id}`}
                            value="Female"
                            checked={passenger.gender === 'Female'}
                            onChange={(e) => updatePassenger(passenger.id, 'gender', e.target.value as 'Male' | 'Female')}
                            className="text-blue-600"
                          />
                          <span>Female</span>
                        </label>
                      </div>

                      {/* Name Fields */}
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                          <input
                            type="text"
                            value={passenger.firstName}
                            onChange={(e) => updatePassenger(passenger.id, 'firstName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                            placeholder="First Name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                          <input
                            type="text"
                            value={passenger.middleName}
                            onChange={(e) => updatePassenger(passenger.id, 'middleName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                            placeholder="Middle Name (Optional)"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            value={passenger.lastName}
                            onChange={(e) => updatePassenger(passenger.id, 'lastName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                            placeholder="Last Name"
                            required
                          />
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <div className="grid grid-cols-3 gap-2">
                          <select
                            value={passenger.dateOfBirth.month}
                            onChange={(e) => updatePassenger(passenger.id, 'dateOfBirth', { ...passenger.dateOfBirth, month: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                            required
                          >
                            <option value="">Month</option>
                            {Array.from({ length: 12 }, (_, i) => {
                              const month = i + 1;
                              return <option key={month} value={month.toString().padStart(2, '0')}>{month.toString().padStart(2, '0')}</option>;
                            })}
                          </select>
                          <select
                            value={passenger.dateOfBirth.day}
                            onChange={(e) => updatePassenger(passenger.id, 'dateOfBirth', { ...passenger.dateOfBirth, day: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                            required
                          >
                            <option value="">Day</option>
                            {Array.from({ length: 31 }, (_, i) => {
                              const day = i + 1;
                              return <option key={day} value={day.toString().padStart(2, '0')}>{day.toString().padStart(2, '0')}</option>;
                            })}
                          </select>
                          <select
                            value={passenger.dateOfBirth.year}
                            onChange={(e) => updatePassenger(passenger.id, 'dateOfBirth', { ...passenger.dateOfBirth, year: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                            required
                          >
                            <option value="">Year</option>
                            {Array.from({ length: 100 }, (_, i) => {
                              const year = new Date().getFullYear() - i;
                              return <option key={year} value={year}>{year}</option>;
                            })}
                          </select>
                        </div>
                      </div>

                      {/* Expanded Fields */}
                      {expandedPassengers[passenger.id] && (
                        <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                          {/* Passport and Redress */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                              <input
                                type="text"
                                value={passenger.passportNumber}
                                onChange={(e) => updatePassenger(passenger.id, 'passportNumber', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                                placeholder="Passport Number"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Redress Number</label>
                              <input
                                type="text"
                                value={passenger.redressNumber}
                                onChange={(e) => updatePassenger(passenger.id, 'redressNumber', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                                placeholder="Redress Number"
                              />
                            </div>
                          </div>

                          {/* Meal and Seat Preferences */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Meal Preference (As per availability)</label>
                              <select
                                value={passenger.mealPreference}
                                onChange={(e) => updatePassenger(passenger.id, 'mealPreference', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                              >
                                <option value="">Select Meals</option>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="non-vegetarian">Non-Vegetarian</option>
                                <option value="vegan">Vegan</option>
                                <option value="halal">Halal</option>
                                <option value="kosher">Kosher</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Seat Preference (As per availability)</label>
                              <select
                                value={passenger.seatPreference}
                                onChange={(e) => updatePassenger(passenger.id, 'seatPreference', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                              >
                                <option value="">Select Seats</option>
                                <option value="window">Window</option>
                                <option value="aisle">Aisle</option>
                                <option value="middle">Middle</option>
                              </select>
                            </div>
                          </div>

                          {/* Disclaimer */}
                          <div className="mt-4 text-xs text-gray-600">
                            <strong>Disclaimer:</strong> Meal and seat preferences are subject to availability and not guaranteed by the airline.
                          </div>
                        </div>
                      )}
                    </div>
                  );
                  })}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                  <Mail className="w-6 h-6 text-[#1E3A8A]" />
                  <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => updateContactInfo('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                      placeholder="your-email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="flex">
                      <select
                        value={contactInfo.countryCode}
                        onChange={(e) => updateContactInfo('countryCode', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                      >
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+33">🇫🇷 +33</option>
                        <option value="+49">🇩🇪 +49</option>
                      </select>
                      <input
                        type="tel"
                        value={contactInfo.phoneNumber}
                        onChange={(e) => updateContactInfo('phoneNumber', e.target.value)}
                        className="flex-1 px-3 py-2 border-l-0 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-6 h-6 text-[#1E3A8A]" />
                  <h2 className="text-xl font-bold text-gray-900">Payment Information</h2>
                </div>

                <div className="space-y-6">
                  {/* Card Details */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Card Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => updatePaymentInfo('cardNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                        <input
                          type="text"
                          value={paymentInfo.cardHolderName}
                          onChange={(e) => updatePaymentInfo('cardHolderName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                          placeholder="Name on Card"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                        <input
                          type="text"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => updatePaymentInfo('expiryDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV Code</label>
                        <input
                          type="text"
                          value={paymentInfo.cvv}
                          onChange={(e) => updatePaymentInfo('cvv', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                          placeholder="CVV Code"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Billing Details */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={paymentInfo.billingPhone}
                          onChange={(e) => updatePaymentInfo('billingPhone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          value={paymentInfo.billingAddress}
                          onChange={(e) => updatePaymentInfo('billingAddress', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                          placeholder="Address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal/Zip Code</label>
                        <input
                          type="text"
                          value={paymentInfo.postalCode}
                          onChange={(e) => updatePaymentInfo('postalCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                          placeholder="Postal/Zip Code"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <select
                          value={paymentInfo.country}
                          onChange={(e) => updatePaymentInfo('country', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                        >
                          <option value="">Select Country</option>
                          <option value="US">United States</option>
                          <option value="IN">India</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                          <option value="JP">Japan</option>
                          <option value="CN">China</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                        <input
                          type="text"
                          value={paymentInfo.state}
                          onChange={(e) => updatePaymentInfo('state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                          placeholder="State/Province"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City/Town</label>
                        <input
                          type="text"
                          value={paymentInfo.city}
                          onChange={(e) => updatePaymentInfo('city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                          placeholder="City/Town"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Review Policy */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      Review Policy
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>• Review your trip details to make sure the dates and times are correct</p>
                      <p>• Check spellings: Flight passenger names must exactly match government-issued photo ID</p>
                      <p>• Names changes are not permitted once tickets are issued. Tickets are non-transferable and non-refundable</p>
                      <p>• Total fares include all taxes and fees, except additional airline fees such as baggage & seat assignment may apply</p>
                      <p>• Your credit card may be billed in multiple charges totaling the above amount</p>
                      <p>• All other booking Rules & Restrictions - <a href="#" className="text-blue-600 hover:underline">Read More</a></p>
                    </div>
                    <div className="mt-4 space-y-2">
                      <label className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1 text-blue-600" required />
                        <span className="text-sm">
                          By selecting <strong>Authorize & Complete Booking</strong> I acknowledge that I have read and accept the above.{' '}
                          <a href="#" className="text-blue-600 hover:underline">Booking Rules & Restrictions</a>,{' '}
                          <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a> and{' '}
                          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> and I authorize the charges to my credit card
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-green-600" />
                      Price Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Fare</span>
                        <span className="font-bold text-lg text-gray-900">
                          ${flightData?.price?.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex items-center gap-2 text-green-600">
                          <span className="text-sm">✓ Free Cancellation</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          All prices are in Indian Rupees (INR) and include all taxes and fees. Some airlines may charge baggage & seat assignment.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Your credit card may be billed in multiple charges totaling the above amount.
                        </p>
                      </div>
                    </div>

                    {/* Marketing Consent */}
                    <div className="mt-4 space-y-2 pt-3 border-t border-gray-200">
                      <label className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1 text-blue-600" />
                        <span className="text-xs text-gray-600">
                          By Clicking here, you agree to receive your travel updates & future deals via WhatsApp/Email
                        </span>
                      </label>
                      <label className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1 text-blue-600" />
                        <span className="text-xs text-gray-600">
                          By Clicking here, you agree to receive your travel updates & future deals via SMS
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#0EA5E9] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting Inquiry...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Plane className="w-6 h-6" />
                      Submit Flight Inquiry
                    </div>
                  )}
                </button>
                
                <p className="text-center text-sm text-gray-600 mt-4">
                  By submitting this inquiry, you agree to our terms of service and privacy policy.
                  Our travel experts will contact you within 24 hours.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}