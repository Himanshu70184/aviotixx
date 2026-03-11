import { createBrowserRouter, Navigate } from 'react-router';
import { LandingPage } from './App';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { InquiryPage } from './pages/InquiryPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminBlogsPage } from './pages/admin/AdminBlogsPage';
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage';
import { AdminFaqsPage } from './pages/admin/AdminFaqsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminInquiriesPage } from './pages/admin/AdminInquiriesPage';
import { RequireAuth } from './components/admin/RequireAuth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/search-results',
    element: <SearchResultsPage />,
  },
  {
    path: '/inquiry',
    element: <InquiryPage />,
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: <RequireAuth><AdminLayout /></RequireAuth>,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'blogs', element: <AdminBlogsPage /> },
      { path: 'testimonials', element: <AdminTestimonialsPage /> },
      { path: 'faqs', element: <AdminFaqsPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
      { path: 'inquiries', element: <AdminInquiriesPage /> },
    ],
  },
  {
    path: '/admin/*',
    element: <Navigate to="/admin" replace />,
  },
]);