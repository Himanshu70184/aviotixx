import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer to use memory storage (we'll process with sharp before saving)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|webp/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  },
});

// Unified image upload endpoint with compression
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}.webp`;
    const uploadsDir = path.join(__dirname, '../uploads');
    const filepath = path.join(uploadsDir, filename);
    
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Compress and convert image to WebP format
    await sharp(req.file.buffer)
      .resize(1200, 1200, { // Max dimensions
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 }) // Compress to WebP with 80% quality
      .toFile(filepath);
    
    const imageUrl = `/uploads/${filename}`;
    res.status(200).json({ success: true, data: { imageUrl } });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
});

export default router;
