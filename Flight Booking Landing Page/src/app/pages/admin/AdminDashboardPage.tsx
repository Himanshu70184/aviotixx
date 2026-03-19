import { useEffect, useState } from 'react';
import { FileText, MessageSquare, HelpCircle, Send, TrendingUp, Phone, Clock } from 'lucide-react';
import { getBlogs, getTestimonials, getFaqs, getInquiries, getSettings } from '../../services/adminApi';

export function AdminDashboardPage() {
  const [stats, setStats] = useState({ blogs: 0, testimonials: 0, faqs: 0, inquiries: 0, pending: 0, confirmed: 0 });
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getBlogs(), getTestimonials(), getFaqs(), getInquiries(), getSettings()
    ]).then(([blogs, testimonials, faqs, inquiries, settings]) => {
      let total = 0, pending = 0, confirmed = 0;
      if (inquiries.status === 'fulfilled') {
        total = inquiries.value.length;
        pending = inquiries.value.filter((inq: any) => inq.status === 'pending').length;
        confirmed = inquiries.value.filter((inq: any) => inq.status === 'confirmed').length;
      }
      setStats({
        blogs: blogs.status === 'fulfilled' ? blogs.value.length : 0,
        testimonials: testimonials.status === 'fulfilled' ? testimonials.value.length : 0,
        faqs: faqs.status === 'fulfilled' ? faqs.value.length : 0,
        inquiries: total,
        pending,
        confirmed
      });
      if (settings.status === 'fulfilled') {
        setPhone(settings.value.contact?.phoneDisplay || '');
      }
      setLoading(false);
    });
  }, []);



  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your Aviotixx content</p>
      </div>


      {/* Booking Details - Main Focus */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
          <h2 className="text-2xl font-bold text-gray-800">Flight Booking Overview</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Total Inquiries Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center shadow-lg">
                <Send className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-blue-600 bg-blue-200 px-2 py-1 rounded-full font-medium">Total</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {loading ? <div className="h-8 w-16 bg-blue-200 rounded animate-pulse" /> : stats.inquiries}
            </div>
            <p className="text-blue-700 font-medium">Flight Inquiries</p>
          </div>

          {/* Pending Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-6 border border-amber-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-500 w-12 h-12 rounded-lg flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-amber-600 bg-amber-200 px-2 py-1 rounded-full font-medium">Pending</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {loading ? <div className="h-8 w-16 bg-amber-200 rounded animate-pulse" /> : stats.pending}
            </div>
            <p className="text-amber-700 font-medium">Awaiting Review</p>
          </div>

          {/* Confirmed Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-6 border border-emerald-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-500 w-12 h-12 rounded-lg flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-emerald-600 bg-emerald-200 px-2 py-1 rounded-full font-medium">Confirmed</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {loading ? <div className="h-8 w-16 bg-emerald-200 rounded animate-pulse" /> : stats.confirmed}
            </div>
            <p className="text-emerald-700 font-medium">Bookings Ready</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Inquiry Status</h3>
            <span className="text-xs text-gray-500">
              {stats.inquiries > 0 ? Math.round((stats.confirmed / stats.inquiries) * 100) : 0}% Confirmed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: stats.inquiries > 0 ? `${(stats.confirmed / stats.inquiries) * 100}%` : '0%' 
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>0</span>
            <span>{stats.inquiries} Total</span>
          </div>
        </div>
      </div>

      {/* Site Details - Less Prominent */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-400 mb-3">Site Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500 w-8 h-8 rounded flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">{loading ? <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" /> : stats.blogs}</span>
            </div>
            <p className="text-xs text-gray-500">Blog Posts</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-500 w-8 h-8 rounded flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">{loading ? <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" /> : stats.testimonials}</span>
            </div>
            <p className="text-xs text-gray-500">Testimonials</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-500 w-8 h-8 rounded flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">{loading ? <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" /> : stats.faqs}</span>
            </div>
            <p className="text-xs text-gray-500">FAQs</p>
          </div>
        </div>
      </div>

      {/* Phone Number Quick Info */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#FF6B35] w-10 h-10 rounded-lg flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Public Phone Number</p>
            <p className="text-lg font-bold text-[#1E3A8A]">
              {loading ? '...' : phone || 'Not set'}
            </p>
          </div>
          <a href="/admin/settings" className="ml-auto text-xs text-blue-600 hover:underline">Edit →</a>
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/admin/blogs', label: 'Add Blog Post', color: 'text-blue-600 bg-blue-50' },
            { href: '/admin/testimonials', label: 'Add Testimonial', color: 'text-green-600 bg-green-50' },
            { href: '/admin/faqs', label: 'Add FAQ', color: 'text-purple-600 bg-purple-50' },
            { href: '/admin/settings', label: 'Update Phone', color: 'text-orange-600 bg-orange-50' },
          ].map(({ href, label, color }) => (
            <a
              key={href}
              href={href}
              className={`${color} rounded-lg px-4 py-3 text-sm font-medium text-center hover:opacity-80 transition-opacity`}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
