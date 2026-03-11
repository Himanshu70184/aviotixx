import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

// Use the same JWT_SECRET as the auth middleware
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-change-in-production';

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const admin = await AdminUser.findOne({ email: email.toLowerCase().trim(), isActive: true });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        sub: admin._id.toString(),
        email: admin.email,
        role: admin.role,
      },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    admin.lastLoginAt = new Date();
    await admin.save();

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

router.get('/me', authenticateAdmin, async (req, res) => {
  const admin = await AdminUser.findById(req.admin?.sub).select('_id email name role isActive');

  if (!admin || !admin.isActive) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  return res.json({ success: true, data: admin });
});

export default router;
