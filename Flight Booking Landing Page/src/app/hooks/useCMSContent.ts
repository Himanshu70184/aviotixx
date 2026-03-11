// React Hook for CMS Content
import { useState, useEffect } from 'react';
import {
  getCMSContent,
  getBlogs,
  getTestimonials,
  getFAQs,
  getSEOSettings,
  getContactInfo,
} from '../services/cmsService';
import type { CMSContent } from '../services/backendApi';

/**
 * Hook to fetch and manage all CMS content
 */
export function useCMSContent() {
  const [content, setContent] = useState<CMSContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchContent() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCMSContent();
        
        if (mounted) {
          setContent(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load content');
          setLoading(false);
        }
      }
    }

    fetchContent();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    content,
    loading,
    error,
    blogs: content?.blogs || [],
    testimonials: content?.testimonials || [],
    faqs: content?.faqs || [],
    seo: content?.seo,
    contact: content?.contact,
  };
}

/**
 * Hook to fetch only blogs
 */
export function useBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchBlogs() {
      setLoading(true);
      const data = await getBlogs();
      if (mounted) {
        setBlogs(data);
        setLoading(false);
      }
    }

    fetchBlogs();

    return () => {
      mounted = false;
    };
  }, []);

  return { blogs, loading };
}

/**
 * Hook to fetch only testimonials
 */
export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchTestimonials() {
      setLoading(true);
      const data = await getTestimonials();
      if (mounted) {
        setTestimonials(data);
        setLoading(false);
      }
    }

    fetchTestimonials();

    return () => {
      mounted = false;
    };
  }, []);

  return { testimonials, loading };
}

/**
 * Hook to fetch only FAQs
 */
export function useFAQs() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchFAQs() {
      setLoading(true);
      const data = await getFAQs();
      if (mounted) {
        setFaqs(data);
        setLoading(false);
      }
    }

    fetchFAQs();

    return () => {
      mounted = false;
    };
  }, []);

  return { faqs, loading };
}

/**
 * Hook to fetch SEO settings
 */
export function useSEO() {
  const [seo, setSeo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchSEO() {
      setLoading(true);
      const data = await getSEOSettings();
      if (mounted) {
        setSeo(data);
        setLoading(false);
      }
    }

    fetchSEO();

    return () => {
      mounted = false;
    };
  }, []);

  return { seo, loading };
}

/**
 * Hook to fetch contact information
 */
export function useContact() {
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchContact() {
      setLoading(true);
      const data = await getContactInfo();
      if (mounted) {
        setContact(data);
        setLoading(false);
      }
    }

    fetchContact();

    return () => {
      mounted = false;
    };
  }, []);

  return { contact, loading };
}
