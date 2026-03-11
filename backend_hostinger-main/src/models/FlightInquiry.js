import mongoose from 'mongoose';

// Passenger Schema for detailed passenger information
const passengerSchema = new mongoose.Schema({
  id: Number,
  title: String,
  firstName: { type: String, required: true },
  middleName: String,
  lastName: { type: String, required: true },
  gender: { 
    type: String, 
    enum: ['Male', 'Female'], 
    required: true 
  },
  dateOfBirth: {
    day: { type: String, required: true },
    month: { type: String, required: true },
    year: { type: String, required: true }
  },
  passportNumber: String,
  redressNumber: String,
  mealPreference: String,
  seatPreference: String,
  // Extended fields from dropdown
  frequentFlyerNumber: String,
  wheelchairAssistance: { type: Boolean, default: false },
  specialMeals: String,
  seatType: String,
  additionalServices: [String]
}, { _id: false });

// Contact Information Schema
const contactInfoSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  countryCode: { type: String, default: '+1' }
}, { _id: false });

// Payment Information Schema (encrypted/secure handling recommended)
const paymentInfoSchema = new mongoose.Schema({
  cardNumber: String, // Should be encrypted
  cardHolderName: String,
  expiryDate: String,
  cvv: String, // Should be encrypted
  billingPhone: String,
  billingAddress: String,
  postalCode: String,
  country: String,
  state: String,
  city: String
}, { _id: false });

const flightInquirySchema = new mongoose.Schema(
  {
    // Unique inquiry ID for tracking
    inquiryId: {
      type: String,
      unique: true,
      default: function() {
        return `INQ${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      }
    },

    // Search Details
    tripType: {
      type: Number,
      enum: [0, 1, 2], // 0: OneWay, 1: RoundTrip, 2: MultiCity
      required: true,
    },
    origin: {
      type: String,
      required: true,
      uppercase: true,
    },
    destination: {
      type: String,
      required: true,
      uppercase: true,
    },
    departDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    adults: {
      type: Number,
      min: 1,
      max: 9,
      default: 1,
    },
    children: {
      type: Number,
      min: 0,
      max: 9,
      default: 0,
    },
    infants: {
      type: Number,
      min: 0,
      max: 2,
      default: 0,
    },
    cabin: {
      type: Number,
      enum: [0, 1, 2, 4], // 0: Economy, 1: First, 2: Business, 4: PremiumEconomy
      default: 0,
    },

    // Detailed Passenger Information
    passengers: [passengerSchema],
    
    // Contact Information
    contactInfo: contactInfoSchema,
    
    // Payment Information (optional, for inquiries that include payment details)
    paymentInfo: paymentInfoSchema,

    // Legacy fields for backward compatibility
    passengerName: {
      type: String,
      required: true,
    },
    passengerEmail: {
      type: String,
      required: true,
    },
    passengerPhone: {
      type: String,
      required: true,
    },

    // Flight Results
    journeyId: {
      type: String,
    },
    segmentId: {
      type: String,
    },
    selectedFlight: {
      airlineName: String,
      departureTime: Date,
      arrivalTime: Date,
      flightNumber: String,
      price: Number,
      details: {},
    },

    // Inquiry Status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'under-review', 'contacted', 'booked', 'cancelled', 'expired'],
      default: 'pending',
    },

    // Priority level
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    },

    // Broker/Admin Management
    brokerNotes: {
      type: String,
    },
    brokerAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
    },
    followUpDate: {
      type: Date,
    },

    // Communication History
    communications: [{
      type: { 
        type: String, 
        enum: ['email', 'phone', 'sms', 'note'], 
        required: true 
      },
      message: String,
      timestamp: { type: Date, default: Date.now },
      adminUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminUser'
      }
    }],

    // Additional Info
    traceId: {
      type: String,
    },
    source: {
      type: String,
      enum: ['website', 'phone', 'email', 'api'],
      default: 'website'
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
flightInquirySchema.index({ inquiryId: 1 });
flightInquirySchema.index({ status: 1, createdAt: -1 });
flightInquirySchema.index({ passengerEmail: 1 });
flightInquirySchema.index({ brokerAssigned: 1 });
flightInquirySchema.index({ origin: 1, destination: 1 });
flightInquirySchema.index({ departDate: 1 });
flightInquirySchema.index({ priority: 1, status: 1 });

// Virtual for total passengers
flightInquirySchema.virtual('totalPassengers').get(function() {
  return this.adults + this.children + this.infants;
});

// Virtual for cabin type display
flightInquirySchema.virtual('cabinDisplay').get(function() {
  const cabinTypes = ['Economy', 'First', 'Business', '', 'Premium Economy'];
  return cabinTypes[this.cabin] || 'Economy';
});

// Virtual for trip type display
flightInquirySchema.virtual('tripTypeDisplay').get(function() {
  const tripTypes = ['One Way', 'Round Trip', 'Multi City'];
  return tripTypes[this.tripType] || 'One Way';
});

export const FlightInquiry = mongoose.model('FlightInquiry', flightInquirySchema);
