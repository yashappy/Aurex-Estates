"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("../middleware/auth");
const db_1 = require("../db");
exports.uploadRouter = (0, express_1.Router)();
// Ensure upload directory exists
const UPLOAD_DIR = path_1.default.resolve(__dirname, '../../uploads');
if (!fs_1.default.existsSync(UPLOAD_DIR)) {
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
}
// Multer storage engine
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const base = path_1.default.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        cb(null, `${base}-${uniqueSuffix}${ext}`);
    },
});
// File filter (images & PDFs)
const fileFilter = (_req, file, cb) => {
    const allowedMime = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/svg+xml',
        'application/pdf',
    ];
    if (allowedMime.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, SVG, and PDF files are allowed.'));
    }
};
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15MB limit
    },
    fileFilter,
});
// POST /api/upload - Single file upload (Protected)
exports.uploadRouter.post('/', auth_1.requireAdmin, upload.single('file'), async (req, res) => {
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
        const mediaItem = await db_1.prisma.mediaItem.create({
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'File upload failed',
            error: error?.message,
        });
    }
});
// GET /api/upload - Get all uploaded media items (Protected)
exports.uploadRouter.get('/', auth_1.requireAdmin, async (_req, res) => {
    try {
        const media = await db_1.prisma.mediaItem.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return res.json({
            success: true,
            count: media.length,
            data: media,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to list media items',
            error: error?.message,
        });
    }
});
