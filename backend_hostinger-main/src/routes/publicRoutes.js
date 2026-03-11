import { Router } from 'express';
import { Blog } from '../models/Blog.js';
import { Testimonial } from '../models/Testimonial.js';
import { Faq } from '../models/Faq.js';
import { SiteSetting } from '../models/SiteSetting.js';

const router = Router();

router.get('/content', async (_req, res) => {
  try {
    const [blogs, testimonials, faqs, settings] = await Promise.all([
      Blog.find({ isActive: true }).sort({ order: 1, createdAt: -1 }),
      Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 }),
      Faq.find({ isActive: true }).sort({ order: 1, createdAt: -1 }),
      SiteSetting.findOne({ singletonKey: 'main' }),
    ]);

    res.json({
      success: true,
      data: {
        blogs,
        testimonials,
        faqs,
        seo: settings?.seo || {},
        contact: settings?.contact || {},
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load public content', error: error.message });
  }
});

export default router;
