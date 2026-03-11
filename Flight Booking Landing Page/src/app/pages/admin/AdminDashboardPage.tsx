import { useEffect, useState } from 'react';
import { FileText, MessageSquare, HelpCircle, Send, TrendingUp, Phone } from 'lucide-react';
import { getBlogs, getTestimonials, getFaqs, getInquiries, getSettings } from '../../services/adminApi';

export function AdminDashboardPage() {
  const [stats, setStats] = useState({ blogs: 0, testimonials: 0, faqs: 0, inquiries: 0 });
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getBlogs(), getTestimonials(), getFaqs(), getInquiries(), getSettings()
    ]).then(([blogs, testimonials, faqs, inquiries, settings]) => {
      setStats({
        blogs: blogs.status === 'fulfilled' ? blogs.value.length : 0,
        testimonials: testimonials.status === 'fulfilled' ? testimonials.value.length : 0,
        faqs: faqs.status === 'fulfilled' ? faqs.value.length : 0,
        inquiries: inquiries.status === 'fulfilled' ? inquiries.value.length : 0,
      });
      if (settings.status === 'fulfilled') {
        setPhone(settings.value.contact?.phoneDisplay || '');
      }
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: 'Blog Posts', value: stats.blogs, icon: FileText, color: 'bg-blue-500' },
    { label: 'Testimonials', value: stats.testimonials, icon: MessageSquare, color: 'bg-green-500' },
    { label: 'FAQs', value: stats.faqs, icon: HelpCircle, color: 'bg-purple-500' },
    { label: 'Inquiries', value: stats.inquiries, icon: Send, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your Aviotixx content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`${color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-300" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" /> : value}
            </div>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
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
