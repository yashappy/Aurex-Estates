"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config();
const auth_1 = require("./routes/auth");
const projects_1 = require("./routes/projects");
const leads_1 = require("./routes/leads");
const blogs_1 = require("./routes/blogs");
const upload_1 = require("./routes/upload");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Allowed CORS origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://127.0.0.1:5173',
    'https://aurexestates.co.in',
    'https://www.aurexestates.co.in',
    'https://admin.aurexestates.co.in',
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin) ||
            origin.endsWith('.aurexestates.co.in') ||
            origin.includes('localhost')) {
            return callback(null, true);
        }
        return callback(null, true); // Permissive in dev/production with explicit headers
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Serve static uploads
const uploadsPath = path_1.default.resolve(__dirname, '../uploads');
app.use('/uploads', express_1.default.static(uploadsPath));
// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'Aurex Estates Backend API',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});
// Mount API routes
app.use('/api/auth', auth_1.authRouter);
app.use('/api/projects', projects_1.projectsRouter);
app.use('/api/leads', leads_1.leadsRouter);
app.use('/api/blogs', blogs_1.blogsRouter);
app.use('/api/upload', upload_1.uploadRouter);
// Root fallback info
app.get('/', (_req, res) => {
    res.json({
        name: 'Aurex Estates Core API Service',
        version: '1.0.0',
        documentation: '/api/health',
        status: 'active',
    });
});
// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
    });
});
// Global error handler
app.use((err, _req, res, _next) => {
    console.error('[Backend Error]:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
});
// Start listener
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`[Aurex Backend] Server running on port ${PORT}`);
        console.log(`[Aurex Backend] Health check: http://localhost:${PORT}/api/health`);
    });
}
exports.default = app;
