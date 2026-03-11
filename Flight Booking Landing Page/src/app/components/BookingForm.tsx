// Flight Booking Form Component - Based on Aviotix design
import { useState, useRef, useEffect } from 'react';
import { X, User, Mail, Phone, Calendar, Users, Plane } from 'lucide-react';
import { FlightResult } from '../services/travelportApi';
import { getAirlineLogo } from '../utils/airlineLogos';
import { getAirportCity } from '../data/airports';

interface BookingFormProps {
  flight: FlightResult;
  isOpen: boolean;
  onClose: () => void;
  passengerCounts: { adults: number; children: number; infants: number };
}

interface PassengerInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  frequentFlyerNumber?: string;
}

interface ContactInfo {
  email: string;
  phoneNumber: string;
}

export function BookingForm({ flight, isOpen, onClose, passengerCounts }: BookingFormProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phoneNumber: ''
  });
  
  const [passengers, setPassengers] = useState<PassengerInfo[]>([]);
  
  // Initialize passengers array based on counts
  useEffect(() => {
    const totalPassengers = passengerCounts.adults + passengerCounts.children + passengerCounts.infants;
    const newPassengers: PassengerInfo[] = [];
    
    // Add adults
    for (let i = 0; i < passengerCounts.adults; i++) {
      newPassengers.push({
        firstName: '',
        middleName: '',
        lastName: '',
        gender: 'Male',
        dateOfBirth: { day: '', month: '', year: '' }
      });
    }
    
    // Add children  
    for (let i = 0; i < passengerCounts.children; i++) {
      newPassengers.push({
        firstName: '',
        middleName: '',
        lastName: '',
        gender: 'Male',
        dateOfBirth: { day: '', month: '', year: '' }
      });
    }
    
    // Add infants
    for (let i = 0; i < passengerCounts.infants; i++) {
      newPassengers.push({
        firstName: '',
        middleName: '',
        lastName: '',
        gender: 'Male', 
        dateOfBirth: { day: '', month: '', year: '' }
      });
    }
    
    setPassengers(newPassengers);
  }, [passengerCounts]);

  const updatePassenger = (index: number, field: keyof PassengerInfo | 'dateOfBirth', value: any) => {
    setPassengers(prev => {
      const updated = [...prev];
      if (field === 'dateOfBirth') {
        updated[index] = { ...updated[index], dateOfBirth: { ...updated[index].dateOfBirth, ...value } };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submission:', { flight, contactInfo, passengers });
    // Here you would typically send the data to your booking API
    alert('Booking request submitted! We will contact you shortly to confirm your reservation.');
    onClose();
  };

  const getPassengerType = (index: number): string => {
    if (index < passengerCounts.adults) return 'Adult';
    if (index < passengerCounts.adults + passengerCounts.children) return 'Child';
    return 'Infant';
  };

  const getPassengerNumber = (index: number): number => {
    if (index < passengerCounts.adults) return index + 1;
    if (index < passengerCounts.adults + passengerCounts.children) {
      return index - passengerCounts.adults + 1;
    }
    return index - passengerCounts.adults - passengerCounts.children + 1;
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const airlineInfo = getAirlineLogo(flight.airline);
  const firstLeg = flight.outbound[0];
  const lastLeg = flight.outbound[flight.outbound.length - 1];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#0EA5E9] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <Plane className="w-6 h-6" />
            <h2 className="text-xl font-bold">Book Your Flight</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Flight Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Plane className="w-4 h-4 text-[#1E3A8A]" />
              Review Your Flight
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={airlineInfo.logoUrl} alt={airlineInfo.name} className="w-8 h-8" />
                <div className="text-sm">
                  <span className="font-semibold">{firstLeg.departure.airport} - {lastLeg.arrival.airport}</span>
                  <p className="text-gray-600">{firstLeg.departure.time} → {lastLeg.arrival.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#1E3A8A]">${flight.price.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Fare</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="border border-gray-200 rounded-xl p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#1E3A8A]" />
              Contact Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john.smith@gmail.com"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={contactInfo.phoneNumber}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+1 - Enter phone number"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Passenger Info */}
          <div className="border border-gray-200 rounded-xl p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#1E3A8A]" />
              Passenger Info
            </h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-700">
              Passenger names must match passport for international travel or government-issued photo ID for US domestic travel.
            </div>

            <div className="space-y-6">
              {passengers.map((passenger, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-3">
                    Passenger {getPassengerType(index)} #{getPassengerNumber(index)}
                  </h4>
                  
                  {/* Gender Selection */}
                  <div className="mb-4">
                    <div className="flex gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`gender-${index}`}
                          value="Male"
                          checked={passenger.gender === 'Male'}
                          onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                          className="text-[#1E3A8A] focus:ring-[#1E3A8A]"
                        />
                        <span className="text-sm font-medium">Male</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`gender-${index}`}
                          value="Female"
                          checked={passenger.gender === 'Female'}
                          onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                          className="text-[#1E3A8A] focus:ring-[#1E3A8A]"
                        />
                        <span className="text-sm font-medium">Female</span>
                      </label>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={passenger.firstName}
                        onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                        placeholder="First Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                      <input
                        type="text"
                        value={passenger.middleName}
                        onChange={(e) => updatePassenger(index, 'middleName', e.target.value)}
                        placeholder="Middle Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={passenger.lastName}
                        onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                        placeholder="Last Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <div className="grid grid-cols-3 gap-3">
                      <select
                        value={passenger.dateOfBirth.month}
                        onChange={(e) => updatePassenger(index, 'dateOfBirth', { month: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                        required
                      >
                        <option value="">Month</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en', { month: 'long' })}</option>
                        ))}
                      </select>
                      <select
                        value={passenger.dateOfBirth.day}
                        onChange={(e) => updatePassenger(index, 'dateOfBirth', { day: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                        required
                      >
                        <option value="">Day</option>
                        {Array.from({ length: 31 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                      <select
                        value={passenger.dateOfBirth.year}
                        onChange={(e) => updatePassenger(index, 'dateOfBirth', { year: e.target.value })}
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

                  {/* Frequent Flyer Number */}
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequent flyer number, seat, meal and more
                    </label>
                    <input
                      type="text"
                      value={passenger.frequentFlyerNumber || ''}
                      onChange={(e) => updatePassenger(index, 'frequentFlyerNumber', e.target.value)}
                      placeholder="Frequent flyer number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white px-6 py-3 rounded-lg font-bold hover:shadow-xl transition-all"
            >
              Book Flight
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}