import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDatabase } from './config/db.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { authenticateAdmin } from './middleware/auth.js';
import { Blog } from './models/Blog.js';
import { Testimonial } from './models/Testimonial.js';
import { Faq } from './models/Faq.js';
import { SiteSetting } from './models/SiteSetting.js';
import { AdminUser } from './models/AdminUser.js';
import { defaultBlogs, defaultFaqs, defaultSettings, defaultTestimonials } from './seed/defaultContent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
const allowedOrigins = corsOrigin.split(',').map((origin) => origin.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json({ limit: '10mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Debug logging middleware (only enabled in non-production)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    const origin = req.headers.origin || '<no-origin>';
    console.log(`➡️ ${req.method} ${req.originalUrl} - Origin: ${origin}`);
    next();
  });
}

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'CMS server is healthy' });
});

// Debug endpoint to show request origin and headers
app.get('/api/debug', (req, res) => {
  res.json({
    success: true,
    origin: req.headers.origin || null,
    headers: {
      origin: req.headers.origin || null,
      referer: req.headers.referer || null,
      host: req.headers.host || null,
      'user-agent': req.headers['user-agent'] || null,
    },
  });
});

app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', authenticateAdmin, adminRoutes);
app.use('/api/flights', flightRoutes);
import airportRoutes from './routes/airportRoutes.js';
app.use('/api/airports', airportRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api', uploadRoutes);
app.get('/api/server-ip', async (req, res) => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    res.json({
      success: true,
      message: 'Your Railway server public IP (use this for EASEMYTRIP_IP)',
      publicIP: data.ip,
      note: 'This is the IP that external APIs like EaseMyTrip will see',
      internalIP: req.socket.localAddress || 'N/A',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to detect public IP'
    });
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ success: false, message: 'Server error', error: error.message });
});

async function seedIfEmpty() {
  const [blogCount, testimonialCount, faqCount, settingCount] = await Promise.all([
    Blog.countDocuments(),
    Testimonial.countDocuments(),
    Faq.countDocuments(),
    SiteSetting.countDocuments({ singletonKey: 'main' }),
  ]);

  if (blogCount === 0) {
    await Blog.insertMany(defaultBlogs);
  }

  if (testimonialCount === 0) {
    await Testimonial.insertMany(defaultTestimonials);
  }

  if (faqCount === 0) {
    await Faq.insertMany(defaultFaqs);
  }

  if (settingCount === 0) {
    await SiteSetting.create(defaultSettings);
  }

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@aviotixx.com').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const adminName = process.env.ADMIN_NAME || 'Super Admin';

  const existingAdmin = await AdminUser.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await AdminUser.create({
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: 'admin',
      isActive: true,
    });

    console.log(`✅ Seeded admin user: ${adminEmail}`);
  }
}

async function bootstrap() {
  await connectDatabase();
  await seedIfEmpty();

  app.listen(port, () => {
    console.log(`✅ CMS API running on http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
