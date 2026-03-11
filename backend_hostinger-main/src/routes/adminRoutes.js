import { Router } from 'express';
import { Blog } from '../models/Blog.js';
import { Testimonial } from '../models/Testimonial.js';
import { Faq } from '../models/Faq.js';
import { SiteSetting } from '../models/SiteSetting.js';

const router = Router();

function buildCrudRoutes(path, Model) {
  router.get(`/${path}`, async (_req, res) => {
    const items = await Model.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  });

  router.post(`/${path}`, async (req, res) => {
    const item = await Model.create(req.body);
    res.status(201).json({ success: true, data: item });
  });

  router.put(`/${path}/:id`, async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: `${path} item not found` });
    res.json({ success: true, data: item });
  });

  router.delete(`/${path}/:id`, async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: `${path} item not found` });
    res.json({ success: true, message: 'Deleted successfully' });
  });
}

buildCrudRoutes('blogs', Blog);
buildCrudRoutes('testimonials', Testimonial);
buildCrudRoutes('faqs', Faq);

router.get('/settings', async (_req, res) => {
  const settings = await SiteSetting.findOne({ singletonKey: 'main' });
  res.json({ success: true, data: settings });
});

router.put('/settings', async (req, res) => {
  const settings = await SiteSetting.findOneAndUpdate(
    { singletonKey: 'main' },
    { ...req.body, singletonKey: 'main' },
    { new: true, upsert: true, runValidators: true }
  );

  res.json({ success: true, data: settings });
});

export default router;
