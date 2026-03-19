import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Loader2, CreditCard, User, Phone, Mail, MapPin, Calendar, Clock } from 'lucide-react';
import { getInquiryDetails, updateInquiry, type FlightInquiry } from '../../services/adminApi';

const TRIP_TYPES = ['One Way', 'Round Trip', 'Multi-City'];
const CABINS = ['Economy', 'First', 'Business', '', 'Premium Economy'];
const STATUSES = ['pending', 'confirmed', 'under-review', 'contacted', 'booked', 'cancelled', 'expired'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  'under-review': 'bg-blue-100 text-blue-800 border-blue-200',
  contacted: 'bg-purple-100 text-purple-800 border-purple-200',
  booked: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  expired: 'bg-gray-100 text-gray-800 border-gray-200'
};

export function AdminInquiryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState<FlightInquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadInquiryDetails(id);
    }
  }, [id]);

  const loadInquiryDetails = async (inquiryId: string) => {
    try {
      setLoading(true);
      const data = await getInquiryDetails(inquiryId);
      setInquiry(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load inquiry details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!inquiry) return;

    try {
      setUpdating(true);
      const updatedInquiry = await updateInquiry(inquiry._id, { status });
      setInquiry(prev => prev ? { ...prev, status } : null);
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading inquiry details...</p>
        </div>
      </div>
    );
  }

  if (error || !inquiry) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Inquiry not found'}</p>
          <button
            onClick={() => navigate('/admin/inquiries')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Inquiries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/inquiries')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inquiries
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inquiry Details</h1>
              <p className="text-gray-600">
                ID: {inquiry.inquiryId || inquiry._id.slice(-6).toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${STATUS_COLORS[inquiry.status] || STATUS_COLORS.pending}`}>
                {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
              </span>
              <select
                value={inquiry.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {STATUSES.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Flight Information
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">From:</span>
                  <span className="text-gray-900 font-medium ml-2">{inquiry.origin}</span>
                </div>
                <div>
                  <span className="text-gray-600">To:</span>
                  <span className="text-gray-900 font-medium ml-2">{inquiry.destination}</span>
                </div>
                <div>
                  <span className="text-gray-600">Departure:</span>
                  <span className="text-gray-900 font-medium ml-2">
                    {inquiry.departDate ? new Date(inquiry.departDate).toLocaleDateString() : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Return:</span>
                  <span className="text-gray-900 font-medium ml-2">
                    {inquiry.returnDate ? new Date(inquiry.returnDate).toLocaleDateString() : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Trip Type:</span>
                  <span className="text-gray-900 font-medium ml-2">
                    {TRIP_TYPES[inquiry.tripType] || 'One Way'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Cabin:</span>
                  <span className="text-gray-900 font-medium ml-2">
                    {CABINS[inquiry.cabin] || 'Economy'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Passengers:</span>
                  <span className="text-gray-900 font-medium ml-2">
                    {inquiry.adults + inquiry.children + inquiry.infants}
                    <span className="text-gray-500 ml-1">
                      (A:{inquiry.adults}, C:{inquiry.children}, I:{inquiry.infants})
                    </span>
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900 font-medium ml-2">
                    {new Date(inquiry.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            {inquiry.passengers && inquiry.passengers.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Passenger Details
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-medium text-gray-900">#</th>
                        <th className="text-left py-2 font-medium text-gray-900">First Name</th>
                        <th className="text-left py-2 font-medium text-gray-900">Middle Name</th>
                        <th className="text-left py-2 font-medium text-gray-900">Last Name</th>
                        <th className="text-left py-2 font-medium text-gray-900">Gender</th>
                        <th className="text-left py-2 font-medium text-gray-900">Date of Birth</th>
                        <th className="text-left py-2 font-medium text-gray-900">Passport</th>
                        <th className="text-left py-2 font-medium text-gray-900">Meal</th>
                        <th className="text-left py-2 font-medium text-gray-900">Seat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiry.passengers.map((passenger, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3">{index + 1}</td>
                          <td className="py-3">{passenger.firstName}</td>
                          <td className="py-3">{passenger.middleName || '-'}</td>
                          <td className="py-3">{passenger.lastName}</td>
                          <td className="py-3">{passenger.gender}</td>
                          <td className="py-3">
                            {passenger.dateOfBirth ? 
                              `${passenger.dateOfBirth.day}/${passenger.dateOfBirth.month}/${passenger.dateOfBirth.year}` : 
                              '-'
                            }
                          </td>
                          <td className="py-3">{passenger.passportNumber || '-'}</td>
                          <td className="py-3">{passenger.mealPreference || '-'}</td>
                          <td className="py-3">{passenger.seatPreference || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payment Information */}
            {inquiry.paymentInfo && Object.keys(inquiry.paymentInfo).length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Payment Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card Details */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Card Details</h3>
                    <div className="space-y-3 text-sm">
                      {inquiry.paymentInfo.cardNumber && (
                        <div>
                          <span className="text-gray-600">Card Number:</span>
                          <span className="text-gray-900 font-medium ml-2">
                            ****-****-****-{inquiry.paymentInfo.cardNumber.slice(-4)}
                          </span>
                        </div>
                      )}
                      {inquiry.paymentInfo.cardHolderName && (
                        <div>
                          <span className="text-gray-600">Name on Card:</span>
                          <span className="text-gray-900 font-medium ml-2">{inquiry.paymentInfo.cardHolderName}</span>
                        </div>
                      )}
                      {inquiry.paymentInfo.expiryDate && (
                        <div>
                          <span className="text-gray-600">Expiry Date:</span>
                          <span className="text-gray-900 font-medium ml-2">{inquiry.paymentInfo.expiryDate}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">CVV:</span>
                        <span className="text-gray-900 font-medium ml-2">***</span>
                      </div>
                    </div>
                  </div>

                  {/* Billing Details */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Billing Details</h3>
                    <div className="space-y-3 text-sm">
                      {inquiry.paymentInfo.billingPhone && (
                        <div>
                          <span className="text-gray-600">Phone:</span>
                          <span className="text-gray-900 font-medium ml-2">{inquiry.paymentInfo.billingPhone}</span>
                        </div>
                      )}
                      {inquiry.paymentInfo.billingAddress && (
                        <div>
                          <span className="text-gray-600">Address:</span>
                          <span className="text-gray-900 font-medium ml-2">{inquiry.paymentInfo.billingAddress}</span>
                        </div>
                      )}
                      {inquiry.paymentInfo.city && (
                        <div>
                          <span className="text-gray-600">City:</span>
                          <span className="text-gray-900 font-medium ml-2">{inquiry.paymentInfo.city}</span>
                        </div>
                      )}
                      {inquiry.paymentInfo.state && (
                        <div>
                          <span className="text-gray-600">State:</span>
                          <span className="text-gray-900 font-medium ml-2">{inquiry.paymentInfo.state}</span>
                        </div>
                      )}
                      {inquiry.paymentInfo.country && (
                        <div>
                          <span className="text-gray-600">Country:</span>
                          <span className="text-gray-900 font-medium ml-2">{inquiry.paymentInfo.country}</span>
                        </div>
                      )}
                      {inquiry.paymentInfo.postalCode && (
                        <div>
                          <span className="text-gray-600">Postal Code:</span>
                          <span className="text-gray-900 font-medium ml-2">{inquiry.paymentInfo.postalCode}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact & Actions */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                Contact Information
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="text-gray-600">Email</div>
                    <a 
                      href={`mailto:${inquiry.passengerEmail}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {inquiry.passengerEmail}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="text-gray-600">Phone</div>
                    <a 
                      href={`tel:${inquiry.passengerPhone}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {inquiry.passengerPhone}
                    </a>
                  </div>
                </div>
                {inquiry.contactInfo && (
                  <>
                    {inquiry.contactInfo.email && inquiry.contactInfo.email !== inquiry.passengerEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-600" />
                        <div>
                          <div className="text-gray-600">Alt Email</div>
                          <a 
                            href={`mailto:${inquiry.contactInfo.email}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {inquiry.contactInfo.email}
                          </a>
                        </div>
                      </div>
                    )}
                    {inquiry.contactInfo.phoneNumber && inquiry.contactInfo.phoneNumber !== inquiry.passengerPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-600" />
                        <div>
                          <div className="text-gray-600">Alt Phone</div>
                          <span className="text-gray-900 font-medium">
                            {inquiry.contactInfo.countryCode} {inquiry.contactInfo.phoneNumber}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Send Email
                </button>
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Call Customer
                </button>
                <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                  Add Note
                </button>
                <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Generate Quote
                </button>
              </div>
            </div>

            {/* Inquiry Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Inquiry Stats</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Source:</span>
                  <span className="text-gray-900 font-medium">{inquiry.source || 'Website'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority:</span>
                  <span className={`font-medium ${inquiry.priority === 'high' || inquiry.priority === 'urgent' ? 'text-red-600' : 'text-gray-900'}`}>
                    {inquiry.priority || 'Normal'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="text-gray-900 font-medium">
                    {inquiry.updatedAt ? new Date(inquiry.updatedAt).toLocaleDateString() : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}