import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Loader2, Mail, Phone, Plane, Search, Eye, Trash2, Filter } from 'lucide-react';
import { getInquiries, updateInquiry, deleteInquiry, type FlightInquiry } from '../../services/adminApi';

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

interface FilterState {
  inquiryId: string;
  from: string;
  to: string;
  tripType: string;
  cabinType: string;
  departureDate: string;
  returnDate: string;
  email: string;
  mobile: string;
}

export function AdminInquiriesPage() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<FlightInquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<FlightInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    inquiryId: '',
    from: '',
    to: '',
    tripType: '',
    cabinType: '',
    departureDate: '',
    returnDate: '',
    email: '',
    mobile: ''
  });

  useEffect(() => {
    loadInquiries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [inquiries, filters]);

  const loadInquiries = async () => {
    try {
      const data = await getInquiries();
      setInquiries(data);
    } catch {
      setError('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...inquiries];

    if (filters.inquiryId) {
      filtered = filtered.filter(inq => 
        inq.inquiryId?.toLowerCase().includes(filters.inquiryId.toLowerCase()) ||
        inq._id.toLowerCase().includes(filters.inquiryId.toLowerCase())
      );
    }
    if (filters.from) {
      filtered = filtered.filter(inq => 
        inq.origin.toLowerCase().includes(filters.from.toLowerCase())
      );
    }
    if (filters.to) {
      filtered = filtered.filter(inq => 
        inq.destination.toLowerCase().includes(filters.to.toLowerCase())
      );
    }
    if (filters.tripType) {
      filtered = filtered.filter(inq => inq.tripType === parseInt(filters.tripType));
    }
    if (filters.cabinType) {
      filtered = filtered.filter(inq => inq.cabin === parseInt(filters.cabinType));
    }
    if (filters.departureDate) {
      filtered = filtered.filter(inq => 
        inq.departDate && new Date(inq.departDate).toISOString().split('T')[0] === filters.departureDate
      );
    }
    if (filters.returnDate) {
      filtered = filtered.filter(inq => 
        inq.returnDate && new Date(inq.returnDate).toISOString().split('T')[0] === filters.returnDate
      );
    }
    if (filters.email) {
      filtered = filtered.filter(inq => 
        inq.passengerEmail.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    if (filters.mobile) {
      filtered = filtered.filter(inq => 
        inq.passengerPhone.includes(filters.mobile)
      );
    }

    setFilteredInquiries(filtered);
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      inquiryId: '',
      from: '',
      to: '',
      tripType: '',
      cabinType: '',
      departureDate: '',
      returnDate: '',
      email: '',
      mobile: ''
    });
  };

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const updated = await updateInquiry(id, { status });
      setInquiries(prev => prev.map(inq => inq._id === id ? { ...inq, status } : inq));
    } catch {
      alert('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    
    setDeleting(id);
    try {
      await deleteInquiry(id);
      setInquiries(prev => prev.filter(inq => inq._id !== id));
    } catch {
      alert('Failed to delete inquiry');
    } finally {
      setDeleting(null);
    }
  };

  const handleView = (inquiry: FlightInquiry) => {
    navigate(`/admin/inquiries/${inquiry._id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <span>Home</span>
            <span>/</span>
            <span>Inquiries</span>
            <span>/</span>
            <span className="text-blue-600">List</span>
          </div>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Inquiries</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Row 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unique ID</label>
              <input
                type="text"
                value={filters.inquiryId}
                onChange={(e) => handleFilterChange('inquiryId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="text"
                value={filters.from}
                onChange={(e) => handleFilterChange('from', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Amritsar (ASR), India"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="text"
                value={filters.to}
                onChange={(e) => handleFilterChange('to', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Mumbai (BOM), India"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
              <select
                value={filters.tripType}
                onChange={(e) => handleFilterChange('tripType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Trip</option>
                <option value="0">One Way</option>
                <option value="1">Round Trip</option>
                <option value="2">Multi City</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cabin Type</label>
              <select
                value={filters.cabinType}
                onChange={(e) => handleFilterChange('cabinType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Cabin</option>
                <option value="0">Economy</option>
                <option value="1">First</option>
                <option value="2">Business</option>
                <option value="4">Premium Economy</option>
              </select>
            </div>

            {/* Row 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
              <input
                type="date"
                value={filters.departureDate}
                onChange={(e) => handleFilterChange('departureDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
              <input
                type="date"
                value={filters.returnDate}
                onChange={(e) => handleFilterChange('returnDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={filters.email}
                onChange={(e) => handleFilterChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
              <input
                type="text"
                value={filters.mobile}
                onChange={(e) => handleFilterChange('mobile', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Mobile"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={applyFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {/* Inquiries Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">No inquiries found.</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                <div className="col-span-1">S.No</div>
                <div className="col-span-1">ID</div>
                <div className="col-span-1">From</div>
                <div className="col-span-1">To</div>
                <div className="col-span-1">Departure</div>
                <div className="col-span-1">Return</div>
                <div className="col-span-1">Trip Type</div>
                <div className="col-span-1">Cabin</div>
                <div className="col-span-1">Travellers</div>
                <div className="col-span-1">Created</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredInquiries.map((inquiry, index) => (
                <div
                  key={inquiry._id}
                  className={`px-6 py-4 hover:bg-gray-50 ${
                    inquiry.status === 'confirmed'
                      ? 'bg-green-50'
                      : (index % 2 === 0 ? 'bg-gray-50' : 'bg-white')
                  }`}
                >
                  <div className="grid grid-cols-12 gap-4 text-sm items-center">
                    <div className="col-span-1 font-medium text-gray-900">{index + 1}</div>
                    <div className="col-span-1 font-medium text-blue-600">
                      {/* Truncate ID with ellipsis and show tooltip */}
                      <span title={inquiry.inquiryId || inquiry._id} style={{ cursor: 'pointer' }}>
                        {(inquiry.inquiryId || inquiry._id).length > 10
                          ? (inquiry.inquiryId || inquiry._id).slice(0, 10) + '...'
                          : (inquiry.inquiryId || inquiry._id)}
                      </span>
                    </div>
                    <div className="col-span-1 text-gray-900">
                      {inquiry.origin}
                    </div>
                    <div className="col-span-1 text-gray-900">
                      {inquiry.destination}
                    </div>
                    <div className="col-span-1 text-gray-600">
                      {inquiry.departDate ? new Date(inquiry.departDate).toLocaleDateString('en-GB') : '-'}
                    </div>
                    <div className="col-span-1 text-gray-600">
                      {inquiry.returnDate ? new Date(inquiry.returnDate).toLocaleDateString('en-GB') : '-'}
                    </div>
                    <div className="col-span-1 text-gray-900">
                      {TRIP_TYPES[inquiry.tripType] || 'One Way'}
                    </div>
                    <div className="col-span-1 text-gray-900">
                      {CABINS[inquiry.cabin] || 'Economy'}
                    </div>
                    <div className="col-span-1 text-gray-900">
                      {inquiry.adults + inquiry.children + inquiry.infants}
                    </div>
                    <div className="col-span-1 text-gray-600">
                      {new Date(inquiry.createdAt).toLocaleDateString('en-GB')} {new Date(inquiry.createdAt).toLocaleTimeString('en-GB', { hour12: false })}
                    </div>
                    <div className="col-span-1">
                      {updating === inquiry._id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      ) : (
                        inquiry.status === 'pending' ? (
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-md border cursor-pointer ${STATUS_COLORS[inquiry.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
                            title="Click to confirm"
                            onClick={() => handleStatusChange(inquiry._id, 'confirmed')}
                          >
                            Pending
                          </span>
                        ) : (
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-md border ${STATUS_COLORS[inquiry.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                            {inquiry.status === 'confirmed' ? 'Confirmed' :
                              inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                          </span>
                        )
                      )}
                    </div>
                    <div className="col-span-1 flex items-center gap-2">
                      <button
                        onClick={() => handleView(inquiry)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(inquiry._id)}
                        disabled={deleting === inquiry._id}
                        className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                        title="Delete Inquiry"
                      >
                        {deleting === inquiry._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
