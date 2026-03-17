// CMS Content Service - Fetches dynamic content from backend
import { getPublicContent, type CMSContent } from './backendApi';

// Cache for CMS content
let contentCache: CMSContent | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get all CMS content (blogs, testimonials, FAQs, settings)
 * Uses caching to reduce API calls
 */
export async function getCMSContent(forceRefresh = false): Promise<CMSContent | null> {
  const now = Date.now();
  
  // Return cached content if available and not expired
  if (!forceRefresh && contentCache && (now - lastFetchTime) < CACHE_DURATION) {

    return contentCache;
  }

  try {
    const response = await getPublicContent();
    
    if (response.success && response.data) {
      contentCache = response.data;
      lastFetchTime = now;
      return response.data;
    }
    
    // If fetch fails but we have cached content, return it
    if (contentCache) {
      console.warn('⚠️ CMS fetch failed, using stale cache');
      return contentCache;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Failed to fetch CMS content:', error);
    
    // Return cached content if available, even if stale
    if (contentCache) {
      console.warn('⚠️ Using stale cached content due to error');
      return contentCache;
    }
    
    return null;
  }
}

/**
 * Get active blogs sorted by order
 */
export async function getBlogs() {
  const content = await getCMSContent();
  if (!content?.blogs) return [];
  
  return content.blogs
    .filter(blog => blog.isActive)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get active testimonials sorted by order
 */
export async function getTestimonials() {
  const content = await getCMSContent();
  if (!content?.testimonials) return [];
  
  return content.testimonials
    .filter(testimonial => testimonial.isActive)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get active FAQs sorted by order
 */
export async function getFAQs() {
  const content = await getCMSContent();
  if (!content?.faqs) return [];
  
  return content.faqs
    .filter(faq => faq.isActive)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get SEO settings
 */
export async function getSEOSettings() {
  const content = await getCMSContent();
  return content?.seo || {
    title: 'Aviotixx - Cheap Flights to India',
    description: 'Book affordable flights from USA to India with exclusive phone-only deals',
    keywords: 'flights to india, cheap flights, usa to india',
  };
}

/**
 * Get contact information
 */
export async function getContactInfo() {
  const content = await getCMSContent();
  return content?.contact || {
    phoneDisplay: '1-800-AVIOTIXX',
    phoneTel: '+18002846849',
    email: 'support@aviotixx.com',
    address: 'New York, USA',
  };
}

/**
 * Clear the content cache
 */
export function clearCache() {
  contentCache = null;
  lastFetchTime = 0;
}
