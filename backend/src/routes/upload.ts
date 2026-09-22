import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAdmin } from '../middleware/auth';
import { prisma } from '../db';

export const uploadRouter = Router();

// Ensure upload directory exists
const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer storage engine
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${base}-${uniqueSuffix}${ext}`);
  },
});

// File filter (images & PDFs)
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMime = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
  ];

  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, SVG, and PDF files are allowed.'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
  fileFilter,
});

// POST /api/upload - Single file upload (Protected)
uploadRouter.post(
  '/',
  requireAdmin,
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      const isPdf = req.file.mimetype === 'application/pdf';
      const sizeStr = `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`;

      // Record in MediaItem table for CMS gallery tracking
      const mediaItem = await prisma.mediaItem.create({
        data: {
          name: req.file.originalname,
          type: isPdf ? 'pdf' : 'image',
          url: fileUrl,
          size: sizeStr,
        },
      });

      return res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          id: mediaItem.id,
          name: mediaItem.name,
          url: fileUrl,
          type: mediaItem.type,
          size: mediaItem.size,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'File upload failed',
        error: error?.message,
      });
    }
  }
);

// GET /api/upload - Get all uploaded media items (Protected)
uploadRouter.get('/', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const media = await prisma.mediaItem.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      count: media.length,
      data: media,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to list media items',
      error: error?.message,
    });
  }
});
