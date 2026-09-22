"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
exports.blogsRouter = (0, express_1.Router)();
// GET /api/blogs - Public: List all blog posts
exports.blogsRouter.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const where = {};
        if (category && typeof category === 'string' && category !== 'all') {
            where.category = category;
        }
        const blogs = await db_1.prisma.blogPost.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
        return res.json({
            success: true,
            count: blogs.length,
            data: blogs,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch blogs',
            error: error?.message,
        });
    }
});
// GET /api/blogs/:id - Public: Get single blog post
exports.blogsRouter.get('/:id', async (req, res) => {
    try {
        const blog = await db_1.prisma.blogPost.findUnique({
            where: { id: req.params.id },
        });
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found',
            });
        }
        return res.json({
            success: true,
            data: blog,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch blog post',
            error: error?.message,
        });
    }
});
// POST /api/blogs - Protected: Create blog post
exports.blogsRouter.post('/', auth_1.requireAdmin, async (req, res) => {
    try {
        const body = req.body;
        if (!body.title || !body.content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required.',
            });
        }
        const id = body.id || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const blog = await db_1.prisma.blogPost.create({
            data: {
                id,
                title: body.title,
                excerpt: body.excerpt || '',
                category: body.category || 'Market Trends',
                readTime: body.readTime || '5 min read',
                date: body.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                image: body.image || '',
                content: body.content,
                author: body.author || 'Aurex Research Desk',
            },
        });
        return res.status(201).json({
            success: true,
            message: 'Blog post created successfully',
            data: blog,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create blog post',
            error: error?.message,
        });
    }
});
// PUT /api/blogs/:id - Protected: Update blog post
exports.blogsRouter.put('/:id', auth_1.requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const updated = await db_1.prisma.blogPost.update({
            where: { id },
            data: {
                title: body.title,
                excerpt: body.excerpt,
                category: body.category,
                readTime: body.readTime,
                date: body.date,
                image: body.image,
                content: body.content,
                author: body.author,
            },
        });
        return res.json({
            success: true,
            message: 'Blog post updated successfully',
            data: updated,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update blog post',
            error: error?.message,
        });
    }
});
// DELETE /api/blogs/:id - Protected: Delete blog post
exports.blogsRouter.delete('/:id', auth_1.requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.prisma.blogPost.delete({
            where: { id },
        });
        return res.json({
            success: true,
            message: 'Blog post deleted successfully',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete blog post',
            error: error?.message,
        });
    }
});
