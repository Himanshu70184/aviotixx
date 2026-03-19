// Admin API Service - Handles all admin CRUD operations + auth
import { API_CONFIG } from '../config/api';

const BASE = API_CONFIG.baseUrl;

// ── Token helpers ──────────────────────────────────────────────
export const getToken = (): string | null => localStorage.getItem('admin_token');
const setToken = (t: string) => localStorage.setItem('admin_token', t);
export const clearToken = () => localStorage.removeItem('admin_token');

function authHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: authHeaders(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || json.error || `HTTP ${res.status}`);
  return json.data as T;
}

// ── Auth ───────────────────────────────────────────────────────
export async function adminLogin(email: string, password: string): Promise<{ token: string; admin: AdminUser }> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Login failed');
  const { token, user } = json.data;
  setToken(token);
  return { token, admin: user as AdminUser };
}

export async function adminMe(): Promise<AdminUser> {
  return request<AdminUser>('GET', '/auth/me');
}

// ── Types ──────────────────────────────────────────────────────
export interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: string;
}

export interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  slug: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  message: string;
  isActive: boolean;
}

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export interface SiteSettings {
  seo: { title: string; description: string; keywords: string };
  contact: { phoneDisplay: string; phoneTel: string; email: string; address: string };
}

export interface FlightInquiry {
  _id: string;
  inquiryId?: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  tripType: number;
  cabin: number;
  status: string;
  priority?: string;
  source?: string;
  selectedFlight?: { 
    airline?: string; 
    airlineName?: string; 
    price: number; 
    flightNumber?: string;
    details?: any;
  };
  passengers?: Array<{
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: 'Male' | 'Female';
    dateOfBirth?: {
      day: string;
      month: string;
      year: string;
    };
    passportNumber?: string;
    mealPreference?: string;
    seatPreference?: string;
    frequentFlyerNumber?: string;
    wheelchairAssistance?: boolean;
  }>;
  contactInfo?: {
    email: string;
    phoneNumber: string;
    countryCode: string;
  };
  paymentInfo?: {
    cardNumber?: string;
    cardHolderName?: string;
    expiryDate?: string;
    cvv?: string;
    billingPhone?: string;
    billingAddress?: string;
    postalCode?: string;
    country?: string;
    state?: string;
    city?: string;
  };
  brokerNotes?: string;
  brokerAssigned?: string;
  createdAt: string;
  updatedAt?: string;
}

// ── Blogs ──────────────────────────────────────────────────────
export const getBlogs = () => request<Blog[]>('GET', '/admin/blogs');
export const createBlog = (data: Partial<Blog>) => request<Blog>('POST', '/admin/blogs', data);
export const updateBlog = (id: string, data: Partial<Blog>) => request<Blog>('PUT', `/admin/blogs/${id}`, data);
export const deleteBlog = (id: string) => request<void>('DELETE', `/admin/blogs/${id}`);

// ── Testimonials ───────────────────────────────────────────────
export const getTestimonials = () => request<Testimonial[]>('GET', '/admin/testimonials');
export const createTestimonial = (data: Partial<Testimonial>) => request<Testimonial>('POST', '/admin/testimonials', data);
export const updateTestimonial = (id: string, data: Partial<Testimonial>) => request<Testimonial>('PUT', `/admin/testimonials/${id}`, data);
export const deleteTestimonial = (id: string) => request<void>('DELETE', `/admin/testimonials/${id}`);

// ── FAQs ───────────────────────────────────────────────────────
export const getFaqs = () => request<Faq[]>('GET', '/admin/faqs');
export const createFaq = (data: Partial<Faq>) => request<Faq>('POST', '/admin/faqs', data);
export const updateFaq = (id: string, data: Partial<Faq>) => request<Faq>('PUT', `/admin/faqs/${id}`, data);
export const deleteFaq = (id: string) => request<void>('DELETE', `/admin/faqs/${id}`);

// ── Site Settings ──────────────────────────────────────────────
export const getSettings = () => request<SiteSettings>('GET', '/admin/settings');
export const updateSettings = (data: Partial<SiteSettings>) => request<SiteSettings>('PUT', '/admin/settings', data);

// ── Inquiries ──────────────────────────────────────────────────
export const getInquiries = () => request<FlightInquiry[]>('GET', '/inquiries');
export const getInquiryDetails = (id: string) => request<FlightInquiry>('GET', `/inquiries/${id}/admin`);
export const updateInquiry = (id: string, data: { status?: string; brokerNotes?: string }) =>
  request<FlightInquiry>('PUT', `/inquiries/${id}`, data);
export const deleteInquiry = (id: string) => request<void>('DELETE', `/inquiries/${id}`);

// ── Upload ────────────────────────────────────────────────────
export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${BASE}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Upload failed');
  return (json.data?.imageUrl || json.data?.url || json.url) as string;
}
