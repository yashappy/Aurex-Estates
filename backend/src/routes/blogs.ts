import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { requireAdmin } from '../middleware/auth';

export const blogsRouter = Router();

// GET /api/blogs - Public: List all blog posts
blogsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    const where: any = {};
    if (category && typeof category === 'string' && category !== 'all') {
      where.category = category;
    }

    const blogs = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error?.message,
    });
  }
});

// GET /api/blogs/:id - Public: Get single blog post
blogsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const blog = await prisma.blogPost.findUnique({
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
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blog post',
      error: error?.message,
    });
  }
});

// POST /api/blogs - Protected: Create blog post
blogsRouter.post('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.title || !body.content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required.',
      });
    }

    const id = body.id || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const blog = await prisma.blogPost.create({
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
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create blog post',
      error: error?.message,
    });
  }
});

// PUT /api/blogs/:id - Protected: Update blog post
blogsRouter.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updated = await prisma.blogPost.update({
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
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update blog post',
      error: error?.message,
    });
  }
});

// DELETE /api/blogs/:id - Protected: Delete blog post
blogsRouter.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.blogPost.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete blog post',
      error: error?.message,
    });
  }
});
