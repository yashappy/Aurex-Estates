"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middleware/auth");
exports.authRouter = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'aurex_super_secret_jwt_key_change_in_production';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Aurex@2026';
// POST /api/auth/login
exports.authRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required.',
            });
        }
        if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            const token = jsonwebtoken_1.default.sign({ username: ADMIN_USERNAME, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
            return res.json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    username: ADMIN_USERNAME,
                    role: 'admin',
                },
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Invalid username or password.',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authentication error',
            error: error?.message,
        });
    }
});
// GET /api/auth/verify
exports.authRouter.get('/verify', auth_1.requireAdmin, (req, res) => {
    return res.json({
        success: true,
        user: req.user,
    });
});
